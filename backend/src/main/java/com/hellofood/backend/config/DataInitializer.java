package com.hellofood.backend.config; // 설정 파일 패키지 (예시)

import com.hellofood.backend.domain.inventory.Inventory;
import com.hellofood.backend.domain.order.MenuItem;
import com.hellofood.backend.domain.order.Recipe;
import com.hellofood.backend.domain.user.Customer;
import com.hellofood.backend.domain.user.KitchenStaff;
import com.hellofood.backend.repository.CustomerRepository;
import com.hellofood.backend.repository.InventoryRepository;
import com.hellofood.backend.domain.user.Staff;
import com.hellofood.backend.repository.StaffRepository;
import com.hellofood.backend.repository.MenuItemRepository;
import com.hellofood.backend.repository.RecipeRepository;

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
    private final InventoryRepository inventoryRepository;
    private final RecipeRepository recipeRepository;
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
        // if (menuItemRepository.count() == 0) {
        //     System.out.println("🍽️ 메뉴 데이터 초기화 시작...");

        // // 1. Valentine Dinner Items
        // menuItemRepository.saveAll(List.of(
        //     new MenuItem("🍷 Wine (1 glass)", new BigDecimal("12.99"), "Drinks", true, "valentine"),
        //     new MenuItem("🥩 Steak (1 portion)", new BigDecimal("25.99"), "Main", true, "valentine"),
        //     new MenuItem("💕 Heart decoration plate", new BigDecimal("0.00"), "Decoration", true, "valentine"),
        //     new MenuItem("🧻 Napkin", new BigDecimal("2.99"), "Etc", true, "valentine")
        // ));

        // // 2. French Dinner Items
        // menuItemRepository.saveAll(List.of(
        //     new MenuItem("☕ Coffee (1 cup)", new BigDecimal("3.99"), "Drinks", true, "french"),
        //     new MenuItem("🍷 Wine (1 glass)", new BigDecimal("12.99"), "Drinks", true, "french"),
        //     new MenuItem("🥗 Salad (1 portion)", new BigDecimal("8.99"), "Sides", true, "french"),
        //     new MenuItem("🥩 Steak (1 portion)", new BigDecimal("25.99"), "Main", true, "french")
        // ));

        // // 3. English Dinner Items
        // menuItemRepository.saveAll(List.of(
        //     new MenuItem("🍳 Scrambled Egg (1 portion)", new BigDecimal("5.99"), "Sides", true, "english"),
        //     new MenuItem("🥓 Bacon (3 slices)", new BigDecimal("1.99"), "Sides", true, "english"),
        //     new MenuItem("🍞 Bread (2 slices)", new BigDecimal("1.99"), "Bread", true, "english"),
        //     new MenuItem("🥩 Steak (1 portion)", new BigDecimal("25.99"), "Main", true, "english")
        // ));

        // // 4. Champagne Feast Items
        // menuItemRepository.saveAll(List.of(
        //     new MenuItem("🍾 Champagne (1 bottle)", new BigDecimal("45.99"), "Drinks", true, "champagne"),
        //     new MenuItem("🥖 Baguette (4 pieces)", new BigDecimal("2.99"), "Bread", true, "champagne"),
        //     new MenuItem("☕ Coffee (1 cup)", new BigDecimal("6.99"), "Drinks", true, "champagne"),
        //     new MenuItem("🍷 Wine (1 glass)", new BigDecimal("12.99"), "Drinks", true, "champagne"),
        //     new MenuItem("🥩 Steak (1 portion)", new BigDecimal("25.99"), "Main", true, "champagne")
        // ));

        // // 5. Available Add-ons (공통 추가 메뉴, dinnerType = null)
        // menuItemRepository.saveAll(List.of(
        //     new MenuItem("🍾 Extra Champagne (1 bottle)", new BigDecimal("45.99"), "Drinks", false, null),
        //     new MenuItem("🥖 Extra Baguette (2 pieces)", new BigDecimal("5.99"), "Bread", false, null),
        //     new MenuItem("☕ Extra Coffee (1 cup)", new BigDecimal("3.99"), "Drinks", false, null),
        //     new MenuItem("🍷 Extra Wine (1 glass)", new BigDecimal("12.99"), "Drinks", false, null),
        //     new MenuItem("🥩 Extra Steak (1 portion)", new BigDecimal("25.99"), "Main", false, null),
        //     new MenuItem("🥗 Extra Salad (1 portion)", new BigDecimal("8.99"), "Sides", false, null),
        //     new MenuItem("🍳 Extra Scrambled Egg", new BigDecimal("5.99"), "Sides", false, null),
        //     new MenuItem("🥓 Extra Bacon (3 slices)", new BigDecimal("5.99"), "Sides", false, null),
        //     new MenuItem("🍞 Extra Bread (2 slices)", new BigDecimal("3.99"), "Bread", false, null),
        //     new MenuItem("🍫 Dessert (Chocolate)", new BigDecimal("12.99"), "Dessert", false, null),
        //     new MenuItem("🍓 Dessert (Fruit)", new BigDecimal("10.99"), "Dessert", false, null)
        // ));

            
        //     // ⚠️ 주의: 프론트엔드 Addon ID는 10번부터 시작하지만, 
        //     // DB Auto Increment는 5번부터 생성됩니다.
        //     // 테스트를 위해 일단 5~9번 더미 데이터를 넣거나, 프론트엔드 ID를 수정해야 합니다.
        //     // 여기서는 테스트용으로 'Extra Champagne'을 그냥 추가합니다 (ID 5번이 됨).
        //     menuItemRepository.save(new MenuItem("Extra Champagne", new BigDecimal("45.99"), "Drinks", false, "all"));
            
        //     System.out.println("✅ Demo Menu Items created.");
        // }
        // [기존 재료]
        // 판매가의 약 30%~40% 수준으로 원가(Cost) 책정

        
        
        
        if (inventoryRepository.count() == 0) {
            System.out.println("📦 재고 데이터 초기화 시작...");

            // 1. 메인/주류
            Inventory beef = inventoryRepository.save(new Inventory("Beef", 25, 10, "kg", "good", new BigDecimal("9.00")));
            Inventory champagne = inventoryRepository.save(new Inventory("Champagne", 12, 10, "bottles", "good", new BigDecimal("15.00")));
            Inventory wine = inventoryRepository.save(new Inventory("Wine", 8, 10, "bottles", "low", new BigDecimal("10.00")));

            // 2. 장식/기타 (무료 제공이더라도 원가는 발생)
            Inventory heartPlate = inventoryRepository.save(new Inventory("Heart decoration plate", 100, 10, "ea", "good", new BigDecimal("0.50")));
            Inventory napkin = inventoryRepository.save(new Inventory("Napkin", 500, 50, "ea", "good", new BigDecimal("0.50")));

            // 3. 음료/사이드 재료
            Inventory coffeeBeans = inventoryRepository.save(new Inventory("Coffee Beans", 50, 5, "cup", "good", new BigDecimal("0.80")));
            Inventory saladMix = inventoryRepository.save(new Inventory("Salad Mix", 30, 5, "portion", "good", new BigDecimal("2.50")));

            // 4. 조식/브런치 재료
            Inventory eggs = inventoryRepository.save(new Inventory("eggs", 100, 20, "ea", "good", new BigDecimal("0.20")));
            Inventory bacon = inventoryRepository.save(new Inventory("Bacon", 50, 10, "slices", "good", new BigDecimal("0.15")));
            Inventory breadSlices = inventoryRepository.save(new Inventory("Bread Slices", 100, 20, "slices", "good", new BigDecimal("0.10")));
            Inventory baguette = inventoryRepository.save(new Inventory("Baguette", 40, 5, "pieces", "good", new BigDecimal("0.20")));
            
            inventoryRepository.saveAll(List.of(
                beef, champagne, wine,
                heartPlate, napkin, coffeeBeans, saladMix, eggs, bacon, breadSlices, baguette
            ));
            
            // 생성자 순서: (itemName, quantityAvailable, minQuantity, unit, status)
            // 주의: 프론트엔드 데이터의 'min'은 생성자의 3번째 인자인 'minQuantity'로 들어갑니다.
            MenuItem vWine = new MenuItem("🍷 Wine (1 glass)", new BigDecimal("12.99"), "Drinks", true, "valentine");
            MenuItem vSteak = new MenuItem("🥩 Steak (1 portion)", new BigDecimal("25.99"), "Main", true, "valentine");
            MenuItem vHeart = new MenuItem("💕 Heart decoration plate", new BigDecimal("0.00"), "Decoration", true, "valentine");
            MenuItem vNapkin = new MenuItem("🧻 Napkin", new BigDecimal("2.99"), "Etc", true, "valentine");

            menuItemRepository.saveAll(List.of(vWine, vSteak, vHeart, vNapkin));

            // [Recipe - Valentine]
            recipeRepository.saveAll(List.of(
                new Recipe(vWine, wine, new BigDecimal("1")),       // Wine --> Wine x1
                new Recipe(vSteak, beef, new BigDecimal("1")),      // Steak --> Beef x1
                new Recipe(vHeart, heartPlate, new BigDecimal("1")),// Heart --> Heart x1
                new Recipe(vNapkin, napkin, new BigDecimal("1"))    // Napkin --> Napkin x1
            ));
            
            // --- 2. French Dinner ---
            MenuItem fCoffee = new MenuItem("☕ Coffee (1 cup)", new BigDecimal("3.99"), "Drinks", true, "french");
            MenuItem fWine = new MenuItem("🍷 Wine (1 glass)", new BigDecimal("12.99"), "Drinks", true, "french");
            MenuItem fSalad = new MenuItem("🥗 Salad (1 portion)", new BigDecimal("8.99"), "Sides", true, "french");
            MenuItem fSteak = new MenuItem("🥩 Steak (1 portion)", new BigDecimal("25.99"), "Main", true, "french");

            menuItemRepository.saveAll(List.of(fCoffee, fWine, fSalad, fSteak));

            // [Recipe - French]
            recipeRepository.saveAll(List.of(
                new Recipe(fCoffee, coffeeBeans, new BigDecimal("1")), // Coffee --> Coffee Beans x1
                new Recipe(fWine, wine, new BigDecimal("1")),          // Wine --> Wine x1
                new Recipe(fSalad, saladMix, new BigDecimal("1")),     // Salad --> Salad Mix x1
                new Recipe(fSteak, beef, new BigDecimal("1"))          // Steak --> Beef x1
            ));

            // --- 3. English Dinner ---
            MenuItem eEgg = new MenuItem("🍳 Scrambled Egg (1 portion)", new BigDecimal("5.99"), "Sides", true, "english");
            MenuItem eBacon = new MenuItem("🥓 Bacon (3 slices)", new BigDecimal("1.99"), "Sides", true, "english");
            MenuItem eBread = new MenuItem("🍞 Bread (2 slices)", new BigDecimal("1.99"), "Bread", true, "english");
            MenuItem eSteak = new MenuItem("🥩 Steak (1 portion)", new BigDecimal("25.99"), "Main", true, "english");

            menuItemRepository.saveAll(List.of(eEgg, eBacon, eBread, eSteak));

            // [Recipe - English]
            recipeRepository.saveAll(List.of(
                new Recipe(eEgg, eggs, new BigDecimal("2")),           // Egg --> eggs x2
                new Recipe(eBacon, bacon, new BigDecimal("3")),        // Bacon --> Bacon slices x3
                new Recipe(eBread, breadSlices, new BigDecimal("2")),  // Bread --> Bread Slices x2
                new Recipe(eSteak, beef, new BigDecimal("1"))          // Steak --> Beef x1
            ));

            // --- 4. Champagne Feast ---
            MenuItem cChampagne = new MenuItem("🍾 Champagne (1 bottle)", new BigDecimal("45.99"), "Drinks", true, "champagne");
            MenuItem cBaguette = new MenuItem("🥖 Baguette (4 pieces)", new BigDecimal("2.99"), "Bread", true, "champagne");
            MenuItem cCoffee = new MenuItem("☕ Coffee (1 cup)", new BigDecimal("6.99"), "Drinks", true, "champagne");
            MenuItem cWine = new MenuItem("🍷 Wine (1 glass)", new BigDecimal("12.99"), "Drinks", true, "champagne");
            MenuItem cSteak = new MenuItem("🥩 Steak (1 portion)", new BigDecimal("25.99"), "Main", true, "champagne");

            menuItemRepository.saveAll(List.of(cChampagne, cBaguette, cCoffee, cWine, cSteak));

            // [Recipe - Champagne]
            recipeRepository.saveAll(List.of(
                new Recipe(cChampagne, champagne, new BigDecimal("1")), // Champagne --> Champagne x1
                new Recipe(cBaguette, baguette, new BigDecimal("4")),   // Baguette --> Baguette x4 (4 pieces)
                new Recipe(cCoffee, coffeeBeans, new BigDecimal("1")),  // Coffee --> Coffee Beans x1
                new Recipe(cWine, wine, new BigDecimal("1")),           // Wine --> Wine x1
                new Recipe(cSteak, beef, new BigDecimal("1"))           // Steak --> Beef x1
            ));
            
            // --- 5. Add-ons (간단히 추가) ---
            // 레시피 없이 메뉴만 등록합니다 (필요 시 위와 같은 방식으로 레시피 추가 가능)
            // menuItemRepository.saveAll(List.of(
            //     new MenuItem("🍾 Extra Champagne", new BigDecimal("45.99"), "Drinks", false, null),
            //     new MenuItem("🥖 Extra Baguette", new BigDecimal("5.99"), "Bread", false, null),
            //     new MenuItem("☕ Extra Coffee", new BigDecimal("3.99"), "Drinks", false, null),
            //     new MenuItem("🍷 Extra Wine", new BigDecimal("12.99"), "Drinks", false, null),
            //     new MenuItem("🥩 Extra Steak", new BigDecimal("25.99"), "Main", false, null),
            //     new MenuItem("🍫 Dessert (Chocolate)", new BigDecimal("12.99"), "Dessert", false, null)
            // ));

            //
            MenuItem ChampagneAddon = new MenuItem("🍾 Extra Champagne (1 bottle)", new BigDecimal("45.99"), "Drinks", false, null);
            MenuItem BaguetteAddon = new MenuItem("🥖 Extra Baguette (2 pieces)", new BigDecimal("5.99"), "Bread", false, null);
            MenuItem CoffeeAddon = new MenuItem("☕ Extra Coffee (1 cup)", new BigDecimal("3.99"), "Drinks", false, null);
            MenuItem WineAddon = menuItemRepository.save(new MenuItem("🍷 Extra Wine (1 glass)", new BigDecimal("12.99"), "Drinks", false, null));
            MenuItem SteakAddon = menuItemRepository.save(new MenuItem("🥩 Extra Steak (1 portion)", new BigDecimal("25.99"), "Main", false, null));
            MenuItem SaladAddon = menuItemRepository.save(new MenuItem("🥗 Extra Salad (1 portion)", new BigDecimal("8.99"), "Sides", false, null));
            MenuItem EggAddon = menuItemRepository.save(new MenuItem("🍳 Extra Scrambled Egg", new BigDecimal("5.99"), "Sides", false, null));
            MenuItem BaconAddon = menuItemRepository.save(new MenuItem("🥓 Extra Bacon (3 slices)", new BigDecimal("5.99"), "Sides", false, null));
            MenuItem BreadAddon = menuItemRepository.save(new MenuItem("🍞 Extra Bread (2 slices)", new BigDecimal("3.99"), "Bread", false, null));

            menuItemRepository.saveAll(List.of(
                ChampagneAddon, BaguetteAddon, CoffeeAddon, WineAddon, SteakAddon, SaladAddon, EggAddon, BaconAddon, BreadAddon
            ));
            // [Recipe - extra Add-ons]
            recipeRepository.saveAll(List.of(
                new Recipe(ChampagneAddon, champagne, new BigDecimal("1")),
                new Recipe(BaguetteAddon, baguette, new BigDecimal("2")),   // 2 pieces
                new Recipe(CoffeeAddon, coffeeBeans, new BigDecimal("1")),
                new Recipe(WineAddon, wine, new BigDecimal("1")),
                new Recipe(SteakAddon, beef, new BigDecimal("1")),
                new Recipe(SaladAddon, saladMix, new BigDecimal("1")),
                new Recipe(EggAddon, eggs, new BigDecimal("2")),       // 계란 메뉴는 2알 소모
                new Recipe(BaconAddon, bacon, new BigDecimal("3")),    // 베이컨은 3장 소모
                new Recipe(BreadAddon, breadSlices, new BigDecimal("2")) // 빵은 2조각 소모
            ));

            // inventoryRepository.saveAll(List.of(
            //     // id: 1
            //     new Inventory("Beef", 25, 10, "kg", "good"),
            //     // id: 2
            //     new Inventory("Chicken", 15, 10, "kg", "good"),
            //     // id: 3
            //     new Inventory("Fish", 8, 10, "kg", "low"),
            //     // id: 4
            //     new Inventory("Salmon", 5, 8, "kg", "critical"),
            //     // id: 5
            //     new Inventory("Vegetables", 30, 15, "kg", "good"),
            //     // id: 6
            //     new Inventory("Champagne", 12, 10, "bottles", "good"),
            //     // id: 7
            //     new Inventory("Wine", 8, 10, "bottles", "low"),
            //     // id: 8
            //     new Inventory("Caviar", 2, 1, "kg", "good")
            // ));

            System.out.println("✅ Inventory data initialized.");
        }
    }

    
}