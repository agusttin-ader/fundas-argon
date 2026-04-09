"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import { VinylImage } from "@/features/shared/components/vinyl-image";
import {
  categoryLabels,
  categoryOptions,
  emptyProductForm,
  lineLabels,
  orderChannelLabels,
  orderStatusLabels,
  orderStatusOptions,
  requestStatusOptions,
} from "@/features/admin/admin-constants";
import { MobileProductWizard } from "@/features/admin/mobile/mobile-product-wizard";
import { SwipeableAdminCard } from "@/features/admin/mobile/swipeable-admin-card";
import { useAdminMobileStore } from "@/features/admin/stores/admin-mobile-store";
import {
  adminFadeVariant,
  adminTapScale,
  useAdminMotionReduced,
} from "@/features/admin/mobile/use-admin-motion";
import { useAuth } from "@/lib/auth/auth-context";
import { CrmWhatsAppLink } from "@/features/admin/components/crm-whatsapp-link";
import { buildWhatsAppChatUrl } from "@/lib/whatsapp";
import { useQueryClient } from "@tanstack/react-query";
import type {
  CustomizationRequest,
  Customer,
  InstrumentCategory,
  Order,
  OrderChannel,
  OrderStatus,
  Product,
  ProductLine,
  Testimonial,
} from "@/types/domain";

function MobileNavIcon(props: {
  name: "dashboard" | "orders" | "products" | "customers" | "profile";
  active: boolean;
}) {
  const stroke = props.active ? "currentColor" : "currentColor";
  const common = "h-6 w-6";

  if (props.name === "dashboard") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <path d="M3 10.5 12 3l9 7.5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M5.5 9.8V20h13V9.8" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (props.name === "orders") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <rect x="4" y="5" width="16" height="14" rx="3" stroke={stroke} strokeWidth="1.8" />
        <path d="M8 10h8M8 14h5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (props.name === "products") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <path d="M12 3 4.5 7 12 11l7.5-4L12 3Z" stroke={stroke} strokeWidth="1.8" />
        <path d="M4.5 7v10L12 21l7.5-4V7" stroke={stroke} strokeWidth="1.8" />
      </svg>
    );
  }
  if (props.name === "customers") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <circle cx="9" cy="9" r="3" stroke={stroke} strokeWidth="1.8" />
        <path d="M3.5 18c.9-2.6 3-4 5.5-4s4.6 1.4 5.5 4" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="17" cy="10" r="2.5" stroke={stroke} strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
      <circle cx="12" cy="8.5" r="3.2" stroke={stroke} strokeWidth="1.8" />
      <path d="M5 20c1.1-3 3.7-4.8 7-4.8s5.9 1.8 7 4.8" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export type MobileAdminShellProps = {
  filteredProducts: Product[];
  testimonials: Testimonial[];
  filteredTestimonials: Testimonial[];
  sortedRequests: CustomizationRequest[];
  filteredRequests: CustomizationRequest[];
  orders: Order[];
  filteredOrders: Order[];
  customers: Customer[];
  filteredCustomers: Customer[];
  pendingRequests: number;
  pendingOrdersCount: number;
  featuredProducts: number;
  featuredTestimonials: number;
  contactadosRequests: number;
  closedRequests: number;
  productsCount: number;
  customersCount: number;
  testimonialsCount: number;
  productForm: Product;
  setProductForm: Dispatch<SetStateAction<Product>>;
  specInput: string;
  setSpecInput: (v: string) => void;
  tagInput: string;
  setTagInput: (v: string) => void;
  testimonialForm: Testimonial;
  setTestimonialForm: Dispatch<SetStateAction<Testimonial>>;
  requestSearch: string;
  setRequestSearch: (v: string) => void;
  requestStatusFilter: (typeof requestStatusOptions)[number] | "all";
  setRequestStatusFilter: (v: (typeof requestStatusOptions)[number] | "all") => void;
  productSearch: string;
  setProductSearch: (v: string) => void;
  productFilterLine: ProductLine | "all";
  setProductFilterLine: (v: ProductLine | "all") => void;
  productFilterCategory: InstrumentCategory | "all";
  setProductFilterCategory: (v: InstrumentCategory | "all") => void;
  testimonialSearch: string;
  setTestimonialSearch: (v: string) => void;
  customerSearch: string;
  setCustomerSearch: (v: string) => void;
  customerTagInput: string;
  setCustomerTagInput: (v: string) => void;
  customerNoteInput: string;
  setCustomerNoteInput: (v: string) => void;
  appendProductItem: (field: "specs" | "tags" | "variants" | "gallery", rawValue: string) => void;
  removeProductItem: (field: "specs" | "tags" | "variants" | "gallery", value: string) => void;
  resetProductForm: () => void;
  saveProductMutation: { mutateAsync: (p: Product) => Promise<unknown>; isPending: boolean };
  removeProductMutation: { mutate: (id: string) => void };
  duplicateProduct: (product: Product) => Promise<void>;
  saveTestimonialMutation: { mutateAsync: (t: Testimonial) => Promise<unknown>; isPending: boolean };
  removeTestimonialMutation: { mutate: (id: string) => void };
  statusMutation: {
    mutate: (p: { id: string; status: "pendiente" | "contactado" | "cerrado" }) => void;
  };
  orderStatusMutation: { mutate: (p: { id: string; status: OrderStatus }) => void };
  removeOrderMutation: { mutate: (id: string) => void };
  duplicateOrder: (order: Order) => Promise<void>;
  upsertCustomerMutation: { mutateAsync: (c: Customer) => Promise<unknown> };
  addCustomerNoteMutation: {
    mutateAsync: (p: { customerId: string; text: string }) => Promise<unknown>;
  };
  removeCustomerMutation: { mutate: (id: string) => void };
  getCustomer: (id: string) => Customer | undefined;
  customerOrders: (customerId: string) => Order[];
  quickOrderMutation: {
    mutateAsync: (p: {
      channel: OrderChannel;
      summary: string;
      customerName?: string;
      phone?: string;
      email?: string;
    }) => Promise<unknown>;
    isPending: boolean;
  };
};

