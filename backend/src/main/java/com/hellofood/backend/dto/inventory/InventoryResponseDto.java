package com.hellofood.backend.dto.inventory;

import java.math.BigDecimal;
import java.util.List;

import com.hellofood.backend.domain.inventory.Inventory;
import lombok.Data;

@Data
public class InventoryResponseDto {
    private Long stockID;
    private String itemName;
    private BigDecimal quantityAvailable;
    private String unit;
    private BigDecimal minQuantity;
    private String status;
    private List<String> usedInMenus; // 이 재료가 사용되는 메뉴 이름 목록
    private BigDecimal cost; // 원가

    // Entity -> DTO 변환 생성자
    public InventoryResponseDto(Inventory inventory, List<String> usedInMenus) {
        this.stockID = inventory.getStockID();
        this.itemName = inventory.getItemName();
        this.quantityAvailable = inventory.getQuantityAvailable();
        this.unit = inventory.getUnit();
        this.minQuantity = inventory.getMinQuantity();
        this.status = inventory.getStatus();
        this.usedInMenus = usedInMenus;
        this.cost = inventory.getCost();
    }
}
