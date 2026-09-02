"use client";

import React from "react";
import { ShieldCheck, Users, Rocket, Globe, CheckCircle2, Headphones, Award, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const companyTexts: Record<string, any> = {
  gu: {
    tag: "અમારી કંપની વિશે",
    logoTagline: "Crafting Digital Excellence Since 2014",
    line1: "તમારા વિચારોને ડિજિટલ",
    line2: "સફળતામાં બદલવાનું અમારું ધ્યેય છે",
    desc: "Parivar.me એ DigiTalks દ્વારા વિકસાવાયેલ એક આધુનિક અને વિશ્વસનીય SaaS પ્રોડક્ટ છે. ટેકનોલોજી, ડિઝાઇન અને કસ્ટમ સોલ્યુશન સાથે અમે હજારો સમાજ-સંસ્થાઓને ડિજિટલ બનાવવા સહાય કરીએ છીએ.",
    f1: "100% સુરક્ષિત અને વિશ્વસનીય",
    f2: "ક્લાયન્ટ-સેન્ટ્રિક અભિગમ",
    f3: "આધુનિક ટેકનોલોજી",
    f4: "વિશ્વસ્તરીય સેવા",
    heartNote: "ટેકનોલોજી સાથે સમાજની સેવા એ જ અમારો ઉત્સાહ છે!",
    s1Value: "1500+",
    s1Label: "ખુશ ગ્રાહકો",
    s2Value: "1000+",
    s2Label: "સફળ પ્રોજેક્ટ્સ",
    s3Value: "24x7",
    s3Label: "ટેકનિકલ સપોર્ટ",
    s4Value: "10+",
    s4Label: "વર્ષનો અનુભવ"
  },
  en: {
    tag: "About Our Company",
    logoTagline: "Crafting Digital Excellence Since 2014",
    line1: "Transforming Your Ideas into",
    line2: "Digital Success is Our Goal",
    desc: "Parivar.me is a modern and reliable SaaS product developed by DigiTalks. With technology, design, and custom solutions, we help thousands of community organizations go digital.",
    f1: "100% Secure & Reliable",
    f2: "Client-Centric Approach",
    f3: "Modern Technology",
    f4: "World-Class Service",
    heartNote: "Serving society with technology is our true passion!",
    s1Value: "1500+",
    s1Label: "Happy Clients",
    s2Value: "1000+",
    s2Label: "Projects Completed",
    s3Value: "24x7",
    s3Label: "Support Available",
    s4Value: "10+",
    s4Label: "Years Experience"
  },
  hi: {
    tag: "हमारी कंपनी के बारे में",
    logoTagline: "Crafting Digital Excellence Since 2014",
    line1: "आपके विचारों को डिजिटल",
    line2: "सफलता में बदलना हमारा लक्ष्य है",
    desc: "Parivar.me DigiTalks द्वारा विकसित एक आधुनिक और विश्वसनीय SaaS उत्पाद है। तकनीक, डिजाइन और कस्टम समाधानों के साथ हम हजारों समाज-संस्थाओं को डिजिटल बनने में सहायता करते हैं।",
    f1: "100% सुरक्षित और विश्वसनीय",
    f2: "क्लाइंट-सेंट्रिक दृष्टिकोण",
    f3: "आधुनिक तकनीक",
    f4: "विश्वस्तरीय सेवा",
    heartNote: "तकनीक के साथ समाज की सेवा ही हमारा उत्साह है!",
    s1Value: "1500+",
    s1Label: "प्रसन्न ग्राहक",
    s2Value: "1000+",
    s2Label: "सफल प्रोजेक्ट्स",
    s3Value: "24x7",
    s3Label: "तकनीकी सपोर्ट",
    s4Value: "10+",
    s4Label: "वर्षों का अनुभव"
  }
};

export default function CompanySection() {
  const { language } = useLanguage();
  const t = companyTexts[language] || companyTexts["gu"];

  return (
    <section className="py-12 md:py-16 bg-[#f2f6ff] relative overflow-hidden font-sans">
      
      {/* Background soft blue ambient lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 space-y-12">
        
        {/* Main Grid: Left Details + Right Team Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Top Company Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dbe8ff] border border-blue-200/80 text-blue-900 text-xs font-extrabold shadow-2xs">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0">
                🏢
              </span>
              <span>{t.tag}</span>
            </div>

            {/* Logo & Tagline */}
            <div className="space-y-1">
              <div className="flex items-center gap-0.5 text-3xl sm:text-4xl md:text-4.5xl font-black tracking-tight">
                <span className="text-[#00A3FF]">DIGI</span>
                <span className="text-[#E000FF]">TALKS</span>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold tracking-wide">
                {t.logoTagline}
              </p>
            </div>

            {/* Title with Blue Curve Underline */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl md:text-3.5xl font-black text-slate-900 leading-snug tracking-tight">
                {t.line1}
              </h2>
              <h2 className="text-2xl sm:text-3xl md:text-3.5xl font-black text-slate-900 leading-snug tracking-tight relative inline-block">
                <span>{t.line2}</span>
                {/* SVG Curve underline */}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-600" viewBox="0 0 260 12" fill="none" preserveAspectRatio="none">
                  <path d="M2 9C70 2 190 2 258 9" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
                </svg>
              </h2>
            </div>

            {/* Subtitle Description */}
            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed pt-1">
              {t.desc}
            </p>

            {/* 4 Feature Pills Grid (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3">
              <div className="bg-[#e8f0fe] border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs hover:bg-[#deeafe] transition-colors">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <span>{t.f1}</span>
              </div>

              <div className="bg-[#e8f0fe] border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs hover:bg-[#deeafe] transition-colors">
                <Users className="w-5 h-5 text-blue-600 shrink-0" />
                <span>{t.f2}</span>
              </div>

              <div className="bg-[#e8f0fe] border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs hover:bg-[#deeafe] transition-colors">
                <Rocket className="w-5 h-5 text-blue-600 shrink-0" />
                <span>{t.f3}</span>
              </div>

              <div className="bg-[#e8f0fe] border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs hover:bg-[#deeafe] transition-colors">
                <Globe className="w-5 h-5 text-blue-600 shrink-0" />
                <span>{t.f4}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Team Photo & Floating Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <img
                src="/team.jpg"
                alt="DigiTalks Team"
                className="w-full h-auto object-cover max-h-[440px] rounded-2xl"
              />
            </div>

            {/* Overlay Heart Note Badge */}
            <div className="absolute -bottom-6 right-2 sm:right-2 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-slate-100 flex items-center gap-3.5 max-w-[320px] sm:max-w-xs z-20">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200/80 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                {t.heartNote}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Stats Container (Light Blue Box with White Stat Cards) */}
        <div className="bg-[#e2edff] border border-blue-200/60 rounded-3xl p-4 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Stat 1 */}
            <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
                  {t.s1Value}
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-600">
                  {t.s1Label}
                </div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
                  {t.s2Value}
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-600">
                  {t.s2Label}
                </div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
                  {t.s3Value}
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-600">
                  {t.s3Label}
                </div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
                  {t.s4Value}
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-600">
                  {t.s4Label}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
