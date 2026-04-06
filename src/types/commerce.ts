import type { Product } from "@/types/domain";

export interface CartItem {
  id: string;
  productId: Product["id"];
  productName: Product["name"];
  slug: Product["slug"];
  quantity: number;
  unitPrice: number;
  variant?: string;
}

export interface CartSnapshot {
  items: CartItem[];
  subtotal: number;
  total: number;
  currency: "ARS";
}

export type PaymentMethod = "mercado_pago" | "transferencia" | "whatsapp_manual";

export interface CheckoutPayload {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  note?: string;
  method: PaymentMethod;
  cart: CartSnapshot;
}

export interface CheckoutSession {
  id: string;
  status: "pending" | "requires_action";
  redirectUrl?: string;
  provider: PaymentMethod;
}
