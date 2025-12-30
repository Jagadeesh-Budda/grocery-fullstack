package com.example.groceries.controller;

import com.example.groceries.controller.dto.DashboardStatsDTO;
import com.example.groceries.model.ProductMaster;
import com.example.groceries.service.AdminStatsService;
import com.example.groceries.service.DashboardService;
import com.example.groceries.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final DashboardService dashboardService;
    private final AdminStatsService adminStatsService;
    private final ProductService productService;

    // Constructor injection (BEST PRACTICE)
    public AdminController(
            DashboardService dashboardService,
            AdminStatsService adminStatsService,
            ProductService productService
    ) {
        this.dashboardService = dashboardService;
        this.adminStatsService = adminStatsService;
        this.productService = productService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        return ResponseEntity.ok(adminStatsService.getDashboardStats());
    }

    @GetMapping("/dashboard/stats")
    public DashboardStatsDTO getDashboardStats() {
        return dashboardService.getDashboardStats(); // ✅ FIXED
    }

    @PostMapping("/product")
    public ResponseEntity<ProductMaster> addProduct(@RequestBody ProductMaster product) {
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
