"use client";

import { createContext, useContext, useState, useEffect } from "react";

type CartContextType = {
  cartCount: number;
  updateCart: () => void;
  hydrated: boolean;
};

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  updateCart: () => {},
  hydrated: false,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);

useEffect(() => {
  setTimeout(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(storedCart.length);
    setHydrated(true);
  }, 0);
}, []);

  const updateCart = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(storedCart.length);
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCart, hydrated }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
