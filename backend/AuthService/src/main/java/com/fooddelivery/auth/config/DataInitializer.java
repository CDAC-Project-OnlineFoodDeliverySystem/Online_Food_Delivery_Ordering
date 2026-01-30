package com.fooddelivery.auth.config;

import com.fooddelivery.auth.model.Role;
import com.fooddelivery.auth.model.User;
import com.fooddelivery.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner commandLineRunner() {
        return args -> {
            // Seed Admin User
            User admin = repository.findByEmail("admin@gmail.com").orElse(null);
            
            if (admin == null) {
                admin = User.builder()
                        .firstname("Platform")
                        .lastname("Admin")
                        .email("admin@gmail.com")
                        .role(Role.ADMIN)
                        .build();
            }
            
            // Always update password and role to ensure they match expected values
            admin.setPassword(passwordEncoder.encode("ADMIN"));
            admin.setRole(Role.ADMIN);
            repository.save(admin);
            
            System.out.println("✅ Admin user verified/updated: admin@gmail.com / ADMIN");
            
            // Seed Restaurant Owner User
            User restaurantOwner = repository.findByEmail("restaurant@gmail.com").orElse(null);
            
            if (restaurantOwner == null) {
                restaurantOwner = User.builder()
                        .firstname("Restaurant")
                        .lastname("Owner")
                        .email("restaurant@gmail.com")
                        .role(Role.RESTAURANT_OWNER)
                        .build();
            }
            
            restaurantOwner.setPassword(passwordEncoder.encode("REST123"));
            restaurantOwner.setRole(Role.RESTAURANT_OWNER);
            repository.save(restaurantOwner);
            
            System.out.println("✅ Restaurant Owner verified/updated: restaurant@gmail.com / REST123");
        };
    }
}
