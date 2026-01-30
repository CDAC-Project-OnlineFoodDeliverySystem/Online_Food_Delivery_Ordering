import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const { cart, increaseQty, decreaseQty, removeItem, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Calculation logic is moved out of inline styles and kept clean
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = cart.length > 0 ? 30 : 0;
  const total = subtotal + deliveryFee;

  if (!cart || cart.length === 0) {
    return (
        <div className="cart-wrapper empty-cart-wrapper">
            <h2 className="cart-title">Your Cart</h2>
            <div className="empty-message-box">
                <p>Your cart is empty. Add some delicious food to place an order!</p>
                <button className="go-home-btn" onClick={() => navigate("/home")}>
                    Browse Restaurants
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="cart-wrapper">
      <h2 className="cart-title">Your Cart ({cart.length} items)</h2>

      <div className="cart-container">
        {/* LEFT SECTION: ITEMS */}
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.name} className="cart-card">
              <img src={item.img} alt={item.name} className="cart-img" />

              <div className="cart-info">
                <h5>{item.name}</h5>
                <p className="item-price">₹ {item.price}</p>

                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => decreaseQty(item.name)} disabled={item.qty <= 1}>
                    -
                  </button>
                  <span className="qty-value">{item.qty}</span>
                  <button className="qty-btn" onClick={() => increaseQty(item.name)}>
                    +
                  </button>
                </div>
              </div>

              <div className="cart-item-footer">
                <p className="item-total">
                    Total: <span className="total-amount">₹ {item.price * item.qty}</span>
                </p>
                <button className="remove-btn" onClick={() => removeItem(item.name)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SECTION: SUMMARY */}
        <div className="summary-box">
          <h4>Bill Summary</h4>
          <div className="summary-line">
            <span>Subtotal:</span>
            <span>₹ {subtotal}</span>
          </div>
          <div className="summary-line">
            <span>Delivery Fee:</span>
            <span>₹ {deliveryFee}</span>
          </div>
          
          <div className="summary-total-line">
            <h5>Total:</h5>
            <h5>₹ {total}</h5>
          </div>

          <button className="checkout-btn" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}