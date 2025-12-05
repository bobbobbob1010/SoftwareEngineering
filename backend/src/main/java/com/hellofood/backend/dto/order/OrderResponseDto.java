package com.hellofood.backend.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.hellofood.backend.domain.order.Order;
import com.hellofood.backend.domain.order.OrderItem;

import lombok.Data;

@Data
public class OrderResponseDto {
    private Long id;
    private String dinnerName;
    private BigDecimal totalPrice; // 최종 결제 금액 (예: 85.00)
    private String status;
    private String orderTime;
    private String deliveryAddress;
    private BigDecimal discountAmount;  // 할인된 금액 (예: 15.00)
    
    // [추가] 원래 가격 (프론트엔드 표시용)
    private BigDecimal originalPrice;   // (예: 100.00)

    // [추가] 주문자 이름 필드
    private String customerName;

    // [추가] 주문한 아이템 목록
    private List<ItemDto> items;

    // [추가] UI 표시용 가짜 배달원 정보 (DB에 없으므로 임시)
    private String driverName = "John Doe";
    private String driverPhone = "+1-555-0123";
    private String deliveryTime = "30-45 minutes";
    
    private Long kitchenStaffId = null; 
    private LocalDateTime readyTime = null; // LocalDateTime 그대로 프론트엔드로 전달

    //order 객체를 받아 DTO만드는과정
    public OrderResponseDto(Order order) {
        this.id = order.getOrderId();
        this.dinnerName = order.getDinnerType();
        this.totalPrice = order.getTotalPrice();
        this.status = order.getStatus().toString();
        this.orderTime = order.getOrderDate();
        this.deliveryAddress = order.getDeliveryAddress();
        this.totalPrice = order.getTotalPrice();
        
        // [추가] 할인 금액이 null일 경우를 대비해 0으로 처리
        this.discountAmount = order.getDiscountAmount() != null
                ? order.getDiscountAmount()
                : BigDecimal.ZERO;

        // [핵심] 원래 가격 = 최종 가격 + 할인 금액
        this.originalPrice = this.totalPrice.add(this.discountAmount);

        // [핵심] Order 엔티티에서 getCustomer()를 호출하여 Customer 객체에 접근한 뒤, 이름을 가져옵니다.
        // 주의: Customer 클래스에 getName() (또는 이름을 반환하는 메서드)이 있어야 합니다.
        if (order.getCustomer() != null) {
            this.customerName = order.getCustomer().getName();
        } else {
            this.customerName = "알 수 없음"; // 만약의 경우를 대비한 처리
        }

        // [추가] OrderItem 엔티티들을 DTO로 변환하여 리스트에 담기
        this.items = order.getOrderItems().stream()
                .map(ItemDto::new)
                .collect(Collectors.toList());
    }


    public OrderResponseDto(Order order, Long kitchenStaffId, LocalDateTime readyTime) {
        // 기존 생성자를 호출하여 Order 엔티티의 기본 정보를 모두 매핑합니다.
        this(order); 

        // Service에서 계산/추출된 값을 DTO 필드에 직접 대입하여 덮어씁니다.
        this.kitchenStaffId = kitchenStaffId; 
        this.readyTime = readyTime;
    }
    
    // 내부 클래스로 아이템 DTO 정의
    @Data
    public static class ItemDto {
        private String name;
        private BigDecimal price;
        private int qty;

        public ItemDto(OrderItem orderItem) {
            this.name = orderItem.getMenuItem().getName();
            this.price = orderItem.getPriceAtOrder(); // 주문 당시 가격
            this.qty = orderItem.getQuantity();
        }
    }
}