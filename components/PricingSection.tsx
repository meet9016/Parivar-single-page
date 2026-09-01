"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import axiosInstance from "../lib/axiosInstance";
import { ENDPOINTS } from "../lib/endpoints";
import { useLanguage } from "../context/LanguageContext";

// ─── PHRASE-LEVEL TRANSLATIONS (checked first, longest match wins) ───
const guPhrases: Record<string, string> = {
  "year renewal deal": "વાર્ષિક રિન્યુઅલ પ્લાન",
  "annual renewal deal": "વાર્ષિક રિન્યુઅલ પ્લાન",
  "special renewal deal": "ખાસ રિન્યુઅલ પ્લાન",
  "exclusive deal": "પ્રથમ વર્ષનો પ્લાન",
  "new offer": "નવી ઓફર",
  "renewal offer": "રિન્યુઅલ ઓફર",
  "special": "ખાસ",
  "deal": "પ્લાન",
  "offer": "ઓફર",
  "get free demo": "ફ્રી ડેમો મેળવો",
  "get demo": "ફ્રી ડેમો મેળવો",
  "continued smart automation": "નિરંતર સ્માર્ટ ઓટોમેશન",
  "smart automation": "સ્માર્ટ ઓટોમેશન",
  "preserved digital heritage": "સુરક્ષિત ડિજિટલ વારસો",
  "play store, app store application available": "પ્લે સ્ટોર, એપ સ્ટોર એપ્લિકેશન ઉપલબ્ધ",
  "play store, app store application": "પ્લે સ્ટોર, એપ સ્ટોર એપ્લિકેશન",
  "additional whatsapp number": "વધારાનો વોટ્સએપ નંબર",
  "free sms": "ફ્રી એસએમએસ",
  "1st year plan": "પ્રથમ વર્ષનો પ્લાન",
  "first year plan": "પ્રથમ વર્ષનો પ્લાન",
  "new plan": "નવી ઓફર",
  "annual renewal plan": "વાર્ષિક રિન્યુઅલ પ્લાન",
  "renewal plan": "રિન્યુઅલ ઓફર",
  "smart app solution": "સ્માર્ટ એપ સોલ્યુશન",
  "complete smart app solution": "સંપૂર્ણ સ્માર્ટ એપ સોલ્યુશન",
  "instant notifications": "ઇન્સ્ટન્ટ નોટિફિકેશન",
  "instant notification": "ઇન્સ્ટન્ટ નોટિફિકેશન",
  "secure data backup": "સુરક્ષિત ડેટા બેકઅપ",
  "free domain": "ફ્રી ડોમેન",
  "free server": "ફ્રી સર્વર",
  "website and app customization": "વેબસાઇટ અને એપ પર કસ્ટમાઇઝેશન",
  "customization on website and app": "વેબસાઇટ અને એપ પર કસ્ટમાઇઝેશન",
  "free technical support": "ફ્રી ટેકનિકલ સપોર્ટ",
  "official whatsapp support - ₹6,000": "ઓફિશિયલ વોટ્સએપ સપોર્ટ – ₹6,000",
  "official whatsapp support": "ઓફિશિયલ વોટ્સએપ સપોર્ટ – ₹6,000",
  "contact on whatsapp": "વોટ્સએપ પર સંપર્ક કરો",
  "whatsapp contact": "વોટ્સએપ પર સંપર્ક કરો",
  "our experts will guide you.": "અમારા એક્સપર્ટ તમને માર્ગદર્શન આપશે.",
};

