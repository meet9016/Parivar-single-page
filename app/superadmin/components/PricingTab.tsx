"use client";

import React, { useState } from "react";
import { Edit2, CheckCircle2, DollarSign, Sparkles, RefreshCw, ArrowRight, IndianRupee, Percent } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";
import { toast } from "sonner";

export default function PricingTab() {
  const { pricingPlans, pricingLoading, handleCreatePricingPlan, handleEditPricingPlan } = useSuperAdmin();

  const [editingPlanType, setEditingPlanType] = useState<"new" | "renewal" | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    originalPrice: "",
    discountedPrice: "",
    discountPercent: "",
    mode: "price", // "price" | "percent"
  });

  // Identify plans from DB or fallback
  const newPlanFromDB = pricingPlans.find(
    (p) =>
      p.subtitle?.toLowerCase().includes("new") ||
      p.title?.toLowerCase().includes("1st") ||
      p.title?.toLowerCase().includes("first") ||
      p.title?.toLowerCase().includes("exclusive") ||
      p.order === 0
  ) || pricingPlans[0];

  const renewalPlanFromDB = pricingPlans.find(
    (p) =>
      p.subtitle?.toLowerCase().includes("renewal") ||
      p.title?.toLowerCase().includes("renewal") ||
      p.title?.toLowerCase().includes("annual") ||
      p.order === 1
  ) || pricingPlans[1];

  const plansConfig = [
    {
      type: "new" as const,
      icon: "👑",
      title: "1st Year Plan (પ્રથમ વર્ષનો પ્લાન)",
      subtitle: "New Plan Offer",
      theme: "emerald",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      btnColor: "bg-emerald-600 hover:bg-emerald-700",
      borderActive: "border-emerald-300 ring-4 ring-emerald-50",
      defaultOriginal: 39000,
      defaultDiscounted: 19999,
      defaultTitle: "1st year plan",
      defaultSubtitle: "New plan",
      dbPlan: newPlanFromDB,
    },
    {
      type: "renewal" as const,
      icon: "⭐",
      title: "Annual Renewal Plan (વાર્ષિક રિન્યુઅલ પ્લાન)",
      subtitle: "Renewal Plan Offer",
      theme: "blue",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      btnColor: "bg-[#0B1340] hover:bg-[#070D2B]",
      borderActive: "border-blue-300 ring-4 ring-blue-50",
      defaultOriginal: 15000,
      defaultDiscounted: 10000,
      defaultTitle: "Annual renewal plan",
      defaultSubtitle: "Renewal plan",
      dbPlan: renewalPlanFromDB,
    },
  ];

  const handleOpenEdit = (cfg: typeof plansConfig[0]) => {
    const orig = cfg.dbPlan?.originalPrice ?? cfg.defaultOriginal;
    const disc = cfg.dbPlan?.discountedPrice ?? cfg.defaultDiscounted;
    const calcPct = orig > disc && orig > 0 ? Math.round(((orig - disc) / orig) * 100) : 0;

    setEditingPlanType(cfg.type);
    setFormData({
      originalPrice: String(orig),
      discountedPrice: String(disc),
      discountPercent: String(calcPct),
      mode: "price",
    });
  };

  const handlePriceChange = (origStr: string, discStr: string) => {
    const orig = Number(origStr) || 0;
    const disc = Number(discStr) || 0;
    let pct = "";
    if (orig > 0 && disc > 0 && orig > disc) {
      pct = String(Math.round(((orig - disc) / orig) * 100));
    }
    setFormData((prev) => ({
      ...prev,
      originalPrice: origStr,
      discountedPrice: discStr,
      discountPercent: pct,
    }));
  };

  const handlePercentChange = (origStr: string, pctStr: string) => {
    const orig = Number(origStr) || 0;
    const pct = Number(pctStr) || 0;
    let disc = "";
    if (orig > 0 && pct >= 0 && pct <= 100) {
      disc = String(Math.round(orig - (orig * pct) / 100));
    }
    setFormData((prev) => ({
      ...prev,
      originalPrice: origStr,
      discountPercent: pctStr,
      discountedPrice: disc,
    }));
  };

  const handleSubmit = async (cfg: typeof plansConfig[0]) => {
    const orig = Number(formData.originalPrice);
    const disc = Number(formData.discountedPrice);

    if (!orig || !disc || orig <= 0 || disc <= 0) {
      toast.error("Please enter valid positive prices.");
      return;
    }

    if (disc > orig) {
      toast.error("Offer price cannot be greater than original price.");
      return;
    }

    const payload = {
      title: cfg.dbPlan?.title || cfg.defaultTitle,
      subtitle: cfg.dbPlan?.subtitle || cfg.defaultSubtitle,
      originalPrice: orig,
      discountedPrice: disc,
      description: cfg.type === "new" ? `Get the Complete Package at Just ₹${disc}` : `Renew your package at just ₹${disc}`,
      features: cfg.dbPlan?.features?.length
        ? cfg.dbPlan.features
        : [
            "Smart app solution",
            "Instant notifications",
            "Secure data backup",
            "Free domain",
            "Free server",
            "Website and app customization",
            "Free technical support",
          ],
      badgeText: cfg.dbPlan?.badgeText || "Official WhatsApp support - ₹6,000",
      buttonText: "Contact on WhatsApp",
      whatsappMessage:
        cfg.type === "new"
          ? `Hello, I want to inquire about the 1st Year Plan (₹${disc.toLocaleString("en-IN")}) for Parivar.me`
          : `Hello, I want to inquire about the Annual Renewal Plan (₹${disc.toLocaleString("en-IN")}) for Parivar.me`,
      status: 1,
      order: cfg.type === "new" ? 0 : 1,
    };

    let success = false;
    if (cfg.dbPlan?._id) {
      success = await handleEditPricingPlan(cfg.dbPlan._id, payload);
    } else {
      success = await handleCreatePricingPlan(payload);
    }

    if (success) {
      setEditingPlanType(null);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Compact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {plansConfig.map((cfg) => {
          const orig = cfg.dbPlan?.originalPrice ?? cfg.defaultOriginal;
          const disc = cfg.dbPlan?.discountedPrice ?? cfg.defaultDiscounted;
          const discountPct = orig > disc && orig > 0 ? Math.round(((orig - disc) / orig) * 100) : 0;
          const isEditing = editingPlanType === cfg.type;

          return (
            <div
              key={cfg.type}
              className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs transition-all relative overflow-hidden flex flex-col justify-between ${
                isEditing ? cfg.borderActive : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">{cfg.icon}</span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                      {cfg.title}
                    </h3>
                  </div>
                </div>

                {discountPct > 0 && (
                  <span className="bg-rose-50 text-rose-700 border border-rose-200 font-extrabold text-[11px] px-2 py-0.5 rounded-full shrink-0">
                    🔥 {discountPct}% OFF
                  </span>
                )}
              </div>

              {!isEditing ? (
                /* Compact View */
                <div className="space-y-3 pt-1">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Offer Price</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-900">
                          ₹{disc.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-slate-400 line-through font-bold">
                          ₹{orig.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      Save ₹{(orig - disc).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleOpenEdit(cfg)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B1340] hover:bg-[#070D2B] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Price & % OFF</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Compact Edit Form */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(cfg);
                  }}
                  className="space-y-3 pt-1 animate-in fade-in"
                >
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Original Price (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          required
                          min="1"
                          value={formData.originalPrice}
                          onChange={(e) => handlePriceChange(e.target.value, formData.discountedPrice)}
                          className="w-full pl-6 pr-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-[#0B1340]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Offer Price (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2 text-slate-400 font-bold text-xs">₹</span>
                          <input
                            type="number"
                            required
                            min="1"
                            value={formData.discountedPrice}
                            onChange={(e) => handlePriceChange(formData.originalPrice, e.target.value)}
                            className="w-full pl-6 pr-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-emerald-700 outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Discount (% OFF)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="99"
                            value={formData.discountPercent}
                            onChange={(e) => handlePercentChange(formData.originalPrice, e.target.value)}
                            className="w-full pr-6 pl-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-rose-600 outline-none focus:ring-1 focus:ring-rose-500"
                          />
                          <span className="absolute right-2.5 top-2 text-slate-400 font-bold text-xs">%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingPlanType(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={pricingLoading}
                      className="px-4 py-1.5 rounded-lg bg-[#0B1340] hover:bg-[#070D2B] text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1"
                    >
                      {pricingLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                      <span>Save</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
