package com.example.groceries.service.mapper;

import com.example.groceries.controller.dto.GroupedProductDTO;
import com.example.groceries.controller.dto.ProductVariantDTO;
import com.example.groceries.controller.dto.UserProductDTO;
import com.example.groceries.model.ProductMaster;
import com.example.groceries.model.ProductVariant;
import org.springframework.stereotype.Component;

import java.util.List;
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
                variant.getPrice(),
                variant.getImageUrl()
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
                master.getCategory() != null ? master.getCategory().getName() : "Uncategorized",
                variant.getUnit(),
                variant.getPrice(),
                variant.getImageUrl() != null ? variant.getImageUrl() : master.getImageUrl()
        );
    }

    /* =========================
       MASTER → GROUPED DTO
       ========================= */
    public GroupedProductDTO toGroupedDTO(ProductMaster master) {
        if (master == null) return null;

        return new GroupedProductDTO(
                master.getId(),
                master.getName(),
                master.getActive(),
                master.getVariants() == null
                        ? List.of()
                        : master.getVariants()
                        .stream()
                        .map(this::toVariantDTO)
                        .collect(Collectors.toList())
        );
    }

    /* =========================
       VARIANT DTO → ENTITY
       ========================= */
    public ProductVariant toVariantEntity(ProductVariantDTO dto) {
        if (dto == null) return null;

        ProductVariant variant = new ProductVariant();
        variant.setId(dto.getVariantId());
        variant.setVariantName(dto.getVariantName());
        variant.setPrice(dto.getPrice());
        variant.setImageUrl(dto.getImageUrl());
        return variant;
    }
}
