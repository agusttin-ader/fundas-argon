"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { firebaseAuth, firebaseEnabled } from "@/lib/firebase/client";
import type { EmployeeUser } from "@/types/domain";

interface AuthContextValue {
  user: EmployeeUser | null;
  loading: boolean;
  firebaseEnabled: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (displayName: string, email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const MOCK_ADMIN: EmployeeUser = {
  id: "mock-admin",
  email: "staff@fundasargon.demo",
  displayName: "Equipo Argon",
  role: "admin",
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<EmployeeUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    if (!firebaseEnabled || !firebaseAuth) {
      const hasMockSession = window.localStorage.getItem("argon_mock_auth") === "1";
      return hasMockSession ? MOCK_ADMIN : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(() => (firebaseEnabled && firebaseAuth ? true : false));

  useEffect(() => {
    if (!firebaseEnabled || !firebaseAuth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser({
        id: nextUser.uid,
        email: nextUser.email ?? "",
        displayName: nextUser.displayName ?? "Empleado Argon",
        role: "staff",
      });
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!firebaseEnabled || !firebaseAuth) {
      window.localStorage.setItem("argon_mock_auth", "1");
      setUser({
        ...MOCK_ADMIN,
        email,
      });
      return;
    }
    await signInWithEmailAndPassword(firebaseAuth, email, password);
  }, []);

  const signUp = useCallback(async (displayName: string, email: string, password: string) => {
    if (!firebaseEnabled || !firebaseAuth) {
      window.localStorage.setItem("argon_mock_auth", "1");
      setUser({
        ...MOCK_ADMIN,
        displayName,
        email,
      });
      return;
    }
    const credentials = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    if (credentials.user) {
      await updateProfile(credentials.user, {
        displayName,
      });
    }
  }, []);

  const logOut = useCallback(async () => {
    if (!firebaseEnabled || !firebaseAuth) {
      window.localStorage.removeItem("argon_mock_auth");
      setUser(null);
      return;
    }
    await signOut(firebaseAuth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      logOut,
      firebaseEnabled,
    }),
    [loading, logOut, signIn, signUp, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
