import type { AppRepository } from "@/lib/data/contracts/repositories";
import { firestoreRepository } from "@/lib/data/adapters/firestoreRepository";
import { mockRepository } from "@/lib/data/adapters/mockRepository";
import { supabaseRepository } from "@/lib/data/adapters/supabaseRepository";

type DataAdapter = "mock" | "firestore" | "supabase";
const adapter = process.env.NEXT_PUBLIC_DATA_ADAPTER ?? "mock";

const adapters: Record<DataAdapter, AppRepository> = {
  mock: mockRepository,
  firestore: firestoreRepository,
  supabase: supabaseRepository,
};

const isKnownAdapter = (value: string): value is DataAdapter =>
  value === "mock" || value === "firestore" || value === "supabase";

if (!isKnownAdapter(adapter)) {
  throw new Error(
    `Unknown NEXT_PUBLIC_DATA_ADAPTER "${adapter}". Use "mock", "firestore", or "supabase".`,
  );
}

export const appRepository: AppRepository = adapters[adapter];
