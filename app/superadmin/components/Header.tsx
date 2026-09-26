"use client";

import React from "react";
import { LogOut, Shield } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

export default function Header() {
  const { activeTab, handleLogout } = useSuperAdmin();

  const tabLabels: Record<string, string> = {
    parivars: "All Parivars (Tenants)",
    inquiries: "User Inquiries",
    pricing: "Pricing & Offers",
    tasks: "Project Tasks & Hours",
  };

  return (
    <header className="bg-white border-b border-slate-300 h-14 px-6 flex items-center justify-between shrink-0 z-20">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
        <Shield className="w-4 h-4 text-[#0B1340]" />
        <span className="text-[#0B1340] font-bold">Super Admin</span>
        <span className="text-slate-400">/</span>
        <span className="text-slate-800 font-semibold">{tabLabels[activeTab] ?? activeTab}</span>
      </div>

      {/* Right: user + logout */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-100 border border-slate-300 text-xs text-slate-800 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span>superadmin@parivar.me</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-semibold transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
