import { CreateClient } from "@/components/create/CreateClient";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const metadata = { title: "Create a challenge — Shillcoins" };

export default function CreatePage() {
  return (
    <ProtectedRoute mode="wallet">
      <CreateClient />
    </ProtectedRoute>
  );
}
