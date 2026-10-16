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
    badgeText: "",
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
      defaultBadgeText: "Official WhatsApp support - ₹6,000",
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
      defaultBadgeText: "Official WhatsApp support - ₹6,000",
      dbPlan: renewalPlanFromDB,
    },
  ];

  const handleOpenEdit = (cfg: typeof plansConfig[0]) => {
    const orig = cfg.dbPlan?.originalPrice ?? cfg.defaultOriginal;
    const disc = cfg.dbPlan?.discountedPrice ?? cfg.defaultDiscounted;
    const calcPct = orig > disc && orig > 0 ? Math.round(((orig - disc) / orig) * 100) : 0;
    const badge = cfg.dbPlan?.badgeText || cfg.defaultBadgeText;

    setEditingPlanType(cfg.type);
    setFormData({
      originalPrice: String(orig),
      discountedPrice: String(disc),
      discountPercent: String(calcPct),
      badgeText: badge,
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
      badgeText: formData.badgeText.trim() || cfg.defaultBadgeText,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {plansConfig.map((cfg) => {
          const orig = cfg.dbPlan?.originalPrice ?? cfg.defaultOriginal;
          const disc = cfg.dbPlan?.discountedPrice ?? cfg.defaultDiscounted;
          const discountPct = orig > disc && orig > 0 ? Math.round(((orig - disc) / orig) * 100) : 0;
          const badge = cfg.dbPlan?.badgeText || cfg.defaultBadgeText;
          const isEditing = editingPlanType === cfg.type;

              return (
                <div
                  key={cfg.type}
                  className={`bg-white border rounded-xl p-5 transition-colors flex flex-col justify-between shadow-sm ${
                    isEditing ? "border-[#0B1340] ring-2 ring-[#0B1340]" : "border-slate-300 hover:border-slate-400"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{cfg.icon}</span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                          {cfg.title}
                        </h3>
                      </div>
                    </div>

                    {discountPct > 0 && (
                      <span className="bg-rose-50 text-rose-800 border border-rose-300 font-bold text-xs px-2.5 py-1 rounded-md shrink-0">
                        🔥 {discountPct}% OFF
                      </span>
                    )}
                  </div>

                  {!isEditing ? (
                    /* Compact View */
                    <div className="space-y-3.5 pt-1">
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-baseline justify-between">
                        <div>
                          <span className="text-xs font-semibold text-slate-600 block mb-0.5">Offer Price</span>
                          <div className="flex items-baseline gap-2.5">
                            <span className="text-2xl font-black text-slate-900">
                              ₹{disc.toLocaleString("en-IN")}
                            </span>
                            <span className="text-sm text-slate-500 line-through font-medium">
                              ₹{orig.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-md">
                          Save ₹{(orig - disc).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Official WhatsApp Support Badge Preview */}
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-emerald-900 flex items-center gap-2">
                        <span>🎧</span>
                        <span className="truncate">{badge}</span>
                      </div>

                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => handleOpenEdit(cfg)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1340] hover:bg-[#070D2B] text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit Price, % & Support</span>
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
                      className="space-y-3.5 pt-1"
                    >
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Original Price (₹)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-slate-500 font-bold text-sm">₹</span>
                            <input
                              type="number"
                              required
                              min="1"
                              value={formData.originalPrice}
                              onChange={(e) => handlePriceChange(e.target.value, formData.discountedPrice)}
                              className="w-full pl-7 pr-3 py-2 rounded-lg bg-white border border-slate-300 text-sm font-bold text-slate-900 outline-none focus:border-[#0B1340] focus:ring-1 focus:ring-[#0B1340]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Offer Price (₹)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-slate-500 font-bold text-sm">₹</span>
                              <input
                                type="number"
                                required
                                min="1"
                                value={formData.discountedPrice}
                                onChange={(e) => handlePriceChange(formData.originalPrice, e.target.value)}
                                className="w-full pl-7 pr-3 py-2 rounded-lg bg-white border border-slate-300 text-sm font-bold text-emerald-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Discount (% OFF)
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                max="99"
                                value={formData.discountPercent}
                                onChange={(e) => handlePercentChange(formData.originalPrice, e.target.value)}
                                className="w-full pr-7 pl-3 py-2 rounded-lg bg-white border border-slate-300 text-sm font-bold text-rose-700 outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                              />
                              <span className="absolute right-3 top-2 text-slate-500 font-bold text-sm">%</span>
                            </div>
                          </div>
                        </div>

                        {/* WhatsApp Support Text/Price Field */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Official WhatsApp Support Text & Price
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.badgeText}
                            onChange={(e) => setFormData((prev) => ({ ...prev, badgeText: e.target.value }))}
                            placeholder="e.g. Official WhatsApp support - ₹6,000"
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 outline-none focus:border-[#0B1340] focus:ring-1 focus:ring-[#0B1340]"
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingPlanType(null)}
                          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors cursor-pointer border border-slate-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={pricingLoading}
                          className="px-4.5 py-2 rounded-lg bg-[#0B1340] hover:bg-[#070D2B] text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-2"
                        >
                          {pricingLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
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
