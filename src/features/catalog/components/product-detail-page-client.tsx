"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { siteContent } from "@/content/site";
import { catalogService } from "@/lib/data/services/catalog-service";
import type { InstrumentCategory, ProductLine } from "@/types/domain";

const categoryLabels: Record<InstrumentCategory, string> = {
  guitarra: "Guitarra",
  bajo: "Bajo",
  bateria: "Batería",
  platos: "Platos",
  teclados: "Teclados",
  percusion: "Percusión",
  vientos: "Vientos",
  dj: "DJ",
  otros: "Otros",
};

const lineLabels: Record<ProductLine, string> = {
  estandar: "Estándar",
  pro: "Pro",
  personalizada: "Personalizada",
};

export function ProductDetailPageClient({ slug }: { slug: string }) {
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [activeTab, setActiveTab] = useState<"detalle" | "caracteristicas" | "envio">("detalle");
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => catalogService.listProducts(),
  });

  const product = useMemo(
    () => (productsQuery.data ?? []).find((item) => item.slug === slug) ?? null,
    [productsQuery.data, slug],
  );

  if (!product) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center p-6 md:p-10 2xl:max-w-[90rem] min-[1920px]:max-w-[106rem] min-[2560px]:max-w-[138rem]">
        <p className="text-sm text-[var(--color-text-muted)]">Cargando producto...</p>
      </main>
    );
  }

  const mediaItems = product.gallery.length ? product.gallery : [product.coverImage];
  const normalizedPrice = product.priceFrom && product.priceFrom > 0 ? `$${product.priceFrom}` : "A consultar";
  const mediaLabelMap: Record<string, string> = {
    "hero-guitarra": "Frente",
    "detalle-cierre": "Cierre reforzado",
    "vista-frente": "Bolsillo frontal",
    "cover-bajo": "Versión bajo",
    "cover-platos": "Versión platos",
    "cover-teclado": "Versión teclado",
  };
  const formatMediaLabel = (media: string) =>
    mediaLabelMap[media] ??
    media
      .replaceAll("-", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  const detailTags = [
    `${categoryLabels[product.category]}, ${lineLabels[product.line]}`,
    "refuerzo para traslado real",
    product.specs[0]?.toLowerCase() ?? "terminación profesional",
  ];
  const whatsappHref = `${siteContent.social.whatsapp}?text=${encodeURIComponent(
    `Hola, ¿cómo están? Me interesa "${product.name}". ¿Me podrían dar más información?`,
  )}`;

  const tabButtonClass = (tab: "detalle" | "caracteristicas" | "envio") =>
    `border-b-2 pb-2 text-xs uppercase tracking-[0.12em] transition-colors ${
      activeTab === tab
        ? "border-[var(--color-accent-red)] text-[var(--color-text-primary)]"
        : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
    }`;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-6 md:p-10 2xl:max-w-[90rem] 2xl:gap-8 2xl:px-12 min-[1920px]:max-w-[106rem] min-[1920px]:px-16 min-[2560px]:max-w-[138rem] min-[2560px]:gap-10 min-[2560px]:px-24">
      <div className="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--color-border)_42%,transparent)] pb-4">
        <Image
          src="/images/logo.png"
          alt="Fundas Argon"
          width={220}
          height={50}
          className="h-11 w-auto opacity-100"
        />
        <Link href="/" className="argon-link-accent text-xs uppercase tracking-[0.12em] underline">
          Volver al catálogo
        </Link>
      </div>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] 2xl:gap-8 min-[2560px]:gap-10">
        <article className="space-y-3">
          <div className="relative aspect-square overflow-hidden border border-[color-mix(in_srgb,var(--color-border)_40%,transparent)] bg-[var(--color-surface-secondary)] p-4">
            <div className="absolute right-3 top-3 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              {lineLabels[product.line]}
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              IMAGEN
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 2xl:gap-3">
            {mediaItems.map((media, index) => (
              <button
                key={`${media}-${index}`}
                type="button"
                onClick={() => setSelectedMedia(index)}
                className={`flex h-20 w-20 items-center justify-center border p-2 text-center text-[10px] uppercase tracking-[0.14em] transition md:h-24 md:w-24 2xl:h-28 2xl:w-28 min-[2560px]:h-32 min-[2560px]:w-32 ${
                  selectedMedia === index
                    ? "border-[var(--color-accent-red)] bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                    : "border-[color-mix(in_srgb,var(--color-border)_50%,transparent)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)]"
                }`}
              >
                {formatMediaLabel(media)}
              </button>
            ))}
          </div>
        </article>

        <article className="border border-[color-mix(in_srgb,var(--color-border)_42%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_96%,transparent)] p-4 md:p-6 min-[2560px]:p-8">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            {categoryLabels[product.category]}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl 2xl:text-5xl min-[2560px]:text-6xl">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 border-b border-[color-mix(in_srgb,var(--color-border)_40%,transparent)] pb-4">
            <p className="text-2xl font-semibold text-[var(--color-text-primary)]">{normalizedPrice}</p>
            {product.featured ? (
              <span className="rounded-full bg-[color-mix(in_srgb,var(--color-accent-red)_22%,transparent)] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent-red-soft)]">
                destacado
              </span>
            ) : null}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">{product.shortDescription}</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">{product.description}</p>

          <div className="mt-5 space-y-3 border-y border-[color-mix(in_srgb,var(--color-border)_40%,transparent)] py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">Variantes</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(product.variants ?? ["Negro"]).map((variant) => (
                  <span
                    key={variant}
                    className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-primary)]"
                  >
                    {variant}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="argon-button-primary inline-flex">
              Consultar por WhatsApp
            </a>
            <Link href="/#personalizacion" className="argon-button-secondary inline-flex">
              Pedir personalizada
            </Link>
          </div>

          <div className="mt-7 border-t border-[color-mix(in_srgb,var(--color-border)_40%,transparent)] pt-4">
            <div className="flex items-center gap-5">
              <button type="button" className={tabButtonClass("detalle")} onClick={() => setActiveTab("detalle")}>
                Detalle
              </button>
              <button
                type="button"
                className={tabButtonClass("caracteristicas")}
                onClick={() => setActiveTab("caracteristicas")}
              >
                Características
              </button>
              <button type="button" className={tabButtonClass("envio")} onClick={() => setActiveTab("envio")}>
                Envío
              </button>
            </div>

            {activeTab === "detalle" ? (
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                Trabajo artesanal semirrígido con terminación profesional para uso real: sala, escenario y ruta.
              </p>
            ) : null}
            {activeTab === "caracteristicas" ? (
              <div className="mt-3 grid gap-2 text-sm text-[var(--color-text-muted)]">
                {product.specs.map((spec) => (
                  <p key={spec}>- {spec}</p>
                ))}
              </div>
            ) : null}
            {activeTab === "envio" ? (
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                Coordinamos entrega en todo el país. Para modelos a medida, confirmamos tiempos al cerrar tu pedido.
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {detailTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--color-border)] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
