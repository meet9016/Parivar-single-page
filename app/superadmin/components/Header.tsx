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
  };

  return (
    <header className="bg-white border-b border-slate-200/90 h-14 px-6 flex items-center justify-between shrink-0 z-20">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Shield className="w-3.5 h-3.5 text-[#0B1340]" />
        <span className="text-[#0B1340] font-bold">SuperAdmin</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600">{tabLabels[activeTab] ?? activeTab}</span>
      </div>

      {/* Right: user + logout */}
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>superadmin@parivar.me</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
