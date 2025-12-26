package com.example.groceries.config;

import com.example.groceries.model.User;
import com.example.groceries.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UserInitializer {

    @Bean
    CommandLineRunner initializeUsers(UserService userService) {
        return args -> {
            // Check if admin user exists
            if (userService.findByUsername("admin").isEmpty()) {
                System.out.println("Creating default admin user...");
                userService.createAdminUser("admin", "admin@example.com", "admin123");
                System.out.println("Default admin user created: admin / admin123");
            } else {
                System.out.println("Admin user already exists");
            }

            // Check if a test user exists
            if (userService.findByUsername("user").isEmpty()) {
                System.out.println("Creating default test user...");
                userService.registerUser("user", "user@example.com", "user123");
                System.out.println("Default test user created: user / user123");
            } else {
                System.out.println("Test user already exists");
            }
        };
    }
}
