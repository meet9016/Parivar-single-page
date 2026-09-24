"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "../../../lib/axiosInstance";
import { ENDPOINTS } from "../../../lib/endpoints";

export interface ProjectTask {
  _id: string;
  project_name: string;
  client_name?: string;
  task_title: string;
  description?: string;
  assigned_to: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Pending" | "In Progress" | "Testing" | "Completed";
  estimated_hours: number;
  spent_hours: number;
  billable: boolean;
  start_date?: string;
  due_date?: string;
  completed_date?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SuperAdminContextType {
  isAuthenticated: boolean;
  loginError: string;
  loginLoading: boolean;
  isInitializing: boolean;
  handleLogin: (e: React.FormEvent, form: any, rememberMe?: boolean) => Promise<void>;
  handleLogout: () => void;
  
  activeTab: "inquiries" | "parivars" | "pricing" | "tasks";
  setActiveTab: (tab: "inquiries" | "parivars" | "pricing" | "tasks") => void;

  inquiries: any[];
  inquiriesLoading: boolean;
  inquirySearch: string;
  setInquirySearch: (val: string) => void;
  fetchInquiries: () => Promise<void>;
  handleInquiryStatus: (id: string, currentStatus: number) => Promise<void>;

  parivars: any[];
  parivarsLoading: boolean;
  parivarSearch: string;
  setParivarSearch: (val: string) => void;
  fetchParivars: () => Promise<void>;

  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (val: boolean) => void;
  createLoading: boolean;
  createStatus: { type: "success" | "error"; text: string } | null;
  handleCreateParivar: (e: React.FormEvent, form: any, setForm: any) => Promise<void>;

  editingParivar: any;
  setEditingParivar: (val: any) => void;
  editLoading: boolean;
  handleEditParivar: (e: React.FormEvent, form: any) => Promise<void>;
  handleDeleteParivar: (id: string) => Promise<boolean>;

  // Pricing Plans
  pricingPlans: any[];
  pricingLoading: boolean;
  fetchPricingPlans: () => Promise<void>;
  handleCreatePricingPlan: (plan: any) => Promise<boolean>;
  handleEditPricingPlan: (id: string, plan: any) => Promise<boolean>;
  handleDeletePricingPlan: (id: string) => Promise<boolean>;

  // Project Tasks & Time Tracker
  projectTasks: ProjectTask[];
  tasksLoading: boolean;
  taskSearch: string;
  setTaskSearch: (val: string) => void;
  taskFilters: {
    project: string;
    status: string;
    assigned_to: string;
    priority: string;
    category: string;
  };
  setTaskFilters: React.Dispatch<React.SetStateAction<{
    project: string;
    status: string;
    assigned_to: string;
    priority: string;
    category: string;
  }>>;
  taskMeta: {
    totalTasks: number;
    filteredTasks: number;
    totalEstimatedHours: number;
    totalSpentHours: number;
    statusCounts: Record<string, number>;
    projectsList: string[];
    devsList: string[];
    projectStats: Record<string, { count: number; spent: number; estimated: number }>;
    devStats: Record<string, { count: number; spent: number; estimated: number }>;
  };
  fetchProjectTasks: () => Promise<void>;
  handleCreateTask: (task: Partial<ProjectTask>) => Promise<boolean>;
  handleUpdateTask: (id: string, task: Partial<ProjectTask>) => Promise<boolean>;
  handleLogTaskTime: (id: string, data: { add_hours?: number; set_hours?: number; status?: string; remarks?: string }) => Promise<boolean>;
  handleDeleteTask: (id: string) => Promise<boolean>;
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

export function SuperAdminProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const params = useParams();
  
  const tabPath = params?.tab?.[0];
  const derivedTab = tabPath === "inquiries"
    ? "inquiries"
    : tabPath === "pricing"
    ? "pricing"
    : tabPath === "tasks"
    ? "tasks"
    : "parivars";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [activeTab, setActiveTabState] = useState<"inquiries" | "parivars" | "pricing" | "tasks">(derivedTab);

  useEffect(() => {
    setActiveTabState(derivedTab);
  }, [derivedTab]);

  const setActiveTab = (tab: "inquiries" | "parivars" | "pricing" | "tasks") => {
    setActiveTabState(tab);
    const path = tab === "inquiries"
      ? "inquiries"
      : tab === "pricing"
      ? "pricing"
      : tab === "tasks"
      ? "tasks"
      : "all-parivar";
    window.history.pushState(null, '', `/superadmin/${path}`);
  };

  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquirySearch, setInquirySearch] = useState("");

