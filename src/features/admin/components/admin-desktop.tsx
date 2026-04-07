"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type RefObject } from "react";
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
import { useAuth } from "@/lib/auth/auth-context";
import { CrmWhatsAppLink } from "@/features/admin/components/crm-whatsapp-link";
import { buildWhatsAppChatUrl } from "@/lib/whatsapp";
import {
  categoryLabels,
  categoryOptions,
  emptyTestimonial,
  isDirectVideoUrl,
  lineLabels,
  lineOptions,
  orderChannelLabels,
  orderStatusLabels,
  orderStatusOptions,
  quickSpecTemplates,
  quickTagTemplates,
  requestStatusOptions,
  requestStatusTone,
  type AdminSection,
} from "@/features/admin/admin-constants";

export type PedidosSubTab = "ventas" | "consultas";
export type ClientesSubTab = "crm" | "testimonios";

type NavItem = { id: AdminSection; label: string; helper: string; icon: string };

export interface AdminDesktopProps {
  activeSection: AdminSection;
  setActiveSection: (s: AdminSection) => void;
  navItems: NavItem[];
  pedidosSubTab: PedidosSubTab;
  setPedidosSubTab: (t: PedidosSubTab) => void;
  clientesSubTab: ClientesSubTab;
  setClientesSubTab: (t: ClientesSubTab) => void;
  filteredRequests: CustomizationRequest[];
  orders: Order[];
  filteredOrders: Order[];
  customers: Customer[];
  filteredCustomers: Customer[];
  customerOrders: (customerId: string) => Order[];
  products: Product[];
  filteredProducts: Product[];
  testimonials: Testimonial[];
  filteredTestimonials: Testimonial[];
  pendingRequests: number;
  contactadosRequests: number;
  closedRequests: number;
  pendingOrdersCount: number;
  featuredProducts: number;
  featuredTestimonials: number;
  productForm: Product;
  setProductForm: React.Dispatch<React.SetStateAction<Product>>;
  productEditorOpen: boolean;
  productEditorRef: RefObject<HTMLElement | null>;
  productSearch: string;
  setProductSearch: (v: string) => void;
  productFilterLine: ProductLine | "all";
  setProductFilterLine: (v: ProductLine | "all") => void;
  productFilterCategory: InstrumentCategory | "all";
  setProductFilterCategory: (v: InstrumentCategory | "all") => void;
  testimonialForm: Testimonial;
  setTestimonialForm: React.Dispatch<React.SetStateAction<Testimonial>>;
  testimonialSearch: string;
  setTestimonialSearch: (v: string) => void;
  customerSearch: string;
  setCustomerSearch: (v: string) => void;
  specInput: string;
  setSpecInput: (v: string) => void;
  tagInput: string;
  setTagInput: (v: string) => void;
  requestSearch: string;
  setRequestSearch: (v: string) => void;
  requestStatusFilter: (typeof requestStatusOptions)[number] | "all";
  setRequestStatusFilter: (v: (typeof requestStatusOptions)[number] | "all") => void;
  orderSearch: string;
  setOrderSearch: (v: string) => void;
  orderStatusFilter: OrderStatus | "all";
  setOrderStatusFilter: (v: OrderStatus | "all") => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  customerTagInput: string;
  setCustomerTagInput: (v: string) => void;
  customerNoteInput: string;
  setCustomerNoteInput: (v: string) => void;
  appendProductItem: (field: "specs" | "tags" | "variants" | "gallery", rawValue: string) => void;
  removeProductItem: (field: "specs" | "tags" | "variants" | "gallery", value: string) => void;
  resetProductForm: () => void;
  openProductEditor: (product?: Product) => void;
  duplicateProduct: (product: Product) => void;
  removeProductMutation: { mutate: (id: string) => void };
  saveProductMutation: { mutateAsync: (p: Product) => Promise<unknown>; isPending: boolean };
  saveTestimonialMutation: { mutateAsync: (t: Testimonial) => Promise<unknown>; isPending: boolean };
  removeTestimonialMutation: { mutate: (id: string) => void };
  statusMutation: {
    mutate: (p: { id: string; status: "pendiente" | "contactado" | "cerrado" }) => void;
  };
  orderStatusMutation: { mutate: (p: { id: string; status: OrderStatus }) => void };
  removeOrderMutation: { mutate: (id: string) => void };
  upsertCustomerMutation: { mutateAsync: (c: Customer) => Promise<unknown> };
  addCustomerNoteMutation: { mutateAsync: (p: { customerId: string; text: string }) => Promise<unknown> };
  removeCustomerMutation: { mutate: (id: string) => void };
  getCustomer: (id: string) => Customer | undefined;
  onCreateQuickOrder: (payload: {
    channel: OrderChannel;
    summary: string;
    customerName?: string;
    phone?: string;
    email?: string;
  }) => Promise<void>;
  quickOrderPending: boolean;
}

