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
    private BigDecimal quantityAvailable; // -> quantity
    private String unit; // -> unit
    private BigDecimal minQuantity; // -> min
    private String status; // -> status Good Low Critical
    private BigDecimal cost; // -> 원가 field

    public Inventory() {
    } // JPA 기본 생성자

    public Inventory(String itemName, BigDecimal quantityAvailable, BigDecimal minQuantity, String unit, String status,
            BigDecimal cost) {
        this.itemName = itemName;
        this.quantityAvailable = quantityAvailable;
        this.minQuantity = minQuantity;
        this.unit = unit;
        this.status = status;
        this.cost = cost;
    }

    // [Domain Logic] 상태 업데이트 로직 (엔티티 스스로 판단)
    public void updateStatus() {
        if (this.quantityAvailable.compareTo(BigDecimal.ZERO) <= 0) {
            this.status = "Critical"; // 품절/위험
        } else if (this.quantityAvailable.compareTo(this.minQuantity) <= 0) {
            this.status = "Low"; // 부족
        } else {
            this.status = "Good"; // 양호
        }
    }

    // [Domain Logic] 수량 차감 로직 (검증 포함)
    public void decreaseQuantity(BigDecimal amount) {
        if (this.quantityAvailable.compareTo(amount) < 0) {
            throw new IllegalStateException("재고 부족: " + this.itemName
                    + " (남은 수량: " + this.quantityAvailable + ", 필요 수량: " + amount + ")");
        }
        this.quantityAvailable = this.quantityAvailable.subtract(amount);
        updateStatus(); // 수량 변경 후 즉시 상태 갱신
    }

    // [Domain Logic] 수량 증가 로직 (입고)
    public void increaseQuantity(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("증가시킬 수량은 0보다 커야 합니다.");
        }
        this.quantityAvailable = this.quantityAvailable.add(amount);
        updateStatus();
    }

}
