"use client";

import React from "react";
import { Shield, Building2, MessageSquare, Tag } from "lucide-react";
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
    <aside className="w-60 bg-[#0B1340] flex flex-col shrink-0 h-full z-30">
      {/* Logo */}
      <div className="h-14 px-5 flex items-center border-b border-white/10">
        <img src="/logo.png" alt="Parivar.me" className="h-8 w-auto object-contain brightness-0 invert" />
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-3 pt-2 pb-1.5">
          Main Menu
        </p>
        {NAV.map(({ id, label, Icon, countKey }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                active
                  ? "bg-white text-[#0B1340] shadow-md"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${active ? "text-[#0B1340]" : "text-white/50"}`} />
                <span>{label}</span>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                active ? "bg-[#0B1340]/10 text-[#0B1340]" : "bg-white/10 text-white/60"
              }`}>
                {countMap[countKey]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer stats */}
      <div className="p-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/10 rounded-lg p-2">
            <span className="text-base font-black text-white block">{parivars.length}</span>
            <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider">Tenants</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <span className="text-base font-black text-amber-300 block">{inquiries.length}</span>
            <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider">Leads</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <span className="text-base font-black text-emerald-300 block">{pricingPlans.length}</span>
            <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider">Plans</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
