"use client";

import React, { useState, useEffect } from "react";
import { useSuperAdmin } from "../context/SuperAdminContext";

export default function EditParivarModal() {
  const { editingParivar, setEditingParivar, editLoading, handleEditParivar } = useSuperAdmin();

  const [editForm, setEditForm] = useState({
    parivar_name: "",
    status: 1,
    admin_first_name: "",
    admin_last_name: "",
    admin_mobile: "",
    new_password: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!editForm.parivar_name.trim()) newErrors.parivar_name = "Parivar Name is required.";
    if (!editForm.admin_first_name.trim()) newErrors.admin_first_name = "First Name is required.";
    
    if (!editForm.admin_mobile.trim()) {
      newErrors.admin_mobile = "Mobile Number is required.";
    } else if (!/^\d{10}$/.test(editForm.admin_mobile.trim())) {
      newErrors.admin_mobile = "Mobile Number must be exactly 10 digits.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    handleEditParivar(e, editForm);
  };

  useEffect(() => {
    if (editingParivar) {
      setEditForm({
        parivar_name: editingParivar.parivar_name,
        status: editingParivar.status ?? 1,
        admin_first_name: editingParivar.admin_first_name || "",
        admin_last_name: editingParivar.admin_last_name || "",
        admin_mobile: editingParivar.admin_mobile || "",
        new_password: ""
      });
    }
  }, [editingParivar]);

  if (!editingParivar) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070D2B]/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative">
        <button 
          onClick={() => setEditingParivar(null)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
        >
          ✕
        </button>
        
        <h3 className="text-xl font-black text-[#0B1340] mb-6">
          Edit Parivar Details
        </h3>
        
        <form onSubmit={validateAndSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Parivar Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={editForm.parivar_name}
              onChange={(e) => setEditForm({...editForm, parivar_name: e.target.value})}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
            {errors.parivar_name && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.parivar_name}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.admin_first_name}
                onChange={(e) => setEditForm({...editForm, admin_first_name: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
              {errors.admin_first_name && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.admin_first_name}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Admin Last Name</label>
              <input
                type="text"
                value={editForm.admin_last_name}
                onChange={(e) => setEditForm({...editForm, admin_last_name: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Admin Mobile <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              maxLength={10}
              value={editForm.admin_mobile}
              onChange={(e) => setEditForm({...editForm, admin_mobile: e.target.value.replace(/\D/g, '')})}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
            {errors.admin_mobile && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.admin_mobile}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Status</label>
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({...editForm, status: Number(e.target.value)})}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Active</option>
              <option value={0}>Suspended</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Reset Password (Optional)</label>
            <input
              type="text"
              placeholder="Enter new password to reset"
              value={editForm.new_password}
              onChange={(e) => setEditForm({...editForm, new_password: e.target.value})}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Leave empty to keep current password</p>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => setEditingParivar(null)}
              className="flex-1 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editLoading}
              className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0B1340] hover:bg-[#070D2B] shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {editLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
