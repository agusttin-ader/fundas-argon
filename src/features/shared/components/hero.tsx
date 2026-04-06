"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/features/shared/components/theme-toggle";

type TonearmMode = "rest" | "tracking";

export function Hero() {
  const vinylRef = useRef<HTMLDivElement | null>(null);
  const vinylGlossRef = useRef<HTMLDivElement | null>(null);
  const spinAnimationRef = useRef<Animation | null>(null);
  const settleAnimationRef = useRef<Animation | null>(null);
  const lightRafRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);
  const allowHoverSpinRef = useRef(false);
  const isLoopSpinningRef = useRef(false);
  const lastLightSampleRef = useRef<{ angle: number; time: number } | null>(null);
  const lightAngleRef = useRef(210);

  const [isHovering, setIsHovering] = useState(false);

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

  const animateSettle = (fromAngle: number, duration = 1700, extraTurns = 1.1) => {
    const element = vinylRef.current;
    if (!element || reducedMotionRef.current) return;

    settleAnimationRef.current?.cancel();
    isLoopSpinningRef.current = false;
    element.style.transform = `rotate(${fromAngle}deg)`;

    const loops = Math.max(0, Math.ceil(extraTurns));
    const targetAngle = Math.ceil((fromAngle + loops * 360 + 1) / 360) * 360;
    settleAnimationRef.current = element.animate(
      [{ transform: `rotate(${fromAngle}deg)` }, { transform: `rotate(${targetAngle}deg)` }],
      {
        duration,
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        fill: "forwards",
      },
    );
    settleAnimationRef.current.onfinish = () => {
      element.style.transform = "rotate(0deg)";
      isLoopSpinningRef.current = false;
      lightAngleRef.current = 210;
      element.style.setProperty("--vinyl-light-angle", "210deg");
      element.style.setProperty("--vinyl-light-alpha", "0.08");
      const gloss = vinylGlossRef.current;
      if (gloss) {
        gloss.style.transform = "rotate(0deg)";
        gloss.style.opacity = "0.14";
      }
    };
  };

  const startContinuousSpin = () => {
    const element = vinylRef.current;
    if (!element || reducedMotionRef.current || isLoopSpinningRef.current) return;

    const currentAngle = getCurrentAngle(element);
    settleAnimationRef.current?.cancel();
    spinAnimationRef.current?.cancel();
    element.style.transform = `rotate(${currentAngle}deg)`;
    spinAnimationRef.current = element.animate(
      [{ transform: `rotate(${currentAngle}deg)` }, { transform: `rotate(${currentAngle + 360}deg)` }],
      {
        duration: 2400,
        easing: "linear",
        iterations: Number.POSITIVE_INFINITY,
      },
    );
    isLoopSpinningRef.current = true;
  };

  useEffect(() => {
    const element = vinylRef.current;
    if (!element) return;

    const startDynamicLightLoop = () => {
      if (reducedMotionRef.current) return;
      if (lightRafRef.current) return;

      const tick = (timestamp: number) => {
        const target = vinylRef.current;
        if (!target) return;

        const angle = getCurrentAngle(target);
        const previous = lastLightSampleRef.current;
        let velocity = 0;

        if (previous) {
          const deltaTime = Math.max(1, timestamp - previous.time);
          let deltaAngle = angle - previous.angle;
          if (deltaAngle > 180) deltaAngle -= 360;
          if (deltaAngle < -180) deltaAngle += 360;
          velocity = Math.abs(deltaAngle / deltaTime);
        }
        lastLightSampleRef.current = { angle, time: timestamp };

        const targetLightAngle = 210 + angle * 0.08;
        lightAngleRef.current += (targetLightAngle - lightAngleRef.current) * 0.04;

        const targetAlpha = Math.min(0.16, 0.08 + velocity * 0.26);
        target.style.setProperty("--vinyl-light-angle", `${lightAngleRef.current.toFixed(2)}deg`);
        target.style.setProperty("--vinyl-light-alpha", targetAlpha.toFixed(3));

        const gloss = vinylGlossRef.current;
        if (gloss) {
          // Contrarrotación + pequeño "lag" para sensación física de luz.
          const counterRotation = -angle + lightAngleRef.current * 0.12;
          const dynamicOpacity = Math.min(0.26, 0.14 + velocity * 0.28);
          gloss.style.transform = `rotate(${counterRotation.toFixed(2)}deg)`;
          gloss.style.opacity = dynamicOpacity.toFixed(3);
        }

        lightRafRef.current = window.requestAnimationFrame(tick);
      };

      lightRafRef.current = window.requestAnimationFrame(tick);
    };

    const stopDynamicLightLoop = () => {
      if (lightRafRef.current) {
        window.cancelAnimationFrame(lightRafRef.current);
        lightRafRef.current = null;
      }
      lastLightSampleRef.current = null;
    };

    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hoverMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
    allowHoverSpinRef.current = hoverMedia.matches;
    const syncHoverCapability = (event: MediaQueryListEvent) => {
      allowHoverSpinRef.current = event.matches;
    };
    hoverMedia.addEventListener("change", syncHoverCapability);

    if (!reducedMotionRef.current) {
      element.style.transform = "rotate(-18deg)";
      animateSettle(-18, 2400, 1.6);
      startDynamicLightLoop();
    }

    return () => {
      spinAnimationRef.current?.cancel();
      settleAnimationRef.current?.cancel();
      stopDynamicLightLoop();
      hoverMedia.removeEventListener("change", syncHoverCapability);
    };
  }, []);

  const tonearmMode: TonearmMode = isHovering ? "tracking" : "rest";

  const startHoverTracking = () => {
    if (reducedMotionRef.current || !allowHoverSpinRef.current) return;
    setIsHovering(true);
    startContinuousSpin();
  };

  const stopHoverTracking = () => {
    setIsHovering(false);
    const element = vinylRef.current;
    if (!element || reducedMotionRef.current) return;

    const currentAngle = getCurrentAngle(element);
    spinAnimationRef.current?.cancel();
    isLoopSpinningRef.current = false;
    element.style.transform = `rotate(${currentAngle}deg)`;
    animateSettle(currentAngle, 2100, 1.02);
  };

  const tonearmTransformClass =
    tonearmMode === "tracking"
      ? "rotate-[93deg]"
      : "rotate-[10deg]";

  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] pt-6 pb-8 md:pt-8 md:pb-12">
      <div className="grid items-center gap-8 md:grid-cols-[0.95fr_1.05fr] 2xl:gap-12 min-[2560px]:gap-16">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-red)]">Fundas Argon</p>
          <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl 2xl:text-8xl min-[1920px]:text-[6.2rem] min-[2560px]:text-[7.4rem]">
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
          <div className="relative flex items-center justify-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 hidden md:block"
            >
              <div className="absolute left-[84.5%] top-[2.6%] h-[9.5%] w-[9.5%] rounded-full border border-[#434343] bg-[linear-gradient(160deg,#202020_0%,#111_100%)] shadow-[0_7px_16px_-9px_rgba(0,0,0,0.75)]" />
              <div className="absolute left-[87.6%] top-[5.6%] h-[3.2%] w-[3.2%] rounded-full border border-[#707070] bg-[#9d9d9d]" />
              <div className="absolute left-[89.1%] top-[7.2%] h-[5.8%] w-[47%] -translate-y-1/2">
                <div
                  className={`absolute inset-0 origin-[0%_50%] transform-gpu will-change-transform transition-transform duration-700 ease-in-out ${tonearmTransformClass}`}
                >
                  <span
                    className="absolute inset-y-0 left-0 right-[15%] rounded-full border border-[#3b3b3b] bg-[linear-gradient(90deg,#2b2b2b_0%,#5f5f5f_58%,#878787_100%)] shadow-[0_4px_10px_-7px_rgba(0,0,0,0.62)]"
                  />
                  <span className="absolute right-[-3%] top-[calc(50%-34%)] h-[68%] w-[19%] rounded-[2px] border border-[#4e4e4e] bg-[linear-gradient(90deg,#b0b0b0_0%,#8e8e8e_100%)]" />
                  <span className="absolute right-[1%] top-[calc(50%+34%)] h-[42%] w-[1.6%] rounded-full bg-[#d7d7d7]" />
                </div>
              </div>
            </div>
          <div
            ref={vinylRef}
            onMouseEnter={startHoverTracking}
            onMouseLeave={stopHoverTracking}
            className="argon-vinyl-base relative aspect-square w-[min(82vw,22rem)] shrink-0 rounded-full md:w-[30rem] 2xl:w-[36rem] min-[1920px]:w-[40rem] min-[2560px]:w-[50rem]"
          >
            {/* Aro externo más “plato/vinilo” */}
            <div className="argon-vinyl-ring absolute inset-[1.4%] rounded-full" />
            {/* Surcos finos del vinilo */}
            <div className="argon-vinyl-grooves absolute inset-[5.2%] rounded-full" />
            {/* Reflejo diagonal sutil para material plástico */}
            <div
              ref={vinylGlossRef}
              className="argon-vinyl-gloss absolute inset-[4.6%] rounded-full transform-gpu will-change-transform"
            />
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
              <span className="pointer-events-none absolute left-1/2 top-1/2 h-[6.5%] w-[6.5%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2f2f2f] bg-[var(--color-bg)]" />
            </div>
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
