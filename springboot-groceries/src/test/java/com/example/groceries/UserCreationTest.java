package com.example.groceries;

import com.example.groceries.model.Role;
import com.example.groceries.model.User;
import com.example.groceries.repository.UserRepository;
import com.example.groceries.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
@ActiveProfiles("test")
@Import({UserService.class, UserCreationTest.TestConfig.class})
class UserCreationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void testRegisterUserHasDefaultRoleAndEncodedPassword() {
        String username = "testuser_reg";
        String email = "testuser_reg@example.com";
        String password = "password123";

        User savedUser = userService.registerUser(username, email, password);

        assertNotNull(savedUser.getId());
        assertEquals(username, savedUser.getUsername());
        assertEquals(Role.ROLE_USER, savedUser.getRole());
        assertTrue(passwordEncoder.matches(password, savedUser.getPassword()));
        assertNotEquals(password, savedUser.getPassword());
    }

    @Test
    void testCreateAdminUserHasAdminRoleAndEncodedPassword() {
        String username = "testadmin_reg";
        String email = "testadmin_reg@example.com";
        String password = "adminpassword123";

        User savedUser = userService.createAdminUser(username, email, password);

        assertNotNull(savedUser.getId());
        assertEquals(username, savedUser.getUsername());
        assertEquals(Role.ROLE_ADMIN, savedUser.getRole());
        assertTrue(passwordEncoder.matches(password, savedUser.getPassword()));
    }

    @TestConfiguration
    static class TestConfig {
        @Bean
        PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }
    }
}
