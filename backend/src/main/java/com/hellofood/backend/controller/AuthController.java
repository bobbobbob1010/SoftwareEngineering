package com.hellofood.backend.controller;

import com.hellofood.backend.domain.user.Customer;
import com.hellofood.backend.domain.user.Staff;
import com.hellofood.backend.service.AuthenticationService;
import com.hellofood.backend.dto.user.UserRegisterRequest;
import com.hellofood.backend.dto.user.LoginRequest;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    //AuthenticationService 인터페이스 불러옴
    private final AuthenticationService authenticationService;

    // 회원가입 엔드포인트
    @PostMapping("/signup")
    public ResponseEntity<Long> register(@RequestBody UserRegisterRequest request) {
        Customer customer = new Customer(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getAddress(),
                request.getPhoneNumber(),
                request.getRegisteredAt(),
                request.getTotalOrders(),
                request.getTotalSpent(),
                request.getDiscountRate()
        );

        //회원가입 서비스 호출(Service Layer로 넘어감)
        Long userId = authenticationService.registerCustomer(customer);

        return ResponseEntity.ok(userId);
    }

    // 로그인 엔드포인트
    @PostMapping("/login")
    public ResponseEntity<?> loginUsers(@RequestBody LoginRequest request) {
        try {
            Customer customer = authenticationService.authenticateCustomer(request.getEmail(), request.getPassword());
            
            return ResponseEntity.ok(customer);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("인증 실패:" + e.getMessage());
        }
    }

    @PostMapping("/staff-login")
    public ResponseEntity<?> loginStaffs(@RequestBody LoginRequest request) {
        try {
            Staff staff = authenticationService.authenticateStaff(request.getEmail(), request.getPassword());
            
            return ResponseEntity.ok(staff);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("인증 실패:" + e.getMessage());
        }
    }
    
}
