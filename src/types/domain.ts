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
  videoUrl?: string;
  videoAutoplay?: boolean;
}

export interface CustomizationRequest {
  id: string;
  fullName: string;
  email: string;
  instrument: string;
  message: string;
  imageUrls?: string[];
  createdAt: string;
  status: "pendiente" | "contactado" | "cerrado";
}

export type OrderStatus = "pending" | "in_production" | "shipped" | "delivered";

export type OrderChannel = "whatsapp" | "instagram" | "web" | "other";

export interface OrderTimelineEntry {
  at: string;
  status: OrderStatus;
  label?: string;
}

export interface OrderLine {
  label: string;
  quantity: number;
  unitPrice?: number;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  customerId?: string;
  channel: OrderChannel;
  summary: string;
  lines: OrderLine[];
  notes?: string;
  timeline: OrderTimelineEntry[];
}

export interface CustomerNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  tags: string[];
  notes: CustomerNote[];
}

export interface EmployeeUser {
  id: string;
  email: string;
  displayName: string;
  role: "staff" | "admin";
}
