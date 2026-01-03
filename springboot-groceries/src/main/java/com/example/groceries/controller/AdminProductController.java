package com.example.groceries.controller;

import com.example.groceries.controller.dto.ProductVariantDTO;
import com.example.groceries.model.ProductVariant;
import com.example.groceries.repository.ProductVariantRepository;
import com.example.groceries.service.mapper.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/products")
@CrossOrigin(origins = "http://localhost:5173") // ✅ Fixes the CORS block from your React port
public class AdminProductController {

    @Autowired
    private ProductVariantRepository variantRepository;

    @Autowired
    private ProductMapper productMapper;

    /**
     * Fetches paginated products.
     * React sends: ?page=0&size=8
     */
    @GetMapping
    @Transactional(readOnly = true) // ✅ Prevents LazyInitializationException
    public ResponseEntity<Page<ProductVariantDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {

        // 1. Define pagination details
        Pageable pageable = PageRequest.of(page, size);

        // 2. Fetch paginated entities and convert to DTOs
        // This creates the "content" wrapper your React app needs
        Page<ProductVariantDTO> productPage = variantRepository.findAll(pageable)
                .map(productMapper::toVariantDTO);

        return ResponseEntity.ok(productPage);
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<ProductVariantDTO> getProductById(@PathVariable Long id) {
        return variantRepository.findById(id)
                .map(productMapper::toVariantDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (variantRepository.existsById(id)) {
            variantRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}