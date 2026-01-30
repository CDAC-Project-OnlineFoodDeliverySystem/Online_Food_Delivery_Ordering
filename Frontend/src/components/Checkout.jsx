import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import api from "../utils/api";
import "./Checkout.css";

export default function Checkout() {
  const { cart, restaurantId, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("");
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/customers/profile");
      setCustomerId(response.data.id);
      if (response.data.address) {
        setAddress(response.data.address);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = 30; // Hardcoded fee
  const total = subtotal + deliveryFee;

  if (!cart || cart.length === 0) {
    return (
      <div className="checkout-wrapper empty-cart-wrapper">
        <h2 className="checkout-title">Checkout</h2>
        <div className="empty-message-box">
          <p>Your cart is empty. Please add items before checking out.</p>
          <button className="go-home-btn" onClick={() => navigate("/home")}>
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  const placeOrder = () => {
    if (!address.trim()) {
      alert("Please enter a valid delivery address.");
      return;
    }
    if (!payment) {
      alert("Please select a payment method.");
      return;
    }

    if (!customerId) {
      alert("Customer profile not loaded. Please wait for the page to load fully.");
      return;
    }

    // Construct payload prep
    const orderPayload = {
      customerId: customerId,
      restaurantId: restaurantId,
      totalAmount: total,
      status: "PENDING",
      items: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.qty
      }))
    };

    // Navigate to payment page simulation
    navigate("/payment", {
      state: {
        orderData: orderPayload,
        paymentMethod: payment,
        totalAmount: total
      }
    });
  };

  return (
    <div className="checkout-wrapper">
      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-container">
        {/* LEFT SECTION: ADDRESS & PAYMENT */}
        <div className="left-box">

          <div className="checkout-card">
            <h3 className="section-title">1. Delivery Address</h3>

            <div className="form-group-checkout">
              <label htmlFor="address-input">Full Delivery Address</label>
              <textarea
                id="address-input"
                className="address-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows="4"
              />
            </div>
          </div>

          <div className="checkout-card payment-card">
            <h3 className="section-title">2. Payment Method</h3>
            <div className="payment-options">
              <div className="payment-option">
                <input type="radio" id="upi" name="payment" value="UPI" onChange={(e) => setPayment(e.target.value)} />
                <label htmlFor="upi">UPI / Net Banking</label>
              </div>
              <div className="payment-option">
                <input type="radio" id="card" name="payment" value="Card" onChange={(e) => setPayment(e.target.value)} />
                <label htmlFor="card">Credit / Debit Card</label>
              </div>
              <div className="payment-option">
                <input type="radio" id="cod" name="payment" value="COD" onChange={(e) => setPayment(e.target.value)} />
                <label htmlFor="cod">Cash on Delivery (COD)</label>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT SECTION: ORDER SUMMARY */}
        <div className="right-box">
          <div className="summary-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="item-list">
              {cart.map((it, i) => (
                <div key={i} className="summary-item-line">
                  <span>{it.name} × {it.qty}</span>
                  <span>₹ {it.price * it.qty}</span>
                </div>
              ))}
            </div>

            <hr className="summary-divider" />

            <div className="summary-line">
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>
            <div className="summary-line">
              <span>Delivery Fee</span>
              <span>₹ {deliveryFee}</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>₹ {total}</span>
            </div>

            <button className="place-order-btn" onClick={placeOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}