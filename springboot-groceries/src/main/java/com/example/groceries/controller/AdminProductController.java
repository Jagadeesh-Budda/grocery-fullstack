package com.example.groceries.controller;

import com.example.groceries.controller.dto.ProductCreateRequest;
import com.example.groceries.controller.dto.ProductUpdateRequest;
import com.example.groceries.controller.dto.VariantCreateRequest;
import com.example.groceries.controller.dto.VariantUpdateRequest;
import com.example.groceries.service.AdminProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminProductController {

    /**
     * TODO(security): enforce admin role for /api/admin/** endpoints.
     */
    private final AdminProductService adminProductService;

    @PostMapping
    public ResponseEntity<Long> createProduct(@RequestBody ProductCreateRequest request) {
        return ResponseEntity.ok(adminProductService.createProduct(request));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Long> updateProduct(
            @PathVariable Long productId,
            @RequestBody ProductUpdateRequest request
    ) {
        return ResponseEntity.ok(adminProductService.updateProduct(productId, request));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        adminProductService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{productId}/variants")
    public ResponseEntity<Long> createVariant(
            @PathVariable Long productId,
            @RequestBody VariantCreateRequest request
    ) {
        return ResponseEntity.ok(adminProductService.createVariant(productId, request));
    }

    @PutMapping("/variants/{variantId}")
    public ResponseEntity<Long> updateVariant(
            @PathVariable Long variantId,
            @RequestBody VariantUpdateRequest request
    ) {
        return ResponseEntity.ok(adminProductService.updateVariant(variantId, request));
    }

    @DeleteMapping("/variants/{variantId}")
    public ResponseEntity<Void> deleteVariant(@PathVariable Long variantId) {
        adminProductService.deleteVariant(variantId);
        return ResponseEntity.noContent().build();
    }
}
