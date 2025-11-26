package com.hellofood.backend.domain.order;

import jakarta.persistence.*;
import com.hellofood.backend.domain.user.Customer;


@Entity
@Table(name = "orders")
public class Order {

    protected Order () {} //JPA용 생성자

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY) 
    // orders 테이블에 "customer_id" 라는 외래키 컬럼을 생성해 orders 테이블과 연결
    @JoinColumn(name = "customer_id", nullable = false) 
    private Customer customer; //  Customer.java의 mappedBy="customer"와 일치

}