package com.hellofood.backend.dto.inventory;

import lombok.Data;

@Data
public class InventoryRequestDto {
    private String itemName;
    private java.math.BigDecimal quantityAvailable;
    private java.math.BigDecimal minQuantity;
    private String unit;
}