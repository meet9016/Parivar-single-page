"use client";

import React, { useState } from "react";
import { PlusCircle, RefreshCw, CheckCircle, AlertCircle, Building2 } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

export default function CreateParivarModal() {
  const { isCreateModalOpen, setIsCreateModalOpen, createLoading, createStatus, handleCreateParivar } = useSuperAdmin();

  const [newParivar, setNewParivar] = useState({
    community_type: "Parivar",
    parivar_name: "",
    admin_first_name: "",
    admin_last_name: "",
    admin_email: "",
    admin_mobile: "",
    notes: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!newParivar.parivar_name.trim()) newErrors.parivar_name = `${newParivar.community_type} Name is required.`;
    if (!newParivar.admin_first_name.trim()) newErrors.admin_first_name = "Admin First Name is required.";
    
    if (newParivar.admin_mobile.trim() && !/^\d{10}$/.test(newParivar.admin_mobile.trim())) {
      newErrors.admin_mobile = "Mobile Number must be 10 digits.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    
    const payload = {
      ...newParivar,
      ...(newParivar.community_type === 'Village' 
        ? { village_name: newParivar.parivar_name, parivar_name: newParivar.parivar_name } 
        : {})
    };

    handleCreateParivar(e, payload, setNewParivar);
  };

  if (!isCreateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070D2B]/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl relative space-y-4 border border-slate-100">
        <button 
          onClick={() => setIsCreateModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="border-b border-slate-100 pb-3 space-y-0.5">
          <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Community Management</span>
          </div>
          <h3 className="text-lg font-black text-[#0B1340]">
            Add New Parivar / Community
          </h3>
          <p className="text-xs text-slate-500">
            Add community profile and admin contact details.
          </p>
        </div>

        <form onSubmit={validateAndSubmit} noValidate className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Community Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={newParivar.community_type}
                onChange={(e) => {
                  const type = e.target.value;
                  setNewParivar({
                    ...newParivar,
                    community_type: type,
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none cursor-pointer"
              >
                <option value="Parivar">Parivar</option>
                <option value="Village">Village</option>
                <option value="Trust">Trust</option>
                <option value="Samaj">Samaj</option>
                <option value="Mandal">Mandal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {newParivar.community_type} Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder={newParivar.community_type === 'Village' ? "e.g. Dharmaj" : "e.g. Patel Parivar"}
                value={newParivar.parivar_name}
                onChange={(e) => setNewParivar({ ...newParivar, parivar_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
              />
              {errors.parivar_name && <p className="text-[11px] text-rose-500 mt-0.5 font-semibold">{errors.parivar_name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh"
                value={newParivar.admin_first_name}
                onChange={(e) => setNewParivar({ ...newParivar, admin_first_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
              />
              {errors.admin_first_name && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.admin_first_name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Last Name
              </label>
              <input
                type="text"
                placeholder="e.g. Patel"
                value={newParivar.admin_last_name}
                onChange={(e) => setNewParivar({ ...newParivar, admin_last_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                placeholder="admin@patel.com"
                value={newParivar.admin_email}
                onChange={(e) => setNewParivar({ ...newParivar, admin_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Mobile
              </label>
              <input
                type="tel"
                placeholder="9876543210"
                maxLength={10}
                value={newParivar.admin_mobile}
                onChange={(e) => setNewParivar({ ...newParivar, admin_mobile: e.target.value.replace(/\D/g, '') })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
              />
              {errors.admin_mobile && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.admin_mobile}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notes / Description (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Registered via website inquiry"
              value={newParivar.notes}
              onChange={(e) => setNewParivar({ ...newParivar, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
            />
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
              <span>{createLoading ? "Saving..." : "Add Parivar"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
