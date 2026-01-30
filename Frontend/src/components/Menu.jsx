import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { CartContext } from "../context/CartContext.jsx";
import "./Menu.css";

export default function Menu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      setRestaurant(response.data);
    } catch (err) {
      console.error("Error fetching restaurant:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 className="text-center mt-5">Loading Menu...</h2>;
  }

  if (!restaurant) {
    return <h2 className="text-center mt-5">Restaurant not found</h2>;
  }

  const handleAddAndGoCart = (dish) => {
    // add item to cart, then redirect to cart
    addToCart(dish, Number(id)); // Pass restaurantId
    navigate("/cart");
  };

  const handleAddToCart = (dish) => {
    addToCart(dish, Number(id)); // Pass restaurantId
  }

  return (
    <div className="menu-wrapper">
      {/* RESTAURANT HEADER */}
      <div className="menu-header">
        <img
          src={restaurant.img}
          alt={restaurant.name}
          className="menu-banner"
        />
        <div className="menu-info">
          <h2 className="menu-title">{restaurant.name}</h2>
          <p className="menu-cuisine">{restaurant.cuisine}</p>
          <span className="menu-rating">
            <span role="img" aria-label="star">⭐</span> {restaurant.rating}
          </span>
        </div>
      </div>

      <h3 className="section-subtitle">Dishes</h3>

      {/* DISHES GRID */}
      <div className="menu-grid">
        {/* Using menuItems from backend and providing fallback for dishes */}
        {(restaurant.menu || restaurant.menuItems || []).map((dish, idx) => (
          <div key={dish.id || idx} className="dish-card">
            <img
              src={dish.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500"}
              alt={dish.name}
              className="dish-img"
            />

            <div className="dish-content">
              <h5 className="dish-name">{dish.name}</h5>
              <p className="dish-description" style={{ fontSize: "0.85rem", color: "#666" }}>{dish.description}</p>
              <p className="dish-price">₹ {dish.price}</p>

              <div className="dish-actions">
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(dish)}
                >
                  Add to Cart
                </button>
                <button
                  className="buy-now-btn"
                  onClick={() => handleAddAndGoCart(dish)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
        {(!restaurant.menu && !restaurant.menuItems || (restaurant.menu || restaurant.menuItems || []).length === 0) && (
          <p className="text-center w-100">No dishes available at the moment.</p>
        )}
      </div>
    </div>
  );
}