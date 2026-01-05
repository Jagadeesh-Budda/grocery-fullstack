package com.example.groceries.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Enumerated(EnumType.STRING)
    private Role role;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;
    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    /**
     * @deprecated Use {@link com.example.groceries.service.UserService} to create users
     * to ensure password encoding and correct role assignment.
     */
    @Deprecated
    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
