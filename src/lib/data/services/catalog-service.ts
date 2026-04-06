import { appRepository } from "@/lib/data/repositoryFactory";

export const catalogService = {
  listProducts: () => appRepository.products.list(),
  listTestimonials: () => appRepository.testimonials.list(),
};
