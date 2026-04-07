import type { Metadata } from "next";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";
import { AuthGate } from "@/features/admin/components/auth-gate";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Panel admin | ${SITE_NAME}`,
  description: "Panel interno de administración de Fundas Argon.",
  alternates: {
    canonical: absoluteUrl("/admin"),
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminPage() {
  return (
    <AuthGate>
      <AdminDashboard />
    </AuthGate>
  );
}
