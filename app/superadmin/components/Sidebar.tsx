"use client";

import React from "react";
import { Building2, MessageSquare, Tag, Briefcase } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

const NAV = [
  { id: "parivars", label: "All Parivars", Icon: Building2, countKey: "parivars" },
  { id: "inquiries", label: "User Inquiries", Icon: MessageSquare, countKey: "inquiries" },
  { id: "pricing", label: "Pricing & Offers", Icon: Tag, countKey: "pricingPlans" },
] as const;

export default function Sidebar() {
  const { activeTab, setActiveTab, parivars, inquiries, pricingPlans } = useSuperAdmin();

  const countMap: Record<string, number> = {
    parivars: parivars.length,
    inquiries: inquiries.length,
    pricingPlans: pricingPlans.length,
  };

  return (
    <aside className="w-64 bg-[#0B1340] flex flex-col shrink-0 h-full z-30 border-r border-slate-800">
      {/* Logo */}
      <div className="h-16 px-5 flex items-center border-b border-white/10 bg-[#070D2B]">
        <img src="/logo.png" alt="Parivar.me" className="h-8 w-auto object-contain brightness-0 invert" />
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-1.5">
        {NAV.map(({ id, label, Icon, countKey }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                active
                  ? "bg-white text-[#0B1340] shadow-sm"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${active ? "text-[#0B1340]" : "text-slate-300"}`} />
                <span className="text-sm">{label}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                active ? "bg-slate-100 text-[#0B1340]" : "bg-white/10 text-white"
              }`}>
                {countMap[countKey]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer stats */}
      <div className="p-3.5 border-t border-white/10 bg-[#070D2B]/60">
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="bg-white/10 rounded-lg p-2 border border-white/5">
            <span className="text-base font-bold text-white block">{parivars.length}</span>
            <span className="text-[11px] font-medium text-slate-300 uppercase tracking-tight">Parivar</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2 border border-white/5">
            <span className="text-base font-bold text-amber-300 block">{inquiries.length}</span>
            <span className="text-[11px] font-medium text-slate-300 uppercase tracking-tight">Inquiries</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2 border border-white/5">
            <span className="text-base font-bold text-emerald-300 block">{pricingPlans.length}</span>
            <span className="text-[11px] font-medium text-slate-300 uppercase tracking-tight">Offers</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
