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

function DashboardLayout() {
  const { isAuthenticated, isInitializing, activeTab, setIsCreateModalOpen, inquirySearch, setInquirySearch, parivarSearch, setParivarSearch } = useSuperAdmin();

  if (isInitializing) {
    return <div className="h-screen w-full bg-[#F4F7FF]"></div>;
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="h-screen w-full bg-[#F4F7FF] text-slate-800 flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {activeTab === "parivars" && "All Parivars (Tenants)"}
                {activeTab === "inquiries" && "User Inquiries"}
                {activeTab === "pricing" && "Landing Page Pricing plans"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeTab === "parivars" && "Manage all isolated community databases, admins, and status"}
                {activeTab === "inquiries" && "Landing page visitor requests and contact inquiries"}
                {activeTab === "pricing" && "Manage the dynamic pricing plans shown on parivar.me"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {activeTab === "inquiries" && (
                <div className="relative w-64 sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search inquiries by Parivar name, phone, email..."
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                  />
                </div>
              )}
              {activeTab === "parivars" && (
                <div className="relative w-64 sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search parivar name, slug, admin..."
                    value={parivarSearch}
                    onChange={(e) => setParivarSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                  />
                </div>
              )}
              {activeTab === "parivars" && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1340] hover:bg-[#070D2B] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm hover:shadow-md hover:shadow-[#0B1340]/25 active:scale-98"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Add Parivar</span>
                </button>
              )}
            </div>
          </div>

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
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-[#F4F7FF]">Loading...</div>}>
      <SuperAdminProvider>
        <DashboardLayout />
      </SuperAdminProvider>
    </Suspense>
  );
}
