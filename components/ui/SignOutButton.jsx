"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
    >
      <LogOut size={14} />
      خروج
    </button>
  );
}
