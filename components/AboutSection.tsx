"use client";
import React from "react";
import { Users, Target, Shield, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-slate-50 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-50" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-bold text-blue-600 tracking-wider uppercase">
            {t("about.title")}
          </h2>
          <h3 className="text-3xl md:text-4xl font-black text-[#0B1340]">
            {t("about.subtitle")}
          </h3>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text Content */}
          <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
            <p>
              {t("about.p1")}
            </p>
            <p>
              {t("about.p2")}
            </p>
            <p>
              {t("about.p3")}
            </p>
          </div>

          {/* Right: Mission Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 transform rotate-3 rounded-3xl opacity-10" />
            <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-xl relative z-10">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-4">
                {t("about.goalTitle")}
              </h4>
              <p className="text-slate-600 text-lg">
                {t("about.goalDesc")}
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
