"use client";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { X, Check } from "lucide-react";

export default function ComparisonSection() {
  const { t } = useLanguage();

  const badPoints = [
    t("comparison.bad1"),
    t("comparison.bad2"),
    t("comparison.bad3"),
    t("comparison.bad4"),
  ];

  const goodPoints = [
    t("comparison.good1"),
    t("comparison.good2"),
    t("comparison.good3"),
    t("comparison.good4"),
  ];

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
              {t("comparison.without")}
            </h3>
            <div className="bg-red-50/80 rounded-3xl rounded-br-none p-6 md:p-8 w-full max-w-sm mb-4 border border-red-100 shadow-sm relative">
              <ul className="space-y-3">
                {badPoints.map((point, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-red-900 font-bold text-base md:text-lg">
                    <X className="w-5 h-5 text-red-500 shrink-0" strokeWidth={3} />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="absolute -bottom-4 right-8 w-8 h-8 bg-red-50/80 border-b border-r border-red-100 transform rotate-45" />
            </div>
            <div className="relative w-full max-w-sm mt-6">
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
              {t("comparison.with")}
            </h3>
            <div className="bg-green-50/80 rounded-3xl rounded-bl-none p-6 md:p-8 w-full max-w-sm mb-4 border border-green-100 shadow-sm relative">
              <ul className="space-y-3">
                {goodPoints.map((point, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-green-900 font-bold text-base md:text-lg">
                    <Check className="w-5 h-5 text-green-600 shrink-0" strokeWidth={3} />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="absolute -bottom-4 left-8 w-8 h-8 bg-green-50/80 border-b border-r border-green-100 transform rotate-45" />
            </div>
            <div className="relative w-full max-w-sm mt-6">
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
