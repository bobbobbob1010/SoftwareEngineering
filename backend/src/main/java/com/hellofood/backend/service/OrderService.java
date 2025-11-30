package com.hellofood.backend.service;

import com.hellofood.backend.domain.order.*;
import com.hellofood.backend.domain.user.Customer;
import com.hellofood.backend.domain.user.User;
import com.hellofood.backend.dto.order.OrderRequestDto;
import com.hellofood.backend.repository.MenuItemRepository;
import com.hellofood.backend.repository.OrderRepository;
import com.hellofood.backend.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final MenuItemRepository menuItemRepository;

    // 디너 세트별 기본 가격 (DB에 DinnerSet 엔티티가 따로 없다면 상수로 관리)
    private static final Map<String, BigDecimal> DINNER_BASE_PRICES = Map.of(
        "valentine", new BigDecimal("99.99"),
        "french", new BigDecimal("89.99"),
        "english", new BigDecimal("79.99"),
        "champagne", new BigDecimal("169.99")
    );

    @Transactional
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
            Order.OrderStatus.CONFIRMED,
            BigDecimal.ZERO, // 나중에 업데이트
            (Customer) user // 캐스팅 필요 (설계에 따라 다름)
        );

        // 4. OrderItem 생성 및 가격 계산
        for (OrderRequestDto.OrderItemDto itemDto : request.getItems()) {
            if (itemDto.getQuantity() <= 0) continue;

            MenuItem menuItem = menuItemRepository.findById(itemDto.getMenuItemId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid Menu Item ID"));

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

        // 5. 총 가격 업데이트 및 저장
        order.setTotalPrice(totalPrice);
        Order savedOrder = orderRepository.save(order);

        return savedOrder.getOrderId(); // 생성된 주문의 ID 반환
    }
}