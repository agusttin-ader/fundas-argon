import { DesktopVinylLoader } from "@/features/shared/components/desktop-vinyl-loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)] backdrop-blur-sm">
      <DesktopVinylLoader label="Cargando..." className="w-full text-center" />
    </div>
  );
}
