"use client";

import React from "react";
import { Building2, MessageSquare, Tag } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

const NAV = [
  { id: "parivars", label: "All Parivars", Icon: Building2, countKey: "parivars" },
  { id: "inquiries", label: "User Inquiries", Icon: MessageSquare, countKey: "inquiries" },
  { id: "pricing", label: "Pricing & Offers", Icon: Tag, countKey: "pricingPlans" },
] as const;

export default function Sidebar() {
  const { activeTab, setActiveTab, parivars, inquiries, pricingPlans, projectTasks } = useSuperAdmin();

  const countMap: Record<string, number> = {
    parivars: parivars.length,
    inquiries: inquiries.length,
    pricingPlans: pricingPlans.length,
    tasks: projectTasks.length,
  };

  return (
    <aside className="w-56 bg-white flex flex-col shrink-0 h-full z-30 border-r border-slate-200">
      {/* Logo */}
      <div className="h-16 px-4 flex items-center border-b border-slate-100 bg-white">
        <img src="/logo.png" alt="Parivar.me" className="h-8 w-auto object-contain" />
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 mt-2">
       
        {NAV.map(({ id, label, Icon, countKey }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-slate-400"}`} />
                <span>{label}</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                active ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
              }`}>
                {countMap[countKey]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer stats */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white rounded-lg p-2 border border-slate-200 shadow-xs">
            <span className="text-sm font-bold text-blue-600 block">{parivars.length}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tenants</span>
          </div>
          <div className="bg-white rounded-lg p-2 border border-slate-200 shadow-xs">
            <span className="text-sm font-bold text-indigo-600 block">{inquiries.length}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Leads</span>
          </div>
          <div className="bg-white rounded-lg p-2 border border-slate-200 shadow-xs">
            <span className="text-sm font-bold text-emerald-600 block">{projectTasks.length}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tasks</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
