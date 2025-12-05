package com.hellofood.backend.repository;

import com.hellofood.backend.domain.order.Order;
import com.hellofood.backend.domain.order.Order.OrderStatus;
import com.hellofood.backend.domain.user.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

//Order 엔티티에 대한 데이터 접근을 담당하는 리포지토리 인터페이스
//Spring Data JPA가 자동으로 구현체를 생성
public interface OrderRepository extends JpaRepository<Order, Long> { //인터페이스
    
    //고객을 통해 주문 조회
    Optional<Order> findByCustomer(Customer customer);
    
    //고객 ID로 모든 주문 조회
    List<Order> findAllByCustomerId(Long customerId);

    //삭제
    void deleteById(Long orderId);

    //특정 고객의 주문 수 세기
    int countByCustomer(Customer customer);

    // 상태(WAITING, COOKING 등)로 주문 목록을 찾는 메서드 (JPA가 알아서 구현해줌)
    List<Order> findByStatus(OrderStatus status);

    // 💡 모든 주문 조회 시 Logs와 Customer를 Fetch Join
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.processLogs LEFT JOIN FETCH o.customer")
    List<Order> findAllWithLogs();

    // 💡 상태별 조회 시 Logs와 Customer를 Fetch Join
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.processLogs LEFT JOIN FETCH o.customer WHERE o.status = :status")
    List<Order> findByStatusWithLogs(@Param("status") OrderStatus status);

    List<Order> findAll();
}
