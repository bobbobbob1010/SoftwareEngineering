package com.hellofood.backend.service;

import com.hellofood.backend.domain.order.Order;
import com.hellofood.backend.domain.order.Order.OrderStatus;
import com.hellofood.backend.domain.order.OrderProcessLog;

import com.hellofood.backend.dto.order.OrderResponseDto;
import com.hellofood.backend.repository.OrderProcessLogRepository;
import com.hellofood.backend.repository.OrderRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class StaffOrderService {
    
    private final OrderRepository orderRepository;
    private final OrderProcessLogRepository orderProcessLogRepository;

    //OrderPcoressLog에서 해당 주문의 최신 상태(담당직원, 시각)를 찾는 메소드
    private OrderProcessLog findLatestLogByStatus(List<OrderProcessLog> logs, OrderStatus status) {
        if (logs == null || logs.isEmpty()) return null;
        return logs.stream()
            .filter(log -> log.getStatus() == status)
            .max(Comparator.comparing(OrderProcessLog::getProcessTime))
            .orElse(null);
    }

    // Status 기반 주문 조회
    public List<OrderResponseDto> getOrders(OrderStatus status) {
        List<Order> orders;

        // 1. 파라미터로 넘어온 status가 있으면 그걸로 검색, 없으면 전체 검색
        if (status == null) {
            orders = orderRepository.findAllWithLogs(); // 전체 조회
        } else {
            orders = orderRepository.findByStatusWithLogs(status); // 상태별 조회
        }

        // 2. 조회된 주문 엔티티(Order)들을 응답용 DTO(OrderResponseDto)로 변환
        return orders.stream()
                .map(order -> {
                    OrderProcessLog readyLog = findLatestLogByStatus(order.getProcessLogs(), OrderStatus.READY);
                    OrderProcessLog inProgressLog = findLatestLogByStatus(order.getProcessLogs(), OrderStatus.INPROGRESS);

                    Long staffId = null;
                    LocalDateTime readyTime = null;

                    if (readyLog != null) {
                        staffId = readyLog.getStaffId();
                        readyTime = readyLog.getProcessTime();
                    } else if (inProgressLog != null) {
                        staffId = inProgressLog.getStaffId();
                    }

                    // 3. 추출된 정보를 DTO 생성자로 전달 (아래 2번 DTO 수정 필요)
                    return new OrderResponseDto(order, staffId, readyTime); 
                })
                .collect(Collectors.toList());
    }
    
    //  주문 상태 업데이트
    public void updateStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문 없음"));

        // 유효성 검사 (옵션): 이미 배달 완료된걸 다시 요리중으로 못 바꾸게 막기 등
        // if (order.getStatus() == OrderStatus.COMPLETED) throw ...

        order.setStatus(newStatus);
        
        // (확장 기능) 만약 상태가 '배달중'으로 바뀌면 고객에게 알림(SMS/Push) 보내기 로직 추가
    }

    // 새로 추가한 이력 관리 함수
    public void updateStatusAndAudit(Long orderId, OrderStatus newStatus, Long staffId, String staffRole) {
        
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found."));

        // 1. 역할 검증 (RBAC)
        if (newStatus == OrderStatus.INPROGRESS || newStatus == OrderStatus.READY) {
            if (!"kitchen_staff".equals(staffRole)) {
                throw new AccessDeniedException("요리 준비는 주방 직원만 처리할 수 있습니다.");
            }
        } else if (newStatus == OrderStatus.DELIVERED) {
            if (!"delivery_staff".equals(staffRole)) {
                throw new AccessDeniedException("배달 완료는 배달 직원만 처리할 수 있습니다.");
            }
        }

        order.setStatus(newStatus);
        orderRepository.save(order);
        
        OrderProcessLog log = new OrderProcessLog(
            order, 
            newStatus, 
            staffId, 
            LocalDateTime.now(), // 현재 시각 기록
            staffRole
        );
        
        // 💡 로그 엔티티 저장
        orderProcessLogRepository.save(log);
    }
}