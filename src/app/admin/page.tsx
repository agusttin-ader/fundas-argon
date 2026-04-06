import { AdminDashboard } from "@/features/admin/components/admin-dashboard";
import { AuthGate } from "@/features/admin/components/auth-gate";

export default function AdminPage() {
  return (
    <AuthGate>
      <AdminDashboard />
    </AuthGate>
  );
}
