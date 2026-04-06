import type { AppRepository } from "@/lib/data/contracts/repositories";

const notReady = async () => {
  throw new Error("Firestore adapter is not enabled in demo mode.");
};

export const firestoreRepository: AppRepository = {
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
};
