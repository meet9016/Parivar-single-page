import TopHeader from "@/components/TopHeader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import FeaturesSection from "@/components/FeaturesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Top Bar */}
      <TopHeader />

      {/* 2. Main Navigation Bar */}
      <Navbar />

      {/* 3. Hero Section with Smartphone Graphic */}
      <HeroSection />

      {/* 4. Statistics Banner */}
      <StatsSection />

      {/* 5. About Parivar Section */}
      <AboutSection />

      {/* 6. What We Offer Features Section */}
      <FeaturesSection />

      {/* 7. Contact Us / Let's Create Something Section */}
      <ContactSection />

      {/* 8. Footer Section */}
      <Footer />
    </main>
  );
}
