package com.hellofood.backend.domain.order;
import com.hellofood.backend.domain.user.Customer;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

    protected Order () {} //JPA용 생성자

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(length = 255)
    private Long orderId;

    @Column(nullable = false)
    private String orderDate;

    @Column(nullable = false)
    private String deliveryAddress;

    @Column(nullable = false)
    private Integer request = 0;

    @Column(nullable = false)
    private String dinnerType;

    @Column(nullable = false) 
    private String servingStyle;

    public enum OrderStatus {
    PENDING("pending"), // 주문 접수: 고객이 주문을 완료한 초기 상태
    INPROGRESS("in-progress"), // 준비 중: 주방 스태프가 요리를 준비하는 중
    READY("ready"), // 준비완료: 요리 준비완료+라이더가 음식을 픽업하여 배달하는 중
    DELIVERED("delivered"), // 배달 완료: 고객에게 최종 전달됨
    CANCELLED("cancelled"); // 주문 취소: 고객 또는 시스템에 의해 취소됨
    
    // 2. 문자열을 저장할 필드 선언
    private final String label;

    // 3. 생성자 (Enum 생성 시 자동으로 호출됨)
    OrderStatus(String label) {
        this.label = label;
    }
    
    // 4. 문자열(in-progress)로 Enum(PREPARING)을 찾는 메서드 추가 (필살기)
        public static OrderStatus fromLabel(String text) {
            for (OrderStatus status : OrderStatus.values()) {
                // "in-progress" 와 들어온 텍스트가 같으면 -> PREPARING 리턴
                if (status.label.equalsIgnoreCase(text)) {
                    return status;
                }
            }
            // 못 찾으면 기본값 리턴 (혹은 에러)
            return null;
        }
    }
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice; // 할인 후 최종 결제 금액

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    //적용된 할인율 (예: 15 퍼센트)
    @Column(nullable = false)
    private Integer discountRate = 0;
    
    // OrderItem 목록 추가 및 양방향 관계 설정
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>(); // import java.util.List, java.util.ArrayList

    // Customer과의 관계 설정
    @ManyToOne(fetch = FetchType.LAZY)
    // orders 테이블에 "customer_id" 라는 외래키 컬럼을 생성해 orders 테이블과 연결
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer; //  Customer.java의 mappedBy="customer"와 일치

    public Order(String orderDate, String deliveryAddress, Integer request, OrderStatus status, BigDecimal totalPrice, Customer customer, String dinnerType, String servingStyle) {
        this.orderDate = orderDate;
        this.deliveryAddress = deliveryAddress;
        this.request = request;
        this.status = status;
        this.totalPrice = totalPrice;
        this.customer = customer;
        this.dinnerType = dinnerType;
        this.servingStyle = servingStyle;
    }

    public void addOrderItem(OrderItem orderItem) {
        // 1. 내 주문 목록 리스트에 주문 상품을 추가한다.
        this.orderItems.add(orderItem);
        // 2. 주문 상품에게도 "너는 내 주문서에 속해있어"라고 알려준다.
        orderItem.setOrder(this);
    }

    
}