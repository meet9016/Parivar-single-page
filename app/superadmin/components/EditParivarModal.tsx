"use client";

import React, { useState, useEffect } from "react";
import { useSuperAdmin } from "../context/SuperAdminContext";
import { User, IndianRupee } from "lucide-react";
import CustomSelect from "./CustomSelect";

export default function EditParivarModal() {
  const { editingParivar, setEditingParivar, editLoading, handleEditParivar } = useSuperAdmin();

  const [editForm, setEditForm] = useState({
    parivar_name: "",
    status: 1,
    admin_first_name: "",
    admin_email: "",
    admin_mobile: "",
    city: "",
    subscription_plan_time: "1 Year",
    project_amount: "",
    notes: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingParivar) {
      setEditForm({
        parivar_name: editingParivar.parivar_name || editingParivar.company_name || "",
        status: editingParivar.status ?? 1,
        admin_first_name: editingParivar.admin_first_name || editingParivar.admin?.first_name || "",
        admin_email: editingParivar.admin_email || editingParivar.admin?.email || "",
        admin_mobile: editingParivar.admin_mobile || editingParivar.admin?.mobile || "",
        city: editingParivar.city || "",
        subscription_plan_time: editingParivar.subscription_plan_time || "1 Year",
        project_amount: editingParivar.project_amount !== undefined ? String(editingParivar.project_amount) : "",
        notes: editingParivar.notes || "",
      });
    }
  }, [editingParivar]);

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!editForm.admin_first_name.trim()) newErrors.admin_first_name = "Full Name is required.";
    if (!editForm.parivar_name.trim()) {
      newErrors.parivar_name = "Parivar Name is required.";
    }
    
    if (editForm.admin_mobile.trim() && !/^\d{10}$/.test(editForm.admin_mobile.trim())) {
      newErrors.admin_mobile = "Mobile Number must be 10 digits.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    
    const payload = {
      ...editForm,
      company_name: editForm.parivar_name.trim(),
      project_amount: Number(editForm.project_amount) || 0,
    };

    handleEditParivar(e, payload);
  };

  if (!editingParivar) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-xl p-6 sm:p-7 w-full max-w-lg shadow-2xl relative space-y-4 border border-slate-300 my-8">
        <button 
          onClick={() => setEditingParivar(null)}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer text-base font-bold"
        >
          ✕
        </button>
        
        <div className="border-b border-slate-200 pb-3.5">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-1">
            <User className="w-4 h-4" />
            <span>Update Details</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Edit Customer / Parivar Details
          </h3>
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
                value={editForm.admin_first_name}
                onChange={(e) => {
                  setEditForm({...editForm, admin_first_name: e.target.value});
                  if (errors.admin_first_name) setErrors(prev => ({ ...prev, admin_first_name: "" }));
                }}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B1340] focus:ring-1 focus:ring-[#0B1340]"
              />
              {errors.admin_first_name && <p className="text-xs text-rose-600 mt-1 font-semibold">{errors.admin_first_name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Parivar Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={editForm.parivar_name}
                onChange={(e) => {
                  setEditForm({
                    ...editForm, 
                    parivar_name: e.target.value 
                  });
                  if (errors.parivar_name) setErrors(prev => ({ ...prev, parivar_name: "" }));
                }}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B1340] focus:ring-1 focus:ring-[#0B1340]"
              />
              {errors.parivar_name && <p className="text-xs text-rose-600 mt-1 font-semibold">{errors.parivar_name}</p>}
            </div>
          </div>

          {/* Number & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Number
              </label>
              <input
                type="tel"
                maxLength={10}
                value={editForm.admin_mobile}
                onChange={(e) => {
                  setEditForm({...editForm, admin_mobile: e.target.value.replace(/\D/g, '')});
                  if (errors.admin_mobile) setErrors(prev => ({ ...prev, admin_mobile: "" }));
                }}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B1340] focus:ring-1 focus:ring-[#0B1340]"
              />
              {errors.admin_mobile && <p className="text-xs text-rose-600 mt-1 font-semibold">{errors.admin_mobile}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={editForm.admin_email}
                onChange={(e) => setEditForm({...editForm, admin_email: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B1340] focus:ring-1 focus:ring-[#0B1340]"
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
                value={editForm.city}
                onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B1340] focus:ring-1 focus:ring-[#0B1340]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Plan Time (Subscription) <span className="text-rose-600">*</span>
              </label>
              <CustomSelect
                value={editForm.subscription_plan_time}
                onChange={(val) => setEditForm({ ...editForm, subscription_plan_time: val })}
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

          {/* Project Amount & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                  value={editForm.project_amount}
                  onChange={(e) => setEditForm({ ...editForm, project_amount: e.target.value })}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B1340] focus:ring-1 focus:ring-[#0B1340]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Status</label>
              <CustomSelect
                value={editForm.status}
                onChange={(val) => setEditForm({ ...editForm, status: Number(val) })}
                options={[
                  { value: 1, label: "Active" },
                  { value: 0, label: "Suspended / Inactive" },
                ]}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Notes (Optional)</label>
            <input
              type="text"
              value={editForm.notes}
              onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B1340] focus:ring-1 focus:ring-[#0B1340]"
            />
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setEditingParivar(null)}
              className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editLoading}
              className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white bg-[#0B1340] hover:bg-[#070D2B] shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {editLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
