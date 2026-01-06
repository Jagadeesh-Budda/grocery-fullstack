package com.example.groceries.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
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
