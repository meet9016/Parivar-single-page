"use client";

import React, { useState } from "react";
import { Zap, Headphones, CheckCircle2, Send, Globe, Loader2, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "../lib/axiosInstance";
import { ENDPOINTS } from "../lib/endpoints";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactSection() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    parivar_name: "",
    email: "",
    mobile: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [errors, setErrors] = useState<{ parivar_name?: string; email?: string; mobile?: string }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    let newErrors: { parivar_name?: string; email?: string; mobile?: string } = {};
    if (!formData.parivar_name.trim()) newErrors.parivar_name = "Parivar Name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!formData.email.trim().toLowerCase().endsWith("@gmail.com")) {
      newErrors.email = "Only @gmail.com emails are allowed";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Mobile Number must be exactly 10 digits";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setStatusMessage(null);
    setErrors({});

    try {
      const res = await axiosInstance.post(ENDPOINTS.INQUIRY, {
        parivar_name: formData.parivar_name,
        email: formData.email,
        mobile: formData.mobile,
        note: formData.note,
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Inquiry Submitted Successfully!", {
          description: `Thank you! Your request for "${formData.parivar_name}" has been received. Our team will contact you soon.`,
          duration: 5000,
        });
        setStatusMessage({
          type: "success",
          text: "Thank you! Your inquiry has been submitted successfully.",
        });
        setShowSuccessModal(true);
        setFormData({ parivar_name: "", email: "", mobile: "", note: "" });
      } else {
        const errorText = res.data?.message || "Failed to submit inquiry. Please try again.";
        toast.error("Submission Failed", {
          description: errorText,
        });
        setStatusMessage({
          type: "error",
          text: errorText,
        });
      }
    } catch (err: any) {
      const errorText = "Server connection failed. Make sure backend is running.";
      toast.error("Network Error", {
        description: errorText,
      });
      setStatusMessage({
        type: "error",
        text: errorText,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-12 md:py-16 bg-[#fafcff] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Main Card Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-white bg-white">

          {/* Left Column: Solid Dark Navy Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0B1340] via-[#101c5a] to-[#070D2B] text-white p-8 sm:p-12 flex flex-col justify-between space-y-10 relative overflow-hidden">
            {/* Subtle light effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold text-xs tracking-widest uppercase shadow-sm">
                <span>{t("nav.contact")}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tighter">
                {t("contact.title")}
              </h2>

              <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed font-medium">
                {t("contact.subtitle")}
              </p>

              {/* Feature Points */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 text-sm font-semibold">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/20 text-blue-300 flex items-center justify-center backdrop-blur-sm">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span>{t("contact.f1")}</span>
                </div>

                <div className="flex items-center gap-4 text-sm font-semibold">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/20 text-blue-300 flex items-center justify-center backdrop-blur-sm">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <span>{t("contact.f2")}</span>
                </div>

                <div className="flex items-center gap-4 text-sm font-semibold">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/20 text-blue-300 flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span>{t("contact.f3")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 flex flex-col justify-center">
            <div className="w-full space-y-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0B1340] tracking-tight">
                  {t("contact.submit")}
                </h3>
              </div>

              {/* Form Controls */}
              <form onSubmit={handleSubmit} className="space-y-5 font-sans">
                <div>
                  <input
                    type="text"
                    placeholder={t("contact.name")}
                    value={formData.parivar_name}
                    onChange={(e) => {
                      setFormData({ ...formData, parivar_name: e.target.value });
                      if (errors.parivar_name) setErrors({ ...errors, parivar_name: "" });
                    }}
                    className={`w-full px-4 py-3.5 rounded-xl bg-slate-50 border ${errors.parivar_name ? 'border-rose-400 focus:ring-rose-500 focus:bg-rose-50/30' : 'border-slate-200 focus:ring-blue-500'} text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all font-medium shadow-sm`}
                  />
                  {errors.parivar_name && (
                    <p className="text-xs text-rose-500 mt-2 font-semibold pl-1">{errors.parivar_name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <input
                      type="email"
                      placeholder={t("contact.email")}
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      className={`w-full px-4 py-3.5 rounded-xl bg-slate-50 border ${errors.email ? 'border-rose-400 focus:ring-rose-500 focus:bg-rose-50/30' : 'border-slate-200 focus:ring-blue-500'} text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all font-medium shadow-sm`}
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-500 mt-2 font-semibold pl-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder={t("contact.mobile")}
                      maxLength={10}
                      value={formData.mobile}
                      onChange={(e) => {
                        setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') });
                        if (errors.mobile) setErrors({ ...errors, mobile: "" });
                      }}
                      className={`w-full px-4 py-3.5 rounded-xl bg-slate-50 border ${errors.mobile ? 'border-rose-400 focus:ring-rose-500 focus:bg-rose-50/30' : 'border-slate-200 focus:ring-blue-500'} text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all font-medium shadow-sm`}
                    />
                    {errors.mobile && (
                      <p className="text-xs text-rose-500 mt-2 font-semibold pl-1">{errors.mobile}</p>
                    )}
                  </div>
                </div>

                <div>
                  <textarea
                    rows={4}
                    placeholder={t("contact.message")}
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none font-medium shadow-sm"
                  ></textarea>
                </div>

                {statusMessage && (
                  <div
                    className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      statusMessage.type === "success"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                        : "bg-rose-50 border border-rose-200 text-rose-700"
                    }`}
                  >
                    {statusMessage.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    )}
                    <span>{statusMessage.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B1340] hover:bg-blue-900 text-white font-bold text-sm py-4 px-6 rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:hover:translate-y-0 font-sans mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                      <span>{t("contact.submit")}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

      </div>
    </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />
          
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-300 border border-slate-100">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center py-4">
              <div className="mb-6 flex justify-center">
                <img 
                  src="/logo.png" 
                  alt="Parivar.me Logo" 
                  className="h-14 w-auto object-contain"
                />
              </div>
              
              <h3 className="text-2xl font-black text-[#0B1340] mb-2 font-sans">Inquiry Submitted!</h3>
              <p className="text-slate-600 text-sm font-sans">
                Thank you for reaching out. Your inquiry has been recorded successfully. Our team will get back to you shortly.
              </p>
              
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full mt-6 bg-[#0B1340] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all cursor-pointer font-sans"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

