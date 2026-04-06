"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, CartSnapshot } from "@/types/commerce";

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  snapshot: CartSnapshot;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, "id">) => {
    const key = `${item.productId}-${item.variant ?? "default"}`;
    setItems((prev) => {
      const existing = prev.find((entry) => entry.id === key);
      if (existing) {
        return prev.map((entry) =>
          entry.id === key ? { ...entry, quantity: entry.quantity + item.quantity } : entry,
        );
      }
      return [...prev, { ...item, id: key }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const snapshot = useMemo<CartSnapshot>(() => {
    const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    return {
      items,
      subtotal,
      total: subtotal,
      currency: "ARS",
    };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clearCart,
      snapshot,
    }),
    [items, snapshot],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }
  return context;
}
