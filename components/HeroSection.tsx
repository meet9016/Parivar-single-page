import React from "react";
import Image from "next/image";
import { Sparkles, Heart } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-white py-14 sm:py-20 lg:py-24">
      {/* Background Grid Lines Pattern & Soft Blue Light Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-indigo-200/35 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 text-slate-800 text-sm font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-slate-700" />
              <span>Trusted By Communities</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B1340] leading-[1.12] tracking-tight">
              Community <br />
              Management <br />
              <span className="text-[#3B82F6]">
                At Your Fingertips
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Parivar.me Is A Warm, Modern Platform Built For Samaj, Parivar, And Community Organizations. Manage Your Members, Plan Events, Preserve Your Heritage, And Connect Families — All In One Beautifully Crafted Digital Home.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 bg-[#0B1340] hover:bg-blue-900 text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                <Heart className="w-4 h-4 text-white fill-white group-hover:scale-110 transition-transform" />
                <span>Get Started</span>
              </a>
            </div>
          </div>

          {/* Right Column Graphic - hero_sec_img.png */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="relative w-full max-w-[560px] lg:max-w-full">
              <img
                src="/hero_sec_img.png"
                alt="Parivar Community Management Mobile Apps"
                className="w-full h-auto object-contain drop-shadow-xl hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
