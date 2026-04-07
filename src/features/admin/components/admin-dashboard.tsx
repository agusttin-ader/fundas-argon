"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  emptyProductForm,
  requestStatusOptions,
  type AdminSection,
} from "@/features/admin/admin-constants";
import { AdminDesktop } from "@/features/admin/components/admin-desktop";
import { adminService } from "@/lib/data/services/admin-service";
import { useIsMobileAdmin } from "@/lib/hooks/use-is-mobile-admin";
import type {
  Customer,
  InstrumentCategory,
  Order,
  OrderChannel,
  OrderStatus,
  Product,
  ProductLine,
  Testimonial,
} from "@/types/domain";

const MobileAdminShell = dynamic(
  () =>
    import("@/features/admin/mobile/mobile-admin-shell").then((m) => ({
      default: m.MobileAdminShell,
    })),
  { ssr: false },
);

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const isMobile = useIsMobileAdmin();
  const [activeSection, setActiveSection] = useState<AdminSection>("resumen");
  const [pedidosSubTab, setPedidosSubTab] = useState<"ventas" | "consultas">("ventas");
  const [clientesSubTab, setClientesSubTab] = useState<"crm" | "testimonios">("crm");

  const [productForm, setProductForm] = useState<Product>(emptyProductForm);
  const [productEditorOpen, setProductEditorOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productFilterLine, setProductFilterLine] = useState<ProductLine | "all">("all");
  const [productFilterCategory, setProductFilterCategory] = useState<InstrumentCategory | "all">("all");

  const [testimonialForm, setTestimonialForm] = useState<Testimonial>({
    id: "",
    musicianName: "",
    role: "",
    quote: "",
    featured: false,
    videoUrl: "",
    videoAutoplay: false,
  });
  const [testimonialSearch, setTestimonialSearch] = useState("");

  const [specInput, setSpecInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const [requestSearch, setRequestSearch] = useState("");
  const [requestStatusFilter, setRequestStatusFilter] = useState<
    (typeof requestStatusOptions)[number] | "all"
  >("all");

  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerTagInput, setCustomerTagInput] = useState("");
  const [customerNoteInput, setCustomerNoteInput] = useState("");

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
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => adminService.listOrders(),
  });
  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: () => adminService.listCustomers(),
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
      setTestimonialForm({
        id: "",
        musicianName: "",
        role: "",
        quote: "",
        featured: false,
        videoUrl: "",
        videoAutoplay: false,
      });
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

  const orderStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      adminService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const removeOrderMutation = useMutation({
    mutationFn: (orderId: string) => adminService.removeOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const upsertOrderMutation = useMutation({
    mutationFn: (order: Order) => adminService.upsertOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const upsertCustomerMutation = useMutation({
    mutationFn: (c: Customer) => adminService.upsertCustomer(c),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  const addCustomerNoteMutation = useMutation({
    mutationFn: ({ customerId, text }: { customerId: string; text: string }) =>
      adminService.addCustomerNote(customerId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  const removeCustomerMutation = useMutation({
    mutationFn: (customerId: string) => adminService.removeCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  const quickOrderMutation = useMutation({
    mutationFn: async (payload: {
      channel: OrderChannel;
      summary: string;
      customerName?: string;
      phone?: string;
      email?: string;
    }) => {
      const at = new Date().toISOString();
      let customerId: string | undefined;
      if (payload.customerName?.trim() && payload.phone?.trim()) {
        customerId = `cust-${Date.now()}`;
        await adminService.upsertCustomer({
          id: customerId,
          name: payload.customerName.trim(),
          phone: payload.phone.trim(),
          email: payload.email?.trim() || undefined,
          tags: [],
          notes: [],
        });
      }
      const id = `ord-${Date.now()}`;
      await adminService.upsertOrder({
        id,
        createdAt: at,
        updatedAt: at,
        status: "pending",
        customerId,
        channel: payload.channel,
        summary: payload.summary.trim(),
        lines: [{ label: payload.summary.trim(), quantity: 1 }],
        timeline: [{ at, status: "pending", label: "Pedido creado" }],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  const sortedRequests = useMemo(
    () =>
      [...(requestsQuery.data ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [requestsQuery.data],
  );
  const products = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);
  const testimonials = useMemo(() => testimonialsQuery.data ?? [], [testimonialsQuery.data]);
  const orders = useMemo(() => ordersQuery.data ?? [], [ordersQuery.data]);
  const customers = useMemo(() => customersQuery.data ?? [], [customersQuery.data]);

  const pendingRequests = sortedRequests.filter((request) => request.status === "pendiente").length;
  const contactadosRequests = sortedRequests.filter((request) => request.status === "contactado").length;
  const closedRequests = sortedRequests.filter((request) => request.status === "cerrado").length;
  const featuredProducts = products.filter((product) => product.featured).length;
  const featuredTestimonials = testimonials.filter((testimonial) => testimonial.featured).length;
  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;

  const getCustomer = (id: string) => customers.find((c) => c.id === id);

  const customerOrders = (customerId: string) =>
    orders.filter((o) => o.customerId === customerId);

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

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const q = orderSearch.toLowerCase();
        const cust = order.customerId
          ? customers.find((c) => c.id === order.customerId)
          : undefined;
        const custName = cust?.name ?? "";
        const matchesSearch =
          order.summary.toLowerCase().includes(q) ||
          order.id.toLowerCase().includes(q) ||
          custName.toLowerCase().includes(q);
        const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
        return matchesSearch && matchesStatus;
      }),
    [orderSearch, orderStatusFilter, orders, customers],
  );

  const filteredCustomers = useMemo(
    () =>
      customers.filter((c) => {
        const q = customerSearch.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          (c.email ?? "").toLowerCase().includes(q) ||
          (c.phone ?? "").toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
        );
      }),
    [customerSearch, customers],
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

  const duplicateOrder = async (order: Order) => {
    const at = new Date().toISOString();
    const id = `ord-${Date.now()}`;
    await upsertOrderMutation.mutateAsync({
      ...order,
      id,
      createdAt: at,
      updatedAt: at,
      status: "pending",
      timeline: [{ at, status: "pending", label: "Duplicado" }],
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
    {
      id: "solicitudes",
      label: "Pedidos",
      helper: `${pendingOrdersCount} ventas pend. · ${pendingRequests} consultas`,
      icon: "Pedidos",
    },
    { id: "productos", label: "Productos", helper: `${products.length} activos`, icon: "Productos" },
    {
      id: "comentarios",
      label: "Clientes",
      helper: `${customers.length} CRM · ${testimonials.length} testimonios`,
      icon: "Clientes",
    },
  ];

  const desktopProps = {
    activeSection,
    setActiveSection,
    navItems,
    pedidosSubTab,
    setPedidosSubTab,
    clientesSubTab,
    setClientesSubTab,
    filteredRequests,
    orders,
    filteredOrders,
    customers,
    filteredCustomers,
    customerOrders,
    products,
    filteredProducts,
    testimonials,
    filteredTestimonials,
    pendingRequests,
    contactadosRequests,
    closedRequests,
    pendingOrdersCount,
    featuredProducts,
    featuredTestimonials,
    productForm,
    setProductForm,
    productEditorOpen,
    productEditorRef,
    productSearch,
    setProductSearch,
    productFilterLine,
    setProductFilterLine,
    productFilterCategory,
    setProductFilterCategory,
    testimonialForm,
    setTestimonialForm,
    testimonialSearch,
    setTestimonialSearch,
    customerSearch,
    setCustomerSearch,
    specInput,
    setSpecInput,
    tagInput,
    setTagInput,
    requestSearch,
    setRequestSearch,
    requestStatusFilter,
    setRequestStatusFilter,
    orderSearch,
    setOrderSearch,
    orderStatusFilter,
    setOrderStatusFilter,
    selectedOrderId,
    setSelectedOrderId,
    selectedCustomerId,
    setSelectedCustomerId,
    customerTagInput,
    setCustomerTagInput,
    customerNoteInput,
    setCustomerNoteInput,
    appendProductItem,
    removeProductItem,
    resetProductForm,
    openProductEditor,
    duplicateProduct,
    removeProductMutation,
    saveProductMutation,
    saveTestimonialMutation,
    removeTestimonialMutation,
    statusMutation,
    orderStatusMutation,
    removeOrderMutation,
    upsertCustomerMutation,
    addCustomerNoteMutation,
    removeCustomerMutation,
    getCustomer,
    onCreateQuickOrder: (payload: Parameters<typeof quickOrderMutation.mutateAsync>[0]) =>
      quickOrderMutation.mutateAsync(payload),
    quickOrderPending: quickOrderMutation.isPending,
  };

  const mobileProps = {
    filteredProducts,
    testimonials,
    filteredTestimonials,
    sortedRequests,
    filteredRequests,
    orders,
    filteredOrders,
    customers,
    filteredCustomers,
    pendingRequests,
    pendingOrdersCount,
    featuredProducts,
    featuredTestimonials,
    contactadosRequests,
    closedRequests,
    productsCount: products.length,
    customersCount: customers.length,
    testimonialsCount: testimonials.length,
    productForm,
    setProductForm,
    specInput,
    setSpecInput,
    tagInput,
    setTagInput,
    testimonialForm,
    setTestimonialForm,
    requestSearch,
    setRequestSearch,
    requestStatusFilter,
    setRequestStatusFilter,
    productSearch,
    setProductSearch,
    productFilterLine,
    setProductFilterLine,
    productFilterCategory,
    setProductFilterCategory,
    testimonialSearch,
    setTestimonialSearch,
    customerSearch,
    setCustomerSearch,
    customerTagInput,
    setCustomerTagInput,
    customerNoteInput,
    setCustomerNoteInput,
    appendProductItem,
    removeProductItem,
    resetProductForm,
    saveProductMutation,
    removeProductMutation,
    duplicateProduct,
    saveTestimonialMutation,
    removeTestimonialMutation,
    statusMutation,
    orderStatusMutation,
    removeOrderMutation,
    duplicateOrder,
    upsertCustomerMutation,
    addCustomerNoteMutation,
    removeCustomerMutation,
    getCustomer,
    customerOrders,
    quickOrderMutation,
  };

  if (isMobile === true) {
    return <MobileAdminShell {...mobileProps} />;
  }

  return <AdminDesktop {...desktopProps} />;
}
