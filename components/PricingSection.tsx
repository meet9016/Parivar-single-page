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
    title: "1st year plan",
    subtitle: "New plan",
    badgeType: "new",
    originalPrice: 35000,
    discountedPrice: 25000,
    description: "Get the Complete Package at Just ₹25,000",
    features: [
      "Smart app solution",
      "Instant notifications",
      "Secure data backup",
      "Free domain",
      "Free server",
      "Website and app customization",
      "Free technical support"
    ],
    badgeText: "Official WhatsApp support - ₹6,000",
    buttonText: "Contact on WhatsApp",
    whatsappMessage: "Hello, I want to inquire about the 1st Year Plan (₹25,000) for Parivar.me"
  },
  {
    _id: "plan-annual-renewal",
    title: "Annual renewal plan",
    subtitle: "Renewal plan",
    badgeType: "renewal",
    originalPrice: 15000,
    discountedPrice: 10000,
    description: "Renew your package at just ₹10,000",
    features: [
      "Complete smart app solution",
      "Free domain",
      "Secure data backup",
      "Instant notifications",
      "Free server",
      "Website and app customization",
      "Free technical support"
    ],
    badgeText: "Official WhatsApp support - ₹6,000",
    buttonText: "Contact on WhatsApp",
    whatsappMessage: "Hello, I want to inquire about the Annual Renewal Plan (₹10,000) for Parivar.me"
  }
];

