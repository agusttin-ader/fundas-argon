import type { CheckoutPayload, CheckoutSession } from "@/types/commerce";

/**
 * Pasarela futura:
 * - Reemplazar esta implementación mock por integración real (MP/Stripe/etc).
 * - Mantiene contrato estable para no tocar UI cuando se conecte backend real.
 */
export const paymentService = {
  async createCheckoutSession(payload: CheckoutPayload): Promise<CheckoutSession> {
    // TODO: integrar endpoint real de checkout.
    return {
      id: `checkout-${Date.now()}`,
      status: "pending",
      provider: payload.method,
      redirectUrl: undefined,
    };
  },
};
