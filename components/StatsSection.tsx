"use client";
import React from "react";
import { Building2, Users, Calendar, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function StatsSection() {
  const { t, language } = useLanguage();

  const getStats = () => {
    let labels = ["Communities", "Members", "Events Hosted", "Memories Shared"];
    if (language === 'gu') {
      labels = ["સમાજ", "સક્રિય સભ્યો", "ઇવેન્ટ્સ", "શેર કરેલી યાદો"];
    } else if (language === 'hi') {
      labels = ["समुदाय", "सक्रिय सदस्य", "आयोजित कार्यक्रम", "साझा की गई यादें"];
    }

    return [
      {
        icon: Building2,
        value: "200+",
        label: labels[0],
      },
      {
        icon: Users,
        value: "20K+",
        label: labels[1],
      },
      {
        icon: Calendar,
        value: "12K+",
        label: labels[2],
      },
      {
        icon: ImageIcon,
        value: "100K+",
        label: labels[3],
      },
    ];
  };

  const stats = getStats();

  return (
    <section className="relative z-20 -mt-8 sm:-mt-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl shadow-blue-900/5 p-6 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 relative overflow-hidden">
          {/* Subtle bg glow inside the card */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-indigo-50/50 pointer-events-none" />

          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="relative flex flex-col items-center justify-center text-center px-4 group"
              >
                {/* Vertical Divider for all but last item (Desktop) */}
                {index < 3 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
                )}
                
                <div className="mb-4 p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0B1340] to-blue-700 tracking-tighter mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
