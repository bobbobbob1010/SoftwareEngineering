package com.hellofood.backend.dto.inventory;

import com.hellofood.backend.domain.inventory.Inventory;
import lombok.Data;

@Data
public class InventoryResponseDto {
    private Long stockID;
    private String itemName;
    private int quantityAvailable;
    private String unit;
    private int minQuantity;
    private String status;

    // Entity -> DTO 변환 생성자
    public InventoryResponseDto(Inventory inventory) {
        this.stockID = inventory.getStockID();
        this.itemName = inventory.getItemName();
        this.quantityAvailable = inventory.getQuantityAvailable();
        this.unit = inventory.getUnit();
        this.minQuantity = inventory.getMinQuantity();
        this.status = inventory.getStatus();
    }
}
