package com.example.groceries.controller.dto;

import java.io.Serializable;

public class CategoryDTO implements Serializable {
    private Long id;
    private String name;
    private String imageUrl;
    private Boolean active;

    public CategoryDTO() {
    }

    public CategoryDTO(Long id, String name, String imageUrl, Boolean active) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
