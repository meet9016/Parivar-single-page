"use client";

import React, { useState } from "react";
import { PlusCircle, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

export default function CreateParivarModal() {
  const { isCreateModalOpen, setIsCreateModalOpen, createLoading, createStatus, handleCreateParivar } = useSuperAdmin();

  const [newParivar, setNewParivar] = useState({
    parivar_name: "",
    admin_first_name: "",
    admin_last_name: "",
    admin_email: "",
    admin_mobile: "",
    admin_password: "",
  });

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

        <form onSubmit={(e) => handleCreateParivar(e, newParivar, setNewParivar)} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Parivar Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Patel Parivar / Vala Parivar"
              value={newParivar.parivar_name}
              onChange={(e) => setNewParivar({ ...newParivar, parivar_name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Database: <span className="font-mono text-blue-600 font-semibold">parivar_{newParivar.parivar_name ? newParivar.parivar_name.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'name'}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin First Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh"
                value={newParivar.admin_first_name}
                onChange={(e) => setNewParivar({ ...newParivar, admin_first_name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              />
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
                Admin Email *
              </label>
              <input
                type="email"
                required
                placeholder="admin@patel.com"
                value={newParivar.admin_email}
                onChange={(e) => setNewParivar({ ...newParivar, admin_email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Mobile *
              </label>
              <input
                type="tel"
                required
                placeholder="9876543210"
                value={newParivar.admin_mobile}
                onChange={(e) => setNewParivar({ ...newParivar, admin_mobile: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Initial Admin Password (Optional)
            </label>
            <input
              type="password"
              placeholder="Default: Parivar@123"
              value={newParivar.admin_password}
              onChange={(e) => setNewParivar({ ...newParivar, admin_password: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
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
