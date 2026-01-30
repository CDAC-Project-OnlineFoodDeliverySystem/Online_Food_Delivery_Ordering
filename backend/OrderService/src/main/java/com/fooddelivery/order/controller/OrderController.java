package com.fooddelivery.order.controller;

import com.fooddelivery.order.model.Order;
import com.fooddelivery.order.model.OrderStatus;
import com.fooddelivery.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    private final OrderService service;

    @PostMapping
    public Order placeOrder(@RequestBody Order order) {
        return service.placeOrder(order);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable @NonNull Integer id) {
        Order order = service.getOrderById(id);
        return order != null ? ResponseEntity.ok(order) : ResponseEntity.notFound().build();
    }

    @GetMapping("/customer/{customerId}")
    public List<Order> getOrdersByCustomer(@PathVariable @NonNull Integer customerId) {
        return service.getOrdersByCustomer(customerId);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<Order> getOrdersByRestaurant(@PathVariable @NonNull Integer restaurantId) {
        return service.getOrdersByRestaurant(restaurantId);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable @NonNull Integer id,
            @RequestParam @NonNull OrderStatus status) {
        Order updated = service.updateOrderStatus(id, status);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @GetMapping("/stats")
    public java.util.Map<String, Object> getStats() {
        return service.getStats();
    }
}
