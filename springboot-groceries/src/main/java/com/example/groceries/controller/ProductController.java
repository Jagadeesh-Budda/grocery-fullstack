package com.example.groceries.controller;

import com.example.groceries.controller.dto.ProductMasterDTO;
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

    @GetMapping
    public ResponseEntity<List<ProductMasterDTO>> getAllProducts() {
        List<ProductMasterDTO> products = productService.getAllProducts().stream()
                .map(productMapper::toMasterDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductMasterDTO> getProductById(@PathVariable Long id) {
        ProductMaster product = productService.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productMapper.toMasterDTO(product));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductMasterDTO>> getProductsByCategory(@PathVariable Long categoryId) {
        List<ProductMasterDTO> products = productService.getProductsByCategory(categoryId).stream()
                .map(productMapper::toMasterDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<ProductMasterDTO> saveProduct(@RequestBody ProductMasterDTO productDTO) {
        ProductMaster product = productMapper.toMasterEntity(productDTO);
        ProductMaster savedProduct = productService.saveProduct(product);
        return ResponseEntity.ok(productMapper.toMasterDTO(savedProduct));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
