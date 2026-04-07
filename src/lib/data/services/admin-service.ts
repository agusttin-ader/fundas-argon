import { appRepository } from "@/lib/data/repositoryFactory";
import type {
  Customer,
  Order,
  OrderStatus,
  Product,
  Testimonial,
} from "@/types/domain";

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
  listOrders: () => appRepository.orders.list(),
  getOrder: (orderId: string) => appRepository.orders.get(orderId),
  upsertOrder: (order: Order) => appRepository.orders.upsert(order),
  removeOrder: (orderId: string) => appRepository.orders.remove(orderId),
  updateOrderStatus: (orderId: string, status: OrderStatus) =>
    appRepository.orders.updateStatus(orderId, status),
  listCustomers: () => appRepository.customers.list(),
  getCustomer: (customerId: string) => appRepository.customers.get(customerId),
  upsertCustomer: (customer: Customer) => appRepository.customers.upsert(customer),
  removeCustomer: (customerId: string) => appRepository.customers.remove(customerId),
  addCustomerNote: (customerId: string, text: string) =>
    appRepository.customers.addNote(customerId, { text }),
  removeCustomerNote: (customerId: string, noteId: string) =>
    appRepository.customers.removeNote(customerId, noteId),
};
