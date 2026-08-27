import React from "react";
import Image from "next/image";
import { Sparkles, Heart } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-[#fafcff] py-12 lg:py-16">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Column Content */}
          <div className="lg:col-span-7 space-y-8 text-left z-10">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm shadow-blue-900/5 text-blue-700 text-xs sm:text-sm font-bold tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Trusted By 500+ Communities</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B1340] leading-[1.05] tracking-tighter">
              Community <br />
              Management <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                At Your Fingertips
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-xl font-medium">
              Parivar.me is a warm, modern platform built for Samaj, Parivar, and Community Organizations. Manage members, plan events, and preserve heritage—all in one beautifully crafted digital home.
            </p>

            {/* CTA Button & Trust Indicators */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <a
                href="https://wa.me/918866779008"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#0B1340] hover:bg-blue-900 text-white font-bold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 hover:-translate-y-1 transition-all duration-300 group w-full sm:w-auto"
              >
                <span>Get Started Now</span>
                <Heart className="w-4 h-4 text-red-400 fill-red-400 group-hover:scale-125 transition-transform" />
              </a>
              
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs">👨‍👩‍👦</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-xs">🎉</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-xs">🚀</div>
                </div>
                <span>Join the family</span>
              </div>
            </div>
          </div>

          {/* Right Column Graphic */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 to-transparent rounded-3xl blur-2xl transform rotate-3" />
            <div className="relative w-full max-w-[500px] lg:max-w-full z-10 perspective-1000">
              <img
                src="/hero_sec_img.png"
                alt="Parivar Community Management Mobile Apps"
                className="w-full h-auto object-contain drop-shadow-2xl hover:scale-[1.03] hover:rotate-1 transition-all duration-500 ease-out"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
