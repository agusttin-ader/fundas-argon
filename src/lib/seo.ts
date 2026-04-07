export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fundas-argon.vercel.app";

export const SITE_NAME = "Fundas Argon";

export const DEFAULT_OG_IMAGE = "/icon-512.png";

export const DEFAULT_SEO_DESCRIPTION =
  "Fundas semirrígidas artesanales para guitarra, bajo, batería, teclados y más. Modelos estándar y personalizados de Fundas Argon.";

export const DEFAULT_SEO_KEYWORDS = [
  "fundas para instrumentos",
  "fundas semirrigidas",
  "fundas guitarra",
  "fundas bajo",
  "fundas bateria",
  "fundas personalizadas",
  "Fundas Argon",
];

export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}
