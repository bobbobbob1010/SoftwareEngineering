package com.hellofood.backend.service;

import com.hellofood.backend.domain.inventory.Inventory;
import com.hellofood.backend.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeUsageProvider implements UsageProvider { // 인터페이스 구현

    private final RecipeRepository recipeRepository; // 여기서만 RecipeRepo를 씁니다!

    @Override
    public List<String> getMenuNamesByInventory(Inventory inventory) {
        return recipeRepository.findByInventory(inventory).stream()
                .map(recipe -> recipe.getMenuItem().getName())
                .distinct()
                .collect(Collectors.toList());
    }
}