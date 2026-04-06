"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CatalogGrid } from "@/features/catalog/components/catalog-grid";
import { CustomizationSection } from "@/features/customization/components/customization-section";
import { CountUpNumber } from "@/features/shared/components/count-up-number";
import { Hero } from "@/features/shared/components/hero";
import { SiteFooter } from "@/features/shared/components/site-footer";
import { TestimonialsSection } from "@/features/testimonials/components/testimonials-section";
import { catalogService } from "@/lib/data/services/catalog-service";
import { customizationService } from "@/lib/data/services/customization-service";
import { useMemo } from "react";

export default function Home() {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => catalogService.listProducts(),
  });

  const testimonialsQuery = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => catalogService.listTestimonials(),
  });

  const customizationMutation = useMutation({
    mutationFn: (payload: { fullName: string; email: string; instrument: string; message: string }) =>
      customizationService.createRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customization-requests"] });
    },
  });

  const products = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);
  const testimonials = useMemo(() => testimonialsQuery.data ?? [], [testimonialsQuery.data]);
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 p-6 md:p-10">
      <Hero />
      <section className="grid gap-3 border-y border-[var(--color-border)] py-6 md:grid-cols-3">
        <article className="border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Trayectoria</p>
          <p className="argon-metric-number mt-2 text-4xl font-semibold">
            <CountUpNumber end={10.6} decimals={1} suffix="k" />
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">Seguidores y comunidad activa</p>
        </article>
        <article className="border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Produccion</p>
          <p className="argon-metric-number mt-2 text-4xl font-semibold">
            <CountUpNumber end={356} suffix="+" />
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">Publicaciones y modelos mostrados</p>
        </article>
        <article className="border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Calidad</p>
          <p className="argon-metric-number mt-2 text-4xl font-semibold">
            <CountUpNumber end={100} suffix="%" />
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">Proteccion semirrigida profesional</p>
        </article>
      </section>
      <CatalogGrid products={products} />
      <CustomizationSection
        onSubmit={async (payload) => {
          await customizationMutation.mutateAsync(payload);
        }}
      />
      <TestimonialsSection testimonials={testimonials} />
      <SiteFooter />
    </main>
  );
}
