"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ThemeToggle } from "@/features/shared/components/theme-toggle";

export function Hero() {
  const vinylRef = useRef<HTMLDivElement | null>(null);
  const spinAnimationRef = useRef<Animation | null>(null);
  const settleAnimationRef = useRef<Animation | null>(null);
  const reducedMotionRef = useRef(false);
  const allowHoverSpinRef = useRef(false);

  const getCurrentAngle = (element: HTMLElement) => {
    const transform = window.getComputedStyle(element).transform;
    if (!transform || transform === "none") {
      return 0;
    }
    const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
    if (!matrixMatch) {
      return 0;
    }
    const values = matrixMatch[1]?.split(",").map((value) => Number(value.trim()));
    if (!values || values.length < 2) {
      return 0;
    }
    const [a, b] = values;
    const angle = (Math.atan2(b, a) * 180) / Math.PI;
    return (angle + 360) % 360;
  };

  const animateSettle = (fromAngle: number) => {
    const element = vinylRef.current;
    if (!element || reducedMotionRef.current) return;

    settleAnimationRef.current?.cancel();
    element.style.transform = `rotate(${fromAngle}deg)`;

    const targetAngle = Math.ceil((fromAngle + 540) / 360) * 360;
    settleAnimationRef.current = element.animate(
      [{ transform: `rotate(${fromAngle}deg)` }, { transform: `rotate(${targetAngle}deg)` }],
      {
        duration: 2600,
        easing: "cubic-bezier(0.22, 0.94, 0.32, 1)",
        fill: "forwards",
      },
    );
  };

  useEffect(() => {
    const element = vinylRef.current;
    if (!element) return;

    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hoverMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
    allowHoverSpinRef.current = hoverMedia.matches;
    const syncHoverCapability = (event: MediaQueryListEvent) => {
      allowHoverSpinRef.current = event.matches;
    };
    hoverMedia.addEventListener("change", syncHoverCapability);

    if (!reducedMotionRef.current) {
      element.style.transform = "rotate(-12deg)";
      animateSettle(-12);
    }

    return () => {
      spinAnimationRef.current?.cancel();
      settleAnimationRef.current?.cancel();
      hoverMedia.removeEventListener("change", syncHoverCapability);
    };
  }, []);

  const startHoverSpin = () => {
    const element = vinylRef.current;
    if (!element || reducedMotionRef.current || !allowHoverSpinRef.current) return;

    const currentAngle = getCurrentAngle(element);
    settleAnimationRef.current?.cancel();
    spinAnimationRef.current?.cancel();
    element.style.transform = `rotate(${currentAngle}deg)`;

    spinAnimationRef.current = element.animate(
      [{ transform: `rotate(${currentAngle}deg)` }, { transform: `rotate(${currentAngle + 360}deg)` }],
      {
        duration: 2200,
        easing: "linear",
        iterations: Number.POSITIVE_INFINITY,
      },
    );
  };

  const stopHoverSpin = () => {
    const element = vinylRef.current;
    if (!element || reducedMotionRef.current || !allowHoverSpinRef.current) return;

    const currentAngle = getCurrentAngle(element);
    spinAnimationRef.current?.cancel();
    element.style.transform = `rotate(${currentAngle}deg)`;
    animateSettle(currentAngle);
  };

  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] pt-6 pb-8 md:pt-8 md:pb-12">
      <div className="grid items-center gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-red)]">Fundas Argon</p>
          <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
            Catalogo
            <br />
            profesional
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-[var(--color-text-muted)]">
            Fundas semirrigidas para guitarra, bajo, bateria, teclados y mas. Trabajos standard y a
            medida, pensados para viajar seguro, ensayar comodo y tocar sin preocupaciones.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#catalogo" className="argon-button-primary">
              Ver catalogo
            </a>
            <a href="#personalizacion" className="argon-button-secondary">
              Personalizar
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-4">
          <div
            ref={vinylRef}
            onMouseEnter={startHoverSpin}
            onMouseLeave={stopHoverSpin}
            className="relative aspect-square w-[min(82vw,22rem)] shrink-0 rounded-full bg-[radial-gradient(circle,var(--color-bg)_16%,#111_17%,#0f0f0f_29%,#1d1d1d_30%,#0d0d0d_40%,#1f1f1f_41%,#0d0d0d_52%,#1d1d1d_53%,#0d0d0d_63%,#1e1e1e_64%,#000_100%)] md:w-[30rem]"
          >
            {/* Etiqueta central del vinilo (diámetro ~28% del disco). */}
            <div className="absolute inset-[36%] z-[1] rounded-full border border-[#2a2a2a] bg-[var(--color-bg)]" />
            {/* Logo acorde al segundo círculo / área de etiqueta grande (~42–44% del disco). */}
            <div className="absolute left-1/2 top-1/2 z-10 flex h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 items-center justify-center md:h-[44%] md:w-[44%]">
              <Image
                src="/images/logo.png"
                alt="Fundas Argon"
                width={320}
                height={320}
                className="h-full w-full object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
                priority
              />
            </div>
          </div>
          <div className="mt-4 hidden md:flex">
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-[var(--color-border)] pt-4 text-xs uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
        <span>hecho en argentina</span>
        <Link href="/admin" className="argon-link-accent underline">
          panel admin
        </Link>
      </div>
    </section>
  );
}
