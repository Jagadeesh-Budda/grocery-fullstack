package com.example.groceries.controller;

import com.example.groceries.model.Category;
import com.example.groceries.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminCategoryController {

    private static final Logger log = LoggerFactory.getLogger(AdminCategoryController.class);

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<Category> create(@RequestBody Category category) {
        Category saved = categoryService.saveCategory(category);
        log.info("admin={} action=createCategory id={} name={}", currentUsername(), saved.getId(), saved.getName());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category updated) {
        Category category = categoryService.getCategoryById(id);
        if (category == null) {
            return ResponseEntity.notFound().build();
        }

        category.setName(updated.getName());
        category.setImageUrl(updated.getImageUrl());

        Category saved = categoryService.saveCategory(category);
        log.info("admin={} action=updateCategory id={} name={}", currentUsername(), saved.getId(), saved.getName());
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        log.info("admin={} action=deleteCategory id={}", currentUsername(), id);
        return ResponseEntity.noContent().build();
    }

    private String currentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return "anonymous";
        }
        return authentication.getName();
    }
}
