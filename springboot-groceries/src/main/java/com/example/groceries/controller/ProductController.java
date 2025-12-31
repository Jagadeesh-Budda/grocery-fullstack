package com.example.groceries.controller;

import com.example.groceries.controller.dto.ProductListView;
import com.example.groceries.controller.dto.ProductMasterDTO;
import com.example.groceries.controller.dto.ProductVariantDTO;
import com.example.groceries.model.ProductMaster;
import com.example.groceries.service.ProductService;
import com.example.groceries.service.mapper.ProductMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;
    private final ProductMapper productMapper;

    public ProductController(ProductService productService, ProductMapper productMapper) {
        this.productService = productService;
        this.productMapper = productMapper;
    }

    /* ================= PAGINATED LIST (UI) ================= */
    @GetMapping
    public ResponseEntity<List<ProductListView>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(productService.getProducts(page, size));
    }
    @GetMapping("/count")
    public ResponseEntity<Long> getVariantCount() {
        return ResponseEntity.ok(productService.getVariantCount());
    }

    /* ================= ALL PRODUCTS (ADMIN / INTERNAL) ================= */
    @GetMapping("/list")
    public ResponseEntity<List<ProductVariantDTO>> getAllProducts() {
        List<ProductVariantDTO> products = productService.getAllProducts()
                .stream()
                .map(productMapper::toVariantDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(products);
    }

    /* ================= PRODUCT BY ID ================= */
    @GetMapping("/{id}")
    public ResponseEntity<ProductMasterDTO> getProductById(@PathVariable Long id) {
        ProductMaster product = productService.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productMapper.toMasterDTO(product));
    }

    /* ================= PRODUCTS BY CATEGORY ================= */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductMasterDTO>> getProductsByCategory(
            @PathVariable Long categoryId
    ) {
        List<ProductMasterDTO> products = productService.getProductsByCategory(categoryId)
                .stream()
                .map(productMapper::toMasterDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(products);
    }

    /* ================= CREATE / UPDATE ================= */
    @PostMapping
    public ResponseEntity<ProductMasterDTO> saveProduct(
            @RequestBody ProductMasterDTO productDTO
    ) {
        ProductMaster product = productMapper.toMasterEntity(productDTO);
        ProductMaster savedProduct = productService.saveProduct(product);
        return ResponseEntity.ok(productMapper.toMasterDTO(savedProduct));
    }

    /* ================= DELETE ================= */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
