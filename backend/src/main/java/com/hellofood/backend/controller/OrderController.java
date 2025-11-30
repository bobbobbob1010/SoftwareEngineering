package com.hellofood.backend.controller;

import com.hellofood.backend.dto.order.OrderRequestDto;
import com.hellofood.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Long> confirmOrder(@RequestBody OrderRequestDto request) {
        Long orderId = orderService.createOrder(request);
        return ResponseEntity.ok(orderId);
    }
}