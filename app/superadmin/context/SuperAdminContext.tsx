"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "../../../lib/axiosInstance";
import { ENDPOINTS } from "../../../lib/endpoints";

interface SuperAdminContextType {
  isAuthenticated: boolean;
  loginError: string;
  loginLoading: boolean;
  handleLogin: (e: React.FormEvent, form: any, rememberMe?: boolean) => Promise<void>;
  handleLogout: () => void;
  
  activeTab: "inquiries" | "parivars";
  setActiveTab: (tab: "inquiries" | "parivars") => void;

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
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

export function SuperAdminProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const params = useParams();
  
  const tabPath = params?.tab?.[0];
  const derivedTab = tabPath === "inquiries" ? "inquiries" : "parivars";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [activeTab, setActiveTabState] = useState<"inquiries" | "parivars">(derivedTab);

  useEffect(() => {
    setActiveTabState(derivedTab);
  }, [derivedTab]);

  const setActiveTab = (tab: "inquiries" | "parivars") => {
    setActiveTabState(tab);
    const path = tab === "inquiries" ? "inquiries" : "all-parivar";
    router.push(`/superadmin/${path}`);
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

  useEffect(() => {
    const savedLocal = localStorage.getItem("superadmin_auth");
    const savedSession = sessionStorage.getItem("superadmin_auth");
    if (savedLocal === "true" || savedSession === "true") {
      setIsAuthenticated(true);
    }
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchInquiries();
      fetchParivars();
    }
  }, [isAuthenticated, activeTab]);

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
        toast.success(`Parivar "${newParivar.parivar_name}" created successfully!`);
        setCreateStatus({
          type: "success",
          text: `Parivar "${newParivar.parivar_name}" registered with database "parivar_${newParivar.parivar_name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}"!`,
        });
        setNewParivar({
          parivar_name: "", admin_first_name: "", admin_last_name: "",
          admin_email: "", admin_mobile: "", admin_password: "",
        });
        fetchParivars();
        setTimeout(() => {
          setIsCreateModalOpen(false);
          setCreateStatus(null);
        }, 1200);
      } else {
        toast.error(res.data.message || "Failed to create Parivar.");
        setCreateStatus({ type: "error", text: res.data.message || "Failed to create Parivar" });
      }
    } catch (err: any) {
      toast.error("Error contacting server. Please check backend.");
      setCreateStatus({ type: "error", text: "Error contacting server. Make sure backend is running." });
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
        status: editForm.status,
        admin_first_name: editForm.admin_first_name,
        admin_last_name: editForm.admin_last_name,
        admin_mobile: editForm.admin_mobile
      });

      if (editForm.new_password) {
        await axiosInstance.put(ENDPOINTS.UPDATE_PARIVAR_PASSWORD(editingParivar._id), {
          new_password: editForm.new_password
        });
      }

      if (updateRes.status === 200) {
        toast.success(`Parivar "${editForm.parivar_name}" updated successfully!`);
        fetchParivars();
        setEditingParivar(null);
      } else {
        toast.error(updateRes.data.message || "Failed to update Parivar.");
      }
    } catch (err: any) {
      toast.error("Error contacting server.");
    } finally {
      setEditLoading(false);
    }
  };

  const value = {
    isAuthenticated, loginError, loginLoading, handleLogin, handleLogout,
    activeTab, setActiveTab,
    inquiries, inquiriesLoading, inquirySearch, setInquirySearch, fetchInquiries, handleInquiryStatus,
    parivars, parivarsLoading, parivarSearch, setParivarSearch, fetchParivars,
    isCreateModalOpen, setIsCreateModalOpen, createLoading, createStatus, handleCreateParivar,
    editingParivar, setEditingParivar, editLoading, handleEditParivar
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
