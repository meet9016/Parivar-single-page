"use client";
import React, { useState, useEffect } from "react";
import { X, Send, Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export default function InquiryPopup() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    city: "",
    samaj_name: ""
  });
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const API_URL = "/api/add-demo-lead";

  useEffect(() => {
    // 1. Show popup on custom trigger or when any WhatsApp button on the page is clicked
    const handleOpenInquiry = () => {
      setIsOpen(true);
      setIsSuccess(false);
      setErrors({});
    };

    window.addEventListener("open_inquiry_popup", handleOpenInquiry);

    // Global listener on any WhatsApp click across the single page
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a, button");
      if (!target) return;

      const href = target.getAttribute("href") || "";
      const isWhatsAppLink = href.includes("wa.me") || href.includes("whatsapp.com");

      if (isWhatsAppLink) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
        setIsSuccess(false);
        setErrors({});
      }
    };

    document.addEventListener("click", handleGlobalClick, true);

    // 2. Automatically show popup when website opens (1.5 seconds delay)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    return () => {
      window.removeEventListener("open_inquiry_popup", handleOpenInquiry);
      document.removeEventListener("click", handleGlobalClick, true);
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setErrors({});
    sessionStorage.setItem("inquiry_closed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; mobile?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = t("popup.errNameReq");
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = t("popup.errMobileReq");
    } else if (formData.mobile.trim().length !== 10) {
      newErrors.mobile = t("popup.errMobileInvalid");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("name", formData.name.trim());
      params.append("mobile", formData.mobile.trim());
      params.append("city", formData.city.trim());
      params.append("samaj_name", formData.samaj_name.trim());

      // Call the requested CRM API directly
      const response = await axios.post(API_URL, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
        }
      });

      if (response.data?.status === false || response.data?.success === false) {
        toast.error(response.data?.message || response.data?.data?.message || response.data?.error || t("popup.errFailed"));
        return;
      }

      toast.success(t("popup.toastSuccess"));
      setIsSuccess(true);
    } catch (error) {
      console.error("Popup Inquiry Error:", error);
      toast.error(t("popup.errFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 border border-slate-100 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100/80 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all cursor-pointer"
          aria-label="Close popup"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSuccess ? (
          <>
            <div className="text-center mb-6 pt-1">
              <h3 className="text-2xl font-extrabold text-[#0B1340] tracking-tight">
                {t("popup.title")}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
                {t("popup.subtitle")}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-semibold capitalize text-slate-700 mb-1.5">
                  {t("popup.nameLabel")} <span className="text-red-500 font-bold">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder={t("popup.namePlaceholder")}
                  value={formData.name}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^\p{L}\s]/gu, "");
                    setFormData({...formData, name: cleaned});
                    if (errors.name) setErrors({...errors, name: undefined});
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-500/10'
                  } focus:ring-4 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-white`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold capitalize text-slate-700 mb-1.5">
                  {t("popup.samajLabel")}
                </label>
                <input 
                  type="text" 
                  placeholder={t("popup.samajPlaceholder")}
                  value={formData.samaj_name}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^\p{L}\p{N}\s]/gu, "");
                    setFormData({...formData, samaj_name: cleaned});
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold capitalize text-slate-700 mb-1.5">
                    {t("popup.mobileLabel")} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input 
                    type="tel" 
                    maxLength={10}
                    placeholder={t("popup.mobilePlaceholder")}
                    value={formData.mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData({...formData, mobile: val});
                      if (errors.mobile) setErrors({...errors, mobile: undefined});
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      errors.mobile ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-500/10'
                    } focus:ring-4 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-white`}
                  />
                  {errors.mobile && (
                    <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                      {errors.mobile}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold capitalize text-slate-700 mb-1.5">
                    {t("popup.cityLabel")}
                  </label>
                  <input 
                    type="text" 
                    placeholder={t("popup.cityPlaceholder")}
                    value={formData.city}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^\p{L}\s]/gu, "");
                      setFormData({...formData, city: cleaned});
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-white"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] active:bg-[#15803d] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-green-500/25 transition-all hover:shadow-green-500/40 hover:-translate-y-0.5 cursor-pointer disabled:opacity-75 disabled:hover:translate-y-0 text-sm tracking-wide"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{t("popup.submitting")}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t("popup.cta")}</span>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mb-4 flex justify-center">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 animate-bounce" />
            </div>
            
            <h3 className="text-2xl font-black text-[#0B1340] mb-2">{t("popup.successTitle")}</h3>
            <p className="text-slate-600 text-sm mb-6">
              {t("popup.successMessage")}
            </p>
            
            <button 
              onClick={handleClose}
              className="w-full bg-[#0B1340] hover:bg-blue-950 text-white font-bold py-3 rounded-xl shadow-lg transition-all cursor-pointer text-sm"
            >
              {t("popup.done")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
