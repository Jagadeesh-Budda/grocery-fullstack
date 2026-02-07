package com.example.groceries.controller.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateRequest {
    private String name;
    @Pattern(
            regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$",
            message = "slug must be lowercase letters, numbers, and hyphens"
    )
    private String slug;
    private String description;
    private String imageUrl;
    private List<String> images;
    private Boolean active;
    @Min(0)
    @Max(100000)
    private Integer lowStockThreshold;
    private Long categoryId;
}
