import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Medicine } from '../types';

export interface CartItem extends Medicine {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (medicine: Medicine) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children?: ReactNode }) => {
  const [itemsMap, setItemsMap] = useState<Map<string, CartItem>>(new Map());

  const items = useMemo(() => Array.from(itemsMap.values()), [itemsMap]);

  const addToCart = (medicine: Medicine) => {
    setItemsMap((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(medicine.id);
      if (existing) {
        newMap.set(medicine.id, { ...existing, quantity: existing.quantity + 1 });
      } else {
        newMap.set(medicine.id, { ...medicine, quantity: 1 });
      }
      return newMap;
    });
  };

  const removeFromCart = (id: string) => {
    setItemsMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setItemsMap((prev) => {
      const existing = prev.get(id);
      if (!existing) return prev;

      const newMap = new Map(prev);
      const newQuantity = Math.max(1, existing.quantity + delta);
      newMap.set(id, { ...existing, quantity: newQuantity });
      return newMap;
    });
  };

  const clearCart = () => setItemsMap(new Map());

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
