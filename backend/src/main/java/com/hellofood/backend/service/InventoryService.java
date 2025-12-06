package com.hellofood.backend.service;

import com.hellofood.backend.domain.inventory.Inventory;
import com.hellofood.backend.domain.order.MenuItem;
import com.hellofood.backend.domain.order.Recipe;
import com.hellofood.backend.dto.inventory.InventoryRequestDto;
import com.hellofood.backend.dto.inventory.InventoryResponseDto;
import com.hellofood.backend.repository.InventoryRepository;
import com.hellofood.backend.repository.RecipeRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final RecipeRepository recipeRepository;
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
        inventory.updateStatus();

        inventoryRepository.save(inventory);
        return inventory.getStockID();
    }

    // 4. 재고 수량 수정 (Update Quantity)
    @Transactional
    public void updateQuantity(Long stockId, BigDecimal newQuantity) {
        Inventory inventory = inventoryRepository.findById(stockId)
                .orElseThrow(() -> new IllegalArgumentException("재고를 찾을 수 없습니다. id=" + stockId));

        inventory.setQuantityAvailable(newQuantity);

        // 수량이 변했으니 상태도 다시 계산
        inventory.updateStatus();
    }

    // 4-1. 재고 수량 증가 (입고, Relative Update)
    @Transactional
    public void increaseQuantity(Long stockId, BigDecimal amount) {
        Inventory inventory = inventoryRepository.findById(stockId)
                .orElseThrow(() -> new IllegalArgumentException("재고를 찾을 수 없습니다. id=" + stockId));

        inventory.increaseQuantity(amount);
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
        inventory.updateStatus();
    }

    // 6. 삭제
    @Transactional
    public void deleteInventory(Long stockId) {
        inventoryRepository.deleteById(stockId);
    }

    // [Helper] 수량에 따른 상태 자동 결정 로직

    // 주문시 재고 줄어들게
    @Transactional
    public void deductStock(MenuItem menuItem, int quantity) {
        // 1. 해당 메뉴의 레시피 조회 (어떤 재료를 쓰는지)
        List<Recipe> recipes = recipeRepository.findByMenuItem(menuItem);

        if (recipes.isEmpty()) {
            // 레시피가 없는 메뉴(예: 단순 서비스 등)라면 차감할 재료 없음
            return;
        }

        // 2. 레시피에 정의된 재료별로 수량 차감
        for (Recipe recipe : recipes) {
            Inventory inventory = recipe.getInventory();

            // 필요량 = 레시피당 소모량 * 주문 수량
            BigDecimal requiredQty = recipe.getRequiredQuantity().multiply(BigDecimal.valueOf(quantity));

            // 도메인 메서드를 통해 차감 (검증 및 상태 업데이트 자동 수행)
            inventory.decreaseQuantity(requiredQty);
        }
    }
}