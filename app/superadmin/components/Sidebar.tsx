"use client";

import React from "react";
import { Shield, Building2, MessageSquare } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

export default function Sidebar() {
  const { activeTab, setActiveTab, parivars, inquiries } = useSuperAdmin();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-full shadow-xs z-30">
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black shrink-0 shadow-2xs">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-extrabold tracking-tight text-slate-900 leading-none">Parivar Super Admin</h1>
          <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-1 block">Master SaaS Panel</span>
        </div>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2.5">
            Main Menu
          </p>
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("parivars")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "parivars"
                  ? "bg-[#0B1340] text-white shadow-sm shadow-[#0B1340]/25"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className={`w-4 h-4 ${activeTab === "parivars" ? "text-white" : "text-blue-600"}`} />
                <span>All Parivars</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                activeTab === "parivars" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {parivars.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("inquiries")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "inquiries"
                  ? "bg-[#0B1340] text-white shadow-sm shadow-[#0B1340]/25"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className={`w-4 h-4 ${activeTab === "inquiries" ? "text-white" : "text-blue-600"}`} />
                <span>User Inquiries</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                activeTab === "inquiries" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {inquiries.length}
              </span>
            </button>
          </nav>
        </div>

        <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3.5 space-y-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            SaaS Overview
          </p>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-2xs">
              <span className="text-base font-black text-slate-900 block">{parivars.length}</span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Tenants</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-2xs">
              <span className="text-base font-black text-indigo-600 block">{inquiries.length}</span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Inquiries</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 text-center">
        <span className="text-[11px] font-semibold text-slate-400">Parivar SaaS v2.4</span>
      </div>
    </aside>
  );
}