export function MobileAdminShell(props: MobileAdminShellProps) {
  const { user, logOut } = useAuth();
  const queryClient = useQueryClient();
  const reduceMotion = useAdminMotionReduced();
  const fade = adminFadeVariant(reduceMotion ?? false);
  const {
    tab,
    setTab,
    ordersSegment,
    setOrdersSegment,
    customersSegment,
    setCustomersSegment,
    stack,
    push,
    pop,
    orderStatusFilter,
    setOrderStatusFilter,
  } = useAdminMobileStore();

  const [qChannel, setQChannel] = useState<OrderChannel>("whatsapp");
  const [qSummary, setQSummary] = useState("");
  const [qName, setQName] = useState("");
  const [qPhone, setQPhone] = useState("");
  const [qEmail, setQEmail] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [pullStartY, setPullStartY] = useState<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selectedOrder = useMemo(() => {
    if (stack.screen !== "order") return undefined;
    return props.orders.find((o) => o.id === stack.id);
  }, [props.orders, stack]);

  const selectedCustomer = useMemo(() => {
    if (stack.screen !== "customer") return undefined;
    return props.customers.find((c) => c.id === stack.id);
  }, [props.customers, stack]);

  const selectedCustomerWhatsAppUrl = useMemo(
    () => (selectedCustomer ? buildWhatsAppChatUrl(selectedCustomer.phone) : null),
    [selectedCustomer],
  );

  const showFab =
    stack.screen === "root" &&
    ((tab === "products") || (tab === "orders" && ordersSegment === "ventas"));

  const unreadConsultas = props.pendingRequests;
  const pendingSales = props.pendingOrdersCount;

  const filteredOrdersMobile = useMemo(() => {
    return props.filteredOrders.filter(
      (o) => orderStatusFilter === "all" || o.status === orderStatusFilter,
    );
  }, [props.filteredOrders, orderStatusFilter]);

  const globalMatches = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    const product = props.filteredProducts.find((p) => p.name.toLowerCase().includes(q));
    if (product) return [{ type: "product" as const, id: product.id, label: product.name }];
    const order = props.orders.find(
      (o) => o.summary.toLowerCase().includes(q) || o.id.toLowerCase().includes(q),
    );
    if (order) return [{ type: "order" as const, id: order.id, label: order.summary }];
    const customer = props.customers.find((c) => c.name.toLowerCase().includes(q));
    if (customer) return [{ type: "customer" as const, id: customer.id, label: customer.name }];
    return [];
  }, [globalSearch, props.filteredProducts, props.orders, props.customers]);

  const refreshAll = async () => {
    const startedAt = Date.now();
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["products"] }),
      queryClient.invalidateQueries({ queryKey: ["orders"] }),
      queryClient.invalidateQueries({ queryKey: ["customers"] }),
      queryClient.invalidateQueries({ queryKey: ["customization-requests"] }),
      queryClient.invalidateQueries({ queryKey: ["testimonials"] }),
    ]);
    const elapsed = Date.now() - startedAt;
    const minSpinMs = 2000;
    const remaining = Math.max(0, minSpinMs - elapsed);
    setTimeout(() => setIsRefreshing(false), remaining);
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return "Buen día";
    if (hour >= 12 && hour < 19) return "Buenas tardes";
    return "Buenas noches";
  }, []);

  return (
    <main className="min-h-[100dvh] bg-[var(--color-surface)] pb-[calc(env(safe-area-inset-bottom)+7.25rem)] pt-[env(safe-area-inset-top)]">
      <div className="sticky top-0 z-20 border-b border-[color-mix(in_srgb,var(--color-border)_70%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] px-4 py-3.5 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" aria-label="Ir al inicio">
            <VinylImage
              src="/images/logo.png"
              alt="Argon"
              width={160}
              height={160}
              className="h-14 w-14 shrink-0 rounded-xl object-contain"
            />
          </Link>
          <div className="text-right">
            <p className="whitespace-nowrap text-lg font-bold leading-tight text-[var(--color-text-primary)]">
              👋 {greeting}, {user?.displayName ?? "Equipo Argon"} !
            </p>
          </div>
        </div>
      </div>

      <div
        className="px-4 pt-4"
        onTouchStart={(e) => {
          if (stack.screen !== "root") return;
          if (window.scrollY <= 4) setPullStartY(e.touches[0].clientY);
        }}
        onTouchMove={(e) => {
          if (pullStartY == null || stack.screen !== "root") return;
          const d = e.touches[0].clientY - pullStartY;
          if (d > 0) setPullDistance(Math.min(d, 90));
        }}
        onTouchEnd={async () => {
          if (pullDistance > 68 && !isRefreshing) await refreshAll();
          setPullStartY(null);
          setPullDistance(0);
        }}
      >
        {stack.screen === "root" && (isRefreshing || pullDistance > 0) ? (
          <div className="mb-2 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-1 py-1">
              <div className="relative flex h-8 w-8 items-center justify-center">
                <motion.div
                  className="relative rounded-full"
                  animate={
                    isRefreshing
                      ? { rotate: [0, 360] }
                      : { rotate: Math.min(pullDistance * 3, 270) }
                  }
                  transition={
                    isRefreshing
                      ? { duration: 0.9, repeat: Infinity, ease: "linear" }
                      : { type: "spring", stiffness: 180, damping: 18 }
                  }
                >
                  <VinylImage
                    src="/images/logo.png"
                    alt="Vinilo"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-[var(--color-surface)]/90" />
                </motion.div>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                {isRefreshing
                  ? "Actualizando..."
                  : pullDistance > 68
                    ? "Soltá para actualizar"
                    : "Deslizá para actualizar"}
              </p>
            </div>
          </div>
        ) : null}
        <AnimatePresence mode="wait">
          {stack.screen === "root" ? (
            <motion.div key={`root-${tab}`} {...fade} className="pb-8">
              {tab === "dashboard" ? (
                <div className="space-y-4">
                  <p className="text-sm text-[var(--color-text-muted)]">Resumen</p>
                  <input
                    className="argon-input w-full rounded-2xl py-3.5 text-base"
                    placeholder="Buscar rápido: pedido, cliente o producto"
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                  />
                  {globalSearch.trim() ? (
                    <div className="space-y-2">
                      {globalMatches.length === 0 ? (
                        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-3 text-sm text-[var(--color-text-muted)]">
                          Sin resultados
                        </div>
                      ) : (
                        globalMatches.map((m) => (
                          <button
                            key={`${m.type}-${m.id}`}
                            type="button"
                            className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-3 text-left text-sm"
                            onClick={() => {
                              if (m.type === "order") {
                                setTab("orders");
                                setOrdersSegment("ventas");
                                push({ screen: "order", id: m.id });
                              } else if (m.type === "customer") {
                                setTab("customers");
                                setCustomersSegment("crm");
                                push({ screen: "customer", id: m.id });
                              } else {
                                setTab("products");
                              }
                              setGlobalSearch("");
                            }}
                          >
                            {m.label}
                          </button>
                        ))
                      )}
                    </div>
                  ) : null}
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      type="button"
                      whileTap={reduceMotion ? undefined : { scale: adminTapScale }}
                      className="rounded-2xl bg-[var(--color-accent-red)] px-4 py-3.5 text-sm font-semibold text-white"
                      onClick={() => {
                        setTab("orders");
                        setOrdersSegment("ventas");
                        push({ screen: "quickOrder" });
                      }}
                    >
                      + Pedido rápido
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={reduceMotion ? undefined : { scale: adminTapScale }}
                      className="rounded-2xl border border-[var(--color-border)] px-4 py-3.5 text-sm font-semibold text-[var(--color-text-primary)]"
                      onClick={() => {
                        setTab("products");
                        props.setProductForm(emptyProductForm);
                        props.setSpecInput("");
                        props.setTagInput("");
                        push({ screen: "productWizard" });
                      }}
                    >
                      + Producto
                    </motion.button>
                  </div>
                  <motion.button
                    type="button"
                    whileTap={reduceMotion ? undefined : { scale: adminTapScale }}
                    className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-5 text-left shadow-lg shadow-black/10"
                    onClick={() => {
                      setOrderStatusFilter("pending");
                      setOrdersSegment("ventas");
                      setTab("orders");
                    }}
                  >
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                      Ventas pendientes
                    </p>
                    <p className="mt-1 text-[2rem] font-semibold text-[var(--color-accent-red)]">
                      {props.pendingOrdersCount}
                    </p>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={reduceMotion ? undefined : { scale: adminTapScale }}
                    className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-5 text-left shadow-lg shadow-black/10"
                    onClick={() => {
                      setOrdersSegment("consultas");
                      setTab("orders");
                    }}
                  >
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                      Consultas web sin responder
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-amber-300">{props.pendingRequests}</p>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={reduceMotion ? undefined : { scale: adminTapScale }}
                    className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-5 text-left shadow-lg shadow-black/10"
                    onClick={() => setTab("products")}
                  >
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                      Productos en catálogo
                    </p>
                    <p className="mt-1 text-3xl font-semibold">{props.productsCount}</p>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={reduceMotion ? undefined : { scale: adminTapScale }}
                    className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-5 text-left shadow-lg shadow-black/10"
                    onClick={() => {
                      setCustomersSegment("crm");
                      setTab("customers");
                    }}
                  >
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                      Clientes CRM
                    </p>
                    <p className="mt-1 text-3xl font-semibold">{props.customersCount}</p>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={reduceMotion ? undefined : { scale: adminTapScale }}
                    className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-5 text-left shadow-lg shadow-black/10"
                    onClick={() => {
                      setCustomersSegment("testimonios");
                      setTab("customers");
                    }}
                  >
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                      Testimonios destacados
                    </p>
                    <p className="mt-1 text-3xl font-semibold">{props.featuredTestimonials}</p>
                  </motion.button>
                </div>
              ) : null}

              {tab === "orders" ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`flex-1 rounded-2xl py-3.5 text-base font-semibold ${
                        ordersSegment === "ventas"
                          ? "bg-[var(--color-accent-red)] text-white"
                          : "border border-[var(--color-border)] text-[var(--color-text-muted)]"
                      }`}
                      onClick={() => setOrdersSegment("ventas")}
                    >
                      Ventas
                    </button>
                    <button
                      type="button"
                      className={`flex-1 rounded-2xl py-3.5 text-base font-semibold ${
                        ordersSegment === "consultas"
                          ? "bg-[var(--color-accent-red)] text-white"
                          : "border border-[var(--color-border)] text-[var(--color-text-muted)]"
                      }`}
                      onClick={() => setOrdersSegment("consultas")}
                    >
                      Consultas web
                    </button>
                  </div>

                  {ordersSegment === "ventas" ? (
                    <>
                      <select
                        className="argon-input w-full rounded-2xl py-3.5 text-base"
                        value={orderStatusFilter}
                        onChange={(e) =>
                          setOrderStatusFilter(e.target.value as OrderStatus | "all")
                        }
                      >
                        <option value="all">Todos los estados</option>
                        {orderStatusOptions.map((s) => (
                          <option key={s} value={s}>
                            {orderStatusLabels[s]}
                          </option>
                        ))}
                      </select>
                      <div className="space-y-3">
                        {filteredOrdersMobile.length === 0 ? (
                          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4 text-center">
                            <p className="text-sm text-[var(--color-text-muted)]">Sin pedidos con este filtro</p>
                            <button
                              type="button"
                              className="mt-2 text-sm font-semibold text-[var(--color-accent-red)]"
                              onClick={() => setOrderStatusFilter("all")}
                            >
                              Limpiar filtro
                            </button>
                          </div>
                        ) : (
                          filteredOrdersMobile.map((order) => (
                          <SwipeableAdminCard
                            key={order.id}
                            actions={[
                              {
                                label: "Ver",
                                onPress: () => push({ screen: "order", id: order.id }),
                              },
                              {
                                label: "Dup",
                                onPress: () => void props.duplicateOrder(order),
                              },
                              {
                                label: "Borrar",
                                tone: "danger",
                                onPress: () => props.removeOrderMutation.mutate(order.id),
                              },
                            ]}
                          >
                            <button
                              type="button"
                              className="w-full rounded-2xl p-4.5 text-left"
                              onClick={() => push({ screen: "order", id: order.id })}
                            >
                              <p className="text-base font-semibold">{order.summary}</p>
                              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                                {orderChannelLabels[order.channel]} ·{" "}
                                {new Date(order.createdAt).toLocaleDateString("es-AR")}
                              </p>
                              <p className="mt-2 inline-block rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs">
                                {orderStatusLabels[order.status]}
                              </p>
                            </button>
                          </SwipeableAdminCard>
                          ))
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        className="argon-input w-full rounded-2xl py-3.5 text-base"
                        placeholder="Buscar consulta"
                        value={props.requestSearch}
                        onChange={(e) => props.setRequestSearch(e.target.value)}
                      />
                      <select
                        className="argon-input w-full rounded-2xl py-3.5 text-base"
                        value={props.requestStatusFilter}
                        onChange={(e) =>
                          props.setRequestStatusFilter(
                            e.target.value as (typeof requestStatusOptions)[number] | "all",
                          )
                        }
                      >
                        <option value="all">Todos</option>
                        {requestStatusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <div className="space-y-3">
                        {props.filteredRequests.length === 0 ? (
                          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4 text-center">
                            <p className="text-sm text-[var(--color-text-muted)]">No hay consultas para mostrar</p>
                          </div>
                        ) : (
                          props.filteredRequests.map((request) => (
                          <SwipeableAdminCard
                            key={request.id}
                            actions={requestStatusOptions.map((st) => ({
                              label:
                                st === "pendiente"
                                  ? "Pend."
                                  : st === "contactado"
                                    ? "Contact."
                                    : "Cerrado",
                              onPress: () => props.statusMutation.mutate({ id: request.id, status: st }),
                            }))}
                          >
                            <div className="rounded-2xl p-4.5">
                              <p className="text-base font-medium">
                                {request.fullName} · {request.instrument}
                              </p>
                              <p className="text-sm text-[var(--color-text-muted)]">{request.email}</p>
                              <p className="mt-2 text-sm">{request.message}</p>
                              {request.imageUrls?.length ? (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {request.imageUrls.map((url, index) => (
                                    <a
                                      key={`${request.id}-img-${index}`}
                                      href={url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="block overflow-hidden rounded-lg border border-[var(--color-border)]"
                                    >
                                      <img
                                        src={url}
                                        alt={`Adjunto ${index + 1} de ${request.fullName}`}
                                        className="h-14 w-14 object-cover"
                                      />
                                    </a>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </SwipeableAdminCard>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : null}

              {tab === "products" ? (
                <div className="space-y-4">
                  <input
                    className="argon-input w-full rounded-2xl py-3.5 text-base"
                    placeholder="Buscar"
                    value={props.productSearch}
                    onChange={(e) => props.setProductSearch(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      className="argon-input rounded-2xl py-3.5 text-base"
                      value={props.productFilterLine}
                      onChange={(e) =>
                        props.setProductFilterLine(e.target.value as ProductLine | "all")
                      }
                    >
                      <option value="all">Línea</option>
                      <option value="estandar">Estándar</option>
                      <option value="pro">Pro</option>
                      <option value="personalizada">Personalizada</option>
                    </select>
                    <select
                      className="argon-input rounded-2xl py-3.5 text-base"
                      value={props.productFilterCategory}
                      onChange={(e) =>
                        props.setProductFilterCategory(e.target.value as InstrumentCategory | "all")
                      }
                    >
                      <option value="all">Todas</option>
                      {categoryOptions.map((c) => (
                        <option key={c} value={c}>
                          {categoryLabels[c]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    {props.filteredProducts.length === 0 ? (
                      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4 text-center">
                        <p className="text-sm text-[var(--color-text-muted)]">No hay productos con ese filtro</p>
                      </div>
                    ) : (
                      props.filteredProducts.map((product) => (
                      <SwipeableAdminCard
                        key={product.id}
                        actions={[
                          {
                            label: "Editar",
                            onPress: () => {
                              props.setProductForm(product);
                              props.setSpecInput("");
                              props.setTagInput("");
                              push({ screen: "productWizard" });
                            },
                          },
                          {
                            label: "Dup",
                            onPress: () => void props.duplicateProduct(product),
                          },
                          {
                            label: "Borrar",
                            tone: "danger",
                            onPress: () => props.removeProductMutation.mutate(product.id),
                          },
                        ]}
                      >
                        <div className="p-4.5">
                          <p className="text-base font-semibold">{product.name}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {categoryLabels[product.category]} · {lineLabels[product.line]}
                          </p>
                        </div>
                      </SwipeableAdminCard>
                      ))
                    )}
                  </div>
                </div>
              ) : null}

              {tab === "customers" ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`flex-1 rounded-2xl py-3.5 text-base font-semibold ${
                        customersSegment === "crm"
                          ? "bg-[var(--color-accent-red)] text-white"
                          : "border border-[var(--color-border)] text-[var(--color-text-muted)]"
                      }`}
                      onClick={() => setCustomersSegment("crm")}
                    >
                      CRM
                    </button>
                    <button
                      type="button"
                      className={`flex-1 rounded-2xl py-3.5 text-base font-semibold ${
                        customersSegment === "testimonios"
                          ? "bg-[var(--color-accent-red)] text-white"
                          : "border border-[var(--color-border)] text-[var(--color-text-muted)]"
                      }`}
                      onClick={() => setCustomersSegment("testimonios")}
                    >
                      Testimonios
                    </button>
                  </div>

                  {customersSegment === "crm" ? (
                    <>
                      <input
                        className="argon-input w-full rounded-2xl py-3.5 text-base"
                        placeholder="Buscar cliente"
                        value={props.customerSearch}
                        onChange={(e) => props.setCustomerSearch(e.target.value)}
                      />
                      <div className="space-y-3">
                        {props.filteredCustomers.length === 0 ? (
                          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4 text-center">
                            <p className="text-sm text-[var(--color-text-muted)]">No hay clientes con ese filtro</p>
                          </div>
                        ) : (
                          props.filteredCustomers.map((c) => (
                          <SwipeableAdminCard
                            key={c.id}
                            actions={[
                              {
                                label: "Ver",
                                onPress: () => push({ screen: "customer", id: c.id }),
                              },
                              {
                                label: "Borrar",
                                tone: "danger",
                                onPress: () => props.removeCustomerMutation.mutate(c.id),
                              },
                            ]}
                          >
                            <button
                              type="button"
                              className="w-full rounded-2xl p-4.5 text-left"
                              onClick={() => push({ screen: "customer", id: c.id })}
                            >
                              <p className="text-base font-semibold">{c.name}</p>
                              <p className="text-xs text-[var(--color-text-muted)]">{c.phone ?? c.email}</p>
                              <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
                                {c.tags.join(" · ")}
                              </p>
                            </button>
                          </SwipeableAdminCard>
                          ))
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        className="argon-input w-full rounded-2xl py-3.5 text-base"
                        placeholder="Buscar testimonio"
                        value={props.testimonialSearch}
                        onChange={(e) => props.setTestimonialSearch(e.target.value)}
                      />
                      <motion.button
                        type="button"
                        whileTap={reduceMotion ? undefined : { scale: adminTapScale }}
                        className="w-full rounded-2xl border border-dashed border-[var(--color-border)] py-3.5 text-base text-[var(--color-text-muted)]"
                        onClick={() => {
                          props.setTestimonialForm({
                            id: "",
                            musicianName: "",
                            role: "",
                            quote: "",
                            featured: false,
                            videoUrl: "",
                            videoAutoplay: false,
                          });
                          push({ screen: "testimonial", id: null });
                        }}
                      >
                        + Nuevo testimonio
                      </motion.button>
                      <div className="space-y-3">
                        {props.filteredTestimonials.length === 0 ? (
                          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4 text-center">
                            <p className="text-sm text-[var(--color-text-muted)]">No hay testimonios para mostrar</p>
                          </div>
                        ) : (
                          props.filteredTestimonials.map((t) => (
                          <SwipeableAdminCard
                            key={t.id}
                            actions={[
                              {
                                label: "Editar",
                                onPress: () => {
                                  props.setTestimonialForm(t);
                                  push({ screen: "testimonial", id: t.id });
                                },
                              },
                              {
                                label: "Borrar",
                                tone: "danger",
                                onPress: () => props.removeTestimonialMutation.mutate(t.id),
                              },
                            ]}
                          >
                            <button
                              type="button"
                              className="w-full rounded-2xl p-4.5 text-left"
                              onClick={() => {
                                props.setTestimonialForm(t);
                                push({ screen: "testimonial", id: t.id });
                              }}
                            >
                              <p className="text-base font-medium">{t.musicianName}</p>
                              <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-muted)]">
                                {t.quote}
                              </p>
                            </button>
                          </SwipeableAdminCard>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : null}

              {tab === "profile" ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-5 shadow-lg shadow-black/10">
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                      Perfil de sesión
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
                      {user?.displayName ?? "Equipo Argon"}
                    </h2>
                    <p className="mt-1 break-all text-sm text-[var(--color-text-muted)]">{user?.email}</p>
                    <div className="mt-5 space-y-3">
                      <button
                        type="button"
                        className="w-full rounded-2xl bg-[var(--color-accent-red)] px-4 py-3.5 text-base font-semibold text-white"
                        onClick={() => logOut()}
                      >
                        Cerrar sesión
                      </button>
                      <Link
                        href="/"
                        className="block w-full rounded-2xl border border-[var(--color-border)] px-4 py-3.5 text-center text-base font-semibold text-[var(--color-text-muted)]"
                      >
                        Ver sitio público
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          ) : null}

          {stack.screen === "order" && selectedOrder ? (
            <motion.div key="order-detail" {...fade} className="pb-8">
              <button
                type="button"
                className="mb-4 text-base font-medium text-[var(--color-accent-red)]"
                onClick={() => pop()}
              >
                Volver
              </button>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4 shadow-lg shadow-black/10">
                <h2 className="text-lg font-semibold">{selectedOrder.summary}</h2>
                <p className="text-xs text-[var(--color-text-muted)]">{selectedOrder.id}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {orderStatusOptions.map((st) => (
                    <motion.button
                      key={st}
                      type="button"
                      whileTap={reduceMotion ? undefined : { scale: adminTapScale }}
                      className={`rounded-full border px-3 py-2 text-xs font-medium ${
                        selectedOrder.status === st
                          ? "border-[var(--color-accent-red)] text-[var(--color-accent-red)]"
                          : "border-[var(--color-border)]"
                      }`}
                      onClick={() =>
                        props.orderStatusMutation.mutate({ id: selectedOrder.id, status: st })
                      }
                    >
                      {orderStatusLabels[st]}
                    </motion.button>
                  ))}
                </div>
                {selectedOrder.customerId ? (
                  <div className="mt-4 rounded-xl border border-[var(--color-border)] p-3">
                    <p className="text-xs uppercase text-[var(--color-text-muted)]">Cliente</p>
                    {(() => {
                      const c = props.getCustomer(selectedOrder.customerId!);
                      return c ? (
                        <div className="mt-2 text-sm">
                          <p className="font-medium">{c.name}</p>
                          <p>{c.email}</p>
                          <p>{c.phone}</p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                ) : null}
                <div className="mt-4">
                  <p className="text-xs uppercase text-[var(--color-text-muted)]">Línea de tiempo</p>
                  <ul className="mt-2 space-y-2 border-l border-[var(--color-border)] pl-3">
                    {[...selectedOrder.timeline]
                      .slice()
                      .reverse()
                      .map((ev, i) => (
                        <li key={`${ev.at}-${i}`} className="text-sm">
                          <span className="font-medium">{orderStatusLabels[ev.status]}</span>
                          {ev.label ? <span className="text-[var(--color-text-muted)]"> · {ev.label}</span> : null}
                          <span className="block text-xs text-[var(--color-text-muted)]">
                            {new Date(ev.at).toLocaleString("es-AR")}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : null}

          {stack.screen === "customer" && selectedCustomer ? (
            <motion.div key="customer-detail" {...fade} className="pb-8">
              <button
                type="button"
                className="mb-4 text-base font-medium text-[var(--color-accent-red)]"
                onClick={() => pop()}
              >
                Volver
              </button>
              <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4 shadow-lg shadow-black/10">
                <h2 className="text-lg font-semibold">{selectedCustomer.name}</h2>
                {selectedCustomerWhatsAppUrl ? (
                  <div className="pt-1">
                    <CrmWhatsAppLink href={selectedCustomerWhatsAppUrl} />
                  </div>
                ) : selectedCustomer.phone ? (
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Teléfono sin formato válido para WhatsApp
                  </p>
                ) : (
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Agregá un teléfono al cliente para abrir WhatsApp
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {selectedCustomer.tags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs"
                      onClick={() =>
                        void props.upsertCustomerMutation.mutateAsync({
                          ...selectedCustomer,
                          tags: selectedCustomer.tags.filter((x) => x !== t),
                        })
                      }
                    >
                      {t} ×
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    className="argon-input flex-1 rounded-xl"
                    value={props.customerTagInput}
                    onChange={(e) => props.setCustomerTagInput(e.target.value)}
                    placeholder="Etiqueta"
                  />
                  <button
                    type="button"
                    className="argon-button-secondary shrink-0 rounded-xl px-4"
                    onClick={() => {
                      const t = props.customerTagInput.trim();
                      if (!t || selectedCustomer.tags.includes(t)) return;
                      void props.upsertCustomerMutation.mutateAsync({
                        ...selectedCustomer,
                        tags: [...selectedCustomer.tags, t],
                      });
                      props.setCustomerTagInput("");
                    }}
                  >
                    +
                  </button>
                </div>
                <div>
                  <p className="text-xs uppercase text-[var(--color-text-muted)]">Notas</p>
                  <ul className="mt-2 space-y-2">
                    {selectedCustomer.notes.map((n) => (
                      <li key={n.id} className="rounded-lg border border-[var(--color-border)] p-2 text-sm">
                        {n.text}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex gap-2">
                    <input
                      className="argon-input flex-1"
                      value={props.customerNoteInput}
                      onChange={(e) => props.setCustomerNoteInput(e.target.value)}
                      placeholder="Nueva nota"
                    />
                    <button
                      type="button"
                      className="argon-button-secondary shrink-0"
                      onClick={() => {
                        const text = props.customerNoteInput.trim();
                        if (!text) return;
                        void props.addCustomerNoteMutation.mutateAsync({
                          customerId: selectedCustomer.id,
                          text,
                        });
                        props.setCustomerNoteInput("");
                      }}
                    >
                      OK
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase text-[var(--color-text-muted)]">Compras</p>
                  <ul className="mt-2 text-sm">
                    {props.customerOrders(selectedCustomer.id).map((o) => (
                      <li key={o.id} className="flex justify-between gap-2 border-t border-[var(--color-border)] py-2">
                        <span>{o.summary}</span>
                        <span className="text-[var(--color-text-muted)]">{orderStatusLabels[o.status]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : null}

          {stack.screen === "productWizard" ? (
            <motion.div key="product-wizard" {...fade} className="pb-8">
              <MobileProductWizard
                key={props.productForm.id || "new-product"}
                productForm={props.productForm}
                setProductForm={props.setProductForm}
                specInput={props.specInput}
                setSpecInput={props.setSpecInput}
                tagInput={props.tagInput}
                setTagInput={props.setTagInput}
                appendProductItem={props.appendProductItem}
                removeProductItem={props.removeProductItem}
                onClose={() => {
                  props.resetProductForm();
                  pop();
                }}
                saveProductMutation={props.saveProductMutation}
                onSaved={() => {
                  props.resetProductForm();
                  pop();
                }}
              />
            </motion.div>
          ) : null}

          {stack.screen === "quickOrder" ? (
            <motion.div key="quick-order" {...fade} className="pb-8">
              <button
                type="button"
                className="mb-4 text-base font-medium text-[var(--color-accent-red)]"
                onClick={() => pop()}
              >
                Volver
              </button>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4">
                <h2 className="text-lg font-semibold">Pedido rápido</h2>
                <form
                  className="mt-4 space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void props.quickOrderMutation
                      .mutateAsync({
                        channel: qChannel,
                        summary: qSummary,
                        customerName: qName || undefined,
                        phone: qPhone || undefined,
                        email: qEmail || undefined,
                      })
                      .then(() => {
                        setQSummary("");
                        setQName("");
                        setQPhone("");
                        setQEmail("");
                        pop();
                      });
                  }}
                >
                  <label className="argon-label">
                    Canal
                    <select
                      className="argon-input"
                      value={qChannel}
                      onChange={(e) => setQChannel(e.target.value as OrderChannel)}
                    >
                      {(Object.keys(orderChannelLabels) as OrderChannel[]).map((ch) => (
                        <option key={ch} value={ch}>
                          {orderChannelLabels[ch]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="argon-label">
                    Resumen
                    <textarea
                      className="argon-input min-h-24"
                      required
                      value={qSummary}
                      onChange={(e) => setQSummary(e.target.value)}
                    />
                  </label>
                  <input
                    className="argon-input"
                    placeholder="Nombre (opcional)"
                    value={qName}
                    onChange={(e) => setQName(e.target.value)}
                  />
                  <input
                    className="argon-input"
                    placeholder="Teléfono (opcional)"
                    value={qPhone}
                    onChange={(e) => setQPhone(e.target.value)}
                  />
                  <input
                    className="argon-input"
                    placeholder="Email (opcional)"
                    value={qEmail}
                    onChange={(e) => setQEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="argon-button-primary mt-2 w-full py-4"
                    disabled={props.quickOrderMutation.isPending}
                  >
                    {props.quickOrderMutation.isPending ? "Guardando..." : "Crear pedido"}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : null}

          {stack.screen === "testimonial" ? (
            <motion.div key="testimonial-edit" {...fade} className="pb-8">
              <button
                type="button"
                className="mb-4 text-base font-medium text-[var(--color-accent-red)]"
                onClick={() => pop()}
              >
                Volver
              </button>
              <form
                className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void props.saveTestimonialMutation
                    .mutateAsync({
                      ...props.testimonialForm,
                      id: props.testimonialForm.id || `test-${Date.now()}`,
                    })
                    .then(() => {
                      props.setTestimonialForm({
                        id: "",
                        musicianName: "",
                        role: "",
                        quote: "",
                        featured: false,
                        videoUrl: "",
                        videoAutoplay: false,
                      });
                      pop();
                    });
                }}
              >
                <label className="argon-label">
                  Nombre
                  <input
                    className="argon-input"
                    value={props.testimonialForm.musicianName}
                    onChange={(e) =>
                      props.setTestimonialForm((p) => ({ ...p, musicianName: e.target.value }))
                    }
                    required
                  />
                </label>
                <label className="argon-label">
                  Rol
                  <input
                    className="argon-input"
                    value={props.testimonialForm.role}
                    onChange={(e) => props.setTestimonialForm((p) => ({ ...p, role: e.target.value }))}
                    required
                  />
                </label>
                <label className="argon-label">
                  Cita
                  <textarea
                    className="argon-input min-h-28"
                    value={props.testimonialForm.quote}
                    onChange={(e) => props.setTestimonialForm((p) => ({ ...p, quote: e.target.value }))}
                    required
                  />
                </label>
                <label className="argon-label">
                  Video URL
                  <input
                    className="argon-input"
                    value={props.testimonialForm.videoUrl ?? ""}
                    onChange={(e) =>
                      props.setTestimonialForm((p) => ({ ...p, videoUrl: e.target.value }))
                    }
                  />
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={props.testimonialForm.featured}
                    onChange={(e) =>
                      props.setTestimonialForm((p) => ({ ...p, featured: e.target.checked }))
                    }
                  />
                  Destacado
                </label>
                <button type="submit" className="argon-button-primary w-full py-4">
                  {props.saveTestimonialMutation.isPending ? "Guardando..." : "Guardar"}
                </button>
              </form>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {showFab ? (
        <motion.button
          type="button"
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+6.75rem)] right-4 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-red)] text-[2rem] font-light text-white shadow-[0_10px_22px_rgba(0,0,0,0.28)]"
          whileTap={reduceMotion ? undefined : { scale: 0.92 }}
          aria-label={tab === "products" ? "Nuevo producto" : "Pedido rápido"}
          onClick={() => {
            if (tab === "products") {
              props.setProductForm(emptyProductForm);
              props.setSpecInput("");
              props.setTagInput("");
              push({ screen: "productWizard" });
            } else {
              push({ screen: "quickOrder" });
            }
          }}
        >
          +
        </motion.button>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[color-mix(in_srgb,var(--color-border)_70%,transparent)] bg-[var(--color-surface)] px-3 pb-[calc(env(safe-area-inset-bottom)+0.65rem)] pt-2.5">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-1.5">
          {(
            [
              { id: "dashboard" as const, label: "Inicio" },
              { id: "orders" as const, label: "Pedidos", badge: pendingSales || unreadConsultas },
              { id: "products" as const, label: "Productos" },
              { id: "customers" as const, label: "Clientes" },
              { id: "profile" as const, label: "Perfil" },
            ] as const
          ).map((item) => (
            <motion.button
              key={item.id}
              type="button"
              aria-label={item.label}
              whileTap={reduceMotion ? undefined : { scale: adminTapScale }}
              className={`relative min-h-[52px] rounded-xl px-1 py-2.5 text-center text-xs font-semibold ${
                tab === item.id
                  ? "bg-[var(--color-surface)] text-[var(--color-accent-red)]"
                  : "text-[var(--color-text-muted)]"
              }`}
              onClick={() => setTab(item.id)}
            >
              <span className="inline-flex items-center justify-center">
                <MobileNavIcon name={item.id} active={tab === item.id} />
              </span>
              {"badge" in item && item.badge ? (
                <span className="pointer-events-none absolute right-1.5 top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-accent-red)] px-1.5 text-[10px] font-bold text-white">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              ) : null}
            </motion.button>
          ))}
        </div>
      </nav>
    </main>
  );
}
