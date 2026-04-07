"use client";

import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";
import { useCallback, type ReactNode } from "react";

const revealWidth = 228;

type Action = { label: string; onPress: () => void; tone?: "default" | "danger" };

export function SwipeableAdminCard(props: {
  children: ReactNode;
  actions: Action[];
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const revealOpacity = useTransform(x, [-revealWidth, 0], [1, 0]);

  const close = useCallback(() => {
    if (reduceMotion) return;
    void animate(x, 0, { type: "spring", stiffness: 420, damping: 35 });
  }, [reduceMotion, x]);

  const onDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (reduceMotion) return;
    const shouldOpen = info.offset.x < -48 || info.velocity.x < -180;
    void animate(x, shouldOpen ? -revealWidth : 0, { type: "spring", stiffness: 420, damping: 38 });
  };

  if (reduceMotion) {
    return <div className="relative">{props.children}</div>;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <motion.div
        className="absolute inset-y-0 right-0 flex w-[228px] items-stretch justify-end gap-1 bg-[var(--color-surface-secondary)] pr-1"
        style={{ opacity: revealOpacity }}
      >
        {props.actions.map((a) => (
          <button
            key={a.label}
            type="button"
            className={`flex flex-1 flex-col items-center justify-center rounded-lg px-2 text-center text-xs font-semibold uppercase tracking-wide ${
              a.tone === "danger" ? "text-rose-300" : "text-[var(--color-accent-red)]"
            }`}
            onClick={() => {
              a.onPress();
              close();
            }}
          >
            {a.label}
          </button>
        ))}
      </motion.div>
      <motion.div
        drag="x"
        dragConstraints={{ left: -revealWidth, right: 0 }}
        dragElastic={{ left: 0.08, right: 0.02 }}
        style={{ x }}
        onDragEnd={onDragEnd}
        className="relative z-[1] bg-[var(--color-surface)] shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
      >
        {props.children}
      </motion.div>
    </div>
  );
}
