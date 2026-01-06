package com.example.groceries.service.mapper;

import com.example.groceries.controller.dto.GroupedProductDTO;
import com.example.groceries.controller.dto.ProductDetailDTO;
import com.example.groceries.controller.dto.ProductVariantDTO;
import com.example.groceries.model.Category;
import com.example.groceries.model.ProductMaster;
import com.example.groceries.model.ProductVariant;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ProductMapperTest {

    private final ProductMapper productMapper = new ProductMapper();

    @Test
    void toVariantDTO_shouldMapStock() {
        ProductVariant variant = new ProductVariant();
        variant.setId(1L);
        variant.setVariantName("500g");
        variant.setMrp(new BigDecimal("50.00"));
        variant.setDiscountPercent(10);
        variant.setStock(100);

        ProductVariantDTO dto = productMapper.toVariantDTO(variant);

        assertEquals(100, dto.getStock());
    }

    @Test
    void toDetailDTO_shouldMapMultipleImagesAndCategory() {
        Category category = new Category();
        category.setName("Fruits");

        ProductMaster master = new ProductMaster();
        master.setId(1L);
        master.setName("Apple");
        master.setDescription("Fresh apple");
        master.setCategory(category);
        master.setImageUrl("main.png");
        master.setImages(List.of("img1.png", "img2.png"));

        ProductDetailDTO dto = productMapper.toDetailDTO(master);

        assertEquals(1L, dto.getId());
        assertEquals("Apple", dto.getName());
        assertEquals("Fresh apple", dto.getDescription());
        assertEquals("Fruits", dto.getCategory());
        assertEquals("main.png", dto.getImageUrl());
        assertEquals(2, dto.getImages().size());
        assertTrue(dto.getImages().contains("img1.png"));
    }

    @Test
    void toGroupedDTO_shouldMapMasterToGroupedDTO() {
        ProductMaster master = new ProductMaster();
        master.setId(1L);
        master.setName("Master 1");
        master.setActive(true);

        ProductVariant v1 = new ProductVariant();
        v1.setId(1L);
        v1.setVariantName("V1");
        v1.setMrp(new BigDecimal("10.00"));
        v1.setProductMaster(master);

        master.setVariants(List.of(v1));

        GroupedProductDTO dto = productMapper.toGroupedDTO(master);

        assertNotNull(dto);
        assertEquals("Master 1", dto.getName());
        assertEquals(1, dto.getVariants().size());
        assertEquals("V1", dto.getVariants().get(0).getVariantName());
    }
}