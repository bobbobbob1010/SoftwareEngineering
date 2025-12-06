package com.hellofood.backend.controller;

import com.hellofood.backend.dto.inventory.InventoryRequestDto;
import com.hellofood.backend.dto.inventory.InventoryResponseDto;
import com.hellofood.backend.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventories")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    // 1. 전체 조회
    @GetMapping
    public ResponseEntity<List<InventoryResponseDto>> getAllInventories() {
        return ResponseEntity.ok(inventoryService.getAllInventories());
    }

    // 2. 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponseDto> getInventory(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getInventory(id));
    }

    // 3. 재고 등록
    @PostMapping
    public ResponseEntity<Long> createInventory(@RequestBody InventoryRequestDto requestDto) {
        Long id = inventoryService.createInventory(requestDto);
        return ResponseEntity.ok(id);
    }

    // 4. 수량 변경 (간편 수정)
    // PATCH /api/inventories/{id}/quantity
    // Body: { "quantity": 50 }
    @PatchMapping("/{id}/quantity")
    public ResponseEntity<Void> updateQuantity(
            @PathVariable Long id,
            @RequestBody Map<String, BigDecimal> request) {
        BigDecimal newQuantity = request.get("quantity");
        inventoryService.updateQuantity(id, newQuantity);
        return ResponseEntity.ok().build();
    }

    // 4-1. 수량 증가 (입고)
    // POST /api/inventories/{id}/add
    // Body: { "amount": 10 }
    @PostMapping("/{id}/add")
    public ResponseEntity<Void> increaseQuantity(
            @PathVariable Long id,
            @RequestBody Map<String, BigDecimal> request) {
        BigDecimal amount = request.get("amount");
        inventoryService.increaseQuantity(id, amount);
        return ResponseEntity.ok().build();
    }

    // 5. 정보 전체 수정 (이름, 단위 등)
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateInventory(
            @PathVariable Long id,
            @RequestBody InventoryRequestDto requestDto) {
        inventoryService.updateInventoryInfo(id, requestDto);
        return ResponseEntity.ok().build();
    }

    // 6. 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
        return ResponseEntity.ok().build();
    }
}