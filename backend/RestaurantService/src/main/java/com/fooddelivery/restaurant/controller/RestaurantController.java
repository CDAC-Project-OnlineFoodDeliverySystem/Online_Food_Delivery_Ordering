package com.fooddelivery.restaurant.controller;

import com.fooddelivery.restaurant.model.MenuItem;
import com.fooddelivery.restaurant.model.Restaurant;
import com.fooddelivery.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RestaurantController {
    private final RestaurantService service;

    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return service.getAllRestaurants();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable @NonNull Integer id) {
        Restaurant restaurant = service.getRestaurantById(id);
        return restaurant != null ? ResponseEntity.ok(restaurant) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Restaurant createRestaurant(@RequestBody Restaurant restaurant) {
        return service.createRestaurant(restaurant);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable @NonNull Integer id,
            @RequestBody Restaurant restaurant) {
        Restaurant updated = service.updateRestaurant(id, restaurant);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable @NonNull Integer id) {
        service.deleteRestaurant(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/menu")
    public ResponseEntity<MenuItem> addMenuItem(@PathVariable @NonNull Integer id, @RequestBody MenuItem menuItem) {
        MenuItem created = service.addMenuItem(id, menuItem);
        return created != null ? ResponseEntity.ok(created) : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/menu")
    public List<MenuItem> getMenu(@PathVariable @NonNull Integer id) {
        return service.getMenuByRestaurant(id);
    }

    @GetMapping("/owner/{ownerId}")
    public List<Restaurant> getByOwner(@PathVariable Integer ownerId) {
        return service.getRestaurantsByOwner(ownerId);
    }

    @GetMapping("/pending")
    public List<Restaurant> getPendingRestaurants() {
        return service.getPendingRestaurants();
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<Restaurant> updateRestaurantStatus(@PathVariable @NonNull Integer id,
            @RequestBody String status) {
        Restaurant updated = service.updateStatus(id, status);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PutMapping("/menu/{itemId}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable @NonNull Integer itemId,
            @RequestBody MenuItem menuItem) {
        MenuItem updated = service.updateMenuItem(itemId, menuItem);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/menu/{itemId}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable @NonNull Integer itemId) {
        service.deleteMenuItem(itemId);
        return ResponseEntity.noContent().build();
    }
}
