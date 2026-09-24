"use client";

import React, { useState, useEffect } from "react";
import { useSuperAdmin } from "../context/SuperAdminContext";
import { Building2 } from "lucide-react";

export default function EditParivarModal() {
  const { editingParivar, setEditingParivar, editLoading, handleEditParivar } = useSuperAdmin();

  const [editForm, setEditForm] = useState({
    community_type: "Parivar",
    parivar_name: "",
    status: 1,
    admin_first_name: "",
    admin_last_name: "",
    admin_email: "",
    admin_mobile: "",
    notes: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingParivar) {
      setEditForm({
        community_type: editingParivar.community_type || "Parivar",
        parivar_name: editingParivar.parivar_name || "",
        status: editingParivar.status ?? 1,
        admin_first_name: editingParivar.admin_first_name || editingParivar.admin?.first_name || "",
        admin_last_name: editingParivar.admin_last_name || editingParivar.admin?.last_name || "",
        admin_email: editingParivar.admin_email || editingParivar.admin?.email || "",
        admin_mobile: editingParivar.admin_mobile || editingParivar.admin?.mobile || "",
        notes: editingParivar.notes || "",
      });
    }
  }, [editingParivar]);

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!editForm.parivar_name.trim()) newErrors.parivar_name = "Parivar Name is required.";
    if (!editForm.admin_first_name.trim()) newErrors.admin_first_name = "First Name is required.";
    
    if (editForm.admin_mobile.trim() && !/^\d{10}$/.test(editForm.admin_mobile.trim())) {
      newErrors.admin_mobile = "Mobile Number must be 10 digits.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    handleEditParivar(e, editForm);
  };

  if (!editingParivar) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070D2B]/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl relative space-y-4 border border-slate-100">
        <button 
          onClick={() => setEditingParivar(null)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          ✕
        </button>
        
        <div className="border-b border-slate-100 pb-3 space-y-0.5">
          <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Update Details</span>
          </div>
          <h3 className="text-lg font-black text-[#0B1340]">
            Edit Parivar Details
          </h3>
        </div>
        
        <form onSubmit={validateAndSubmit} noValidate className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Community Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={editForm.community_type}
                onChange={(e) => setEditForm({ ...editForm, community_type: e.target.value })}
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
                Parivar / Community Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={editForm.parivar_name}
                onChange={(e) => setEditForm({...editForm, parivar_name: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
              />
              {errors.parivar_name && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.parivar_name}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.admin_first_name}
                onChange={(e) => setEditForm({...editForm, admin_first_name: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
              />
              {errors.admin_first_name && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.admin_first_name}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Admin Last Name</label>
              <input
                type="text"
                value={editForm.admin_last_name}
                onChange={(e) => setEditForm({...editForm, admin_last_name: e.target.value})}
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
                value={editForm.admin_email}
                onChange={(e) => setEditForm({...editForm, admin_email: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Mobile
              </label>
              <input
                type="tel"
                maxLength={10}
                value={editForm.admin_mobile}
                onChange={(e) => setEditForm({...editForm, admin_mobile: e.target.value.replace(/\D/g, '')})}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
              />
              {errors.admin_mobile && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.admin_mobile}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({...editForm, status: Number(e.target.value)})}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none cursor-pointer"
            >
              <option value={1}>Active</option>
              <option value={0}>Suspended / Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes (Optional)</label>
            <input
              type="text"
              value={editForm.notes}
              onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#0B1340]/20 focus:bg-white outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
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
