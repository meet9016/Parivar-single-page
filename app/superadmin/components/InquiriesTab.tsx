"use client";

import React from "react";
import { Search, MessageSquare, Phone, Mail, Calendar, CheckCircle, Clock } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

export default function InquiriesTab() {
  const { inquiries, inquiriesLoading, inquirySearch, setInquirySearch, fetchInquiries, handleInquiryStatus } = useSuperAdmin();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search inquiries by Parivar name, phone, email..."
            value={inquirySearch}
            onChange={(e) => setInquirySearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchInquiries()}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
          />
        </div>
        <button
          onClick={fetchInquiries}
          className="px-5 py-2.5 rounded-xl bg-[#0B1340] hover:bg-blue-900 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          Search
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Parivar / Community</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Inquiry Note</th>
                <th className="px-5 py-3.5">Submitted On</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiriesLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 font-medium">
                    Loading inquiries from server...
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 space-y-2">
                    <MessageSquare className="w-7 h-7 mx-auto text-slate-300 stroke-[1.5]" />
                    <p>No inquiries found yet. Submissions from the landing page will appear here.</p>
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-bold text-[#0B1340]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-black text-xs shrink-0">
                          {inq.parivar_name?.charAt(0) || "P"}
                        </div>
                        <span className="font-bold text-sm text-slate-800">{inq.parivar_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{inq.mobile}</span>
                      </div>
                      {inq.email && (
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{inq.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 max-w-sm">
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {inq.note || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                          inq.status === 0
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {inq.status === 0 ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Resolved</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleInquiryStatus(inq._id, inq.status)}
                        className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          inq.status === 1
                            ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            : "border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {inq.status === 1 ? "Mark Resolved" : "Mark Pending"}
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
