"use client";

import React from "react";
import { LogOut, Shield } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

export default function Header() {
  const { activeTab, handleLogout } = useSuperAdmin();

  const tabLabels: Record<string, string> = {
    parivars: "All Parivars",
    inquiries: "User Inquiries",
    pricing: "Pricing & Offers",
    tasks: "Project Tasks & Hours",
  };

  return (
    <header className="bg-white border-b border-slate-300 h-16 px-7 flex items-center justify-between shrink-0 z-20">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
        <Shield className="w-4 h-4 text-[#0B1340]" />
        <span className="text-[#0B1340] font-bold">Super Admin</span>
        <span className="text-slate-400">/</span>
        <span className="text-slate-900 font-bold">{tabLabels[activeTab] ?? activeTab}</span>
      </div>

      {/* Right: user + logout */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-sm text-slate-800 font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span>superadmin@parivar.me</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-sm font-semibold transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
