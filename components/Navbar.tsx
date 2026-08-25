"use client";

import React, { useState } from "react";
import {
  Users,
  Home,
  Info,
  Layers,
  Mail,
  LogIn,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="Parivar.me Logo"
            className="h-9 sm:h-10 w-auto object-contain hover:scale-[1.02] transition-transform"
          />
        </a>

        {/* Desktop Nav Links with Icons */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#0B1340]">
          <a
            href="#home"
            className="flex items-center gap-1.5 text-blue-600 font-bold hover:text-blue-700 transition-colors py-1"
          >
            <Home className="w-4 h-4 text-blue-600" />
            <span>Home</span>
          </a>
          <a
            href="#about"
            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1"
          >
            <Info className="w-4 h-4 text-slate-500" />
            <span>About</span>
          </a>
          <a
            href="#features"
            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1"
          >
            <Layers className="w-4 h-4 text-slate-500" />
            <span>Feature</span>
          </a>
          <a
            href="#contact"
            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1"
          >
            <Mail className="w-4 h-4 text-slate-500" />
            <span>Contact</span>
          </a>
        </nav>

        {/* CTA Button: Inquiry Now */}
        <div className="hidden md:flex items-center">
          <a
            href="#contact"
            className="bg-[#0B1340] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <LogIn className="w-4 h-4 text-white" />
            <span>Inquiry Now</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-blue-600 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-4 text-sm font-semibold">
          <a
            href="#home"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-blue-600"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </a>
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-slate-800 hover:text-blue-600"
          >
            <Info className="w-4 h-4" />
            <span>About</span>
          </a>
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-slate-800 hover:text-blue-600"
          >
            <Layers className="w-4 h-4" />
            <span>Feature</span>
          </a>
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-slate-800 hover:text-blue-600"
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </a>
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="bg-[#0B1340] text-white text-center py-2.5 rounded-md font-bold flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Inquiry Now</span>
          </a>
        </div>
      )}
    </header>
  );
}
