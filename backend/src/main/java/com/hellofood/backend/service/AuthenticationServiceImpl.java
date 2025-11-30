package com.hellofood.backend.service;
// 이 클래스는 AuthenticationService 인터페이스를 구현

import com.hellofood.backend.domain.user.Customer;
import com.hellofood.backend.domain.user.Staff;
import com.hellofood.backend.repository.CustomerRepository;
import com.hellofood.backend.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.core.userdetails.UsernameNotFoundException; // 사용자 미발견 예외 처리용 임포트
import org.springframework.security.authentication.BadCredentialsException; // 인증 실패 예외 처리용 임포트
import org.springframework.security.crypto.password.PasswordEncoder; // 비밀번호 암호화를 위한 임포트

//Service 어노테이션은 Spring에게 이 클래스를 빈으로 등록하고
// AuthenticationService 인터페이스의 구현체로 사용하도록 지시
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthenticationServiceImpl implements AuthenticationService {
    
    private final CustomerRepository customerRepository;
    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;


    // @Override
    // @Transactional
    // public Long registerStaff(Staff staff) {
    //     //이메일 중복 확인
    //     if (customerRepository.existsByEmail(staff.getEmail())) {
    //         throw new IllegalArgumentException("Email already in use");
    //     }

    //     //비밀번호 암호화
    //     String encodedPassword = passwordEncoder.encode(staff.getPassword());
    //     staff.setPassword(encodedPassword);

    //     //새로운 직원 저장
    //     Customer savedStaff = customerRepository.save(staff);
    //     return savedStaff.getId();
    // }

    @Override
    @Transactional
    public Long registerCustomer(Customer customer) {
        //이메일 중복 확인
        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        //비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(customer.getPassword());
        customer.setPassword(encodedPassword);

        //새로운 고객 저장
        Customer savedCustomer = customerRepository.save(customer);
        return savedCustomer.getId();
    }

    @Override
    public Customer authenticateCustomer(String email, String password) {
        //이메일로 고객 조회
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        
        //비밀번호 검증
        if (!passwordEncoder.matches(password, customer.getPassword())) {
            throw new IllegalArgumentException("Invalid email1 or password");
        }

        return customer;
    }

    @Override
    public Staff authenticateStaff(String email, String password) {
        //이메일로 직원 조회
        Staff staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        
        //비밀번호 검증
        if (!passwordEncoder.matches(password, staff.getPassword())) {
            throw new IllegalArgumentException("Invalid email2 or password");
        }
        return staff;
    }
}
