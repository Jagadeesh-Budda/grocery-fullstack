package com.example.groceries.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

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

    @Column(name = "name")
    private String variantName;

    private BigDecimal mrp;

    @Column(name = "discount_percent")
    private Integer discountPercent;

    private String unit;

    @Column(name = "image_url")
    private String imageUrl;

    private Integer stock;

    public BigDecimal getPrice() {
        if (mrp == null) return BigDecimal.ZERO;
        if (discountPercent == null || discountPercent <= 0) return mrp;
        
        BigDecimal discountAmount = mrp.multiply(new BigDecimal(discountPercent))
                .divide(new BigDecimal(100), 2, java.math.RoundingMode.HALF_UP);
        return mrp.subtract(discountAmount);
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_master_id", nullable = false) // Matches your DB foreign key
    @JsonBackReference
    private ProductMaster productMaster;
}