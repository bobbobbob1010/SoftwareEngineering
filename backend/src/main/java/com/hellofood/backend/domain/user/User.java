package com.hellofood.backend.domain.user;

import jakarta.persistence.*; //JPA 패키지 호출

//JPA 엔티티 지정
@Entity
// 상속전략으로 JOINED 전략 사용( 각 클래스 별 테이블 생성 후 JOIN)
@Inheritance(strategy = InheritanceType.JOINED) 
@DiscriminatorColumn(name = "user_type") // 사용자 유형 구분자 (CUSTOMER, STAFF 등)
@Table(name = "users") 
public abstract class User {
    //User 생성자
    protected User(String name, String email, String password, String phoneNumber){
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
    }
    // Primary Key.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 15) //한 명이 고객과 직원둘다 될수 있으니까
    private String phoneNumber;

    public User() {} //JPA 사용을 위한 생성자

}