const hiPhrases: Record<string, string> = {
  "year renewal deal": "वार्षिक नवीनीकरण प्लान",
  "annual renewal deal": "वार्षिक नवीनीकरण प्लान",
  "special renewal deal": "विशेष नवीनीकरण प्लान",
  "exclusive deal": "प्रथम वर्ष का प्लान",
  "new offer": "नई ऑफर",
  "renewal offer": "नवीनीकरण ऑफर",
  "special": "खास",
  "deal": "प्लान",
  "offer": "ऑफर",
  "get free demo": "फ्री डेमो प्राप्त करें",
  "get demo": "फ्री डेमो प्राप्त करें",
  "continued smart automation": "निरंतर स्मार्ट ऑटोमेशन",
  "smart automation": "स्मार्ट ऑटोमेशन",
  "preserved digital heritage": "सुरक्षित डिजिटल विरासत",
  "play store, app store application available": "प्ले स्टोर, ऐप स्टोर एप्लिकेशन उपलब्ध",
  "play store, app store application": "प्ले स्टोर, ऐप स्टोर एप्लिकेशन",
  "additional whatsapp number": "अतिरिक्त व्हाट्सएप नंबर",
  "free sms": "फ्री एसएमएस",
  "1st year plan": "प्रथम वर्ष का प्लान",
  "first year plan": "प्रथम वर्ष का प्लान",
  "new plan": "नया प्लान",
  "annual renewal plan": "वार्षिक नवीनीकरण प्लान",
  "renewal plan": "नवीनीकरण प्लान",
  "smart app solution": "स्मार्ट ऐप सॉल्यूशन",
  "complete smart app solution": "संपूर्ण स्मार्ट ऐप सॉल्यूशन",
  "instant notifications": "इंस्टेंट नोटिफिकेशन",
  "instant notification": "इंस्टेंट नोटिफिकेशन",
  "secure data backup": "सुरक्षित डेटा बैकअप",
  "free domain": "फ्री डोमेन",
  "free server": "फ्री सर्वर",
  "website and app customization": "वेबसाइट और ऐप कस्टमाइज़ेशन",
  "customization on website and app": "वेबसाइट और ऐप कस्टमाइज़ेशन",
  "free technical support": "फ्री टेक्निकल सपोर्ट",
  "official whatsapp support - ₹6,000": "ऑफिशियल व्हाट्सएप सपोर्ट – ₹6,000",
  "official whatsapp support": "ऑफिशियल व्हाट्सएप सपोर्ट – ₹6,000",
  "contact on whatsapp": "व्हाट्सएप पर संपर्क करें",
  "whatsapp contact": "व्हाट्सएप पर संपर्क करें",
  "our experts will guide you.": "हमारे विशेषज्ञ आपका मार्गदर्शन करेंगे।",
};

// ─── WORD-LEVEL DICTIONARY ───
const guWords: Record<string, string> = {
  "whatsapp": "વોટ્સએપ", "free": "ફ્રી", "domain": "ડોમેન", "server": "સર્વર", "smart": "સ્માર્ટ", 
  "app": "એપ", "solution": "સોલ્યુશન", "backup": "બેકઅપ", "instant": "ઇન્સ્ટન્ટ",
  "technical": "ટેકનિકલ", "support": "સપોર્ટ", "renewal": "રિન્યુઅલ", "plan": "પ્લાન",
  "new": "નવી", "offer": "ઓફર", "special": "ખાસ", "deal": "પ્લાન", "exclusive": "ખાસ",
  "continued": "નિરંતર", "automation": "ઓટોમેશન", "preserved": "સુરક્ષિત", "digital": "ડિજિટલ",
  "heritage": "વારસો", "play": "પ્લે", "store": "સ્ટોર", "application": "એપ્લિકેશન",
  "available": "ઉપલબ્ધ", "sms": "એસએમએસ", "additional": "વધારાનો", "number": "નંબર",
  "get": "મેળવો", "demo": "ડેમો", "year": "વાર્ષિક", "annual": "વાર્ષિક"
};

const hiWords: Record<string, string> = {
  "whatsapp": "व्हाट्सएप", "free": "फ्री", "domain": "डोमेन", "server": "सर्वर", "smart": "स्मार्ट",
  "app": "ऐप", "solution": "सॉल्यूशन", "backup": "बैकअप", "instant": "इंस्टेंट",
  "technical": "टेक्निकल", "support": "सपोर्ट", "renewal": "रिन्यूअल", "plan": "प्लान",
  "new": "नया", "offer": "ऑफर", "special": "खास", "deal": "प्लान", "exclusive": "खास",
  "continued": "निरंतर", "automation": "ऑटोमेशन", "preserved": "सुरक्षित", "digital": "डिजिटल",
  "heritage": "विरासत", "play": "प्ले", "store": "स्टोर", "application": "एप्लिकेशन",
  "available": "उपलब्ध", "sms": "एसएमएस", "additional": "अतिरिक्त", "number": "नंबर",
  "get": "प्राप्त करें", "demo": "डेमो", "year": "वार्षिक", "annual": "वार्षिक"
};

