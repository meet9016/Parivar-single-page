"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

export default function Header() {
  const { activeTab, handleLogout } = useSuperAdmin();

  return (
    <header className="bg-white border-b border-slate-200/90 h-16 px-6 lg:px-8 flex items-center justify-between shrink-0 shadow-2xs z-20">
      <div>
        <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
          {activeTab === "parivars" ? "Communities & Tenant Databases" : "Inquiries & Contact Requests"}
        </h2>
        <p className="text-[11px] text-slate-500 font-medium">
          {activeTab === "parivars" ? "Manage isolated tenant databases & admin credentials" : "Visitor submissions from landing page"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>superadmin@gmail.com</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
