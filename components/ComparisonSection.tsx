"use client";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { X, Check, ShieldCheck, Cloud, Headphones, RefreshCw, Lock } from "lucide-react";

const comparisonTranslations: Record<string, {
  title: string;
  subtitle: string;
  without: string;
  with: string;
  badSummary: string;
  goodSummary: string;
  bad: string[];
  good: string[];
  bottomPills: string[];
}> = {
  en: {
    title: "Why Parivar.me?",
    subtitle: "Simple, Easy, Secure, and Modern Solution for Your Community",
    without: "Without Parivar.me",
    with: "With Parivar.me",
    badSummary: "😡 More time wasted, incomplete info, and growing misunderstandings.",
    goodSummary: "😊 Everything in one place, save time and make your community stronger.",
    bad: [
      "No unified family member list",
      "Scattered snehmilan and festival details",
      "Hard to find samaj business, job, and info",
      "Wasted time sending messages & announcements",
      "Scattered news and advertisements",
      "Misunderstandings due to incorrect or late info"
    ],
    good: [
      "Unified & updated details for all family members",
      "Complete info on snehmilan, festivals & events",
      "Easily find samaj businesses, jobs & required info",
      "Instant info to everyone with smart notifications",
      "In-app news, advertisements & bulletins",
      "Foundation of safe, reliable & accurate information"
    ],
    bottomPills: [
      "100% Secure",
      "Secure Cloud Data",
      "24x7 Technical Support",
      "Regular Updates",
      "Safe & Reliable"
    ]
  },
  gu: {
    title: "શા માટે Parivar.me?",
    subtitle: "તમારા સમાજ માટે સરળ, સહેજ, સુરક્ષિત અને આધુનિક સોલ્યુશન",
    without: "Parivar.me વિના",
    with: "Parivar.me સાથે",
    badSummary: "😡 સમય વધારે બગડે, માહિતી અધુરી મળે અને ગેરસમજ વધે.",
    goodSummary: "😊 બધું એક જગ્યાએ, સમય બચાવો અને સમાજને વધુ મજબૂત બનાવો.",
    bad: [
      "પરિવારના સભ્યોની એકીકૃત યાદી નથી",
      "સ્નેહમિલન અને તહેવારોની વિગતો વિખેરાયેલી",
      "સમાજના વ્યવસાય, નોકરી અને માહિતી મળવું મુશ્કેલ",
      "મેસેજ, જાહેરાત અને માહિતી મોકલવામાં સમય બગડે",
      "વિખેરાયેલી સમાચાર અને જાહેરાતો",
      "ખોટી માહિતી અથવા સમયસર ન મળવાથી ગેરસમજ"
    ],
    good: [
      "પરિવારના બધા સભ્યોની એકીકૃત અને અપડેટેડ વિગતો",
      "સ્નેહમિલન, તહેવાર અને ઇવેન્ટ્સની સંપૂર્ણ માહિતી",
      "સમાજના વ્યવસાય, નોકરી અને જરૂરી માહિતી સરળતાથી મેળવો",
      "સ્માર્ટ નોટિફિકેશન અને મેસેજથી દરેક સુધી તરત માહિતી",
      "ઇન-એપ ન્યૂઝ, જાહેરાત અને બુલેટિન",
      "સુરક્ષિત, વિશ્વસનીય અને સચોટ માહિતીનો આધાર"
    ],
    bottomPills: [
      "100% સુરક્ષિત",
      "ક્લાઉડ પર સુરક્ષિત ડેટા",
      "24x7 ટેકનિકલ સપોર્ટ",
      "નિયમિત અપડેટ",
      "સુરક્ષિત અને વિશ્વસનીય"
    ]
  },
  hi: {
    title: "क्यों Parivar.me?",
    subtitle: "आपके समाज के लिए सरल, सहज, सुरक्षित और आधुनिक समाधान",
    without: "Parivar.me के बिना",
    with: "Parivar.me के साथ",
    badSummary: "😡 समय ज्यादा बर्बाद होता है, अधूरी जानकारी मिलती है और गलतफहमी बढ़ती है।",
    goodSummary: "😊 सब कुछ एक जगह, समय बचाएं और समाज को और मजबूत बनाएं।",
    bad: [
      "परिवार के सदस्यों की एकीकृत सूची नहीं",
      "स्नेहमिलन और त्योहारों की जानकारी बिखरी हुई",
      "समाज के व्यवसाय, नौकरी और जानकारी मिलना कठिन",
      "मैसेज, विज्ञापन और जानकारी भेजने में समय बर्बाद",
      "बिखरे हुए समाचार और विज्ञापन",
      "गलत जानकारी या समय पर न मिलने से गलतफहमी"
    ],
    good: [
      "परिवार के सभी सदस्यों की एकीकृत और अपडेटेड जानकारी",
      "स्नेहमिलन, त्योहार और इवेंट्स की पूरी जानकारी",
      "समाज के व्यवसाय, नौकरी और जरूरी जानकारी आसानी से पाएं",
      "स्मार्ट नोटिफिकेशन और मैसेज से हर किसी तक तुरंत जानकारी",
      "इन-ऐप न्यूज, विज्ञापन और बुलेटिन",
      "सुरक्षित, विश्वसनीय और सटीक जानकारी का आधार"
    ],
    bottomPills: [
      "100% सुरक्षित",
      "क्लाउड पर सुरक्षित डेटा",
      "24x7 टेक्निकल सपोर्ट",
      "नियमित अपडेट",
      "सुरक्षित और विश्वसनीय"
    ]
  }
};

