package com.fooddelivery.order.repository;

import com.fooddelivery.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByCustomerId(Integer customerId);

    List<Order> findByRestaurantId(Integer restaurantId);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = 'DELIVERED'")
    Double calculateTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status NOT IN ('DELIVERED', 'CANCELLED', 'REJECTED')")
    Long countActiveOrders();
}
