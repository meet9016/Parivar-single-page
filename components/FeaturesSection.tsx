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
    <section id="features" className="py-20 md:py-32 bg-[#fafcff] relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 font-bold text-xs tracking-widest uppercase shadow-sm">
            <span>Our Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B1340] tracking-tighter leading-tight">
            Everything you need to <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              run your community
            </span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            // Create a slight bento box variation based on index
            const isLarge = index === 0 || index === 3;
            
            return (
              <div
                key={index}
                className={`group relative bg-white p-8 rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/20 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 overflow-hidden flex flex-col justify-between ${
                  isLarge ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-blue-50/0 group-hover:from-blue-50/50 transition-colors duration-500 pointer-events-none" />
                
                <div className="relative z-10 space-y-6">
                  {/* Icon Box */}
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-3">
                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-[#0B1340] tracking-tight">
                      {feature.title}
                    </h3>
                    {/* Description */}
                    <p className={`text-slate-500 leading-relaxed font-medium ${isLarge ? 'text-base max-w-lg' : 'text-sm'}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Read More Link */}
                <div className="relative z-10 pt-8 mt-auto">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:text-blue-700 transition-colors"
                  >
                    <span>Explore Feature</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
