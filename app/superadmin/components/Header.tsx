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
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 px-6 flex items-center justify-between shrink-0 z-20 sticky top-0">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-3 text-sm font-medium">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50">
          <Shield className="w-4.5 h-4.5" />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-slate-900 font-bold tracking-tight text-[15px]">Super Admin</span>
          {/* <span className="text-slate-300 font-light text-lg leading-none">/</span>
          <span className="text-blue-600 font-semibold bg-blue-50/50 px-2.5 py-1 rounded-md border border-blue-100/50 text-xs tracking-wide">{tabLabels[activeTab] ?? activeTab}</span> */}
        </div>
      </div>

      {/* Right: user + logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-slate-700 font-bold tracking-wide">superadmin@parivar.me</span>
        </div>

        <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all duration-200 cursor-pointer"
        >
          <span className="text-sm font-bold hidden sm:block">Logout</span>
          <LogOut className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </header>
  );
}