export default function ComparisonSection() {
  const { language } = useLanguage();
  const localTexts = comparisonTranslations[language] || comparisonTranslations["en"];

  const pillIcons = [
    <ShieldCheck key="1" className="w-4 h-4 text-emerald-600" />,
    <Cloud key="2" className="w-4 h-4 text-blue-500" />,
    <Headphones key="3" className="w-4 h-4 text-indigo-500" />,
    <RefreshCw key="4" className="w-4 h-4 text-cyan-600" />,
    <Lock key="5" className="w-4 h-4 text-slate-700" />
  ];

  return (
    <section className="py-16 md:py-24 bg-[#fafcff] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            {language === 'gu' ? (
              <>શા માટે <span className="text-blue-600">Parivar.me?</span></>
            ) : (
              localTexts.title
            )}
          </h2>
          <p className="text-slate-600 text-base md:text-lg font-medium">
            {localTexts.subtitle}
          </p>
        </div>

        {/* Two Column Comparison */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 relative">
          
          {/* Middle VS Badge */}
          <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-emerald-600 text-white font-black text-lg items-center justify-center rounded-full border-4 border-white shadow-xl z-20">
            VS
          </div>

          {/* Left Side Card: Without Parivar.me */}
          <div className="flex-1 bg-white border border-rose-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between relative">
            <div className="space-y-6">
              <div className="inline-block bg-rose-50 border border-rose-200/80 text-rose-700 font-bold text-sm px-4 py-1.5 rounded-full">
                {localTexts.without}
              </div>

              <ul className="space-y-3.5">
                {localTexts.bad.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700 font-semibold text-sm md:text-base">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">✕</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Illustration & Bottom Red Summary Note */}
            <div className="mt-8 pt-6 border-t border-rose-50 space-y-4">
              <div className="relative w-full h-44 bg-rose-50/50 rounded-2xl border border-rose-100/60 overflow-hidden flex items-center justify-center">
                <img
                  src="/befor.png"
                  alt="Stressed Admin"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>

              <div className="bg-rose-50/90 border border-rose-200 text-rose-900 font-bold text-xs md:text-sm p-3.5 rounded-2xl text-center shadow-2xs">
                {localTexts.badSummary}
              </div>
            </div>
          </div>

          {/* Right Side Card: With Parivar.me */}
          <div className="flex-1 bg-white border-2 border-emerald-200 rounded-3xl p-6 md:p-8 shadow-md flex flex-col justify-between relative">
            <div className="space-y-6">
              <div className="inline-block bg-emerald-50 border border-emerald-300 text-emerald-800 font-extrabold text-sm px-4 py-1.5 rounded-full">
                {localTexts.with}
              </div>

              <ul className="space-y-3.5">
                {localTexts.good.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-800 font-bold text-sm md:text-base">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Illustration & Bottom Green Summary Note */}
            <div className="mt-8 pt-6 border-t border-emerald-50 space-y-4">
              <div className="relative w-full h-44 bg-emerald-50/50 rounded-2xl border border-emerald-100/60 overflow-hidden flex items-center justify-center">
                <img
                  src="/after.png"
                  alt="Relaxed Admin"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>

              <div className="bg-emerald-50/90 border border-emerald-200 text-emerald-950 font-extrabold text-xs md:text-sm p-3.5 rounded-2xl text-center shadow-2xs">
                {localTexts.goodSummary}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Feature Pills Bar */}
        <div className="mt-12 pt-6 flex flex-wrap items-center justify-center gap-3 md:gap-5">
          {localTexts.bottomPills.map((pillText, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200/80 shadow-2xs rounded-full px-4 py-2 text-xs md:text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              {pillIcons[index] || <ShieldCheck className="w-4 h-4 text-emerald-600" />}
              <span>{pillText}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
