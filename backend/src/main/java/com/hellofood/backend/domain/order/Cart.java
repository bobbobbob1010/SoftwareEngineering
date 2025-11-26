package com.hellofood.backend.domain.order;

import jakarta.persistence.*;

@Entity
@Table(name = "carts")
public class Cart {
    protected Cart () {} //JPA용 생성자

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


}