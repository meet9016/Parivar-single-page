"use client";

import React from "react";
import {
  Users,
  Globe,
  Phone,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageCode } from "@/lib/translations";

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as LanguageCode);
  };

  return (
    <footer id="contact" className="bg-gradient-to-br from-[#070D2B] via-[#0B1340] to-[#030617] text-white pt-20 pb-8 border-t border-indigo-900/50 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 pb-8 border-b border-white/10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-5 space-y-6">
            <a href="#" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Parivar.me Logo"
                className="h-12 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
              />
            </a>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
              {t('footer.desc')}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/20"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/20"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/20"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/20"
                aria-label="Youtube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/20"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links (Same as Header) */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-sm font-bold text-white tracking-widest uppercase">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-400 font-medium">
              <li>
                <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-400 transition-colors" />
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-400 transition-colors" />
                  {t('nav.about')}
                </a>
              </li>
              <li>
                <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-400 transition-colors" />
                  {t('nav.features')}
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-400 transition-colors" />
                  {t('nav.contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay In The Loop & Contact */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-sm font-bold text-white tracking-widest uppercase">
              {t('footer.contact')}
            </h4>
            
            {/* Language Switcher */}
            <div className="pt-2">
              <label htmlFor="language" className="block text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">{t('footer.language')}</label>
              <div className="relative inline-block w-48">
                <select 
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <option value="gu" className="bg-slate-900 text-white">ગુજરાતી (Gujarati)</option>
                  <option value="en" className="bg-slate-900 text-white">English</option>
                  <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Globe className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="pt-4 space-y-4 text-sm text-slate-300 font-medium">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-900/40 text-blue-400 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <a href="https://wa.me/918866779008" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +91 88667-79008
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-900/40 text-blue-400 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span>info@Parivar.me</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-900/40 text-blue-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Surat, Gujarat, India</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-500 font-medium gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span>Copyright © 2026 Parivar. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <a href="https://digitalkstechno.com/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 underline transition-colors">
              A product of Digitalks Techno LLP.
            </a>
          </div>
          <div className="flex items-center gap-6">
            <a href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span className="text-slate-700">•</span>
            <a href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
