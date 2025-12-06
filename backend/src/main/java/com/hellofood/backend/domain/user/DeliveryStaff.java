package com.hellofood.backend.domain.user;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "delivery_staffs")
@DiscriminatorValue("delivery_staff")
@PrimaryKeyJoinColumn(name = "delivery_staff_id")
public class DeliveryStaff extends Staff {

    public DeliveryStaff(String name, String email, String password, String phoneNumber) {
        super(name, email, password, phoneNumber);
    }

    public DeliveryStaff() {
    }

    @Override
    public boolean canHandle(com.hellofood.backend.domain.order.Order.OrderStatus status) {
        // 배달 직원: 배달 완료(DELIVERED) 상태 처리 가능
        return status == com.hellofood.backend.domain.order.Order.OrderStatus.DELIVERED;
    }
}
