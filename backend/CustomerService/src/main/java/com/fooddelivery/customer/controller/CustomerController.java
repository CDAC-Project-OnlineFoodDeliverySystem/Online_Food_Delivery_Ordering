package com.fooddelivery.customer.controller;

import com.fooddelivery.customer.model.Customer;
import com.fooddelivery.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CustomerController {

        private final CustomerRepository repository;

        @GetMapping("/profile")

        public ResponseEntity<CustomerResponse> getProfile() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String email = authentication.getName(); // Principal is typically email or username

                // Lazy creation: If customer doesn't exist, create one
                Customer customer = repository.findByEmail(email)
                                .orElseGet(() -> {
                                        Customer newCustomer = Customer.builder()
                                                        .email(email)
                                                        .fullName("New Customer") // Default name
                                                        .password("") // Dummy, auth is handled by AuthService
                                                        .role(com.fooddelivery.customer.model.Role.CUSTOMER)
                                                        .build();
                                        if (newCustomer != null) {
                                                return repository.save(newCustomer);
                                        }
                                        return null;
                                });

                return ResponseEntity.ok(CustomerResponse.builder()
                                .id(customer.getId())
                                .fullName(customer.getFullName())
                                .email(customer.getEmail())
                                .phone(customer.getPhone())
                                .address(customer.getAddress())
                                .role(customer.getRole() != null ? customer.getRole().name() : "CUSTOMER")
                                .build());
        }

        @GetMapping("/all")
        public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
                List<CustomerResponse> customers = repository.findAll().stream()
                                .map(customer -> CustomerResponse.builder()
                                                .id(customer.getId())
                                                .fullName(customer.getFullName())
                                                .email(customer.getEmail())
                                                .phone(customer.getPhone())
                                                .address(customer.getAddress())
                                                .role(customer.getRole() != null ? customer.getRole().name() : null)
                                                .build())
                                .collect(Collectors.toList());
                return ResponseEntity.ok(customers);
        }
}
