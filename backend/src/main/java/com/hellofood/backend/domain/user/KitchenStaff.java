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

    public KitchenStaff() {}
}