const pricePatterns: Array<{ pattern: RegExp; gu: string; hi: string }> = [
  { pattern: /Renew your package at just ₹([0-9,]+)/gi, gu: "માત્ર ₹$1 માં તમારું પેકેજ રિન્યુ કરો", hi: "मात्र ₹$1 में अपना पैकेज रिन्यू करें" },
  { pattern: /Get the Complete Package at Just ₹([0-9,]+)/gi, gu: "માત્ર ₹$1 માં સંપૂર્ણ પેકેજ મેળવો", hi: "मात्र ₹$1 में पूरा पैकेज प्राप्त करें" },
  { pattern: /Only ₹([0-9,]+)/gi, gu: "માત્ર ₹$1", hi: "मात्र ₹$1" },
];

function translateText(text: string, lang: string): string {
  if (!text || lang === "en") return text;

  const phrases = lang === "gu" ? guPhrases : hiPhrases;
  const words = lang === "gu" ? guWords : hiWords;

  let result = text;

  // Replace WhatsApp / whatsapp / WHATSAPP explicitly for Gujarati/Hindi
  if (lang === "gu") {
    result = result.replace(/whatsapp/gi, "વોટ્સએપ");
  } else if (lang === "hi") {
    result = result.replace(/whatsapp/gi, "व्हाट्सएप");
  }

  for (const pp of pricePatterns) {
    result = result.replace(pp.pattern, lang === "gu" ? pp.gu : pp.hi);
  }

  const sortedPhrases = Object.keys(phrases).sort((a, b) => b.length - a.length);
  for (const phrase of sortedPhrases) {
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    result = result.replace(regex, phrases[phrase]);
  }

  result = result.replace(/[a-zA-Z]+/g, (word) => {
    const lower = word.toLowerCase();
    if (words[lower] !== undefined) {
      return words[lower];
    }
    return word;
  });

  return result.replace(/\s{2,}/g, " ").trim();
}

// Helpers to identify plan types
const isRenewalPlan = (plan: any) => {
  const t = (plan.title || "").toLowerCase();
  const s = (plan.subtitle || "").toLowerCase();
  return (
    t.includes("renewal") ||
    s.includes("renewal") ||
    t.includes("રિન્યુઅલ") ||
    s.includes("રિન્યુઅલ") ||
    t.includes("नवीनीकरण") ||
    s.includes("नवीनीकरण") ||
    plan.badgeType === "renewal"
  );
};

const isNewDealPlan = (plan: any) => {
  if (isRenewalPlan(plan)) return false;
  const t = (plan.title || "").toLowerCase();
  const s = (plan.subtitle || "").toLowerCase();
  return (
    t.includes("new") ||
    s.includes("new") ||
    t.includes("exclusive") ||
    s.includes("exclusive") ||
    t.includes("special") ||
    s.includes("special") ||
    t.includes("પ્રથમ") ||
    t.includes("ખાસ") ||
    t.includes("નવી") ||
    t.includes("નવું") ||
    s.includes("નવી") ||
    s.includes("નવું") ||
    s.includes("ખાસ") ||
    s.includes("नई") ||
    s.includes("विशेष") ||
    plan.badgeType === "new" ||
    Number(plan.discountedPrice || 0) > 15000
  );
};

