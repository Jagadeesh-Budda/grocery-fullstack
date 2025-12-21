package com.example.groceries.config;

import com.example.groceries.model.Grocery;
import com.example.groceries.model.GroceryCategory;
import com.example.groceries.repository.GroceryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GroceryInitializer {

    @Bean
    CommandLineRunner initializeGroceries(GroceryRepository groceryRepository) {
        return args -> {
            // Skip if groceries already exist
            if (groceryRepository.count() > 0) {
                System.out.println("Groceries already initialized");
                return;
            }

            // Daily Essentials
            createGrocery(groceryRepository, "Rice", GroceryCategory.DAILY_ESSENTIALS.getDisplayName(), 50.00, 10);
            createGrocery(groceryRepository, "Wheat Flour", GroceryCategory.DAILY_ESSENTIALS.getDisplayName(), 45.00, 15);
            createGrocery(groceryRepository, "Sugar", GroceryCategory.DAILY_ESSENTIALS.getDisplayName(), 55.00, 20);
            createGrocery(groceryRepository, "Salt", GroceryCategory.DAILY_ESSENTIALS.getDisplayName(), 20.00, 25);
            createGrocery(groceryRepository, "Cooking Oil", GroceryCategory.DAILY_ESSENTIALS.getDisplayName(), 150.00, 12);
            createGrocery(groceryRepository, "Pulses (Dal)", GroceryCategory.DAILY_ESSENTIALS.getDisplayName(), 120.00, 8);
            createGrocery(groceryRepository, "Tea Leaves", GroceryCategory.DAILY_ESSENTIALS.getDisplayName(), 180.00, 5);
            createGrocery(groceryRepository, "Coffee", GroceryCategory.DAILY_ESSENTIALS.getDisplayName(), 250.00, 6);

            // Fruits
            createGrocery(groceryRepository, "Apple", GroceryCategory.FRUITS.getDisplayName(), 120.00, 30);
            createGrocery(groceryRepository, "Banana", GroceryCategory.FRUITS.getDisplayName(), 60.00, 40);
            createGrocery(groceryRepository, "Orange", GroceryCategory.FRUITS.getDisplayName(), 80.00, 25);
            createGrocery(groceryRepository, "Mango", GroceryCategory.FRUITS.getDisplayName(), 100.00, 20);
            createGrocery(groceryRepository, "Grapes", GroceryCategory.FRUITS.getDisplayName(), 150.00, 15);
            createGrocery(groceryRepository, "Watermelon", GroceryCategory.FRUITS.getDisplayName(), 40.00, 10);
            createGrocery(groceryRepository, "Strawberry", GroceryCategory.FRUITS.getDisplayName(), 200.00, 12);
            createGrocery(groceryRepository, "Papaya", GroceryCategory.FRUITS.getDisplayName(), 50.00, 18);

            // Vegetables
            createGrocery(groceryRepository, "Potato", GroceryCategory.VEGETABLES.getDisplayName(), 40.00, 50);
            createGrocery(groceryRepository, "Tomato", GroceryCategory.VEGETABLES.getDisplayName(), 60.00, 40);
            createGrocery(groceryRepository, "Onion", GroceryCategory.VEGETABLES.getDisplayName(), 50.00, 45);
            createGrocery(groceryRepository, "Carrot", GroceryCategory.VEGETABLES.getDisplayName(), 70.00, 30);
            createGrocery(groceryRepository, "Broccoli", GroceryCategory.VEGETABLES.getDisplayName(), 120.00, 15);
            createGrocery(groceryRepository, "Spinach", GroceryCategory.VEGETABLES.getDisplayName(), 50.00, 20);
            createGrocery(groceryRepository, "Capsicum", GroceryCategory.VEGETABLES.getDisplayName(), 80.00, 25);
            createGrocery(groceryRepository, "Cucumber", GroceryCategory.VEGETABLES.getDisplayName(), 40.00, 30);
            createGrocery(groceryRepository, "Cabbage", GroceryCategory.VEGETABLES.getDisplayName(), 30.00, 20);
            createGrocery(groceryRepository, "Cauliflower", GroceryCategory.VEGETABLES.getDisplayName(), 50.00, 18);

            // Beverages
            createGrocery(groceryRepository, "Milk", GroceryCategory.BEVERAGES.getDisplayName(), 60.00, 20);
            createGrocery(groceryRepository, "Orange Juice", GroceryCategory.BEVERAGES.getDisplayName(), 90.00, 15);
            createGrocery(groceryRepository, "Coca Cola", GroceryCategory.BEVERAGES.getDisplayName(), 50.00, 30);

            // Dairy
            createGrocery(groceryRepository, "Butter", GroceryCategory.DAIRY.getDisplayName(), 120.00, 10);
            createGrocery(groceryRepository, "Cheese", GroceryCategory.DAIRY.getDisplayName(), 180.00, 12);
            createGrocery(groceryRepository, "Yogurt", GroceryCategory.DAIRY.getDisplayName(), 80.00, 15);

            // Snacks
            createGrocery(groceryRepository, "Biscuits", GroceryCategory.SNACKS.getDisplayName(), 40.00, 25);
            createGrocery(groceryRepository, "Chips", GroceryCategory.SNACKS.getDisplayName(), 30.00, 30);
            createGrocery(groceryRepository, "Nuts", GroceryCategory.SNACKS.getDisplayName(), 250.00, 10);

            System.out.println("Sample groceries initialized successfully with categories: Daily Essentials, Fruits, Vegetables, and more!");
        };
    }

    private void createGrocery(GroceryRepository repository, String name, String category, double price, int quantity) {
        Grocery grocery = new Grocery();
        grocery.setName(name);
        grocery.setCategory(category);
        grocery.setPrice(price);
        grocery.setQuantity(quantity);
        repository.save(grocery);
    }
}


