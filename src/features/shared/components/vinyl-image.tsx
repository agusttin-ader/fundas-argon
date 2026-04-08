"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type VinylImageProps = ImageProps & {
  containerClassName?: string;
};

export function VinylImage({ containerClassName, onLoad, ...props }: VinylImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative inline-flex items-center justify-center ${containerClassName ?? ""}`}>
      {!loaded ? (
        <div className="pointer-events-none absolute inset-0 z-10 hidden items-center justify-center md:flex">
          <div className="argon-vinyl-base relative aspect-square w-10 animate-[spin_1.2s_linear_infinite] rounded-full">
            <div className="argon-vinyl-ring absolute inset-[1.4%] rounded-full" />
            <div className="argon-vinyl-grooves absolute inset-[5.2%] rounded-full" />
            <div className="argon-vinyl-gloss absolute inset-[4.6%] rounded-full" />
            <div className="absolute inset-[36%] z-[1] rounded-full border border-[#2a2a2a] bg-[var(--color-bg)]" />
          </div>
        </div>
      ) : null}
      <Image
        {...props}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
      />
    </div>
  );
}
