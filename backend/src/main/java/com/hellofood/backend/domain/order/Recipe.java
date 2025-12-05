package com.hellofood.backend.domain.order;

import com.hellofood.backend.domain.inventory.Inventory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "recipes")
@Getter
@NoArgsConstructor
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 메뉴를 만들 때 쓰는지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

    // 어떤 재료를 쓰는지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id")
    private Inventory inventory;

    // 얼만큼 쓰는지? (예: 1.0, 0.5 등)
    // Inventory의 unit과 단위를 맞춰야 합니다.
    private BigDecimal requiredQuantity;

    public Recipe(MenuItem menuItem, Inventory inventory, BigDecimal requiredQuantity) {
        this.menuItem = menuItem;
        this.inventory = inventory;
        this.requiredQuantity = requiredQuantity;
    }
}