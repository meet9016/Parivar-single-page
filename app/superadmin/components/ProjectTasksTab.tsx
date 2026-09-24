"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  Pause,
  RotateCcw,
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
  CheckSquare,
  Flame,
  Zap,
  Briefcase,
  SlidersHorizontal,
  ArrowRight,
  Check,
  ChevronRight
} from "lucide-react";
import * as XLSX from "xlsx";
import { useSuperAdmin, ProjectTask } from "../context/SuperAdminContext";
import { toast } from "sonner";

interface ActiveTimer {
  taskId: string;
  taskTitle: string;
  projectName: string;
  assignedTo: string;
  startTime: number;
  accumulatedMs: number;
  isPaused: boolean;
  lastResumeTime: number;
}

// ── CUSTOM THEMED SELECT DROPDOWN COMPONENT ──────────────────────────
interface CustomSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  badgeColor?: string;
  dotColor?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  className?: string;
  size?: "sm" | "md";
  searchable?: boolean;
  icon?: React.ReactNode;
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select option...",
  className = "",
  size = "md",
  searchable = false,
  icon,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable && searchQuery.trim()
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : options;

  return (
    <div ref={dropdownRef} className={`relative select-none ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 text-left transition-all duration-150 cursor-pointer ${
          size === "sm"
            ? "px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200/90 shadow-2xs hover:border-[#0B1340]/40"
            : "px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50/70 border border-slate-200 shadow-2xs hover:bg-white hover:border-[#0B1340]/40"
        } ${
          isOpen
            ? "ring-2 ring-[#0B1340]/15 border-[#0B1340] bg-white"
            : "text-slate-800"
        }`}
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          {selectedOption?.dotColor && (
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: selectedOption.dotColor }}
            />
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : <span className="text-slate-400">{placeholder}</span>}
          </span>
          {selectedOption?.badge && (
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase shrink-0 ${
                selectedOption.badgeColor || "bg-slate-100 text-slate-600"
              }`}
            >
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#0B1340]" : ""
          }`}
        />
      </button>

      {/* Options Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 min-w-[200px] max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 animate-in fade-in zoom-in-95 duration-150">
          {/* Search bar inside dropdown */}
          {searchable && (
            <div className="p-1.5 pb-2 border-b border-slate-100 mb-1">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B1340]"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* List Options */}
          <div className="max-h-60 overflow-y-auto space-y-0.5 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-slate-400 text-xs font-medium">
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#0B1340] text-white font-bold shadow-xs"
                        : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate min-w-0">
                      {opt.dotColor && (
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isSelected ? "ring-2 ring-white/60" : ""
                          }`}
                          style={{ backgroundColor: opt.dotColor }}
                        />
                      )}
                      <div className="truncate">
                        <div className="truncate">{opt.label}</div>
                        {opt.sublabel && (
                          <div
                            className={`text-[10px] font-normal truncate ${
                              isSelected ? "text-blue-100" : "text-slate-400"
                            }`}
                          >
                            {opt.sublabel}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {opt.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : opt.badgeColor || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);
  const [quickLogTask, setQuickLogTask] = useState<ProjectTask | null>(null);
  const [stopTimerTaskModal, setStopTimerTaskModal] = useState<{
    task: ProjectTask;
    elapsedSeconds: number;
    hoursDecimal: number;
  } | null>(null);

  // Manual Log form state
  const [logHoursInput, setLogHoursInput] = useState<string>("");
  const [logMode, setLogMode] = useState<"add" | "set">("add");
  const [logStatusInput, setLogStatusInput] = useState<string>("");
  const [logRemarksInput, setLogRemarksInput] = useState<string>("");

  // Create & Edit form state
  const [taskForm, setTaskForm] = useState({
    project_name: "",
    client_name: "",
    task_title: "",
    description: "",
    assigned_to: "",
    category: "Customization",
    priority: "Medium" as "Low" | "Medium" | "High" | "Urgent",
    status: "Pending" as "Pending" | "In Progress" | "Testing" | "Completed",
    estimated_hours: 1,
    spent_hours: 0,
    billable: true,
    start_date: "",
    due_date: "",
    remarks: "",
  });

  // Selected project filter view state
  const [selectedProjectTab, setSelectedProjectTab] = useState<string>("all");

  // ── LIVE TIMER STATE ─────────────────────────────────────────────────
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [elapsedDisplayMs, setElapsedDisplayMs] = useState<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load timer from localStorage on mount
  useEffect(() => {
    try {
      const savedTimerStr = localStorage.getItem("parivar_active_task_timer");
      if (savedTimerStr) {
        const savedTimer: ActiveTimer = JSON.parse(savedTimerStr);
        setActiveTimer(savedTimer);
      }
    } catch (e) {
      console.error("Failed to load saved timer:", e);
    }
  }, []);

  // Save timer to localStorage whenever it changes
  useEffect(() => {
    if (activeTimer) {
      localStorage.setItem("parivar_active_task_timer", JSON.stringify(activeTimer));
    } else {
      localStorage.removeItem("parivar_active_task_timer");
    }
  }, [activeTimer]);

  // Tick timer every second
  useEffect(() => {
    if (activeTimer && !activeTimer.isPaused) {
      const updateElapsed = () => {
        const now = Date.now();
        const currentRun = now - activeTimer.lastResumeTime;
        setElapsedDisplayMs(activeTimer.accumulatedMs + currentRun);
      };
      updateElapsed();
      timerIntervalRef.current = setInterval(updateElapsed, 500);
    } else if (activeTimer && activeTimer.isPaused) {
      setElapsedDisplayMs(activeTimer.accumulatedMs);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    } else {
      setElapsedDisplayMs(0);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [activeTimer]);

  // Format Milliseconds into HH:MM:SS
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Start Timer for a specific task
  const handleStartTimer = (task: ProjectTask) => {
    if (activeTimer && activeTimer.taskId === task._id) {
      if (activeTimer.isPaused) {
        const now = Date.now();
        setActiveTimer({
          ...activeTimer,
          isPaused: false,
          lastResumeTime: now,
        });
        toast.info(`Timer resumed for "${task.task_title}"`);
      }
      return;
    }

    if (activeTimer && activeTimer.taskId !== task._id) {
      const confirmSwitch = window.confirm(
        `Timer is currently active for "${activeTimer.taskTitle}". Do you want to stop it and start timer for "${task.task_title}"?`
      );
      if (!confirmSwitch) return;
    }

    const now = Date.now();
    setActiveTimer({
      taskId: task._id,
      taskTitle: task.task_title,
      projectName: task.project_name,
      assignedTo: task.assigned_to,
      startTime: now,
      accumulatedMs: 0,
      isPaused: false,
      lastResumeTime: now,
    });

    if (task.status === "Pending") {
      handleLogTaskTime(task._id, { status: "In Progress" });
    }

    toast.success(`⏱ Timer started for: ${task.task_title}`);
  };

  // Pause Timer
  const handlePauseTimer = () => {
    if (!activeTimer || activeTimer.isPaused) return;
    const now = Date.now();
    const additionalMs = now - activeTimer.lastResumeTime;
    setActiveTimer({
      ...activeTimer,
      accumulatedMs: activeTimer.accumulatedMs + additionalMs,
      isPaused: true,
      lastResumeTime: now,
    });
    toast.info("Timer paused");
  };

  // Resume Timer
  const handleResumeTimer = () => {
    if (!activeTimer || !activeTimer.isPaused) return;
    const now = Date.now();
    setActiveTimer({
      ...activeTimer,
      isPaused: false,
      lastResumeTime: now,
    });
    toast.info("Timer resumed");
  };

  // Stop Timer & Open Summary / Confirmation to Log Hours
  const handleStopTimer = (task?: ProjectTask) => {
    if (!activeTimer) return;
    const now = Date.now();
    let totalMs = activeTimer.accumulatedMs;
    if (!activeTimer.isPaused) {
      totalMs += now - activeTimer.lastResumeTime;
    }

    const targetTask = task || projectTasks.find((t) => t._id === activeTimer.taskId);
    if (!targetTask) {
      setActiveTimer(null);
      return;
    }

    const elapsedSeconds = Math.max(1, Math.floor(totalMs / 1000));
    const rawHours = totalMs / (1000 * 60 * 60);
    const roundedHours = Math.max(0.05, parseFloat(rawHours.toFixed(2)));

    setStopTimerTaskModal({
      task: targetTask,
      elapsedSeconds,
      hoursDecimal: roundedHours,
    });
    setLogRemarksInput(`Worked for ${formatTime(totalMs)} via live timer`);
    setLogStatusInput(targetTask.status);
  };

  // Save Stopped Timer to Backend
  const handleConfirmSaveTimerHours = async () => {
    if (!stopTimerTaskModal) return;
    const { task, hoursDecimal } = stopTimerTaskModal;

    const payload: any = {
      add_hours: hoursDecimal,
      status: logStatusInput || task.status,
      remarks: logRemarksInput || `Timer tracked: ${hoursDecimal}h`,
    };

    const ok = await handleLogTaskTime(task._id, payload);
    if (ok) {
      toast.success(`Logged ${hoursDecimal} hrs for "${task.task_title}"`);
      setActiveTimer(null);
      setStopTimerTaskModal(null);
      setLogRemarksInput("");
    }
  };

  // Discard active timer
  const handleDiscardTimer = () => {
    if (window.confirm("Are you sure you want to discard this timer session without logging time?")) {
      setActiveTimer(null);
      toast.info("Timer session discarded");
    }
  };

  // ── MODAL OPEN HANDLERS ──────────────────────────────────────────────
  const openCreateModal = () => {
    const defaultProject = parivars[0]?.parivar_name || "";
    const matchedParivar = parivars.find((p) => p.parivar_name === defaultProject);
    const clientName = matchedParivar
      ? `${matchedParivar.admin_first_name || ""} ${matchedParivar.admin_last_name || ""}`.trim()
      : "";

    setTaskForm({
      project_name: defaultProject,
      client_name: clientName,
      task_title: "",
      description: "",
      assigned_to: "",
      category: "Customization",
      priority: "Medium",
      status: "Pending",
      estimated_hours: 1,
      spent_hours: 0,
      billable: true,
      start_date: new Date().toISOString().split("T")[0],
      due_date: "",
      remarks: "",
    });
    setIsCreateModalOpen(true);
  };

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

  // Auto-fill client when project is changed in create modal
  const handleProjectSelectChange = (projectName: string) => {
    const matched = parivars.find((p) => p.parivar_name === projectName);
    const client = matched
      ? `${matched.admin_first_name || ""} ${matched.admin_last_name || ""}`.trim()
      : taskForm.client_name;

    setTaskForm((prev) => ({
      ...prev,
      project_name: projectName,
      client_name: client || prev.client_name,
    }));
  };

  // Submit Create or Edit Form
  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.project_name.trim()) {
      toast.error("Please select or enter a project name");
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

  // Submit Manual Quick Log Form
  const handleQuickLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLogTask) return;
    const hoursVal = parseFloat(logHoursInput);

    if (isNaN(hoursVal) && !logStatusInput && !logRemarksInput) {
      toast.error("Please provide hours or status update");
      return;
    }

    const payload: any = {};
    if (!isNaN(hoursVal)) {
      if (logMode === "add") payload.add_hours = hoursVal;
      else payload.set_hours = hoursVal;
    }
    if (logStatusInput) payload.status = logStatusInput;
    if (logRemarksInput) payload.remarks = logRemarksInput;

    const ok = await handleLogTaskTime(quickLogTask._id, payload);
    if (ok) {
      setQuickLogTask(null);
      setLogHoursInput("");
      setLogStatusInput("");
      setLogRemarksInput("");
      setLogMode("add");
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
      "Task Description": t.description || "-",
      "Task Category": t.category,
      "Assigned Developer": t.assigned_to,
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
    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(key.length + 4, 18),
    }));
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Project Tasks Report");

    const projectNameSuffix = taskFilters.project !== "all" ? `_${taskFilters.project}` : "";
    const fileName = `Project_Tasks_Time_Report${projectNameSuffix}_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success("Excel spreadsheet downloaded successfully!");
  };

  // Badges & Option Maps for Themed Selects
  const projectOptions: CustomSelectOption[] = [
    { value: "all", label: "All Projects", dotColor: "#64748B" },
    ...parivars.map((p) => ({
      value: p.parivar_name,
      label: p.parivar_name,
      sublabel: p.community_type || "Tenant",
      dotColor: "#2563EB",
    })),
    ...taskMeta.projectsList
      .filter((p) => !parivars.some((pr) => pr.parivar_name === p))
      .map((p) => ({
        value: p,
        label: p,
        sublabel: "Custom Project",
        dotColor: "#0D9488",
      })),
  ];

  const devOptions: CustomSelectOption[] = [
    { value: "all", label: "All Developers", dotColor: "#64748B" },
    ...taskMeta.devsList.map((d) => ({
      value: d,
      label: d,
      dotColor: "#6366F1",
    })),
  ];

  const statusOptions: CustomSelectOption[] = [
    { value: "all", label: "All Statuses", dotColor: "#64748B" },
    { value: "Pending", label: "Pending", dotColor: "#D97706", badgeColor: "bg-amber-50 text-amber-700" },
    { value: "In Progress", label: "In Progress", dotColor: "#2563EB", badgeColor: "bg-blue-50 text-blue-700" },
    { value: "Testing", label: "Testing", dotColor: "#9333EA", badgeColor: "bg-purple-50 text-purple-700" },
    { value: "Completed", label: "Completed", dotColor: "#10B981", badgeColor: "bg-emerald-50 text-emerald-700" },
  ];

  const formStatusOptions: CustomSelectOption[] = [
    { value: "Pending", label: "Pending", dotColor: "#D97706" },
    { value: "In Progress", label: "In Progress", dotColor: "#2563EB" },
    { value: "Testing", label: "Testing", dotColor: "#9333EA" },
    { value: "Completed", label: "Completed", dotColor: "#10B981" },
  ];

  const priorityOptions: CustomSelectOption[] = [
    { value: "all", label: "All Priorities", dotColor: "#64748B" },
    { value: "Urgent", label: "Urgent", dotColor: "#E11D48", badgeColor: "bg-rose-50 text-rose-700" },
    { value: "High", label: "High", dotColor: "#EA580C", badgeColor: "bg-orange-50 text-orange-700" },
    { value: "Medium", label: "Medium", dotColor: "#D97706", badgeColor: "bg-amber-50 text-amber-700" },
    { value: "Low", label: "Low", dotColor: "#64748B", badgeColor: "bg-slate-50 text-slate-600" },
  ];

  const formPriorityOptions: CustomSelectOption[] = [
    { value: "Urgent", label: "Urgent", dotColor: "#E11D48", badge: "Highest" },
    { value: "High", label: "High", dotColor: "#EA580C" },
    { value: "Medium", label: "Medium", dotColor: "#D97706" },
    { value: "Low", label: "Low", dotColor: "#64748B" },
  ];

  const categoryOptions: CustomSelectOption[] = [
    { value: "all", label: "All Categories", dotColor: "#64748B" },
    { value: "Customization", label: "Customization", dotColor: "#2563EB" },
    { value: "Feature", label: "Feature", dotColor: "#059669" },
    { value: "Bug Fix", label: "Bug Fix", dotColor: "#DC2626" },
    { value: "Design", label: "Design", dotColor: "#D946EF" },
    { value: "Maintenance", label: "Maintenance", dotColor: "#D97706" },
    { value: "Other", label: "Other", dotColor: "#64748B" },
  ];

  const formCategoryOptions: CustomSelectOption[] = [
    { value: "Customization", label: "Customization", dotColor: "#2563EB" },
    { value: "Feature", label: "Feature", dotColor: "#059669" },
    { value: "Bug Fix", label: "Bug Fix", dotColor: "#DC2626" },
    { value: "Design", label: "Design", dotColor: "#D946EF" },
    { value: "Maintenance", label: "Maintenance", dotColor: "#D97706" },
    { value: "Other", label: "Other", dotColor: "#64748B" },
  ];

  const modalProjectOptions: CustomSelectOption[] = parivars.map((p) => ({
    value: p.parivar_name,
    label: p.parivar_name,
    sublabel: `${p.community_type || "Community Tenant"} • ${p.village_name || ""}`,
    dotColor: "#2563EB",
  }));

  // Helper badge styles
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-rose-50 text-rose-700 border-rose-200";
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
      {/* ── LIVE ACTIVE TIMER STICKY BANNER ── */}
      {activeTimer && (
        <div className="bg-gradient-to-r from-[#0B1340] via-[#12206B] to-[#1E3A8A] text-white rounded-2xl p-4 shadow-xl border border-blue-900/40 flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner">
                <Clock className={`w-6 h-6 ${!activeTimer.isPaused ? "animate-spin text-emerald-400" : "text-amber-400"}`} style={{ animationDuration: "3s" }} />
              </div>
              {!activeTimer.isPaused && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0B1340]"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-400/20 text-blue-200 font-bold text-[10px] tracking-wide uppercase border border-blue-300/20">
                  {activeTimer.projectName}
                </span>
                <span className="text-xs text-blue-200/80 font-medium">Assigned: {activeTimer.assignedTo}</span>
                {activeTimer.isPaused && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-bold text-[10px]">
                    PAUSED
                  </span>
                )}
              </div>
              <h3 className="text-sm font-extrabold text-white mt-0.5 max-w-md truncate">
                {activeTimer.taskTitle}
              </h3>
            </div>
          </div>

          {/* Stopwatch Display & Actions */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200/70 block">
                Live Working Timer
              </span>
              <span className="font-mono text-2xl font-black text-white tracking-wider drop-shadow-sm">
                {formatTime(elapsedDisplayMs)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {activeTimer.isPaused ? (
                <button
                  onClick={handleResumeTimer}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold transition-all cursor-pointer shadow-md"
                  title="Resume Timer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  onClick={handlePauseTimer}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/90 hover:bg-amber-500 text-white text-xs font-extrabold transition-all cursor-pointer shadow-md"
                  title="Pause Timer"
                >
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={() => handleStopTimer()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all cursor-pointer shadow-md"
                title="Stop Timer & Log Time"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Stop & Log</span>
              </button>

              <button
                onClick={handleDiscardTimer}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white transition-colors cursor-pointer"
                title="Discard Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Top Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Tasks</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">{taskMeta.totalTasks}</span>
              <span className="text-xs text-slate-400 font-medium">({taskMeta.filteredTasks} in view)</span>
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
              <span className="text-xs text-slate-400 font-medium">/ {taskMeta.totalEstimatedHours}h est</span>
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
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Registered Parivars / Projects */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Projects & Devs</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-indigo-600">{parivars.length || taskMeta.projectsList.length}</span>
              <span className="text-xs text-slate-400 font-medium">
                Parivars • {taskMeta.devsList.length} Developers
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── PROJECT SELECTOR QUICK TABS ── */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-2 px-1">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
              Select Project / Parivar:
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Showing tasks linked to All Parivars
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              setSelectedProjectTab("all");
              setTaskFilters((prev) => ({ ...prev, project: "all" }));
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              taskFilters.project === "all"
                ? "bg-[#0B1340] text-white shadow-sm"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
            }`}
          >
            All Projects ({taskMeta.totalTasks})
          </button>

          {parivars.map((p) => {
            const pStats = taskMeta.projectStats[p.parivar_name];
            const taskCount = pStats?.count || 0;
            const spentHrs = pStats?.spent || 0;
            const isSelected = taskFilters.project === p.parivar_name;

            return (
              <button
                key={p._id}
                onClick={() => {
                  setSelectedProjectTab(p.parivar_name);
                  setTaskFilters((prev) => ({ ...prev, project: p.parivar_name }));
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[#0B1340] text-white border-[#0B1340] shadow-sm"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                <span>{p.parivar_name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {taskCount} {taskCount === 1 ? "task" : "tasks"}
                  {spentHrs > 0 ? ` • ${spentHrs}h` : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Action & Themed Filter Bar ── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by project, task title, developer, client, description..."
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

        {/* Themed Select Filters */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px] tracking-wider pr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Project Filter */}
          <CustomSelect
            value={taskFilters.project}
            onChange={(val) => {
              setSelectedProjectTab(val);
              setTaskFilters((prev) => ({ ...prev, project: val }));
            }}
            options={projectOptions}
            size="sm"
            searchable={true}
            className="min-w-[150px]"
          />

          {/* Developer Filter */}
          <CustomSelect
            value={taskFilters.assigned_to}
            onChange={(val) => setTaskFilters((prev) => ({ ...prev, assigned_to: val }))}
            options={devOptions}
            size="sm"
            searchable={true}
            className="min-w-[145px]"
          />

          {/* Status Filter */}
          <CustomSelect
            value={taskFilters.status}
            onChange={(val) => setTaskFilters((prev) => ({ ...prev, status: val }))}
            options={statusOptions}
            size="sm"
            className="min-w-[130px]"
          />

          {/* Priority Filter */}
          <CustomSelect
            value={taskFilters.priority}
            onChange={(val) => setTaskFilters((prev) => ({ ...prev, priority: val }))}
            options={priorityOptions}
            size="sm"
            className="min-w-[130px]"
          />

          {/* Category Filter */}
          <CustomSelect
            value={taskFilters.category}
            onChange={(val) => setTaskFilters((prev) => ({ ...prev, category: val }))}
            options={categoryOptions}
            size="sm"
            className="min-w-[140px]"
          />

          {(taskFilters.project !== "all" ||
            taskFilters.status !== "all" ||
            taskFilters.assigned_to !== "all" ||
            taskFilters.priority !== "all" ||
            taskFilters.category !== "all" ||
            taskSearch) && (
            <button
              onClick={() => {
                setTaskSearch("");
                setSelectedProjectTab("all");
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
                <th className="py-3.5 px-4">Project & Task Title</th>
                <th className="py-3.5 px-4">Assignee & Category</th>
                <th className="py-3.5 px-4">Priority & Status</th>
                <th className="py-3.5 px-4">Live Timer & Hours</th>
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
                      Select a project or create a new customization task.
                    </p>
                  </td>
                </tr>
              ) : (
                projectTasks.map((t) => {
                  const isTimerRunningOnThisTask = activeTimer && activeTimer.taskId === t._id;

                  return (
                    <tr
                      key={t._id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isTimerRunningOnThisTask ? "bg-blue-50/40 border-l-4 border-l-blue-600" : ""
                      }`}
                    >
                      {/* Project & Title */}
                      <td className="py-3.5 px-4 max-w-[280px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
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
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5" title={t.description}>
                            {t.description}
                          </p>
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
                        {t.remarks && (
                          <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[140px]" title={t.remarks}>
                            📝 {t.remarks}
                          </p>
                        )}
                      </td>

                      {/* Live Timer & Time Tracking */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {isTimerRunningOnThisTask ? (
                            <button
                              onClick={() => handleStopTimer(t)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] shadow-sm transition-all cursor-pointer animate-pulse"
                              title="Stop Running Timer & Log Time"
                            >
                              <Square className="w-3 h-3 fill-white" />
                              <span>{formatTime(elapsedDisplayMs)}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartTimer(t)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[10px] transition-all cursor-pointer"
                              title="Start Live Stopwatch Timer for this Task"
                            >
                              <Play className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                              <span>Start Timer</span>
                            </button>
                          )}

                          <div>
                            <span className="font-extrabold text-slate-900">{t.spent_hours || 0} hrs</span>
                            <span className="text-[10px] text-slate-400 ml-1">/ {t.estimated_hours || 0}h est</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
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
                              setLogHoursInput("");
                              setLogMode("add");
                              setLogStatusInput(t.status);
                              setLogRemarksInput(t.remarks || "");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors cursor-pointer"
                            title="Log Hours Manually"
                          >
                            + Manual Log
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
                              if (window.confirm(`Are you sure you want to delete task "${t.task_title}"?`)) {
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CREATE / EDIT TASK MODAL ── */}
      {(isCreateModalOpen || editingTask) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingTask ? "Edit Project Task" : "Create New Project Task"}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Assign tasks to projects & developers with estimated work time
                </p>
              </div>
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
                {/* Project Themed Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Project / Parivar <span className="text-rose-500">*</span>
                  </label>
                  <CustomSelect
                    value={taskForm.project_name}
                    onChange={(val) => handleProjectSelectChange(val)}
                    options={modalProjectOptions}
                    searchable={true}
                    placeholder="Select Parivar Project..."
                  />
                  {/* Or Custom project input */}
                  <input
                    type="text"
                    placeholder="Or type custom project name..."
                    value={taskForm.project_name}
                    onChange={(e) => setTaskForm({ ...taskForm, project_name: e.target.value })}
                    className="w-full px-3 py-1.5 mt-1.5 rounded-lg bg-slate-50/50 border border-dashed border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B1340]"
                  />
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

                {/* Category Themed Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <CustomSelect
                    value={taskForm.category}
                    onChange={(val) => setTaskForm({ ...taskForm, category: val })}
                    options={formCategoryOptions}
                  />
                </div>

                {/* Priority Themed Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <CustomSelect
                    value={taskForm.priority}
                    onChange={(val) => setTaskForm({ ...taskForm, priority: val as any })}
                    options={formPriorityOptions}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Status Themed Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <CustomSelect
                    value={taskForm.status}
                    onChange={(val) => setTaskForm({ ...taskForm, status: val as any })}
                    options={formStatusOptions}
                  />
                </div>

                {/* Estimated Hours */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Hours (hrs)</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    placeholder="e.g. 5.5"
                    value={taskForm.estimated_hours}
                    onChange={(e) => setTaskForm({ ...taskForm, estimated_hours: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                  />
                </div>

                {/* Spent Hours */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Spent Hours (hrs)</label>
                  <input
                    type="number"
                    step="0.25"
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

      {/* ── STOP TIMER & CONFIRM LOG MODAL ── */}
      {stopTimerTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Log Timer Session</h3>
                  <p className="text-[11px] text-slate-400 font-medium truncate max-w-[240px]">
                    {stopTimerTaskModal.task.task_title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStopTimerTaskModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Stopwatch Tracked Time
                  </span>
                  <span className="font-mono text-xl font-black text-blue-900">
                    {formatTime(stopTimerTaskModal.elapsedSeconds * 1000)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Calculated Hours
                  </span>
                  <span className="text-lg font-black text-emerald-600">
                    +{stopTimerTaskModal.hoursDecimal} hrs
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hours to Add (you can adjust if needed)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  value={stopTimerTaskModal.hoursDecimal}
                  onChange={(e) =>
                    setStopTimerTaskModal({
                      ...stopTimerTaskModal,
                      hoursDecimal: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Update Task Status</label>
                <CustomSelect
                  value={logStatusInput}
                  onChange={(val) => setLogStatusInput(val)}
                  options={formStatusOptions}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Work Note / Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Built export excel feature and fixed timer logic"
                  value={logRemarksInput}
                  onChange={(e) => setLogRemarksInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStopTimerTaskModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSaveTimerHours}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Save & Log Working Time
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MANUAL QUICK LOG TIME MODAL ── */}
      {quickLogTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Log Task Working Hours</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium truncate max-w-[280px]">
                  {quickLogTask.task_title}
                </p>
              </div>
              <button
                onClick={() => setQuickLogTask(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickLogSubmit} className="space-y-4 mt-4">
              <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Spent Time</span>
                  <span className="font-extrabold text-slate-900 text-sm">{quickLogTask.spent_hours || 0} Hours</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated</span>
                  <span className="font-extrabold text-blue-600 text-sm">{quickLogTask.estimated_hours || 0} Hours</span>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center rounded-xl bg-slate-100 p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLogMode("add")}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    logMode === "add" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  + Add Additional Hours
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLogMode("set");
                    setLogHoursInput(String(quickLogTask.spent_hours || 0));
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    logMode === "set" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Set Total Hours
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {logMode === "add" ? "Hours to Add (hrs)" : "Exact Total Hours (hrs)"}
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  placeholder="e.g. 2.5"
                  value={logHoursInput}
                  onChange={(e) => setLogHoursInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Update Status</label>
                <CustomSelect
                  value={logStatusInput}
                  onChange={(val) => setLogStatusInput(val)}
                  options={formStatusOptions}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Work Note / Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Added custom API filter and responsive styles"
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
