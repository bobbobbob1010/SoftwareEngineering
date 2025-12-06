package com.hellofood.backend.service;

import com.hellofood.backend.domain.order.*;
import com.hellofood.backend.domain.user.Customer;

import com.hellofood.backend.domain.user.User;
import com.hellofood.backend.dto.order.OrderRequestDto;
import com.hellofood.backend.dto.order.OrderResponseDto;
import com.hellofood.backend.dto.order.OrderListResponseDto;
import com.hellofood.backend.repository.MenuItemRepository;
import com.hellofood.backend.repository.OrderRepository;
import com.hellofood.backend.repository.CustomerRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

        private final OrderRepository orderRepository;
        private final CustomerRepository customerRepository;
        private final MenuItemRepository menuItemRepository;
        private final InventoryService inventoryService;
        private final com.hellofood.backend.repository.StaffRepository staffRepository;
        private final PricingService pricingService;

        @Transactional
        // OrderRequestDto를 받아 Order을 생성하고 생성된 Order의 orderId를 반환함
        public Long createOrder(OrderRequestDto request) {
                // 1. 고객 조회
                User user = customerRepository.findById(request.getCustomerId())
                                .orElseThrow(() -> new IllegalArgumentException("Invalid customer ID"));

                String style = request.getServingStyle() != null ? request.getServingStyle() : "simple";

                // [Constraint] Champagne Feast cannot be ordered in Simple style
                if ("champagne".equalsIgnoreCase(request.getDinnerType()) && "simple".equalsIgnoreCase(style)) {
                        throw new IllegalArgumentException(
                                        "Champagne Feast Dinner cannot be ordered in Simple style. Please choose Grand or Deluxe.");
                }

                // 2. 기본 가격 계산 (PricingService 위임)
                BigDecimal totalPrice = pricingService.calculateBaseOrderPrice(
                                request.getDinnerType(),
                                style,
                                request.getQuantity());

                // 3. 주문 객체 생성
                Order order = new Order(
                                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                                request.getDeliveryAddress(),
                                0, // request count (임시)
                                Order.OrderStatus.PENDING, // 초기 상태
                                BigDecimal.ZERO, // 나중에 업데이트
                                (Customer) user, // 캐스팅 필요 (설계에 따라 다름)
                                request.getDinnerType(),
                                request.getServingStyle());

                // 4. OrderItem 생성 및 가격 계산
                for (OrderRequestDto.OrderItemDto itemDto : request.getItems()) {
                        if (itemDto.getQuantity() <= 0)
                                continue;

                        MenuItem menuItem = menuItemRepository.findById(itemDto.getMenuItemId())
                                        .orElseThrow(() -> new IllegalArgumentException("Invalid Menu Item ID"));

                        // 해당 메뉴를 만들기 위해 필요한 재료들을 Inventory에서 차감합니다.
                        inventoryService.deductStock(menuItem, itemDto.getQuantity());

                        // 가격 계산 (PricingService 위임)
                        BigDecimal itemTotal = pricingService.calculateOrderItemPrice(
                                        menuItem,
                                        request.getDinnerType(),
                                        request.getQuantity(),
                                        itemDto.getQuantity());

                        totalPrice = totalPrice.add(itemTotal);

                        // OrderItem 생성 및 연결
                        OrderItem orderItem = new OrderItem(order, menuItem, itemDto.getQuantity(),
                                        menuItem.getUnitPrice());
                        order.addOrderItem(orderItem);
                }

                // 5. 할인 및 최종 가격 계산 (PricingService 위임)
                int orderCount = orderRepository.countByCustomer((Customer) user);
                PricingService.DiscountResult discountResult = pricingService.calculateDiscount(totalPrice, orderCount);

                // E. 주문 정보에 저장
                order.setDiscountRate(discountResult.discountRate());
                order.setDiscountAmount(discountResult.discountAmount());
                order.setTotalPrice(discountResult.finalPrice());

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
                if (!orderRepository.existsById(orderId)) {
                        throw new IllegalArgumentException("Invalid order ID" + orderId);
                }
                orderRepository.deleteById(orderId);
        }

        // OrderPcoressLog에서 해당 주문의 최신 상태(담당직원, 시각)를 찾는 메소드
        private OrderProcessLog findLatestLogByStatus(List<OrderProcessLog> logs, Order.OrderStatus status) {
                if (logs == null || logs.isEmpty())
                        return null;
                return logs.stream()
                                .filter(log -> log.getStatus() == status)
                                .max((l1, l2) -> l1.getProcessTime().compareTo(l2.getProcessTime()))
                                .orElse(null);
        }

        // 주문 상세 조회
        public OrderResponseDto getOrderDetails(Long orderId) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

                OrderProcessLog readyLog = findLatestLogByStatus(order.getProcessLogs(), Order.OrderStatus.READY);
                OrderProcessLog inProgressLog = findLatestLogByStatus(order.getProcessLogs(),
                                Order.OrderStatus.INPROGRESS);
                OrderProcessLog deliveredLog = findLatestLogByStatus(order.getProcessLogs(),
                                Order.OrderStatus.DELIVERED);

                Long kitchenStaffId = null;
                LocalDateTime readyTime = null;
                String kitchenStaffName = null;

                if (readyLog != null) {
                        kitchenStaffId = readyLog.getStaffId();
                        readyTime = readyLog.getProcessTime();
                } else if (inProgressLog != null) {
                        kitchenStaffId = inProgressLog.getStaffId();
                }

                if (kitchenStaffId != null) {
                        kitchenStaffName = staffRepository.findById(kitchenStaffId)
                                        .map(User::getName)
                                        .orElse("Unknown Staff");
                }

                Long deliveryStaffId = null;
                LocalDateTime actualDeliveryTime = null;
                String deliveryStaffName = null;

                if (deliveredLog != null) {
                        deliveryStaffId = deliveredLog.getStaffId();
                        actualDeliveryTime = deliveredLog.getProcessTime();

                        if (deliveryStaffId != null) {
                                deliveryStaffName = staffRepository.findById(deliveryStaffId)
                                                .map(User::getName)
                                                .orElse("Unknown Delivery Staff");
                        }
                }

                return new OrderResponseDto(order, kitchenStaffId, readyTime, kitchenStaffName, deliveryStaffId,
                                actualDeliveryTime, deliveryStaffName);
        }
}