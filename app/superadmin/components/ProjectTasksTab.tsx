"use client";

import React, { useState } from "react";
import {
  Clock,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Calendar,
  User,
  Building,
  Tag,
  Trash2,
  Edit2,
  Layers,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  X,
  ChevronDown,
  CheckSquare
} from "lucide-react";
import * as XLSX from "xlsx";
import { useSuperAdmin, ProjectTask } from "../context/SuperAdminContext";
import { toast } from "sonner";

export default function ProjectTasksTab() {
  const {
    projectTasks,
    tasksLoading,
    taskSearch,
    setTaskSearch,
    taskFilters,
    setTaskFilters,
    taskMeta,
    handleCreateTask,
    handleUpdateTask,
    handleLogTaskTime,
    handleDeleteTask,
    parivars,
  } = useSuperAdmin();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);
  const [quickLogTask, setQuickLogTask] = useState<ProjectTask | null>(null);
  const [logHoursInput, setLogHoursInput] = useState<string>("");
  const [logStatusInput, setLogStatusInput] = useState<string>("");
  const [logRemarksInput, setLogRemarksInput] = useState<string>("");

  // Create form state
  const [taskForm, setTaskForm] = useState({
    project_name: "",
    client_name: "",
    task_title: "",
    description: "",
    assigned_to: "",
    category: "Customization",
    priority: "Medium" as "Low" | "Medium" | "High" | "Urgent",
    status: "Pending" as "Pending" | "In Progress" | "Testing" | "Completed",
    estimated_hours: 0,
    spent_hours: 0,
    billable: true,
    start_date: "",
    due_date: "",
    remarks: "",
  });

  // Open Create Modal
  const openCreateModal = () => {
    setTaskForm({
      project_name: parivars[0]?.parivar_name || "",
      client_name: "",
      task_title: "",
      description: "",
      assigned_to: "",
      category: "Customization",
      priority: "Medium",
      status: "Pending",
      estimated_hours: 0,
      spent_hours: 0,
      billable: true,
      start_date: new Date().toISOString().split("T")[0],
      due_date: "",
      remarks: "",
    });
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (task: ProjectTask) => {
    setEditingTask(task);
    setTaskForm({
      project_name: task.project_name,
      client_name: task.client_name || "",
      task_title: task.task_title,
      description: task.description || "",
      assigned_to: task.assigned_to,
      category: task.category || "Customization",
      priority: task.priority,
      status: task.status,
      estimated_hours: task.estimated_hours || 0,
      spent_hours: task.spent_hours || 0,
      billable: task.billable ?? true,
      start_date: task.start_date ? task.start_date.split("T")[0] : "",
      due_date: task.due_date ? task.due_date.split("T")[0] : "",
      remarks: task.remarks || "",
    });
  };

  // Submit create or edit
  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.project_name.trim()) {
      toast.error("Please enter or select a project name");
      return;
    }
    if (!taskForm.task_title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    if (!taskForm.assigned_to.trim()) {
      toast.error("Please enter the developer/assignee name");
      return;
    }

    if (editingTask) {
      const ok = await handleUpdateTask(editingTask._id, taskForm);
      if (ok) setEditingTask(null);
    } else {
      const ok = await handleCreateTask(taskForm);
      if (ok) setIsCreateModalOpen(false);
    }
  };

  // Quick log hours handler
  const handleQuickLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLogTask) return;
    const addHrs = parseFloat(logHoursInput);
    if (isNaN(addHrs) && !logStatusInput && !logRemarksInput) {
      toast.error("Please provide hours or status update");
      return;
    }

    const payload: any = {};
    if (!isNaN(addHrs) && addHrs > 0) payload.add_hours = addHrs;
    if (logStatusInput) payload.status = logStatusInput;
    if (logRemarksInput) payload.remarks = logRemarksInput;

    const ok = await handleLogTaskTime(quickLogTask._id, payload);
    if (ok) {
      setQuickLogTask(null);
      setLogHoursInput("");
      setLogStatusInput("");
      setLogRemarksInput("");
    }
  };

  // ── EXCEL REPORT DOWNLOAD ──────────────────────────────────────────
  const handleExportExcel = () => {
    if (projectTasks.length === 0) {
      toast.error("No tasks to export!");
      return;
    }

    const exportData = projectTasks.map((t, idx) => ({
      "Sr No": idx + 1,
      "Project / Community Name": t.project_name,
      "Client Name": t.client_name || "-",
      "Task Title": t.task_title,
      "Task Category": t.category,
      "Assigned To (Developer)": t.assigned_to,
      "Priority": t.priority,
      "Status": t.status,
      "Estimated Hours": t.estimated_hours || 0,
      "Spent Hours": t.spent_hours || 0,
      "Variance (Est - Spent)": ((t.estimated_hours || 0) - (t.spent_hours || 0)).toFixed(2),
      "Billable": t.billable ? "Yes" : "No",
      "Start Date": t.start_date ? new Date(t.start_date).toLocaleDateString("en-IN") : "-",
      "Due Date": t.due_date ? new Date(t.due_date).toLocaleDateString("en-IN") : "-",
      "Completed Date": t.completed_date ? new Date(t.completed_date).toLocaleDateString("en-IN") : "-",
      "Remarks / Notes": t.remarks || "-",
      "Created At": t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-IN") : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Auto-fit column widths
    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(key.length + 4, 16),
    }));
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Project Tasks Report");

    const fileName = `Project_Tasks_Time_Report_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success("Excel report downloaded successfully!");
  };

  // Status badge helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Testing":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  // Priority badge helper
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-50 text-red-700 border-red-200";
      case "High":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Low":
        return "bg-slate-50 text-slate-600 border-slate-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Tasks</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">{taskMeta.totalTasks}</span>
              <span className="text-xs text-slate-400 font-medium">({taskMeta.filteredTasks} active view)</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#0B1340]/5 flex items-center justify-center text-[#0B1340]">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Total Time Spent */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Hours Spent</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-blue-600">{taskMeta.totalSpentHours} hrs</span>
              <span className="text-xs text-slate-400 font-medium">/ {taskMeta.totalEstimatedHours} est</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Task Status</span>
            <div className="flex items-center gap-2 mt-1.5 text-xs font-bold">
              <span className="text-amber-600">{taskMeta.statusCounts.Pending || 0} Pending</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-600">{taskMeta.statusCounts["In Progress"] || 0} In Progress</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600">{taskMeta.statusCounts.Completed || 0} Done</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Projects / Devs</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-600">{taskMeta.projectsList.length}</span>
              <span className="text-xs text-slate-400 font-medium">Projects • {taskMeta.devsList.length} Devs</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── Action & Filter Bar ── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by project, task title, developer, client..."
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20 focus:border-[#0B1340]/40"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all cursor-pointer shadow-sm"
              title="Download Excel Spreadsheet Report"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Download Excel</span>
            </button>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1340] hover:bg-[#0d1855] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project Task</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px] tracking-wider pr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Project Filter */}
          <select
            value={taskFilters.project}
            onChange={(e) => setTaskFilters((prev) => ({ ...prev, project: e.target.value }))}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B1340]"
          >
            <option value="all">All Projects</option>
            {taskMeta.projectsList.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Developer Filter */}
          <select
            value={taskFilters.assigned_to}
            onChange={(e) => setTaskFilters((prev) => ({ ...prev, assigned_to: e.target.value }))}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B1340]"
          >
            <option value="all">All Developers</option>
            {taskMeta.devsList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={taskFilters.status}
            onChange={(e) => setTaskFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B1340]"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Testing">Testing</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={taskFilters.priority}
            onChange={(e) => setTaskFilters((prev) => ({ ...prev, priority: e.target.value }))}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B1340]"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Category Filter */}
          <select
            value={taskFilters.category}
            onChange={(e) => setTaskFilters((prev) => ({ ...prev, category: e.target.value }))}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B1340]"
          >
            <option value="all">All Categories</option>
            <option value="Customization">Customization</option>
            <option value="Feature">Feature</option>
            <option value="Bug Fix">Bug Fix</option>
            <option value="Design">Design</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Other">Other</option>
          </select>

          {(taskFilters.project !== "all" ||
            taskFilters.status !== "all" ||
            taskFilters.assigned_to !== "all" ||
            taskFilters.priority !== "all" ||
            taskFilters.category !== "all" ||
            taskSearch) && (
            <button
              onClick={() => {
                setTaskSearch("");
                setTaskFilters({
                  project: "all",
                  status: "all",
                  assigned_to: "all",
                  priority: "all",
                  category: "all",
                });
              }}
              className="text-xs text-rose-500 hover:text-rose-700 font-semibold underline ml-auto cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Tasks Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Project & Task</th>
                <th className="py-3.5 px-4">Assignee & Category</th>
                <th className="py-3.5 px-4">Priority & Status</th>
                <th className="py-3.5 px-4">Time Spent / Est</th>
                <th className="py-3.5 px-4">Dates</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasksLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading project tasks...
                  </td>
                </tr>
              ) : projectTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <CheckSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No tasks found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Create your first customization task or adjust filters.
                    </p>
                  </td>
                </tr>
              ) : (
                projectTasks.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Project & Title */}
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#0B1340]/10 text-[#0B1340] font-bold text-[10px]">
                          {t.project_name}
                        </span>
                        {t.client_name && (
                          <span className="text-[10px] text-slate-400">({t.client_name})</span>
                        )}
                      </div>
                      <p className="font-extrabold text-slate-900 mt-1 text-xs truncate" title={t.task_title}>
                        {t.task_title}
                      </p>
                      {t.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{t.description}</p>
                      )}
                    </td>

                    {/* Developer & Category */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t.assigned_to}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 font-medium">
                        <Tag className="w-3 h-3 text-slate-400" />
                        <span>{t.category}</span>
                      </div>
                    </td>

                    {/* Priority & Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${getPriorityBadge(
                            t.priority
                          )}`}
                        >
                          {t.priority}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${getStatusBadge(
                            t.status
                          )}`}
                        >
                          {t.status}
                        </span>
                      </div>
                    </td>

                    {/* Time Tracking */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <div>
                          <span className="font-extrabold text-slate-900">{t.spent_hours || 0} hrs</span>
                          <span className="text-[10px] text-slate-400 ml-1">/ {t.estimated_hours || 0}h est</span>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-28 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            (t.spent_hours || 0) > (t.estimated_hours || 1)
                              ? "bg-rose-500"
                              : "bg-blue-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              ((t.spent_hours || 0) / (t.estimated_hours || 1)) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 text-[11px] text-slate-600">
                      <div>
                        <span className="text-slate-400">Start:</span>{" "}
                        {t.start_date ? new Date(t.start_date).toLocaleDateString("en-IN") : "-"}
                      </div>
                      <div className="mt-0.5">
                        <span className="text-slate-400">Due:</span>{" "}
                        {t.due_date ? new Date(t.due_date).toLocaleDateString("en-IN") : "-"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setQuickLogTask(t);
                            setLogStatusInput(t.status);
                            setLogRemarksInput(t.remarks || "");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors cursor-pointer"
                          title="Log Time / Update Hours"
                        >
                          + Log Time
                        </button>

                        <button
                          onClick={() => openEditModal(t)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                          title="Edit Task"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${t.task_title}"?`)) {
                              handleDeleteTask(t._id);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                          title="Delete Task"
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
      </div>

      {/* ── CREATE / EDIT TASK MODAL ── */}
      {(isCreateModalOpen || editingTask) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingTask ? "Edit Project Task" : "Create New Project Task"}
              </h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingTask(null);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Project Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Project / Community <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Patel Parivar, Shah Community"
                    value={taskForm.project_name}
                    onChange={(e) => setTaskForm({ ...taskForm, project_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                    list="parivar-projects-list"
                  />
                  <datalist id="parivar-projects-list">
                    {parivars.map((p) => (
                      <option key={p._id} value={p.parivar_name} />
                    ))}
                  </datalist>
                </div>

                {/* Client Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client / Admin Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Patel"
                    value={taskForm.client_name}
                    onChange={(e) => setTaskForm({ ...taskForm, client_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                  />
                </div>
              </div>

              {/* Task Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Task Title / Requirement <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Add custom matrimony filter & blood group report"
                  value={taskForm.task_title}
                  onChange={(e) => setTaskForm({ ...taskForm, task_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Description / Details</label>
                <textarea
                  rows={2}
                  placeholder="Specify customization scope, requirements, logic..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Assignee */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assigned Developer <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Divyraj, Amit"
                    value={taskForm.assigned_to}
                    onChange={(e) => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                  >
                    <option value="Customization">Customization</option>
                    <option value="Feature">Feature</option>
                    <option value="Bug Fix">Bug Fix</option>
                    <option value="Design">Design</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Testing">Testing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Estimated Hours */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="e.g. 5"
                    value={taskForm.estimated_hours}
                    onChange={(e) => setTaskForm({ ...taskForm, estimated_hours: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                  />
                </div>

                {/* Spent Hours */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Spent Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="e.g. 3.5"
                    value={taskForm.spent_hours}
                    onChange={(e) => setTaskForm({ ...taskForm, spent_hours: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={taskForm.start_date}
                    onChange={(e) => setTaskForm({ ...taskForm, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskForm.due_date}
                    onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                  />
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Remarks / Internal Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Delivered to staging, client confirmed."
                  value={taskForm.remarks}
                  onChange={(e) => setTaskForm({ ...taskForm, remarks: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingTask(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1340] hover:bg-[#0d1855] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── QUICK LOG TIME MODAL ── */}
      {quickLogTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Log Working Time</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{quickLogTask.task_title}</p>
              </div>
              <button
                onClick={() => setQuickLogTask(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickLogSubmit} className="space-y-4 mt-4">
              <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Spent Time</span>
                  <span className="font-extrabold text-slate-900 text-sm">{quickLogTask.spent_hours || 0} Hours</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated</span>
                  <span className="font-extrabold text-blue-600 text-sm">{quickLogTask.estimated_hours || 0} Hours</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Add Additional Hours (hrs)</label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  placeholder="e.g. 1.5"
                  value={logHoursInput}
                  onChange={(e) => setLogHoursInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Update Status</label>
                <select
                  value={logStatusInput}
                  onChange={(e) => setLogStatusInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Testing">Testing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Work Note / Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Completed frontend API integration"
                  value={logRemarksInput}
                  onChange={(e) => setLogRemarksInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickLogTask(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1340] hover:bg-[#0d1855] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  Save Time Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
