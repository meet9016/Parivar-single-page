"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle, X } from "lucide-react";
import axiosInstance from "../lib/axiosInstance";
import { ENDPOINTS } from "../lib/endpoints";

export default function PricingSection() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<any | null>(null);
  
  const whatsappNumber = "918866779008"; 

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(ENDPOINTS.PRICING);
        if (res.status === 200) {
          setPlans(Array.isArray(res.data.data) ? res.data.data : []);
        }
      } catch (err) {
        console.error("Failed to load pricing plans", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading || plans.length === 0) {
    return null; // Don't show anything if loading or no active plans
  }

  return (
    <section className="relative overflow-hidden bg-[#fafcff] py-16 md:py-24 border-t border-slate-100">
      
      {/* Background elements to match the parivar.me theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-300/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-300/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-blue-100 shadow-sm text-xs font-bold text-blue-900 tracking-wide">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span>Limited Time Offer</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Choose the Perfect Package for Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Community
            </span>
          </h2>
          <p className="text-slate-600 text-base font-medium max-w-lg mx-auto">
            Get the full management panel setup, WhatsApp automation features, and support at exclusive deal pricing.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {plans.map((plan) => {
            const defaultMsg = `Hello, I want to book a free demo of Parivar for the "${plan.title}" package.`;
            const waMsg = plan.whatsappMessage || defaultMsg;
            const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMsg)}`;
            
            // Show maximum 3 features in the card
            const visibleFeatures = plan.features?.slice(0, 3) || [];
            const hasMoreFeatures = plan.features?.length > 3;

            return (
              <div
                key={plan._id}
                className="bg-white/80 backdrop-blur-md border-2 border-indigo-100/50 hover:border-indigo-600 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-[0_4px_25px_-4px_rgba(59,130,246,0.06)] hover:shadow-[0_10px_35px_-4px_rgba(59,130,246,0.12)] transition-all duration-300 relative group overflow-hidden"
              >
                {/* Subtle top decoration */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="space-y-6 relative z-10">
                  {/* Badges / Header */}
                  <div className="text-center space-y-2.5">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100/50 text-blue-700 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      🎯 {plan.subtitle || "Exclusive Deal"}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-[#0B1340]">
                      {plan.title}
                    </h3>
                  </div>

                  {/* Pricing Display */}
                  <div className="text-center space-y-1.5 py-5 bg-[#F8FAFC]/80 rounded-2xl border border-slate-100/80">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-slate-400 text-sm md:text-base line-through font-bold">
                        ₹{plan.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-3xl md:text-4.5xl font-black text-slate-900 tracking-tight">
                        ₹{plan.discountedPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {plan.description && (
                      <p className="text-slate-500 text-xs md:text-sm font-medium">
                        {plan.description}
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3.5 pt-2">
                    {visibleFeatures.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-sm font-semibold">
                          {feature}
                        </span>
                      </div>
                    ))}
                    
                    {hasMoreFeatures && (
                      <button
                        onClick={() => setSelectedPlanForModal(plan)}
                        className="text-blue-600 hover:text-blue-700 text-xs font-extrabold flex items-center gap-1 mt-2.5 cursor-pointer underline decoration-2 underline-offset-2"
                      >
                        + View All {plan.features.length} Features
                      </button>
                    )}
                  </div>
                </div>

                {/* Yellow Highlight Banner & Green WhatsApp Button */}
                <div className="mt-8 pt-6 border-t border-slate-100 space-y-4 relative z-10">
                  {plan.badgeText && (
                    <div className="bg-[#FEF9C3] border border-yellow-200/70 text-yellow-900 text-center font-bold text-xs py-2.5 px-3 rounded-xl shadow-3xs flex items-center justify-center gap-2">
                      💡 {plan.badgeText}
                    </div>
                  )}

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm md:text-base py-3.5 rounded-full shadow-[0_4px_15px_rgba(34,197,94,0.25)] hover:shadow-[0_4px_25px_rgba(34,197,94,0.4)] active:scale-98 transition-all duration-300 text-center"
                  >
                    <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                    <span>{plan.buttonText || "Get Free Demo"}</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Features Modal Pop Up */}
      {selectedPlanForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="flex justify-between items-center px-6 py-4.5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">{selectedPlanForModal.title}</h3>
                <p className="text-xs font-medium text-slate-500">{selectedPlanForModal.subtitle || "Included Features"}</p>
              </div>
              <button
                onClick={() => setSelectedPlanForModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              <div className="space-y-3.5">
                {selectedPlanForModal.features?.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4.5 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedPlanForModal(null)}
                className="bg-[#0B1340] hover:bg-[#070D2B] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
