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
import Footer from "@/components/Footer";
import WhatsAppChat from "@/components/WhatsAppChat";
import InquiryPopup from "@/components/InquiryPopup";

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".scroll-animate");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* 15-Second Delayed Popup */}
      <InquiryPopup />

      {/* Floating WhatsApp Widget */}
      <WhatsAppChat />

      {/* 1. Main Navigation Bar */}
      <Navbar />

      {/* 2. Hero Section */}
      <div className="scroll-animate">
        <HeroSection />
      </div>

      {/* 3. Statistics Banner (Hidden) */}
      {/* <div className="scroll-animate">
        <StatsSection />
      </div> */}

      {/* 4. About Parivar Section */}
      <div className="scroll-animate">
        <AboutSection />
      </div>

      {/* 5. Before & After Comparison */}
      <div className="scroll-animate">
        <ComparisonSection />
      </div>

      {/* 6. What We Offer Features Section */}
      <div className="scroll-animate">
        <FeaturesSection />
      </div>

      {/* 7. Superadmin Managed Pricing Section */}
      <div className="scroll-animate">
        <PricingSection />
      </div>

      {/* 8. WhatsApp CTA Banner */}
      <div className="scroll-animate">
        <WhatsAppBanner />
      </div>

      {/* 7. Contact Us / Let's Create Something Section */}
      <div className="scroll-animate">
        <ContactSection />
      </div>

      {/* 8. Footer Section */}
      <Footer />
    </main>
  );
}

