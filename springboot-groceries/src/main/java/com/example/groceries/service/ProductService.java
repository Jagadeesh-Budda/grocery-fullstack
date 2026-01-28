package com.example.groceries.service;

import com.example.groceries.controller.dto.GroupedProductDTO;
import com.example.groceries.controller.dto.ProductDetailDTO;
import com.example.groceries.controller.dto.ProductVariantDTO;
import com.example.groceries.controller.dto.UserProductDTO;
import com.example.groceries.model.Cart;
import com.example.groceries.model.CartItem;
import com.example.groceries.model.ProductMaster;
import com.example.groceries.model.ProductVariant;
import com.example.groceries.repository.CartRepository;
import com.example.groceries.repository.ProductMasterRepository;
import com.example.groceries.repository.ProductVariantRepository;
import com.example.groceries.service.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductMasterRepository productMasterRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CartRepository cartRepository;
    private final ProductMapper productMapper;

    /* =========================
       USER SHOP PRODUCTS
       ========================= */
    public Page<UserProductDTO> getUserProducts(Pageable pageable) {
        Page<ProductVariant> page =
                productVariantRepository.findActiveVariants(pageable);

        return page.map(productMapper::toUserProductDTO);
    }

    public Page<UserProductDTO> getProductsByDiscount(Integer discountThreshold, Pageable pageable) {
        return productVariantRepository.findByDiscountPercentGreaterThanEqual(discountThreshold, pageable)
                .map(productMapper::toUserProductDTO);
    }

    public ProductDetailDTO getProductDetail(Long id) {
        ProductMaster product = productMasterRepository.findByIdWithVariants(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return productMapper.toDetailDTO(product);
    }


    public List<UserProductDTO> getRecommendations(Long productId, Long userId) {
        ProductMaster product = productMasterRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getCategory() == null) {
            return Collections.emptyList();
        }

        List<ProductMaster> sameCategoryProducts = productMasterRepository.findByCategoryId(product.getCategory().getId());

        Set<Long> productsInCart = Collections.emptySet();
        if (userId != null) {
            productsInCart = cartRepository.findByUserId(userId)
                    .map(Cart::getItems)
                    .orElse(Collections.emptyList())
                    .stream()
                    .map(item -> item.getProductVariant().getProductMaster().getId())
                    .collect(Collectors.toSet());
        }

        final Set<Long> finalProductsInCart = productsInCart;
        return sameCategoryProducts.stream()
                .filter(pm -> !pm.getId().equals(productId))
                .filter(pm -> !finalProductsInCart.contains(pm.getId()))
                .filter(pm -> pm.getActive() != null && pm.getActive())
                .flatMap(pm -> pm.getVariants().stream())
                .limit(5)
                .map(productMapper::toUserProductDTO)
                .collect(Collectors.toList());
    }

    /* =========================
       GROUPED PRODUCTS (ADMIN / USER)
       ========================= */
    public Page<GroupedProductDTO> getGroupedProducts(String categoryName, Pageable pageable) {
        String normalizedCategory =
                (categoryName == null || categoryName.isBlank())
                        ? null
                        : categoryName.toLowerCase();

        return productMasterRepository.findGroupedProducts(
                normalizedCategory,
                pageable
        );
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
