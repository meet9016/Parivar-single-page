"use client";

import React from "react";
import { PlusCircle } from "lucide-react";
import { SuperAdminProvider, useSuperAdmin } from "../context/SuperAdminContext";
import LoginView from "../components/LoginView";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import InquiriesTab from "../components/InquiriesTab";
import ParivarsTab from "../components/ParivarsTab";
import CreateParivarModal from "../components/CreateParivarModal";
import EditParivarModal from "../components/EditParivarModal";

function DashboardLayout() {
  const { isAuthenticated, isInitializing, activeTab, setIsCreateModalOpen } = useSuperAdmin();

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
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeTab === "parivars" && "Manage all isolated community databases, admins, and status"}
                {activeTab === "inquiries" && "Landing page visitor requests and contact inquiries"}
              </p>
            </div>

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

          {activeTab === "inquiries" && <InquiriesTab />}
          {activeTab === "parivars" && <ParivarsTab />}
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
