package com.hellofood.backend.domain.order;

import java.time.LocalDateTime;

import com.hellofood.backend.domain.order.Order.OrderStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class OrderProcessLog {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    // 1. 어떤 주문의 기록인가? (N:1 관계)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order; 

    // 2. 어떤 상태로 변경되었는가? (INPROGRESS, READY, DELIVERED 등)
    @Enumerated(EnumType.STRING)
    private OrderStatus status; 

    // 3. 누가 변경했는가? (직원 ID 또는 Staff 엔티티와의 관계)
    private Long staffId; 

    // 4. 언제 변경되었는가?
    private LocalDateTime processTime; // java.time.LocalDateTime 사용

    // [선택 사항] 누가 어떤 역할을 했는지 명시적 기록
    private String staffRole; // Kitchen, Delivery

    // ... (Getter, Setter, 생성자)

    protected OrderProcessLog() {}; //JPA용 생성자

    public OrderProcessLog(Order order, OrderStatus status, long staffId, LocalDateTime processTime, String staffRole) {
        this.order = order;
        this.status = status;
        this.staffId = staffId;
        this.processTime = processTime;
        this.staffRole = staffRole;
    }

}