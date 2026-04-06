import type { AppRepository } from "@/lib/data/contracts/repositories";
import {
  mockCustomizationRequests,
  mockProducts,
  mockTestimonials,
} from "@/lib/data/mock/mockData";
import type { CustomizationRequest, Product, Testimonial } from "@/types/domain";

const inMemoryProducts: Product[] = [...mockProducts];
const inMemoryTestimonials: Testimonial[] = [...mockTestimonials];
const inMemoryCustomizationRequests: CustomizationRequest[] = [...mockCustomizationRequests];

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const mockRepository: AppRepository = {
  products: {
    async list() {
      return [...inMemoryProducts].sort((a, b) => a.featuredOrder - b.featuredOrder);
    },
    async upsert(product) {
      const index = inMemoryProducts.findIndex((item) => item.id === product.id);
      if (index > -1) {
        inMemoryProducts[index] = product;
      } else {
        inMemoryProducts.push(product);
      }
      return product;
    },
    async remove(productId) {
      const index = inMemoryProducts.findIndex((item) => item.id === productId);
      if (index > -1) {
        inMemoryProducts.splice(index, 1);
      }
    },
  },
  testimonials: {
    async list() {
      return [...inMemoryTestimonials];
    },
    async upsert(testimonial) {
      const index = inMemoryTestimonials.findIndex((item) => item.id === testimonial.id);
      if (index > -1) {
        inMemoryTestimonials[index] = testimonial;
      } else {
        inMemoryTestimonials.push(testimonial);
      }
      return testimonial;
    },
    async remove(testimonialId) {
      const index = inMemoryTestimonials.findIndex((item) => item.id === testimonialId);
      if (index > -1) {
        inMemoryTestimonials.splice(index, 1);
      }
    },
  },
  customizationRequests: {
    async list() {
      return [...inMemoryCustomizationRequests];
    },
    async create(payload) {
      const request: CustomizationRequest = {
        id: createId(),
        createdAt: new Date().toISOString(),
        status: "pendiente",
        ...payload,
      };
      inMemoryCustomizationRequests.unshift(request);
      return request;
    },
    async updateStatus(requestId, status) {
      const index = inMemoryCustomizationRequests.findIndex((item) => item.id === requestId);
      if (index === -1) {
        throw new Error("Solicitud no encontrada");
      }
      const updated = { ...inMemoryCustomizationRequests[index], status };
      inMemoryCustomizationRequests[index] = updated;
      return updated;
    },
  },
};
