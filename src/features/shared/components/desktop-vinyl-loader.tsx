"use client";

import Image from "next/image";

type DesktopVinylLoaderProps = {
  label: string;
  className?: string;
};

export function DesktopVinylLoader({ label, className }: DesktopVinylLoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className ?? ""}`}>
      <div className="argon-vinyl-base relative aspect-square w-28 animate-[spin_2.4s_linear_infinite] rounded-full md:w-44">
        <div className="argon-vinyl-ring absolute inset-[1.4%] rounded-full" />
        <div className="argon-vinyl-grooves absolute inset-[5.2%] rounded-full" />
        <div className="argon-vinyl-gloss absolute inset-[4.6%] rounded-full" />
        <div className="absolute inset-[36%] z-[1] rounded-full border border-[#2a2a2a] bg-[var(--color-bg)]" />
        <div className="absolute left-1/2 top-1/2 z-10 flex h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <Image
            src="/images/logo.png"
            alt="Fundas Argon"
            width={180}
            height={180}
            className="h-full w-full object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
            priority
          />
          <span className="sr-only">{label}</span>
        </div>
      </div>
    </div>
  );
}
