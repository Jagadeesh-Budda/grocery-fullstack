package com.example.groceries.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "product_masters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    private Boolean active;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category; // This fixes "Cannot resolve method getCategory"

    @OneToMany(mappedBy = "productMaster")
    @JsonManagedReference
    private List<ProductVariant> variants;
}