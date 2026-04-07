"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { SectionTitle } from "@/features/shared/components/section-title";

const customizationSchema = z.object({
  fullName: z.string().min(2, "Ingresa tu nombre."),
  email: z.string().email("Email inválido."),
  instrument: z.string().min(2, "Indica el instrumento."),
  message: z.string().min(10, "Detalla un poco más tu necesidad."),
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
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => Boolean(form.fullName && form.email && form.instrument && form.message),
    [form],
  );

  return (
    <section id="personalizacion" className="grid gap-6 border-y border-[var(--color-border)] py-8 md:grid-cols-[1fr_1fr]">
      <div className="space-y-5">
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
