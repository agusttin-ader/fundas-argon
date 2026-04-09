"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { SectionTitle } from "@/features/shared/components/section-title";

const customizationSchema = z.object({
  fullName: z.string().min(2, "Ingresa tu nombre."),
  email: z.string().email("Email inválido."),
  instrument: z.string().min(2, "Indica el instrumento."),
  message: z.string().min(10, "Detalla un poco más tu necesidad."),
  imageUrls: z.array(z.string()).max(4, "Máximo 4 imágenes."),
});

type FormPayload = z.infer<typeof customizationSchema>;

interface CustomizationSectionProps {
  onSubmit: (payload: FormPayload) => Promise<void>;
}

export function CustomizationSection({ onSubmit }: CustomizationSectionProps) {
  const [form, setForm] = useState<FormPayload>({
    fullName: "",
    email: "",
    instrument: "",
    message: "",
    imageUrls: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => Boolean(form.fullName && form.email && form.instrument && form.message),
    [form],
  );

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
      reader.readAsDataURL(file);
    });

  return (
    <section
      id="personalizacion"
      className="grid items-start gap-6 border-y border-[var(--color-border)] py-8 md:grid-cols-[1.02fr_0.98fr]"
    >
      <div className="space-y-5 border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-6">
        <SectionTitle
          eyebrow="Personalización"
          title="Personaliza tu funda"
          description="Trabajo especial a pedido en línea Argon Pro: medidas reales, bolsillos a pedido, cierres reforzados y terminación profesional."
        />
        <div className="grid gap-2 text-sm text-[var(--color-text-muted)]">
          <p>1. Nos enviás medidas, instrumento y forma de traslado.</p>
          <p>2. Definimos estructura, apertura, bolsillos y nivel de refuerzo.</p>
          <p>3. Fabricamos a medida y coordinamos entrega.</p>
        </div>
        <div className="grid gap-3 pt-1 sm:grid-cols-2">
          <article className="rounded-2xl border border-[color-mix(in_srgb,var(--color-border)_65%,transparent)] bg-[color-mix(in_srgb,var(--color-surface-secondary)_92%,transparent)] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Entrega estimada</p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-text-primary)]">7 a 12 días</p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">Según complejidad y stock de materiales.</p>
          </article>
          <article className="rounded-2xl border border-[color-mix(in_srgb,var(--color-border)_65%,transparent)] bg-[color-mix(in_srgb,var(--color-surface-secondary)_92%,transparent)] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Incluye</p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-text-primary)]">Asesoría 1:1</p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">Definimos detalles técnicos con vos antes de cortar.</p>
          </article>
        </div>
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--color-accent-red)_32%,var(--color-border))] bg-[linear-gradient(125deg,color-mix(in_srgb,var(--color-accent-red)_10%,transparent)_0%,transparent_70%)] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-accent-red-soft)]">Tip Argon</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
            Si tenés fotos del instrumento y medidas aproximadas, cargalas en el mensaje. Eso acelera el presupuesto y evita
            ajustes posteriores.
          </p>
        </div>
      </div>
      <form
        className="space-y-4 border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-6"
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          setSuccess("");

          const parsed = customizationSchema.safeParse(form);
          if (!parsed.success) {
            setError(parsed.error.issues[0]?.message ?? "Revisa los campos.");
            return;
          }

          setSubmitting(true);
          try {
            await onSubmit(parsed.data);
            setSuccess("Solicitud enviada. El equipo de Argon se comunicará contigo.");
            setForm({
              fullName: "",
              email: "",
              instrument: "",
              message: "",
              imageUrls: [],
            });
          } catch {
            setError("No pudimos enviar tu solicitud. Intenta nuevamente.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <label className="argon-label">
          Nombre
          <input
            className="argon-input"
            value={form.fullName}
            onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
            placeholder="Tu nombre"
          />
        </label>
        <label className="argon-label">
          Email
          <input
            className="argon-input"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="tu@email.com"
          />
        </label>
        <label className="argon-label">
          Instrumento
          <input
            className="argon-input"
            value={form.instrument}
            onChange={(event) => setForm((prev) => ({ ...prev, instrument: event.target.value }))}
            placeholder="Ej. guitarra eléctrica"
          />
        </label>
        <div className="space-y-2">
          <p className="text-sm text-[var(--color-text-muted)]">Imágenes del instrumento (opcional)</p>
          <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.09em] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent-red)] hover:text-[var(--color-accent-red)]">
            Agregar imágenes
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={async (event) => {
                setError("");
                const files = Array.from(event.target.files ?? []);
                if (!files.length) return;
                if (form.imageUrls.length >= 4) {
                  setError("Máximo 4 imágenes por solicitud.");
                  event.currentTarget.value = "";
                  return;
                }

                const remainingSlots = Math.max(0, 4 - form.imageUrls.length);
                const selectedFiles = files.slice(0, remainingSlots);
                const oversized = selectedFiles.find((file) => file.size > 4 * 1024 * 1024);
                if (oversized) {
                  setError("Cada imagen debe pesar menos de 4MB.");
                  event.currentTarget.value = "";
                  return;
                }

                try {
                  const converted = await Promise.all(selectedFiles.map((file) => readFileAsDataUrl(file)));
                  setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...converted] }));
                } catch {
                  setError("No pudimos procesar una de las imágenes.");
                } finally {
                  event.currentTarget.value = "";
                }
              }}
            />
          </label>
          {form.imageUrls.length ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {form.imageUrls.map((url, index) => (
                <div
                  key={`${url.slice(0, 24)}-${index}`}
                  className="relative overflow-hidden rounded-xl border border-[var(--color-border)]"
                >
                  <img src={url} alt={`Adjunto ${index + 1}`} className="h-20 w-full object-cover" />
                  <button
                    type="button"
                    className="absolute right-1 top-1 rounded-full bg-black/65 px-1.5 py-0.5 text-[10px] text-white"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        imageUrls: prev.imageUrls.filter((_, imageIndex) => imageIndex !== index),
                      }))
                    }
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <p className="text-xs text-[var(--color-text-muted)]">Hasta 4 imágenes, máximo 4MB cada una.</p>
        </div>
        <label className="argon-label">
          Detalles
          <textarea
            className="argon-input min-h-28 resize-y"
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            placeholder="Medidas, bolsillos, tipo de traslado..."
          />
        </label>

        {error ? <p className="text-sm text-[var(--color-accent-red)]">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-500">{success}</p> : null}

        <button type="submit" className="argon-button-primary w-full" disabled={!canSubmit || submitting}>
          {submitting ? "Enviando..." : "Solicitar"}
        </button>
      </form>
    </section>
  );
}
