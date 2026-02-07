package com.example.groceries.service;

import com.example.groceries.controller.dto.ProductCreateRequest;
import com.example.groceries.controller.dto.ProductMasterDTO;
import com.example.groceries.controller.dto.ProductUpdateRequest;
import com.example.groceries.controller.dto.ProductVariantDTO;
import com.example.groceries.controller.dto.VariantCreateRequest;
import com.example.groceries.controller.dto.VariantUpdateRequest;
import com.example.groceries.exception.ResourceNotFoundException;
import com.example.groceries.audit.AdminAuditMutation;
import com.example.groceries.model.Category;
import com.example.groceries.model.ProductMaster;
import com.example.groceries.model.ProductVariant;
import com.example.groceries.repository.CategoryRepository;
import com.example.groceries.repository.ProductMasterRepository;
import com.example.groceries.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductMasterRepository productMasterRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryTransactionService inventoryTransactionService;

    @Transactional(readOnly = true)
    public Page<ProductMasterDTO> listProducts(String q, Boolean active, Pageable pageable) {
        Page<ProductMaster> page = productMasterRepository.findAdminProducts(q, active, pageable);
        return page.map(pm -> toMasterDTO(pm, false));
    }

    @Transactional(readOnly = true)
    public ProductMasterDTO getProduct(Long productId) {
        ProductMaster product = productMasterRepository.findByIdWithVariantsAndCategory(productId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductMaster not found: " + productId));
        return toMasterDTO(product, true);
    }

    @Transactional
    @AdminAuditMutation(
            entity = "ProductMaster",
            entityClass = ProductMaster.class,
            entityIdAfter = "#result",
            operation = AdminAuditMutation.Operation.CREATE
    )
    public Long createProduct(ProductCreateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("request is required");
        }

        Category category = findCategoryOrThrow(request.getCategoryId());

        ProductMaster product = new ProductMaster();
        product.setName(request.getName());
        if (request.getSlug() != null) product.setSlug(request.getSlug());
        product.setDescription(request.getDescription());
        product.setImageUrl(request.getImageUrl());
        product.setImages(request.getImages() != null ? request.getImages() : new ArrayList<>());
        product.setIs_active((request.getActive() != null ? request.getActive() : true));
        if (request.getLowStockThreshold() != null) product.setLowStockThreshold(request.getLowStockThreshold());
        product.setCategory(category);

        ProductMaster saved = productMasterRepository.save(product);
        return saved.getId();
    }

    @Transactional
    @AdminAuditMutation(
            entity = "ProductMaster",
            entityClass = ProductMaster.class,
            entityIdBefore = "#productId",
            entityIdAfter = "#productId",
            operation = AdminAuditMutation.Operation.UPDATE
    )
    public Long updateProduct(Long productId, ProductUpdateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("request is required");
        }

        ProductMaster product = findProductOrThrow(productId);

        if (request.getName() != null) product.setName(request.getName());
        if (request.getSlug() != null) product.setSlug(request.getSlug());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        if (request.getImages() != null) product.setImages(request.getImages());
        if (request.getActive() != null) product.setIs_active(request.getActive());
        if (request.getLowStockThreshold() != null) product.setLowStockThreshold(request.getLowStockThreshold());
        if (request.getCategoryId() != null) product.setCategory(findCategoryOrThrow(request.getCategoryId()));

        ProductMaster saved = productMasterRepository.save(product);
        return saved.getId();
    }

    @Transactional
    @AdminAuditMutation(
            entity = "ProductMaster",
            entityClass = ProductMaster.class,
            entityIdBefore = "#productId",
            entityIdAfter = "#productId",
            operation = AdminAuditMutation.Operation.DELETE
    )
    public void deleteProduct(Long productId) {
        ProductMaster product = findProductOrThrow(productId);
        productMasterRepository.delete(product);
    }

    @Transactional
    @AdminAuditMutation(
            entity = "ProductVariant",
            entityClass = ProductVariant.class,
            entityIdAfter = "#result",
            operation = AdminAuditMutation.Operation.CREATE
    )
    public Long createVariant(Long productId, VariantCreateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("request is required");
        }

        ProductMaster product = findProductOrThrow(productId);

        ProductVariant variant = new ProductVariant();
        variant.setVariantName(request.getVariantName());
        variant.setUnit(request.getUnit());
        variant.setMrp(request.getMrp());
        variant.setDiscountPercent(request.getDiscountPercent() != null ? request.getDiscountPercent() : 0);
        variant.setImageUrl(request.getImageUrl());
        variant.setStock(request.getStock() != null ? request.getStock() : 0);
        variant.setProductMaster(product);

        // Keep both sides consistent.
        if (product.getVariants() != null) {
            product.getVariants().add(variant);
        }

        ProductVariant saved = productVariantRepository.save(variant);
        return saved.getId();
    }

    @Transactional
    @AdminAuditMutation(
            entity = "ProductVariant",
            entityClass = ProductVariant.class,
            entityIdBefore = "#variantId",
            entityIdAfter = "#variantId",
            operation = AdminAuditMutation.Operation.UPDATE
    )
    public Long updateVariant(Long variantId, VariantUpdateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("request is required");
        }

        ProductVariant variant = findVariantOrThrow(variantId);

        Integer stockBefore = variant.getStock() != null ? variant.getStock() : 0;

        if (request.getVariantName() != null) variant.setVariantName(request.getVariantName());
        if (request.getUnit() != null) variant.setUnit(request.getUnit());
        if (request.getMrp() != null) variant.setMrp(request.getMrp());
        if (request.getDiscountPercent() != null) variant.setDiscountPercent(request.getDiscountPercent());
        if (request.getImageUrl() != null) variant.setImageUrl(request.getImageUrl());
        if (request.getStock() != null) variant.setStock(request.getStock());

        ProductVariant saved = productVariantRepository.save(variant);

        if (request.getStock() != null) {
            int stockAfter = saved.getStock() != null ? saved.getStock() : 0;
            if (stockAfter != stockBefore) {
                inventoryTransactionService.record(
                        com.example.groceries.model.InventoryTransactionType.ADMIN_ADJUSTMENT,
                        saved.getId(),
                        null,
                        stockAfter - stockBefore,
                        stockBefore,
                        stockAfter,
                        null
                );
            }
        }
        return saved.getId();
    }

    @Transactional
    @AdminAuditMutation(
            entity = "ProductVariant",
            entityClass = ProductVariant.class,
            entityIdBefore = "#variantId",
            entityIdAfter = "#variantId",
            operation = AdminAuditMutation.Operation.DELETE
    )
    public void deleteVariant(Long variantId) {
        ProductVariant variant = findVariantOrThrow(variantId);
        productVariantRepository.delete(variant);
    }

    private ProductMaster findProductOrThrow(Long productId) {
        return productMasterRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductMaster not found: " + productId));
    }

    private ProductVariant findVariantOrThrow(Long variantId) {
        return productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant not found: " + variantId));
    }

    private Category findCategoryOrThrow(Long categoryId) {
        if (categoryId == null) {
            throw new IllegalArgumentException("categoryId is required");
        }
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));
    }

    private ProductMasterDTO toMasterDTO(ProductMaster product, boolean includeVariants) {
        if (product == null) return null;

        return new ProductMasterDTO(
                product.getId(),
                product.getName(),
            product.getSlug(),
                product.getDescription(),
                product.getImageUrl(),
                product.getImages(),
                product.getIs_active(),
            product.getLowStockThreshold(),
                product.getCategory() != null ? product.getCategory().getId() : null,
                product.getCategory() != null ? product.getCategory().getName() : null,
                includeVariants
                        ? (product.getVariants() == null
                        ? java.util.List.of()
                        : product.getVariants().stream()
                        .map(v -> new ProductVariantDTO(
                                v.getId(),
                                v.getVariantName(),
                                v.getUnit(),
                                v.getMrp(),
                                v.getDiscountPercent(),
                                v.getPrice(),
                                v.getImageUrl(),
                                v.getStock()
                        ))
                        .toList())
                        : null
        );
    }
}
