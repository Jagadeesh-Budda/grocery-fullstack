package com.example.groceries.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Pattern(
            regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$",
            message = "slug must be lowercase letters, numbers, and hyphens"
    )
    @Column(name = "slug", length = 255, unique = true)
    private String slug;

    @NotBlank
    @Column(nullable = false, length = 1000)
    private String description;

    @NotBlank
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @NotNull
    @ElementCollection
    @CollectionTable(
            name = "product_images",
            joinColumns = @JoinColumn(name = "product_id", nullable = false)
    )
    @Column(name = "image_url", nullable = false)
    private List<String> images = new ArrayList<>();

    @NotNull
    @Column(nullable = false)
    private Boolean is_active = true;

        @NotNull
        @Min(0)
        @Max(100000)
        @Column(name = "low_stock_threshold", nullable = false)
        private Integer lowStockThreshold = 5;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(
            mappedBy = "productMaster",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private List<ProductVariant> variants = new ArrayList<>();
}
