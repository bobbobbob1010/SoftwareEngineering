package com.hellofood.backend.service;

import com.hellofood.backend.domain.order.*;
import com.hellofood.backend.domain.user.Customer;
import com.hellofood.backend.domain.user.CustomerTier;
import com.hellofood.backend.domain.user.User;
import com.hellofood.backend.dto.order.OrderRequestDto;
import com.hellofood.backend.dto.order.OrderResponseDto;
import com.hellofood.backend.dto.order.OrderListResponseDto;
import com.hellofood.backend.repository.MenuItemRepository;
import com.hellofood.backend.repository.OrderRepository;
import com.hellofood.backend.repository.CustomerRepository;
import com.hellofood.backend.repository.InventoryRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final MenuItemRepository menuItemRepository;
    private final InventoryService inventoryService;

    // 디너 세트별 기본 가격 (DB에 DinnerSet 엔티티가 따로 없다면 상수로 관리)
    private static final Map<String, BigDecimal> DINNER_BASE_PRICES = Map.of(
        "valentine", new BigDecimal("99.99"),
        "french", new BigDecimal("89.99"),
        "english", new BigDecimal("79.99"),
        "champagne", new BigDecimal("169.99")
    );

    @Transactional
    //OrderRequestDto를 받아 Order을 생성하고 생성된 Order의 orderId를 반환함
    public Long createOrder(OrderRequestDto request) {
        // 1. 고객 조회
        User user = customerRepository.findById(request.getCustomerId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid customer ID"));
        
        // 2. 기본 가격 설정
        BigDecimal basePrice = DINNER_BASE_PRICES.getOrDefault(request.getDinnerType(), BigDecimal.ZERO);
        BigDecimal totalPrice = basePrice;

        // 3. 주문 객체 생성
        Order order = new Order(
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
            request.getDeliveryAddress(),
            0, // request count (임시)
            Order.OrderStatus.PENDING, // 초기 상태
            BigDecimal.ZERO, // 나중에 업데이트
            (Customer) user, // 캐스팅 필요 (설계에 따라 다름)
            request.getDinnerType()
        );

        // 4. OrderItem 생성 및 가격 계산
        for (OrderRequestDto.OrderItemDto itemDto : request.getItems()) {
            if (itemDto.getQuantity() <= 0) continue;

            MenuItem menuItem = menuItemRepository.findById(itemDto.getMenuItemId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid Menu Item ID"));

            // 해당 메뉴를 만들기 위해 필요한 재료들을 Inventory에서 차감합니다.
            inventoryService.deductStock(menuItem, itemDto.getQuantity());

            // 가격 계산 (단가 * 수량)
            
            //현재의 이 아이템이 주문한 세트의 기본구성품인가? 파악하는 로직
            boolean isBaseItem = menuItem.isBaseItem() &&
                                request.getDinnerType().equals(menuItem.getDinnerType());
            
            BigDecimal itemTotal;

            if (isBaseItem) {
                // 기본 포함 메뉴라면: 수량에서 1을 뺀 만큼만 추가 가격 계산
                int extraQuantity = Math.max(0,itemDto.getQuantity() - 1);
                itemTotal = menuItem.getUnitPrice().multiply(BigDecimal.valueOf(extraQuantity));
            } else {
                // 추가 메뉴(Add-on): 단가 * 수량 만큼 추가
                itemTotal = menuItem.getUnitPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            }
            
            totalPrice = totalPrice.add(itemTotal);

            // OrderItem 생성 및 연결
            OrderItem orderItem = new OrderItem(order, menuItem, itemDto.getQuantity(), menuItem.getUnitPrice());
            order.addOrderItem(orderItem);
        }

        // 5. 할인 관련 로직
        
        // A. 고객의 이전 주문 횟수 조회
        int orderCount = orderRepository.countByCustomer((Customer) user);
        
        // B. 등급(Tier) 계산 - ★ 여기서 만들어둔 로직 재사용!
        // (일일이 if문 쓸 필요 없이, 계산기한테 횟수만 던져주면 알아서 등급을 줍니다)
        CustomerTier tier = CustomerTier.calculateTier(orderCount);
        int discountRate = tier.getDiscountRate(); // 등급에서 할인율 꺼내기
        
        // C. 할인 금액 계산: (총 금액 * 할인율) / 100
        BigDecimal discountAmount = totalPrice
                .multiply(BigDecimal.valueOf(discountRate))
                .divide(BigDecimal.valueOf(100));

        // D. 최종 가격 반영: 총 금액 - 할인 금액
        BigDecimal finalPrice = totalPrice.subtract(discountAmount);

        // E. 주문 정보에 저장
        order.setDiscountRate(discountRate);
        order.setDiscountAmount(discountAmount);
        order.setTotalPrice(finalPrice);

        // 6. 주문 저장
        Order savedOrder = orderRepository.save(order);

        return savedOrder.getOrderId(); // 생성된 주문의 ID 반환
    }

    // ChatOOrchestratorService가 호출하는 createOrder
    public Long createOrderFromChat(Long customerId, String menuName, int quantity) {
        
        // 1. 메뉴 조회 (주문 서비스가 직접 함)
        MenuItem menuItem = menuItemRepository.findByName(menuName)
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다: " + menuName));

        // 2. 유저 조회 및 주소 확보
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("고객을 찾을 수 없습니다."));

        // 3. DTO 내부 생성 (이 DTO가 바뀌어도 ChatService는 모름)
        OrderRequestDto request = new OrderRequestDto();
        request.setCustomerId(customerId);
        request.setDeliveryAddress(customer.getAddress()); // 기본 주소 사용
        request.setDinnerType(menuItem.getDinnerType());
        
        OrderRequestDto.OrderItemDto item = new OrderRequestDto.OrderItemDto();
        item.setMenuItemId(menuItem.getId());
        item.setQuantity(quantity);
        
        request.setItems(Collections.singletonList(item));

        // 4. 기존 로직 재활용 (자기 자신의 메서드 호출)
        return this.createOrder(request);
    }

    public List<OrderListResponseDto> getOrders(Long customerId) {
        return orderRepository.findAllByCustomerId(customerId)
        .stream()
        .map(OrderListResponseDto::new)
        .collect(Collectors.toList());
    }

    public void deleteOrder(Long orderId) {
        if(!orderRepository.existsById(orderId)) {
            throw new IllegalArgumentException("Invalid order ID"+orderId);
        }
        orderRepository.deleteById(orderId);
    }

    // 주문 상세 조회
    public OrderResponseDto getOrderDetails(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        return new OrderResponseDto(order);
    }
}