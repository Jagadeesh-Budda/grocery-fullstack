package com.example.groceries.config;

import com.example.groceries.model.User;
import com.example.groceries.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(UserRepository userRepository) {

        return args -> {
            String adminUsername = "admin";
            String adminPassword = "admin"; // change later

            if (userRepository.existsByUsername(adminUsername)) {
                System.out.println("Admin user already exists");
                return;
            }

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setPassword(encoder.encode(adminPassword));

            userRepository.save(admin);

            System.out.println("Admin user created successfully");
        };
    }
}
