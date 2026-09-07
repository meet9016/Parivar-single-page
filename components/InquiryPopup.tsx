"use client";
import React, { useState, useEffect } from "react";
import { X, Send, Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function InquiryPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    city: "",
    samaj_name: ""
  });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const whatsappNumber = "918866779008"; 
  const API_URL = "/api/add-demo-lead";

  const [isFromWhatsApp, setIsFromWhatsApp] = useState(false);

  useEffect(() => {
    // 1. Show popup on custom trigger or when any WhatsApp button on the page is clicked
    const handleOpenInquiry = () => {
      setIsFromWhatsApp(true);
      setIsOpen(true);
      setIsSuccess(false);
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
        setIsFromWhatsApp(true);
        setIsOpen(true);
        setIsSuccess(false);
      }
    };

    document.addEventListener("click", handleGlobalClick, true);

    // 2. Automatically show popup when website opens (1.5 seconds delay)
    const timer = setTimeout(() => {
      setIsFromWhatsApp(false);
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
    sessionStorage.setItem("inquiry_closed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim() || !formData.city.trim() || !formData.samaj_name.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (formData.mobile.trim().length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        city: formData.city.trim(),
        samaj_name: formData.samaj_name.trim()
      };

      // Call the requested CRM API
      await axios.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      toast.success("Demo request submitted successfully!");
      setIsSuccess(true);
      
      // Open WhatsApp only if triggered from WhatsApp click
      if (isFromWhatsApp) {
        const msg = `Hello, I am interested in a demo of Parivar.me.\n*Name:* ${formData.name}\n*Mobile:* ${formData.mobile}\n*City:* ${formData.city}\n*Samaj:* ${formData.samaj_name}`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
      }
    } catch (error) {
      console.error("Popup Inquiry Error:", error);
      toast.info("Connecting...");
      
      if (isFromWhatsApp) {
        const msg = `Hello, I am interested in a demo of Parivar.me.\n*Name:* ${formData.name}\n*Mobile:* ${formData.mobile}\n*City:* ${formData.city}\n*Samaj:* ${formData.samaj_name}`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
      }
      setIsSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-300 border border-slate-100 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <>
            <div className="text-center mb-6">
              <div className="mb-3 flex justify-center">
                <img 
                  src="/logo.png" 
                  alt="Parivar Logo" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              <h3 className="text-2xl font-black text-[#0B1340] font-sans">Claim Your Free Demo</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5 font-sans">
                Enter your details below and connect with us on WhatsApp instantly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-sans">Your Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-sans text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-sans">Samaj / Parivar Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Patel Parivar / Leuva Samaj"
                  value={formData.samaj_name}
                  onChange={(e) => setFormData({...formData, samaj_name: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-sans text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-sans">Mobile Number *</label>
                  <input 
                    type="tel" 
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData({...formData, mobile: val});
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-sans text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-sans">City *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Surat"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-sans text-sm font-medium"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-3 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-75 font-sans"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Get Free Demo & Chat</span>
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
            
            <h3 className="text-2xl font-black text-[#0B1340] mb-2 font-sans">Demo Claimed!</h3>
            <p className="text-slate-600 text-sm font-sans mb-6">
              Thank you, <b>{formData.name}</b>! Your demo request has been submitted. WhatsApp has been opened to connect with our team.
            </p>
            
            <button 
              onClick={handleClose}
              className="w-full bg-[#0B1340] hover:bg-blue-900 text-white font-bold py-3 rounded-xl shadow-lg transition-all cursor-pointer font-sans"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
