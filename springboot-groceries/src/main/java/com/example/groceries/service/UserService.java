package com.example.groceries.service;

import com.example.groceries.model.Role;
import com.example.groceries.model.User;
import com.example.groceries.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User registerUser(String username, String email, String password) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.ROLE_USER); // Default role
        return userRepository.save(user);
    }

    public User createAdminUser(String username, String email, String password) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.ROLE_ADMIN); // Explicitly ROLE_ADMIN
        return userRepository.save(user);
    }

    public User saveUser(User user) {
        // Ensure password is encoded if it's not already (though ideally we use register/createAdmin)
        // For existing users, if password changed, it should be encoded. 
        // But for simplicity of this task, we assume new users go through above methods.
        return userRepository.save(user);
    }
}
