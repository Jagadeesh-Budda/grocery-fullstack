package com.example.groceries.controller;

import com.example.groceries.controller.dto.ProductCreateRequest;
import com.example.groceries.controller.dto.ProductMasterDTO;
import com.example.groceries.controller.dto.ProductUpdateRequest;
import com.example.groceries.controller.dto.VariantCreateRequest;
import com.example.groceries.controller.dto.VariantUpdateRequest;
import com.example.groceries.service.AdminProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminProductController {

    private static final Logger log = LoggerFactory.getLogger(AdminProductController.class);

    private final AdminProductService adminProductService;

    @GetMapping
    public ResponseEntity<Page<ProductMasterDTO>> listProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String q,
        @RequestParam(required = false) Boolean active,
        Authentication authentication
    ) {
    int safeSize = Math.min(Math.max(size, 1), 100);
    PageRequest pageable = PageRequest.of(Math.max(page, 0), safeSize, Sort.by(Sort.Direction.ASC, "name"));
    Page<ProductMasterDTO> result = adminProductService.listProducts(q, active, pageable);

    log.info(
        "AUDIT admin_products_list admin={} page={} size={} q={} active={}",
        authentication != null ? authentication.getName() : "anonymous",
        page,
        safeSize,
        q,
        active
    );

    return ResponseEntity.ok(result);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductMasterDTO> getProduct(
        @PathVariable Long productId,
        Authentication authentication
    ) {
    ProductMasterDTO dto = adminProductService.getProduct(productId);
    log.info(
        "AUDIT admin_product_read admin={} productId={}",
        authentication != null ? authentication.getName() : "anonymous",
        productId
    );
    return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<Long> createProduct(
        @Valid @RequestBody ProductCreateRequest request,
        Authentication authentication
    ) {
    Long id = adminProductService.createProduct(request);
    log.info(
        "AUDIT admin_product_create admin={} productId={}",
        authentication != null ? authentication.getName() : "anonymous",
        id
    );
    return ResponseEntity.ok(id);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Long> updateProduct(
            @PathVariable Long productId,
        @Valid @RequestBody ProductUpdateRequest request,
        Authentication authentication
    ) {
    Long id = adminProductService.updateProduct(productId, request);
    log.info(
        "AUDIT admin_product_update admin={} productId={}",
        authentication != null ? authentication.getName() : "anonymous",
        productId
    );
    return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(
        @PathVariable Long productId,
        Authentication authentication
    ) {
        adminProductService.deleteProduct(productId);
    log.info(
        "AUDIT admin_product_delete admin={} productId={}",
        authentication != null ? authentication.getName() : "anonymous",
        productId
    );
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{productId}/variants")
    public ResponseEntity<Long> createVariant(
            @PathVariable Long productId,
            @RequestBody VariantCreateRequest request,
            Authentication authentication
    ) {
        Long id = adminProductService.createVariant(productId, request);
        log.info(
                "AUDIT admin_variant_create admin={} productId={} variantId={}",
                authentication != null ? authentication.getName() : "anonymous",
                productId,
                id
        );
        return ResponseEntity.ok(id);
    }

    @PutMapping("/variants/{variantId}")
    public ResponseEntity<Long> updateVariant(
            @PathVariable Long variantId,
            @RequestBody VariantUpdateRequest request,
            Authentication authentication
    ) {
        Long id = adminProductService.updateVariant(variantId, request);
        log.info(
                "AUDIT admin_variant_update admin={} variantId={}",
                authentication != null ? authentication.getName() : "anonymous",
                variantId
        );
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/variants/{variantId}")
    public ResponseEntity<Void> deleteVariant(
            @PathVariable Long variantId,
            Authentication authentication
    ) {
        adminProductService.deleteVariant(variantId);
        log.info(
                "AUDIT admin_variant_delete admin={} variantId={}",
                authentication != null ? authentication.getName() : "anonymous",
                variantId
        );
        return ResponseEntity.noContent().build();
    }
}
