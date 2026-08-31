"use client";

import React from "react";
import { PlusCircle, Search } from "lucide-react";
import { SuperAdminProvider, useSuperAdmin } from "../context/SuperAdminContext";
import LoginView from "../components/LoginView";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import InquiriesTab from "../components/InquiriesTab";
import ParivarsTab from "../components/ParivarsTab";
import PricingTab from "../components/PricingTab";
import CreateParivarModal from "../components/CreateParivarModal";
import EditParivarModal from "../components/EditParivarModal";

// Reusable branded button
function PrimaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1340] hover:bg-[#0d1855] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
    >
      {children}
    </button>
  );
}

function DashboardLayout() {
  const {
    isAuthenticated, isInitializing, activeTab,
    setIsCreateModalOpen,
    inquirySearch, setInquirySearch,
    parivarSearch, setParivarSearch,
  } = useSuperAdmin();

  if (isInitializing) {
    return <div className="h-screen w-full bg-[#F4F7FF]" />;
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const tabMeta: Record<string, { title: string; subtitle: string }> = {
    parivars: { title: "All Parivars (Tenants)", subtitle: "Manage isolated community databases, admins, and status" },
    inquiries: { title: "User Inquiries", subtitle: "Landing page visitor requests and contact inquiries" },
    pricing: { title: "Pricing & Offers", subtitle: "Manage the dynamic pricing plans shown on parivar.me" },
  };
  const meta = tabMeta[activeTab] ?? { title: "", subtitle: "" };

  return (
    <div className="h-screen w-full bg-[#F4F7FF] text-slate-800 flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />

        {/* Page top bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <h1 className="text-base font-extrabold text-slate-900">{meta.title}</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">{meta.subtitle}</p>
          </div>

          <div className="flex items-center gap-2.5">
            {(activeTab === "inquiries" || activeTab === "parivars") && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={
                    activeTab === "inquiries"
                      ? "Search inquiries..."
                      : "Search parivar name, admin..."
                  }
                  value={activeTab === "inquiries" ? inquirySearch : parivarSearch}
                  onChange={(e) =>
                    activeTab === "inquiries"
                      ? setInquirySearch(e.target.value)
                      : setParivarSearch(e.target.value)
                  }
                  className="w-56 sm:w-72 pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20 focus:border-[#0B1340]/40"
                />
              </div>
            )}

            {activeTab === "parivars" && (
              <PrimaryButton onClick={() => setIsCreateModalOpen(true)}>
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Parivar</span>
              </PrimaryButton>
            )}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "inquiries" && <InquiriesTab />}
          {activeTab === "parivars" && <ParivarsTab />}
          {activeTab === "pricing" && <PricingTab />}
        </main>

        <CreateParivarModal />
        <EditParivarModal />
      </div>
    </div>
  );
}

import { Suspense } from "react";

export default function SuperAdminPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-[#F4F7FF] text-sm text-slate-500">Loading...</div>}>
      <SuperAdminProvider>
        <DashboardLayout />
      </SuperAdminProvider>
    </Suspense>
  );
}
