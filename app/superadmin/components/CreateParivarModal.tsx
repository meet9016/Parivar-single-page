"use client";

import React, { useState } from "react";
import { PlusCircle, RefreshCw, CheckCircle, AlertCircle, User, IndianRupee, Clock } from "lucide-react";
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
    free_customization_hours: "15",
    extra_hourly_rate: "1000",
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
      free_customization_hours: Number(newParivar.free_customization_hours) || 15,
      extra_hourly_rate: Number(newParivar.extra_hourly_rate) || 1000,
    };

    handleCreateParivar(e, payload, setNewParivar);
  };

  if (!isCreateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl relative space-y-4 border border-slate-300 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">
            Add Parivar
          </h3>
          <button 
            type="button"
            onClick={() => setIsCreateModalOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={validateAndSubmit} noValidate className="space-y-4">
          {/* Full Name & Parivar Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={newParivar.admin_first_name}
                onChange={(e) => {
                  setNewParivar({ ...newParivar, admin_first_name: e.target.value });
                  if (errors.admin_first_name) setErrors(prev => ({ ...prev, admin_first_name: "" }));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#413afb] focus:ring-2 focus:ring-[#413afb]/15 transition-all"
              />
              {errors.admin_first_name && <p className="text-xs text-rose-600 mt-1 font-semibold">{errors.admin_first_name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Parivar Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter parivar name"
                value={newParivar.parivar_name}
                onChange={(e) => {
                  setNewParivar({ ...newParivar, parivar_name: e.target.value });
                  if (errors.parivar_name) setErrors(prev => ({ ...prev, parivar_name: "" }));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#413afb] focus:ring-2 focus:ring-[#413afb]/15 transition-all"
              />
              {errors.parivar_name && <p className="text-xs text-rose-600 mt-1 font-semibold">{errors.parivar_name}</p>}
            </div>
          </div>

          {/* Number & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Mobile Number <span className="text-rose-600">*</span>
              </label>
              <input
                type="tel"
                placeholder="Enter 10-digit number"
                maxLength={10}
                value={newParivar.admin_mobile}
                onChange={(e) => {
                  setNewParivar({ ...newParivar, admin_mobile: e.target.value.replace(/\D/g, '') });
                  if (errors.admin_mobile) setErrors(prev => ({ ...prev, admin_mobile: "" }));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#413afb] focus:ring-2 focus:ring-[#413afb]/15 transition-all"
              />
              {errors.admin_mobile && <p className="text-xs text-rose-600 mt-1 font-semibold">{errors.admin_mobile}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={newParivar.admin_email}
                onChange={(e) => setNewParivar({ ...newParivar, admin_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#413afb] focus:ring-2 focus:ring-[#413afb]/15 transition-all"
              />
            </div>
          </div>

          {/* City & Plan Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                City
              </label>
              <input
                type="text"
                placeholder="Enter city"
                value={newParivar.city}
                onChange={(e) => setNewParivar({ ...newParivar, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#413afb] focus:ring-2 focus:ring-[#413afb]/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Subscription Plan <span className="text-rose-600">*</span>
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

          {/* Project Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Project Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-600 font-bold text-sm">₹</span>
              <input
                type="number"
                placeholder="e.g. 25000"
                min="0"
                value={newParivar.project_amount}
                onChange={(e) => setNewParivar({ ...newParivar, project_amount: e.target.value })}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#413afb] focus:ring-2 focus:ring-[#413afb]/15 transition-all"
              />
            </div>
          </div>

          {/* Customization Hours & Extra Charges Settings */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#413afb]" />
              <span className="text-xs font-bold text-slate-800">Customization Hours & Billing Rule</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Free Hours (Zero Charge)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="15"
                    min="0"
                    step="0.5"
                    value={newParivar.free_customization_hours}
                    onChange={(e) => setNewParivar({ ...newParivar, free_customization_hours: e.target.value })}
                    className="w-full pr-14 pl-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#413afb] focus:ring-2 focus:ring-[#413afb]/15 transition-all"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-500">Hours</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Extra Hourly Rate (₹ / hr)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-600 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    placeholder="150"
                    min="0"
                    step="50"
                    value={newParivar.extra_hourly_rate}
                    onChange={(e) => setNewParivar({ ...newParivar, extra_hourly_rate: e.target.value })}
                    className="w-full pl-8 pr-12 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#413afb] focus:ring-2 focus:ring-[#413afb]/15 transition-all"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-500">/ hr</span>
                </div>
              </div>
            </div>
          </div>

          {createStatus && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                createStatus.type === "success"
                  ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                  : "bg-rose-50 border border-rose-300 text-rose-800"
              }`}
            >
              {createStatus.type === "success" ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-700" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" />
              )}
              <span>{createStatus.text}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="flex-1 py-2.5 rounded-xl bg-[#413afb] hover:bg-[#322bd9] text-white font-semibold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
              <span>{createLoading ? "Saving..." : "Add Parivar"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
