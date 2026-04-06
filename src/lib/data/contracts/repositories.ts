import type { CustomizationRequest, Product, Testimonial } from "@/types/domain";

export interface ProductRepository {
  list(): Promise<Product[]>;
  upsert(product: Product): Promise<Product>;
  remove(productId: string): Promise<void>;
}

export interface TestimonialRepository {
  list(): Promise<Testimonial[]>;
  upsert(testimonial: Testimonial): Promise<Testimonial>;
  remove(testimonialId: string): Promise<void>;
}

export interface CustomizationRepository {
  list(): Promise<CustomizationRequest[]>;
  create(payload: Omit<CustomizationRequest, "id" | "createdAt" | "status">): Promise<CustomizationRequest>;
  updateStatus(
    requestId: string,
    status: CustomizationRequest["status"],
  ): Promise<CustomizationRequest>;
}

export interface AppRepository {
  products: ProductRepository;
  testimonials: TestimonialRepository;
  customizationRequests: CustomizationRepository;
}