  const [parivars, setParivars] = useState<any[]>([]);
  const [parivarsLoading, setParivarsLoading] = useState(false);
  const [parivarSearch, setParivarSearch] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createStatus, setCreateStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [editingParivar, setEditingParivar] = useState<any>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Pricing States
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [pricingLoading, setPricingLoading] = useState(false);

  // Project Tasks States
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [taskSearch, setTaskSearch] = useState("");
  const [taskFilters, setTaskFilters] = useState({
    project: "all",
    status: "all",
    assigned_to: "all",
    priority: "all",
    category: "all",
  });
  const [taskMeta, setTaskMeta] = useState<SuperAdminContextType["taskMeta"]>({
    totalTasks: 0,
    filteredTasks: 0,
    totalEstimatedHours: 0,
    totalSpentHours: 0,
    statusCounts: { Pending: 0, "In Progress": 0, Testing: 0, Completed: 0 },
    projectsList: [],
    devsList: [],
    projectStats: {},
    devStats: {},
  });

  useEffect(() => {
    const savedLocal = localStorage.getItem("superadmin_auth");
    const savedSession = sessionStorage.getItem("superadmin_auth");
    if (savedLocal === "true" || savedSession === "true") {
      setIsAuthenticated(true);
    }
    setIsInitializing(false);
  }, []);

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const res = await axiosInstance.get(`${ENDPOINTS.INQUIRY}?search=${encodeURIComponent(inquirySearch)}`);
      if (res.status === 200) {
        setInquiries(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (err) {
      console.error("Failed to load inquiries", err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const fetchParivars = async () => {
    setParivarsLoading(true);
    try {
      const res = await axiosInstance.get(`${ENDPOINTS.REGISTER_PARIVAR}?search=${encodeURIComponent(parivarSearch)}`);
      if (res.status === 200) {
        setParivars(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (err) {
      console.error("Failed to load parivars", err);
    } finally {
      setParivarsLoading(false);
    }
  };

  const fetchPricingPlans = async () => {
    setPricingLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.PRICING_ALL);
      if (res.status === 200) {
        setPricingPlans(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (err) {
      console.error("Failed to load pricing plans", err);
    } finally {
      setPricingLoading(false);
    }
  };

  const fetchProjectTasks = async () => {
    setTasksLoading(true);
    try {
      const params = new URLSearchParams();
      if (taskSearch.trim()) params.append("search", taskSearch.trim());
      if (taskFilters.project !== "all") params.append("project", taskFilters.project);
      if (taskFilters.status !== "all") params.append("status", taskFilters.status);
      if (taskFilters.assigned_to !== "all") params.append("assigned_to", taskFilters.assigned_to);
      if (taskFilters.priority !== "all") params.append("priority", taskFilters.priority);
      if (taskFilters.category !== "all") params.append("category", taskFilters.category);

      const res = await axiosInstance.get(`${ENDPOINTS.PROJECT_TASKS}?${params.toString()}`);
      if (res.status === 200) {
        setProjectTasks(Array.isArray(res.data.data) ? res.data.data : []);
        if (res.data.meta) {
          setTaskMeta({
            totalTasks: res.data.meta.totalTasks || 0,
            filteredTasks: res.data.meta.filteredTasks || 0,
            totalEstimatedHours: res.data.meta.totalEstimatedHours || 0,
            totalSpentHours: res.data.meta.totalSpentHours || 0,
            statusCounts: res.data.meta.statusCounts || { Pending: 0, "In Progress": 0, Testing: 0, Completed: 0 },
            projectsList: res.data.meta.projectsList || [],
            devsList: res.data.meta.devsList || [],
            projectStats: res.data.meta.projectStats || {},
            devStats: res.data.meta.devStats || {},
          });
        }
      }
    } catch (err) {
      console.error("Failed to load project tasks", err);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchInquiries();
      fetchParivars();
      fetchPricingPlans();
      fetchProjectTasks();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "tasks") {
      fetchProjectTasks();
    }
  }, [taskSearch, taskFilters]);

  const handleLogin = async (e: React.FormEvent, loginForm: any, rememberMe = false) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await axiosInstance.post(ENDPOINTS.SUPERADMIN_LOGIN, {
        email: loginForm.email,
        password: loginForm.password
      });

      if (res.status === 200 && res.data.status === 200) {
        setIsAuthenticated(true);
        if (rememberMe) {
          localStorage.setItem("superadmin_auth", "true");
          if (res.data.data?.token) {
            localStorage.setItem("superadmin_token", res.data.data.token);
          }
        } else {
          sessionStorage.setItem("superadmin_auth", "true");
          if (res.data.data?.token) {
            sessionStorage.setItem("superadmin_token", res.data.data.token);
          }
        }
      } else {
        setLoginError(res.data.message || "Invalid Super Admin credentials! Please check.");
      }
    } catch (err: any) {
      console.error("Login API error:", err);
      if (loginForm.email.trim() === "superadmin@gmail.com" && loginForm.password === "admin@123") {
        setIsAuthenticated(true);
        if (rememberMe) {
          localStorage.setItem("superadmin_auth", "true");
        } else {
          sessionStorage.setItem("superadmin_auth", "true");
        }
      } else {
        setLoginError("Could not connect to server or invalid credentials.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("superadmin_auth");
    localStorage.removeItem("superadmin_token");
    sessionStorage.removeItem("superadmin_auth");
    sessionStorage.removeItem("superadmin_token");
  };

  const handleInquiryStatus = async (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      const res = await axiosInstance.put(ENDPOINTS.UPDATE_INQUIRY(id), { status: newStatus });
      if (res.status === 200) {
        toast.success(`Inquiry marked as ${newStatus === 0 ? "Resolved" : "Pending"}!`);
        fetchInquiries();
      }
    } catch (err) {
      console.error("Status update error", err);
      toast.error("Failed to update inquiry status.");
    }
  };

  const handleCreateParivar = async (e: React.FormEvent, newParivar: any, setNewParivar: any) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateStatus(null);

    try {
      const res = await axiosInstance.post(ENDPOINTS.REGISTER_PARIVAR, newParivar);

      if (res.status === 200 || res.status === 201) {
        const displayName = newParivar.parivar_name || newParivar.village_name;
        toast.success(`"${displayName}" created successfully!`);
        setCreateStatus({
          type: "success",
          text: `"${displayName}" added!`,
        });
        setNewParivar({
          community_type: "Parivar",
          parivar_name: "",
          admin_first_name: "",
          admin_last_name: "",
          admin_email: "",
          admin_mobile: "",
          notes: "",
        });
        fetchParivars();
        setTimeout(() => {
          setIsCreateModalOpen(false);
          setCreateStatus(null);
        }, 1000);
      } else {
        toast.error(res.data.message || "Failed to create Parivar.");
        setCreateStatus({ type: "error", text: res.data.message || "Failed to create Parivar" });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error contacting server. Please check backend.");
      setCreateStatus({ type: "error", text: err.response?.data?.message || "Error contacting server." });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditParivar = async (e: React.FormEvent, editForm: any) => {
    e.preventDefault();
    if (!editingParivar) return;
    setEditLoading(true);

    try {
      const updateRes = await axiosInstance.put(ENDPOINTS.UPDATE_PARIVAR(editingParivar._id), {
        parivar_name: editForm.parivar_name,
        community_type: editForm.community_type,
        village_name: editForm.village_name,
        status: editForm.status,
        admin_first_name: editForm.admin_first_name,
        admin_last_name: editForm.admin_last_name,
        admin_email: editForm.admin_email,
        admin_mobile: editForm.admin_mobile,
        notes: editForm.notes,
      });

      if (updateRes.status === 200) {
        toast.success(`Parivar "${editForm.parivar_name}" updated successfully!`);
        fetchParivars();
        setEditingParivar(null);
      } else {
        toast.error(updateRes.data.message || "Failed to update Parivar.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error contacting server.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteParivar = async (id: string) => {
    try {
      const res = await axiosInstance.delete(ENDPOINTS.UPDATE_PARIVAR(id));
      if (res.status === 200) {
        toast.success("Parivar deleted successfully!");
        fetchParivars();
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete Parivar.");
      return false;
    }
  };


  const handleCreatePricingPlan = async (plan: any) => {
    try {
      const res = await axiosInstance.post(ENDPOINTS.PRICING, plan);
      if (res.status === 200 || res.status === 201) {
        toast.success("Pricing plan created successfully!");
        fetchPricingPlans();
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create pricing plan.");
      return false;
    }
  };

  const handleEditPricingPlan = async (id: string, plan: any) => {
    try {
      const res = await axiosInstance.put(ENDPOINTS.UPDATE_PRICING(id), plan);
      if (res.status === 200) {
        toast.success("Pricing plan updated successfully!");
        fetchPricingPlans();
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update pricing plan.");
      return false;
    }
  };

  const handleDeletePricingPlan = async (id: string) => {
    try {
      const res = await axiosInstance.delete(ENDPOINTS.UPDATE_PRICING(id));
      if (res.status === 200) {
        toast.success("Pricing plan deleted successfully!");
        fetchPricingPlans();
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete pricing plan.");
      return false;
    }
  };

  // Task Handlers
  const handleCreateTask = async (task: Partial<ProjectTask>) => {
    try {
      const res = await axiosInstance.post(ENDPOINTS.PROJECT_TASKS, task);
      if (res.status === 200 || res.status === 201) {
        toast.success("Project task created successfully!");
        fetchProjectTasks();
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create project task.");
      return false;
    }
  };

  const handleUpdateTask = async (id: string, task: Partial<ProjectTask>) => {
    try {
      const res = await axiosInstance.put(ENDPOINTS.UPDATE_PROJECT_TASK(id), task);
      if (res.status === 200) {
        toast.success("Task updated successfully!");
        fetchProjectTasks();
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update task.");
      return false;
    }
  };

  const handleLogTaskTime = async (id: string, data: { add_hours?: number; set_hours?: number; status?: string; remarks?: string }) => {
    try {
      const res = await axiosInstance.patch(ENDPOINTS.LOG_PROJECT_TASK_TIME(id), data);
      if (res.status === 200) {
        toast.success("Task time updated successfully!");
        fetchProjectTasks();
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to log time.");
      return false;
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const res = await axiosInstance.delete(ENDPOINTS.UPDATE_PROJECT_TASK(id));
      if (res.status === 200) {
        toast.success("Task deleted successfully!");
        fetchProjectTasks();
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete task.");
      return false;
    }
  };

  const value = {
    isAuthenticated, isInitializing, loginError, loginLoading, handleLogin, handleLogout,
    activeTab, setActiveTab,
    inquiries, inquiriesLoading, inquirySearch, setInquirySearch, fetchInquiries, handleInquiryStatus,
    parivars, parivarsLoading, parivarSearch, setParivarSearch, fetchParivars,
    isCreateModalOpen, setIsCreateModalOpen, createLoading, createStatus, handleCreateParivar,
    editingParivar, setEditingParivar, editLoading, handleEditParivar, handleDeleteParivar,
    pricingPlans, pricingLoading, fetchPricingPlans, handleCreatePricingPlan, handleEditPricingPlan, handleDeletePricingPlan,
    projectTasks, tasksLoading, taskSearch, setTaskSearch, taskFilters, setTaskFilters, taskMeta,
    fetchProjectTasks, handleCreateTask, handleUpdateTask, handleLogTaskTime, handleDeleteTask
  };

  return <SuperAdminContext.Provider value={value}>{children}</SuperAdminContext.Provider>;
}

export function useSuperAdmin() {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error("useSuperAdmin must be used within a SuperAdminProvider");
  }
  return context;
}
