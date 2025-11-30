package com.hellofood.backend.controller;

import com.hellofood.backend.domain.order.MenuItem;
import com.hellofood.backend.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // 리액트(3000번 포트) 허용
public class MenuItemController {

    private final MenuItemRepository menuItemRepository;

    @GetMapping
    public List<MenuItem> getMenuItems(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean isBaseItem
    ) {
        // 1. 기본 구성품 요청 (예: ?type=valentine&isBaseItem=true)
        if (type != null && Boolean.TRUE.equals(isBaseItem)) {
            return menuItemRepository.findByDinnerTypeAndIsBaseItem(type, true);
        }
        
        // 2. 추가 메뉴(Add-on) 요청 (예: ?isBaseItem=false)
        if (Boolean.FALSE.equals(isBaseItem)) {
            return menuItemRepository.findByIsBaseItem(false);
        }

        // 3. 파라미터 없으면 전체 반환 (혹시 모를 디버깅용)
        return menuItemRepository.findAll();
    }
}