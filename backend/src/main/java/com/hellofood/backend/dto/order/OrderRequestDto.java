package com.hellofood.backend.dto.order;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequestDto {
    private Long customerId;
    private String dinnerType;   // 예: "valentine"
    private String servingStyle; // 예: "grand"
    private String deliveryAddress;
    
    // 주문한 모든 아이템 (기본 포함 + 추가된 것 모두 통합)
    private List<OrderItemDto> items;
    private int quantity;

    @Data
    public static class OrderItemDto {
        private Long menuItemId; // DB의 Menu Item ID
        private int quantity;
    }
}