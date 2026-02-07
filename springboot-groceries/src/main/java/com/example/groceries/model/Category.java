package com.example.groceries.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Locale;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String slug;

    @NotBlank
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(nullable = false)
    private Boolean is_active = true;

    @PrePersist
    void prePersist() {
        if (slug == null || slug.isBlank()) {
            slug = slugify(name);
        }
    }

    private static String slugify(String input) {
        if (input == null) return null;
        String value = input.trim().toLowerCase(Locale.ROOT);
        value = value.replaceAll("[^a-z0-9]+", "-");
        value = value.replaceAll("-+", "-");
        value = value.replaceAll("(^-)|(-$)", "");
        return value.isBlank() ? null : value;
    }
}

