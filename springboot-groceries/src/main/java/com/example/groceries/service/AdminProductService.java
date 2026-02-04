package com.example.groceries.service;

import com.example.groceries.controller.dto.ProductCreateRequest;
import com.example.groceries.controller.dto.ProductUpdateRequest;
import com.example.groceries.controller.dto.VariantCreateRequest;
import com.example.groceries.controller.dto.VariantUpdateRequest;
import com.example.groceries.exception.ResourceNotFoundException;
import com.example.groceries.model.Category;
import com.example.groceries.model.ProductMaster;
import com.example.groceries.model.ProductVariant;
import com.example.groceries.repository.CategoryRepository;
import com.example.groceries.repository.ProductMasterRepository;
import com.example.groceries.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductMasterRepository productMasterRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public Long createProduct(ProductCreateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("request is required");
        }

        Category category = findCategoryOrThrow(request.getCategoryId());

        ProductMaster product = new ProductMaster();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setImageUrl(request.getImageUrl());
        product.setImages(request.getImages() != null ? request.getImages() : new ArrayList<>());
        product.setActive(request.getActive() != null ? request.getActive() : true);
        product.setCategory(category);

        ProductMaster saved = productMasterRepository.save(product);
        return saved.getId();
    }

    @Transactional
    public Long updateProduct(Long productId, ProductUpdateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("request is required");
        }

        ProductMaster product = findProductOrThrow(productId);

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        if (request.getImages() != null) product.setImages(request.getImages());
        if (request.getActive() != null) product.setActive(request.getActive());
        if (request.getCategoryId() != null) product.setCategory(findCategoryOrThrow(request.getCategoryId()));

        ProductMaster saved = productMasterRepository.save(product);
        return saved.getId();
    }

    @Transactional
    public void deleteProduct(Long productId) {
        ProductMaster product = findProductOrThrow(productId);
        productMasterRepository.delete(product);
    }

    @Transactional
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
    public Long updateVariant(Long variantId, VariantUpdateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("request is required");
        }

        ProductVariant variant = findVariantOrThrow(variantId);

        if (request.getVariantName() != null) variant.setVariantName(request.getVariantName());
        if (request.getUnit() != null) variant.setUnit(request.getUnit());
        if (request.getMrp() != null) variant.setMrp(request.getMrp());
        if (request.getDiscountPercent() != null) variant.setDiscountPercent(request.getDiscountPercent());
        if (request.getImageUrl() != null) variant.setImageUrl(request.getImageUrl());
        if (request.getStock() != null) variant.setStock(request.getStock());

        ProductVariant saved = productVariantRepository.save(variant);
        return saved.getId();
    }

    @Transactional
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
}
