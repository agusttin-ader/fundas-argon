"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/lib/data/services/admin-service";
import { useAuth } from "@/lib/auth/auth-context";
import type { InstrumentCategory, Product, ProductLine, Testimonial } from "@/types/domain";

const categoryOptions: InstrumentCategory[] = [
  "guitarra",
  "bajo",
  "bateria",
  "platos",
  "teclados",
  "percusion",
  "vientos",
  "dj",
  "otros",
];

const lineOptions: ProductLine[] = ["estandar", "pro", "personalizada"];

const emptyProductForm: Product = {
  id: "",
  slug: "",
  name: "",
  category: "guitarra",
  line: "estandar",
  shortDescription: "",
  description: "",
  featured: false,
  featuredOrder: 99,
  hero: false,
  coverImage: "",
  gallery: [],
  specs: [],
  tags: [],
  variants: [],
};

const emptyTestimonial: Testimonial = {
  id: "",
  musicianName: "",
  role: "",
  quote: "",
  featured: false,
};

const quickSpecTemplates = [
  "Acolchado de alta densidad",
  "Cierres reforzados",
  "Bolsillo frontal amplio",
  "Manijas reforzadas",
];

const quickTagTemplates = ["Reforzada", "A medida", "Argon Pro", "Viaje", "Escenario"];

type AdminSection = "resumen" | "productos" | "solicitudes" | "comentarios";

const statusOptions = ["pendiente", "contactado", "cerrado"] as const;

