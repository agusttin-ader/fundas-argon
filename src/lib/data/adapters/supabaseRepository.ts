import type { AppRepository } from "@/lib/data/contracts/repositories";

const notReady = async () => {
  throw new Error(
    "Supabase adapter is scaffolded but not implemented yet. Configure env vars and implement queries.",
  );
};

export const supabaseRepository: AppRepository = {
  products: {
    list: notReady,
    upsert: notReady,
    remove: notReady,
  },
  testimonials: {
    list: notReady,
    upsert: notReady,
    remove: notReady,
  },
  customizationRequests: {
    list: notReady,
    create: notReady,
    updateStatus: notReady,
  },
  orders: {
    list: notReady,
    get: notReady,
    upsert: notReady,
    remove: notReady,
    updateStatus: notReady,
  },
  customers: {
    list: notReady,
    get: notReady,
    upsert: notReady,
    remove: notReady,
    addNote: notReady,
    removeNote: notReady,
  },
};
