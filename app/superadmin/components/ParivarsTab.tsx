"use client";

import React, { useEffect, useState } from "react";
import { Search, Building2, Database, Calendar, ChevronRight } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

export default function ParivarsTab() {
  const { parivars, parivarsLoading, parivarSearch, setParivarSearch, fetchParivars, setEditingParivar } = useSuperAdmin();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchParivars();
      setCurrentPage(1); // Reset to first page on search
    }, 800);
    return () => clearTimeout(timeout);
  }, [parivarSearch]);

  const totalPages = Math.ceil(parivars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentParivars = parivars.slice(startIndex, startIndex + itemsPerPage);

  const openEditModal = (p: any) => {
    setEditingParivar({
      _id: p._id,
      parivar_name: p.parivar_name,
      status: p.status ?? 1,
      admin_first_name: p.admin?.first_name || "",
      admin_last_name: p.admin?.last_name || "",
      admin_mobile: p.admin?.mobile || "",
      new_password: ""
    });
  };

  return (
    <div className="space-y-4">


      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Parivar Community</th>
                <th className="px-5 py-3.5">Dedicated Database</th>
                <th className="px-5 py-3.5">Primary Admin</th>
                <th className="px-5 py-3.5">Created Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parivarsLoading && parivars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 font-medium">
                    Loading registered communities...
                  </td>
                </tr>
              ) : parivars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 space-y-2">
                    <Building2 className="w-7 h-7 mx-auto text-slate-300 stroke-[1.5]" />
                    <p>No Parivars registered yet. Click "+ Add Parivar" to create one.</p>
                  </td>
                </tr>
              ) : (
                currentParivars.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-bold text-[#0B1340]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                          {p.parivar_name?.charAt(0) || "P"}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">{p.parivar_name}</div>
                          <div className="text-[11px] font-sans text-slate-400 font-medium">/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/80 font-sans text-xs text-blue-700 font-semibold">
                        <Database className="w-3 h-3 text-blue-600" />
                        <span>{p.db_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 space-y-0.5">
                      {p.admin ? (
                        <>
                          <div className="font-bold text-slate-800 text-xs">
                            {p.admin.first_name} {p.admin.last_name || ""}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {p.admin.email} {p.admin.mobile ? `| ${p.admin.mobile}` : ""}
                          </div>
                        </>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}</span>
                      </div>
                    </td>
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
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(p)}
                        className="px-3 py-1.5 rounded-lg bg-[#0B1340] hover:bg-[#0d1855] text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Edit</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
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
            <div className="flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-[#0B1340] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-slate-200"
              >
                Previous
              </button>
              <div className="flex items-center px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border-r border-slate-200">
                {currentPage} / {totalPages || 1}
              </div>
              <button 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-[#0B1340] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
