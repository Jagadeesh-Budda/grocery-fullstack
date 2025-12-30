package com.example.groceries.config;

import com.example.groceries.model.Category;
import com.example.groceries.repository.CategoryRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategoryInitializer {

    private final CategoryRepository categoryRepository;

    public CategoryInitializer(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @PostConstruct
    public void init() {
        if (categoryRepository.count() == 0) {

            Category veg = new Category();
            veg.setName("Vegetables");
            veg.setImageUrl("vegetables.svg");

            Category fruits = new Category();
            fruits.setName("Fruits");
            fruits.setImageUrl("fruits.svg");

            Category dairy = new Category();
            dairy.setName("Dairy");
            dairy.setImageUrl("dairy.svg");

            Category bakery = new Category();
            bakery.setName("Bakery");
            bakery.setImageUrl("bakery.svg");

            Category beverages = new Category();
            beverages.setName("Beverages");
            beverages.setImageUrl("beverages.svg");

            categoryRepository.saveAll(
                    List.of(veg, fruits, dairy, bakery, beverages)
            );
        }
    }
}
