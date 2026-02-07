package com.example.groceries.controller.dto.store;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStoreDTO {
    private Long id;
    private String code;
    private String name;
    private Boolean isActive;
}
