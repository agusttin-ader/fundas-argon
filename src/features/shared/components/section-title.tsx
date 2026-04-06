interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="space-y-3 border-b border-[color-mix(in_srgb,var(--color-accent-red)_35%,var(--color-border))] pb-4">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent-red)]">{eyebrow}</p>
      <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">{title}</h2>
      <p className="max-w-2xl text-sm text-[var(--color-text-muted)] md:text-base">{description}</p>
    </div>
  );
}
