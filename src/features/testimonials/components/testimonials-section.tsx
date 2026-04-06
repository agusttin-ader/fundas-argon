import { SectionTitle } from "@/features/shared/components/section-title";
import type { Testimonial } from "@/types/domain";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="space-y-6">
      <SectionTitle
        eyebrow="Resenas"
        title="Comentarios"
        description="Experiencias de clientes y musicos que ya usan Fundas Argon para escenario, estudio, viajes y trabajo diario."
      />
      <div className="flex items-center justify-between text-sm text-[var(--color-text-muted)]">
        <p>Trabajos reales, sin humo</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.id}
            className="relative space-y-4 border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-5"
          >
            <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
              {`"${testimonial.quote}"`}
            </p>
            <div className="border-t border-[var(--color-border)] pt-3">
              <p className="text-sm font-semibold uppercase tracking-[0.03em]">{testimonial.musicianName}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{testimonial.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
