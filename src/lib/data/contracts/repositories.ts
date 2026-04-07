import type {
  CustomizationRequest,
  Customer,
  CustomerNote,
  Order,
  OrderStatus,
  Product,
  Testimonial,
} from "@/types/domain";

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

export interface OrderRepository {
  list(): Promise<Order[]>;
  get(orderId: string): Promise<Order | null>;
  upsert(order: Order): Promise<Order>;
  remove(orderId: string): Promise<void>;
  updateStatus(orderId: string, status: OrderStatus): Promise<Order>;
}

export interface CustomerRepository {
  list(): Promise<Customer[]>;
  get(customerId: string): Promise<Customer | null>;
  upsert(customer: Customer): Promise<Customer>;
  remove(customerId: string): Promise<void>;
  addNote(customerId: string, note: Omit<CustomerNote, "id" | "createdAt">): Promise<Customer>;
  removeNote(customerId: string, noteId: string): Promise<Customer>;
}

export interface AppRepository {
  products: ProductRepository;
  testimonials: TestimonialRepository;
  customizationRequests: CustomizationRepository;
  orders: OrderRepository;
  customers: CustomerRepository;
}
