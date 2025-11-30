package com.hellofood.backend.domain.order;

import java.math.BigDecimal;

import jakarta.persistence.*; //JPA 패키지 호출
import lombok.Getter;

// MenuItem.java (상품 카탈로그)
@Entity
@Table(name = "menu_items")
@Getter
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;           // 예: "Steak (1 portion)", "Extra Champagne"
    private BigDecimal unitPrice;  // 단위 가격
    private String category;       // 예: "Drinks", "Main", "Sides"
    private boolean isBaseItem;    // 기본 디너 메뉴에 포함되는 항목인지 여부
    private String dinnerType;     // 이 항목이 속하는 디너 타입 (예: "valentine")
    
    public MenuItem() {} // JPA용 기본 생성자

    public MenuItem(String name, BigDecimal unitPrice, String category, boolean isBaseItem, String dinnerType) {
        this.name = name;
        this.unitPrice = unitPrice;
        this.category = category;
        this.isBaseItem = isBaseItem;
        this.dinnerType = dinnerType;
    }
}