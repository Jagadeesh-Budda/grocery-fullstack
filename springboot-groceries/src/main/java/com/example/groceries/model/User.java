package com.example.groceries.model;

import jakarta.persistence.*;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;


@Entity
@Table(name = "users")
public class User {
    @Enumerated(EnumType.STRING)
    private Role role;
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;
    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    // constructors
    public User() {}

    /**
     * @deprecated Use {@link com.example.groceries.service.UserService} to create users
     * to ensure password encoding and correct role assignment.
     */
    @Deprecated
    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // getters & setters
    public Long getId() { return id; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }


    public void setPassword(String password) { this.password = password; }
}
