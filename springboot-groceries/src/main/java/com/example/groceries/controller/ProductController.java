package com.example.groceries.controller;

import com.example.groceries.controller.dto.GroupedProductDTO;
import com.example.groceries.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@CrossOrigin
public class ProductController {

    private final ProductService productService;

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
}
