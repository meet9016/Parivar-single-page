"use client";
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import ComparisonSection from "@/components/ComparisonSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import WhatsAppBanner from "@/components/WhatsAppBanner";
import ContactSection from "@/components/ContactSection";
import CompanySection from "@/components/CompanySection";
import Footer from "@/components/Footer";
import WhatsAppChat from "@/components/WhatsAppChat";
import InquiryPopup from "@/components/InquiryPopup";

export default function Home() {


  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* 15-Second Delayed Popup */}
      <InquiryPopup />

      {/* Floating WhatsApp Widget */}
      <WhatsAppChat />

      {/* 1. Main Navigation Bar */}
      <Navbar />

      {/* 2. Hero Section */}
      <HeroSection />

      {/* 4. About Parivar Section */}
      <AboutSection />

      {/* 5. Before & After Comparison */}
      <ComparisonSection />

      {/* 6. What We Offer Features Section */}
      <FeaturesSection />

      {/* 7. Superadmin Managed Pricing Section */}
      <PricingSection />

      {/* 8. WhatsApp CTA Banner */}
      <WhatsAppBanner />

      {/* 9. Contact Us / Let's Create Something Section */}
      <ContactSection />

      {/* 10. DigiTalks Company & Team Section */}
      <CompanySection />

      {/* 11. Footer Section */}
      <Footer />
    </main>
  );
}

