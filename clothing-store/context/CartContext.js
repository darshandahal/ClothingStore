'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState({
    instore: [],
    online: []
  });
  const [loading, setLoading] = useState(true);

  // Load cart from storage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('babita_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading cart:', error);
      setLoading(false);
    }
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('babita_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  const addToCart = (product, source) => {
    setCartItems(prev => {
      const sourceCart = source === 'instore' ? [...prev.instore] : [...prev.online];
      const existingItem = sourceCart.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        sourceCart.push({
          ...product,
          quantity: 1,
          source
        });
      }

      return {
        ...prev,
        [source]: sourceCart
      };
    });
  };

  const removeFromCart = (productId, source) => {
    setCartItems(prev => ({
      ...prev,
      [source]: prev[source].filter(item => item.id !== productId)
    }));
  };

  const updateQuantity = (productId, source, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, source);
      return;
    }

    setCartItems(prev => ({
      ...prev,
      [source]: prev[source].map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    }));
  };

  const clearCart = () => {
    setCartItems({
      instore: [],
      online: []
    });
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
      const price = item.onSale 
        ? item.price * (1 - (item.discount || 0) / 100)
        : item.price;
      return sum + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateTotal,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}