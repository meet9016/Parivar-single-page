import React from "react";
import { Heart, Check, ArrowRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-12 md:py-16 bg-white relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-center">
          
          {/* Left Column: Image (about_sec_img.png) */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            {/* Image backdrop styling */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-indigo-100/30 rounded-[3rem] transform -rotate-6 scale-95" />
            <div className="relative w-full max-w-[540px] lg:max-w-full rounded-[3rem] overflow-hidden bg-white/50 backdrop-blur-sm p-4 shadow-2xl shadow-blue-900/10 border border-white">
              <img
                src="/about_sec_img.png"
                alt="About Parivar Mobile App Screenshot"
                className="w-full h-auto object-cover rounded-[2.5rem] hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>

          {/* Right Column: About Content */}
          <div className="lg:col-span-6 space-y-8 text-left">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-xs tracking-widest uppercase shadow-sm">
              <span>About Parivar</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1340] leading-[1.1] tracking-tighter">
              Built For Communities. <br />
              Designed For{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Togetherness.</span>
            </h2>

            {/* Description */}
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-xl font-medium">
              Parivar is a powerful community management platform built for organizations, groups, and networks to stay connected, organized, and engaged in a private, secure space.
            </p>

            {/* Feature List */}
            <div className="space-y-5 pt-2">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-slate-700 text-base font-semibold group-hover:text-slate-900 transition-colors">
                  Bring Every Generation Onto One Private Space
                </span>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-slate-700 text-base font-semibold group-hover:text-slate-900 transition-colors">
                  Plan Events, Share Photos & Preserve Memories
                </span>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-slate-700 text-base font-semibold group-hover:text-slate-900 transition-colors">
                  Designed With Privacy & Warmth At Its Core
                </span>
              </div>
            </div>

            {/* Join Parivar Button */}
            <div className="pt-6">
              <a
                href="https://wa.me/918866779008"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#0B1340] hover:bg-blue-900 text-white font-bold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 hover:-translate-y-1 transition-all duration-300 group"
              >
                <span>Join Parivar</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
