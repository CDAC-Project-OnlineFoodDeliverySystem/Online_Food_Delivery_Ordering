package com.fooddelivery.auth.controller;

import com.fooddelivery.auth.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

        private final AuthenticationService service;

        @PostMapping("/register")
        public ResponseEntity<?> register(
                        @RequestBody RegisterRequest request) {
                try {
                        var authResponse = service.register(request);
                        return ResponseEntity.ok(AuthenticationResponse.builder()
                                        .token(authResponse.token)
                                        .user(authResponse.user)
                                        .build());
                } catch (RuntimeException e) {
                        e.printStackTrace(); // Log the error to console
                        return ResponseEntity.badRequest()
                                        .body(java.util.Collections.singletonMap("message", e.getMessage()));
                }
        }

        @PostMapping("/login")
        public ResponseEntity<AuthenticationResponse> login(
                        @RequestBody AuthenticationRequest request) {
                var authResponse = service.authenticate(request);
                return ResponseEntity.ok(AuthenticationResponse.builder()
                                .token(authResponse.token)
                                .user(authResponse.user)
                                .build());
        }
}
