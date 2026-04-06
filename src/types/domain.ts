export type InstrumentCategory =
  | "guitarra"
  | "bajo"
  | "bateria"
  | "platos"
  | "teclados"
  | "percusion"
  | "vientos"
  | "dj"
  | "otros";

export type ProductLine = "estandar" | "pro" | "personalizada";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: InstrumentCategory;
  line: ProductLine;
  shortDescription: string;
  description: string;
  featured: boolean;
  featuredOrder: number;
  hero: boolean;
  coverImage: string;
  gallery: string[];
  specs: string[];
  tags: string[];
  priceFrom?: number;
  stock?: number;
  variants?: string[];
}

export interface Testimonial {
  id: string;
  musicianName: string;
  role: string;
  quote: string;
  featured: boolean;
}

export interface CustomizationRequest {
  id: string;
  fullName: string;
  email: string;
  instrument: string;
  message: string;
  createdAt: string;
  status: "pendiente" | "contactado" | "cerrado";
}

export interface EmployeeUser {
  id: string;
  email: string;
  displayName: string;
  role: "staff" | "admin";
}
