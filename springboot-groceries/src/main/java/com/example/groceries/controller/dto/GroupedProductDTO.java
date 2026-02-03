package com.example.groceries.controller.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupedProductDTO {

    private Long id;
    private String name;
    private String imageUrl;

    private Integer stock;
    private String unit;
    private String category;

    // MIN price across variants
    private BigDecimal startingPrice;
}
