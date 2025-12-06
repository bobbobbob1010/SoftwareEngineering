package com.hellofood.backend.service;

import com.hellofood.backend.domain.order.Order.OrderStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class AccessControlService {

    /**
     * 주문 상태 변경 권한 검증 (Polymorphism 적용)
     * 
     * @param targetStatus 변경하려는 목표 상태
     * @param staff        요청한 직원 객체 (KitchenStaff or DeliveryStaff)
     * @throws AccessDeniedException 권한이 없을 경우
     */
    public void verifyStaffAccess(OrderStatus targetStatus, com.hellofood.backend.domain.user.Staff staff) {
        // "객체에게 물어보라 (Tell, Don't Ask)" - 다형성 활용
        if (!staff.canHandle(targetStatus)) {
            throw new AccessDeniedException("해당 직원은 '" + targetStatus + "' 상태를 처리할 권한이 없습니다.");
        }
    }
}
