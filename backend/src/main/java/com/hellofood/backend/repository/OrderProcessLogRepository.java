package com.hellofood.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hellofood.backend.domain.order.OrderProcessLog;

public interface OrderProcessLogRepository extends JpaRepository<OrderProcessLog, Long>{

    
}
