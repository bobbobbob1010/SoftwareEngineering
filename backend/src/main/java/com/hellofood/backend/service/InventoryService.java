package com.hellofood.backend.service;

import com.hellofood.backend.domain.inventory.Inventory;
import com.hellofood.backend.dto.inventory.InventoryRequestDto;
import com.hellofood.backend.dto.inventory.InventoryResponseDto;
import com.hellofood.backend.repository.InventoryRepository;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    private final UsageProvider usageProvider;

    // 1. 전체 재고 조회
    public List<InventoryResponseDto> getAllInventories() {
        return inventoryRepository.findAll().stream()
                .map(inventory -> {
                    List<String> menuNames = usageProvider.getMenuNamesByInventory(inventory);
                    return new InventoryResponseDto(inventory, menuNames);
                })
                .collect(Collectors.toList());
    }

    // 2. 재고 상세 조회
    public InventoryResponseDto getInventory(Long id) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("재고를 찾을 수 없습니다. id=" + id));

        List<String> menuNames = usageProvider.getMenuNamesByInventory(inventory);
        
        return new InventoryResponseDto(inventory, menuNames);
    }

    // 3. 재고 등록 (Create)
    @Transactional
    public Long createInventory(InventoryRequestDto requestDto) {
        Inventory inventory = new Inventory();
        inventory.setItemName(requestDto.getItemName());
        inventory.setQuantityAvailable(requestDto.getQuantityAvailable());
        inventory.setMinQuantity(requestDto.getMinQuantity());
        inventory.setUnit(requestDto.getUnit());

        // 초기 상태 계산 (Good/Low/Critical)
        updateStatusBasedOnQuantity(inventory);

        inventoryRepository.save(inventory);
        return inventory.getStockID();
    }

    // 4. 재고 수량 수정 (Update Quantity)
    @Transactional
    public void updateQuantity(Long stockId, int newQuantity) {
        Inventory inventory = inventoryRepository.findById(stockId)
                .orElseThrow(() -> new IllegalArgumentException("재고를 찾을 수 없습니다. id=" + stockId));

        inventory.setQuantityAvailable(newQuantity);
        
        // 수량이 변했으니 상태도 다시 계산
        updateStatusBasedOnQuantity(inventory);
    }

    // 5. 재고 정보 전체 수정 (이름, 최소수량 등)
    @Transactional
    public void updateInventoryInfo(Long stockId, InventoryRequestDto requestDto) {
        Inventory inventory = inventoryRepository.findById(stockId)
                .orElseThrow(() -> new IllegalArgumentException("재고를 찾을 수 없습니다. id=" + stockId));

        inventory.setItemName(requestDto.getItemName());
        inventory.setMinQuantity(requestDto.getMinQuantity());
        inventory.setUnit(requestDto.getUnit());
        
        // 최소 수량이 변했을 수도 있으니 상태 재계산
        updateStatusBasedOnQuantity(inventory); 
    }

    // 6. 삭제
    @Transactional
    public void deleteInventory(Long stockId) {
        inventoryRepository.deleteById(stockId);
    }

    // [Helper] 수량에 따른 상태 자동 결정 로직
    private void updateStatusBasedOnQuantity(Inventory inventory) {
        int current = inventory.getQuantityAvailable();
        int min = inventory.getMinQuantity();

        if (current <= 0) {
            inventory.setStatus("Critical"); // 품절/위험
        } else if (current <= min) {
            inventory.setStatus("Low");      // 부족
        } else {
            inventory.setStatus("Good");     // 양호
        }
    }
}