import Link from "next/link";
import type { Product } from "@/types/domain";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-2 transition-[border-color,background-color,box-shadow,transform] duration-[var(--argon-duration,260ms)] [transition-timing-function:var(--argon-ease,cubic-bezier(0.33,1,0.68,1))] hover:border-[color-mix(in_srgb,var(--color-accent-red)_42%,var(--color-border))] hover:shadow-[0_14px_36px_-16px_color-mix(in_srgb,var(--color-accent-red)_28%,transparent)]">
      <div className="relative h-44 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="absolute left-3 top-3 rounded-full border border-[color-mix(in_srgb,var(--color-border)_70%,#fff)] bg-[color-mix(in_srgb,var(--color-surface-secondary)_82%,transparent)] px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-[var(--color-text-primary)]">
          {product.category}
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--color-border)_70%,#fff)] bg-[color-mix(in_srgb,var(--color-surface-secondary)_82%,transparent)] px-2 py-1 text-[10px]">
          <span className="text-[var(--color-accent-red-soft)]">★</span>
          <span className="text-[var(--color-text-primary)]">{product.line === "pro" ? "4.9" : "4.7"}</span>
        </div>
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
          {[0, 1, 2, 3].map((dot) => (
            <span
              key={dot}
              className={`h-1.5 w-1.5 rounded-full ${dot === 0 ? "bg-white/80" : "bg-white/35"}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 px-2 pb-2 pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold tracking-tight">{product.name}</h3>
          <span className="shrink-0 rounded-full border border-[var(--color-border)] px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
            {product.featured ? "destacado" : "nuevo"}
          </span>
        </div>

        <p className="text-[11px] text-[var(--color-text-muted)]">
          {product.line === "pro" ? "Linea Argon Pro" : "Linea Argon"} · Hecho en Argentina
        </p>

        <p className="line-clamp-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
          {product.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[10px] text-[var(--color-text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {product.priceFrom && product.priceFrom > 0 ? `$${product.priceFrom}` : "A consultar"}
          </p>
          <Link
            href={`/producto/${product.slug}`}
            className="inline-flex items-center gap-1 rounded-full bg-[#0f0f0f] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--color-accent-red)]"
          >
            Ver
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