const DEFAULT_PLANS = [
  {
    _id: "plan-new-1st-year",
    title: "પ્રથમ વર્ષનો પ્લાન",
    subtitle: "નવું પ્લાન",
    badgeType: "new",
    originalPrice: 35000,
    discountedPrice: 25000,
    description: "માત્ર ₹25,000 માં સંપૂર્ણ પેકેજ મેળવો",
    features: [
      "સ્માર્ટ એપ સોલ્યુશન",
      "ઇન્સ્ટન્ટ નોટિફિકેશન",
      "સુરક્ષિત ડેટા બેકઅપ",
      "ફ્રી ડોમેન",
      "ફ્રી સર્વર",
      "વેબસાઇટ અને એપ પર કસ્ટમાઇઝેશન",
      "ફ્રી ટેકનિકલ સપોર્ટ"
    ],
    badgeText: "ઓફિશિયલ વોટ્સએપ સપોર્ટ – ₹6,000",
    buttonText: "વોટ્સએપ પર સંપર્ક કરો",
    whatsappMessage: "Hello, I want to inquire about the 1st Year Plan (₹25,000) for Parivar.me"
  },
  {
    _id: "plan-annual-renewal",
    title: "વાર્ષિક રિન્યુઅલ પ્લાન",
    subtitle: "રિન્યુઅલ પ્લાન",
    badgeType: "renewal",
    originalPrice: 15000,
    discountedPrice: 10000,
    description: "માત્ર ₹10,000 માં તમારું પેકેજ રિન્યુ કરો",
    features: [
      "સંપૂર્ણ સ્માર્ટ એપ સોલ્યુશન",
      "ફ્રી ડોમેન",
      "સુરક્ષિત ડેટા બેકઅપ",
      "ઇન્સ્ટન્ટ નોટિફિકેશન",
      "ફ્રી સર્વર",
      "વેબસાઇટ અને એપ પર કસ્ટમાઇઝેશન",
      "ફ્રી ટેકનિકલ સપોર્ટ"
    ],
    badgeText: "ઓફિશિયલ વોટ્સએપ સપોર્ટ – ₹6,000",
    buttonText: "વોટ્સએપ પર સંપર્ક કરો",
    whatsappMessage: "Hello, I want to inquire about the Annual Renewal Plan (₹10,000) for Parivar.me"
  }
];

