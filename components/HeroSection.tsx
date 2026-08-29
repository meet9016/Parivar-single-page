"use client";
import React from "react";
import { MessageCircle, Sparkles, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  const whatsappNumber = "918866779008"; 
  const whatsappMsg = "Hello, I have visited your website and am interested in a demo of Parivar. Please share the details. Thank you!";

  return (
    <section id="home" className="relative overflow-hidden bg-[#fafcff] pt-32 pb-20 lg:pt-40 lg:pb-28 min-h-[90vh] flex flex-col items-center justify-center">
      
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] animate-pulse duration-[7000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-[100px] animate-pulse duration-[5000ms]" />
      </div>
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 md:px-8 z-10 flex flex-col items-center text-center space-y-10">
        
        {/* Top Pill Badge */}
        <div className="inline-flex items-center px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-blue-100 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.15)] group hover:scale-105 transition-transform duration-300">
          <span className="relative flex h-2.5 w-2.5 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
          </span>
          <span className="text-xs sm:text-sm font-bold text-blue-900 tracking-wide">
            {t("hero.pill")}
          </span>
        </div>

        {/* Central Logo Box (Glassmorphism) */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
          <div className="relative bg-white/90 backdrop-blur-xl px-8 py-4 rounded-3xl shadow-xl border border-white flex items-center justify-center gap-4 transform group-hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center shadow-inner border border-blue-100/50">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 tracking-tight">
              Parivar.me
            </span>
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-6 max-w-4xl relative">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tighter">
            {t("hero.title1")} <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative inline-block pb-2">
              {t("hero.title2")}
              <Sparkles className="absolute -top-6 -right-8 w-8 h-8 text-yellow-400 animate-bounce" />
            </span>
          </h1>
          
          <p className="text-slate-600 text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
            {t("hero.subtitle")}
          </p>

          <p className="inline-block bg-orange-50 text-orange-600 px-4 py-1.5 rounded-lg text-sm sm:text-base font-bold tracking-wide border border-orange-100/50">
            {t("hero.worksFor")}
          </p>
        </div>

        {/* WhatsApp CTA Button */}
        <div className="pt-8">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-base sm:text-lg px-10 py-5 rounded-full overflow-hidden shadow-[0_8px_30px_rgba(34,197,94,0.3)] hover:shadow-[0_8px_40px_rgba(34,197,94,0.5)] hover:-translate-y-1 transition-all duration-300"
          >
            {/* Hover sheen effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            
            <MessageCircle className="w-6 h-6 fill-current relative z-10" />
            <span className="relative z-10">{t("hero.cta")}</span>
          </a>
        </div>
        
      </div>
    </section>
  );
}
