"use client";

import { useCart } from "@/features/cart/components/cart-context";

export function CartDrawer() {
  const { items, snapshot, removeItem, clearCart } = useCart();

  return (
    <aside className="argon-card rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between border-b border-[var(--color-border)] pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em]">Carrito (estructura)</h3>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-[var(--color-text-muted)] underline underline-offset-4"
        >
          Vaciar
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-text-muted)]">No hay productos en el carrito.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-lg border border-[var(--color-border)] p-3">
              <p className="text-sm font-medium">{item.productName}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {item.quantity} x ${item.unitPrice}
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="mt-2 text-xs text-[var(--color-accent-red)] underline underline-offset-4"
              >
                Quitar
              </button>
            </div>
          ))}
          <p className="pt-1 text-sm font-semibold">Total: ${snapshot.total}</p>
        </div>
      )}
    </aside>
  );
}
