package com.example.groceries.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateRequest {
    private String name;
    private String description;
    private String imageUrl;
    private List<String> images;
    private Boolean active;
    private Long categoryId;
}
