"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button className="text-sm text-white/50 transition hover:text-white disabled:opacity-50"
      disabled={loading} onClick={logout} type="button">
      {loading ? "Signing out..." : "Log out"}
    </button>
  );
}
