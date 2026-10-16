"use client";

import React from "react";
import { Building2, MessageSquare, Tag, Briefcase } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

const NAV = [
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
    <aside className="w-64 bg-[#0B1340] text-white flex flex-col shrink-0 h-full z-30 border-r border-[#070D2B] shadow-lg">
      {/* Brand Logo */}
      <div className="h-16 px-5 flex items-center border-b border-white/10 bg-[#070D2B]">
        <img src="/logo.png" alt="Parivar.me" className="h-8 w-auto object-contain brightness-0 invert" />
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-2 pb-1">
          Management
        </p>

        {NAV.map(({ id, label, Icon, countKey }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer group ${
                active
                  ? "bg-blue-600 text-white shadow-md border border-blue-500"
                  : "text-slate-300 hover:bg-white/10 hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    active ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span className="text-sm font-medium">{label}</span>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${
                  active
                    ? "bg-white text-blue-700 shadow-2xs"
                    : "bg-white/10 text-slate-300 group-hover:bg-white/20 group-hover:text-white border border-white/10"
                }`}
              >
                {countMap[countKey] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer Quick Stats */}
      <div className="p-3 m-3 rounded-xl bg-[#070D2B] border border-white/10">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
          Platform Overview
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="bg-white/10 rounded-lg p-2 border border-white/5 shadow-2xs">
            <span className="text-sm font-bold text-white block">{parivars.length}</span>
            <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-tight">Parivars</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2 border border-white/5 shadow-2xs">
            <span className="text-sm font-bold text-amber-300 block">{inquiries.length}</span>
            <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-tight">Leads</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2 border border-white/5 shadow-2xs">
            <span className="text-sm font-bold text-blue-400 block">{projectTasks?.length || 0}</span>
            <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-tight">Tasks</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
