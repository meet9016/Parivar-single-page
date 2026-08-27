"use client";

import React, { useState } from "react";
import { Zap, Headphones, CheckCircle2, Send, Globe, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "../lib/axiosInstance";
import { ENDPOINTS } from "../lib/endpoints";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    parivar_name: "",
    email: "",
    mobile: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [errors, setErrors] = useState<{ parivar_name?: string; mobile?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    let newErrors: { parivar_name?: string; mobile?: string } = {};
    if (!formData.parivar_name.trim()) newErrors.parivar_name = "Parivar Name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile Number is required";
    
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
                <span>Get In Touch</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tighter">
                Let's Create <br/> Something
              </h2>

              <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed font-medium">
                We Help Communities Connect, Grow, And Scale Digitally With Beautiful Experiences.
              </p>

              {/* Feature Points */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 text-sm font-semibold">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/20 text-blue-300 flex items-center justify-center backdrop-blur-sm">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span>Fast Response</span>
                </div>

                <div className="flex items-center gap-4 text-sm font-semibold">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/20 text-blue-300 flex items-center justify-center backdrop-blur-sm">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <span>Friendly Support</span>
                </div>

                <div className="flex items-center gap-4 text-sm font-semibold">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/20 text-blue-300 flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span>Free Setup</span>
                </div>
              </div>
            </div>

            {/* Social Icons Row */}
            <div className="pt-6 border-t border-slate-800/90 flex items-center gap-2 text-slate-400">
              <a
                href="#"
                className="w-8 h-8 rounded bg-slate-800/80 hover:bg-[#3B82F6] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded bg-slate-800/80 hover:bg-[#3B82F6] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded bg-slate-800/80 hover:bg-[#3B82F6] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded bg-slate-800/80 hover:bg-[#3B82F6] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Youtube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded bg-slate-800/80 hover:bg-[#3B82F6] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Website"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 flex flex-col justify-center">
            <div className="w-full space-y-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0B1340] tracking-tight">
                  Send Message
                </h3>
                <p className="text-slate-500 text-sm mt-2 font-medium">
                  We Typically Respond Within A Few Hours.
                </p>
              </div>

              {/* Form Controls */}
              <form onSubmit={handleSubmit} className="space-y-5 font-sans">
                <div>
                  <input
                    type="text"
                    placeholder="Parivar Name / Your Community Name"
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
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium shadow-sm"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={formData.mobile}
                      onChange={(e) => {
                        setFormData({ ...formData, mobile: e.target.value });
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
                    placeholder="Your Note / Inquiry Details"
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
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

