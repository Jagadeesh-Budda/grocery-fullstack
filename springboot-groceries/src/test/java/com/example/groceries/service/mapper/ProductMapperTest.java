/*package com.example.groceries.service.mapper;

import com.example.groceries.controller.dto.GroupedProductDTO;
import com.example.groceries.controller.dto.ProductVariantDTO;
import com.example.groceries.model.ProductMaster;
import com.example.groceries.model.ProductVariant;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ProductMapperTest {

    private final ProductMapper productMapper = new ProductMapper();

    @Test
    void toGroupedDTOs_shouldGroupVariantsByMaster() {
        // Arrange
        ProductMaster master1 = new ProductMaster();
        master1.setId(1L);
        master1.setName("Master 1");
        master1.setImageUrl("image1.png");

        ProductMaster master2 = new ProductMaster();
        master2.setId(2L);
        master2.setName("Master 2");
        master2.setImageUrl("image2.png");

        ProductVariant v1 = new ProductVariant();
        v1.setId(1L);
        v1.setVariantName("V1");
        v1.setPrice(new BigDecimal("10.00"));
        v1.setProductMaster(master1);

        ProductVariant v2 = new ProductVariant();
        v2.setId(2L);
        v2.setVariantName("V2");
        v2.setPrice(new BigDecimal("15.00"));
        v2.setProductMaster(master1);

        ProductVariant v3 = new ProductVariant();
        v3.setId(3L);
        v3.setVariantName("V3");
        v3.setPrice(new BigDecimal("20.00"));
        v3.setProductMaster(master2);

        List<ProductVariant> variants = Arrays.asList(v1, v2, v3);

        // Act
        List<GroupedProductDTO> groupedDTOs = productMapper.toGroupedDTOs(variants);

        // Assert
        assertNotNull(groupedDTOs);
        assertEquals(2, groupedDTOs.size());

        GroupedProductDTO g1 = groupedDTOs.stream()
                .filter(g -> g.getMasterName().equals("Master 1"))
                .findFirst()
                .orElseThrow();
        assertEquals("image1.png", g1.getImagePath());
        assertEquals(2, g1.getVariants().size());

        GroupedProductDTO g2 = groupedDTOs.stream()
                .filter(g -> g.getMasterName().equals("Master 2"))
                .findFirst()
                .orElseThrow();
        assertEquals("image2.png", g2.getImagePath());
        assertEquals(1, g2.getVariants().size());
    }

    @Test
    void toGroupedDTO_shouldMapMasterToGroupedDTO() {
        // Arrange
        ProductMaster master = new ProductMaster();
        master.setId(1L);
        master.setName("Master 1");
        master.setImageUrl("image1.png");

        ProductVariant v1 = new ProductVariant();
        v1.setId(1L);
        v1.setVariantName("V1");
        v1.setPrice(new BigDecimal("10.00"));
        v1.setProductMaster(master);

        master.setVariants(List.of(v1));

        // Act
        GroupedProductDTO dto = productMapper.toGroupedDTO(master);

        // Assert
        assertNotNull(dto);
        assertEquals("Master 1", dto.getMasterName());
        assertEquals("image1.png", dto.getImagePath());
        assertEquals(1, dto.getVariants().size());
        assertEquals("V1", dto.getVariants().get(0).getVariantName());
    }
}
*/