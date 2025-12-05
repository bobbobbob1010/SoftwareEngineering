package com.hellofood.backend.repository;

import com.hellofood.backend.domain.order.MenuItem;
import com.hellofood.backend.domain.order.Recipe;
import com.hellofood.backend.domain.inventory.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    // "이 재고(Inventory)를 사용하는 모든 레시피를 찾아줘" (재고관리 화면용)
    List<Recipe> findByInventory(Inventory inventory);

    // 메뉴(MenuItem)를 주면 -> 필요한 재료 레시피들을 찾아줘 (나중에 주문처리용)
    List<Recipe> findByMenuItem(MenuItem menuItem);
}