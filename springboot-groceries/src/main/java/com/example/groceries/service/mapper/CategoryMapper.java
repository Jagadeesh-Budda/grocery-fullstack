package com.example.groceries.service.mapper;

import com.example.groceries.controller.dto.CategoryDTO;
import com.example.groceries.model.Category;

public class CategoryMapper {

    public static CategoryDTO toDTO(Category category) {
        if (category == null) {
            return null;
        }
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setImageUrl(category.getImageUrl());
        dto.setActive(category.getActive());
        return dto;
    }

    public static Category toEntity(CategoryDTO dto) {
        if (dto == null) {
            return null;
        }
        Category category = new Category();
        category.setId(dto.getId());
        category.setName(dto.getName());
        category.setImageUrl(dto.getImageUrl());
        category.setActive(dto.getActive());
        return category;
    }
}
