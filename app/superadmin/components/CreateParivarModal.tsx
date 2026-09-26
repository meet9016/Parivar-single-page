"use client";

import React, { useState } from "react";
import { PlusCircle, RefreshCw, CheckCircle, AlertCircle, User, IndianRupee } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";
import CustomSelect from "./CustomSelect";

export default function CreateParivarModal() {
  const { isCreateModalOpen, setIsCreateModalOpen, createLoading, createStatus, handleCreateParivar } = useSuperAdmin();

  const [newParivar, setNewParivar] = useState({
    parivar_name: "",
    admin_first_name: "",
    admin_mobile: "",
    admin_email: "",
    city: "",
    subscription_plan_time: "1 Year",
    project_amount: "",
    notes: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!newParivar.admin_first_name.trim()) newErrors.admin_first_name = "Full Name is required.";
    if (!newParivar.parivar_name.trim()) newErrors.parivar_name = "Parivar Name is required.";
    if (!newParivar.admin_mobile.trim()) {
      newErrors.admin_mobile = "Number is required.";
    } else if (!/^\d{10}$/.test(newParivar.admin_mobile.trim())) {
      newErrors.admin_mobile = "Number must be 10 digits.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const payload = {
      ...newParivar,
      community_type: "Parivar",
      company_name: newParivar.parivar_name.trim(),
      project_amount: Number(newParivar.project_amount) || 0,
    };

    handleCreateParivar(e, payload, setNewParivar);
  };

  if (!isCreateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070D2B]/80 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl relative space-y-4 border border-slate-100 my-8">
        <button 
          onClick={() => setIsCreateModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="border-b border-slate-100 pb-3 space-y-0.5">
          <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>Customer Details</span>
          </div>
          <h3 className="text-lg font-black text-[#0B1340]">
            Add Customer / Parivar
          </h3>
        </div>

        <form onSubmit={validateAndSubmit} noValidate className="space-y-3.5">
          {/* Full Name & Parivar Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={newParivar.admin_first_name}
                onChange={(e) => setNewParivar({ ...newParivar, admin_first_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
              />
              {errors.admin_first_name && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.admin_first_name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Parivar Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter parivar name"
                value={newParivar.parivar_name}
                onChange={(e) => setNewParivar({ ...newParivar, parivar_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
              />
              {errors.parivar_name && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.parivar_name}</p>}
            </div>
          </div>

          {/* Number & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Enter 10-digit number"
                maxLength={10}
                value={newParivar.admin_mobile}
                onChange={(e) => setNewParivar({ ...newParivar, admin_mobile: e.target.value.replace(/\D/g, '') })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
              />
              {errors.admin_mobile && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.admin_mobile}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="customer@example.com"
                value={newParivar.admin_email}
                onChange={(e) => setNewParivar({ ...newParivar, admin_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* City & Plan Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City
              </label>
              <input
                type="text"
                placeholder="Enter city"
                value={newParivar.city}
                onChange={(e) => setNewParivar({ ...newParivar, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Plan Time (Subscription) <span className="text-rose-500">*</span>
              </label>
              <CustomSelect
                value={newParivar.subscription_plan_time}
                onChange={(val) => setNewParivar({ ...newParivar, subscription_plan_time: val })}
                options={[
                  "1 Month",
                  "3 Months",
                  "6 Months",
                  "1 Year",
                  "2 Years",
                  "3 Years",
                  "Lifetime",
                ]}
              />
            </div>
          </div>

          {/* Project Amount & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Project Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  placeholder="e.g. 25000"
                  min="0"
                  value={newParivar.project_amount}
                  onChange={(e) => setNewParivar({ ...newParivar, project_amount: e.target.value })}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Direct customer"
                value={newParivar.notes}
                onChange={(e) => setNewParivar({ ...newParivar, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
              />
            </div>
          </div>

          {createStatus && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                createStatus.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  : "bg-rose-50 border border-rose-200 text-rose-700"
              }`}
            >
              {createStatus.type === "success" ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{createStatus.text}</span>
            </div>
          )}

          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="flex-1 py-2.5 rounded-xl bg-[#0B1340] hover:bg-[#070D2B] text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {createLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
              <span>{createLoading ? "Saving..." : "Add Customer"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
