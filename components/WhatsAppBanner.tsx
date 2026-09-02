"use client";
import React from "react";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function WhatsAppBanner() {
  const { t } = useLanguage();
  const whatsappNumber = "918866779008"; 
  const whatsappMsg = "Hello, I want to book a free demo of Parivar. Please share details.";

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden bg-[#eef2ff] border border-indigo-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_#4f46e5_1px,_transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          
          <div className="relative z-10 text-center md:text-left space-y-2 flex-1">
            <h2 className="text-2xl md:text-3xl font-black text-[#0B1340] tracking-tight">
              {t("banner.title")}
            </h2>
            <p className="text-slate-600 text-sm md:text-base font-medium max-w-xl">
              {t("banner.subtitle")}
            </p>
          </div>
          
          <div className="relative z-10 flex-shrink-0">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm md:text-base px-8 py-3.5 rounded-full shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_25px_rgba(34,197,94,0.5)] hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t("banner.cta")}</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
