"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  categoryLabels,
  categoryOptions,
  lineLabels,
  lineOptions,
  quickSpecTemplates,
  quickTagTemplates,
} from "@/features/admin/admin-constants";
import { adminTapScale, useAdminMotionReduced } from "@/features/admin/mobile/use-admin-motion";
import type { InstrumentCategory, Product, ProductLine } from "@/types/domain";

const steps = [
  "Información básica",
  "Categoría y línea",
  "Descripción",
  "Especificaciones y etiquetas",
  "Vista previa",
] as const;

export function MobileProductWizard(props: {
  productForm: Product;
  setProductForm: React.Dispatch<React.SetStateAction<Product>>;
  specInput: string;
  setSpecInput: (v: string) => void;
  tagInput: string;
  setTagInput: (v: string) => void;
  appendProductItem: (field: "specs" | "tags" | "variants" | "gallery", rawValue: string) => void;
  removeProductItem: (field: "specs" | "tags" | "variants" | "gallery", value: string) => void;
  onClose: () => void;
  saveProductMutation: { mutateAsync: (p: Product) => Promise<unknown>; isPending: boolean };
  onSaved: () => void;
}) {
  const reduceMotion = useAdminMotionReduced();
  const [step, setStep] = React.useState(0);

  const formValid =
    props.productForm.name.trim().length > 0 &&
    props.productForm.shortDescription.trim().length > 0 &&
    props.productForm.description.trim().length > 0;

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canNext = () => {
    if (step === 0) return props.productForm.name.trim().length > 0;
    if (step === 2) return formValid;
    return true;
  };

  const submit = async () => {
    const id = props.productForm.id || `prod-${Date.now()}`;
    const slug =
      props.productForm.slug ||
      props.productForm.name
        .toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll(/[^\w-]/g, "");
    await props.saveProductMutation.mutateAsync({
      ...props.productForm,
      id,
      slug,
      specs: props.productForm.specs.filter(Boolean),
      tags: props.productForm.tags.filter(Boolean),
      gallery: props.productForm.gallery.filter(Boolean),
      variants: props.productForm.variants?.filter(Boolean) ?? [],
    });
    props.onSaved();
  };

  return (
    <div className="flex min-h-[70vh] flex-col">
      <div className="mb-4 flex items-center justify-between gap-2">
        <button type="button" className="text-sm text-[var(--color-text-muted)]" onClick={props.onClose}>
          Cerrar
        </button>
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
          Nuevo producto
        </p>
        <span className="w-10" />
      </div>
      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {steps.map((label, i) => (
          <div
            key={label}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium ${
              i === step
                ? "bg-[var(--color-accent-red)] text-white"
                : "border border-[var(--color-border)] text-[var(--color-text-muted)]"
            }`}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>
      <motion.div
        key={step}
        className="min-h-[320px] flex-1"
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, x: 16 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.2 },
            })}
      >
        {step === 0 ? (
          <label className="argon-label block">
            Nombre del producto
            <input
              className="argon-input mt-1"
              value={props.productForm.name}
              onChange={(e) => props.setProductForm((p) => ({ ...p, name: e.target.value }))}
            />
          </label>
        ) : null}
        {step === 1 ? (
          <div className="grid gap-4">
            <label className="argon-label">
              Categoría
              <select
                className="argon-input"
                value={props.productForm.category}
                onChange={(e) =>
                  props.setProductForm((p) => ({
                    ...p,
                    category: e.target.value as InstrumentCategory,
                  }))
                }
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {categoryLabels[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="argon-label">
              Línea
              <select
                className="argon-input"
                value={props.productForm.line}
                onChange={(e) => props.setProductForm((p) => ({ ...p, line: e.target.value as ProductLine }))}
              >
                {lineOptions.map((l) => (
                  <option key={l} value={l}>
                    {lineLabels[l]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
        {step === 2 ? (
          <div className="grid gap-4">
            <label className="argon-label">
              Descripción corta
              <input
                className="argon-input"
                value={props.productForm.shortDescription}
                onChange={(e) =>
                  props.setProductForm((p) => ({ ...p, shortDescription: e.target.value }))
                }
              />
            </label>
            <label className="argon-label">
              Descripción detallada
              <textarea
                className="argon-input min-h-28"
                value={props.productForm.description}
                onChange={(e) => props.setProductForm((p) => ({ ...p, description: e.target.value }))}
              />
            </label>
          </div>
        ) : null}
        {step === 3 ? (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-[var(--color-text-muted)]">Especificaciones</p>
              <div className="flex flex-wrap gap-2">
                {quickSpecTemplates.map((t) => {
                  const isSelected = props.productForm.specs.includes(t);
                  return (
                    <motion.button
                      key={t}
                      type="button"
                      whileTap={reduceMotion ? undefined : { scale: adminTapScale }}
                      className={`rounded-full border px-3.5 py-2 text-sm transition-colors ${
                        isSelected
                          ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-200"
                          : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                      }`}
                      onClick={() => props.appendProductItem("specs", t)}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {t}
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {props.productForm.specs.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm"
                    onClick={() => props.removeProductItem("specs", item)}
                  >
                    {item} ×
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  className="argon-input flex-1"
                  value={props.specInput}
                  onChange={(e) => props.setSpecInput(e.target.value)}
                  placeholder="Otra especificación"
                />
                <button
                  type="button"
                  className="argon-button-secondary shrink-0 px-4 py-3 text-base"
                  onClick={() => {
                    props.appendProductItem("specs", props.specInput);
                    props.setSpecInput("");
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm text-[var(--color-text-muted)]">Etiquetas</p>
              <div className="flex flex-wrap gap-2">
                {quickTagTemplates.map((t) => (
                  <motion.button
                    key={t}
                    type="button"
                    whileTap={reduceMotion ? undefined : { scale: adminTapScale }}
                    className="rounded-full border border-[var(--color-border)] px-3.5 py-2 text-sm"
                    onClick={() => props.appendProductItem("tags", t)}
                  >
                    + {t}
                  </motion.button>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {props.productForm.tags.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm"
                    onClick={() => props.removeProductItem("tags", item)}
                  >
                    {item} ×
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  className="argon-input flex-1"
                  value={props.tagInput}
                  onChange={(e) => props.setTagInput(e.target.value)}
                  placeholder="Otra etiqueta"
                />
                <button
                  type="button"
                  className="argon-button-secondary shrink-0 px-4 py-3 text-base"
                  onClick={() => {
                    props.appendProductItem("tags", props.tagInput);
                    props.setTagInput("");
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <label className="inline-flex items-center gap-2 text-[var(--color-text-muted)]">
                <input
                  type="checkbox"
                  checked={props.productForm.featured}
                  onChange={(e) =>
                    props.setProductForm((p) => ({ ...p, featured: e.target.checked }))
                  }
                />
                Destacar en catálogo
              </label>
              <label className="inline-flex items-center gap-2 text-[var(--color-text-muted)]">
                <input
                  type="checkbox"
                  checked={props.productForm.hero}
                  onChange={(e) => props.setProductForm((p) => ({ ...p, hero: e.target.checked }))}
                />
                Usar en hero principal
              </label>
            </div>
          </div>
        ) : null}
        {step === 4 ? (
          <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4">
            <p className="text-lg font-semibold">{props.productForm.name || "Sin nombre"}</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              {categoryLabels[props.productForm.category]} · {lineLabels[props.productForm.line]}
            </p>
            <p className="text-sm">{props.productForm.shortDescription}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{props.productForm.description}</p>
            {props.productForm.specs.length ? (
              <ul className="list-inside list-disc text-sm">
                {props.productForm.specs.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : null}
            {props.productForm.tags.length ? (
              <p className="text-xs text-[var(--color-text-muted)]">
                {props.productForm.tags.join(" · ")}
              </p>
            ) : null}
          </div>
        ) : null}
      </motion.div>
      <div className="mt-6 flex gap-3 pb-[env(safe-area-inset-bottom)]">
        {step > 0 ? (
          <motion.button
            type="button"
            className="argon-button-secondary flex-1 py-4 text-base"
            whileTap={reduceMotion ? undefined : { scale: adminTapScale }}
            onClick={back}
          >
            Atrás
          </motion.button>
        ) : null}
        {step < steps.length - 1 ? (
          <motion.button
            type="button"
            className="argon-button-primary flex-1 py-4 text-base"
            whileTap={reduceMotion ? undefined : { scale: adminTapScale }}
            disabled={!canNext()}
            onClick={next}
          >
            Siguiente
          </motion.button>
        ) : (
          <motion.button
            type="button"
            className="argon-button-primary flex-1 py-4 text-base"
            whileTap={reduceMotion ? undefined : { scale: adminTapScale }}
            disabled={props.saveProductMutation.isPending || !formValid}
            onClick={() => void submit()}
          >
            {props.saveProductMutation.isPending ? "Guardando..." : "Guardar producto"}
          </motion.button>
        )}
      </div>
    </div>
  );
}
