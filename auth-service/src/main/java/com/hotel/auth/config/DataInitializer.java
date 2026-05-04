package com.hotel.auth.config;

import com.hotel.auth.model.Role;
import com.hotel.auth.model.User;
import com.hotel.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds the database with default users on first startup.
 * Skips insertion if the users already exist — safe to run repeatedly.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUser("admin", "admin123", Role.ADMIN);
        seedUser("user",  "user123",  Role.USER);
    }

    private void seedUser(String username, String rawPassword, Role role) {
        if (userRepository.findByUsername(username).isPresent()) {
            log.info("User '{}' already exists — skipping seed.", username);
            return;
        }

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(rawPassword))
                .role(role)
                .build();

        userRepository.save(user);
        log.info("Seeded user '{}' with role '{}'.", username, role);
    }
}