export default function PricingSection() {
  const [plans, setPlans] = useState<any[]>(DEFAULT_PLANS);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});
  const { t, language } = useLanguage();
  
  const whatsappNumber = "918866779008"; 

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axiosInstance.get(ENDPOINTS.PRICING);
        if (res.status === 200 && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const fetchedPlans = res.data.data;
          // Sort to ensure New Deal/Exclusive plan is always 1st (on the left) and Renewal is 2nd
          const sortedPlans = [...fetchedPlans].sort((a: any, b: any) => {
            const isA_New = isNewDealPlan(a);
            const isB_New = isNewDealPlan(b);
            if (isA_New && !isB_New) return -1;
            if (!isA_New && isB_New) return 1;
            return (a.order || 0) - (b.order || 0);
          });
          setPlans(sortedPlans);
        }
      } catch (err) {
        console.error("Using default pricing plans");
      }
    };
    fetchPlans();
  }, []);

  const togglePlanExpand = (planId: string) => {
    setExpandedPlans((prev) => {
      const willExpand = !prev[planId];
      if (willExpand) {
        setTimeout(() => {
          const cardEl = document.getElementById(planId);
          if (cardEl) {
            cardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }, 100);
      }
      return { ...prev, [planId]: willExpand };
    });
  };

  return (
    <section id="pricing" className="relative overflow-hidden bg-[#fafcff] py-16 md:py-24 border-t border-slate-100">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-300/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-300/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-blue-100 shadow-2xs text-xs font-bold text-blue-900 tracking-wide">
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
          {plans.map((plan, index) => {
            const defaultMsg = `Hello, I want to book a free demo of Parivar for the "${plan.title}" package.`;
            const waMsg = plan.whatsappMessage || defaultMsg;
            const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMsg)}`;
            
            const planId = plan._id || `plan-${index}`;
            const isExpanded = !!expandedPlans[planId];
            const allFeatures = plan.features || [];
            const displayedFeatures = isExpanded ? allFeatures : allFeatures.slice(0, 4);
            const isNewPlan = isNewDealPlan(plan);

            return (
              <div
                key={planId}
                id={planId}
                className={`bg-white/90 backdrop-blur-md border-2 ${isNewPlan ? 'border-emerald-200 hover:border-emerald-500 shadow-[0_4px_25px_-4px_rgba(16,185,129,0.12)]' : 'border-blue-100 hover:border-blue-500 shadow-[0_4px_25px_-4px_rgba(59,130,246,0.12)]'} rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden`}
              >
                {/* Top highlight bar */}
                <div className={`absolute top-0 inset-x-0 h-1.5 ${isNewPlan ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`} />
                
                <div className="space-y-6 relative z-10">
                  {/* Badges / Header */}
                  <div className="text-center space-y-2.5">
                    <span className={`inline-flex items-center gap-1.5 ${isNewPlan ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'} border text-[11px] md:text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider`}>
                      {isNewPlan ? '👑' : '⭐'} {translateText(plan.subtitle || (isNewPlan ? "નવું પ્લાન" : "રિન્યુઅલ પ્લાન"), language)}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black text-[#0B1340]">
                      {translateText(plan.title, language)}
                    </h3>
                  </div>

                  {/* Pricing Display */}
                  <div className={`text-center space-y-1.5 py-5 rounded-2xl border ${isNewPlan ? 'bg-emerald-50/50 border-emerald-100' : 'bg-blue-50/40 border-blue-100'}`}>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-slate-400 text-base md:text-lg line-through font-bold">
                        ₹{plan.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className={`text-3.5xl md:text-4.5xl font-black ${isNewPlan ? 'text-emerald-700' : 'text-blue-900'} tracking-tight`}>
                        ₹{plan.discountedPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {plan.description && (
                      <p className="text-slate-600 text-xs md:text-sm font-semibold">
                        {translateText(plan.description, language)}
                      </p>
                    )}
                  </div>

                  {/* Features List (Max 4 by default, with right-aligned toggle) */}
                  <div className="space-y-3 pt-2">
                    {displayedFeatures.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 transition-all duration-200">
                        <CheckCircle2 className={`w-5 h-5 ${isNewPlan ? 'text-emerald-600' : 'text-blue-600'} shrink-0 mt-0.5`} />
                        <span className="text-slate-800 text-sm font-semibold">
                          {translateText(feature, language)}
                        </span>
                      </div>
                    ))}

                    {allFeatures.length > 4 && (
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => togglePlanExpand(planId)}
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ${
                            isNewPlan
                              ? "bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border-emerald-200"
                              : "bg-blue-50 hover:bg-blue-100/80 text-blue-800 border-blue-200"
                          }`}
                        >
                          <span>
                            {isExpanded
                              ? (language === "gu" ? "ઓછું દર્શાવો" : language === "hi" ? "कम दिखाएं" : "Show Less")
                              : (language === "gu"
                                  ? `+${allFeatures.length - 4} વધુ જુઓ`
                                  : language === "hi"
                                  ? `+${allFeatures.length - 4} और देखें`
                                  : `+${allFeatures.length - 4} More Points`)}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Official WhatsApp support & CTA Button */}
                <div className="mt-8 pt-6 border-t border-slate-100 space-y-4 relative z-10">
                  <div className={`rounded-xl p-3 border text-center text-xs font-bold flex items-center justify-center gap-2 ${isNewPlan ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-blue-50/80 border-blue-200 text-blue-900'}`}>
                    <span>🎧</span>
                    <span>{translateText(plan.badgeText || "ઓફિશિયલ વોટ્સએપ સપોર્ટ – ₹6,000", language)}</span>
                  </div>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base py-3.5 rounded-full shadow-lg shadow-emerald-600/30 hover:shadow-xl active:scale-98 transition-all duration-300 text-center"
                  >
                    <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                    <span>{translateText(plan.buttonText || "વોટ્સએપ પર સંપર્ક કરો", language)}</span>
                  </a>

                  <p className="text-center text-xs text-slate-500 font-medium">
                    {t("pricing.expertNote")}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
