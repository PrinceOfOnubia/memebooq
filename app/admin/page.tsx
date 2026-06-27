import { AdminClient } from "@/components/admin/AdminClient";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const metadata = { title: "Admin — Shillcoins" };

export default function AdminPage() {
  return (
    <ProtectedRoute mode="admin">
      <AdminClient />
    </ProtectedRoute>
  );
}
