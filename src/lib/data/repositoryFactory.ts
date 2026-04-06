import type { AppRepository } from "@/lib/data/contracts/repositories";
import { firestoreRepository } from "@/lib/data/adapters/firestoreRepository";
import { mockRepository } from "@/lib/data/adapters/mockRepository";

const adapter = process.env.NEXT_PUBLIC_DATA_ADAPTER ?? "mock";

export const appRepository: AppRepository =
  adapter === "firestore" ? firestoreRepository : mockRepository;
