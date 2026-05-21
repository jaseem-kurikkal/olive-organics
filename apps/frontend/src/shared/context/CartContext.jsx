import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems(prev => {
      // Check if same config already exists
      const existingIndex = prev.findIndex(
        ci => {
          if (item.productId && item.productId !== 'custom-atelier-build') {
             return ci.productId === item.productId;
          }
          return ci.size === item.size &&
                ci.fragrance === item.fragrance &&
                JSON.stringify(ci.ingredients) === JSON.stringify(item.ingredients);
        }
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      }
      return [...prev, { ...item, cartId: Date.now().toString() }];
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, newQty) => {
    if (newQty < 1) return removeFromCart(cartId);
    setCartItems(prev =>
      prev.map(item => item.cartId === cartId ? { ...item, quantity: newQty } : item)
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
