"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
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
  TrendingUp,
  FileSpreadsheet,
  X,
  ChevronDown,
  CheckSquare,
  Briefcase,
  Check,
  FileUp,
  HelpCircle
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
  placeholder = "Select...",
  className = "",
  size = "md",
  searchable = false,
  icon,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 text-left transition-all duration-150 cursor-pointer ${
          size === "sm"
            ? "px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 hover:border-slate-300"
            : "px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-50 border border-slate-200 hover:bg-white hover:border-slate-300"
        } ${
          isOpen ? "ring-2 ring-[#0B1340]/10 border-[#0B1340] bg-white" : "text-slate-800"
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
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-150 ${
            isOpen ? "rotate-180 text-[#0B1340]" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 min-w-[200px] max-w-sm bg-white rounded-xl shadow-lg border border-slate-100 p-1 animate-in fade-in duration-100">
          {searchable && (
            <div className="p-1 border-b border-slate-100 mb-1">
              <div className="relative">
                <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full pl-7 pr-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B1340]"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="max-h-56 overflow-y-auto space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-3 text-center text-slate-400 text-xs">No results found</div>
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
                    className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#0B1340] text-white font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate min-w-0">
                      {opt.dotColor && (
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: opt.dotColor }}
                        />
                      )}
                      <div className="truncate">
                        <div className="truncate">{opt.label}</div>
                        {opt.sublabel && (
                          <div
                            className={`text-[10px] truncate ${
                              isSelected ? "text-blue-100" : "text-slate-400"
                            }`}
                          >
                            {opt.sublabel}
                          </div>
                        )}
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
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
    handleBatchImportTasks,
    parivars,
  } = useSuperAdmin();

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
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

  // Simplified Hours & Minutes state
  const [taskHours, setTaskHours] = useState<number>(0);
  const [taskMinutes, setTaskMinutes] = useState<number>(0);

  // Create & Edit form state
  const [taskForm, setTaskForm] = useState({
    project_name: "",
    client_name: "",
    task_title: "",
    description: "",
    assigned_to: "",
    category: "Customization",
    priority: "Medium" as "Low" | "Medium" | "High" | "Urgent",
    status: "Pending" as "Pending" | "In Progress" | "Testing" | "Completed" | "On Hold" | "Cancelled",
    estimated_hours: 1,
    spent_hours: 0,
    billable: true,
    start_date: "",
    due_date: "",
    remarks: "",
  });

  // Excel Import State
  const [importParsedTasks, setImportParsedTasks] = useState<any[]>([]);
  const [importFileName, setImportFileName] = useState<string>("");
  const [importLoading, setImportLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── LIVE TIMER STATE ─────────────────────────────────────────────────
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [elapsedDisplayMs, setElapsedDisplayMs] = useState<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load timer from localStorage
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

  // Save timer to localStorage
  useEffect(() => {
    if (activeTimer) {
      localStorage.setItem("parivar_active_task_timer", JSON.stringify(activeTimer));
    } else {
      localStorage.removeItem("parivar_active_task_timer");
    }
  }, [activeTimer]);

  // Tick timer
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

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

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
        `Timer is currently running for "${activeTimer.taskTitle}". Do you want to switch timer to "${task.task_title}"?`
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

    toast.success(`Timer started for: ${task.task_title}`);
  };

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
    setLogRemarksInput(`Worked ${formatTime(totalMs)} via live timer`);
    setLogStatusInput(targetTask.status);
  };

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

  const handleDiscardTimer = () => {
    if (window.confirm("Do you want to discard this timer without saving?")) {
      setActiveTimer(null);
      toast.info("Timer session discarded");
    }
  };

  // ── MODAL OPEN HANDLERS ──────────────────────────────────────────────
  // Working hours options (0.25 to 12.0 in 15-min intervals)
  const workingHourOptions: CustomSelectOption[] = Array.from({ length: 48 }, (_, i) => {
    const val = (i + 1) * 0.25;
    const hrs = Math.floor(val);
    const mins = Math.round((val % 1) * 60);
    const label = mins > 0 ? (hrs > 0 ? `${hrs} hr ${mins} min (${val}h)` : `${mins} min (${val}h)`) : `${hrs} hr (${val}h)`;
    return {
      value: String(val),
      label: label,
    };
  });

  // Modal open handlers
  const openCreateModal = () => {
    const defaultProject = parivars[0]?.parivar_name || "";
    const matchedParivar = parivars.find((p) => p.parivar_name === defaultProject);
    const clientName = matchedParivar
      ? `${matchedParivar.admin_first_name || ""} ${matchedParivar.admin_last_name || ""}`.trim()
      : "";

    setTaskHours(0);
    setTaskMinutes(0);
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
      spent_hours: 1,
      billable: true,
      start_date: new Date().toISOString().split("T")[0],
      due_date: "",
      remarks: "",
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (task: ProjectTask) => {
    setEditingTask(task);
    const totalSpent = task.spent_hours || task.estimated_hours || 1;
    const h = Math.floor(totalSpent);
    const m = Math.round((totalSpent % 1) * 60);
    setTaskHours(h);
    setTaskMinutes(m);

    setTaskForm({
      project_name: task.project_name,
      client_name: task.client_name || "",
      task_title: task.task_title,
      description: task.description || "",
      assigned_to: task.assigned_to || "",
      category: task.category || "Customization",
      priority: task.priority || "Medium",
      status: task.status || "Pending",
      estimated_hours: task.estimated_hours || 1,
      spent_hours: task.spent_hours || 1,
      billable: task.billable ?? true,
      start_date: task.start_date ? task.start_date.split("T")[0] : new Date().toISOString().split("T")[0],
      due_date: task.due_date ? task.due_date.split("T")[0] : "",
      remarks: task.remarks || "",
    });
  };

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

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.project_name.trim()) {
      toast.error("Please select a project/parivar name");
      return;
    }
    if (!taskForm.assigned_to.trim()) {
      toast.error("Please enter developer name");
      return;
    }

    const calculatedHours = Number(taskForm.spent_hours) || 1;
    const taskTitle = taskForm.description ? (taskForm.description.length > 50 ? taskForm.description.slice(0, 47) + "..." : taskForm.description) : `${taskForm.project_name} Work`;

    const payload = {
      ...taskForm,
      task_title: taskForm.task_title || taskTitle,
      spent_hours: calculatedHours,
      estimated_hours: calculatedHours,
      assigned_to: taskForm.assigned_to.trim(),
    };

    if (editingTask) {
      const ok = await handleUpdateTask(editingTask._id, payload);
      if (ok) setEditingTask(null);
    } else {
      const ok = await handleCreateTask(payload);
      if (ok) setIsCreateModalOpen(false);
    }
  };

  const handleQuickLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLogTask) return;
    const hoursVal = parseFloat(logHoursInput);

    if (isNaN(hoursVal) && !logStatusInput && !logRemarksInput) {
      toast.error("Please provide hours or status");
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

  // ── EXCEL EXPORT (PROJECT-SPECIFIC OR ALL) ──────────────────────────
  const handleExportExcel = () => {
    if (projectTasks.length === 0) {
      toast.error("No tasks to export!");
      return;
    }

    const exportData = projectTasks.map((t, idx) => ({
      "Sr No": idx + 1,
      "Project Name": t.project_name,
      "Client Name": t.client_name || "",
      "Task Title": t.task_title,
      "Description": t.description || "",
      "Category": t.category,
      "Assigned Developer": t.assigned_to,
      "Priority": t.priority,
      "Status": t.status,
      "Estimated Hours": t.estimated_hours || 0,
      "Spent Hours": t.spent_hours || 0,
      "Variance (Est - Spent)": ((t.estimated_hours || 0) - (t.spent_hours || 0)).toFixed(2),
      "Start Date": t.start_date ? new Date(t.start_date).toLocaleDateString("en-IN") : "",
      "Due Date": t.due_date ? new Date(t.due_date).toLocaleDateString("en-IN") : "",
      "Remarks / Notes": t.remarks || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(key.length + 4, 16),
    }));
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks_Report");

    const projectPrefix = taskFilters.project !== "all" ? `${taskFilters.project}_` : "All_Projects_";
    const fileName = `${projectPrefix}Tasks_Report_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success(
      taskFilters.project !== "all"
        ? `Downloaded report for project "${taskFilters.project}" with all task hours!`
        : "Downloaded all project tasks report!"
    );
  };

  interface ValidatedImportTask {
    raw: any;
    project_name: string;
    task_title: string;
    assigned_to: string;
    client_name: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    estimated_hours: number;
    spent_hours: number;
    start_date: string;
    due_date: string;
    remarks: string;
    errors: string[];
    isValid: boolean;
  }

  const [importValidationList, setImportValidationList] = useState<ValidatedImportTask[]>([]);

  // ── EXCEL IMPORT HANDLING WITH VALIDATION ────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (!rawJson || rawJson.length === 0) {
          toast.error("The uploaded Excel file is empty!");
          return;
        }

        // Validate each row
        const validated: ValidatedImportTask[] = rawJson.map((row, index) => {
          const rowErrors: string[] = [];

          const projectName = String(row['Project Name'] || row['project_name'] || row['Project / Community Name'] || row.Project || '').trim();
          const taskTitle = String(row['Task Title'] || row['task_title'] || row.Task || row.Title || '').trim();
          const assignedTo = String(row['Assigned Developer'] || row['assigned_to'] || row['Assigned To'] || row.Developer || '').trim();
          const clientName = String(row['Client Name'] || row['client_name'] || row.Client || '').trim();
          const description = String(row['Description'] || row['Task Description'] || row['description'] || '').trim();
          const category = String(row['Category'] || row['Task Category'] || row['category'] || 'Customization').trim();
          const remarks = String(row['Remarks'] || row['Remarks / Notes'] || row['remarks'] || '').trim();

          // Priority validation
          const rawPriority = String(row['Priority'] || row['priority'] || 'Medium').trim();
          const priority = ['Low', 'Medium', 'High', 'Urgent'].includes(rawPriority) ? rawPriority : 'Medium';

          // Status validation
          const rawStatus = String(row['Status'] || row['status'] || 'Pending').trim();
          const status = ['Pending', 'In Progress', 'Testing', 'Completed'].includes(rawStatus) ? rawStatus : 'Pending';

          // Hours validation
          const rawEst = row['Estimated Hours'] ?? row['estimated_hours'] ?? row.Estimated ?? 0;
          const estimated_hours = isNaN(Number(rawEst)) ? 0 : Math.max(0, Number(rawEst));

          const rawSpent = row['Spent Hours'] ?? row['spent_hours'] ?? row.Spent ?? 0;
          const spent_hours = isNaN(Number(rawSpent)) ? 0 : Math.max(0, Number(rawSpent));

          // Required field checks
          if (!projectName) {
            rowErrors.push("Missing Project Name");
          }
          if (!taskTitle) {
            rowErrors.push("Missing Task Title");
          }
          if (!assignedTo) {
            rowErrors.push("Missing Assigned Developer");
          }

          return {
            raw: row,
            project_name: projectName || "Untitled Project",
            task_title: taskTitle || "Untitled Task",
            assigned_to: assignedTo || "Unassigned",
            client_name: clientName,
            description: description,
            category: category,
            priority: priority,
            status: status,
            estimated_hours: estimated_hours,
            spent_hours: spent_hours,
            start_date: String(row['Start Date'] || row['start_date'] || ''),
            due_date: String(row['Due Date'] || row['due_date'] || ''),
            remarks: remarks,
            errors: rowErrors,
            isValid: rowErrors.length === 0,
          };
        });

        setImportParsedTasks(rawJson);
        setImportValidationList(validated);
        setIsImportModalOpen(true);
      } catch (err) {
        console.error("Failed to parse excel file", err);
        toast.error("Could not parse Excel file. Please download the sample template.");
      }
    };

    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadSampleTemplate = () => {
    const sampleData = [
      {
        "Project Name": "Patel Parivar",
        "Client Name": "Ramesh Patel",
        "Task Title": "Custom Matrimony Filter",
        "Description": "Add blood group and sub-caste filter on matrimony list",
        "Assigned Developer": "Divyraj",
        "Status": "Pending",
        "Estimated Hours": 4.5,
        "Spent Hours": 0,
        "Start Date": "2026-09-24",
        "Due Date": "2026-09-26",
        "Remarks": "Requested by client",
      },
      {
        "Project Name": "Shah Community",
        "Client Name": "Amit Shah",
        "Task Title": "Member Export to Excel",
        "Description": "Export members directory to XLSX",
        "Assigned Developer": "Amit",
        "Status": "In Progress",
        "Estimated Hours": 2,
        "Spent Hours": 1,
        "Start Date": "2026-09-24",
        "Due Date": "2026-09-25",
        "Remarks": "In progress",
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const colWidths = Object.keys(sampleData[0] || {}).map((key) => ({
      wch: Math.max(key.length + 4, 16),
    }));
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks_Template");
    XLSX.writeFile(workbook, "Project_Tasks_Sample_Template.xlsx");
    toast.success("Sample template downloaded! You can fill this sheet and upload directly.");
  };

  const handleConfirmBatchImport = async () => {
    if (importValidationList.length === 0) return;
    
    // Check if there are any critical errors
    const invalidCount = importValidationList.filter(t => !t.isValid).length;
    if (invalidCount > 0) {
      toast.error(`Please fix ${invalidCount} invalid row(s) in your Excel sheet or download sample template`);
      return;
    }

    setImportLoading(true);
    const payload = importValidationList.map(t => ({
      project_name: t.project_name,
      client_name: t.client_name,
      task_title: t.task_title,
      description: t.description,
      assigned_to: t.assigned_to,
      category: t.category,
      priority: t.priority,
      status: t.status,
      estimated_hours: t.estimated_hours,
      spent_hours: t.spent_hours,
      start_date: t.start_date,
      due_date: t.due_date,
      remarks: t.remarks,
    }));

    const ok = await handleBatchImportTasks(payload);
    setImportLoading(false);
    if (ok) {
      setIsImportModalOpen(false);
      setImportParsedTasks([]);
      setImportValidationList([]);
      setImportFileName("");
    }
  };

  // Dropdown options
  const projectOptions: CustomSelectOption[] = [
    { value: "all", label: "All Projects" },
    ...parivars.map((p) => ({
      value: p.parivar_name,
      label: p.parivar_name,
      sublabel: p.community_type || "Parivar",
    })),
    ...taskMeta.projectsList
      .filter((p) => !parivars.some((pr) => pr.parivar_name === p))
      .map((p) => ({
        value: p,
        label: p,
        sublabel: "Custom Project",
      })),
  ];

  const devOptions: CustomSelectOption[] = [
    { value: "all", label: "All Developers" },
    ...taskMeta.devsList.map((d) => ({
      value: d,
      label: d,
    })),
  ];

  const statusOptions: CustomSelectOption[] = [
    { value: "all", label: "All Statuses" },
    { value: "Pending", label: "Pending", dotColor: "#D97706" },
    { value: "In Progress", label: "In Progress", dotColor: "#2563EB" },
    { value: "Testing", label: "Testing", dotColor: "#9333EA" },
    { value: "Completed", label: "Completed", dotColor: "#10B981" },
  ];

  const formStatusOptions: CustomSelectOption[] = [
    { value: "Pending", label: "Pending", dotColor: "#D97706" },
    { value: "In Progress", label: "In Progress", dotColor: "#2563EB" },
    { value: "Testing", label: "Testing", dotColor: "#9333EA" },
    { value: "Completed", label: "Completed", dotColor: "#10B981" },
  ];

  const priorityOptions: CustomSelectOption[] = [
    { value: "all", label: "All Priorities" },
    { value: "Urgent", label: "Urgent", dotColor: "#E11D48" },
    { value: "High", label: "High", dotColor: "#EA580C" },
    { value: "Medium", label: "Medium", dotColor: "#D97706" },
    { value: "Low", label: "Low", dotColor: "#64748B" },
  ];

  const formPriorityOptions: CustomSelectOption[] = [
    { value: "Urgent", label: "Urgent", dotColor: "#E11D48" },
    { value: "High", label: "High", dotColor: "#EA580C" },
    { value: "Medium", label: "Medium", dotColor: "#D97706" },
    { value: "Low", label: "Low", dotColor: "#64748B" },
  ];

  const categoryOptions: CustomSelectOption[] = [
    { value: "all", label: "All Categories" },
    { value: "Customization", label: "Customization" },
    { value: "Feature", label: "Feature" },
    { value: "Bug Fix", label: "Bug Fix" },
    { value: "Design", label: "Design" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Other", label: "Other" },
  ];

  const modalProjectOptions: CustomSelectOption[] = parivars.map((p) => ({
    value: p.parivar_name,
    label: p.parivar_name,
    sublabel: p.community_type || "Parivar",
  }));

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
    <div className="space-y-5 font-sans">
      {/* Hidden File Input for Excel Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls, .csv"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* ── LIVE ACTIVE TIMER BANNER (LIGHT THEME) ── */}
      {activeTimer && (
        <div className="bg-white border-2 border-blue-500/30 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Clock className={`w-5 h-5 ${!activeTimer.isPaused ? "text-blue-600 animate-pulse" : "text-amber-500"}`} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[10px] tracking-wide uppercase">
                  {activeTimer.projectName}
                </span>
                <span className="text-xs font-semibold text-slate-600">Developer: {activeTimer.assignedTo}</span>
                {activeTimer.isPaused ? (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                    PAUSED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    RECORDING
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1 truncate max-w-md">
                {activeTimer.taskTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Working Timer
              </span>
              <span className="font-mono text-2xl font-black text-slate-900 tracking-tight">
                {formatTime(elapsedDisplayMs)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {activeTimer.isPaused ? (
                <button
                  onClick={handleResumeTimer}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  onClick={handlePauseTimer}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={() => handleStopTimer()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>Stop & Log</span>
              </button>

              <button
                onClick={handleDiscardTimer}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200"
                title="Discard Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Top Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Tasks</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">{taskMeta.totalTasks}</span>
              <span className="text-xs text-slate-400 font-medium">({taskMeta.filteredTasks} in view)</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Hours Spent</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-blue-600">{taskMeta.totalSpentHours} hrs</span>
              <span className="text-xs text-slate-400 font-medium">/ {taskMeta.totalEstimatedHours}h est</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Task Status</span>
            <div className="flex items-center gap-2 mt-1.5 text-xs font-semibold">
              <span className="text-amber-600">{taskMeta.statusCounts.Pending || 0} Pending</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-600">{taskMeta.statusCounts["In Progress"] || 0} In Progress</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600">{taskMeta.statusCounts.Completed || 0} Done</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Projects & Devs</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-800">{parivars.length || taskMeta.projectsList.length}</span>
              <span className="text-xs text-slate-400 font-medium">
                Parivars • {taskMeta.devsList.length} Developers
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── Action & Filter Bar ── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by project, task title, developer, client, description..."
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1340]/15"
            />
          </div>

          {/* Action Buttons: Import, Export, Add Task */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title="Import Tasks from Excel / CSV"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Import Excel</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title="Download Excel Spreadsheet Report"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Download Excel</span>
            </button>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B1340] hover:bg-[#070D2B] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Work Hours</span>
            </button>
          </div>
        </div>

        {/* Themed Select Filters (Clean & Simple) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px] tracking-wider pr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <CustomSelect
            value={taskFilters.project}
            onChange={(val) => setTaskFilters((prev) => ({ ...prev, project: val }))}
            options={projectOptions}
            size="sm"
            searchable={true}
            className="min-w-[150px]"
          />

          <CustomSelect
            value={taskFilters.assigned_to}
            onChange={(val) => setTaskFilters((prev) => ({ ...prev, assigned_to: val }))}
            options={devOptions}
            size="sm"
            searchable={true}
            className="min-w-[150px]"
          />

          <CustomSelect
            value={taskFilters.status}
            onChange={(val) => setTaskFilters((prev) => ({ ...prev, status: val }))}
            options={statusOptions}
            size="sm"
            className="min-w-[130px]"
          />

          {(taskFilters.project !== "all" ||
            taskFilters.status !== "all" ||
            taskFilters.assigned_to !== "all" ||
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
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Project & Task Title</th>
                <th className="py-3.5 px-4">Assigned Developer</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Live Timer & Hours Spent</th>
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
                      Create a task or click "Import Excel" to upload tasks.
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
                        isTimerRunningOnThisTask ? "bg-blue-50/30" : ""
                      }`}
                    >
                      {/* Project & Title */}
                      <td className="py-3.5 px-4 max-w-[280px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[10px]">
                            {t.project_name}
                          </span>
                          {t.client_name && (
                            <span className="text-[10px] text-slate-400">({t.client_name})</span>
                          )}
                        </div>
                        <p className="font-bold text-slate-900 mt-1 text-xs truncate" title={t.task_title}>
                          {t.task_title}
                        </p>
                        {t.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5" title={t.description}>
                            {t.description}
                          </p>
                        )}
                      </td>

                      {/* Developer */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{t.assigned_to}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold ${getStatusBadge(
                            t.status
                          )}`}
                        >
                          {t.status}
                        </span>
                        {t.remarks && (
                          <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[140px]" title={t.remarks}>
                            {t.remarks}
                          </p>
                        )}
                      </td>

                      {/* Live Timer & Time Tracking */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {isTimerRunningOnThisTask ? (
                            <button
                              onClick={() => handleStopTimer(t)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-sm transition-all cursor-pointer"
                              title="Stop Running Timer"
                            >
                              <Square className="w-3 h-3 fill-white" />
                              <span>{formatTime(elapsedDisplayMs)}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartTimer(t)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold text-[10px] transition-all cursor-pointer"
                              title="Start Timer for this Task"
                            >
                              <Play className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                              <span>Start Timer</span>
                            </button>
                          )}

                          <div className="text-xs">
                            <span className="font-bold text-slate-900">{t.spent_hours || 0} hrs</span>
                            <span className="text-[10px] text-slate-400 ml-1">/ {t.estimated_hours || 0}h est</span>
                          </div>
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
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] transition-colors cursor-pointer"
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

      {/* ── EXCEL IMPORT PREVIEW MODAL WITH ROW VALIDATION ── */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-6 shadow-2xl border border-slate-100 my-8 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Import Tasks from Excel</h3>
                  <p className="text-xs text-slate-500">
                    File: <span className="font-semibold text-slate-700">{importFileName}</span> ({importValidationList.length} rows detected)
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportParsedTasks([]);
                  setImportValidationList([]);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {/* Validation Summary Badge */}
              {(() => {
                const invalidRows = importValidationList.filter((r) => !r.isValid);
                if (invalidRows.length > 0) {
                  return (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">
                          {invalidRows.length} row(s) have missing required fields!
                        </span>
                        <p className="text-[11px] text-rose-600 mt-0.5">
                          Each row must have at least <strong>Project Name</strong>, <strong>Task Title</strong>, and <strong>Assigned Developer</strong>.
                        </p>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">
                      All {importValidationList.length} rows are valid and ready to import!
                    </span>
                  </div>
                );
              })()}

              {/* Table Preview with Error Highlighting */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Project</th>
                      <th className="py-2.5 px-3">Task Title</th>
                      <th className="py-2.5 px-3">Developer</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Est. / Spent</th>
                      <th className="py-2.5 px-3">Validation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {importValidationList.map((item, idx) => (
                      <tr
                        key={idx}
                        className={item.isValid ? "hover:bg-slate-50" : "bg-rose-50/50 hover:bg-rose-50"}
                      >
                        <td className="py-2 px-3 text-slate-400 font-mono text-[10px]">{idx + 1}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`font-semibold ${
                              item.project_name === "Untitled Project" ? "text-rose-600 italic" : "text-slate-900"
                            }`}
                          >
                            {item.project_name}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <div className="max-w-[180px] truncate" title={item.task_title}>
                            <span className={item.task_title === "Untitled Task" ? "text-rose-600 italic" : "text-slate-900 font-medium"}>
                              {item.task_title}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <span className={item.assigned_to === "Unassigned" ? "text-rose-600 italic" : "text-slate-700 font-medium"}>
                            {item.assigned_to}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-700 font-medium">
                          {item.estimated_hours}h <span className="text-slate-400">/ {item.spent_hours}h</span>
                        </td>
                        <td className="py-2 px-3">
                          {item.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> Valid
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full"
                              title={item.errors.join(", ")}
                            >
                              <AlertCircle className="w-3 h-3" /> {item.errors[0]}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleDownloadSampleTemplate}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer border border-blue-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample Template</span>
                </button>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setIsImportModalOpen(false);
                      setImportParsedTasks([]);
                      setImportValidationList([]);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={importLoading || importValidationList.some(r => !r.isValid)}
                    onClick={handleConfirmBatchImport}
                    className="px-5 py-2 rounded-xl bg-[#0B1340] hover:bg-[#070D2B] text-white text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {importLoading ? "Importing..." : `Import ${importValidationList.length} Tasks`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT TASK MODAL (WORK HOURS) ── */}
      {(isCreateModalOpen || editingTask) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 my-8 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0B1340] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingTask ? "Edit Work Hours" : "Work Hours"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingTask ? "Update logged work details" : "Add daily work entry and task log"}
                  </p>
                </div>
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
              {/* Parivar / Project Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project / Parivar Name <span className="text-rose-500">*</span>
                </label>
                <CustomSelect
                  value={taskForm.project_name}
                  onChange={(val) => handleProjectSelectChange(val)}
                  options={modalProjectOptions}
                  searchable={true}
                  placeholder="Select Parivar / Community..."
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={taskForm.start_date}
                  onChange={(e) => setTaskForm({ ...taskForm, start_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B1340]"
                />
              </div>

              {/* Working Hours Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Working Hours <span className="text-rose-500">*</span>
                </label>
                <CustomSelect
                  value={String(taskForm.spent_hours || "1")}
                  onChange={(val) => {
                    const num = parseFloat(val) || 1;
                    setTaskForm((prev) => ({
                      ...prev,
                      spent_hours: num,
                      estimated_hours: num,
                    }));
                  }}
                  options={workingHourOptions}
                  searchable={true}
                  placeholder="-- Select Working Hours --"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Select in 15-minute intervals (e.g., 2.5 = 2 hours 30 minutes)
                </span>
              </div>

              {/* Developer Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Developer Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter developer name"
                  value={taskForm.assigned_to}
                  onChange={(e) => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B1340]"
                />
              </div>

              {/* Note / Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note / Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter work description or notes"
                  value={taskForm.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTaskForm((prev) => ({
                      ...prev,
                      description: val,
                      task_title: val ? (val.length > 50 ? val.slice(0, 47) + "..." : val) : prev.task_title,
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B1340]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingTask(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1340] hover:bg-[#070D2B] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  {editingTask ? "Update Work Hours" : "Save Work Hours"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── STOP TIMER & CONFIRM LOG MODAL ── */}
      {stopTimerTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Log Timer Session</h3>
                  <p className="text-xs text-slate-500 truncate max-w-[240px]">
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
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Tracked Time
                  </span>
                  <span className="font-mono text-xl font-bold text-slate-900">
                    {formatTime(stopTimerTaskModal.elapsedSeconds * 1000)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Calculated Hours
                  </span>
                  <span className="text-lg font-bold text-emerald-600">
                    +{stopTimerTaskModal.hoursDecimal} hrs
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hours to Add (Adjustable)
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0B1340]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Update Task Status</label>
                <CustomSelect
                  value={logStatusInput}
                  onChange={(val) => setLogStatusInput(val)}
                  options={formStatusOptions}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Note / Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Completed feature implementation"
                  value={logRemarksInput}
                  onChange={(e) => setLogRemarksInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B1340]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStopTimerTaskModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSaveTimerHours}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
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
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Log Task Working Hours</h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[280px]">
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
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Spent Time</span>
                  <span className="font-bold text-slate-900 text-sm">{quickLogTask.spent_hours || 0} Hours</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated</span>
                  <span className="font-bold text-blue-600 text-sm">{quickLogTask.estimated_hours || 0} Hours</span>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center rounded-xl bg-slate-100 p-1 text-xs font-semibold">
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {logMode === "add" ? "Hours to Add (hrs)" : "Exact Total Hours (hrs)"}
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  placeholder="e.g. 2.5"
                  value={logHoursInput}
                  onChange={(e) => setLogHoursInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B1340]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Update Status</label>
                <CustomSelect
                  value={logStatusInput}
                  onChange={(val) => setLogStatusInput(val)}
                  options={formStatusOptions}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Note / Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Completed API integration and tested"
                  value={logRemarksInput}
                  onChange={(e) => setLogRemarksInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B1340]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickLogTask(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1340] hover:bg-[#070D2B] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
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
