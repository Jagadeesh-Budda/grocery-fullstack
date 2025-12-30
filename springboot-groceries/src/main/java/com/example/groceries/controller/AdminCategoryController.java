package com.example.groceries.controller;

import com.example.groceries.model.Category;
import com.example.groceries.repository.CategoryRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminCategoryController {

    private final CategoryRepository categoryRepository;

    public AdminCategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // 1️⃣ Get all categories
    @GetMapping
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    // 2️⃣ Create category
    @PostMapping
    public Category create(@RequestBody Category category) {
        return categoryRepository.save(category);
    }

    // 3️⃣ Update category
    @PutMapping("/{id}")
    public Category update(
            @PathVariable Long id,
            @RequestBody Category updated
    ) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(updated.getName());
        category.setImageUrl(updated.getImageUrl());

        return categoryRepository.save(category);
    }

    // 4️⃣ Delete category
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categoryRepository.deleteById(id);
    }
}
