"use client";

import React, { useEffect, useState } from "react";
import { Search, Building2, Calendar, Edit2, Trash2, Tag, User, Phone, Mail } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

export default function ParivarsTab() {
  const {
    parivars,
    parivarsLoading,
    parivarSearch,
    setParivarSearch,
    fetchParivars,
    setEditingParivar,
    handleDeleteParivar,
  } = useSuperAdmin();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchParivars();
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [parivarSearch]);

  const totalPages = Math.ceil(parivars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentParivars = parivars.slice(startIndex, startIndex + itemsPerPage);

  const openEditModal = (p: any) => {
    setEditingParivar({
      _id: p._id,
      community_type: p.community_type || "Parivar",
      parivar_name: p.parivar_name,
      village_name: p.village_name || "",
      status: p.status ?? 1,
      admin_first_name: p.admin?.first_name || "",
      admin_last_name: p.admin?.last_name || "",
      admin_email: p.admin?.email || "",
      admin_mobile: p.admin?.mobile || "",
      notes: p.notes || "",
    });
  };

  const onDelete = async (p: any) => {
    const name = p.parivar_name || "this parivar";
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await handleDeleteParivar(p._id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Parivar / Community</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Admin & Contact</th>
                <th className="px-5 py-3.5">Created Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parivarsLoading && parivars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                    Loading communities...
                  </td>
                </tr>
              ) : parivars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 space-y-2">
                    <Building2 className="w-8 h-8 mx-auto text-slate-300 stroke-[1.5]" />
                    <p className="font-semibold text-slate-600">No Parivars added yet.</p>
                    <p className="text-xs text-slate-400">Click "+ Add Parivar" above to create your first community profile.</p>
                  </td>
                </tr>
              ) : (
                currentParivars.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Parivar Name */}
                    <td className="px-5 py-4 font-bold text-[#0B1340]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                          {p.parivar_name?.charAt(0) || "P"}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-slate-900">{p.parivar_name}</div>
                          {p.notes && (
                            <div className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                              {p.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Community Type */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                        <Tag className="w-3 h-3 text-slate-400" />
                        <span>{p.community_type || "Parivar"}</span>
                      </span>
                    </td>

                    {/* Admin Contact */}
                    <td className="px-5 py-4">
                      {p.admin && (p.admin.first_name || p.admin.email || p.admin.mobile) ? (
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{p.admin.first_name} {p.admin.last_name || ""}</span>
                          </div>
                          {p.admin.email && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{p.admin.email}</span>
                            </div>
                          )}
                          {p.admin.mobile && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{p.admin.mobile}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN") : "—"}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {Number(p.status ?? 1) === 1 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          <span>Suspended</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                          title="Edit Parivar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(p)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                          title="Delete Parivar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {parivars.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-slate-200 bg-slate-50/50">
            <span className="text-xs text-slate-500 font-medium">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, parivars.length)} of {parivars.length} parivars
            </span>
            <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-[#0B1340] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-slate-200 cursor-pointer"
              >
                Previous
              </button>
              <div className="flex items-center px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border-r border-slate-200">
                {currentPage} / {totalPages || 1}
              </div>
              <button 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-[#0B1340] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
