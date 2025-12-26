package com.example.groceries.service.mapper;

import com.example.groceries.controller.dto.ProductDTO;
import com.example.groceries.model.Product;

public class ProductMapper {

    public static ProductDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setImageUrl(product.getImageUrl());
        dto.setAvailable(product.getAvailable());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
        }
        return dto;
    }

    public static Product toEntity(ProductDTO dto) {
        if (dto == null) {
            return null;
        }
        Product product = new Product();
        product.setId(dto.getId());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setImageUrl(dto.getImageUrl());
        product.setAvailable(dto.getAvailable());
        // categoryId is not mapped back to a full Category entity here 
        // as per "DO NOT perform database lookups" rule.
        return product;
    }
}
