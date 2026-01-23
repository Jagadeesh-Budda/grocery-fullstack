package com.example.groceries.service.mapper;

import com.example.groceries.controller.dto.GroupedProductDTO;
import com.example.groceries.controller.dto.ProductDetailDTO;
import com.example.groceries.controller.dto.ProductVariantDTO;
import com.example.groceries.controller.dto.UserProductDTO;
import com.example.groceries.model.ProductMaster;
import com.example.groceries.model.ProductVariant;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    /* =========================
       VARIANT → VARIANT DTO
       ========================= */
    public ProductVariantDTO toVariantDTO(ProductVariant variant) {
        if (variant == null) return null;

        return new ProductVariantDTO(
                variant.getId(),
                variant.getVariantName(),
                variant.getMrp(),
                variant.getDiscountPercent(),
                variant.getPrice(), // 🔥 already calculated price
                variant.getImageUrl(),
                variant.getStock()
        );
    }

    /* =========================
       MASTER → DETAIL DTO
       ========================= */
    public ProductDetailDTO toDetailDTO(ProductMaster master) {
        if (master == null) return null;

        return new ProductDetailDTO(
                master.getId(),
                master.getName(),
                master.getDescription(),
                master.getCategory() != null
                        ? master.getCategory().getName()
                        : "Uncategorized",
                master.getImageUrl(),
                master.getImages(),
                master.getVariants() == null
                        ? List.of()
                        : master.getVariants()
                        .stream()
                        .map(this::toVariantDTO)
                        .collect(Collectors.toList())
        );
    }

    /* =========================
       VARIANT → USER SHOP DTO
       ========================= */
    public UserProductDTO toUserProductDTO(ProductVariant variant) {
        if (variant == null) return null;

        ProductMaster master = variant.getProductMaster();

        return new UserProductDTO(
                master.getId(),
                variant.getId(),
                master.getName(),
                master.getCategory() != null
                        ? master.getCategory().getName()
                        : "Uncategorized",
                variant.getUnit(),
                variant.getMrp(),
                variant.getDiscountPercent(),
                variant.getPrice(), // 🔥 correct selling price
                variant.getImageUrl() != null
                        ? variant.getImageUrl()
                        : master.getImageUrl()
        );
    }

    /* =========================
       MASTER → GROUPED DTO
       ========================= */
    /*public GroupedProductDTO toGroupedDTO(ProductMaster product) {

        // ✅ CORE FIX: calculate display price for listing
        BigDecimal displayPrice = product.getVariants() == null
                ? BigDecimal.ZERO
                : product.getVariants().stream()
                .map(ProductVariant::getPrice) // 🔥 uses existing logic
                .filter(Objects::nonNull)
                .min(BigDecimal::compareTo)     // lowest selling price
                .orElse(BigDecimal.ZERO);

        GroupedProductDTO dto = new GroupedProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setActive(product.getActive());
        dto.setVariants(
                product.getVariants() == null
                        ? List.of()
                        : product.getVariants()
                        .stream()
                        .map(this::toVariantDTO)
                        .collect(Collectors.toList())
        );

        // ✅ THIS IS WHAT FIXES ₹0.00
        dto.setDisplayPrice(displayPrice);

        return dto;
    }*/

    /* =========================
       VARIANT DTO → ENTITY
       ========================= */
    public ProductVariant toVariantEntity(ProductVariantDTO dto) {
        if (dto == null) return null;

        ProductVariant variant = new ProductVariant();
        variant.setId(dto.getVariantId());
        variant.setVariantName(dto.getVariantName());
        variant.setMrp(dto.getMrp());
        variant.setDiscountPercent(dto.getDiscountPercent());
        variant.setImageUrl(dto.getImageUrl());
        return variant;
    }
}
