package com.hellofood.backend.repository;

import com.hellofood.backend.domain.user.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

//Staff 엔티티에 대한 데이터 접근을 담당하는 리포지토리 인터페이스
//Spring Data JPA가 자동으로 구현체를 생성
public interface StaffRepository extends JpaRepository<Staff, Long> { //인터페이스
    
    //이메일을 통해 Staff 엔티티 조회
    Optional<Staff> findByEmail(String email);

    //이메일의 존재 여부 확인
    boolean existsByEmail(String email);
    
}