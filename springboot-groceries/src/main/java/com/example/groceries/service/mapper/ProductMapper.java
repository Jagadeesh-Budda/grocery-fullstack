package com.example.groceries.service.mapper;

import com.example.groceries.controller.dto.ProductMasterDTO;
import com.example.groceries.controller.dto.ProductVariantDTO;
import com.example.groceries.model.Category;
import com.example.groceries.model.ProductMaster;
import com.example.groceries.model.ProductVariant;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ProductMapper {

    public ProductMasterDTO toMasterDTO(ProductMaster master) {
        if (master == null) return null;

        ProductMasterDTO dto = new ProductMasterDTO();
        dto.setId(master.getId());
        dto.setName(master.getName());
        dto.setDescription(master.getDescription());
        dto.setImageUrl(master.getImageUrl());
        dto.setActive(master.getActive());
        if (master.getCategory() != null) {
            dto.setCategoryId(master.getCategory().getId());
        }

        if (master.getVariants() != null) {
            dto.setVariants(master.getVariants().stream()
                    .map(this::toVariantDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    public ProductVariantDTO toVariantDTO(ProductVariant variant) {
        if (variant == null) return null;

        ProductVariantDTO dto = new ProductVariantDTO();
        dto.setId(variant.getId());
        dto.setName(variant.getName());
        dto.setPrice(variant.getPrice());
        dto.setStock(variant.getStock());
        dto.setSku(variant.getSku());

        return dto;
    }

    public ProductMaster toMasterEntity(ProductMasterDTO dto) {
        if (dto == null) return null;

        ProductMaster master = new ProductMaster();
        master.setId(dto.getId());
        master.setName(dto.getName());
        master.setDescription(dto.getDescription());
        master.setImageUrl(dto.getImageUrl());
        master.setActive(dto.getActive());

        if (dto.getCategoryId() != null) {
            Category category = new Category();
            category.setId(dto.getCategoryId());
            master.setCategory(category);
        }

        if (dto.getVariants() != null) {
            master.setVariants(dto.getVariants().stream()
                    .map(vDto -> {
                        ProductVariant v = toVariantEntity(vDto);
                        v.setProductMaster(master);
                        return v;
                    })
                    .collect(Collectors.toList()));
        }

        return master;
    }

    public ProductVariant toVariantEntity(ProductVariantDTO dto) {
        if (dto == null) return null;

        ProductVariant variant = new ProductVariant();
        variant.setId(dto.getId());
        variant.setName(dto.getName());
        variant.setPrice(dto.getPrice());
        variant.setStock(dto.getStock());
        variant.setSku(dto.getSku());

        return variant;
    }
}
