package com.hellofood.backend.domain.order;
import jakarta.persistence.*; //JPA 패키지 호출
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

// OrderItem.java (주문 상세 항목)
@Entity
@Table(name = "order_items")
@Getter
@Setter
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Order 엔티티와 ManyToOne 관계 (FK: order_id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
    
    // MenuItem 엔티티와 ManyToOne 관계 (FK: menu_item_id)
    // 실제 DB에 저장된 메뉴 항목을 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

    // 주문 시 선택된 수량
    private int quantity;
    
    // 주문 확정 시점의 가격 (가격 변동 방지용)
    private BigDecimal priceAtOrder;

    public OrderItem() {} // JPA용 기본 생성자

    public OrderItem(Order order, MenuItem menuItem, int quantity, BigDecimal priceAtOrder) {
        this.order = order;
        this.menuItem = menuItem;
        this.quantity = quantity;
        this.priceAtOrder = priceAtOrder;
    }
}