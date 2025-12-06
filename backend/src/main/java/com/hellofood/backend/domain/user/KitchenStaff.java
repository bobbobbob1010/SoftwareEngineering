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
@Table(name = "kitchen_staffs")
@DiscriminatorValue("kitchen_staff")
@PrimaryKeyJoinColumn(name = "kitchen_staff_id")
public class KitchenStaff extends Staff {

    public KitchenStaff(String name, String email, String password, String phoneNumber) {
        super(name, email, password, phoneNumber);
    }

    public KitchenStaff() {
    }

    @Override
    public boolean canHandle(com.hellofood.backend.domain.order.Order.OrderStatus status) {
        // 주방 직원: 요리 준비중(INPROGRESS) 또는 준비 완료(READY) 상태 처리 가능
        return status == com.hellofood.backend.domain.order.Order.OrderStatus.INPROGRESS ||
                status == com.hellofood.backend.domain.order.Order.OrderStatus.READY;
    }
}
