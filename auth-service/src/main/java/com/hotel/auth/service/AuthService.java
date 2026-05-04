package com.hotel.auth.service;

import com.hotel.auth.config.JwtUtil;
import com.hotel.auth.dto.AuthResponse;
import com.hotel.auth.dto.LoginRequest;
import com.hotel.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    /**
     * Authenticates the user and returns a signed JWT with the user's role.
     * Throws BadCredentialsException (via AuthenticationManager) on invalid credentials.
     */
    public AuthResponse login(LoginRequest request) {
        // Delegates to DaoAuthenticationProvider — throws BadCredentialsException if invalid
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()));

        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .build();
    }
}
