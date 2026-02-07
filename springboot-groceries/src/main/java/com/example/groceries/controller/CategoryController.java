package com.example.groceries.controller;

import com.example.groceries.model.Category;
import com.example.groceries.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/categories", "/api/categories"})
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CategoryController {

    private final CategoryService categoryService;

    // PUBLIC
    @GetMapping
    public ResponseEntity<List<Category>> getAll() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
}