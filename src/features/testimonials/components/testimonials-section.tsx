import { SectionTitle } from "@/features/shared/components/section-title";
import type { Testimonial } from "@/types/domain";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const isDirectVideoUrl = (url?: string) => {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  return clean.endsWith(".mp4") || clean.endsWith(".webm") || clean.includes(".mp4?") || clean.includes(".webm?");
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const videoTestimonials = testimonials.filter((item) => item.videoUrl?.trim());
  const quoteTestimonials = testimonials;

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
      {videoTestimonials.length > 0 ? (
        <section className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Videos</p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {videoTestimonials.map((testimonial) => (
              <article
                key={`${testimonial.id}-video`}
                className="space-y-3 border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-3"
              >
                <div className="mx-auto aspect-[9/16] w-full max-w-[260px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-black">
                  {isDirectVideoUrl(testimonial.videoUrl) ? (
                    <video
                      src={testimonial.videoUrl}
                      className="h-full w-full object-cover"
                      controls
                      playsInline
                      muted={testimonial.videoAutoplay ?? false}
                      autoPlay={testimonial.videoAutoplay ?? false}
                      loop={testimonial.videoAutoplay ?? false}
                      preload="metadata"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center">
                      <p className="text-xs uppercase tracking-[0.12em] text-white/70">Video externo</p>
                      <a
                        href={testimonial.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/30 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-white"
                      >
                        Ver video
                      </a>
                    </div>
                  )}
                </div>
                <div className="border-t border-[var(--color-border)] pt-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.03em]">{testimonial.musicianName}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {quoteTestimonials.map((testimonial) => (
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
