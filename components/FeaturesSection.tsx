import React from "react";
import {
  UserPlus,
  CalendarCheck,
  Image as ImageIcon,
  HeartPulse,
  Briefcase,
  Newspaper,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: UserPlus,
    title: "Member Registration",
    description:
      "Easy Online Registration For All Paneliya Family Members. Maintain A Complete Digital Directory With Profiles And Contact Info.",
  },
  {
    icon: CalendarCheck,
    title: "Event Management",
    description:
      "Organize And Manage Community Events, Milap, Festivals, And Gatherings. RSVP Tracking And Announcements All In One Place.",
  },
  {
    icon: ImageIcon,
    title: "Photo Gallery",
    description:
      "Share And Preserve Precious Family Memories. Upload Photos From Events And Celebrations For The Entire Community To Cherish.",
  },
  {
    icon: HeartPulse,
    title: "Blood Donor Network",
    description:
      "Connect With Blood Donors Within The Community In Emergencies. A Life-Saving Network With Up-To-Date Donor Details.",
  },
  {
    icon: Briefcase,
    title: "Business Directory",
    description:
      "Discover And Support Businesses Run By Paneliya Community Members. A Trusted Directory For Local Services And Professionals.",
  },
  {
    icon: Newspaper,
    title: "News & Updates",
    description:
      "Stay Informed With The Latest Community News, Announcements, And Important Updates Delivered Directly To Members.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-[#F4F7FF] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16 space-y-2">
          <div className="text-[#3B82F6] font-bold text-xs sm:text-sm tracking-wide">
            — Our Feature —
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1340] tracking-tight">
            What{" "}
            <span className="relative inline-block text-[#3B82F6]">
              We
              <span className="absolute left-0 right-0 -bottom-1.5 h-1 bg-[#3B82F6] rounded-full"></span>
            </span>{" "}
            Offer
          </h2>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white p-7 rounded-xl border-t-4 border-t-[#0B1340] border-x border-b border-slate-200/80 shadow-xs hover:shadow-xl hover:border-b-blue-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Icon Box */}
                  <div className="w-11 h-11 rounded-lg bg-[#0B1340] text-white flex items-center justify-center shadow-xs group-hover:bg-[#3B82F6] transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-[#0B1340] tracking-tight">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>

                {/* Read More Link */}
                <div className="pt-5 mt-4">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1340] group-hover:text-[#3B82F6] transition-colors"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
