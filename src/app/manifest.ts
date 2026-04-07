import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fundas Argon",
    short_name: "Argon",
    description: "Catálogo y panel móvil de Fundas Argon.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0f0f12",
    theme_color: "#0f0f12",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Panel admin",
        short_name: "Admin",
        description: "Abrir el panel de administración",
        url: "/admin",
      },
    ],
  };
}
