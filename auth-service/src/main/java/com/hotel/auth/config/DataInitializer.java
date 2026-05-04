package com.hotel.auth.config;

import com.hotel.auth.model.Hotel;
import com.hotel.auth.model.Role;
import com.hotel.auth.model.User;
import com.hotel.auth.repository.HotelRepository;
import com.hotel.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Seeds the database with default users and hotels on first startup.
 * Idempotent — skips any entry that already exists.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedHotels();
    }

    // ── Users ─────────────────────────────────────────────────────────────────

    private void seedUsers() {
        seedUser("admin", "admin123", Role.ADMIN);
        seedUser("user",  "user123",  Role.USER);
    }

    private void seedUser(String username, String rawPassword, Role role) {
        if (userRepository.findByUsername(username).isPresent()) {
            log.info("User '{}' already exists — skipping seed.", username);
            return;
        }
        userRepository.save(User.builder()
                .username(username)
                .password(passwordEncoder.encode(rawPassword))
                .role(role)
                .build());
        log.info("Seeded user '{}' with role '{}'.", username, role);
    }

    // ── Hotels ────────────────────────────────────────────────────────────────

    private void seedHotels() {
        seedHotel("Grand Palace",   149.99, dates("2025-08-01","2025-08-02","2025-08-03","2025-08-04","2025-08-05"));
        seedHotel("Ocean Breeze",   89.50,  dates("2025-08-01","2025-08-03","2025-08-10","2025-08-15","2025-08-20"));
        seedHotel("Mountain Lodge", 199.00, dates("2025-08-05","2025-08-06","2025-08-07","2025-08-08","2025-08-09"));
    }

    private void seedHotel(String name, double price, List<String> availableDates) {
        if (hotelRepository.existsByName(name)) {
            log.info("Hotel '{}' already exists — skipping seed.", name);
            return;
        }
        hotelRepository.save(Hotel.builder()
                .name(name)
                .price(price)
                .availableDates(availableDates)
                .build());
        log.info("Seeded hotel '{}' at ${}/night.", name, price);
    }

    private List<String> dates(String... d) {
        return new ArrayList<>(Arrays.asList(d)); // mutable list — dates are removed on booking
    }
}

