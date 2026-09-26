"use client";

import React, { useEffect, useState } from "react";
import { Search, MessageSquare, Phone, Mail, Calendar, CheckCircle, Clock } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

export default function InquiriesTab() {
  const { inquiries, inquiriesLoading, inquirySearch, setInquirySearch, fetchInquiries, handleInquiryStatus } = useSuperAdmin();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchInquiries();
      setCurrentPage(1);
    }, 800);
    return () => clearTimeout(timeout);
  }, [inquirySearch]);

  const totalPages = Math.ceil(inquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInquiries = inquiries.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4 font-sans">
      <div className="bg-white border border-slate-300 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 border-b border-slate-300 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Parivar / Community</th>
                <th className="px-4 py-3">Contact Details</th>
                <th className="px-4 py-3">Inquiry Note</th>
                <th className="px-4 py-3">Submitted On</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {inquiriesLoading && inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-600 font-medium">
                    Loading inquiries from server...
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-600 space-y-1">
                    <MessageSquare className="w-6 h-6 mx-auto text-slate-400 stroke-[1.5]" />
                    <p className="font-semibold text-slate-700">No inquiries found yet.</p>
                    <p className="text-xs text-slate-500">Submissions from the landing page will appear here.</p>
                  </td>
                </tr>
              ) : (
                currentInquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {inq.parivar_name?.charAt(0) || "P"}
                        </div>
                        <span className="font-bold text-xs text-slate-900">{inq.parivar_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-900 font-medium text-xs">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{inq.mobile}</span>
                      </div>
                      {inq.email && (
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{inq.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 relative group">
                      <p className="text-slate-800 line-clamp-2 max-w-[240px]" title={inq.note || ""}>
                        {inq.note || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{inq.createdAt ? new Date(inq.createdAt).toLocaleDateString("en-IN") : "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          inq.status === 0
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                            : "bg-amber-50 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {inq.status === 0 ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-700" />
                            <span>Resolved</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>Pending</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleInquiryStatus(inq._id, inq.status)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                          inq.status === 1
                            ? "bg-[#0B1340] text-white border-[#0B1340] hover:bg-[#070D2B]"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
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

        {/* Pagination */}
        {inquiries.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-300 bg-slate-50">
            <span className="text-xs text-slate-700 font-medium">
              Showing <span className="font-semibold text-slate-900">{startIndex + 1}</span> to{" "}
              <span className="font-semibold text-slate-900">
                {Math.min(startIndex + itemsPerPage, inquiries.length)}
              </span>{" "}
              of <span className="font-semibold text-slate-900">{inquiries.length}</span> inquiries
            </span>

            <div className="flex items-center rounded-md border border-slate-300 bg-white overflow-hidden">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-slate-300 cursor-pointer"
              >
                Previous
              </button>
              <div className="flex items-center px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-slate-50 border-r border-slate-300">
                {currentPage} / {totalPages || 1}
              </div>
              <button 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
