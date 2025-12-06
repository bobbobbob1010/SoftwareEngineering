# Mr. Daebak Dinner Service Requirements

## 1. Business Requirements
"Mr. Daebak" has established a company that delivers excellent dinner banquets to customers' homes. Customers order dinners from the menu using the Mr. Daebak website, specifying delivery time, location, and credit card number. The banquet is then delivered.

**Slogan**: "Impress your husband, wife, mom, dad, or friend while staying comfortable at home on a special day."

### Menu Offerings
Mr. Daebak offers several types of dinners with special decorations. Orders can be placed individually for multiple people.

*   **Valentine Dinner**: Served with wine and steak, accompanied by napkins on a plate decorated with small hearts and cupids.
*   **French Dinner**: Served with a cup of coffee, a glass of wine, salad, and steak.
*   **English Dinner**: Served with scrambled eggs, bacon, bread, and steak.
*   **Champagne Feast Dinner**: Always a meal for 2 people. Includes 1 bottle of champagne, 4 baguettes, a coffee pot, wine, and steak.

### Serving Styles
Customers can specify the serving style. The price increases with the quality of the style.
**Constraint**: "Champagne Feast Dinner" can only be ordered in **Grand** or **Deluxe** styles.

*   **Simple Style**: Plastic plates and cups, paper napkins, served on a plastic tray. (If wine is included, plastic glasses).
*   **Grand Style**: Porcelain plates and cups, white cotton napkins, served on a wooden tray. (If wine is included, plastic glasses).
*   **Deluxe Style**: Small vase with flowers, porcelain plates and cups, linen napkins, served on a wooden tray. (If wine is included, glass goblets).

### Staff & Operations
*   **Staff**: 10 employees total. Working hours: 3:30 PM - 10:00 PM.
    *   5 Delivery Staff.
    *   5 Kitchen Staff (Preparation and Cooking).
*   **Inventory**:
    *   Liquor Store: Mr. Daebak buys good liquor immediately upon arrival (from a store next door).
    *   Other ingredients: Stored in the pantry, supplied twice a week.

### Order Flexibility
Customers generally order a set, but have flexibility:
*   Add items.
*   Change quantity of items.
*   Delete items.
    *   *Example*: Select Champagne Feast -> Change 1 bottle champagne to 2 -> Add baguette -> Remove coffee.

## 2. Software Requirements
The system supports Mr. Daebak's business with two main interfaces:

### A. Customer Interface
*   **Registration**: Name, Address, Contact Info (saved for discounts).
*   **Ordering Channels**:
    1.  Web or App (GUI).
    2.  **Voice Recognition**.
*   **Order History**: Logged in users see previous orders (Date, Dinner Content, Price, Delivery Time, Address) for quick re-ordering.

### B. Staff Interface
*   View and manage orders (Cooking, Delivery).
