"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, Building2, Calendar, Edit2, Trash2, Tag, User, Phone, Mail, CheckSquare, Plus, IndianRupee, Image as ImageIcon, Upload, X, Clock, Play, Square, Eye, CheckCircle2, FileSpreadsheet, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { useSuperAdmin, ProjectTask } from "../context/SuperAdminContext";
import { toast } from "sonner";
import CustomSelect from "./CustomSelect";
import axiosInstance from "../../../lib/axiosInstance";
import { ENDPOINTS } from "../../../lib/endpoints";

export default function ParivarsTab() {
  const {
    parivars,
    parivarsLoading,
    parivarSearch,
    setParivarSearch,
    fetchParivars,
    setEditingParivar,
    handleDeleteParivar,
    handleAddParivarPayment,
    projectTasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
  } = useSuperAdmin();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected Parivar for Task List View Modal
  const [selectedParivarForTasks, setSelectedParivarForTasks] = useState<any | null>(null);

  // Quick Add / Edit Task Modal for a Specific Parivar
  const [taskModalParivar, setTaskModalParivar] = useState<any | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState({
    task_title: "",
    description: "",
    assigned_to: "",
    spent_hours: 1,
    start_date: new Date().toISOString().split("T")[0],
  });

  // Payment Recording Modal
  const [paymentModalParivar, setPaymentModalParivar] = useState<any | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount_received: "",
    screenshot: "",
    remarks: "",
  });
  const paymentFileInputRef = useRef<HTMLInputElement>(null);

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

  const openEditModal = (p: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingParivar({
      _id: p._id,
      community_type: p.community_type || "Parivar",
      parivar_name: p.parivar_name,
      company_name: p.company_name || p.parivar_name || "",
      village_name: p.village_name || "",
      status: p.status ?? 1,
      admin_first_name: p.admin_first_name || p.admin?.first_name || "",
      admin_last_name: p.admin_last_name || p.admin?.last_name || "",
      admin_email: p.admin_email || p.admin?.email || "",
      admin_mobile: p.admin_mobile || p.admin?.mobile || "",
      country: p.country || "India",
      state: p.state || "",
      city: p.city || "",
      subscription_plan_time: p.subscription_plan_time || "1 Year",
      project_amount: p.project_amount !== undefined ? p.project_amount : "",
      notes: p.notes || "",
    });
  };

  const onDelete = async (p: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const name = p.parivar_name || "this parivar";
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await handleDeleteParivar(p._id);
    }
  };

  // Open Quick Add Task modal for Parivar
  const openAddTaskForParivar = (p: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTaskModalParivar(p);
    setEditingTaskId(null);
    setTaskForm({
      task_title: "",
      description: "",
      assigned_to: "",
      spent_hours: 1,
      start_date: new Date().toISOString().split("T")[0],
    });
  };

  const handleSaveTaskForParivar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskModalParivar) return;
    if (!taskForm.assigned_to.trim()) {
      toast.error("Please enter developer name");
      return;
    }

    const title = taskForm.description ? (taskForm.description.length > 50 ? taskForm.description.slice(0, 47) + "..." : taskForm.description) : `${taskModalParivar.parivar_name} Work`;

    if (editingTaskId) {
      const ok = await handleUpdateTask(editingTaskId, {
        task_title: taskForm.task_title || title,
        description: taskForm.description,
        assigned_to: taskForm.assigned_to.trim(),
        spent_hours: Number(taskForm.spent_hours) || 1,
        estimated_hours: Number(taskForm.spent_hours) || 1,
        start_date: taskForm.start_date,
      });
      if (ok) {
        setTaskModalParivar(null);
        setEditingTaskId(null);
      }
    } else {
      const payload = {
        project_name: taskModalParivar.parivar_name,
        client_name: `${taskModalParivar.admin?.first_name || ""} ${taskModalParivar.admin?.last_name || ""}`.trim(),
        task_title: taskForm.task_title || title,
        description: taskForm.description,
        assigned_to: taskForm.assigned_to.trim(),
        spent_hours: Number(taskForm.spent_hours) || 1,
        estimated_hours: Number(taskForm.spent_hours) || 1,
        start_date: taskForm.start_date,
        status: "Completed" as const,
        priority: "Medium" as const,
        category: "Customization",
        billable: true,
      };

      const ok = await handleCreateTask(payload);
      if (ok) {
        setTaskModalParivar(null);
        setEditingTaskId(null);
      }
    }
  };

  // State to preview receipt screenshot popup
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  // Open Payment modal
  const openPaymentModal = (p: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPaymentModalParivar(p);
    setPaymentForm({
      amount_received: "",
      screenshot: "",
      remarks: "",
    });
  };

  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  // Upload Screenshot directly to Digitalks under 'parivar-superadmin' folder
  const handleScreenshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Screenshot image must be less than 20MB");
      return;
    }

    try {
      setUploadingScreenshot(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder_structure", "parivar-superadmin");

      const res = await axiosInstance.post(ENDPOINTS.UPLOAD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = res.data?.data?.url || res.data?.data?.file_url || res.data?.url || res.data?.file_url;
      if (uploadedUrl) {
        setPaymentForm((prev) => ({ ...prev, screenshot: uploadedUrl }));
        toast.success("Receipt image uploaded successfully to Digitalks!");
      } else {
        toast.error("Failed to retrieve uploaded image URL");
      }
    } catch (err: any) {
      console.error("Screenshot upload error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to upload screenshot to media server");
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalParivar) return;
    const amount = Number(paymentForm.amount_received);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount received");
      return;
    }

    // Automatically record current exact date and time
    const currentDateTime = new Date().toISOString();

    const payload = {
      amount_received: amount,
      payment_date: currentDateTime,
      screenshot: paymentForm.screenshot,
      remarks: paymentForm.remarks,
    };

    const ok = await handleAddParivarPayment(paymentModalParivar._id, payload);
    if (ok) {
      setPaymentModalParivar(null);
    }
  };

  // Calculate payment totals for Parivar
  const getPaymentStats = (p: any) => {
    const totalProjectAmount = Number(p.project_amount) || 0;
    const totalReceived = (p.payments || []).reduce((acc: number, curr: any) => acc + (Number(curr.amount_received) || 0), 0);
    const pendingAmount = Math.max(0, totalProjectAmount - totalReceived);
    return { totalProjectAmount, totalReceived, pendingAmount };
  };

  // Working hours options (0.25 to 12.0)
  const workingHourOptions = Array.from({ length: 48 }, (_, i) => {
    const val = (i + 1) * 0.25;
    const hrs = Math.floor(val);
    const mins = Math.round((val % 1) * 60);
    return {
      value: String(val),
      label: mins > 0 ? (hrs > 0 ? `${hrs} hr ${mins} min (${val}h)` : `${mins} min (${val}h)`) : `${hrs} hr (${val}h)`,
    };
  });

  return (
    <div className="space-y-4 font-sans">
      <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-100 border-b border-slate-300 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Parivar Name</th>
                <th className="px-5 py-3.5">City</th>
                <th className="px-5 py-3.5">Plan Duration</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Project Amount & Payments</th>
                <th className="px-5 py-3.5">Tasks</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {parivarsLoading && parivars.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-14 text-slate-600 font-medium text-sm">
                    Loading parivars...
                  </td>
                </tr>
              ) : parivars.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-14 text-slate-600 space-y-1.5">
                    <Building2 className="w-8 h-8 mx-auto text-slate-400 stroke-[1.5]" />
                    <p className="font-bold text-slate-700 text-sm">No Parivars added yet.</p>
                    <p className="text-xs text-slate-500">Click "+ Add Parivar" above to create customer profile.</p>
                  </td>
                </tr>
              ) : (
                currentParivars.map((p) => {
                  const parivarTasksList = projectTasks.filter(
                    (t) => t.project_name?.toLowerCase() === p.parivar_name?.toLowerCase()
                  );
                  const { totalProjectAmount, totalReceived, pendingAmount } = getPaymentStats(p);

                  return (
                    <tr 
                      key={p._id} 
                      onClick={() => setSelectedParivarForTasks(p)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                      title="Click to view tasks list"
                    >
                      {/* Parivar Name */}
                      <td className="px-5 py-4 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                            {p.parivar_name?.charAt(0) || "P"}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                              {p.parivar_name}
                            </div>
                            {p.village_name && (
                              <div className="text-xs text-slate-500 font-normal">
                                {p.village_name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* City */}
                      <td className="px-5 py-4">
                        {p.city ? (
                          <span className="inline-flex items-center text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                            {p.city}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">—</span>
                        )}
                      </td>

                      {/* Plan Duration */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold">
                          <span>{p.subscription_plan_time || "1 Year"}</span>
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                            <User className="w-4 h-4 text-slate-500" />
                            <span>{p.admin?.first_name || p.admin_first_name || "—"}</span>
                          </div>
                          {p.admin?.mobile && (
                            <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                              <Phone className="w-3.5 h-3.5 text-slate-500" />
                              <span>{p.admin.mobile}</span>
                            </div>
                          )}
                          {p.admin?.email && (
                            <div className="text-xs text-slate-600 flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-slate-500" />
                              <span>{p.admin.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Project Amount & Payment Stats */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-slate-900">
                            Total: ₹{totalProjectAmount.toLocaleString("en-IN")}
                          </div>
                          <div className="flex items-center gap-2 text-xs flex-wrap">
                            <span className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300">
                              Paid: ₹{totalReceived.toLocaleString("en-IN")}
                            </span>
                            {pendingAmount > 0 ? (
                              <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-300">
                                Due: ₹{pendingAmount.toLocaleString("en-IN")}
                              </span>
                            ) : totalProjectAmount > 0 ? (
                              <span className="text-emerald-700 font-bold text-xs">
                                ✓ Cleared
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </td>

                      {/* Tasks Badge */}
                      <td className="px-5 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedParivarForTasks(p);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer border border-slate-300"
                        >
                          <CheckSquare className="w-4 h-4 text-blue-700" />
                          <span>{parivarTasksList.length} Tasks</span>
                        </button>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {Number(p.status ?? 1) === 1 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300">
                            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                            <span>Suspended</span>
                          </span>
                        )}
                      </td>

                      {/* Actions with Task & Payment icons */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          {/* Payment Icon */}
                          <button
                            onClick={(e) => openPaymentModal(p, e)}
                            className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors cursor-pointer"
                            title="Record Payment & Upload Screenshot"
                          >
                            <IndianRupee className="w-4 h-4" />
                          </button>

                          {/* Add Task Icon */}
                          <button
                            onClick={(e) => openAddTaskForParivar(p, e)}
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 transition-colors cursor-pointer"
                            title="Add Task / Work Hours for this Parivar"
                          >
                            <Plus className="w-4 h-4" />
                          </button>

                          {/* Edit Parivar */}
                          <button
                            onClick={(e) => openEditModal(p, e)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors cursor-pointer bg-white"
                            title="Edit Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Parivar */}
                          <button
                            onClick={(e) => onDelete(p, e)}
                            className="p-2 rounded-lg hover:bg-rose-50 text-rose-700 border border-rose-300 transition-colors cursor-pointer bg-white"
                            title="Delete Parivar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {parivars.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-300 bg-slate-50">
            <span className="text-sm text-slate-700 font-medium">
              Showing <span className="font-semibold text-slate-900">{startIndex + 1}</span> to{" "}
              <span className="font-semibold text-slate-900">
                {Math.min(startIndex + itemsPerPage, parivars.length)}
              </span>{" "}
              of <span className="font-semibold text-slate-900">{parivars.length}</span> parivars
            </span>
            <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden shadow-xs">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-slate-300 cursor-pointer"
              >
                Previous
              </button>
              <div className="flex items-center px-4 py-2 text-sm font-bold text-slate-900 bg-slate-50 border-r border-slate-300">
                {currentPage} / {totalPages || 1}
              </div>
              <button 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── PARIVAR TASKS LIST MODAL (POPUP ON ROW CLICK OR TASKS BADGE) ── */}
      {selectedParivarForTasks && (() => {
        const parivarTasks = projectTasks.filter(
          (t) => t.project_name?.toLowerCase() === selectedParivarForTasks.parivar_name?.toLowerCase()
        );
        const totalLoggedHours = parivarTasks.reduce((acc, curr) => acc + (Number(curr.spent_hours) || 0), 0);

        const handleDownloadParivarExcel = () => {
          if (parivarTasks.length === 0) {
            toast.error("No tasks to download for this parivar");
            return;
          }
          const exportData = parivarTasks.map((t, idx) => ({
            "Sr No": idx + 1,
            "Title": t.task_title || "Customization Work",
            "Description": t.description || "",
            "Developer": t.assigned_to || "",
            "Date": t.start_date ? new Date(t.start_date).toLocaleDateString("en-IN") : "",
            "Hours": `${t.spent_hours || 0} Hours`,
          }));

          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const colWidths = [
            { wch: 8 },   // Sr No
            { wch: 30 },  // Title
            { wch: 45 },  // Description
            { wch: 22 },  // Developer
            { wch: 16 },  // Date
            { wch: 14 },  // Hours
          ];
          worksheet["!cols"] = colWidths;

          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks_Report");
          const safeName = (selectedParivarForTasks.parivar_name || "Parivar").replace(/[^a-zA-Z0-9_-]/g, "_");
          XLSX.writeFile(workbook, `${safeName}_Tasks_${new Date().toISOString().split("T")[0]}.xlsx`);
          toast.success(`Downloaded Excel report for ${selectedParivarForTasks.parivar_name}!`);
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-xl p-6 shadow-xl border border-slate-300 my-8 animate-in fade-in duration-150 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-bold border border-blue-200">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900">
                        Tasks for {selectedParivarForTasks.parivar_name}
                      </h3>
                      <span className="px-3 py-1 rounded-md bg-blue-50 border border-blue-300 text-blue-900 font-bold text-xs">
                        Total: {totalLoggedHours} Hours
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      All recorded project tasks and logged work hours
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadParivarExcel}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold transition-colors cursor-pointer"
                    title="Download Tasks in Excel"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    <span>Download Excel</span>
                  </button>
                  <button
                    onClick={() => {
                      openAddTaskForParivar(selectedParivarForTasks);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0B1340] text-white text-xs font-semibold hover:bg-[#070D2B] transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Task</span>
                  </button>
                  <button
                    onClick={() => setSelectedParivarForTasks(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tasks list in Clean Table Format */}
              <div className="border border-slate-300 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                {parivarTasks.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 space-y-2">
                    <Clock className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="font-semibold text-slate-800 text-sm">No tasks recorded for this Parivar.</p>
                    <p className="text-xs text-slate-500">Click "+ Add Task" button above to log work hours.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase tracking-wider text-xs sticky top-0">
                      <tr>
                        <th className="py-3 px-4">Task Title / Description</th>
                        <th className="py-3 px-4">Developer</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Hours</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {parivarTasks.map((task) => (
                        <tr key={task._id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 max-w-[280px]">
                            <div className="font-bold text-slate-900 text-sm truncate" title={task.task_title}>
                              {task.task_title}
                            </div>
                            {task.description && (
                              <div className="text-slate-600 text-xs line-clamp-1 mt-0.5" title={task.description}>
                                {task.description}
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-800 text-xs">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>{task.assigned_to || "—"}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap text-slate-700 text-xs">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>{task.start_date ? new Date(task.start_date).toLocaleDateString("en-IN") : "—"}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-300 text-xs">
                              {task.spent_hours || 0} Hours
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setTaskModalParivar(selectedParivarForTasks);
                                  setEditingTaskId(task._id);
                                  setTaskForm({
                                    task_title: task.task_title || "",
                                    description: task.description || "",
                                    assigned_to: task.assigned_to || "",
                                    spent_hours: task.spent_hours || 1,
                                    start_date: task.start_date ? new Date(task.start_date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-800 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
                                title="Edit Task Details"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={async () => {
                                  if (window.confirm("Are you sure you want to delete this task?")) {
                                    await handleDeleteTask(task._id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-800 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
                                title="Delete Task"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedParivarForTasks(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── QUICK ADD WORK HOURS / TASK FOR PARIVAR MODAL ── */}
      {taskModalParivar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl border border-slate-300 my-8 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingTaskId ? "Edit Work Hours" : "Add Work Hours"}
                  </h3>
                  <p className="text-xs text-slate-700 font-semibold">{taskModalParivar.parivar_name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setTaskModalParivar(null);
                  setEditingTaskId(null);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTaskForParivar} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Date <span className="text-rose-600">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={taskForm.start_date}
                  onChange={(e) => setTaskForm({ ...taskForm, start_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0B1340] focus:ring-1 focus:ring-[#0B1340]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Working Hours <span className="text-rose-600">*</span>
                </label>
                <CustomSelect
                  value={String(taskForm.spent_hours)}
                  onChange={(val) => setTaskForm({ ...taskForm, spent_hours: parseFloat(val) || 1 })}
                  options={workingHourOptions}
                />
                <span className="text-xs text-slate-600 font-medium mt-1 block">
                  Select in 15-minute intervals (e.g. 2.5 = 2 hours 30 minutes)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Developer Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter developer name"
                  value={taskForm.assigned_to}
                  onChange={(e) => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#0B1340] focus:ring-1 focus:ring-[#0B1340]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Note / Description <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter work description or notes"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#0B1340] focus:ring-1 focus:ring-[#0B1340]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setTaskModalParivar(null);
                    setEditingTaskId(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0B1340] hover:bg-[#070D2B] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs"
                >
                  {editingTaskId ? "Update Work Hours" : "Save Work Hours"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PAYMENT RECORDING & SCREENSHOT UPLOAD MODAL ── */}
      {paymentModalParivar && (() => {
        const { totalProjectAmount, totalReceived, pendingAmount } = getPaymentStats(paymentModalParivar);
        const remainingAfterInput = Math.max(0, pendingAmount - (Number(paymentForm.amount_received) || 0));

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl border border-slate-300 my-8 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center justify-center">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Record Client Payment</h3>
                    <p className="text-xs text-slate-700 font-semibold">{paymentModalParivar.parivar_name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPaymentModalParivar(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Payment summary box */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-300 grid grid-cols-3 gap-2 text-center my-4">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-600 block">Project Amount</span>
                  <span className="text-base font-black text-slate-900">₹{totalProjectAmount.toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-slate-600 block">Total Received</span>
                  <span className="text-base font-black text-emerald-700">₹{totalReceived.toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-slate-600 block">Current Pending</span>
                  <span className="text-base font-black text-rose-700">₹{pendingAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <form onSubmit={handleSavePayment} className="space-y-4">
                {/* Amount Received & Screenshot Upload in 2 Columns Side-by-Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
                  {/* Amount Received */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 h-4 flex items-center">
                      <span>Amount Received from Client (₹)</span>
                      <span className="text-rose-600 ml-0.5">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-600 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="Enter amount received"
                        value={paymentForm.amount_received}
                        onChange={(e) => setPaymentForm({ ...paymentForm, amount_received: e.target.value })}
                        className="w-full pl-8 pr-3.5 h-[42px] rounded-lg bg-white border border-slate-300 text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#0B1340] focus:ring-1 focus:ring-[#0B1340]"
                      />
                    </div>
                    {paymentForm.amount_received && (
                      <div className="text-xs font-semibold text-slate-600 mt-1.5 flex items-center justify-between">
                        <span>Remaining:</span>
                        <span className="font-bold text-rose-700">₹{remainingAfterInput.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </div>

                  {/* Screenshot Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 h-4 flex items-center">
                      Payment Screenshot / Receipt
                    </label>
                    <input
                      ref={paymentFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={uploadingScreenshot}
                        onClick={() => paymentFileInputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-2 px-3.5 h-[42px] rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer border border-slate-300 disabled:opacity-50"
                      >
                        {uploadingScreenshot ? (
                          <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4 text-slate-700" />
                        )}
                        <span className="truncate">
                          {uploadingScreenshot
                            ? "Uploading..."
                            : paymentForm.screenshot
                            ? "Change Screenshot"
                            : "Upload Screenshot"}
                        </span>
                      </button>
                      {paymentForm.screenshot && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <img
                            src={paymentForm.screenshot}
                            alt="Receipt Preview"
                            className="w-[42px] h-[42px] object-cover rounded-lg border border-slate-300 cursor-pointer"
                            onClick={() => setPreviewReceiptUrl(paymentForm.screenshot)}
                          />
                          <button
                            type="button"
                            onClick={() => setPaymentForm((prev) => ({ ...prev, screenshot: "" }))}
                            className="text-xs text-rose-600 font-bold hover:underline cursor-pointer px-1"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Remarks / Transaction ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UPI / Bank Transfer / Advance payment"
                    value={paymentForm.remarks}
                    onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#0B1340] focus:ring-1 focus:ring-[#0B1340]"
                  />
                </div>

                {/* Previous Payments History */}
                {paymentModalParivar.payments && paymentModalParivar.payments.length > 0 && (
                  <div className="pt-2 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Payment History ({paymentModalParivar.payments.length})
                    </label>
                    <div className="max-h-36 overflow-y-auto space-y-1.5">
                      {paymentModalParivar.payments.map((pm: any, idx: number) => {
                        const dateObj = pm.payment_date ? new Date(pm.payment_date) : null;
                        const dateFormatted = dateObj ? dateObj.toLocaleDateString("en-IN") : "";
                        const timeFormatted = dateObj ? dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "";

                        return (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 text-xs border border-slate-300">
                            <div>
                              <span className="font-bold text-emerald-800 text-sm">₹{Number(pm.amount_received).toLocaleString("en-IN")}</span>
                              {pm.remarks && <span className="text-slate-700 ml-2 font-medium">({pm.remarks})</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-600 font-medium">
                                {dateFormatted} {timeFormatted && <span className="text-slate-500 text-xs">({timeFormatted})</span>}
                              </span>
                              {pm.screenshot && (
                                <button
                                  type="button"
                                  onClick={() => setPreviewReceiptUrl(pm.screenshot)}
                                  className="text-blue-700 font-bold hover:underline cursor-pointer border border-blue-200 bg-blue-50 px-2 py-0.5 rounded text-xs"
                                >
                                  Receipt
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPaymentModalParivar(null)}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    Save Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* ── RECEIPT IMAGE PREVIEW MODAL ── */}
      {previewReceiptUrl && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto"
          onClick={() => setPreviewReceiptUrl(null)}
        >
          <div 
            className="bg-white rounded-lg p-4 shadow-2xl border border-slate-300 max-w-2xl w-full relative animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <h4 className="text-sm font-bold text-slate-900">Payment Screenshot / Receipt</h4>
              <button 
                onClick={() => setPreviewReceiptUrl(null)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex justify-center items-center max-h-[75vh] overflow-auto bg-slate-50 p-2 rounded-md border border-slate-200">
              <img 
                src={previewReceiptUrl} 
                alt="Receipt Full View" 
                className="max-h-[70vh] w-auto object-contain rounded" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
