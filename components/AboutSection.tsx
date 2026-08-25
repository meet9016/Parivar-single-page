import React from "react";
import { Heart, Check } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Image (about_sec_img.png) */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="relative w-full max-w-[540px] lg:max-w-full">
              <img
                src="/about_sec_img.png"
                alt="About Parivar Mobile App Screenshot"
                className="w-full h-auto object-contain drop-shadow-xl hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
          </div>

          {/* Right Column: About Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 text-[#3B82F6] font-bold text-sm tracking-wide">
              {/* Icon badge */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2a2 2 0 012 2v1h1a3 3 0 013 3v2a3 3 0 01-3 3h-1v1a2 2 0 01-2 2h-4a2 2 0 01-2-2v-1H6a3 3 0 01-3-3V8a3 3 0 013-3h1V4a2 2 0 012-2h4zm-2 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm4 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
              </svg>
              <span>About Parivar</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1340] leading-[1.15] tracking-tight">
              Built For Communities. <br />
              Designed For{" "}
              <span className="text-[#3B82F6]">Togetherness.</span>
            </h2>

            {/* Description */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Parivar Is A Powerful Community Management Platform Built For Organizations, Groups, And Networks To Stay Connected, Organized, And Engaged.
            </p>

            {/* Feature List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 border-b border-slate-100/80 pb-3">
                <div className="w-5 h-5 rounded-full bg-[#0B1340] text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-slate-800 text-sm sm:text-base font-semibold">
                  Bring Every Generation Onto One Private Space
                </span>
              </div>

              <div className="flex items-center gap-3 border-b border-slate-100/80 pb-3">
                <div className="w-5 h-5 rounded-full bg-[#0B1340] text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-slate-800 text-sm sm:text-base font-semibold">
                  Plan Events, Share Photos & Preserve Memories
                </span>
              </div>

              <div className="flex items-center gap-3 border-b border-slate-100/80 pb-3">
                <div className="w-5 h-5 rounded-full bg-[#0B1340] text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-slate-800 text-sm sm:text-base font-semibold">
                  Designed With Privacy & Warmth At Its Core
                </span>
              </div>
            </div>

            {/* Join Parivar Button */}
            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 bg-[#0B1340] hover:bg-blue-900 text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                <Heart className="w-4 h-4 text-white fill-white group-hover:scale-110 transition-transform" />
                <span>Join Parivar</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
