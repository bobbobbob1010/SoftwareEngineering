package com.hellofood.backend.repository;

import com.hellofood.backend.domain.order.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

//MenuItem  엔티티에 대한 데이터 접근을 담당하는 리포지토리 인터페이스
//Spring Data JPA가 자동으로 구현체를 생성
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> { //인터페이스
    
    //메뉴 아이템 이름을 통해 MenuItem 엔티티 조회
    Optional<MenuItem> findByName(String name);

    //메뉴 아이템의 존재 여부 확인
    boolean existsByName(String name);


    //조회용도
    // 1. 특정 디너 타입의 기본 구성품 조회 (예: dinnerType="valentine" AND isBaseItem=true)
    List<MenuItem> findByDinnerTypeAndIsBaseItem(String dinnerType, boolean isBaseItem);

    // 2. 공통 추가 메뉴(Add-on) 조회 (예: isBaseItem=false)
    List<MenuItem> findByIsBaseItem(boolean isBaseItem);
}
