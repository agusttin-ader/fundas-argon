"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface CountUpNumberProps {
  end: number;
  durationMs?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

const easeOutCubic = (value: number) => 1 - (1 - value) ** 3;

export function CountUpNumber({
  end,
  durationMs = 1200,
  decimals = 0,
  suffix = "",
  prefix = "",
}: CountUpNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const rootRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const timeoutId = window.setTimeout(() => setDisplayValue(end), 0);
      return () => window.clearTimeout(timeoutId);
    }

    let frameId = 0;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = easeOutCubic(progress);
      setDisplayValue(end * eased);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        setDisplayValue(end);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [durationMs, end, isVisible]);

  const formatted = useMemo(() => {
    return displayValue.toLocaleString("es-AR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }, [decimals, displayValue]);

  return (
    <span ref={rootRef}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
