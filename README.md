# 💻 BACKEND STRUCTURE

이 문서는 HelloFood 백엔드 프로젝트의 주요 디렉토리 구조와 각 계층의 역할을 설명합니다.

---

## 📁 주요 디렉토리 구조

프로젝트의 핵심 로직은 `src/main/java/com/hellofood/backend` 패키지 아래에 계층별로 분리되어 있습니다.

---

### 📦 계층별 역할 및 구성 파일

| 계층 (패키지) | 역할 | 설명 | 구성 파일 예시 |
| :--- | :--- | :--- |
| **controller** | **Presentation Layer** (프레젠테이션 계층) | HTTP 요청을 받아 DTO를 Service로 전달하고 응답을 반환합니다. (UI(frontend)와 통신) | `AuthController.java`, `OrderController.java` |
| **service** | **Service Layer** (서비스 계층) | 핵심 비즈니스 로직(회원가입, 주문 등)을 구현합니다. | `AuthenticationService.java`, `OrderService.java` |
| **repository** | **Persistence Layer** (영속성 계층) | 엔티티를 DB에 저장 및 조회하는 작업을 담당합니다. | `UserRepository.java`, `OrderRepository.java` |
| **domain** | **Domain Layer** (도메인 계층) | 애플리케이션의 핵심 데이터 구조와 비즈니스 규칙을 포함합니다. | 하위 패키지 참조 |

---

### 🧱 domain 패키지 상세 구조

도메인 객체들은 기능별로 하위 패키지에 분류되어 관리됩니다.

* `domain/user`
    * `User.java`
    * `Customer.java`
    * `Staff.java`
* `domain/order` (💡 **새로운 하위 패키지**)
    * `Order.java`
    * `OrderItem.java`
    * `Cart.java`
    * `Payment.java`
    * `OrderStatus.java`
* `domain/inventory` (💡 **새로운 하위 패키지**)
    * `Inventory.java`
    * `MenuItem.java`
