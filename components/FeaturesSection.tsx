"use client";
import React, { useState } from "react";
import {
  UserPlus,
  CalendarCheck,
  Image as ImageIcon,
  HeartPulse,
  Briefcase,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Bell,
  Wallet,
  ShieldCheck,
  RefreshCw,
  Headphones,
  Lock,
  BarChart3
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function FeaturesSection() {
  const [currentMockupIndex, setCurrentMockupIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t } = useLanguage();

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentMockupIndex((prev) => (prev + 1 >= mockups.length ? 0 : prev + 1));
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentMockupIndex((prev) => (prev - 1 < 0 ? mockups.length - 1 : prev - 1));
      setIsTransitioning(false);
    }, 300);
  };

  const getFeatures = () => [
    { icon: LayoutDashboard, title: t("features.f1.title"), description: t("features.f1.desc") },
    { icon: UserPlus, title: t("features.f2.title"), description: t("features.f2.desc") },
    { icon: Briefcase, title: t("features.f3.title"), description: t("features.f3.desc") },
    { icon: Bell, title: t("features.f4.title"), description: t("features.f4.desc") },
    { icon: Wallet, title: t("features.f5.title"), description: t("features.f5.desc") },
    { icon: CalendarCheck, title: t("features.f6.title"), description: t("features.f6.desc") },
    { icon: BarChart3, title: t("features.f7.title"), description: t("features.f7.desc") },
    { icon: ShieldCheck, title: t("features.f8.title"), description: t("features.f8.desc") },
    { icon: Lock, title: t("features.f9.title"), description: t("features.f9.desc") },
    { icon: UserPlus, title: t("features.f10.title"), description: t("features.f10.desc") },
    { icon: RefreshCw, title: t("features.f11.title"), description: t("features.f11.desc") },
    { icon: Headphones, title: t("features.f12.title"), description: t("features.f12.desc") },
  ];
  
  const features = getFeatures();

  // Using the images already present in Parivar project as mockups
  const mockups = [
    "/members.png",
    "/events.png",
    "/photos.png",
    "/bussiness.png",
    "/news.png"
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-[#f8fafc] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1340] tracking-tight">
            {t("features.title")}
          </h2>
        </div>

        {/* 4x3 Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 flex flex-col items-center text-center space-y-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-800 mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mockups Carousel Section */}
        <div className="relative bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200/60 shadow-xl shadow-slate-200/40 max-w-5xl mx-auto">
          
          <div className="flex items-center justify-center">
            
            {/* Single Large Mockup */}
            <div className={`w-full flex justify-center transition-all duration-300 transform ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
              <img 
                src={mockups[currentMockupIndex]} 
                alt={`App Screenshot ${currentMockupIndex + 1}`} 
                className="max-h-[600px] w-auto object-contain drop-shadow-2xl rounded-2xl border-[6px] border-slate-50"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            
          </div>

          {/* Carousel Controls */}
          <button 
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-110 transition-all z-20 border-4 border-white cursor-pointer"
            aria-label="Previous screenshot"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-110 transition-all z-20 border-4 border-white cursor-pointer"
            aria-label="Next screenshot"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

        </div>

      </div>
    </section>
  );
}
