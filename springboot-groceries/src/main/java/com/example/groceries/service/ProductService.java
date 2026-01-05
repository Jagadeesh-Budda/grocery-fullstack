package com.example.groceries.service;

import com.example.groceries.controller.dto.GroupedProductDTO;
import com.example.groceries.controller.dto.ProductVariantDTO;
import com.example.groceries.controller.dto.UserProductDTO;
import com.example.groceries.model.ProductMaster;
import com.example.groceries.model.ProductVariant;
import com.example.groceries.repository.ProductMasterRepository;
import com.example.groceries.repository.ProductVariantRepository;
import com.example.groceries.service.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductMasterRepository productMasterRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductMapper productMapper;

    /* =========================
       USER SHOP PRODUCTS
       ========================= */
    public Page<UserProductDTO> getUserProducts(Pageable pageable) {
        Page<ProductVariant> page =
                productVariantRepository.findActiveVariants(pageable);

        return page.map(productMapper::toUserProductDTO);
    }

    /* =========================
       GROUPED PRODUCTS (ADMIN / USER)
       ========================= */
    public Page<GroupedProductDTO> getGroupedProducts(Pageable pageable) {
        Page<ProductMaster> page = productMasterRepository.findAll(pageable);
        return page.map(productMapper::toGroupedDTO);
    }
    public Page<ProductVariantDTO> getAllVariantsForAdmin(Pageable pageable) {
        return productVariantRepository.findAll(pageable)
                .map(productMapper::toVariantDTO);
    }

    /* =========================
       ADMIN SAVE
       ========================= */
    @Transactional
    public ProductMaster saveProduct(ProductMaster product) {
        return productMasterRepository.save(product);
    }

    /* =========================
       ADMIN DELETE
       ========================= */
    @Transactional
    public void deleteProduct(Long id) {
        productMasterRepository.deleteById(id);
    }
}
