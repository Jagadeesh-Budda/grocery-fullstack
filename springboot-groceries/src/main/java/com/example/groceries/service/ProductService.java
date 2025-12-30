package com.example.groceries.service;

import com.example.groceries.model.ProductMaster;
import com.example.groceries.repository.ProductMasterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 1. Add this import

import java.util.List;

@Service
public class ProductService {

    private final ProductMasterRepository productMasterRepository;

    public ProductService(ProductMasterRepository productMasterRepository) {
        this.productMasterRepository = productMasterRepository;
    }

    @Transactional(readOnly = true) // 2. Add this to your getter
    public List<ProductMaster> getAllProducts() {
        return productMasterRepository.findAll();
    }

    @Transactional(readOnly = true) // 3. Add this here too
    public ProductMaster getProductById(Long id) {
        return productMasterRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true) // 4. And here
    public List<ProductMaster> getProductsByCategory(Long categoryId) {
        return productMasterRepository.findByCategoryId(categoryId);
    }

    @Transactional // 5. Add without (readOnly = true) for saving
    public ProductMaster saveProduct(ProductMaster product) {
        return productMasterRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        productMasterRepository.deleteById(id);
    }
}