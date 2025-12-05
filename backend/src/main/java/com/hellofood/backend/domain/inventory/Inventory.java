package com.hellofood.backend.domain.inventory;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "inventories")
@Getter
@Setter
public class Inventory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stockID;


    private String itemName; // ->name
    private int quantityAvailable; // -> quantity
    private String unit; // -> unit
    private int minQuantity; // -> min
    private String status ; // -> status Good Low Critical
    private BigDecimal cost; // -> 원가 field

    public Inventory() {} //JPA 기본 생성자

    public Inventory(String itemName, int quantityAvailable, int minQuantity, String unit, String status, BigDecimal cost) {
        this.itemName = itemName;
        this.quantityAvailable = quantityAvailable;
        this.minQuantity = minQuantity;
        this.unit = unit;
        this.status = status;
        this.cost = cost;
    }
    
}
