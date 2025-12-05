package com.hellofood.backend.service;
import java.util.List;
import com.hellofood.backend.domain.inventory.Inventory;

public interface UsageProvider {
    // 재고(Inventory)를 주면 -> 메뉴 이름 목록(List<String>)를 반환
    List<String> getMenuNamesByInventory(Inventory inventory);
}