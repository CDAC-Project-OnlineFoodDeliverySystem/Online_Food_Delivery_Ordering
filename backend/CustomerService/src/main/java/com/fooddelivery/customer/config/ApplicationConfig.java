package com.fooddelivery.customer.config;

import com.fooddelivery.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final CustomerRepository customerRepository;

    @Bean

    public UserDetailsService userDetailsService() {
        return username -> customerRepository.findByEmail(username)
                .orElseGet(() -> {
                    // Lazy creation: If customer doesn't exist but has valid JWT chain invoking
                    // this, create one
                    com.fooddelivery.customer.model.Customer newCustomer = com.fooddelivery.customer.model.Customer
                            .builder()
                            .email(username)
                            .fullName("New Customer") // Default name
                            .password("") // Dummy
                            .role(com.fooddelivery.customer.model.Role.CUSTOMER)
                            .build();
                    if (newCustomer != null) {
                        return customerRepository.save(newCustomer);
                    }
                    return null;
                });
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
