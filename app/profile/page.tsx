import { UserProfileClient } from "@/components/profile/UserProfileClient";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const metadata = { title: "Profile — Shillcoins" };

export default function ProfilePage() {
  return (
    <ProtectedRoute mode="wallet">
      <UserProfileClient />
    </ProtectedRoute>
  );
}
