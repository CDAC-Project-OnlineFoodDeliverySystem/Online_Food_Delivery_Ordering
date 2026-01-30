package com.fooddelivery.auth.service;

import com.fooddelivery.auth.controller.AuthenticationRequest;
import com.fooddelivery.auth.controller.RegisterRequest;
import com.fooddelivery.auth.controller.UserDTO;
import com.fooddelivery.auth.model.User;
import com.fooddelivery.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        if (user != null) {
            repository.save(user);
            return new AuthResponse(
                    jwtService.generateToken(user),
                    toUserDTO(user));
        }
        throw new RuntimeException("Failed to register user");
    }

    public AuthResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();

        if (user != null) {
            return new AuthResponse(
                    jwtService.generateToken(user),
                    toUserDTO(user));
        }
        throw new RuntimeException("User not found");
    }

    private UserDTO toUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .role(user.getRole())
                .build();
    }

    public static class AuthResponse {
        public final String token;
        public final UserDTO user;

        public AuthResponse(String token, UserDTO user) {
            this.token = token;
            this.user = user;
        }
    }
}
