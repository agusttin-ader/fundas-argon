import Link from "next/link";
import type { Product } from "@/types/domain";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const displayTags = product.tags.slice(0, 3);

  return (
    <article className="group overflow-hidden rounded-[1rem] border border-transparent bg-[var(--color-surface)] transition-colors duration-[var(--argon-duration,260ms)] [transition-timing-function:var(--argon-ease,cubic-bezier(0.33,1,0.68,1))] hover:bg-[color-mix(in_srgb,var(--color-surface)_95%,transparent)]">
      <div className="grid md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-64 overflow-hidden border-b border-[color-mix(in_srgb,var(--color-border)_38%,transparent)] bg-[var(--color-surface)] md:min-h-full md:border-b-0 md:border-r md:border-r-[color-mix(in_srgb,var(--color-border)_38%,transparent)]">
          <div className="absolute inset-0 bg-[var(--color-surface-secondary)]" />
          <p className="absolute inset-0 flex items-center justify-center text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            IMAGEN
          </p>

          <div className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.2em] text-white/75">
            {product.category}
          </div>
        </div>

        <div className="flex flex-col justify-between p-5 md:p-7">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-[color-mix(in_srgb,var(--color-border)_36%,transparent)] pb-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                {product.line === "pro" ? "Argon Pro" : "Argon Clásica"}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                {product.featured ? "Destacado" : "Coleccion"}
              </p>
            </div>

            <h3 className="line-clamp-2 text-[1.32rem] font-semibold leading-[1.15] tracking-tight md:text-[1.5rem]">
              {product.name}
            </h3>

            <p className="line-clamp-3 max-w-[46ch] text-[13px] leading-relaxed text-[var(--color-text-muted)]">
              {product.shortDescription}
            </p>

            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              {displayTags.length > 0 ? (
                displayTags.map((tag) => <span key={tag}>{tag}</span>)
              ) : (
                <span>Hecho a medida</span>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-[color-mix(in_srgb,var(--color-border)_36%,transparent)] pt-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              {product.priceFrom && product.priceFrom > 0 ? `Desde $${product.priceFrom}` : "Precio a consultar"}
            </p>
            <Link
              href={`/producto/${product.slug}`}
              className="inline-flex items-center gap-2 border-b border-[var(--color-text-primary)] pb-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent-red)] hover:text-[var(--color-accent-red)]"
            >
              Ver ficha
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
