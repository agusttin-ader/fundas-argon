import { appRepository } from "@/lib/data/repositoryFactory";
import type { Product, Testimonial } from "@/types/domain";

export const adminService = {
  upsertProduct: (product: Product) => appRepository.products.upsert(product),
  removeProduct: (productId: string) => appRepository.products.remove(productId),
  upsertTestimonial: (testimonial: Testimonial) =>
    appRepository.testimonials.upsert(testimonial),
  removeTestimonial: (testimonialId: string) => appRepository.testimonials.remove(testimonialId),
  listProducts: () => appRepository.products.list(),
  listTestimonials: () => appRepository.testimonials.list(),
  listCustomizationRequests: () => appRepository.customizationRequests.list(),
  updateCustomizationStatus: (
    requestId: string,
    status: "pendiente" | "contactado" | "cerrado",
  ) => appRepository.customizationRequests.updateStatus(requestId, status),
};
