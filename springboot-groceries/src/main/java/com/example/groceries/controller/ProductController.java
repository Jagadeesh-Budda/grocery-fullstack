package com.example.groceries.controller;

import com.example.groceries.controller.dto.GroupedProductDTO;
import com.example.groceries.controller.dto.ProductDetailDTO;
import com.example.groceries.controller.dto.UserProductDTO;
import com.example.groceries.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@CrossOrigin
public class ProductController {

    private final ProductService productService;

    /* =========================
       PRODUCT DETAILS & RECOMMENDATIONS
       ========================= */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> getProductDetail(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductDetail(id));
    }

    @GetMapping("/{id}/recommendations")
    public ResponseEntity<List<UserProductDTO>> getRecommendations(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(productService.getRecommendations(id, userId));
    }

    /* =========================
       GROUPED PRODUCTS (USER / ADMIN)
       ========================= */
    @GetMapping("/grouped")
    public ResponseEntity<Page<GroupedProductDTO>> getGroupedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                productService.getGroupedProducts(PageRequest.of(page, size))
        );
    }

    @GetMapping("/discount")
    public ResponseEntity<Page<UserProductDTO>> getProductsByDiscount(
            @RequestParam Integer threshold,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                productService.getProductsByDiscount(threshold, PageRequest.of(page, size))
        );
    }
}