export default function PricingSection() {
  const [plans, setPlans] = useState<any[]>(DEFAULT_PLANS);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});
  const [activePlanType, setActivePlanType] = useState<'new' | 'renewal'>('new');
  const { t, language } = useLanguage();
  
  const whatsappNumber = "918866779008"; 

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axiosInstance.get(ENDPOINTS.PRICING);
        if (res.status === 200 && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const fetchedPlans = res.data.data;
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
        // Fallback to default pricing plans quietly
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

  const activePlan = plans.find(p => activePlanType === 'new' ? isNewDealPlan(p) : isRenewalPlan(p)) || plans[0];
  const otherPlan = plans.find(p => activePlanType === 'new' ? isRenewalPlan(p) : isNewDealPlan(p)) || plans.find(p => p._id !== activePlan?._id);
  const hasMultiplePlans = !!otherPlan;

  if (!activePlan) return null;

  const planId = activePlan._id || `plan-active`;
  const isNewPlan = isNewDealPlan(activePlan);

  const defaultMsg = `Hello, I want to book a free demo of Parivar for the "${activePlan.title}" package.`;
  const waMsg = activePlan.whatsappMessage || defaultMsg;
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMsg)}`;

  const FIXED_FEATURES_TRANSLATIONS: Record<string, string[]> = {
    en: [
      "Your own Community App",
      "Your App on Play Store and App Store",
      "Your Free Domain",
      "Free Server",
      "Members and Family Data Management",
      "Events, News, Business, Jobs, etc.",
      "Notifications and Updates",
      "Secure Data Backup",
      "Free SMS"
    ],
    gu: [
      "તમારી પોતાની Community App",
      "Play Store અને App Store પર તમારી App",
      "તમારું Free Domain",
      "Free Server",
      "Members અને પરિવારની માહિતી મેનેજમેન્ટ",
      "Events, News, Business, Jobs વગેરે",
      "Notifications અને Updates",
      "સુરક્ષિત Data Backup",
      "Free SMS"
    ],
    hi: [
      "आपका अपना कम्युनिटी ऐप",
      "प्ले स्टोर और ऐप स्टोर पर आपका ऐप",
      "आपका फ्री डोमेन",
      "फ्री सर्वर",
      "सदस्य और परिवार डेटा प्रबंधन",
      "इवेंट्स, समाचार, बिजनेस, जॉब्स आदि",
      "सूचनाएं और अपडेट",
      "सुरक्षित डेटा बैकअप",
      "फ्री एसएमएस"
    ]
  };

  const currentFeatures = FIXED_FEATURES_TRANSLATIONS[language] || FIXED_FEATURES_TRANSLATIONS["en"];

  return (
    <section id="pricing" className="relative overflow-hidden bg-[#fafcff] py-12 md:py-16 border-t border-slate-100">
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

        {/* Pricing Card */}
        <div className="max-w-4xl mx-auto relative">
          <div
            id={planId}
            className={`bg-white/90 backdrop-blur-md border-2 ${isNewPlan ? 'border-emerald-200 shadow-[0_8px_30px_-4px_rgba(16,185,129,0.15)]' : 'border-blue-200 shadow-[0_8px_30px_-4px_rgba(59,130,246,0.15)]'} rounded-3xl flex flex-col transition-all duration-500 relative group overflow-hidden`}
          >
            {/* Top highlight bar */}
            <div className={`absolute top-0 inset-x-0 h-1.5 ${isNewPlan ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} z-20`} />
            
            {/* Card Main Content */}
            <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 relative z-10">
              
              {/* Left Side: Pricing & Details */}
              <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 md:space-y-8">
                {/* Badges / Header */}
                <div className="text-center md:text-left space-y-2.5">
                  <span className={`inline-flex items-center gap-1.5 ${isNewPlan ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'} border text-[11px] md:text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider`}>
                    {isNewPlan ? '👑' : '⭐'} {translateText(activePlan.subtitle || (isNewPlan ? "new plan" : "renewal plan"), language)}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-[#0B1340]">
                    {translateText(activePlan.title, language)}
                  </h3>
                </div>

                {/* Pricing Display */}
                <div className={`text-center md:text-left space-y-2 py-6 px-6 rounded-3xl border-2 ${isNewPlan ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-300 shadow-md shadow-emerald-100/50' : 'bg-gradient-to-br from-blue-50 to-white border-blue-300 shadow-md shadow-blue-100/50'} relative overflow-hidden`}>
                  {/* Subtle shine effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/0 via-white/50 to-white/0 transform -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <div className="flex items-center justify-center md:justify-start gap-4 relative z-10">
                    <span className="text-slate-400 text-lg md:text-xl line-through font-extrabold">
                      ₹{activePlan.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className={`text-4xl md:text-5xl font-black ${isNewPlan ? 'text-emerald-700' : 'text-blue-700'} tracking-tight`}>
                      ₹{activePlan.discountedPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {activePlan.description && (
                    <p className="text-slate-600 text-xs md:text-sm font-semibold">
                      {translateText(activePlan.description, language)}
                    </p>
                  )}
                </div>

                {/* Additional Official WhatsApp support & CTA Button */}
                <div className="space-y-4">
                  <div className={`rounded-xl p-3 border text-center text-xs font-bold flex items-center justify-center gap-2 ${isNewPlan ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-blue-50/80 border-blue-200 text-blue-900'}`}>
                    <span>🎧</span>
                    <span>{translateText(activePlan.badgeText || "official whatsapp support - ₹6,000", language)}</span>
                  </div>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2.5 ${isNewPlan ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'} text-white font-bold text-base py-3.5 rounded-full shadow-lg hover:shadow-xl active:scale-98 transition-all duration-300 text-center`}
                  >
                    <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                    <span>{translateText(activePlan.buttonText || "contact on whatsapp", language)}</span>
                  </a>

                  <p className="text-center md:text-left text-xs text-slate-500 font-medium">
                    {t("pricing.expertNote")}
                  </p>
                </div>
              </div>

              {/* Divider for Desktop */}
              <div className="hidden md:block w-px bg-slate-200 self-stretch my-4"></div>
              {/* Divider for Mobile */}
              <div className="block md:hidden h-px bg-slate-200 w-full my-2"></div>

              {/* Right Side: Features */}
              <div className="w-full md:w-1/2 flex flex-col justify-start space-y-4 pt-2 md:pt-0">
                <h4 className="text-lg font-bold text-slate-800 mb-2">
                  {language === "gu" ? "પેકેજમાં શું શામેલ છે?" : language === "hi" ? "पैकेज में क्या शामिल है?" : "What's included in the package?"}
                </h4>
                <div className="space-y-3.5 flex-grow">
                  {currentFeatures.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 transition-all duration-200">
                      <CheckCircle2 className={`w-5 h-5 ${isNewPlan ? 'text-emerald-600' : 'text-blue-600'} shrink-0 mt-0.5`} />
                      <span className="text-slate-700 text-sm font-semibold">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
            
            {/* Bottom Toggle Area */}
            {hasMultiplePlans && otherPlan && (
              <button
                onClick={() => setActivePlanType(activePlanType === 'new' ? 'renewal' : 'new')}
                className={`w-full text-left flex items-center justify-between p-5 md:px-10 md:py-6 border-t cursor-pointer transition-all duration-300 group ${
                  activePlanType === 'new' 
                    ? 'bg-blue-50/60 hover:bg-blue-100/60 border-blue-100' 
                    : 'bg-emerald-50/60 hover:bg-emerald-100/60 border-emerald-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${activePlanType === 'new' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {activePlanType === 'new' ? '⭐' : '👑'}
                  </div>
                  <div>
                    <h5 className={`font-bold text-sm md:text-base ${activePlanType === 'new' ? 'text-blue-900' : 'text-emerald-900'}`}>
                      {translateText(otherPlan.title, language)} જુઓ
                    </h5>
                    <p className={`text-xs md:text-sm font-semibold mt-0.5 ${activePlanType === 'new' ? 'text-blue-600/80' : 'text-emerald-600/80'}`}>
                      માત્ર ₹{otherPlan.discountedPrice.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 ${activePlanType === 'new' ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-emerald-600 text-white shadow-emerald-600/30'} shadow-md`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </div>
              </button>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}

