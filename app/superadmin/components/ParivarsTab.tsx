"use client";

import React, { useEffect, useState } from "react";
import { Search, Building2, Database, Calendar, ChevronRight } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

export default function ParivarsTab() {
  const { parivars, parivarsLoading, parivarSearch, setParivarSearch, fetchParivars, setEditingParivar } = useSuperAdmin();

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchParivars();
    }, 800);
    return () => clearTimeout(timeout);
  }, [parivarSearch]);

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
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search parivar name, slug, admin..."
            value={parivarSearch}
            onChange={(e) => setParivarSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
          />
        </div>
      </div>

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
              {parivarsLoading ? (
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
                parivars.map((p) => (
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
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Active</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(p)}
                        className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
