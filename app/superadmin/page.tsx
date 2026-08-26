"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Mail,
  Users,
  PlusCircle,
  MessageSquare,
  Search,
  CheckCircle,
  Clock,
  RefreshCw,
  LogOut,
  Building2,
  Phone,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Database
} from "lucide-react";
import { toast } from "sonner";

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<"inquiries" | "parivars">("parivars");

  // Inquiries State
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquirySearch, setInquirySearch] = useState("");

  // Parivars State
  const [parivars, setParivars] = useState<any[]>([]);
  const [parivarsLoading, setParivarsLoading] = useState(false);
  const [parivarSearch, setParivarSearch] = useState("");

  // Create Parivar Modal & Form State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newParivar, setNewParivar] = useState({
    parivar_name: "",
    admin_first_name: "",
    admin_last_name: "",
    admin_email: "",
    admin_mobile: "",
    admin_password: "",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createStatus, setCreateStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit Parivar State
  const [editingParivar, setEditingParivar] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    parivar_name: "",
    status: 1,
    admin_first_name: "",
    admin_last_name: "",
    admin_mobile: "",
    new_password: ""
  });
  const [editLoading, setEditLoading] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

  // Check saved login session
  useEffect(() => {
    const saved = localStorage.getItem("superadmin_auth");
    if (saved === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch Inquiries
  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/inquiry?search=${encodeURIComponent(inquirySearch)}`);
      const data = await res.json();
      if (res.ok) {
        setInquiries(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error("Failed to load inquiries", err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  // Fetch Parivars
  const fetchParivars = async () => {
    setParivarsLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/register-parivar?search=${encodeURIComponent(parivarSearch)}`);
      const data = await res.json();
      if (res.ok) {
        setParivars(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error("Failed to load parivars", err);
    } finally {
      setParivarsLoading(false);
    }
  };

  // Always fetch BOTH on login so live overview count is instantly visible
  useEffect(() => {
    if (isAuthenticated) {
      fetchInquiries();
      fetchParivars();
    }
  }, [isAuthenticated]);

  // Tab change fetch
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === "inquiries") fetchInquiries();
      if (activeTab === "parivars") fetchParivars();
    }
  }, [activeTab]);

  // Handle Login via API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/register-parivar/superadmin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        }),
      });

      const json = await res.json();

      if (res.ok && json.status === 200) {
        setIsAuthenticated(true);
        localStorage.setItem("superadmin_auth", "true");
        if (json.data?.token) {
          localStorage.setItem("superadmin_token", json.data.token);
        }
      } else {
        setLoginError(json.message || "Invalid Super Admin credentials! Please check.");
      }
    } catch (err: any) {
      console.error("Login API error:", err);
      // Fallback local check
      if (
        loginForm.email.trim() === "superadmin@gmail.com" &&
        loginForm.password === "admin@123"
      ) {
        setIsAuthenticated(true);
        localStorage.setItem("superadmin_auth", "true");
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
  };

  // Handle Status Update for Inquiry
  // Handle Status Update for Inquiry
  const handleInquiryStatus = async (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      const res = await fetch(`${apiBase}/api/inquiry/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Inquiry marked as ${newStatus === 0 ? "Resolved" : "Pending"}!`);
        fetchInquiries();
      }
    } catch (err) {
      console.error("Status update error", err);
      toast.error("Failed to update inquiry status.");
    }
  };

  // Handle Create New Parivar Tenant
  const handleCreateParivar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateStatus(null);

    try {
      const res = await fetch(`${apiBase}/api/register-parivar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newParivar),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Parivar "${newParivar.parivar_name}" created successfully!`);
        setCreateStatus({
          type: "success",
          text: `Parivar "${newParivar.parivar_name}" registered with database "parivar_${newParivar.parivar_name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}"!`,
        });
        setNewParivar({
          parivar_name: "",
          admin_first_name: "",
          admin_last_name: "",
          admin_email: "",
          admin_mobile: "",
          admin_password: "",
        });
        fetchParivars();
        // Close modal after 1.2s
        setTimeout(() => {
          setIsCreateModalOpen(false);
          setCreateStatus(null);
        }, 1200);
      } else {
        toast.error(data.message || "Failed to create Parivar.");
        setCreateStatus({
          type: "error",
          text: data.message || "Failed to create Parivar",
        });
      }
    } catch (err: any) {
      toast.error("Error contacting server. Please check backend.");
      setCreateStatus({
        type: "error",
        text: "Error contacting server. Make sure backend is running.",
      });
    } finally {
      setCreateLoading(false);
    }
  };

  const openEditModal = (p: any) => {
    setEditingParivar(p);
    setEditForm({
      parivar_name: p.parivar_name,
      status: p.status ?? 1,
      admin_first_name: p.admin?.first_name || "",
      admin_last_name: p.admin?.last_name || "",
      admin_mobile: p.admin?.mobile || "",
      new_password: ""
    });
  };

  const handleEditParivar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParivar) return;
    setEditLoading(true);

    try {
      // 1. Update basic details
      const updateRes = await fetch(`${apiBase}/api/register-parivar/${editingParivar._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parivar_name: editForm.parivar_name,
          status: editForm.status,
          admin_first_name: editForm.admin_first_name,
          admin_last_name: editForm.admin_last_name,
          admin_mobile: editForm.admin_mobile
        }),
      });

      // 2. Update password if provided
      if (editForm.new_password) {
        await fetch(`${apiBase}/api/register-parivar/${editingParivar._id}/password`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ new_password: editForm.new_password }),
        });
      }

      if (updateRes.ok) {
        toast.success(`Parivar "${editForm.parivar_name}" updated successfully!`);
        fetchParivars();
        setEditingParivar(null);
      } else {
        const data = await updateRes.json();
        toast.error(data.message || "Failed to update Parivar.");
      }
    } catch (err: any) {
      toast.error("Error contacting server.");
    } finally {
      setEditLoading(false);
    }
  };

  // If not authenticated, render Clean Ultra-Modern Light Login Box (Matching parivar.me)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fc] text-[#080b2a] relative overflow-hidden font-sans p-4">
        {/* Dynamic ambient backgrounds */}
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        <div className="w-full max-w-md p-8 sm:p-10 bg-white border border-[#e2e8f4] rounded-3xl shadow-xl relative z-10">
          {/* Logo & Community Header */}
          <div className="flex flex-col items-center mb-8">
          
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#4338ca] to-indigo-600 bg-clip-text text-transparent">
              Super Admin Parivar
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Address */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2 tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full px-4 py-3 bg-white text-[#080b2a] placeholder-slate-400 border border-slate-200 hover:border-slate-300 focus:border-[#4338ca]/50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#4338ca]/10 transition-all duration-300"
                placeholder="superadmin@gmail.com"
                disabled={loginLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2 tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 bg-white text-[#080b2a] placeholder-slate-400 border border-slate-200 hover:border-slate-300 focus:border-[#4338ca]/50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#4338ca]/10 transition-all duration-300"
                placeholder="••••••••"
                disabled={loginLoading}
              />
            </div>

            {/* Error banner */}
            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Submit Button (Matching Main Login button color: #4338ca) */}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-2 bg-[#4338ca] hover:bg-[#3730a3] text-white py-3.5 rounded-2xl font-semibold text-sm tracking-wider transition-all duration-300 shadow-md shadow-indigo-500/20 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loginLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
              <span>{loginLoading ? "Login..." : "Login"}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard Layout: Full-Height Sidebar on the Left, Header on the Right
  return (
    <div className="h-screen w-full bg-[#F4F7FF] text-slate-800 flex overflow-hidden">
      
      {/* ─── FULL-HEIGHT SIDEBAR (100vh Left Column) ─── */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-full shadow-xs z-30">
        
        {/* Brand Header in Sidebar */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black shrink-0 shadow-2xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-slate-900 leading-none">Parivar Super Admin</h1>
            <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-1 block">Master SaaS Panel</span>
          </div>
        </div>

        {/* Sidebar Nav & Overview */}
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2.5">
              Main Menu
            </p>
            <nav className="space-y-1.5">
              <button
                onClick={() => setActiveTab("parivars")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "parivars"
                    ? "bg-[#0B1340] text-white shadow-sm shadow-[#0B1340]/25"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className={`w-4 h-4 ${activeTab === "parivars" ? "text-white" : "text-blue-600"}`} />
                  <span>All Parivars</span>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === "parivars" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {parivars.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("inquiries")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "inquiries"
                    ? "bg-[#0B1340] text-white shadow-sm shadow-[#0B1340]/25"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className={`w-4 h-4 ${activeTab === "inquiries" ? "text-white" : "text-blue-600"}`} />
                  <span>User Inquiries</span>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === "inquiries" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {inquiries.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Quick Stats Summary Widget */}
          <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3.5 space-y-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              SaaS Overview
            </p>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-2xs">
                <span className="text-base font-black text-slate-900 block">{parivars.length}</span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Tenants</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-2xs">
                <span className="text-base font-black text-indigo-600 block">{inquiries.length}</span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Inquiries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 text-center">
          <span className="text-[11px] font-semibold text-slate-400">Parivar SaaS v2.4</span>
        </div>
      </aside>

      {/* ─── RIGHT CONTAINER (Header + Content) ─── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Navbar on Right Side - Clean Cohesive Header */}
        <header className="bg-white border-b border-slate-200/90 h-16 px-6 lg:px-8 flex items-center justify-between shrink-0 shadow-2xs z-20">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              {activeTab === "parivars" ? "Communities & Tenant Databases" : "Inquiries & Contact Requests"}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              {activeTab === "parivars" ? "Manage isolated tenant databases & admin credentials" : "Visitor submissions from landing page"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>superadmin@gmail.com</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-5">
          
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {activeTab === "parivars" && "All Parivars (Tenants)"}
                {activeTab === "inquiries" && "User Inquiries"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeTab === "parivars" && "Manage all isolated community databases, admins, and status"}
                {activeTab === "inquiries" && "Landing page visitor requests and contact inquiries"}
              </p>
            </div>

            {/* Single Add Parivar Action Button - Using #0B1340 */}
            {activeTab === "parivars" && (
              <button
                onClick={() => {
                  setCreateStatus(null);
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1340] hover:bg-[#070D2B] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm hover:shadow-md hover:shadow-[#0B1340]/25 active:scale-98"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add Parivar</span>
              </button>
            )}
          </div>

          {/* ─── TAB 1: USER INQUIRIES ───────────────────────────── */}
          {activeTab === "inquiries" && (
            <div className="space-y-4">
              {/* Search Input */}
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

              {/* Inquiries Table Card */}
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
          )}

          {/* ─── TAB 2: ALL PARIVARS (TENANTS - TABLE VIEW) ──────────── */}
          {activeTab === "parivars" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-lg">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search parivar name, slug, admin..."
                    value={parivarSearch}
                    onChange={(e) => setParivarSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchParivars()}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                  />
                </div>
                <button
                  onClick={fetchParivars}
                  className="px-5 py-2.5 rounded-xl bg-[#0B1340] hover:bg-blue-900 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  Search
                </button>
              </div>

              {/* Tenants Table Format */}
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
                            {/* Parivar Name & Slug */}
                            <td className="px-5 py-4 font-bold text-[#0B1340]">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                                  {p.parivar_name?.charAt(0) || "P"}
                                </div>
                                <div>
                                  <div className="font-bold text-sm text-slate-900">{p.parivar_name}</div>
                                  <div className="text-[11px] font-mono text-slate-400 font-medium">/{p.slug}</div>
                                </div>
                              </div>
                            </td>

                            {/* Database */}
                            <td className="px-5 py-4">
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/80 font-mono text-xs text-blue-700 font-semibold">
                                <Database className="w-3 h-3 text-blue-600" />
                                <span>{p.db_name}</span>
                              </div>
                            </td>

                            {/* Admin Info */}
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

                            {/* Created Date */}
                            <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}</span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>Active</span>
                              </span>
                            </td>

                            {/* Actions */}
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
          )}

        </main>

        {/* ─── CREATE PARIVAR MODAL POPUP ─────────────────── */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070D2B]/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl p-6 sm:p-7 w-full max-w-lg shadow-xl relative space-y-4">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>

              <div className="border-b border-slate-200 pb-3 space-y-0.5">
                <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider">
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>New Multi-Tenant</span>
                </div>
                <h3 className="text-lg font-black text-[#0B1340]">
                  Register New Parivar
                </h3>
                <p className="text-xs text-slate-500">
                  Creates an isolated database & seeds the community primary admin.
                </p>
              </div>

              <form onSubmit={handleCreateParivar} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Parivar Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Patel Parivar / Vala Parivar"
                    value={newParivar.parivar_name}
                    onChange={(e) => setNewParivar({ ...newParivar, parivar_name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Database: <span className="font-mono text-blue-600 font-semibold">parivar_{newParivar.parivar_name ? newParivar.parivar_name.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'name'}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admin First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh"
                      value={newParivar.admin_first_name}
                      onChange={(e) => setNewParivar({ ...newParivar, admin_first_name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admin Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Patel"
                      value={newParivar.admin_last_name}
                      onChange={(e) => setNewParivar({ ...newParivar, admin_last_name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admin Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="admin@patel.com"
                      value={newParivar.admin_email}
                      onChange={(e) => setNewParivar({ ...newParivar, admin_email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admin Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={newParivar.admin_mobile}
                      onChange={(e) => setNewParivar({ ...newParivar, admin_mobile: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Initial Admin Password (Optional)
                  </label>
                  <input
                    type="password"
                    placeholder="Default: Parivar@123"
                    value={newParivar.admin_password}
                    onChange={(e) => setNewParivar({ ...newParivar, admin_password: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Default if empty: <span className="font-mono font-bold text-slate-600">Parivar@123</span>
                  </p>
                </div>

                {createStatus && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      createStatus.type === "success"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                        : "bg-rose-50 border border-rose-200 text-rose-700"
                    }`}
                  >
                    {createStatus.type === "success" ? (
                      <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    )}
                    <span>{createStatus.text}</span>
                  </div>
                )}

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="flex-1 py-2.5 rounded-xl bg-[#0B1340] hover:bg-[#070D2B] text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {createLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
                    <span>{createLoading ? "Provisioning..." : "Create Parivar"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── EDIT MODAL ──────────────────── */}
        {editingParivar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070D2B]/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative">
              <button 
                onClick={() => setEditingParivar(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
              
              <h3 className="text-xl font-black text-[#0B1340] mb-6">
                Edit Parivar Details
              </h3>
              
              <form onSubmit={handleEditParivar} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Parivar Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.parivar_name}
                    onChange={(e) => setEditForm({...editForm, parivar_name: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Admin First Name</label>
                    <input
                      type="text"
                      value={editForm.admin_first_name}
                      onChange={(e) => setEditForm({...editForm, admin_first_name: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Admin Last Name</label>
                    <input
                      type="text"
                      value={editForm.admin_last_name}
                      onChange={(e) => setEditForm({...editForm, admin_last_name: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Admin Mobile</label>
                  <input
                    type="text"
                    value={editForm.admin_mobile}
                    onChange={(e) => setEditForm({...editForm, admin_mobile: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: Number(e.target.value)})}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Suspended</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Reset Password (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter new password to reset"
                    value={editForm.new_password}
                    onChange={(e) => setEditForm({...editForm, new_password: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Leave empty to keep current password</p>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingParivar(null)}
                    className="flex-1 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
