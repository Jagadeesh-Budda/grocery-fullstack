package com.example.groceries.controller.dto;

import java.util.List;

public class UserResponseDTO {
    private boolean authenticated;
    private String username;
    private List<String> roles;

    public UserResponseDTO() {}

    public UserResponseDTO(boolean authenticated, String username, List<String> roles) {
        this.authenticated = authenticated;
        this.username = username;
        this.roles = roles;
    }

    public boolean isAuthenticated() {
        return authenticated;
    }

    public void setAuthenticated(boolean authenticated) {
        this.authenticated = authenticated;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
