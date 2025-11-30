package com.hellofood.backend.config; // 설정 파일 패키지 (예시)

import com.hellofood.backend.domain.order.MenuItem;
import com.hellofood.backend.domain.user.Customer;
import com.hellofood.backend.domain.user.KitchenStaff;
import com.hellofood.backend.repository.CustomerRepository;
import com.hellofood.backend.domain.user.Staff;
import com.hellofood.backend.repository.StaffRepository;
import com.hellofood.backend.repository.MenuItemRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal; // BigDecimal import 확인
import java.time.LocalDateTime;
import java.util.List;

@Component // 💡 Spring Bean으로 등록
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final CustomerRepository customerRepository;
    private final StaffRepository staffRepository;
    private final MenuItemRepository menuItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // 서버 시작 시 실행될 로직

        // 1. 이미 데모 계정이 존재하는지 확인 (반복 생성 방지)
        if (customerRepository.findByEmail("demo@example.com").isEmpty()) {
            
            // 2. 비밀번호 암호화
            String rawPassword = "1234";
            String encodedPassword = passwordEncoder.encode(rawPassword);

            // 3. Customer 엔티티 생성 (Join Table 구조 반영)
            // User 엔티티의 생성자 또는 Setter를 사용합니다.
            Customer demoCustomer = new Customer();
            
            // User 필드 설정 (부모 클래스 필드)
            demoCustomer.setName("Demo User");
            demoCustomer.setEmail("demo@example.com");
            demoCustomer.setPassword(encodedPassword); // 암호화된 비밀번호
            demoCustomer.setPhoneNumber("010-1234-5678");
            demoCustomer.setUserType("customer"); // Joined Table 전략의 구분자 (DTYPE)
            
            // Customer 고유 필드 및 NOT NULL 필드 설정 (필요한 경우)
            demoCustomer.setAddress("서울시 테스트구");
            demoCustomer.setRegisteredAt(LocalDateTime.now().toString()); // @CreationTimestamp가 없다면 수동 설정
            demoCustomer.setDiscountRate(0); 
            demoCustomer.setTotalOrders(0);
            demoCustomer.setTotalSpent(0);

            // 4. 데이터베이스에 저장
            customerRepository.save(demoCustomer);
            
            System.out.println("✅ Demo Customer Account created: demo@example.com / 1234");
        }

        // 1. 이미 데모 스태프 계정이 존재하는지 확인 (반복 생성 방지)
        if (staffRepository.findByEmail("demoStaff@example.com").isEmpty()) {
            
            // 2. 비밀번호 암호화
            String rawPassword = "1234";
            String encodedPassword = passwordEncoder.encode(rawPassword);

            // 3. Staff 엔티티 생성 (Join Table 구조 반영)
            // User 엔티티의 생성자 또는 Setter를 사용합니다.
            KitchenStaff demoStaff = new KitchenStaff();
            
            // User 필드 설정 (부모 클래스 필드)
            demoStaff.setName("Demo Staff");
            demoStaff.setEmail("demoStaff@example.com");
            demoStaff.setPassword(encodedPassword); // 암호화된 비밀번호
            demoStaff.setPhoneNumber("010-1234-5678");
            demoStaff.setUserType("kitchen_staff"); // Joined Table 전략의 구분자 (DTYPE)
            
            // Staff 고유 필드 및 NOT NULL 필드 설정 (필요한 경우)

            // 4. 데이터베이스에 저장
            staffRepository.save(demoStaff);
            
            System.out.println("✅ Demo Staff Account created: demoStaff@example.com / 1234");
        }


        //메뉴데이터 초기화
        // [메뉴 데이터 초기화]
        // 프론트엔드의 하드코딩된 ID 순서(1, 2, 3, 4...)와 맞추기 위해 순서대로 저장합니다.
        if (menuItemRepository.count() == 0) {
            System.out.println("🍽️ 메뉴 데이터 초기화 시작...");

        // 1. Valentine Dinner Items
        menuItemRepository.saveAll(List.of(
            new MenuItem("🍷 Wine (1 glass)", new BigDecimal("12.99"), "Drinks", true, "valentine"),
            new MenuItem("🥩 Steak (1 portion)", new BigDecimal("25.99"), "Main", true, "valentine"),
            new MenuItem("💕 Heart decoration plate", new BigDecimal("0.00"), "Decoration", true, "valentine"),
            new MenuItem("🧻 Napkin", new BigDecimal("2.99"), "Etc", true, "valentine")
        ));

        // 2. French Dinner Items
        menuItemRepository.saveAll(List.of(
            new MenuItem("☕ Coffee (1 cup)", new BigDecimal("3.99"), "Drinks", true, "french"),
            new MenuItem("🍷 Wine (1 glass)", new BigDecimal("12.99"), "Drinks", true, "french"),
            new MenuItem("🥗 Salad (1 portion)", new BigDecimal("8.99"), "Sides", true, "french"),
            new MenuItem("🥩 Steak (1 portion)", new BigDecimal("25.99"), "Main", true, "french")
        ));

        // 3. English Dinner Items
        menuItemRepository.saveAll(List.of(
            new MenuItem("🍳 Scrambled Egg (1 portion)", new BigDecimal("5.99"), "Sides", true, "english"),
            new MenuItem("🥓 Bacon (3 slices)", new BigDecimal("1.99"), "Sides", true, "english"),
            new MenuItem("🍞 Bread (2 slices)", new BigDecimal("1.99"), "Bread", true, "english"),
            new MenuItem("🥩 Steak (1 portion)", new BigDecimal("25.99"), "Main", true, "english")
        ));

        // 4. Champagne Feast Items
        menuItemRepository.saveAll(List.of(
            new MenuItem("🍾 Champagne (1 bottle)", new BigDecimal("45.99"), "Drinks", true, "champagne"),
            new MenuItem("🥖 Baguette (4 pieces)", new BigDecimal("2.99"), "Bread", true, "champagne"),
            new MenuItem("☕ Coffee (1 pot)", new BigDecimal("6.99"), "Drinks", true, "champagne"),
            new MenuItem("🍷 Wine (1 glass)", new BigDecimal("12.99"), "Drinks", true, "champagne"),
            new MenuItem("🥩 Steak (1 portion)", new BigDecimal("25.99"), "Main", true, "champagne")
        ));

        // 5. Available Add-ons (공통 추가 메뉴, dinnerType = null)
        menuItemRepository.saveAll(List.of(
            new MenuItem("🍾 Extra Champagne (1 bottle)", new BigDecimal("45.99"), "Drinks", false, null),
            new MenuItem("🥖 Extra Baguette (2 pieces)", new BigDecimal("5.99"), "Bread", false, null),
            new MenuItem("☕ Extra Coffee (1 cup)", new BigDecimal("3.99"), "Drinks", false, null),
            new MenuItem("🍷 Extra Wine (1 glass)", new BigDecimal("12.99"), "Drinks", false, null),
            new MenuItem("🥩 Extra Steak (1 portion)", new BigDecimal("25.99"), "Main", false, null),
            new MenuItem("🥗 Extra Salad (1 portion)", new BigDecimal("8.99"), "Sides", false, null),
            new MenuItem("🍳 Extra Scrambled Egg", new BigDecimal("5.99"), "Sides", false, null),
            new MenuItem("🥓 Extra Bacon (3 slices)", new BigDecimal("5.99"), "Sides", false, null),
            new MenuItem("🍞 Extra Bread (2 slices)", new BigDecimal("3.99"), "Bread", false, null),
            new MenuItem("🍫 Dessert (Chocolate)", new BigDecimal("12.99"), "Dessert", false, null),
            new MenuItem("🍓 Dessert (Fruit)", new BigDecimal("10.99"), "Dessert", false, null)
        ));

            
            // ⚠️ 주의: 프론트엔드 Addon ID는 10번부터 시작하지만, 
            // DB Auto Increment는 5번부터 생성됩니다.
            // 테스트를 위해 일단 5~9번 더미 데이터를 넣거나, 프론트엔드 ID를 수정해야 합니다.
            // 여기서는 테스트용으로 'Extra Champagne'을 그냥 추가합니다 (ID 5번이 됨).
            menuItemRepository.save(new MenuItem("Extra Champagne", new BigDecimal("45.99"), "Drinks", false, "all"));
            
            System.out.println("✅ Demo Menu Items created.");
        }
    }
}