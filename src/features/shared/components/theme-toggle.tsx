"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/features/shared/components/theme-context";

function IconMoon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSun({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  // Primer render estable para evitar mismatch SSR/cliente.
  const isLight = mounted ? theme === "light" : false;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      onClick={toggleTheme}
      className="relative flex h-9 w-[4.25rem] shrink-0 cursor-pointer items-center rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] p-0.5 shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-surface-secondary)_40%,transparent)] transition-[border-color,background-color] [transition-duration:var(--argon-theme-duration)] [transition-timing-function:var(--argon-theme-ease)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--color-accent-red)_50%,transparent)]"
    >
      <span className="pointer-events-none absolute inset-0 flex items-stretch px-0.5">
        <span className="flex flex-1 items-center justify-center">
          <IconMoon
            className={`h-[0.95rem] w-[0.95rem] transition-colors [transition-duration:var(--argon-duration)] ${
              !isLight ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"
            }`}
          />
        </span>
        <span className="flex flex-1 items-center justify-center">
          <IconSun
            className={`h-[0.95rem] w-[0.95rem] transition-colors [transition-duration:var(--argon-duration)] ${
              isLight ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"
            }`}
          />
        </span>
      </span>

      <span
        aria-hidden
        className={`pointer-events-none absolute top-0.5 h-[calc(100%-4px)] w-[calc(50%-4px)] rounded-full border border-[color-mix(in_srgb,var(--color-border)_80%,transparent)] bg-[var(--color-surface-secondary)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.22)] transition-[left,background-color,border-color,box-shadow] [transition-duration:var(--argon-theme-duration)] [transition-timing-function:var(--argon-theme-ease)] ${
          isLight ? "left-[calc(50%+2px)]" : "left-0.5"
        }`}
      />
    </button>
  );
}