const statusTone: Record<(typeof statusOptions)[number], string> = {
  pendiente: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  contactado: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  cerrado: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
};

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const { user, logOut } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>("resumen");

  const [productForm, setProductForm] = useState<Product>(emptyProductForm);
  const [productEditorOpen, setProductEditorOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productFilterLine, setProductFilterLine] = useState<ProductLine | "all">("all");
  const [productFilterCategory, setProductFilterCategory] = useState<InstrumentCategory | "all">("all");

  const [testimonialForm, setTestimonialForm] = useState<Testimonial>(emptyTestimonial);
  const [testimonialSearch, setTestimonialSearch] = useState("");

  const [specInput, setSpecInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const [requestSearch, setRequestSearch] = useState("");
  const [requestStatusFilter, setRequestStatusFilter] = useState<(typeof statusOptions)[number] | "all">("all");
  const productEditorRef = useRef<HTMLElement | null>(null);

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => adminService.listProducts(),
  });
  const testimonialsQuery = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => adminService.listTestimonials(),
  });
  const requestsQuery = useQuery({
    queryKey: ["customization-requests"],
    queryFn: () => adminService.listCustomizationRequests(),
  });

  const saveProductMutation = useMutation({
    mutationFn: (payload: Product) => adminService.upsertProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const removeProductMutation = useMutation({
    mutationFn: (productId: string) => adminService.removeProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const saveTestimonialMutation = useMutation({
    mutationFn: (payload: Testimonial) => adminService.upsertTestimonial(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setTestimonialForm(emptyTestimonial);
    },
  });

  const removeTestimonialMutation = useMutation({
    mutationFn: (testimonialId: string) => adminService.removeTestimonial(testimonialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "pendiente" | "contactado" | "cerrado" }) =>
      adminService.updateCustomizationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customization-requests"] });
    },
  });

  const sortedRequests = useMemo(
    () =>
      [...(requestsQuery.data ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [requestsQuery.data],
  );
  const products = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);
  const testimonials = useMemo(() => testimonialsQuery.data ?? [], [testimonialsQuery.data]);
  const pendingRequests = sortedRequests.filter((request) => request.status === "pendiente").length;
  const contactadosRequests = sortedRequests.filter((request) => request.status === "contactado").length;
  const closedRequests = sortedRequests.filter((request) => request.status === "cerrado").length;
  const featuredProducts = products.filter((product) => product.featured).length;
  const featuredTestimonials = testimonials.filter((testimonial) => testimonial.featured).length;

  const appendProductItem = (field: "specs" | "tags" | "variants" | "gallery", rawValue: string) => {
    const value = rawValue.trim();
    if (!value) return;
    setProductForm((prev) => {
      const current = prev[field] ?? [];
      if (current.includes(value)) {
        return prev;
      }
      return {
        ...prev,
        [field]: [...current, value],
      };
    });
  };

  const removeProductItem = (field: "specs" | "tags" | "variants" | "gallery", value: string) => {
    setProductForm((prev) => ({
      ...prev,
      [field]: (prev[field] ?? []).filter((item) => item !== value),
    }));
  };

  const resetProductForm = () => {
    setProductForm(emptyProductForm);
    setSpecInput("");
    setTagInput("");
    setProductEditorOpen(false);
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
          product.shortDescription.toLowerCase().includes(productSearch.toLowerCase());
        const matchesLine = productFilterLine === "all" || product.line === productFilterLine;
        const matchesCategory = productFilterCategory === "all" || product.category === productFilterCategory;
        return matchesSearch && matchesLine && matchesCategory;
      }),
    [productFilterCategory, productFilterLine, productSearch, products],
  );

  const filteredRequests = useMemo(
    () =>
      sortedRequests.filter((request) => {
        const matchesSearch =
          request.fullName.toLowerCase().includes(requestSearch.toLowerCase()) ||
          request.email.toLowerCase().includes(requestSearch.toLowerCase()) ||
          request.instrument.toLowerCase().includes(requestSearch.toLowerCase());
        const matchesStatus = requestStatusFilter === "all" || request.status === requestStatusFilter;
        return matchesSearch && matchesStatus;
      }),
    [requestSearch, requestStatusFilter, sortedRequests],
  );

  const filteredTestimonials = useMemo(
    () =>
      testimonials.filter((testimonial) => {
        const query = testimonialSearch.toLowerCase();
        return (
          testimonial.musicianName.toLowerCase().includes(query) ||
          testimonial.role.toLowerCase().includes(query) ||
          testimonial.quote.toLowerCase().includes(query)
        );
      }),
    [testimonialSearch, testimonials],
  );

  const duplicateProduct = async (product: Product) => {
    const copyName = `${product.name} (copia)`;
    const copyBase = `${product.id}-copy`;
    const existingCopies = products.filter((item) => item.id.startsWith(copyBase)).length;
    const copyId = `${copyBase}-${existingCopies + 1}`;
    await saveProductMutation.mutateAsync({
      ...product,
      id: copyId,
      name: copyName,
      slug: copyName
        .toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll(/[^\w-]/g, ""),
      featured: false,
      hero: false,
    });
  };

  const openProductEditor = (product?: Product) => {
    if (product) {
      setProductForm(product);
      setSpecInput("");
      setTagInput("");
    } else {
      resetProductForm();
    }
    setProductEditorOpen(true);
    requestAnimationFrame(() => {
      productEditorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const navItems: Array<{ id: AdminSection; label: string; helper: string; icon: string }> = [
    { id: "resumen", label: "Inicio", helper: "Estado general", icon: "Inicio" },
    { id: "solicitudes", label: "Pedidos", helper: `${pendingRequests} pendientes`, icon: "Pedidos" },
    { id: "productos", label: "Productos", helper: `${products.length} activos`, icon: "Productos" },
    { id: "comentarios", label: "Clientes", helper: `${testimonials.length} cargados`, icon: "Clientes" },
  ];

  return (
    <main className="mx-auto flex w-full max-w-[1400px] flex-1 overflow-x-clip bg-[radial-gradient(circle_at_15%_-10%,rgba(220,220,220,0.18)_0,transparent_40%)] px-3 pb-[calc(env(safe-area-inset-bottom)+5.6rem)] pt-3 md:h-[100dvh] md:overflow-hidden md:bg-none md:p-8 md:pb-8 2xl:max-w-[1680px] 2xl:p-10 min-[1920px]:max-w-[1880px] min-[1920px]:p-12 min-[2560px]:max-w-[2400px] min-[2560px]:p-14">
      <div className="w-full min-w-0 overflow-x-clip rounded-[1.6rem] border border-[color-mix(in_srgb,var(--color-border)_82%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_94%,transparent)] p-3 shadow-[0_24px_45px_-30px_rgba(0,0,0,0.45)] backdrop-blur-sm md:h-[calc(100dvh-4rem)] md:rounded-[2rem] md:border-none md:bg-[var(--color-surface)] md:p-5 md:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.65)] 2xl:rounded-[2.2rem] 2xl:p-6 min-[2560px]:rounded-[2.4rem] min-[2560px]:p-8">
        <div className="grid w-full min-w-0 gap-5 md:h-full md:min-h-0 md:grid-cols-[228px_1fr] 2xl:grid-cols-[280px_1fr] 2xl:gap-6 min-[1920px]:grid-cols-[320px_1fr] min-[2560px]:grid-cols-[380px_1fr] min-[2560px]:gap-8">
        <aside className="argon-card relative hidden overflow-hidden rounded-[1.5rem] border-[color-mix(in_srgb,var(--color-border)_80%,#000)] bg-[linear-gradient(180deg,#161616_0%,#111111_100%)] p-5 md:sticky md:top-0 md:flex md:h-full md:max-h-full md:self-start md:flex-col 2xl:p-6 min-[2560px]:p-7">
          <div className="absolute inset-0 bg-[linear-gradient(160deg,color-mix(in_srgb,var(--color-accent-red)_12%,transparent)_0%,transparent_60%)]" />
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
              <p className="mt-3 text-xs text-[var(--color-text-muted)]">Panel de administracion</p>
            </div>
            <nav className="mt-5 space-y-2.5 text-sm">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
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
            <div className="mt-auto pt-3 space-y-2.5">
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
          <div className="md:hidden">
            <div className="sticky top-2 z-20 space-y-2 rounded-[1.2rem] border border-[color-mix(in_srgb,var(--color-border)_70%,transparent)] bg-[color-mix(in_srgb,var(--color-surface-secondary)_82%,transparent)] p-2.5 backdrop-blur-xl">
              <article className="rounded-[1rem] border border-[color-mix(in_srgb,var(--color-accent-red)_45%,transparent)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-accent-red)_92%,#1a1a1a)_0%,color-mix(in_srgb,var(--color-accent-red)_75%,#141414)_58%,#121212_100%)] p-3 text-white shadow-[0_16px_28px_-20px_rgba(179,38,46,0.75)]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-white/80">Panel Fundas Argon</p>
                    <p className="mt-1 text-base font-semibold leading-tight">{user?.displayName || "Equipo Argon"}</p>
                    <p className="mt-0.5 max-w-[210px] truncate text-[11px] text-white/80">{user?.email}</p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 text-xs font-semibold">
                    FA
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-white/15 p-2">
                    <p className="text-[10px] text-white/80">Pendientes</p>
                    <p className="text-base font-semibold">{pendingRequests}</p>
                  </div>
                  <div className="rounded-xl bg-white/15 p-2">
                    <p className="text-[10px] text-white/80">Productos</p>
                    <p className="text-base font-semibold">{products.length}</p>
                  </div>
                  <div className="rounded-xl bg-white/15 p-2">
                    <p className="text-[10px] text-white/80">Clientes</p>
                    <p className="text-base font-semibold">{testimonials.length}</p>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <header className="argon-admin-hero relative hidden overflow-hidden rounded-[1.4rem] border p-6 md:block md:p-7">
            <div className="argon-admin-hero-glow absolute inset-0" />
            <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between 2xl:gap-6">
              <div>
                <p className="argon-eyebrow">Panel Fundas Argon</p>
                <h1 className="text-2xl font-semibold tracking-tight text-[var(--admin-hero-text)] md:text-3xl 2xl:text-4xl min-[2560px]:text-5xl">
                  Hola, {user?.displayName || "Equipo Argon"}!
                </h1>
                <p className="mt-1 text-sm text-[var(--admin-hero-muted)]">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="relative z-10 mt-6 grid gap-3 md:grid-cols-3">
              <article className="rounded-2xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface-secondary)_92%,transparent)] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">Productos activos</p>
                <p className="mt-1 text-2xl font-semibold">{products.length}</p>
              </article>
              <article className="rounded-2xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface-secondary)_92%,transparent)] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">Pedidos pendientes</p>
                <p className="mt-1 text-2xl font-semibold text-[var(--color-accent-red)]">{pendingRequests}</p>
              </article>
              <article className="rounded-2xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface-secondary)_92%,transparent)] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">Comentarios destacados</p>
                <p className="mt-1 text-2xl font-semibold">{featuredTestimonials}</p>
              </article>
            </div>
          </header>

          <div key={activeSection} className="argon-section-enter">
          {activeSection === "resumen" ? (
            <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <article className="argon-card rounded-[1.2rem] p-4 shadow-[0_16px_28px_-20px_rgba(0,0,0,0.55)] md:p-6 md:shadow-none">
                <h3 className="mb-4 text-lg font-semibold">Tareas prioritarias</h3>
                <div className="space-y-3">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4">
                    <p className="text-sm font-medium">Solicitudes sin responder</p>
                    <p className="mt-1 text-3xl font-semibold text-amber-300">{pendingRequests}</p>
                    <button
                      type="button"
                      className="mt-2 text-sm text-[var(--color-accent-red)] underline underline-offset-4"
                      onClick={() => setActiveSection("solicitudes")}
                    >
                      Ir a solicitudes
                    </button>
                  </div>
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4">
                    <p className="text-sm font-medium">Productos destacados activos</p>
                    <p className="mt-1 text-3xl font-semibold">{featuredProducts}</p>
                    <button
                      type="button"
                      className="mt-2 text-sm text-[var(--color-accent-red)] underline underline-offset-4"
                      onClick={() => setActiveSection("productos")}
                    >
                      Gestionar productos
                    </button>
                  </div>
                </div>
              </article>
              <article className="argon-card rounded-[1.2rem] p-4 shadow-[0_16px_28px_-20px_rgba(0,0,0,0.55)] md:p-6 md:shadow-none">
                <h3 className="mb-4 text-lg font-semibold">Estado de solicitudes</h3>
                <div className="grid gap-3">
                  {statusOptions.map((status) => (
                    <div
                      key={status}
                      className={`rounded-xl border p-4 ${statusTone[status]}`}
                    >
                      <p className="text-xs uppercase tracking-[0.12em]">{status}</p>
                      <p className="mt-1 text-2xl font-semibold">
                        {status === "pendiente"
                          ? pendingRequests
                          : status === "contactado"
                            ? contactadosRequests
                            : closedRequests}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          ) : null}

          {activeSection === "solicitudes" ? (
            <section className="argon-card rounded-[1.2rem] p-4 shadow-[0_16px_28px_-20px_rgba(0,0,0,0.55)] md:p-6 md:shadow-none">
              <div className="mb-4 flex flex-col gap-3 border-b border-[var(--color-border)] pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Bandeja de solicitudes</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">Gestiona consultas y estado de seguimiento</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    className="argon-input w-full"
                    placeholder="Buscar por nombre, email o instrumento"
                    value={requestSearch}
                    onChange={(event) => setRequestSearch(event.target.value)}
                  />
                  <select
                    className="argon-input"
                    value={requestStatusFilter}
                    onChange={(event) =>
                      setRequestStatusFilter(event.target.value as (typeof statusOptions)[number] | "all")
                    }
                  >
                    <option value="all">Todos los estados</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                {filteredRequests.length === 0 ? (
                  <p className="text-sm text-[var(--color-text-muted)]">
                    No hay solicitudes con esos filtros.
                  </p>
                ) : (
                  filteredRequests.map((request) => (
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
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            type="button"
                            className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
                              request.status === status
                                ? "border-[var(--color-accent-red)] text-[var(--color-accent-red)]"
                                : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                            }`}
                            onClick={() => statusMutation.mutate({ id: request.id, status })}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          ) : null}

          {activeSection === "productos" ? (
            <section className="grid gap-5 2xl:grid-cols-[1fr_420px]">
              <article className="argon-card rounded-[1.2rem] p-4 shadow-[0_16px_28px_-20px_rgba(0,0,0,0.55)] md:p-6 md:shadow-none">
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
                      onClick={() => openProductEditor()}
                    >
                      Nuevo producto
                    </button>
                  </div>
                </div>
                <div className="mb-3 grid gap-2 md:grid-cols-[1fr_180px_180px]">
                  <input
                    className="argon-input"
                    placeholder="Buscar producto"
                    value={productSearch}
                    onChange={(event) => setProductSearch(event.target.value)}
                  />
                  <select
                    className="argon-input"
                    value={productFilterLine}
                    onChange={(event) => setProductFilterLine(event.target.value as ProductLine | "all")}
                  >
                    <option value="all">Todas las lineas</option>
                    {lineOptions.map((line) => (
                      <option key={line} value={line}>
                        {line}
                      </option>
                    ))}
                  </select>
                  <select
                    className="argon-input"
                    value={productFilterCategory}
                    onChange={(event) =>
                      setProductFilterCategory(event.target.value as InstrumentCategory | "all")
                    }
                  >
                    <option value="all">Todas las categorias</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 md:hidden">
                  {filteredProducts.length === 0 ? (
                    <p className="rounded-xl border border-[var(--color-border)] p-3 text-sm text-[var(--color-text-muted)]">
                      No hay productos con esos filtros.
                    </p>
                  ) : (
                    filteredProducts.map((product) => (
                      <article
                        key={product.id}
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs capitalize text-[var(--color-text-muted)]">
                              {product.category} · {product.line}
                            </p>
                            <p className="mt-1 text-xs text-[var(--color-text-muted)]">{product.shortDescription}</p>
                          </div>
                          {product.featured ? (
                            <span className="shrink-0 rounded-full border border-emerald-500/45 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                              Destacado
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button
                            type="button"
                            className="text-xs text-[var(--color-accent-red)] underline underline-offset-4"
                            onClick={() => duplicateProduct(product)}
                          >
                            Duplicar
                          </button>
                          <button
                            type="button"
                            className="text-xs text-[var(--color-accent-red)] underline underline-offset-4"
                            onClick={() => openProductEditor(product)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="text-xs text-rose-300 underline underline-offset-4"
                            onClick={() => removeProductMutation.mutate(product.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
                <div className="hidden overflow-auto rounded-xl border border-[var(--color-border)] md:block">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)]">
                      <tr>
                        <th className="px-3 py-2">Producto</th>
                        <th className="px-3 py-2">Categoria</th>
                        <th className="px-3 py-2">Linea</th>
                        <th className="px-3 py-2">Estado</th>
                        <th className="px-3 py-2 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-t border-[var(--color-border)]">
                          <td className="px-3 py-2">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">{product.shortDescription}</p>
                          </td>
                          <td className="px-3 py-2 capitalize">{product.category}</td>
                          <td className="px-3 py-2 capitalize">{product.line}</td>
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
                                onClick={() => duplicateProduct(product)}
                              >
                                Duplicar
                              </button>
                              <button
                                type="button"
                                className="text-xs text-[var(--color-accent-red)] underline underline-offset-4"
                                onClick={() => openProductEditor(product)}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="text-xs text-rose-300 underline underline-offset-4"
                                onClick={() => removeProductMutation.mutate(product.id)}
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

              {productEditorOpen ? (
                <article ref={productEditorRef} className="argon-card rounded-[1.2rem] p-4 shadow-[0_16px_28px_-20px_rgba(0,0,0,0.55)] md:p-6 md:shadow-none">
                  <div className="mb-4 flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {productForm.id ? "Editar producto" : "Nuevo producto"}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)]">Formulario rapido y simple</p>
                    </div>
                    <button type="button" className="argon-button-secondary" onClick={resetProductForm}>
                      Cerrar
                    </button>
                  </div>
                  <form
                    className="grid gap-3"
                    onSubmit={async (event) => {
                      event.preventDefault();
                      const id = productForm.id || `prod-${Date.now()}`;
                      const slug =
                        productForm.slug ||
                        productForm.name
                          .toLowerCase()
                          .replaceAll(" ", "-")
                          .replaceAll(/[^\w-]/g, "");

                      await saveProductMutation.mutateAsync({
                        ...productForm,
                        id,
                        slug,
                        specs: productForm.specs.filter(Boolean),
                        tags: productForm.tags.filter(Boolean),
                        gallery: productForm.gallery.filter(Boolean),
                        variants: productForm.variants?.filter(Boolean) ?? [],
                      });
                      resetProductForm();
                    }}
                  >
                    <label className="argon-label">
                      Nombre
                      <input
                        className="argon-input"
                        value={productForm.name}
                        onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
                        required
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="argon-label">
                        Categoria
                        <select
                          className="argon-input"
                          value={productForm.category}
                          onChange={(event) =>
                            setProductForm((prev) => ({
                              ...prev,
                              category: event.target.value as InstrumentCategory,
                            }))
                          }
                        >
                          {categoryOptions.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="argon-label">
                        Linea
                        <select
                          className="argon-input"
                          value={productForm.line}
                          onChange={(event) =>
                            setProductForm((prev) => ({ ...prev, line: event.target.value as ProductLine }))
                          }
                        >
                          {lineOptions.map((line) => (
                            <option key={line} value={line}>
                              {line}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="argon-label">
                      Descripcion corta
                      <input
                        className="argon-input"
                        value={productForm.shortDescription}
                        onChange={(event) =>
                          setProductForm((prev) => ({ ...prev, shortDescription: event.target.value }))
                        }
                        required
                      />
                    </label>
                    <label className="argon-label">
                      Descripcion detallada
                      <textarea
                        className="argon-input min-h-24"
                        value={productForm.description}
                        onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
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
                            onClick={() => appendProductItem("specs", template)}
                          >
                            + {template}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {productForm.specs.map((item) => (
                          <button
                            key={item}
                            type="button"
                            className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)]"
                            onClick={() => removeProductItem("specs", item)}
                          >
                            {item} ×
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          className="argon-input"
                          value={specInput}
                          onChange={(event) => setSpecInput(event.target.value)}
                          placeholder="Agregar especificacion manual"
                        />
                        <button
                          type="button"
                          className="argon-button-secondary shrink-0"
                          onClick={() => {
                            appendProductItem("specs", specInput);
                            setSpecInput("");
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
                            onClick={() => appendProductItem("tags", template)}
                          >
                            + {template}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {productForm.tags.map((item) => (
                          <button
                            key={item}
                            type="button"
                            className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)]"
                            onClick={() => removeProductItem("tags", item)}
                          >
                            {item} ×
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          className="argon-input"
                          value={tagInput}
                          onChange={(event) => setTagInput(event.target.value)}
                          placeholder="Agregar etiqueta manual"
                        />
                        <button
                          type="button"
                          className="argon-button-secondary shrink-0"
                          onClick={() => {
                            appendProductItem("tags", tagInput);
                            setTagInput("");
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
                          checked={productForm.featured}
                          onChange={(event) =>
                            setProductForm((prev) => ({ ...prev, featured: event.target.checked }))
                          }
                        />
                        Destacar en catalogo
                      </label>
                      <label className="inline-flex items-center gap-2 text-[var(--color-text-muted)]">
                        <input
                          type="checkbox"
                          checked={productForm.hero}
                          onChange={(event) => setProductForm((prev) => ({ ...prev, hero: event.target.checked }))}
                        />
                        Usar en hero principal
                      </label>
                    </div>
                    <button type="submit" className="argon-button-primary mt-1 w-full">
                      {saveProductMutation.isPending ? "Guardando..." : "Guardar producto"}
                    </button>
                  </form>
                </article>
              ) : (
                <article className="argon-card rounded-[1.2rem] p-4 shadow-[0_16px_28px_-20px_rgba(0,0,0,0.55)] md:p-6 md:shadow-none">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Selecciona &quot;Nuevo producto&quot; o &quot;Editar&quot; para abrir el editor.
                  </p>
                </article>
              )}
            </section>
          ) : null}

          {activeSection === "comentarios" ? (
            <section className="grid gap-5 2xl:grid-cols-[1fr_420px]">
              <article className="argon-card rounded-[1.2rem] p-4 shadow-[0_16px_28px_-20px_rgba(0,0,0,0.55)] md:p-6 md:shadow-none">
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
                    value={testimonialSearch}
                    onChange={(event) => setTestimonialSearch(event.target.value)}
                  />
                </div>
                <div className="space-y-2.5">
                  {filteredTestimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4"
                    >
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
                          onClick={() => setTestimonialForm(testimonial)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="text-sm text-rose-300 underline underline-offset-4"
                          onClick={() => removeTestimonialMutation.mutate(testimonial.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
              <article className="argon-card rounded-[1.2rem] p-4 shadow-[0_16px_28px_-20px_rgba(0,0,0,0.55)] md:p-6 md:shadow-none">
                <div className="mb-4 border-b border-[var(--color-border)] pb-3">
                  <h3 className="text-lg font-semibold">
                    {testimonialForm.id ? "Editar comentario" : "Nuevo comentario"}
                  </h3>
                </div>
                <form
                  className="space-y-4"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    await saveTestimonialMutation.mutateAsync({
                      ...testimonialForm,
                      id: testimonialForm.id || `test-${Date.now()}`,
                    });
                    setTestimonialForm(emptyTestimonial);
                  }}
                >
                  <label className="argon-label">
                    Musico o cliente
                    <input
                      className="argon-input"
                      value={testimonialForm.musicianName}
                      onChange={(event) =>
                        setTestimonialForm((prev) => ({ ...prev, musicianName: event.target.value }))
                      }
                      required
                    />
                  </label>
                  <label className="argon-label">
                    Rol
                    <input
                      className="argon-input"
                      value={testimonialForm.role}
                      onChange={(event) => setTestimonialForm((prev) => ({ ...prev, role: event.target.value }))}
                      required
                    />
                  </label>
                  <label className="argon-label">
                    Comentario
                    <textarea
                      className="argon-input min-h-28"
                      value={testimonialForm.quote}
                      onChange={(event) => setTestimonialForm((prev) => ({ ...prev, quote: event.target.value }))}
                      required
                    />
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                    <input
                      type="checkbox"
                      checked={testimonialForm.featured}
                      onChange={(event) =>
                        setTestimonialForm((prev) => ({ ...prev, featured: event.target.checked }))
                      }
                    />
                    Mostrar como destacado
                  </label>
                  <button type="submit" className="argon-button-primary w-full">
                    {saveTestimonialMutation.isPending ? "Guardando..." : "Guardar comentario"}
                  </button>
                </form>
              </article>
            </section>
          ) : null}
          </div>
        </section>
      </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[color-mix(in_srgb,var(--color-border)_70%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_90%,transparent)] px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-2 py-1.5">
          {navItems.map((item) => (
            <button
              key={`bottom-${item.id}`}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`min-w-0 flex-1 rounded-xl px-1 py-2 text-center text-[10px] font-medium ${
                activeSection === item.id
                  ? "bg-[var(--color-surface)] text-[var(--color-accent-red)]"
                  : "text-[var(--color-text-muted)]"
              }`}
            >
              <span className="block truncate">{item.icon}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
