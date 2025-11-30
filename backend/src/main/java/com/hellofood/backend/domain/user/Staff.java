package com.hellofood.backend.domain.user;

import jakarta.persistence.*; //JPA 패키지 호출
import lombok.Getter;
import lombok.Setter;

//JPA 엔티티 지정
@Entity
@Table(name = "staffs")
@PrimaryKeyJoinColumn(name = "staff_id")
@Getter //getId, getName 등 자동 생성
@Setter //setPassword 등 자동 생성
public abstract class Staff extends User{
    
    public Staff() {} //JPA 사용을 위한 기본 생성자

    //전체 필드를 초기화하는 생성자
    protected Staff(String name, String email, String password, String phoneNumber) {
        super(name, email, password, phoneNumber);
    }

}
