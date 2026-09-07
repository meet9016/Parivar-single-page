"use client";
import React from "react";
import { MessageCircle, Sparkles, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  const whatsappNumber = "918866779008"; 
  const whatsappMsg = "Hello, I have visited your website and am interested in a demo of Parivar. Please share the details. Thank you!";

  return (
    <section id="home" className="relative overflow-hidden bg-[#fafcff] pt-28 pb-16 lg:pt-36 lg:pb-24 min-h-[92vh] flex items-center justify-center">
      
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] animate-pulse duration-[7000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-[100px] animate-pulse duration-[5000ms]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-7">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-blue-200/80 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.18)] group hover:scale-105 transition-transform duration-300">
              <span className="relative flex h-3 w-3 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-blue-950 tracking-wide">
                {t("hero.pill")}
              </span>
            </div>

            {/* Headlines */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 leading-[1.12] tracking-tight">
                {t("hero.title1")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative inline-block">
                  {t("hero.title2")}
                  <Sparkles className="absolute -top-5 -right-7 w-7 h-7 text-yellow-400 animate-bounce" />
                </span>
              </h1>
              
              <p className="text-slate-600 text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed max-w-xl">
                {t("hero.subtitle")}
              </p>
            </div>

            <p className="inline-block bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-sm sm:text-base font-bold tracking-wide border border-orange-100">
              {t("hero.worksFor")}
            </p>

            {/* WhatsApp CTA Button */}
            <div className="pt-2 w-full sm:w-auto">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-base sm:text-xl px-10 py-5 rounded-full overflow-hidden shadow-[0_10px_35px_rgba(34,197,94,0.35)] hover:shadow-[0_12px_45px_rgba(34,197,94,0.5)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
              >
                {/* Hover sheen effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                
                <MessageCircle className="w-6 h-6 fill-current relative z-10" />
                <span className="relative z-10">{t("hero.cta")}</span>
              </a>
            </div>

          </div>

          {/* Right Column: Full Hero Image Banner without black border */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[540px] group">
              {/* Vibrant Ambient Glow behind image */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-blue-600/35 via-indigo-500/30 to-purple-500/35 rounded-[3rem] blur-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              {/* Seamless Full Card Showcase without black border */}
              <div className="relative rounded-[2.5rem] overflow-hidden bg-transparent shadow-[0_25px_70px_-15px_rgba(59,130,246,0.3)] hover:shadow-[0_30px_80px_-10px_rgba(59,130,246,0.4)] transition-all duration-500 hover:-translate-y-2">
                <img
                  src="/parivar_ads.png"
                  alt="Parivar.me App Showcase"
                  className="w-full h-auto object-cover block"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
