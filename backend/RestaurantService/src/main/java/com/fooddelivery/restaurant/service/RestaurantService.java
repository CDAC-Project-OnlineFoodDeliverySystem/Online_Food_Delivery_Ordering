package com.fooddelivery.restaurant.service;

import com.fooddelivery.restaurant.model.MenuItem;
import com.fooddelivery.restaurant.model.Restaurant;
import com.fooddelivery.restaurant.repository.MenuItemRepository;
import com.fooddelivery.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Restaurant getRestaurantById(@NonNull Integer id) {
        return restaurantRepository.findById(id).orElse(null);
    }

    public Restaurant createRestaurant(Restaurant restaurant) {
        restaurant.setStatus("PENDING");
        return restaurantRepository.save(restaurant);
    }

    public List<Restaurant> getPendingRestaurants() {
        return restaurantRepository.findAll().stream()
                .filter(r -> "PENDING".equals(r.getStatus()))
                .toList();
    }

    public Restaurant updateStatus(@NonNull Integer id, String status) {
        Restaurant restaurant = restaurantRepository.findById(id).orElse(null);
        if (restaurant != null) {
            restaurant.setStatus(status);
            return restaurantRepository.save(restaurant);
        }
        return null;
    }

    public Restaurant updateRestaurant(@NonNull Integer id, Restaurant restaurantDetails) {
        Restaurant restaurant = restaurantRepository.findById(id).orElse(null);
        if (restaurant != null) {
            restaurant.setName(restaurantDetails.getName());
            restaurant.setAddress(restaurantDetails.getAddress());
            restaurant.setContactNumber(restaurantDetails.getContactNumber());
            restaurant.setCuisine(restaurantDetails.getCuisine());
            restaurant.setRating(restaurantDetails.getRating());
            restaurant.setImg(restaurantDetails.getImg());
            return restaurantRepository.save(restaurant);
        }
        return null;
    }

    public void deleteRestaurant(@NonNull Integer id) {
        restaurantRepository.deleteById(id);
    }

    public MenuItem addMenuItem(@NonNull Integer restaurantId, MenuItem menuItem) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElse(null);
        if (restaurant != null) {
            menuItem.setRestaurant(restaurant);
            return menuItemRepository.save(menuItem);
        }
        return null;
    }

    public List<MenuItem> getMenuByRestaurant(@NonNull Integer restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    public List<Restaurant> getRestaurantsByOwner(Integer ownerId) {
        return restaurantRepository.findByOwnerId(ownerId);
    }

    public MenuItem updateMenuItem(@NonNull Integer itemId, MenuItem menuItemDetails) {
        MenuItem menuItem = menuItemRepository.findById(itemId).orElse(null);
        if (menuItem != null) {
            menuItem.setName(menuItemDetails.getName());
            menuItem.setDescription(menuItemDetails.getDescription());
            menuItem.setPrice(menuItemDetails.getPrice());
            menuItem.setImg(menuItemDetails.getImg());
            return menuItemRepository.save(menuItem);
        }
        return null;
    }

    public void deleteMenuItem(@NonNull Integer itemId) {
        menuItemRepository.deleteById(itemId);
    }
}
