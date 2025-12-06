package com.hellofood.backend.domain.user;

import jakarta.persistence.*; //JPA 패키지 호출
import lombok.Getter;
import lombok.Setter;

//JPA 엔티티 지정
@Entity
@Table(name = "staffs")
@PrimaryKeyJoinColumn(name = "staff_id")
@Getter // getId, getName 등 자동 생성
@Setter // setPassword 등 자동 생성
public abstract class Staff extends User {

    public Staff() {
    } // JPA 사용을 위한 기본 생성자

    // 전체 필드를 초기화하는 생성자
    protected Staff(String name, String email, String password, String phoneNumber) {
        super(name, email, password, phoneNumber);
    }

    // [Polymorphism] 자신의 역할에 맞는 주문 처리가 가능한지 판단하는 추상 메서드
    // 각 하위 클래스(KitchenStaff, DeliveryStaff)가 직접 구현해야 함
    public abstract boolean canHandle(com.hellofood.backend.domain.order.Order.OrderStatus status);

}
