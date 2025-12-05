package com.hellofood.backend.controller;
import com.hellofood.backend.domain.order.Order.OrderStatus;
import com.hellofood.backend.service.StaffOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hellofood.backend.dto.order.OrderResponseDto;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff-orders")
@RequiredArgsConstructor
public class StaffOrderController {

    private final StaffOrderService staffOrderService;

    // 1. 주문 목록 조회 (상태별로 필터링해서 보는 경우가 많음)
    // 예: "지금 들어온 주문(WAITING)"만 보여줘!
    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getOrdersByStatus(
            @RequestParam(required = false) OrderStatus status
    ) {
        return ResponseEntity.ok(staffOrderService.getOrders(status));
    }

    // 2. 상태 변경 (가장 중요)
    // 예: 접수하기(WAITING -> COOKING), 배달보내기(COOKING -> DELIVERING)
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Void> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request
    ) {
        String statusStr = request.get("status");
        Long staffId = Long.parseLong(request.get("staffId")); // 예시
        String staffRole = request.get("staffRole"); // 예시 (KitchenStaff, DeliveryStaff)
        OrderStatus newStatus;
        try {
        newStatus = OrderStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            // 2. 실패하면 우리가 정의한 문자열("in-progress")로 다시 찾아봄 (★ 핵심)
            newStatus = OrderStatus.fromLabel(statusStr);
        }
        
        if (newStatus == null) {
            throw new IllegalArgumentException("잘못된 상태값입니다: " + statusStr);
        }

        staffOrderService.updateStatusAndAudit(orderId, newStatus,staffId,staffRole);
        return ResponseEntity.ok().build();
    }


}