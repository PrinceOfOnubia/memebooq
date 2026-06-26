import { VerifyClient } from "@/components/profile/VerifyClient";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const metadata = { title: "Get verified — Memebooq" };

export default function VerifyPage() {
  return (
    <ProtectedRoute mode="wallet">
      <VerifyClient />
    </ProtectedRoute>
  );
}
