package com.example.groceries.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant variant;

    @NotNull
    @Column(name = "product_id", nullable = false)
    private Long productId;

    @NotBlank
    @Column(name = "product_name", nullable = false)
    private String productName;

    @NotBlank
    @Column(name = "variant_name", nullable = false)
    private String variantName;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer quantity;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    // ✅ Safety helper (recommended)
    @PrePersist
    @PreUpdate
    private void calculateSubtotal() {
        this.subtotal = price.multiply(BigDecimal.valueOf(quantity));
    }
}
