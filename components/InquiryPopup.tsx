"use client";
import React, { useState, useEffect } from "react";
import { X, Send, Loader2, CheckCircle2 } from "lucide-react";
import axiosInstance from "../lib/axiosInstance";
import { ENDPOINTS } from "../lib/endpoints";
import { toast } from "sonner";

export default function InquiryPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const whatsappNumber = "918866779008"; 

  useEffect(() => {
    // Show popup after 15 seconds
    const timer = setTimeout(() => {
      // Check if they already closed it this session to not annoy them
      if (!sessionStorage.getItem("inquiry_closed")) {
        setIsOpen(true);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("inquiry_closed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    setLoading(true);
    try {
      // Call the Inquiry API
      const res = await axiosInstance.post(ENDPOINTS.INQUIRY, {
        parivar_name: formData.name,
        mobile: formData.phone,
        note: "Submitted via Claim Your Free Demo popup",
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Inquiry Submitted successfully!");
        setIsSuccess(true);
        
        // Open WhatsApp redirect in new window
        const msg = `Hello, I am interested in a demo of Parivar.me.\nName: ${formData.name}\nPhone: ${formData.phone}`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
      } else {
        toast.error("Failed to submit inquiry. Please try again.");
      }
    } catch (error) {
      console.error("Popup Inquiry Error:", error);
      toast.error("Network error. Directing to WhatsApp directly.");
      
      // Fallback redirect if backend is down
      const msg = `Hello, I am interested in a demo of Parivar.me.\nName: ${formData.name}\nPhone: ${formData.phone}`;
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
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
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-300 border border-slate-100">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <>
            <div className="text-center mb-6">
              <div className="mb-4 flex justify-center">
                <img 
                  src="/logo.png" 
                  alt="Parivar Logo" 
                  className="h-12 w-auto object-contain"
                />
              </div>
              <h3 className="text-2xl font-black text-[#0B1340] font-sans">Claim Your Free Demo</h3>
              <p className="text-slate-500 text-sm mt-2 font-sans">Enter your details below and we will reach out to you on WhatsApp instantly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 font-sans">Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-sans text-sm font-medium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 font-sans">Mobile Number</label>
                <input 
                  type="tel" 
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setFormData({...formData, phone: val});
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-sans text-sm font-medium"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-75 font-sans"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Connect on WhatsApp</span>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mb-6 flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
            </div>
            
            <h3 className="text-2xl font-black text-[#0B1340] mb-2 font-sans">Demo Claimed!</h3>
            <p className="text-slate-600 text-sm font-sans mb-6">
              Thank you! Your demo request has been successfully recorded. We will connect with you on WhatsApp shortly.
            </p>
            
            <button 
              onClick={handleClose}
              className="w-full bg-[#0B1340] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all cursor-pointer font-sans"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
