package com.example.groceries.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import jakarta.validation.constraints.DecimalMin;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "name", nullable = false)
    private String variantName;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal mrp;

    @NotNull
    @Min(0)
    @Max(100)
    @Column(name = "discount_percent", nullable = false)
    private Integer discountPercent = 0;

    @NotBlank
    @Column(nullable = false)
    private String unit;

    @NotBlank
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer stock = 0;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_master_id", nullable = false)
    @JsonBackReference
    private ProductMaster productMaster;

    public BigDecimal getPrice() {
        // 1. Safely handle the null by assigning to a local variable
        int discount = (discountPercent != null) ? discountPercent : 0;

        // 2. Use the local variable 'discount' here, NOT 'discountPercent'
        BigDecimal discountAmount = mrp
                .multiply(BigDecimal.valueOf(discount))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        return mrp.subtract(discountAmount);
    }
    }

