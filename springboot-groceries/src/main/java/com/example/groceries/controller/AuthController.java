package com.example.groceries.controller;

import com.example.groceries.controller.dto.LoginRequest;
import com.example.groceries.controller.dto.RegisterRequest;
import com.example.groceries.model.Role;
import com.example.groceries.model.User;
import com.example.groceries.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
                          BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid username or password"));
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid username or password"));
        }

        return ResponseEntity.ok(
                Map.of(
                        "message", "Login successful",
                        "role", user.getRole(),
                        "username", user.getUsername()
                )
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Username already exists"));
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_USER);

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Registration successful"));
    }
}
