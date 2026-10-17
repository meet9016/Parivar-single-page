"use client";

import React, { useState, useMemo } from "react";
import { PlusCircle, RefreshCw, CheckCircle, AlertCircle, User, IndianRupee, Clock, Calendar, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";
import CustomSelect from "./CustomSelect";

const toDateInputValue = (val: any): string => {
  if (!val) return "";
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
    return val;
  }
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dt = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dt}`;
};

const getTodayStr = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const calculateExpiryFromPlan = (start: string, plan: string): string => {
  if (!start || !plan || plan === "Lifetime") return "";
  try {
    const parts = start.split("-");
    if (parts.length !== 3) return "";
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return "";

    const d = new Date(year, month, day);
    if (isNaN(d.getTime())) return "";

    const clean = plan.toLowerCase();
    if (clean.includes("1 month")) d.setMonth(d.getMonth() + 1);
    else if (clean.includes("3 month")) d.setMonth(d.getMonth() + 3);
    else if (clean.includes("6 month")) d.setMonth(d.getMonth() + 6);
    else if (clean.includes("1 year")) d.setFullYear(d.getFullYear() + 1);
    else if (clean.includes("2 year")) d.setFullYear(d.getFullYear() + 2);
    else if (clean.includes("3 year")) d.setFullYear(d.getFullYear() + 3);
    else d.setFullYear(d.getFullYear() + 1);

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dt = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dt}`;
  } catch {
    return "";
  }
};

export default function CreateParivarModal() {
  const { isCreateModalOpen, setIsCreateModalOpen, createLoading, createStatus, handleCreateParivar } = useSuperAdmin();

  const todayStr = getTodayStr();

  const [newParivar, setNewParivar] = useState({
    parivar_name: "",
    admin_first_name: "",
    admin_mobile: "",
    admin_email: "",
    city: "",
    subscription_plan_time: "1 Year",
    subscription_start_date: todayStr,
    subscription_expiry_date: calculateExpiryFromPlan(todayStr, "1 Year"),
    project_amount: "",
    free_customization_hours: "15",
    extra_hourly_rate: "1000",
    notes: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const expiryPreview = useMemo(() => {
    if (newParivar.subscription_plan_time === "Lifetime") {
      return {
        formatted: "Never Expires",
        label: "Lifetime Access",
        status: "lifetime",
      };
    }

    if (!newParivar.subscription_expiry_date) {
      return {
        formatted: "No Expiry Date Set",
        label: "Active",
        status: "active",
      };
    }

    const exp = new Date(newParivar.subscription_expiry_date);
    if (isNaN(exp.getTime())) {
      return {
        formatted: "Invalid Date",
        label: "Select valid date",
        status: "expired",
      };
    }

    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const expMidnight = new Date(exp.getFullYear(), exp.getMonth(), exp.getDate());
    const diffDays = Math.round((expMidnight.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24));

    const formatted = exp.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    if (diffDays < 0) {
      const overdue = Math.abs(diffDays);
      return {
        formatted,
        label: overdue === 0 ? "Expired today" : `Expired ${overdue} days ago`,
        status: "expired",
      };
    } else if (diffDays <= 30) {
      return {
        formatted,
        label: diffDays === 0 ? "Expires today!" : `Expiring soon (${diffDays}d left)`,
        status: "expiring_soon",
      };
    } else {
      return {
        formatted,
        label: `Active (${diffDays} days remaining)`,
        status: "active",
      };
    }
  }, [newParivar.subscription_expiry_date, newParivar.subscription_plan_time]);

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
                onChange={(val) => {
                  setNewParivar((prev) => ({
                    ...prev,
                    subscription_plan_time: val,
                    subscription_expiry_date:
                      val === "Lifetime"
                        ? ""
                        : val === "Custom"
                        ? prev.subscription_expiry_date
                        : calculateExpiryFromPlan(prev.subscription_start_date, val),
                  }));
                }}
                options={[
                  "1 Month",
                  "3 Months",
                  "6 Months",
                  "1 Year",
                  "2 Years",
                  "3 Years",
                  "Custom",
                  "Lifetime",
                ]}
              />
            </div>
          </div>

          {/* Subscription Start Date & Plan Expiry Date (Manually Editable) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#413afb]" />
                Subscription Dates & Validity Control
              </span>
              {newParivar.subscription_plan_time !== "Lifetime" && (
                <button
                  type="button"
                  onClick={() => {
                    const autoExp = calculateExpiryFromPlan(
                      newParivar.subscription_start_date,
                      newParivar.subscription_plan_time
                    );
                    setNewParivar((prev) => ({ ...prev, subscription_expiry_date: autoExp }));
                  }}
                  className="text-[11px] font-semibold text-[#413afb] hover:underline flex items-center gap-1 cursor-pointer"
                  title="Auto-calculate expiry date from plan duration"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Auto-Calculate</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Start Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Subscription Start Date</span>
                  <span className="text-[10px] text-[#413afb] font-medium">Editable</span>
                </label>
                <input
                  type="date"
                  value={newParivar.subscription_start_date || ""}
                  onClick={(e) => {
                    try {
                      (e.target as any).showPicker?.();
                    } catch {}
                  }}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setNewParivar((prev) => ({
                      ...prev,
                      subscription_start_date: newStart,
                      subscription_expiry_date:
                        newStart && prev.subscription_plan_time !== "Custom" && prev.subscription_plan_time !== "Lifetime"
                          ? calculateExpiryFromPlan(newStart, prev.subscription_plan_time)
                          : prev.subscription_expiry_date,
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#413afb] focus:ring-2 focus:ring-[#413afb]/15 transition-all cursor-pointer"
                />
              </div>

              {/* Expiry Date (Manually Editable) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Plan Expiry Date</span>
                  <span className="text-[10px] text-[#413afb] font-medium">Editable</span>
                </label>
                {newParivar.subscription_plan_time === "Lifetime" ? (
                  <div className="px-3 py-2 rounded-xl bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Lifetime Access</span>
                  </div>
                ) : (
                  <input
                    type="date"
                    value={newParivar.subscription_expiry_date || ""}
                    onClick={(e) => {
                      try {
                        (e.target as any).showPicker?.();
                      } catch {}
                    }}
                    onChange={(e) => {
                      setNewParivar((prev) => ({
                        ...prev,
                        subscription_expiry_date: e.target.value,
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#413afb] focus:ring-2 focus:ring-[#413afb]/15 transition-all cursor-pointer"
                  />
                )}
              </div>
            </div>

            {/* Calculated Expiry Live Preview */}
            <div
              className={`p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between border gap-2 ${
                expiryPreview.status === "expired"
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : expiryPreview.status === "expiring_soon"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : expiryPreview.status === "lifetime"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                {expiryPreview.status === "expired" ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                ) : expiryPreview.status === "expiring_soon" ? (
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                ) : expiryPreview.status === "lifetime" ? (
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span className="truncate">
                  Calculated Target: <strong>{expiryPreview.formatted}</strong>
                </span>
              </div>
              <span className="shrink-0 text-[11px] font-bold">
                {expiryPreview.label}
              </span>
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
