"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function logout() {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Unable to sign out");
      router.refresh();
    } finally { setLoading(false); }
  }
  return <button type="button" className="text-sm font-semibold underline disabled:opacity-50" onClick={logout} disabled={loading}>{loading ? "Signing out…" : "Sign out"}</button>;
}
