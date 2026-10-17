"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Building2,
  IndianRupee,
  CheckCircle2,
  Clock,
  MessageSquare,
  Briefcase,
  ArrowUpRight,
  PlusCircle,
  AlertCircle,
  Phone,
  ChevronRight,
  RefreshCw,
  FileSpreadsheet,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Search,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { useSuperAdmin, SubscriptionWatchlistItem } from "../context/SuperAdminContext";

export default function DashboardTab() {
  const {
    dashboardData,
    dashboardLoading,
    fetchDashboardData,
    parivars,
    inquiries,
    handleInquiryStatus,
    setActiveTab,
    setIsCreateModalOpen,
    setEditingParivar,
  } = useSuperAdmin();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [subscriptionFilter, setSubscriptionFilter] = useState<
    "all" | "expired" | "expiring_soon" | "active"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch dashboard stats from backend API on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchDashboardData();
      toast.success("Dashboard data refreshed");
    } catch {
      toast.error("Failed to refresh dashboard");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Safe fallback metrics from server or local
  const m = dashboardData?.metrics || {
    total_parivars: parivars.length,
    total_active_parivars: parivars.filter((p: any) => p.status === 1 || p.status === true).length,
    total_inactive_parivars: parivars.filter((p: any) => p.status !== 1 && p.status !== true).length,
    active_percentage: parivars.length > 0 ? 100 : 0,

    total_project_amount: 15000,
    avg_deal_amount: 15000,
    total_received_amount: 7500,
    collection_rate: 50,

    total_pending_amount: 7500,
    communities_with_pending: 1,

    total_expired: 0,
    total_expiring_soon: 0,
    total_active_plans: parivars.length || 1,

    total_inquiries: inquiries.length,
    pending_inquiries: inquiries.filter((i: any) => i.status !== 0).length,
    resolved_inquiries: inquiries.filter((i: any) => i.status === 0).length,

    total_tasks: 7,
    total_spent_hours: 24.67,
    completed_tasks: 5,
    in_progress_tasks: 2,
  };

  const recentParivars = dashboardData?.recent_parivars || [];
  const recentInquiries = dashboardData?.recent_inquiries || [];
  const rawWatchlist = dashboardData?.subscription_watchlist || [];

  // Filtered and searched watchlist
  const filteredWatchlist = useMemo(() => {
    return rawWatchlist.filter((item: SubscriptionWatchlistItem) => {
      // 1. Tab filter
      if (subscriptionFilter === "expired" && item.subscription_status !== "expired") {
        return false;
      }
      if (subscriptionFilter === "expiring_soon" && item.subscription_status !== "expiring_soon") {
        return false;
      }
      if (
        subscriptionFilter === "active" &&
        item.subscription_status !== "active" &&
        item.subscription_status !== "lifetime"
      ) {
        return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (item.parivar_name || "").toLowerCase().includes(q);
        const matchesAdmin = (item.admin_name || "").toLowerCase().includes(q);
        const matchesMobile = (item.admin_mobile || "").includes(q);
        const matchesCity = (item.city || "").toLowerCase().includes(q);
        const matchesPlan = (item.subscription_plan_time || "").toLowerCase().includes(q);
        return matchesName || matchesAdmin || matchesMobile || matchesCity || matchesPlan;
      }

      return true;
    });
  }, [rawWatchlist, subscriptionFilter, searchQuery]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "-";
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const getElapsedInfo = (startDateStr?: string, expiryDateStr?: string, planTime?: string) => {
    if (!startDateStr) {
      return {
        label: "Activated recently",
        days: 0,
        percent: 0,
      };
    }

    const start = new Date(startDateStr);
    const now = new Date();
    const elapsedMs = Math.max(0, now.getTime() - start.getTime());
    const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));

    let label = "Activated today";
    if (elapsedDays === 1) {
      label = "Active for 1 day";
    } else if (elapsedDays > 1 && elapsedDays < 30) {
      label = `Active for ${elapsedDays} days`;
    } else if (elapsedDays >= 30 && elapsedDays < 365) {
      const months = Math.floor(elapsedDays / 30);
      const remDays = elapsedDays % 30;
      label = `Active for ${months} mo${months > 1 ? "s" : ""}${remDays > 0 ? ` ${remDays}d` : ""}`;
    } else if (elapsedDays >= 365) {
      const years = Math.floor(elapsedDays / 365);
      const remMonths = Math.floor((elapsedDays % 365) / 30);
      label = `Active for ${years} yr${years > 1 ? "s" : ""}${remMonths > 0 ? ` ${remMonths} mo` : ""}`;
    }

    let percent = 0;
    if (expiryDateStr && planTime !== "Lifetime") {
      const totalMs = new Date(expiryDateStr).getTime() - start.getTime();
      if (totalMs > 0) {
        percent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));
      }
    }

    return { label, days: elapsedDays, percent };
  };

  const handleOpenRenewModal = (item: SubscriptionWatchlistItem) => {
    const target = parivars.find((x: any) => String(x._id) === String(item._id)) || item;
    setEditingParivar({
      _id: target._id,
      community_type: target.community_type || "Parivar",
      parivar_name: target.parivar_name,
      company_name: target.company_name || target.parivar_name || "",
      village_name: target.village_name || "",
      status: target.status ?? 1,
      admin_first_name: target.admin_name || target.admin_first_name || target.admin?.first_name || "",
      admin_last_name: target.admin_last_name || target.admin?.last_name || "",
      admin_email: target.admin_email || target.admin?.email || "",
      admin_mobile: target.admin_mobile || target.admin?.mobile || "",
      country: target.country || "India",
      state: target.state || "",
      city: target.city || "",
      subscription_plan_time: target.subscription_plan_time || "1 Year",
      subscription_start_date: target.subscription_start_date || target.createdAt || item.subscription_start_date || "",
      subscription_expiry_date: target.subscription_expiry_date || item.subscription_expiry_date || "",
      project_amount: target.project_amount !== undefined ? target.project_amount : (target.total_amount || ""),
      free_customization_hours: target.free_customization_hours !== undefined ? target.free_customization_hours : 15,
      extra_hourly_rate: target.extra_hourly_rate !== undefined ? target.extra_hourly_rate : 1000,
      notes: target.notes || "",
    });
  };

  const getWhatsAppReminderUrl = (item: SubscriptionWatchlistItem) => {
    const cleanPhone = (item.admin_mobile || "").replace(/\D/g, "");
    if (!cleanPhone) return null;

    const expiryFormatted = formatDate(item.subscription_expiry_date);
    const plan = item.subscription_plan_time || "Subscription";
    const name = item.admin_name || "Admin";
    const community = item.parivar_name || "Parivar";

    let msg = "";
    if (item.subscription_status === "expired") {
      const overdue = Math.abs(item.days_remaining ?? 0);
      msg = `Hello ${name}, Greetings from Parivar Team!\n\nThis is an urgent notice that the subscription plan (${plan}) for *${community}* expired ${
        overdue === 0 ? "today" : `${overdue} day(s) ago`
      } on ${expiryFormatted}.\n\nPlease renew your subscription to ensure uninterrupted mobile application access for all members.\n\nContact our team for quick renewal. Thank you!`;
    } else if (item.subscription_status === "expiring_soon") {
      msg = `Hello ${name}, Greetings from Parivar Team!\n\nThis is a friendly reminder that the subscription plan (${plan}) for *${community}* is expiring on *${expiryFormatted}* (${
        item.days_remaining === 0 ? "today" : `in ${item.days_remaining} day(s)`
      }).\n\nTo ensure smooth and uninterrupted service for your community members, kindly arrange for timely plan renewal.\n\nPlease let us know if you need any assistance. Thank you!`;
    } else {
      msg = `Hello ${name}, Greetings from Parivar Team!\n\nThank you for choosing Parivar for *${community}*. Your active subscription plan is *${plan}*, valid until *${expiryFormatted}*.\n\nLet us know if you have any questions or customization requests. Thank you!`;
    }

    return `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const handleExportExcel = () => {
    try {
      const summaryRows: any[][] = [
        ["PARIVAR.ME - EXECUTIVE DASHBOARD & SUBSCRIPTION EXPIRY REPORT"],
        ["Generated On", new Date().toLocaleString("en-IN")],
        [],
        ["KPI METRICS", "VALUE"],
        ["Total Registered Communities", m.total_parivars],
        ["Active Communities", m.total_active_parivars],
        ["Inactive Communities", m.total_inactive_parivars],
        ["Total Expired Plans", m.total_expired ?? 0],
        ["Plans Expiring in 30 Days", m.total_expiring_soon ?? 0],
        ["Healthy Active Plans", m.total_active_plans ?? 0],
        ["Total Gross Valuation (₹)", m.total_project_amount],
        ["Total Realized Collections (₹)", m.total_received_amount],
        ["Total Outstanding Balance (₹)", m.total_pending_amount],
        ["Collection Recovery Rate (%)", `${m.collection_rate}%`],
        [],
        [
          "COMMUNITY NAME",
          "ADMIN NAME",
          "MOBILE",
          "CITY",
          "PLAN",
          "START DATE",
          "ACTIVE DURATION (TIME COMPLETED)",
          "EXPIRY DATE",
          "DAYS REMAINING",
          "PLAN PROGRESS (%)",
          "EXPIRY STATUS",
          "TOTAL (₹)",
          "RECEIVED (₹)",
          "PENDING (₹)",
        ],
      ];

      rawWatchlist.forEach((p: SubscriptionWatchlistItem) => {
        const elapsed = getElapsedInfo(p.subscription_start_date, p.subscription_expiry_date, p.subscription_plan_time);
        summaryRows.push([
          p.parivar_name || "-",
          p.admin_name || "-",
          p.admin_mobile || "-",
          p.city || "-",
          p.subscription_plan_time || "1 Year",
          formatDate(p.subscription_start_date),
          p.elapsed_label || elapsed.label,
          formatDate(p.subscription_expiry_date),
          p.days_remaining !== null ? p.days_remaining : "Lifetime",
          p.plan_progress_percent !== undefined ? `${p.plan_progress_percent}%` : `${elapsed.percent}%`,
          p.status_label || p.subscription_status,
          p.total_amount || 0,
          p.received_amount || 0,
          p.pending_amount || 0,
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(summaryRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Subscriptions");
      XLSX.writeFile(
        wb,
        `Parivar_Subscriptions_Expiry_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      toast.success("Excel report exported successfully!");
    } catch {
      toast.error("Failed to export Excel");
    }
  };

  return (
    <div className="space-y-5 w-full pb-10 font-sans">
      {/* ── CLEAN TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Dashboard Overview
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time client subscription expiries, renewal alerts, collections, and operations
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || dashboardLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            title="Refresh dashboard metrics"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-slate-500 ${
                isRefreshing || dashboardLoading ? "animate-spin text-[#413afb]" : ""
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-all cursor-pointer active:scale-95"
            title="Export subscription & dashboard report to Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#413afb] hover:bg-[#322bd9] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Parivar</span>
          </button>
        </div>
      </div>

      {/* ── 3 DEDICATED PLAN EXPIRY & SUBSCRIPTION ALERT CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* CARD 1: EXPIRED PLANS (CRITICAL) */}
        <div
          onClick={() =>
            setSubscriptionFilter(subscriptionFilter === "expired" ? "all" : "expired")
          }
          className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
            subscriptionFilter === "expired"
              ? "bg-rose-50/90 border-rose-400 ring-2 ring-rose-300 shadow-sm"
              : "bg-white hover:bg-rose-50/30 border-rose-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                Already Expired
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                Action Required
              </span>
            </div>
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">
                {m.total_expired ?? 0}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {(m.total_expired ?? 0) === 1 ? "Client plan" : "Client plans"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-0.5">
              Service overdue • Immediate renewal needed
            </p>
          </div>

          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
              (m.total_expired ?? 0) > 0
                ? "bg-rose-100 text-rose-600 animate-pulse"
                : "bg-rose-50 text-rose-500"
            }`}
          >
            <AlertTriangle className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        {/* CARD 2: EXPIRING SOON (NEXT 30 DAYS) */}
        <div
          onClick={() =>
            setSubscriptionFilter(subscriptionFilter === "expiring_soon" ? "all" : "expiring_soon")
          }
          className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
            subscriptionFilter === "expiring_soon"
              ? "bg-amber-50/90 border-amber-400 ring-2 ring-amber-300 shadow-sm"
              : "bg-white hover:bg-amber-50/30 border-amber-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Expiring in 30 Days
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Follow Up
              </span>
            </div>
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">
                {m.total_expiring_soon ?? 0}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {(m.total_expiring_soon ?? 0) === 1 ? "Client plan" : "Client plans"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-0.5">
              Upcoming renewals • Send advance reminder
            </p>
          </div>

          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Clock className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        {/* CARD 3: HEALTHY & ACTIVE PLANS */}
        <div
          onClick={() =>
            setSubscriptionFilter(subscriptionFilter === "active" ? "all" : "active")
          }
          className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
            subscriptionFilter === "active"
              ? "bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-300 shadow-sm"
              : "bg-white hover:bg-emerald-50/30 border-emerald-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Healthy Subscriptions
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Active
              </span>
            </div>
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                {m.total_active_plans ?? 0}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {(m.total_active_plans ?? 0) === 1 ? "Active client" : "Active clients"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-0.5">
              Active licenses & lifetime plans in good standing
            </p>
          </div>

          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <ShieldCheck className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* ── 4 CORE FINANCIAL & OPERATIONAL KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL COMMUNITIES */}
        <div
          onClick={() => setActiveTab("parivars")}
          className="group bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#413afb]/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 group-hover:text-[#413afb] transition-colors">
                Total Registered
              </span>
              <div className="flex items-baseline gap-2 pt-0.5">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {m.total_parivars}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {m.active_percentage}% Active
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#413afb] flex items-center justify-center group-hover:bg-[#413afb] group-hover:text-white transition-all">
              <Building2 className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              {m.total_active_parivars} Active • {m.total_inactive_parivars} Inactive
            </span>
            <span className="text-[#413afb] font-semibold flex items-center gap-0.5">
              View <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* CONTRACT VALUATION */}
        <div
          onClick={() => setActiveTab("parivars")}
          className="group bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-purple-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 group-hover:text-purple-600 transition-colors">
                Contract Valuation
              </span>
              <div className="flex items-baseline gap-2 pt-0.5">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  ₹{m.total_project_amount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
              <IndianRupee className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Avg: <strong>₹{m.avg_deal_amount.toLocaleString("en-IN")}</strong> / deal
            </span>
            <span className="text-purple-600 font-semibold flex items-center gap-0.5">
              Breakdown <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* COLLECTED PAYMENTS */}
        <div
          onClick={() => setActiveTab("parivars")}
          className="group bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-emerald-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 group-hover:text-emerald-600 transition-colors">
                Collected Payments
              </span>
              <div className="flex items-baseline gap-2 pt-0.5">
                <span className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                  ₹{m.total_received_amount.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {m.collection_rate}%
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <CheckCircle2 className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-slate-100 space-y-1">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${m.collection_rate}%` }}
              />
            </div>
          </div>
        </div>

        {/* OUTSTANDING DUE */}
        <div
          onClick={() => setActiveTab("parivars")}
          className="group bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-rose-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 group-hover:text-rose-600 transition-colors">
                Outstanding Balance Due
              </span>
              <div className="flex items-baseline gap-2 pt-0.5">
                <span className="text-2xl font-extrabold text-rose-600 tracking-tight">
                  ₹{m.total_pending_amount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all">
              <Clock className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              <strong>{m.communities_with_pending}</strong> with due balance
            </span>
            <span className="text-rose-600 font-semibold flex items-center gap-0.5">
              Review <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* ── CLIENT SUBSCRIPTION & PLAN EXPIRY MANAGER (MAIN FEATURE) ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Panel Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#413afb] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  Client Plan Expiry & Subscription Tracker
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {rawWatchlist.length} Clients
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track client validity dates, overdue warnings, send WhatsApp reminders, or renew subscriptions in 1 click
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search client, admin, mobile, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#413afb] focus:ring-2 focus:ring-[#413afb]/15 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/60 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSubscriptionFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                subscriptionFilter === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>All Clients</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  subscriptionFilter === "all"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {rawWatchlist.length}
              </span>
            </button>

            <button
              onClick={() => setSubscriptionFilter("expiring_soon")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                subscriptionFilter === "expiring_soon"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-amber-700 hover:bg-amber-50 border border-amber-200"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Expiring in 30 Days</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  subscriptionFilter === "expiring_soon"
                    ? "bg-white/20 text-white"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {m.total_expiring_soon ?? 0}
              </span>
            </button>

            <button
              onClick={() => setSubscriptionFilter("expired")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                subscriptionFilter === "expired"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-white text-rose-700 hover:bg-rose-50 border border-rose-200"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Already Expired</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  subscriptionFilter === "expired"
                    ? "bg-white/20 text-white"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {m.total_expired ?? 0}
              </span>
            </button>

            <button
              onClick={() => setSubscriptionFilter("active")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                subscriptionFilter === "active"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Active Plans</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  subscriptionFilter === "active"
                    ? "bg-white/20 text-white"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {m.total_active_plans ?? 0}
              </span>
            </button>
          </div>
        </div>

        {/* Watchlist Table */}
        <div className="overflow-x-auto">
          {filteredWatchlist.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Calendar className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No client plans match this filter</p>
              <p className="text-xs text-slate-400">
                {searchQuery
                  ? "Try searching with a different keyword or reset filters."
                  : "All client plans are currently in good standing."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSubscriptionFilter("all");
                  }}
                  className="text-xs font-bold text-[#413afb] hover:underline pt-2 cursor-pointer"
                >
                  Clear search & show all
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Client / Community</th>
                  <th className="py-3 px-4">Admin Contact</th>
                  <th className="py-3 px-4">Plan & Active Tenure</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Status / Validity</th>
                  <th className="py-3 px-4">Account Due</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredWatchlist.map((item: SubscriptionWatchlistItem) => {
                  const isExpired = item.subscription_status === "expired";
                  const isExpiringSoon = item.subscription_status === "expiring_soon";
                  const isLifetime = item.subscription_status === "lifetime";
                  const waUrl = getWhatsAppReminderUrl(item);
                  const isPending = Number(item.pending_amount) > 0;
                  const elapsedInfo = getElapsedInfo(
                    item.subscription_start_date,
                    item.subscription_expiry_date,
                    item.subscription_plan_time
                  );

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Community Name & Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl font-extrabold flex items-center justify-center text-xs shrink-0 transition-colors ${
                              isExpired
                                ? "bg-rose-100 text-rose-700"
                                : isExpiringSoon
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-50 text-[#413afb]"
                            }`}
                          >
                            {item.parivar_name?.charAt(0)?.toUpperCase() || "P"}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate group-hover:text-[#413afb] transition-colors">
                              {item.parivar_name}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate">
                              {item.city || item.village_name || item.community_type || "Parivar App"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Admin Contact */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-800 block">
                            {item.admin_name || "Admin"}
                          </span>
                          {item.admin_mobile ? (
                            <a
                              href={`tel:${item.admin_mobile}`}
                              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3 text-slate-400" />
                              {item.admin_mobile}
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-400">-</span>
                          )}
                        </div>
                      </td>

                      {/* Plan Duration, Active Tenure (Kitna time hua) & Progress */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-1.5 min-w-[170px]">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs">
                              {item.subscription_plan_time || "1 Year"}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-[#413afb] border border-blue-200">
                              ⚡ {item.elapsed_label || elapsedInfo.label}
                            </span>
                          </div>

                          {/* Mini Progress Bar showing Completed vs Remaining */}
                          {!isLifetime && (
                            <div className="w-full max-w-[190px] space-y-1">
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    isExpired
                                      ? "bg-rose-500"
                                      : isExpiringSoon
                                      ? "bg-amber-500"
                                      : "bg-[#413afb]"
                                  }`}
                                  style={{
                                    width: `${item.plan_progress_percent ?? elapsedInfo.percent}%`,
                                  }}
                                />
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                                <span>{item.plan_progress_percent ?? elapsedInfo.percent}% elapsed</span>
                                <span>{isExpired ? "Expired" : `${item.days_remaining ?? 0}d left`}</span>
                              </div>
                            </div>
                          )}

                          <span className="text-[10px] text-slate-400 block">
                            Started: {formatDate(item.subscription_start_date)}
                          </span>
                        </div>
                      </td>

                      {/* Expiry Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isLifetime ? (
                          <span className="font-semibold text-purple-700 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            Lifetime
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <span
                              className={`font-bold block ${
                                isExpired
                                  ? "text-rose-600"
                                  : isExpiringSoon
                                  ? "text-amber-700"
                                  : "text-slate-800"
                              }`}
                            >
                              {formatDate(item.subscription_expiry_date)}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              Renewal target
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Status / Validity Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isExpired && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            {item.days_remaining !== null && item.days_remaining < 0
                              ? `Expired ${Math.abs(item.days_remaining)}d ago`
                              : "Expired"}
                          </span>
                        )}

                        {isExpiringSoon && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            {item.days_remaining === 0
                              ? "Expires today"
                              : `Expires in ${item.days_remaining}d`}
                          </span>
                        )}

                        {!isExpired && !isExpiringSoon && !isLifetime && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Active ({item.days_remaining ?? "-"}d left)
                          </span>
                        )}

                        {isLifetime && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            Lifetime Access
                          </span>
                        )}
                      </td>

                      {/* Account Due / Paid */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isPending ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-rose-600 block">
                              ₹{Number(item.pending_amount).toLocaleString("en-IN")} due
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              Total ₹{Number(item.total_amount).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="font-bold text-emerald-600 block">Fully Paid</span>
                            <span className="text-[10px] text-slate-400 block">
                              ₹{Number(item.total_amount).toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {/* WhatsApp Reminder */}
                          {waUrl ? (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                                isExpired
                                  ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
                                  : isExpiringSoon
                                  ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                              }`}
                              title="Send WhatsApp renewal/expiry reminder"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Remind</span>
                            </a>
                          ) : null}

                          {/* Quick Renew Plan Button */}
                          <button
                            onClick={() => handleOpenRenewModal(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                            title="Renew or edit subscription plan"
                          >
                            <RefreshCw className="w-3 h-3 text-[#413afb]" />
                            <span>Renew Plan</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            Showing <strong>{filteredWatchlist.length}</strong> of <strong>{rawWatchlist.length}</strong> client subscriptions
          </span>
          <button
            onClick={() => setActiveTab("parivars")}
            className="text-xs font-semibold text-[#413afb] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Manage All Communities in Parivars Tab <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── 2 CORE OPERATIONAL PANELS: RECENT INQUIRIES & RECENT ONBOARDINGS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* RECENT LEADS & INQUIRIES */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Visitor Inquiries & Leads
                </h3>
              </div>

              <button
                onClick={() => setActiveTab("inquiries")}
                className="text-xs font-semibold text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentInquiries.length === 0 ? (
                <div className="p-10 text-center text-xs text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-600 text-sm">No inquiries yet</p>
                  <p className="text-[11px] text-slate-400">
                    Submissions from your landing page form will appear here in real time.
                  </p>
                </div>
              ) : (
                recentInquiries.map((inq: any) => {
                  const isResolved = inq.status === 0;
                  const cleanPhone = (inq.mobile || "").replace(/\D/g, "");

                  return (
                    <div
                      key={inq._id}
                      className="p-3.5 sm:p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {inq.parivar_name || "Interested Community"}
                          </h4>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                              isResolved
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {isResolved ? "Resolved" : "Pending"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {inq.note || "Requested callback"}
                        </p>
                        <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {inq.mobile || "-"}
                          </span>
                          <span>•</span>
                          <span>
                            {inq.createdAt
                              ? new Date(inq.createdAt).toLocaleDateString("en-IN")
                              : "Recent"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                              `Hello ${inq.parivar_name || ""}, thank you for your inquiry on Parivar.me!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => handleInquiryStatus(inq._id, inq.status)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                            isResolved
                              ? "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                          }`}
                        >
                          {isResolved ? "Reopen" : "Done"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50/60 border-t border-slate-100 text-center">
            <button
              onClick={() => setActiveTab("inquiries")}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Review All Inquiries ({m.total_inquiries})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RECENT ONBOARDINGS & VELOCITY SUMMARY */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#413afb] flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Recent Onboarded Communities
                </h3>
              </div>

              <button
                onClick={() => setActiveTab("parivars")}
                className="text-xs font-semibold text-[#413afb] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentParivars.length === 0 ? (
                <div className="p-10 text-center text-xs text-slate-400">
                  No registered communities found.
                </div>
              ) : (
                recentParivars.map((p: any) => {
                  const isActive = p.status === 1 || p.status === true;
                  const isFullyPaid = Number(p.pending_amount) <= 0;

                  return (
                    <div
                      key={p._id}
                      onClick={() => setActiveTab("parivars")}
                      className="p-3.5 sm:p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 group-hover:bg-[#413afb] group-hover:text-white transition-colors">
                          {p.parivar_name?.charAt(0)?.toUpperCase() || "P"}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm truncate">
                              {p.parivar_name}
                            </h4>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                                isActive
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-500 border border-slate-200"
                              }`}
                            >
                              {isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {p.admin_name ? `${p.admin_name} • ` : ""}
                            {p.city || p.village_name || "Gujarat"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-slate-900 text-sm block">
                          ₹{Number(p.total_amount || 0).toLocaleString("en-IN")}
                        </span>
                        {isFullyPaid ? (
                          <span className="text-[11px] font-semibold text-emerald-600 block">
                            Fully Paid
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-rose-600 block">
                            ₹{Number(p.pending_amount || 0).toLocaleString("en-IN")} due
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-4">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-sky-600" />
              <span>
                Dev Velocity: <strong>{m.total_spent_hours} hrs</strong> across {m.total_tasks} tasks
              </span>
            </span>
            <button
              onClick={() => setActiveTab("tasks")}
              className="font-semibold text-sky-600 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Tasks <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
