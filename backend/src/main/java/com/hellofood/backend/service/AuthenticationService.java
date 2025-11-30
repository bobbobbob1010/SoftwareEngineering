package com.hellofood.backend.service;

import com.hellofood.backend.domain.user.Customer;
import com.hellofood.backend.domain.user.Staff;

public interface AuthenticationService {
    
    //회원가입 메서드 규칙(입력: Customer 객체, 출력: 생성된 사용자 ID)
    Long registerCustomer(Customer customer);

    //로그인 검증 메서드 규칙(입력: 이메일, 비밀번호, 출력: 인증된 Customer 객체)
    Customer authenticateCustomer(String email, String password);

    //로그인 검증 메서드 규칙(입력: 이메일, 비밀번호, 출력: 인증된 Staff 객체)
    Staff authenticateStaff(String email, String password);
}
