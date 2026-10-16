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
import ProjectTasksTab from "../components/ProjectTasksTab";
import CreateParivarModal from "../components/CreateParivarModal";
import EditParivarModal from "../components/EditParivarModal";

// Reusable branded button
function PrimaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#413afb] hover:bg-[#322bd9] text-white text-sm font-semibold transition-all cursor-pointer shadow-sm hover:shadow active:scale-[0.99]"
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
    return <div className="h-screen w-full bg-[#f8fafc]" />;
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const tabMeta: Record<string, { title: string; subtitle: string }> = {
    parivars: { title: "All Parivars", subtitle: "Manage isolated community databases, admins, and status" },
    inquiries: { title: "User Inquiries", subtitle: "Landing page visitor requests and contact inquiries" },
    pricing: { title: "Pricing & Offers", subtitle: "Live landing page price & discount percentage" },
    tasks: { title: "Project Tasks & Time Tracking", subtitle: "Assign customization tasks, record work hours, and generate Excel reports" },
  };
  const meta = tabMeta[activeTab] ?? { title: "", subtitle: "" };

  return (
    <div className="h-screen w-full bg-[#f8fafc] text-slate-900 flex overflow-hidden font-inter">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />

        {/* Page top bar */}
        <div className="bg-white border-b border-slate-200/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.02)]">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{meta.title}</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">{meta.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            {(activeTab === "inquiries" || activeTab === "parivars") && (
              <div className="relative group">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
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
                  className="w-56 sm:w-80 pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#413afb] focus:ring-4 focus:ring-[#413afb]/10 transition-all duration-200 shadow-sm"
                />
              </div>
            )}

            {activeTab === "parivars" && (
              <PrimaryButton onClick={() => setIsCreateModalOpen(true)}>
                <PlusCircle className="w-4 h-4" />
                <span className="text-sm">Add Parivar</span>
              </PrimaryButton>
            )}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-6 sm:p-7 overflow-y-auto bg-[#f8fafc]">
          {activeTab === "inquiries" && <InquiriesTab />}
          {activeTab === "parivars" && <ParivarsTab />}
          {activeTab === "pricing" && <PricingTab />}
          {activeTab === "tasks" && <ProjectTasksTab />}
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
