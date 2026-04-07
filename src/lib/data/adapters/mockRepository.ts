import type { AppRepository } from "@/lib/data/contracts/repositories";
import {
  mockCustomizationRequests,
  mockCustomers,
  mockOrders,
  mockProducts,
  mockTestimonials,
} from "@/lib/data/mock/mockData";
import type {
  CustomizationRequest,
  Customer,
  Order,
  OrderStatus,
  Product,
  Testimonial,
} from "@/types/domain";

const inMemoryProducts: Product[] = [...mockProducts];
const inMemoryTestimonials: Testimonial[] = [...mockTestimonials];
const inMemoryCustomizationRequests: CustomizationRequest[] = [...mockCustomizationRequests];
const inMemoryOrders: Order[] = [...mockOrders];
const inMemoryCustomers: Customer[] = [...mockCustomers];

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const timelineLabelForStatus = (status: OrderStatus): string => {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "in_production":
      return "En producción";
    case "shipped":
      return "Enviado";
    case "delivered":
      return "Entregado";
    default:
      return status;
  }
};

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
  orders: {
    async list() {
      return [...inMemoryOrders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async get(orderId) {
      return inMemoryOrders.find((o) => o.id === orderId) ?? null;
    },
    async upsert(order) {
      const index = inMemoryOrders.findIndex((item) => item.id === order.id);
      if (index > -1) {
        inMemoryOrders[index] = order;
      } else {
        inMemoryOrders.unshift(order);
      }
      return order;
    },
    async remove(orderId) {
      const index = inMemoryOrders.findIndex((item) => item.id === orderId);
      if (index > -1) {
        inMemoryOrders.splice(index, 1);
      }
    },
    async updateStatus(orderId, status) {
      const index = inMemoryOrders.findIndex((item) => item.id === orderId);
      if (index === -1) {
        throw new Error("Pedido no encontrado");
      }
      const prev = inMemoryOrders[index];
      const at = new Date().toISOString();
      const timeline = [...prev.timeline, { at, status, label: timelineLabelForStatus(status) }];
      const updated: Order = {
        ...prev,
        status,
        updatedAt: at,
        timeline,
      };
      inMemoryOrders[index] = updated;
      return updated;
    },
  },
  customers: {
    async list() {
      return [...inMemoryCustomers].sort((a, b) => a.name.localeCompare(b.name));
    },
    async get(customerId) {
      return inMemoryCustomers.find((c) => c.id === customerId) ?? null;
    },
    async upsert(customer) {
      const index = inMemoryCustomers.findIndex((item) => item.id === customer.id);
      if (index > -1) {
        inMemoryCustomers[index] = customer;
      } else {
        inMemoryCustomers.push(customer);
      }
      return customer;
    },
    async remove(customerId) {
      const index = inMemoryCustomers.findIndex((item) => item.id === customerId);
      if (index > -1) {
        inMemoryCustomers.splice(index, 1);
      }
    },
    async addNote(customerId, notePayload) {
      const index = inMemoryCustomers.findIndex((item) => item.id === customerId);
      if (index === -1) {
        throw new Error("Cliente no encontrado");
      }
      const note = {
        id: createId(),
        text: notePayload.text,
        createdAt: new Date().toISOString(),
      };
      const customer = inMemoryCustomers[index];
      const updated: Customer = {
        ...customer,
        notes: [...customer.notes, note],
      };
      inMemoryCustomers[index] = updated;
      return updated;
    },
    async removeNote(customerId, noteId) {
      const index = inMemoryCustomers.findIndex((item) => item.id === customerId);
      if (index === -1) {
        throw new Error("Cliente no encontrado");
      }
      const customer = inMemoryCustomers[index];
      const updated: Customer = {
        ...customer,
        notes: customer.notes.filter((n) => n.id !== noteId),
      };
      inMemoryCustomers[index] = updated;
      return updated;
    },
  },
};
