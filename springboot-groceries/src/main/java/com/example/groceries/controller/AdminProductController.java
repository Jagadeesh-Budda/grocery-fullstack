package com.example.groceries.controller;

import com.example.groceries.controller.dto.ProductMasterDTO;
import com.example.groceries.controller.dto.ProductVariantDTO;
import com.example.groceries.model.ProductMaster;
import com.example.groceries.model.ProductVariant;
import com.example.groceries.service.ProductService;
import com.example.groceries.service.mapper.ProductMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/products")
public class AdminProductController {

    private final ProductService productService;
    private final ProductMapper productMapper;

    public AdminProductController(ProductService productService, ProductMapper productMapper) {
        this.productService = productService;
        this.productMapper = productMapper;
    }

    @PostMapping
    public ResponseEntity<ProductMasterDTO> createProduct(@RequestBody ProductMasterDTO productDTO) {
        ProductMaster product = productMapper.toMasterEntity(productDTO);
        ProductMaster savedProduct = productService.saveProduct(product);
        return new ResponseEntity<>(productMapper.toMasterDTO(savedProduct), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProductVariantDTO>> getAllProducts() {
        List<ProductVariantDTO> products = productService.getAllProducts().stream()
                .map(productMapper::toVariantDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductMasterDTO> getProductById(@PathVariable Long id) {
        ProductMaster product = productService.getProductById(id);
        if (product != null) {
            return new ResponseEntity<>(productMapper.toMasterDTO(product), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductMasterDTO> updateProduct(@PathVariable Long id, @RequestBody ProductMasterDTO productDTO) {
        ProductMaster existingProduct = productService.getProductById(id);
        if (existingProduct != null) {
            ProductMaster productToUpdate = productMapper.toMasterEntity(productDTO);
            productToUpdate.setId(id);
            ProductMaster updatedProduct = productService.saveProduct(productToUpdate);
            return new ResponseEntity<>(productMapper.toMasterDTO(updatedProduct), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        ProductMaster existingProduct = productService.getProductById(id);
        if (existingProduct != null) {
            productService.deleteProduct(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
