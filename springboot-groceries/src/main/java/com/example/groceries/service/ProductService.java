package com.example.groceries.service;

import com.example.groceries.controller.dto.ProductListView;
import com.example.groceries.model.ProductMaster;
import com.example.groceries.model.ProductVariant;
import com.example.groceries.repository.ProductListingRepository;
import com.example.groceries.repository.ProductMasterRepository;
import com.example.groceries.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 1. Add this import

import java.util.List;
@Service
public class ProductService {

    private final ProductMasterRepository productMasterRepository;
    private final ProductListingRepository productListingRepository;
    private final ProductVariantRepository productVariantRepository;

    public ProductService(
            ProductMasterRepository productMasterRepository,
            ProductListingRepository productListingRepository,
            ProductVariantRepository productVariantRepository
    ) {
        this.productMasterRepository = productMasterRepository;
        this.productListingRepository = productListingRepository;
        this.productVariantRepository = productVariantRepository;
    }

    /* ---------------- PAGINATED PRODUCT LIST (NEW) ---------------- */

    @Transactional(readOnly = true)
    public List<ProductListView> getProducts(int page, int size) {
        int offset = page * size;
        return productListingRepository.findProducts(size, offset);
    }

    /* ---------------- EXISTING METHODS (RESTORED) ---------------- */

    @Transactional(readOnly = true)
    public List<ProductVariant> getAllProducts() {
        return productVariantRepository.findAll();
    }
    @Transactional(readOnly = true)
    public long getVariantCount() {
        return productListingRepository.countVariants();
    }

    @Transactional(readOnly = true)
    public ProductMaster getProductById(Long id) {
        return productMasterRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<ProductMaster> getProductsByCategory(Long categoryId) {
        return productMasterRepository.findByCategoryId(categoryId);
    }

    @Transactional
    public ProductMaster saveProduct(ProductMaster product) {
        return productMasterRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        productMasterRepository.deleteById(id);

    }
}
