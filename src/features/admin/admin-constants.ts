import type { InstrumentCategory, Product, ProductLine, Testimonial, OrderStatus } from "@/types/domain";

export type AdminSection = "resumen" | "productos" | "solicitudes" | "comentarios";

export const categoryOptions: InstrumentCategory[] = [
  "guitarra",
  "bajo",
  "bateria",
  "platos",
  "teclados",
  "percusion",
  "vientos",
  "dj",
  "otros",
];

export const lineOptions: ProductLine[] = ["estandar", "pro", "personalizada"];

export const categoryLabels: Record<InstrumentCategory, string> = {
  guitarra: "Guitarra",
  bajo: "Bajo",
  bateria: "Batería",
  platos: "Platos",
  teclados: "Teclados",
  percusion: "Percusión",
  vientos: "Vientos",
  dj: "DJ",
  otros: "Otros",
};

export const lineLabels: Record<ProductLine, string> = {
  estandar: "Estándar",
  pro: "Pro",
  personalizada: "Personalizada",
};

export const emptyProductForm: Product = {
  id: "",
  slug: "",
  name: "",
  category: "guitarra",
  line: "estandar",
  shortDescription: "",
  description: "",
  featured: false,
  featuredOrder: 99,
  hero: false,
  coverImage: "",
  gallery: [],
  specs: [],
  tags: [],
  variants: [],
};

export const emptyTestimonial: Testimonial = {
  id: "",
  musicianName: "",
  role: "",
  quote: "",
  featured: false,
  videoUrl: "",
  videoAutoplay: false,
};

export const quickSpecTemplates = [
  "Acolchado de alta densidad",
  "Cierres reforzados",
  "Bolsillo frontal amplio",
  "Manijas reforzadas",
];

export const quickTagTemplates = ["Reforzada", "A medida", "Argon Pro", "Viaje", "Escenario"];

export const requestStatusOptions = ["pendiente", "contactado", "cerrado"] as const;

export const requestStatusTone: Record<(typeof requestStatusOptions)[number], string> = {
  pendiente: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  contactado: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  cerrado: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
};

export const orderStatusOptions: OrderStatus[] = [
  "pending",
  "in_production",
  "shipped",
  "delivered",
];

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "Pendiente",
  in_production: "En producción",
  shipped: "Enviado",
  delivered: "Entregado",
};

export const orderChannelLabels = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  web: "Web",
  other: "Otro",
} as const;

export function isDirectVideoUrl(url?: string) {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  return clean.endsWith(".mp4") || clean.endsWith(".webm") || clean.includes(".mp4?") || clean.includes(".webm?");
}
