"use client";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { X, Check } from "lucide-react";

const comparisonTranslations: Record<string, { without: string; with: string; bad: string[]; good: string[] }> = {
  en: {
    without: "Without Parivar.me",
    with: "With Parivar.me",
    bad: [
      "No unified family member list",
      "Missed or delayed snehmilan announcements",
      "Hard to connect with samaj businesses",
      "Manual paperwork and lost record sheets",
      "Delayed news and community updates",
      "Lost community history and heritage details"
    ],
    good: [
      "Active family member registry",
      "Instant snehmilan and event updates",
      "Connect with all samaj businesses",
      "Smart automated cloud registries",
      "Instant push notifications and news",
      "Preserved digital heritage and history"
    ]
  },
  gu: {
    without: "Parivar.me વિના",
    with: "Parivar.me સાથે",
    bad: [
      "પરિવારના સભ્યોની એકીકૃત યાદીનો અભાવ",
      "સ્નેહમિલન અને તહેવારોની વિલંબિત માહિતી",
      "સમાજના વ્યવસાયો સાથે જોડાણ કરવામાં મુશ્કેલી",
      "મેન્યુઅલ કાગળકામ અને ખોવાઈ જતી ફાઈલો",
      "વિલંબિત સમાચાર અને જાહેરાતો",
      "ખોવાયેલો સમાજ ઇતિહાસ અને સંસ્કૃતિ વારસો"
    ],
    good: [
      "પરિવારના બધા સભ્યોની એકીકૃત ડિજિટલ યાદી",
      "સ્નેહમિલન, તહેવાર અને ઇવેન્ટ્સની ત્વરિત માહિતી",
      "સમાજના તમામ વ્યવસાયો સાથે સીધું જોડાણ",
      "સ્માર્ટ ઓટોમેશન અને સિક્યોર ડિજિટલ રેકોર્ડ",
      "ઇન્સ્ટન્ટ નોટિફિકેશન અને લેટેસ્ટ સમાચાર",
      "સુરક્ષિત ડિજિટલ વારસો અને સમાજનો ઇતિહાસ"
    ]
  },
  hi: {
    without: "Parivar.me के बिना",
    with: "Parivar.me के साथ",
    bad: [
      "परिवार के सदस्यों की एकीकृत सूची का अभाव",
      "स्नेहमिलन और त्योहारों की देरी से मिलने वाली जानकारी",
      "समाज के व्यवसायों से जुड़ने में कठिनाई",
      "कागजी कार्रवाई और खोने वाली फाइलें",
      "देरी से मिलने वाले समाचार और घोषणाएं",
      "खोया हुआ सामाजिक इतिहास और विरासत"
    ],
    good: [
      "family के सभी सदस्यों की एकीकृत डिजिटल सूची",
      "स्नेहमिलन, त्योहार और इवेंट्स की तुरंत मिलने वाली जानकारी",
      "समाज के सभी व्यवसायों के साथ सीधा कनेक्शन",
      "स्मार्ट ऑटोमेशन और सुरक्षित डिजिटल रिकॉर्ड",
      "तुरंत नोटिफिकेशन और नवीनतम समाचार",
      "सुरक्षित डिजिटल विरासत और समाज का इतिहास"
    ]
  }
};

export default function ComparisonSection() {
  const { language } = useLanguage();
  const localTexts = comparisonTranslations[language] || comparisonTranslations["en"];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-12 md:gap-0 relative">
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-slate-200" />
          <div className="hidden md:flex absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-green-600 rounded-full text-white font-black text-2xl items-center justify-center border-[8px] border-white shadow-lg z-20">
            VS
          </div>
          <div className="flex-1 flex flex-col items-center pb-12 md:pb-0 md:pr-12">
            <h3 className="text-3xl font-black text-slate-800 mb-6 text-center">
              {localTexts.without}
            </h3>
            <div className="bg-red-50/80 rounded-3xl rounded-br-none p-6 md:p-8 w-full max-w-lg mb-4 border border-red-100 shadow-sm relative">
              <ul className="space-y-3">
                {localTexts.bad.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-red-900 font-bold text-base md:text-lg">
                    <X className="w-5 h-5 text-red-500 shrink-0 mt-1" strokeWidth={3} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="absolute -bottom-4 right-8 w-8 h-8 bg-red-50/80 border-b border-r border-red-100 transform rotate-45" />
            </div>
            <div className="relative w-full max-w-lg mt-6">
              <img
                src="/befor.png"
                alt="Stressed Admin"
                className="w-full h-auto object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center pt-12 md:pt-0 md:pl-12">
            <h3 className="text-3xl font-black text-green-600 mb-6 text-center">
              {localTexts.with}
            </h3>
            <div className="bg-green-50/80 rounded-3xl rounded-bl-none p-6 md:p-8 w-full max-w-lg mb-4 border border-green-100 shadow-sm relative">
              <ul className="space-y-3">
                {localTexts.good.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-green-900 font-bold text-base md:text-lg">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-1" strokeWidth={3} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="absolute -bottom-4 left-8 w-8 h-8 bg-green-50/80 border-b border-r border-green-100 transform rotate-45" />
            </div>
            <div className="relative w-full max-w-lg mt-6">
              <img
                src="/after.png"
                alt="Relaxed Admin"
                className="w-full h-auto object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
