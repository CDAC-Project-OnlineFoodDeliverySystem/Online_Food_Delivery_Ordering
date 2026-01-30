package com.fooddelivery.order.service;

import com.fooddelivery.order.model.Order;
import com.fooddelivery.order.model.OrderItem;
import com.fooddelivery.order.model.OrderStatus;
import com.fooddelivery.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    public Order placeOrder(Order order) {
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PLACED);
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(order);
            }
        }
        return orderRepository.save(order);
    }

    public Order getOrderById(@NonNull Integer id) {
        return orderRepository.findById(id).orElse(null);
    }

    public List<Order> getOrdersByCustomer(@NonNull Integer customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public List<Order> getOrdersByRestaurant(@NonNull Integer restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }

    public Order updateOrderStatus(@NonNull Integer orderId, @NonNull OrderStatus status) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order != null) {
            order.setStatus(status);
            return orderRepository.save(order);
        }
        return null;
    }

    public java.util.Map<String, Object> getStats() {
        Double revenue = orderRepository.calculateTotalRevenue();
        Long activeOrders = orderRepository.countActiveOrders();

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalRevenue", revenue);
        stats.put("activeOrders", activeOrders);
        return stats;
    }
}
