"use client";

import React, { useState, useEffect } from "react";
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
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'features', 'contact'];
      let current = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section;
          }
        }
      }
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-300">
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
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-bold text-slate-600 uppercase tracking-wider">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            className={`flex items-center gap-1.5 transition-colors py-2 relative group ${activeSection === 'home' ? 'text-blue-600' : 'hover:text-blue-600'}`}
          >
            <Home className="w-3.5 h-3.5 mb-0.5" />
            <span>Home</span>
            <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 transform transition-transform origin-left rounded-full ${activeSection === 'home' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
          </a>
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, 'about')}
            className={`flex items-center gap-1.5 transition-colors py-2 relative group ${activeSection === 'about' ? 'text-blue-600' : 'hover:text-blue-600'}`}
          >
            <Info className="w-3.5 h-3.5 mb-0.5" />
            <span>About</span>
            <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 transform transition-transform origin-left rounded-full ${activeSection === 'about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
          </a>
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, 'features')}
            className={`flex items-center gap-1.5 transition-colors py-2 relative group ${activeSection === 'features' ? 'text-blue-600' : 'hover:text-blue-600'}`}
          >
            <Layers className="w-3.5 h-3.5 mb-0.5" />
            <span>Features</span>
            <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 transform transition-transform origin-left rounded-full ${activeSection === 'features' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className={`flex items-center gap-1.5 transition-colors py-2 relative group ${activeSection === 'contact' ? 'text-blue-600' : 'hover:text-blue-600'}`}
          >
            <Mail className="w-3.5 h-3.5 mb-0.5" />
            <span>Contact</span>
            <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 transform transition-transform origin-left rounded-full ${activeSection === 'contact' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
          </a>
        </nav>

        {/* CTA Button: Inquiry Now */}
        <div className="hidden md:flex items-center">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className="bg-[#0B1340] hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wide px-5 py-2.5 rounded-full shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            <LogIn className="w-3.5 h-3.5 text-white" />
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
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center gap-2 text-blue-600"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </a>
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, 'about')}
            className="flex items-center gap-2 text-slate-800 hover:text-blue-600"
          >
            <Info className="w-4 h-4" />
            <span>About</span>
          </a>
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, 'features')}
            className="flex items-center gap-2 text-slate-800 hover:text-blue-600"
          >
            <Layers className="w-4 h-4" />
            <span>Feature</span>
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className="flex items-center gap-2 text-slate-800 hover:text-blue-600"
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
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
