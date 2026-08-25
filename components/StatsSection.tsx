import React from "react";
import { Building2, Users, Calendar, Image as ImageIcon } from "lucide-react";

const stats = [
  {
    icon: Building2,
    value: "500+",
    label: "Communities",
  },
  {
    icon: Users,
    value: "50K+",
    label: "Members",
  },
  {
    icon: Calendar,
    value: "12K+",
    label: "Events Hosted",
  },
  {
    icon: ImageIcon,
    value: "1M+",
    label: "Memories Shared",
  },
];

export default function StatsSection() {
  return (
    <section className="bg-[#0B1340] text-white py-12 px-4 md:px-8 shadow-inner border-y border-slate-800 relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center text-center pt-6 md:pt-0 px-4 group"
              >
                <div className="mb-3 p-3 rounded-xl bg-blue-900/40 border border-blue-700/40 text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-300">
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
