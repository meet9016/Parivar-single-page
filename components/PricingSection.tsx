"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import axiosInstance from "../lib/axiosInstance";
import { ENDPOINTS } from "../lib/endpoints";
import { useLanguage } from "../context/LanguageContext";

const guSubstitutions: Array<[RegExp, string]> = [
  [/Instant Notifications+s*/gi, "ઇન્સ્ટન્ટ નોટિફિકેશન"],
  [/Continued Smart Automation/gi, "સતત સ્માર્ટ ઓટોમેશન"],
  [/Smart Automation/gi, "સ્માર્ટ ઓટોમેશન"],
  [/Preserved Digital Heritage/gi, "સુરક્ષિત ડિજિટલ વારસો"],
  [/1 Official WhatsApp API Number/gi, "1 ઓફિશિયલ વોટ્સએપ API નંબર"],
  [/Official WhatsApp API Number/gi, "ઓફિશિયલ વોટ્સએપ API નંબર"],
  [/Additional WhatsApp Number/gi, "વધારાનો WhatsApp નંબર"],
  [/Special Renewal Deal/gi, "સ્પેશિયલ રીન્યુઅલ ડીલ"],
  [/Exclusive Deal/gi, "એક્સક્લુસિવ ડીલ"],
  [/RENEWAL OFFER/gi, "રીન્યુઅલ ઓફર"],
  [/NEW OFFER/gi, "નવી ઓફર"],
  [/Renewal Offer/gi, "રીન્યુઅલ ઓફર"],
  [/New Offer/gi, "નવી ઓફર"],
  [/Renew your package at just ₹6,000/gi, "માત્ર ₹6,000 માં તમારું પેકેજ રીન્યુ કરો"],
  [/Get the Complete Package at Just ₹10,000/gi, "માત્ર ₹10,000 માં સંપૂર્ણ પેકેજ મેળવો"],
  [/Only ₹6,000/gi, "માત્ર ₹6,000"],
  [/Only ₹10,000/gi, "માત્ર ₹10,000"],
  [/Get Free Demo/gi, "ફ્રી ડેમો મેળવો"],
];

const hiSubstitutions: Array<[RegExp, string]> = [
  [/Instant Notifications+s*/gi, "इंस्टेंट नोटिफिकेशन"],
  [/Continued Smart Automation/gi, "निरंतर स्मार्ट ऑटोमेशन"],
  [/Smart Automation/gi, "स्मार्ट ऑटोमेशन"],
  [/Preserved Digital Heritage/gi, "संरक्षित डिजिटल विरासत"],
  [/1 Official WhatsApp API Number/gi, "1 आधिकारिक व्हाट्सएप एपीआई नंबर"],
  [/Official WhatsApp API Number/gi, "आधिकारिक व्हाट्सएप एपीआई नंबर"],
  [/Additional WhatsApp Number/gi, "अतिरिक्त WhatsApp नंबर"],
  [/Special Renewal Deal/gi, "स्पेशल रिन्यूअल डील"],
  [/Exclusive Deal/gi, "एक्सक्लूसिव डील"],
  [/RENEWAL OFFER/gi, "रिन्यूअल ऑफर"],
  [/NEW OFFER/gi, "नया ऑफर"],
  [/Renewal Offer/gi, "रिन्यूअल ऑफर"],
  [/New Offer/gi, "नया ऑफर"],
  [/Renew your package at just ₹6,000/gi, "मात्र ₹6,000 में अपना पैकेज रिन्यू करें"],
  [/Get the Complete Package at Just ₹10,000/gi, "मात्र ₹10,000 में पूरा पैकेज प्राप्त करें"],
  [/Only ₹6,000/gi, "मात्र ₹6,000"],
  [/Only ₹10,000/gi, "मात्र ₹10,000"],
  [/Get Free Demo/gi, "फ्री डेमो प्राप्त करें"],
];

function translateText(text: string, lang: string): string {
  if (!text) return "";
  let result = text;
  if (lang === "gu") {
    for (const [pattern, replacement] of guSubstitutions) {
      result = result.replace(pattern, replacement);
    }
  } else if (lang === "hi") {
    for (const [pattern, replacement] of hiSubstitutions) {
      result = result.replace(pattern, replacement);
    }
  }
  return result;
}

export default function PricingSection() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});
  const { t, language } = useLanguage();
  
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

  const togglePlanExpand = (planId: string) => {
    setExpandedPlans((prev) => ({ ...prev, [planId]: !prev[planId] }));
  };

  if (loading || plans.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#fafcff] py-16 md:py-24 border-t border-slate-100">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
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
            <span>{t("pricing.tag")}</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t("pricing.title1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {t("pricing.title2")}
            </span>
          </h2>
          <p className="text-slate-600 text-base font-medium max-w-lg mx-auto">
            {t("pricing.subtitle")}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {plans.map((plan) => {
            const defaultMsg = `Hello, I want to book a free demo of Parivar for the "${plan.title}" package.`;
            const waMsg = plan.whatsappMessage || defaultMsg;
            const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMsg)}`;
            
            const isExpanded = !!expandedPlans[plan._id];
            const allFeatures = plan.features || [];
            const remainingCount = allFeatures.length - 3;
            const visibleFeatures = isExpanded ? allFeatures : allFeatures.slice(0, 3);

            return (
              <div
                key={plan._id}
                className="bg-white/80 backdrop-blur-md border-2 border-indigo-100/50 hover:border-indigo-600 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-[0_4px_25px_-4px_rgba(59,130,246,0.06)] hover:shadow-[0_10px_35px_-4px_rgba(59,130,246,0.12)] transition-all duration-300 relative group overflow-hidden"
              >
                {/* Top highlight bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="space-y-6 relative z-10">
                  {/* Badges / Header */}
                  <div className="text-center space-y-2.5">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100/50 text-blue-700 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      🎯 {translateText(plan.subtitle || "Exclusive Deal", language)}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-[#0B1340]">
                      {translateText(plan.title, language)}
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
                        {translateText(plan.description, language)}
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3.5 pt-2">
                    {visibleFeatures.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-sm font-semibold">
                          {translateText(feature, language)}
                        </span>
                      </div>
                    ))}
                    
                    {allFeatures.length > 3 && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => togglePlanExpand(plan._id)}
                          className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                        >
                          {isExpanded ? (
                            <>
                              <span>{t("pricing.less")}</span>
                              <ChevronUp className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              <span>+{remainingCount} {t("pricing.more")}</span>
                              <ChevronDown className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Yellow Highlight Banner & Green WhatsApp Button */}
                <div className="mt-8 pt-6 border-t border-slate-100 space-y-4 relative z-10">
                  {plan.badgeText && (
                    <div className="bg-[#FEF9C3] border border-yellow-200/70 text-yellow-900 text-center font-bold text-xs py-2.5 px-3 rounded-xl shadow-3xs flex items-center justify-center gap-2">
                      💡 {translateText(plan.badgeText, language)}
                    </div>
                  )}

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm md:text-base py-3.5 rounded-full shadow-[0_4px_15px_rgba(34,197,94,0.25)] hover:shadow-[0_4px_25px_rgba(34,197,94,0.4)] active:scale-98 transition-all duration-300 text-center"
                  >
                    <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                    <span>{translateText(plan.buttonText || "Get Free Demo", language)}</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
