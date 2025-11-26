package com.hellofood.backend.domain.user;

import jakarta.persistence.*;
import com.hellofood.backend.domain.user.User; //User 클래스 호출
import com.hellofood.backend.domain.order.Order; // Order 클래스 호출
import com.hellofood.backend.domain.order.Cart; // Cart 클래스 호출
import java.util.List; //List


//JPA 엔티티 지정
@Entity
//USERS 테이블에 USER_TYPE 컬럼에 CUSTOMER 값을 가지도록함
@DiscriminatorValue("customer") 
//JOINED 전략으로, USERS(부모)테이블의 PK(ID)와 CUSTOMERS(자식)테이블의 PK를 연결
@PrimaryKeyJoinColumn(name = "customer_id") 
@Table(name = "customers")
public class Customer extends User { // 추상클래스 User 상속

    @Column(length = 255)
    private String address;

    // myCart :Cart 객체와 1:1 관계
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    // customers 테이블에 "cart_id" 라는 외래키 컬럼을 생성해 Cart 테이블과 연결
    @JoinColumn(name = "cart_id")
    private Cart myCart;

    // Order과의 관계
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "customer")
    private List<Order> orderHistory;

    public Customer() {} //JPA 사용을 위한 기본 생성자

    public Customer(String name, String email, String password, String address, String phoneNumber) {
        super(name, email, password, phoneNumber);
        this.address = address;
    }
}