package com.example.groceries.service;

import com.example.groceries.controller.dto.ProductDetailDTO;
import com.example.groceries.controller.dto.UserProductDTO;
import com.example.groceries.model.*;
import com.example.groceries.repository.CartRepository;
import com.example.groceries.repository.ProductMasterRepository;
import com.example.groceries.repository.ProductVariantRepository;
import com.example.groceries.service.mapper.ProductMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductMasterRepository productMasterRepository;
    @Mock
    private ProductVariantRepository productVariantRepository;
    @Mock
    private CartRepository cartRepository;
    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductService productService;

    private ProductMaster productMaster;
    private Category category;

    static class TestProductMaster extends ProductMaster {
        public void setIsActive(Boolean active) {
            this.setIs_active(active);
        }
    }

    static class TestCategory extends Category {
        public void setIsActive(Boolean active) {
            this.setIs_active(active);
        }
    }

    @BeforeEach
    void setUp() {
        category = new TestCategory();
        category.setId(1L);
        category.setName("Vegetables");

        productMaster = new TestProductMaster();
        productMaster.setId(1L);
        productMaster.setName("Tomato");
        productMaster.setCategory(category);
        ((TestProductMaster) productMaster).setIsActive(true);
        productMaster.setVariants(new ArrayList<>());
    }

    @Test
    void getProductDetail_ShouldReturnDetailDTO() {
        when(productMasterRepository.findByIdWithVariants(1L)).thenReturn(Optional.of(productMaster));
        ProductDetailDTO detailDTO = new ProductDetailDTO();
        detailDTO.setId(1L);
        when(productMapper.toDetailDTO(productMaster)).thenReturn(detailDTO);

        ProductDetailDTO result = productService.getProductDetail(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(productMasterRepository).findByIdWithVariants(1L);
    }

    @Test
    void getRecommendations_ShouldExcludeCurrentProductAndCartItems() {
        ProductMaster rec1 = new TestProductMaster();
        rec1.setId(2L);
        rec1.setCategory(category);
        ((TestProductMaster) rec1).setIsActive(true);
        ProductVariant v1 = new ProductVariant();
        v1.setId(10L);
        v1.setProductMaster(rec1);
        rec1.setVariants(List.of(v1));

        ProductMaster rec2 = new TestProductMaster();
        rec2.setId(3L);
        rec2.setCategory(category);
        ((TestProductMaster) rec2).setIsActive(true);
        ProductVariant v2 = new ProductVariant();
        v2.setId(11L);
        v2.setProductMaster(rec2);
        rec2.setVariants(List.of(v2));

        when(productMasterRepository.findById(1L)).thenReturn(Optional.of(productMaster));
        when(productMasterRepository.findByCategoryId(1L)).thenReturn(List.of(productMaster, rec1, rec2));

        // Cart contains rec2
        Cart cart = new Cart();
        CartItem item = new CartItem();
        item.setProductVariant(v2);
        cart.setItems(List.of(item));
        when(cartRepository.findByUserId(100L)).thenReturn(Optional.of(cart));

        UserProductDTO dto1 = new UserProductDTO();
        dto1.setProductId(2L);
        when(productMapper.toUserProductDTO(v1)).thenReturn(dto1);

        List<UserProductDTO> results = productService.getRecommendations(1L, 100L);

        assertEquals(1, results.size());
        assertEquals(2L, results.get(0).getProductId());
    }
}