export function AdminDesktop(props: AdminDesktopProps) {
  const { user, logOut } = useAuth();
  const { activeSection, productEditorRef } = props;
  const [quickOrderOpen, setQuickOrderOpen] = useState(false);
  const [quickChannel, setQuickChannel] = useState<OrderChannel>("whatsapp");
  const [quickSummary, setQuickSummary] = useState("");
  const [quickName, setQuickName] = useState("");
  const [quickPhone, setQuickPhone] = useState("");
  const [quickEmail, setQuickEmail] = useState("");

  const selectedOrder = props.selectedOrderId
    ? props.orders.find((o) => o.id === props.selectedOrderId)
    : undefined;
  const selectedCustomer = props.selectedCustomerId
    ? props.customers.find((c) => c.id === props.selectedCustomerId)
    : undefined;
  const selectedCustomerWhatsAppUrl = selectedCustomer
    ? buildWhatsAppChatUrl(selectedCustomer.phone)
    : null;

  return (
    <main className="mx-auto flex w-full max-w-[1400px] flex-1 overflow-x-clip px-3 pt-3 md:h-[100dvh] md:overflow-hidden md:p-8 md:pb-8 2xl:max-w-[1680px] 2xl:p-10 min-[1920px]:max-w-[1880px] min-[1920px]:p-12 min-[2560px]:max-w-[2400px] min-[2560px]:p-14">
      <div className="w-full min-w-0 overflow-x-clip rounded-[1.6rem] border border-[color-mix(in_srgb,var(--color-border)_82%,transparent)] bg-[var(--color-surface)] p-3 md:h-[calc(100dvh-4rem)] md:rounded-[2rem] md:border-none md:p-5 2xl:rounded-[2.2rem] 2xl:p-6 min-[2560px]:rounded-[2.4rem] min-[2560px]:p-8">
        <div className="grid w-full min-w-0 gap-5 md:h-full md:min-h-0 md:grid-cols-[228px_1fr] 2xl:grid-cols-[280px_1fr] 2xl:gap-6 min-[1920px]:grid-cols-[320px_1fr] min-[2560px]:grid-cols-[380px_1fr] min-[2560px]:gap-8">
          <aside className="argon-card relative hidden overflow-hidden rounded-[1.5rem] border-[color-mix(in_srgb,var(--color-border)_80%,#000)] bg-[var(--color-surface-secondary)] p-5 md:sticky md:top-0 md:flex md:h-full md:max-h-full md:self-start md:flex-col 2xl:p-6 min-[2560px]:p-7">
            <div className="relative z-10 flex h-full flex-col overflow-hidden">
              <div className="border-b border-[var(--color-border)] pb-4 text-center">
                <Image
                  src="/images/logo.png"
                  alt="Fundas Argon"
                  width={340}
                  height={112}
                  className="mx-auto h-20 w-auto object-contain md:h-24 2xl:h-28 min-[2560px]:h-32"
                  priority
                />
                <p className="mt-3 text-xs text-[var(--color-text-muted)]">Panel de administración</p>
              </div>
              <nav className="mt-5 space-y-2.5 text-sm">
                {props.navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => props.setActiveSection(item.id)}
                    className={`group flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-[border-color,background-color,color] duration-[var(--argon-duration)] [transition-timing-function:var(--argon-ease)] ${
                      activeSection === item.id
                        ? "border-[var(--color-accent-red)] bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:border-[var(--color-accent-red)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full transition-colors ${
                        activeSection === item.id
                          ? "bg-[var(--color-accent-red)]"
                          : "bg-[var(--color-text-muted)]/50 group-hover:bg-[var(--color-accent-red-soft)]"
                      }`}
                    />
                    <span className="flex-1">
                      <span className="block text-[1.04rem] font-medium leading-tight">{item.label}</span>
                      <span className="mt-0.5 block text-[11px] text-[var(--color-text-muted)]">{item.helper}</span>
                    </span>
                  </button>
                ))}
              </nav>
              <div className="mt-auto space-y-2.5 pt-3">
                <Link
                  href="/"
                  className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)] transition-[background-color,border-color,color] duration-[var(--argon-duration)] [transition-timing-function:var(--argon-ease)] hover:border-[var(--color-accent-red)] hover:bg-[var(--color-accent-red)] hover:text-white"
                >
                  Ver web publica
                </Link>
                <button
                  type="button"
                  className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)] transition-[background-color,border-color,color] duration-[var(--argon-duration)] [transition-timing-function:var(--argon-ease)] hover:border-[var(--color-accent-red)] hover:bg-[var(--color-accent-red)] hover:text-white"
                  onClick={() => logOut()}
                >
                  Cerrar sesion
                </button>
              </div>
            </div>
          </aside>

          <section className="min-w-0 space-y-4 overflow-x-clip pb-2 md:h-full md:max-h-full md:min-h-0 md:overflow-y-auto md:space-y-5 md:pr-1 md:pb-0">
            <header className="argon-admin-hero overflow-hidden rounded-[1.4rem] border p-6 md:block md:p-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between 2xl:gap-6">
                <div>
                  <p className="argon-eyebrow">Panel Fundas Argon</p>
                  <h1 className="text-2xl font-semibold tracking-tight text-[var(--admin-hero-text)] md:text-3xl 2xl:text-4xl min-[2560px]:text-5xl">
                    Hola, {user?.displayName || "Equipo Argon"}!
                  </h1>
                  <p className="mt-1 text-sm text-[var(--admin-hero-muted)]">{user?.email}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <button
                  type="button"
                  className="rounded-2xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface-secondary)_92%,transparent)] p-4 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--color-surface-secondary)_100%,transparent)]"
                  onClick={() => {
                    props.setActiveSection("productos");
                  }}
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Productos activos
                  </p>
                  <p className="mt-1 text-2xl font-semibold">{props.products.length}</p>
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface-secondary)_92%,transparent)] p-4 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--color-surface-secondary)_100%,transparent)]"
                  onClick={() => {
                    props.setPedidosSubTab("ventas");
                    props.setOrderStatusFilter("pending");
                    props.setActiveSection("solicitudes");
                  }}
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Pedidos de venta pendientes
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[var(--color-accent-red)]">
                    {props.pendingOrdersCount}
                  </p>
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface-secondary)_92%,transparent)] p-4 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--color-surface-secondary)_100%,transparent)]"
                  onClick={() => {
                    props.setClientesSubTab("testimonios");
                    props.setActiveSection("comentarios");
                  }}
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Comentarios destacados
                  </p>
                  <p className="mt-1 text-2xl font-semibold">{props.featuredTestimonials}</p>
                </button>
              </div>
            </header>

            <div key={activeSection} className="argon-section-enter">
              {activeSection === "resumen" ? (
                <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <article className="argon-card rounded-[1.2rem] p-4 md:p-6">
                    <h3 className="mb-4 text-lg font-semibold">Tareas prioritarias</h3>
                    <div className="space-y-3">
                      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4">
                        <p className="text-sm font-medium">Consultas web sin responder</p>
                        <p className="mt-1 text-3xl font-semibold text-amber-300">{props.pendingRequests}</p>
                        <button
                          type="button"
                          className="mt-2 text-sm text-[var(--color-accent-red)] underline underline-offset-4"
                          onClick={() => {
                            props.setPedidosSubTab("consultas");
                            props.setActiveSection("solicitudes");
                          }}
                        >
                          Ir a consultas web
                        </button>
                      </div>
                      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4">
                        <p className="text-sm font-medium">Productos destacados activos</p>
                        <p className="mt-1 text-3xl font-semibold">{props.featuredProducts}</p>
                        <button
                          type="button"
                          className="mt-2 text-sm text-[var(--color-accent-red)] underline underline-offset-4"
                          onClick={() => props.setActiveSection("productos")}
                        >
                          Gestionar productos
                        </button>
                      </div>
                    </div>
                  </article>
                  <article className="argon-card rounded-[1.2rem] p-4 md:p-6">
                    <h3 className="mb-4 text-lg font-semibold">Estado de consultas web</h3>
                    <div className="grid gap-3">
                      {requestStatusOptions.map((status) => (
                        <button
                          key={status}
                          type="button"
                          className={`rounded-xl border p-4 text-left ${requestStatusTone[status]}`}
                          onClick={() => {
                            props.setPedidosSubTab("consultas");
                            props.setRequestStatusFilter(status);
                            props.setActiveSection("solicitudes");
                          }}
                        >
                          <p className="text-xs uppercase tracking-[0.12em]">{status}</p>
                          <p className="mt-1 text-2xl font-semibold">
                            {status === "pendiente"
                              ? props.pendingRequests
                              : status === "contactado"
                                ? props.contactadosRequests
                                : props.closedRequests}
                          </p>
                        </button>
                      ))}
                    </div>
                  </article>
                </section>
              ) : null}

              {activeSection === "solicitudes" ? (
                <section className="argon-card rounded-[1.2rem] p-4 md:p-6">
                  <div className="mb-4 flex flex-wrap gap-2 border-b border-[var(--color-border)] pb-4">
                    <button
                      type="button"
                      className={`rounded-full border px-4 py-2 text-sm font-medium ${
                        props.pedidosSubTab === "ventas"
                          ? "border-[var(--color-accent-red)] bg-[var(--color-accent-red)] text-white"
                          : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                      }`}
                      onClick={() => props.setPedidosSubTab("ventas")}
                     >
                      Ventas
                    </button>
                    <button
                      type="button"
                      className={`rounded-full border px-4 py-2 text-sm font-medium ${
                        props.pedidosSubTab === "consultas"
                          ? "border-[var(--color-accent-red)] bg-[var(--color-accent-red)] text-white"
                          : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                      }`}
                      onClick={() => props.setPedidosSubTab("consultas")}
                    >
                      Consultas web
                    </button>
                  </div>

                  {props.pedidosSubTab === "ventas" ? (
                    <>
                      <div className="mb-4 flex flex-col gap-3 border-b border-[var(--color-border)] pb-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">Pedidos de venta</h3>
                          <p className="text-sm text-[var(--color-text-muted)]">
                            Seguimiento de producción y envíos
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="argon-button-primary"
                            onClick={() => setQuickOrderOpen(true)}
                          >
                            Pedido rápido
                          </button>
                        </div>
                      </div>
                      <div className="mb-3 flex flex-wrap gap-2">
                        <input
                          className="argon-input min-w-[200px] flex-1"
                          placeholder="Buscar pedido"
                          value={props.orderSearch}
                          onChange={(e) => props.setOrderSearch(e.target.value)}
                        />
                        <select
                          className="argon-input w-full md:w-auto"
                          value={props.orderStatusFilter}
                          onChange={(e) =>
                            props.setOrderStatusFilter(e.target.value as OrderStatus | "all")
                          }
                        >
                          <option value="all">Todos los estados</option>
                          {orderStatusOptions.map((s) => (
                            <option key={s} value={s}>
                              {orderStatusLabels[s]}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="overflow-auto rounded-xl border border-[var(--color-border)]">
                        <table className="w-full min-w-[760px] text-left text-sm">
                          <thead className="bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)]">
                            <tr>
                              <th className="px-3 py-2">Resumen</th>
                              <th className="px-3 py-2">Cliente</th>
                              <th className="px-3 py-2">Canal</th>
                              <th className="px-3 py-2">Estado</th>
                              <th className="px-3 py-2">Fecha</th>
                              <th className="px-3 py-2 text-right">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {props.filteredOrders.map((order) => {
                              const cust = order.customerId
                                ? props.getCustomer(order.customerId)
                                : undefined;
                              return (
                                <tr
                                  key={order.id}
                                  className={`cursor-pointer border-t border-[var(--color-border)] ${
                                    props.selectedOrderId === order.id ? "bg-[var(--color-accent-red)]/10" : ""
                                  }`}
                                  onClick={() =>
                                    props.setSelectedOrderId(
                                      props.selectedOrderId === order.id ? null : order.id,
                                    )
                                  }
                                >
                                  <td className="px-3 py-2">
                                    <p className="font-medium">{order.summary}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">{order.id}</p>
                                  </td>
                                  <td className="px-3 py-2">
                                    {cust ? (
                                      <button
                                        type="button"
                                        className="text-left text-[var(--color-accent-red)] underline underline-offset-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          props.setClientesSubTab("crm");
                                          props.setSelectedCustomerId(cust.id);
                                          props.setActiveSection("comentarios");
                                        }}
                                      >
                                        {cust.name}
                                      </button>
                                    ) : (
                                      <span className="text-[var(--color-text-muted)]">—</span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2">
                                    {orderChannelLabels[order.channel]}
                                  </td>
                                  <td className="px-3 py-2">
                                    <div className="flex flex-wrap gap-1">
                                      {orderStatusOptions.map((st) => (
                                        <button
                                          key={st}
                                          type="button"
                                          className={`rounded-full border px-2 py-0.5 text-[11px] ${
                                            order.status === st
                                              ? "border-[var(--color-accent-red)] text-[var(--color-accent-red)]"
                                              : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                                          }`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            props.orderStatusMutation.mutate({ id: order.id, status: st });
                                          }}
                                        >
                                          {orderStatusLabels[st]}
                                        </button>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-xs text-[var(--color-text-muted)]">
                                    {new Date(order.createdAt).toLocaleDateString("es-AR")}
                                  </td>
                                  <td className="px-3 py-2">
                                    <div className="flex justify-end gap-2">
                                      <button
                                        type="button"
                                        className="text-xs text-rose-300 underline underline-offset-4"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          props.removeOrderMutation.mutate(order.id);
                                          props.setSelectedOrderId(null);
                                        }}
                                      >
                                        Eliminar
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      {selectedOrder ? (
                        <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4">
                          <h4 className="font-semibold">Detalle del pedido</h4>
                          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{selectedOrder.summary}</p>
                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div>
                              <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                                Cliente
                              </p>
                              {selectedOrder.customerId ? (
                                <>
                                  {(() => {
                                    const c = props.getCustomer(selectedOrder.customerId!);
                                    return c ? (
                                      <div className="mt-2 text-sm">
                                        <p className="font-medium">{c.name}</p>
                                        <p className="text-[var(--color-text-muted)]">{c.email}</p>
                                        <p className="text-[var(--color-text-muted)]">{c.phone}</p>
                                      </div>
                                    ) : null;
                                  })()}
                                </>
                              ) : (
                                <p className="mt-2 text-sm text-[var(--color-text-muted)]">Sin cliente vinculado</p>
                              )}
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                                Líneas
                              </p>
                              <ul className="mt-2 list-inside list-disc text-sm">
                                {selectedOrder.lines.map((line, i) => (
                                  <li key={i}>
                                    {line.label} × {line.quantity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                              Línea de tiempo
                            </p>
                            <ul className="mt-2 space-y-2 border-l border-[var(--color-border)] pl-4">
                              {[...selectedOrder.timeline]
                                .slice()
                                .reverse()
                                .map((ev, idx) => (
                                  <li key={`${ev.at}-${idx}`} className="text-sm">
                                    <span className="font-medium">{orderStatusLabels[ev.status]}</span>
                                    {ev.label ? (
                                      <span className="text-[var(--color-text-muted)]"> — {ev.label}</span>
                                    ) : null}
                                    <span className="block text-xs text-[var(--color-text-muted)]">
                                      {new Date(ev.at).toLocaleString("es-AR")}
                                    </span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <div className="mb-4 flex flex-col gap-3 border-b border-[var(--color-border)] pb-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">Bandeja de consultas web</h3>
                          <p className="text-sm text-[var(--color-text-muted)]">
                            Gestiona consultas y estado de seguimiento
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <input
                            className="argon-input w-full"
                            placeholder="Buscar por nombre, email o instrumento"
                            value={props.requestSearch}
                            onChange={(event) => props.setRequestSearch(event.target.value)}
                          />
                          <select
                            className="argon-input"
                            value={props.requestStatusFilter}
                            onChange={(event) =>
                              props.setRequestStatusFilter(
                                event.target.value as (typeof requestStatusOptions)[number] | "all",
                              )
                            }
                          >
                            <option value="all">Todos los estados</option>
                            {requestStatusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {props.filteredRequests.length === 0 ? (
                          <p className="text-sm text-[var(--color-text-muted)]">
                            No hay solicitudes con esos filtros.
                          </p>
                        ) : (
                          props.filteredRequests.map((request) => (
                            <div
                              key={request.id}
                              className="grid gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4 md:grid-cols-[1fr_auto]"
                            >
                              <div>
                                <p className="font-medium">
                                  {request.fullName} · {request.instrument}
                                </p>
                                <p className="text-sm text-[var(--color-text-muted)]">{request.email}</p>
                                <p className="mt-1 break-words text-sm">{request.message}</p>
                                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                                  Creada: {new Date(request.createdAt).toLocaleString("es-AR")}
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                {requestStatusOptions.map((status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
                                      request.status === status
                                        ? "border-[var(--color-accent-red)] text-[var(--color-accent-red)]"
                                        : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                                    }`}
                                    onClick={() => props.statusMutation.mutate({ id: request.id, status })}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </section>
              ) : null}

              {activeSection === "productos" ? (
                <section className="grid gap-5 2xl:grid-cols-[1fr_420px]">
                  <article className="argon-card rounded-[1.2rem] p-4 md:p-6">
                    <div className="mb-4 flex flex-col gap-3 border-b border-[var(--color-border)] pb-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Productos</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          Busca, filtra y edita en segundos.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="argon-button-primary"
                          onClick={() => props.openProductEditor()}
                        >
                          Nuevo producto
                        </button>
                      </div>
                    </div>
                    <div className="mb-3 grid gap-2 md:grid-cols-[1fr_180px_180px]">
                      <input
                        className="argon-input"
                        placeholder="Buscar producto"
                        value={props.productSearch}
                        onChange={(event) => props.setProductSearch(event.target.value)}
                      />
                      <select
                        className="argon-input"
                        value={props.productFilterLine}
                        onChange={(event) =>
                          props.setProductFilterLine(event.target.value as ProductLine | "all")
                        }
                      >
                        <option value="all">Todas las líneas</option>
                        {lineOptions.map((line) => (
                          <option key={line} value={line}>
                            {lineLabels[line]}
                          </option>
                        ))}
                      </select>
                      <select
                        className="argon-input"
                        value={props.productFilterCategory}
                        onChange={(event) =>
                          props.setProductFilterCategory(event.target.value as InstrumentCategory | "all")
                        }
                      >
                        <option value="all">Todas las categorías</option>
                        {categoryOptions.map((category) => (
                          <option key={category} value={category}>
                            {categoryLabels[category]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="overflow-auto rounded-xl border border-[var(--color-border)]">
                      <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)]">
                          <tr>
                            <th className="px-3 py-2">Producto</th>
                            <th className="px-3 py-2">Categoria</th>
                            <th className="px-3 py-2">Línea</th>
                            <th className="px-3 py-2">Estado</th>
                            <th className="px-3 py-2 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {props.filteredProducts.map((product) => (
                            <tr key={product.id} className="border-t border-[var(--color-border)]">
                              <td className="px-3 py-2">
                                <p className="font-medium">{product.name}</p>
                                <p className="text-xs text-[var(--color-text-muted)]">{product.shortDescription}</p>
                              </td>
                              <td className="px-3 py-2">{categoryLabels[product.category]}</td>
                              <td className="px-3 py-2">{lineLabels[product.line]}</td>
                              <td className="px-3 py-2">
                                {product.featured ? (
                                  <span className="rounded-full border border-emerald-500/45 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300">
                                    Destacado
                                  </span>
                                ) : (
                                  <span className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-text-muted)]">
                                    Normal
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-2">
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    className="text-xs text-[var(--color-accent-red)] underline underline-offset-4"
                                    onClick={() => props.duplicateProduct(product)}
                                  >
                                    Duplicar
                                  </button>
                                  <button
                                    type="button"
                                    className="text-xs text-[var(--color-accent-red)] underline underline-offset-4"
                                    onClick={() => props.openProductEditor(product)}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    type="button"
                                    className="text-xs text-rose-300 underline underline-offset-4"
                                    onClick={() => props.removeProductMutation.mutate(product.id)}
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>

                  {props.productEditorOpen ? (
                    <article ref={productEditorRef} className="argon-card rounded-[1.2rem] p-4 md:p-6">
                      <div className="mb-4 flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {props.productForm.id ? "Editar producto" : "Nuevo producto"}
                          </h3>
                          <p className="text-sm text-[var(--color-text-muted)]">Formulario rápido y simple</p>
                        </div>
                        <button type="button" className="argon-button-secondary" onClick={props.resetProductForm}>
                          Cerrar
                        </button>
                      </div>
                      <form
                        className="grid gap-3"
                        onSubmit={async (event) => {
                          event.preventDefault();
                          const id = props.productForm.id || `prod-${Date.now()}`;
                          const slug =
                            props.productForm.slug ||
                            props.productForm.name
                              .toLowerCase()
                              .replaceAll(" ", "-")
                              .replaceAll(/[^\w-]/g, "");

                          await props.saveProductMutation.mutateAsync({
                            ...props.productForm,
                            id,
                            slug,
                            specs: props.productForm.specs.filter(Boolean),
                            tags: props.productForm.tags.filter(Boolean),
                            gallery: props.productForm.gallery.filter(Boolean),
                            variants: props.productForm.variants?.filter(Boolean) ?? [],
                          });
                          props.resetProductForm();
                        }}
                      >
                        <label className="argon-label">
                          Nombre
                          <input
                            className="argon-input"
                            value={props.productForm.name}
                            onChange={(event) =>
                              props.setProductForm((prev) => ({ ...prev, name: event.target.value }))
                            }
                            required
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="argon-label">
                            Categoría
                            <select
                              className="argon-input"
                              value={props.productForm.category}
                              onChange={(event) =>
                                props.setProductForm((prev) => ({
                                  ...prev,
                                  category: event.target.value as InstrumentCategory,
                                }))
                              }
                            >
                              {categoryOptions.map((category) => (
                                <option key={category} value={category}>
                                  {categoryLabels[category]}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="argon-label">
                            Línea
                            <select
                              className="argon-input"
                              value={props.productForm.line}
                              onChange={(event) =>
                                props.setProductForm((prev) => ({
                                  ...prev,
                                  line: event.target.value as ProductLine,
                                }))
                              }
                            >
                              {lineOptions.map((line) => (
                                <option key={line} value={line}>
                                  {lineLabels[line]}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <label className="argon-label">
                          Descripción corta
                          <input
                            className="argon-input"
                            value={props.productForm.shortDescription}
                            onChange={(event) =>
                              props.setProductForm((prev) => ({
                                ...prev,
                                shortDescription: event.target.value,
                              }))
                            }
                            required
                          />
                        </label>
                        <label className="argon-label">
                          Descripción detallada
                          <textarea
                            className="argon-input min-h-24"
                            value={props.productForm.description}
                            onChange={(event) =>
                              props.setProductForm((prev) => ({ ...prev, description: event.target.value }))
                            }
                            required
                          />
                        </label>
                        <div className="space-y-2">
                          <p className="text-sm text-[var(--color-text-muted)]">Especificaciones frecuentes</p>
                          <div className="flex flex-wrap gap-2">
                            {quickSpecTemplates.map((template) => (
                              <button
                                key={template}
                                type="button"
                                className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)]"
                                onClick={() => props.appendProductItem("specs", template)}
                              >
                                + {template}
                              </button>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {props.productForm.specs.map((item) => (
                              <button
                                key={item}
                                type="button"
                                className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)]"
                                onClick={() => props.removeProductItem("specs", item)}
                              >
                                {item} ×
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              className="argon-input"
                              value={props.specInput}
                              onChange={(event) => props.setSpecInput(event.target.value)}
                              placeholder="Agregar especificación manual"
                            />
                            <button
                              type="button"
                              className="argon-button-secondary shrink-0"
                              onClick={() => {
                                props.appendProductItem("specs", props.specInput);
                                props.setSpecInput("");
                              }}
                            >
                              Agregar
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-[var(--color-text-muted)]">Etiquetas sugeridas</p>
                          <div className="flex flex-wrap gap-2">
                            {quickTagTemplates.map((template) => (
                              <button
                                key={template}
                                type="button"
                                className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)]"
                                onClick={() => props.appendProductItem("tags", template)}
                              >
                                + {template}
                              </button>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {props.productForm.tags.map((item) => (
                              <button
                                key={item}
                                type="button"
                                className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)]"
                                onClick={() => props.removeProductItem("tags", item)}
                              >
                                {item} ×
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              className="argon-input"
                              value={props.tagInput}
                              onChange={(event) => props.setTagInput(event.target.value)}
                              placeholder="Agregar etiqueta manual"
                            />
                            <button
                              type="button"
                              className="argon-button-secondary shrink-0"
                              onClick={() => {
                                props.appendProductItem("tags", props.tagInput);
                                props.setTagInput("");
                              }}
                            >
                              Agregar
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-1 text-sm">
                          <label className="inline-flex items-center gap-2 text-[var(--color-text-muted)]">
                            <input
                              type="checkbox"
                              checked={props.productForm.featured}
                              onChange={(event) =>
                                props.setProductForm((prev) => ({ ...prev, featured: event.target.checked }))
                              }
                            />
                            Destacar en catálogo
                          </label>
                          <label className="inline-flex items-center gap-2 text-[var(--color-text-muted)]">
                            <input
                              type="checkbox"
                              checked={props.productForm.hero}
                              onChange={(event) =>
                                props.setProductForm((prev) => ({ ...prev, hero: event.target.checked }))
                              }
                            />
                            Usar en hero principal
                          </label>
                        </div>
                        <button type="submit" className="argon-button-primary mt-1 w-full">
                          {props.saveProductMutation.isPending ? "Guardando..." : "Guardar producto"}
                        </button>
                      </form>
                    </article>
                  ) : (
                    <article className="argon-card rounded-[1.2rem] p-4 md:p-6">
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Selecciona &quot;Nuevo producto&quot; o &quot;Editar&quot; para abrir el editor.
                      </p>
                    </article>
                  )}
                </section>
              ) : null}

              {activeSection === "comentarios" ? (
                <section className="grid gap-5 2xl:grid-cols-[1fr_420px]">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={`rounded-full border px-4 py-2 text-sm font-medium ${
                          props.clientesSubTab === "crm"
                            ? "border-[var(--color-accent-red)] bg-[var(--color-accent-red)] text-white"
                            : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                        }`}
                        onClick={() => props.setClientesSubTab("crm")}
                      >
                        CRM
                      </button>
                      <button
                        type="button"
                        className={`rounded-full border px-4 py-2 text-sm font-medium ${
                          props.clientesSubTab === "testimonios"
                            ? "border-[var(--color-accent-red)] bg-[var(--color-accent-red)] text-white"
                            : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                        }`}
                        onClick={() => props.setClientesSubTab("testimonios")}
                      >
                        Testimonios
                      </button>
                    </div>

                    {props.clientesSubTab === "crm" ? (
                      <article className="argon-card rounded-[1.2rem] p-4 md:p-6">
                        <div className="mb-4 border-b border-[var(--color-border)] pb-4">
                          <h3 className="text-lg font-semibold">Clientes (CRM)</h3>
                          <p className="text-sm text-[var(--color-text-muted)]">
                            Notas, etiquetas e historial de compras
                          </p>
                          <input
                            className="argon-input mt-3 w-full"
                            placeholder="Buscar cliente"
                            value={props.customerSearch}
                            onChange={(e) => props.setCustomerSearch(e.target.value)}
                          />
                        </div>
                        <div className="overflow-auto rounded-xl border border-[var(--color-border)]">
                          <table className="w-full min-w-[640px] text-left text-sm">
                            <thead className="bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)]">
                              <tr>
                                <th className="px-3 py-2">Nombre</th>
                                <th className="px-3 py-2">Contacto</th>
                                <th className="px-3 py-2">Etiquetas</th>
                                <th className="px-3 py-2 text-right">Pedidos</th>
                              </tr>
                            </thead>
                            <tbody>
                              {props.filteredCustomers.map((c) => (
                                <tr
                                  key={c.id}
                                  className={`cursor-pointer border-t border-[var(--color-border)] ${
                                    props.selectedCustomerId === c.id ? "bg-[var(--color-accent-red)]/10" : ""
                                  }`}
                                  onClick={() =>
                                    props.setSelectedCustomerId(props.selectedCustomerId === c.id ? null : c.id)
                                  }
                                >
                                  <td className="px-3 py-2 font-medium">{c.name}</td>
                                  <td className="px-3 py-2 text-xs text-[var(--color-text-muted)]">
                                    {c.email ?? "—"}
                                    <br />
                                    {c.phone ?? ""}
                                  </td>
                                  <td className="px-3 py-2 text-xs">{c.tags.join(", ") || "—"}</td>
                                  <td className="px-3 py-2 text-right">
                                    {props.customerOrders(c.id).length}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {selectedCustomer ? (
                          <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold">{selectedCustomer.name}</h4>
                              <button
                                type="button"
                                className="text-xs text-rose-300 underline"
                                onClick={() => props.removeCustomerMutation.mutate(selectedCustomer.id)}
                              >
                                Eliminar
                              </button>
                            </div>
                            {selectedCustomerWhatsAppUrl ? (
                              <div className="mt-3">
                                <CrmWhatsAppLink href={selectedCustomerWhatsAppUrl} />
                              </div>
                            ) : selectedCustomer.phone ? (
                              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                                Teléfono sin formato válido para WhatsApp
                              </p>
                            ) : (
                              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                                Agregá un teléfono al cliente para abrir WhatsApp
                              </p>
                            )}
                            <div className="mt-3 space-y-2">
                              <p className="text-xs uppercase text-[var(--color-text-muted)]">Etiquetas</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedCustomer.tags.map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs"
                                    onClick={() =>
                                      props.upsertCustomerMutation.mutateAsync({
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
                                  className="argon-input flex-1 text-sm"
                                  value={props.customerTagInput}
                                  onChange={(e) => props.setCustomerTagInput(e.target.value)}
                                  placeholder="Nueva etiqueta"
                                />
                                <button
                                  type="button"
                                  className="argon-button-secondary shrink-0"
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
                                  Agregar
                                </button>
                              </div>
                            </div>
                            <div className="mt-4">
                              <p className="text-xs uppercase text-[var(--color-text-muted)]">Notas</p>
                              <ul className="mt-2 space-y-2">
                                {selectedCustomer.notes.map((n) => (
                                  <li key={n.id} className="rounded-lg border border-[var(--color-border)] p-2 text-sm">
                                    {n.text}
                                    <span className="mt-1 block text-[10px] text-[var(--color-text-muted)]">
                                      {new Date(n.createdAt).toLocaleString("es-AR")}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-2 flex gap-2">
                                <input
                                  className="argon-input flex-1 text-sm"
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
                                  Guardar
                                </button>
                              </div>
                            </div>
                            <div className="mt-4">
                              <p className="text-xs uppercase text-[var(--color-text-muted)]">
                                Historial de compras
                              </p>
                              <ul className="mt-2 space-y-1 text-sm">
                                {props.customerOrders(selectedCustomer.id).map((o) => (
                                  <li key={o.id} className="flex justify-between gap-2">
                                    <span>{o.summary}</span>
                                    <span className="text-[var(--color-text-muted)]">
                                      {orderStatusLabels[o.status]}
                                    </span>
                                  </li>
                                ))}
                                {props.customerOrders(selectedCustomer.id).length === 0 ? (
                                  <li className="text-[var(--color-text-muted)]">Sin pedidos</li>
                                ) : null}
                              </ul>
                            </div>
                          </div>
                        ) : null}
                      </article>
                    ) : (
                      <article className="argon-card rounded-[1.2rem] p-4 md:p-6">
                        <div className="mb-4 flex flex-col gap-3 border-b border-[var(--color-border)] pb-4 md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">Comentarios de clientes</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">
                              Edita testimonios que se muestran en la web.
                            </p>
                          </div>
                          <input
                            className="argon-input w-full"
                            placeholder="Buscar comentario"
                            value={props.testimonialSearch}
                            onChange={(event) => props.setTestimonialSearch(event.target.value)}
                          />
                        </div>
                        <div className="space-y-2.5">
                          {props.filteredTestimonials.map((testimonial) => (
                            <div
                              key={testimonial.id}
                              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4"
                            >
                              {testimonial.videoUrl ? (
                                <div className="mb-3 overflow-hidden rounded-lg border border-[var(--color-border)] bg-black">
                                  {isDirectVideoUrl(testimonial.videoUrl) ? (
                                    <video
                                      src={testimonial.videoUrl}
                                      className="h-64 w-full object-cover"
                                      muted
                                      loop
                                      playsInline
                                      controls
                                      preload="metadata"
                                    />
                                  ) : (
                                    <div className="flex h-64 w-full flex-col items-center justify-center gap-2 p-4 text-center">
                                      <p className="text-xs uppercase tracking-[0.12em] text-white/70">
                                        Link externo detectado
                                      </p>
                                      <a
                                        href={testimonial.videoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-full border border-white/30 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-white"
                                      >
                                        Abrir video
                                      </a>
                                    </div>
                                  )}
                                </div>
                              ) : null}
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-medium">{testimonial.musicianName}</p>
                                  <p className="text-sm text-[var(--color-text-muted)]">{testimonial.role}</p>
                                  <p className="mt-1 text-sm">{testimonial.quote}</p>
                                </div>
                                {testimonial.featured ? (
                                  <span className="rounded-full border border-emerald-500/45 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-300">
                                    Destacado
                                  </span>
                                ) : null}
                              </div>
                              <div className="mt-2 flex gap-3">
                                <button
                                  type="button"
                                  className="text-sm text-[var(--color-accent-red)] underline underline-offset-4"
                                  onClick={() => props.setTestimonialForm(testimonial)}
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  className="text-sm text-rose-300 underline underline-offset-4"
                                  onClick={() => props.removeTestimonialMutation.mutate(testimonial.id)}
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </article>
                    )}
                  </div>

                  {props.clientesSubTab === "testimonios" ? (
                    <article className="argon-card rounded-[1.2rem] p-4 md:p-6">
                      <div className="mb-4 border-b border-[var(--color-border)] pb-3">
                        <h3 className="text-lg font-semibold">
                          {props.testimonialForm.id ? "Editar comentario" : "Nuevo comentario"}
                        </h3>
                      </div>
                      <form
                        className="space-y-4"
                        onSubmit={async (event) => {
                          event.preventDefault();
                          await props.saveTestimonialMutation.mutateAsync({
                            ...props.testimonialForm,
                            id: props.testimonialForm.id || `test-${Date.now()}`,
                          });
                          props.setTestimonialForm(emptyTestimonial);
                        }}
                      >
                        <label className="argon-label">
                          Músico o cliente
                          <input
                            className="argon-input"
                            value={props.testimonialForm.musicianName}
                            onChange={(event) =>
                              props.setTestimonialForm((prev) => ({
                                ...prev,
                                musicianName: event.target.value,
                              }))
                            }
                            required
                          />
                        </label>
                        <label className="argon-label">
                          Rol
                          <input
                            className="argon-input"
                            value={props.testimonialForm.role}
                            onChange={(event) =>
                              props.setTestimonialForm((prev) => ({ ...prev, role: event.target.value }))
                            }
                            required
                          />
                        </label>
                        <label className="argon-label">
                          Comentario
                          <textarea
                            className="argon-input min-h-28"
                            value={props.testimonialForm.quote}
                            onChange={(event) =>
                              props.setTestimonialForm((prev) => ({ ...prev, quote: event.target.value }))
                            }
                            required
                          />
                        </label>
                        <label className="argon-label">
                          URL de video vertical (opcional)
                          <input
                            className="argon-input"
                            value={props.testimonialForm.videoUrl ?? ""}
                            onChange={(event) =>
                              props.setTestimonialForm((prev) => ({ ...prev, videoUrl: event.target.value }))
                            }
                            placeholder="https://.../video.mp4"
                          />
                          <span className="mt-1 block text-[11px] text-[var(--color-text-muted)]">
                            Recomendado: URL directa .mp4/.webm. Si pegas un reel/link externo, se mostrara boton
                            para abrir.
                          </span>
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                          <input
                            type="checkbox"
                            checked={props.testimonialForm.featured}
                            onChange={(event) =>
                              props.setTestimonialForm((prev) => ({ ...prev, featured: event.target.checked }))
                            }
                          />
                          Mostrar como destacado
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                          <input
                            type="checkbox"
                            checked={props.testimonialForm.videoAutoplay ?? false}
                            onChange={(event) =>
                              props.setTestimonialForm((prev) => ({
                                ...prev,
                                videoAutoplay: event.target.checked,
                              }))
                            }
                          />
                          Reproducir video automatico en loop (silenciado)
                        </label>
                        <button type="submit" className="argon-button-primary w-full">
                          {props.saveTestimonialMutation.isPending ? "Guardando..." : "Guardar comentario"}
                        </button>
                      </form>
                    </article>
                  ) : null}
                </section>
              ) : null}
            </div>
          </section>
        </div>
      </div>

      {quickOrderOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-xl">
            <h3 className="text-lg font-semibold">Pedido rápido</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Ideal para ventas por WhatsApp o Instagram
            </p>
            <form
              className="mt-4 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                await props.onCreateQuickOrder({
                  channel: quickChannel,
                  summary: quickSummary,
                  customerName: quickName || undefined,
                  phone: quickPhone || undefined,
                  email: quickEmail || undefined,
                });
                setQuickOrderOpen(false);
                setQuickSummary("");
                setQuickName("");
                setQuickPhone("");
                setQuickEmail("");
              }}
            >
              <label className="argon-label">
                Canal
                <select
                  className="argon-input"
                  value={quickChannel}
                  onChange={(e) => setQuickChannel(e.target.value as OrderChannel)}
                >
                  {(Object.keys(orderChannelLabels) as OrderChannel[]).map((ch) => (
                    <option key={ch} value={ch}>
                      {orderChannelLabels[ch]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="argon-label">
                Resumen del pedido
                <textarea
                  className="argon-input min-h-[80px]"
                  value={quickSummary}
                  onChange={(e) => setQuickSummary(e.target.value)}
                  required
                  placeholder="Ej: Funda Pro guitarra negra, retiro viernes"
                />
              </label>
              <label className="argon-label">
                Nombre cliente (opcional)
                <input
                  className="argon-input"
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                />
              </label>
              <label className="argon-label">
                Teléfono (opcional)
                <input
                  className="argon-input"
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(e.target.value)}
                />
              </label>
              <label className="argon-label">
                Email (opcional)
                <input
                  className="argon-input"
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                />
              </label>
              <div className="flex gap-2 pt-2">
                <button type="button" className="argon-button-secondary flex-1" onClick={() => setQuickOrderOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="argon-button-primary flex-1" disabled={props.quickOrderPending}>
                  {props.quickOrderPending ? "Guardando..." : "Crear pedido"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
