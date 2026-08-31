"use client";

import React, { useState } from "react";
import { PlusCircle, RefreshCw, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
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
    admin_password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!newParivar.parivar_name.trim()) newErrors.parivar_name = `${newParivar.community_type} Name is required.`;
    if (!newParivar.admin_first_name.trim()) newErrors.admin_first_name = "First Name is required.";
    if (!newParivar.admin_email.trim()) {
      newErrors.admin_email = "Email is required.";
    } else if (!newParivar.admin_email.trim().toLowerCase().endsWith("@gmail.com")) {
      newErrors.admin_email = "Only @gmail.com emails are allowed.";
    }

    if (!newParivar.admin_mobile.trim()) {
      newErrors.admin_mobile = "Mobile Number is required.";
    } else if (!/^\d{10}$/.test(newParivar.admin_mobile.trim())) {
      newErrors.admin_mobile = "Mobile Number must be exactly 10 digits.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    
    // Construct the payload based on community type
    const payload = {
      ...newParivar,
      ...(newParivar.community_type === 'Village' 
        ? { village_name: newParivar.parivar_name, parivar_name: undefined } 
        : {})
    };

    handleCreateParivar(e, payload, setNewParivar);
  };

  if (!isCreateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070D2B]/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 sm:p-7 w-full max-w-lg shadow-xl relative space-y-4">
        <button 
          onClick={() => setIsCreateModalOpen(false)}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          ✕
        </button>

        <div className="border-b border-slate-200 pb-3 space-y-0.5">
          <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Multi-Tenant</span>
          </div>
          <h3 className="text-lg font-black text-[#0B1340]">
            Register New Parivar
          </h3>
          <p className="text-xs text-slate-500">
            Creates an isolated database & seeds the community primary admin.
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
                    admin_last_name: type === 'Village' ? '' : newParivar.parivar_name.split(' ')[0]
                  });
                }}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none cursor-pointer"
              >
                <option value="Parivar">Parivar</option>
                <option value="Village">Village</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {newParivar.community_type === 'Village' ? 'Village Name' : 'Parivar Name'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder={newParivar.community_type === 'Village' ? "e.g. Dharmaj" : "e.g. Patel Parivar"}
                value={newParivar.parivar_name}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewParivar({
                    ...newParivar,
                    parivar_name: val,
                    ...(newParivar.community_type === 'Parivar' ? { admin_last_name: val.split(' ')[0] } : {})
                  });
                }}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              />
            </div>
          </div>
          
          <div className="px-1">
            <p className="text-[10px] text-slate-400">
              Database: <span className="font-mono text-blue-600 font-semibold">parivar_{newParivar.parivar_name ? newParivar.parivar_name.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'name'}</span>
            </p>
            {errors.parivar_name && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.parivar_name}</p>}
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
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
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
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="admin@patel.com"
                value={newParivar.admin_email}
                onChange={(e) => setNewParivar({ ...newParivar, admin_email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              />
              {errors.admin_email && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.admin_email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Mobile <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="9876543210"
                maxLength={10}
                value={newParivar.admin_mobile}
                onChange={(e) => setNewParivar({ ...newParivar, admin_mobile: e.target.value.replace(/\D/g, '') })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              />
              {errors.admin_mobile && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.admin_mobile}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Initial Admin Password (Optional)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Default: Parivar@123"
                value={newParivar.admin_password}
                onChange={(e) => setNewParivar({ ...newParivar, admin_password: e.target.value })}
                className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Default if empty: <span className="font-mono font-bold text-slate-600">Parivar@123</span>
            </p>
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
              <span>{createLoading ? "Provisioning..." : "Create Parivar"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
