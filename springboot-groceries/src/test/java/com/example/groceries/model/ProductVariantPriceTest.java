package com.example.groceries.model;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.assertEquals;

class ProductVariantPriceTest {

    @Test
    void testPriceCalculation() {
        ProductVariant variant = new ProductVariant();
        variant.setMrp(new BigDecimal("100.00"));
        variant.setDiscountPercent(10);
        
        // 100 - (100 * 0.1) = 90
        assertEquals(0, new BigDecimal("90.00").compareTo(variant.getPrice()));
    }

    @Test
    void testPriceCalculationWithHalfUpRounding() {
        ProductVariant variant = new ProductVariant();
        variant.setMrp(new BigDecimal("99.99"));
        variant.setDiscountPercent(15);
        
        // 99.99 * 0.15 = 14.9985 -> 15.00 (half up)
        // 99.99 - 15.00 = 84.99
        assertEquals(0, new BigDecimal("84.99").compareTo(variant.getPrice()));
    }

    @Test
    void testNoDiscount() {
        ProductVariant variant = new ProductVariant();
        variant.setMrp(new BigDecimal("50.00"));
        variant.setDiscountPercent(0);
        
        assertEquals(0, new BigDecimal("50.00").compareTo(variant.getPrice()));
    }

    @Test
    void testNullDiscount() {
        ProductVariant variant = new ProductVariant();
        variant.setMrp(new BigDecimal("50.00"));
        variant.setDiscountPercent(null);
        
        assertEquals(0, new BigDecimal("50.00").compareTo(variant.getPrice()));
    }
}
