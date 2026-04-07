import { ProductCard } from "@/features/catalog/components/product-card";
import { SectionTitle } from "@/features/shared/components/section-title";
import type { Product } from "@/types/domain";

interface CatalogGridProps {
  products: Product[];
}

export function CatalogGrid({ products }: CatalogGridProps) {
  const featuredCount = products.filter((product) => product.featured).length;

  return (
    <section id="catalogo" className="space-y-6 pt-2">
      <SectionTitle
        eyebrow="Catalogo"
        title="Nuevos modelos"
        description="Modelos semirrigidos linea Argon Clasica y Argon Pro, con proteccion real para ruta, escenario y traslados diarios."
      />
      <div className="flex items-center justify-between text-sm text-[var(--color-text-muted)]">
        <p>
          {products.length} productos · {featuredCount} destacados
        </p>
      </div>
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-1 lg:grid-cols-2 2xl:max-w-[92rem] 2xl:gap-5 min-[1920px]:max-w-[104rem]">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
