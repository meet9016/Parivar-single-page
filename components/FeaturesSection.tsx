"use client";
import React, { useState } from "react";
import {
  UserPlus,
  CalendarCheck,
  Image as ImageIcon,
  HeartPulse,
  Briefcase,
  Newspaper,
  ArrowRight,
  X
} from "lucide-react";

const features = [
  {
    icon: UserPlus,
    title: "Family Registry & Member Directory",
    description: "Hierarchical Tree Structure distinguishing 'Family Head' from dependants. Includes cascading geographic selectors and emergency information indexing.",
    image: "/members.png"
  },
  {
    icon: CalendarCheck,
    title: "Community Events",
    description: "Organize cultural events, manage attendee registrations, ticketing types (Free/Paid), and interactive venue maps.",
    image: "/events.png"
  },
  {
    icon: ImageIcon,
    title: "Media & Photo Gallery",
    description: "Upload and categorize festival photos, event pictures, and historical community archives with comprehensive multi-image support.",
    image: "/photos.png"
  },
  {
    icon: HeartPulse,
    title: "Blood Donor Network",
    description: "Connect with blood donors within the community in emergencies. A life-saving network with up-to-date donor details.",
    image: "/members.png" // Fallback since no image was provided
  },
  {
    icon: Briefcase,
    title: "Verified Businesses Directory",
    description: "Comprehensive directory of member-owned businesses, contact information, website links, catalog images, and category classification.",
    image: "/bussiness.png"
  },
  {
    icon: Newspaper,
    title: "Official News & Announcements",
    description: "Publish official press releases, samaj circulars, and executive announcements with image attachments and instant notifications.",
    image: "/news.png"
  },
];

export default function FeaturesSection() {
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  return (
    <section id="features" className="py-12 md:py-16 bg-[#fafcff] relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 font-bold text-xs tracking-widest uppercase shadow-sm">
            <span>Our Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1340] tracking-tighter leading-tight">
            Everything you need to <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              run your community
            </span>
          </h2>
        </div>

        {/* Bento Grid (Reduced height and padding) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white p-5 md:p-6 rounded-2xl border border-slate-200/60 shadow-md hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
                onClick={() => setSelectedFeature(feature)}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-blue-50/0 group-hover:from-blue-50/30 transition-colors duration-500 pointer-events-none" />
                
                <div className="relative z-10 space-y-4">
                  {/* Icon Box */}
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5">
                    {/* Title */}
                    <h3 className="text-lg font-black text-[#0B1340] tracking-tight">
                      {feature.title}
                    </h3>
                    {/* Description */}
                    <p className="text-slate-500 leading-relaxed font-medium text-sm line-clamp-3">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Read More Link */}
                <div className="relative z-10 pt-4 mt-auto">
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                    <span>Explore Feature</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Modern Feature Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#0B1340]/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedFeature(null)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 max-h-full">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedFeature(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center text-slate-700 shadow-sm transition-colors border border-slate-200"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Image Area */}
            <div className="w-full bg-slate-50 flex items-center justify-center p-4 sm:p-8 border-b border-slate-100">
              <img 
                src={selectedFeature.image} 
                alt={selectedFeature.title} 
                className="w-full h-auto max-h-[50vh] object-contain rounded-xl drop-shadow-xl"
              />
            </div>

            {/* Bottom Content Area */}
            <div className="w-full p-6 sm:p-8 flex flex-col justify-center overflow-y-auto bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <selectedFeature.icon className="w-7 h-7" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#0B1340] tracking-tight leading-snug">
                    {selectedFeature.title}
                  </h3>
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
                    {selectedFeature.description}
                  </p>
                </div>
              </div>
              
              {/* Action area */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0B1340] hover:bg-blue-900 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-300"
                >
                  Close Details
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </section>
  );
}
