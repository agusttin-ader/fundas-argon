"use client";

import { useEffect, useState } from "react";

export function useMinimumLoader(durationMs = 2000) {
  const [minimumLoaderElapsed, setMinimumLoaderElapsed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMinimumLoaderElapsed(true), durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs]);

  return minimumLoaderElapsed;
}
