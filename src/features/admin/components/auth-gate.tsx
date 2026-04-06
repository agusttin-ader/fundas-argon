"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/auth-context";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading, signIn, signUp, firebaseEnabled } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center p-6">
        <p className="text-sm text-[var(--color-text-muted)]">Cargando acceso...</p>
      </main>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center p-6">
      <section className="grid w-full max-w-4xl gap-4 md:grid-cols-[1.05fr_0.95fr]">
        <article className="argon-panel argon-stitch relative overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(140deg,transparent_0%,color-mix(in_srgb,var(--color-accent-red)_10%,transparent)_55%,transparent_100%)]" />
          <div className="relative z-10 space-y-4 text-center">
            <div className="flex justify-center py-2 md:py-3">
              <Image
                src="/images/logo.png"
                alt="Fundas Argon"
                width={520}
                height={180}
                className="h-28 w-auto max-w-full object-contain md:h-32"
                priority
              />
            </div>
            <h1 className="text-xl font-semibold leading-tight">
              {isSignUp ? "Crear usuario de empleado" : "Ingreso de administracion"}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Gestiona productos, comentarios y solicitudes de personalizacion en un solo lugar.
            </p>
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-muted)]">
              {firebaseEnabled
                ? "Acceso conectado con Firebase Auth."
                : "Modo demo activo: puedes ingresar con cualquier email y clave."}
            </div>
          </div>
        </article>

        <article className="argon-card flex flex-col justify-center p-6 md:p-8">
          <div className="mx-auto w-full max-w-md space-y-5">
            <form
              className="space-y-4"
              onSubmit={async (event) => {
                event.preventDefault();
                setError("");
                setSubmitting(true);
                try {
                  if (isSignUp) {
                    await signUp(displayName || "Equipo Argon", email, password);
                  } else {
                    await signIn(email, password);
                  }
                } catch (submissionError) {
                  setError(
                    submissionError instanceof Error
                      ? submissionError.message
                      : "No se pudo completar la autenticacion.",
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {isSignUp ? (
                <label className="argon-label">
                  Nombre del empleado
                  <input
                    className="argon-input"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Ej. Ana Ventas"
                  />
                </label>
              ) : null}
              <label className="argon-label">
                Email
                <input
                  className="argon-input"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="empleado@fundasargon.com"
                  type="email"
                />
              </label>
              <label className="argon-label">
                Clave
                <input
                  className="argon-input"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="********"
                  type="password"
                />
              </label>
              {error ? <p className="text-sm text-[var(--color-accent-red)]">{error}</p> : null}
              <button type="submit" className="argon-button-primary w-full" disabled={submitting}>
                {submitting ? "Procesando..." : isSignUp ? "Crear usuario" : "Ingresar"}
              </button>
            </form>

            <button
              type="button"
              className="w-full text-sm text-[var(--color-text-muted)] underline underline-offset-4"
              onClick={() => setIsSignUp((value) => !value)}
            >
              {isSignUp ? "Ya tengo usuario" : "Crear nuevo usuario de empleado"}
            </button>
            <Link href="/" className="argon-button-secondary inline-flex w-full justify-center no-underline">
              Volver a la web publica
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
