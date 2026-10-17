"use client";

import React from "react";
import { LayoutDashboard, Building2, MessageSquare, Tag, Briefcase } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

const NAV = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard, countKey: null },
  { id: "parivars", label: "All Parivars", Icon: Building2, countKey: "parivars" },
  { id: "inquiries", label: "User Inquiries", Icon: MessageSquare, countKey: "inquiries" },
  { id: "pricing", label: "Pricing & Offers", Icon: Tag, countKey: "pricingPlans" },
  { id: "tasks", label: "Project Tasks", Icon: Briefcase, countKey: "projectTasks" },
] as const;

export default function Sidebar() {
  const { activeTab, setActiveTab, parivars, inquiries, pricingPlans, projectTasks } = useSuperAdmin();

  const countMap: Record<string, number> = {
    parivars: parivars.length,
    inquiries: inquiries.length,
    pricingPlans: pricingPlans.length,
    projectTasks: projectTasks?.length || 0,
  };

  return (
    <aside className="w-64 bg-white text-slate-800 flex flex-col shrink-0 h-full z-30 border-r border-slate-200/90 shadow-[2px_0_12px_-4px_rgba(0,0,0,0.03)]">
      {/* Brand Logo */}
      <div className="h-16 px-5 flex items-center border-b border-slate-100 bg-white">
        <img src="/logo.png" alt="Parivar.me" className="h-8 w-auto object-contain" />
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-2 pb-1">
          Management
        </p>

        {NAV.map(({ id, label, Icon, countKey }) => {
          const active = activeTab === id;
          const count = countKey ? countMap[countKey] ?? 0 : null;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all cursor-pointer group ${
                active
                  ? "bg-[#413afb] text-white shadow-md shadow-[#413afb]/20 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    active ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span className="text-sm font-medium">{label}</span>
              </div>
              {count !== null && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${
                    active
                      ? "bg-white text-blue-700 shadow-2xs"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900 border border-slate-200/60"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Quick Stats */}
      <div className="p-3 m-3 rounded-2xl bg-slate-50/80 border border-slate-200/70">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
          Platform Overview
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="bg-white rounded-lg p-2 border border-slate-200/60 shadow-2xs">
            <span className="text-sm font-bold text-slate-800 block">{parivars.length}</span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Parivars</span>
          </div>
          <div className="bg-white rounded-lg p-2 border border-slate-200/60 shadow-2xs">
            <span className="text-sm font-bold text-amber-600 block">{inquiries.length}</span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Leads</span>
          </div>
          <div className="bg-white rounded-lg p-2 border border-slate-200/60 shadow-2xs">
            <span className="text-sm font-bold text-[#413afb] block">{projectTasks?.length || 0}</span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Tasks</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
