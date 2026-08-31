"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, CheckCircle, X, DollarSign, List, ArrowUp, ArrowDown } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";
import { toast } from "sonner";

export default function PricingTab() {
  const { pricingPlans, pricingLoading, handleCreatePricingPlan, handleEditPricingPlan, handleDeletePricingPlan } = useSuperAdmin();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    originalPrice: "",
    discountedPrice: "",
    description: "",
    features: [] as string[],
    badgeText: "",
    buttonText: "Get Free Demo",
    whatsappMessage: "",
    status: 1,
    order: "" as string | number,
  });

  const [featureInput, setFeatureInput] = useState("");

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormData({
      title: "",
      subtitle: "",
      originalPrice: "",
      discountedPrice: "",
      description: "",
      features: [],
      badgeText: "",
      buttonText: "Get Free Demo",
      whatsappMessage: "",
      status: 1,
      order: pricingPlans.length,
    });
    setFeatureInput("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      subtitle: plan.subtitle || "",
      originalPrice: String(plan.originalPrice),
      discountedPrice: String(plan.discountedPrice),
      description: plan.description || "",
      features: plan.features || [],
      badgeText: plan.badgeText || "",
      buttonText: plan.buttonText || "Get Free Demo",
      whatsappMessage: plan.whatsappMessage || "",
      status: plan.status ?? 1,
      order: plan.order !== undefined && plan.order !== null ? String(plan.order) : "",
    });
    setFeatureInput("");
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.originalPrice || !formData.discountedPrice) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = {
      ...formData,
      originalPrice: Number(formData.originalPrice),
      discountedPrice: Number(formData.discountedPrice),
      status: Number(formData.status),
      order: Number(formData.order),
    };

    let success = false;
    if (editingPlan) {
      success = await handleEditPricingPlan(editingPlan._id, payload);
    } else {
      success = await handleCreatePricingPlan(payload);
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this pricing plan?")) {
      await handleDeletePricingPlan(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Manage Pricing Plans / Deals</h2>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pricing Plan</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 w-12 text-center">Order</th>
                <th className="px-5 py-3.5">Plan Title / Subtitle</th>
                <th className="px-5 py-3.5">Pricing</th>
                <th className="px-5 py-3.5">Features Included</th>
                <th className="px-5 py-3.5">Badge/WhatsApp CTA</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pricingLoading && pricingPlans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 font-medium">
                    Loading pricing plans...
                  </td>
                </tr>
              ) : pricingPlans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 space-y-2">
                    <List className="w-7 h-7 mx-auto text-slate-300 stroke-[1.5]" />
                    <p>No pricing plans created yet. They will appear here and on the landing page.</p>
                  </td>
                </tr>
              ) : (
                pricingPlans.map((plan) => (
                  <tr key={plan._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 text-center font-semibold text-slate-600">
                      {plan.order}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-sm text-slate-800">{plan.title}</div>
                      {plan.subtitle && <div className="text-xs text-slate-500 mt-0.5">{plan.subtitle}</div>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-slate-800">
                        <span>₹{plan.discountedPrice}</span>
                        <span className="text-xs font-medium text-slate-400 line-through">₹{plan.originalPrice}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="max-w-[220px]">
                        <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                          {plan.features?.slice(0, 3).map((f: string, idx: number) => (
                            <li key={idx} className="truncate">{f}</li>
                          ))}
                          {plan.features?.length > 3 && (
                            <li className="text-blue-500 font-semibold list-none mt-0.5">
                              +{plan.features.length - 3} more features
                            </li>
                          )}
                        </ul>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 space-y-1">
                      {plan.badgeText && (
                        <span className="inline-block bg-amber-50 text-amber-700 font-semibold border border-amber-200 px-2 py-0.5 rounded text-[10px]">
                          {plan.badgeText}
                        </span>
                      )}
                      <div>
                        <span className="font-semibold text-slate-700">Button: </span>
                        <span>{plan.buttonText}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                        plan.status === 1
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        {plan.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => handleOpenEdit(plan)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Deal"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan._id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Deal"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-150 rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">
                {editingPlan ? "Edit Pricing Deal Card" : "Add New Pricing Deal Card"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deal Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Exclusive Deal"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Offer Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Limited Time Offer"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 20000"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Discounted / Offer Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 10000"
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brief Description</label>
                <input
                  type="text"
                  placeholder="e.g. Get the Complete Package at Just ₹10,000"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Add Included Features / Points</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. 1 Official WhatsApp API Number"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    className="flex-1 text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>

                {formData.features.length > 0 && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                    {formData.features.map((feature, idx) => (
                      <div key={idx} className="flex justify-between items-center gap-2 bg-white px-3 py-1.5 border border-slate-100 rounded-lg text-xs font-semibold text-slate-700 shadow-3xs">
                        <span className="truncate">{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-slate-400 hover:text-red-500 p-0.5 rounded-md hover:bg-slate-50 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Highlight Yellow Badge Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Additional WhatsApp Number — Only ₹6,000"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Get Free Demo"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Custom WhatsApp Auto-Msg on Click</label>
                <textarea
                  placeholder="e.g. Hello, I am interested in the WhatsApp CRM Setup deal. Please call back."
                  value={formData.whatsappMessage}
                  onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                  rows={2}
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-white outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value={1}>Active (Visible)</option>
                    <option value={0}>Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors"
                >
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
