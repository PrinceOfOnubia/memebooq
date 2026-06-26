import { SettingsClient } from "@/components/profile/SettingsClient";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const metadata = { title: "Settings — Memebooq" };

export default function SettingsPage() {
  return (
    <ProtectedRoute mode="wallet">
      <SettingsClient />
    </ProtectedRoute>
  );
}
