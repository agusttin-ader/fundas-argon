"use client";

import { useReducedMotion } from "framer-motion";

export function useAdminMotionReduced() {
  return useReducedMotion();
}

export const adminTapScale = 0.98;

export const adminFadeVariant = (reduceMotion: boolean | null) =>
  reduceMotion
    ? { initial: false, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, x: 12 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -10 },
        transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
      };
