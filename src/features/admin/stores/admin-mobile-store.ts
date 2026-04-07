"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { OrderStatus } from "@/types/domain";

export type MobileAdminTab = "dashboard" | "orders" | "products" | "customers" | "profile";
export type MobileOrdersSegment = "ventas" | "consultas";
export type MobileCustomersSegment = "crm" | "testimonios";
export type MobileStack =
  | { screen: "root" }
  | { screen: "order"; id: string }
  | { screen: "customer"; id: string }
  | { screen: "productWizard" }
  | { screen: "quickOrder" }
  | { screen: "testimonial"; id: string | null };

interface AdminMobileState {
  tab: MobileAdminTab;
  ordersSegment: MobileOrdersSegment;
  customersSegment: MobileCustomersSegment;
  stack: MobileStack;
  orderStatusFilter: OrderStatus | "all";
  setTab: (tab: MobileAdminTab) => void;
  setOrdersSegment: (s: MobileOrdersSegment) => void;
  setCustomersSegment: (s: MobileCustomersSegment) => void;
  push: (stack: MobileStack) => void;
  pop: () => void;
  setOrderStatusFilter: (f: OrderStatus | "all") => void;
  resetStack: () => void;
}

export const useAdminMobileStore = create<AdminMobileState>()(
  persist(
    (set) => ({
      tab: "dashboard",
      ordersSegment: "ventas",
      customersSegment: "crm",
      stack: { screen: "root" },
      orderStatusFilter: "all",
      setTab: (tab) => set({ tab, stack: { screen: "root" } }),
      setOrdersSegment: (ordersSegment) => set({ ordersSegment, stack: { screen: "root" } }),
      setCustomersSegment: (customersSegment) => set({ customersSegment, stack: { screen: "root" } }),
      push: (stack) => set({ stack }),
      pop: () => set({ stack: { screen: "root" } }),
      setOrderStatusFilter: (orderStatusFilter) => set({ orderStatusFilter }),
      resetStack: () => set({ stack: { screen: "root" } }),
    }),
    {
      name: "admin-mobile-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tab: state.tab,
        ordersSegment: state.ordersSegment,
        customersSegment: state.customersSegment,
        orderStatusFilter: state.orderStatusFilter,
      }),
    },
  ),
);
