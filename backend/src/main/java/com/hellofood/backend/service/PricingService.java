package com.hellofood.backend.service;

import com.hellofood.backend.domain.order.MenuItem;
import com.hellofood.backend.domain.user.CustomerTier;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class PricingService {

    // 디너 세트별 기본 가격
    private static final Map<String, BigDecimal> DINNER_BASE_PRICES = Map.of(
            "valentine", new BigDecimal("99.99"),
            "french", new BigDecimal("89.99"),
            "english", new BigDecimal("79.99"),
            "champagne", new BigDecimal("169.99"));

    // 서빙 스타일별 추가 요금
    private static final Map<String, BigDecimal> STYLE_EXTRA_FEES = Map.of(
            "simple", new BigDecimal("-20.00"), // 심플은 20달러 할인
            "grand", BigDecimal.ZERO, // 웅장한 스타일은 기본값
            "deluxe", new BigDecimal("30.00") // 디럭스는 30달러 추가
    );

    /**
     * 주문 기본 가격 계산 (디너 타입 + 서빙 스타일)
     */
    public BigDecimal calculateBaseOrderPrice(String dinnerType, String servingStyle, int quantity) {
        String style = servingStyle != null ? servingStyle : "simple";

        BigDecimal basePrice = DINNER_BASE_PRICES.getOrDefault(dinnerType, BigDecimal.ZERO);
        BigDecimal styleFee = STYLE_EXTRA_FEES.getOrDefault(style, BigDecimal.ZERO);

        // (기본가 + 스타일비용) * 수량
        return basePrice.add(styleFee).multiply(BigDecimal.valueOf(quantity));
    }

    /**
     * 개별 메뉴 아이템 가격 계산 (세트 포함 여부 로직 적용)
     */
    public BigDecimal calculateOrderItemPrice(MenuItem menuItem, String orderDinnerType, int orderQuantity,
            int itemQuantity) {
        // 현재의 이 아이템이 주문한 세트의 기본구성품인가?
        boolean isBaseItem = menuItem.isBaseItem() && orderDinnerType.equals(menuItem.getDinnerType());

        if (isBaseItem) {
            // 기본 포함 메뉴라면: 수량에서 (세트 메뉴 수)을 뺀 만큼만 추가 가격 계산
            int extraQuantity = Math.max(0, itemQuantity - orderQuantity);
            return menuItem.getUnitPrice().multiply(BigDecimal.valueOf(extraQuantity));
        } else {
            // 추가 메뉴(Add-on): 단가 * 수량 만큼 추가
            return menuItem.getUnitPrice().multiply(BigDecimal.valueOf(itemQuantity));
        }
    }

    /**
     * 최종 할인 적용 가격 및 할인 정보 계산
     * 
     * @return DiscountInfo (할인율, 할인금액, 최종가격)
     */
    public DiscountResult calculateDiscount(BigDecimal totalPrice, int pastOrderCount) {
        // 등급 계산
        CustomerTier tier = CustomerTier.calculateTier(pastOrderCount);
        int discountRate = tier.getDiscountRate();

        // 할인 금액 계산: (총 금액 * 할인율) / 100
        BigDecimal discountAmount = totalPrice
                .multiply(BigDecimal.valueOf(discountRate))
                .divide(BigDecimal.valueOf(100));

        // 최종 가격
        BigDecimal finalPrice = totalPrice.subtract(discountAmount);

        return new DiscountResult(discountRate, discountAmount, finalPrice);
    }

    // 결과를 반환하기 위한 간단한 DTO (inner class or external)
    public record DiscountResult(int discountRate, BigDecimal discountAmount, BigDecimal finalPrice) {
    }
}
