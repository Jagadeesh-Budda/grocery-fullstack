package com.example.groceries;

import com.example.groceries.model.Role;
import com.example.groceries.model.User;
import com.example.groceries.repository.UserRepository;
import com.example.groceries.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class UserCreationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testRegisterUserHasDefaultRoleAndEncodedPassword() {
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
    public void testCreateAdminUserHasAdminRoleAndEncodedPassword() {
        String username = "testadmin_reg";
        String email = "testadmin_reg@example.com";
        String password = "adminpassword123";

        User savedUser = userService.createAdminUser(username, email, password);

        assertNotNull(savedUser.getId());
        assertEquals(username, savedUser.getUsername());
        assertEquals(Role.ROLE_ADMIN, savedUser.getRole());
        assertTrue(passwordEncoder.matches(password, savedUser.getPassword()));
    }
}
