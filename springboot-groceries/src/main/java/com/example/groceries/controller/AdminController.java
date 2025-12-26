package com.example.groceries.controller;

import com.example.groceries.controller.dto.DashboardStatsDTO;
import com.example.groceries.model.Product;
import com.example.groceries.service.AdminStatsService;
import com.example.groceries.service.CategoryService;
import com.example.groceries.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final AdminStatsService adminStatsService;

    public AdminController(ProductService productService, CategoryService categoryService, AdminStatsService adminStatsService) {
        this.productService = productService;
        this.categoryService = categoryService;
        this.adminStatsService = adminStatsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", productService.getAllProducts().size());
        stats.put("totalCategories", categoryService.getAllCategories().size());
        stats.put("status", "Active");
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        return ResponseEntity.ok(adminStatsService.getDashboardStats());
    }

    @PostMapping("/product")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.saveProduct(product));
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/test")
    public String adminOnly() {
        return "Admin access granted";
    }
}
