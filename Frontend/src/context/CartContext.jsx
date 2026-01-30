import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  const addToCart = (item, resId) => {
    setCart((prev) => {
      // If adding from a different restaurant, we might want to clear or warn, 
      // but for this implementation we'll just track the latest resId or the one for this cart
      if (prev.length === 0) {
        setRestaurantId(resId);
      }

      const exists = prev.find((p) => p.name === item.name);
      if (exists) {
        return prev.map((p) =>
          p.name === item.name ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1, restaurantId: resId }];
    });
  };

  const increaseQty = (name) => {
    setCart((prev) =>
      prev.map((p) => (p.name === name ? { ...p, qty: p.qty + 1 } : p))
    );
  };

  const decreaseQty = (name) => {
    setCart((prev) =>
      prev
        .map((p) => (p.name === name ? { ...p, qty: p.qty - 1 } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const removeItem = (name) => {
    setCart((prev) => prev.filter((p) => p.name !== name));
  };

  const clearCart = () => {
    setCart([]);
    setRestaurantId(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        restaurantId,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
