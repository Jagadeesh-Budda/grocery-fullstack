package com.example.groceries.controller.dto;

import java.math.BigDecimal;

public interface ProductListView {

    Long getProductId();
    String getProductName();
    String getCategory();
    Long getVariantId();
    String getVariantName();
    BigDecimal getPrice();
}

