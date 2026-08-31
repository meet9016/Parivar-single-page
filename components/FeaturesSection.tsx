"use client";
import React, { useState } from "react";
import {
  Users,
  Image as ImageIcon,
  CalendarCheck,
  Sparkles,
  UserPlus,
  Briefcase,
  Heart,
  ShieldCheck,
  Building,
  FileText,
  Newspaper,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const iconMap: Record<string, any> = {
  Users,
  ImageIcon,
  CalendarCheck,
  Sparkles,
  UserPlus,
  Briefcase,
  Heart,
  ShieldCheck,
  Building,
  FileText,
  Newspaper,
  GraduationCap
};

const gridFeaturesTranslations: Record<string, Array<{ icon: string; title: string; desc: string }>> = {
  en: [
    { icon: "Users", title: "My Family", desc: "Manage all family members and keep details updated in the family registry." },
    { icon: "ImageIcon", title: "Gallery", desc: "Browse and save photos of community gatherings and heritage events." },
    { icon: "CalendarCheck", title: "Events", desc: "Track upcoming community meets and RSVP to events instantly." },
    { icon: "Sparkles", title: "Festivals", desc: "Get real-time updates and greetings for upcoming festivals and celebrations." },
    { icon: "UserPlus", title: "Members", desc: "Access the unified and verified directory of all community members." },
    { icon: "Briefcase", title: "Business", desc: "Connect with verified community-owned shops, businesses, and services." },
    { icon: "Heart", title: "Matrimonial", desc: "Find matching proposals and life partner connections within the samaj." },
    { icon: "ShieldCheck", title: "Kamiti (Committee)", desc: "View active committee members, leaders, and their designated roles." },
    { icon: "Building", title: "Jobs", desc: "Explore local job vacancy listings posted by community members." },
    { icon: "FileText", title: "Posts", desc: "Share announcements, achievements, and general posts with the community." },
    { icon: "Newspaper", title: "News", desc: "Stay informed with official community news articles and updates." },
    { icon: "GraduationCap", title: "Students", desc: "Encourage educational progress and manage student profiles." }
  ],
  gu: [
    { icon: "Users", title: "મારો પરિવાર", desc: "પરિવારના તમામ સભ્યોનું સંચાલન કરો અને સભ્ય પત્રક અપડેટ રાખો." },
    { icon: "ImageIcon", title: "ગેલેરી", desc: "સમાજના કાર્યક્રમો અને વારસાના ફોટોગ્રાફ્સ જુઓ અને સાચવો." },
    { icon: "CalendarCheck", title: "ઇવેન્ટ્સ", desc: "આગામી સમાજ મિલન અને કાર્યક્રમોની માહિતી મેળવો અને હાજરી કન્ફર્મ કરો." },
    { icon: "Sparkles", title: "તહેવારો", desc: "આગામી તહેવારો અને ઉજવણીઓ માટે રિયલ-ટાઇમ અપડેટ્સ અને શુભેચ્છાઓ મેળવો." },
    { icon: "UserPlus", title: "સભ્યો", desc: "સમાજના તમામ સભ્યોની એકીકૃત અને પ્રમાણિત ડિરેક્ટરી જુઓ." },
    { icon: "Briefcase", title: "બિઝનેસ", desc: "સમાજના વ્યાવસાયિકો, દુકાનો અને સેવાઓ સાથે સીધા જોડાઓ." },
    { icon: "Heart", title: "મેટ્રિમોનિયલ", desc: "સમાજની અંદર યોગ્ય જીવનસાથીની પસંદગી માટે પ્રોફાઇલ્સ શોધો." },
    { icon: "ShieldCheck", title: "સમિતિ (કમિટી)", desc: "સક્રિય સમિતિના સભ્યો, હોદ્દેદારો અને તેમના કાર્યોની માહિતી મેળવો." },
    { icon: "Building", title: "નોકરીઓ", desc: "સમાજના સભ્યો દ્વારા મૂકવામાં આવેલી ઉપલબ્ધ નોકરીઓની તકો શોધો." },
    { icon: "FileText", title: "પોસ્ટ્સ", desc: "સમાજ માટે મહત્વપૂર્ણ જાહેરાતો અને સિદ્ધિઓની પોસ્ટ શેર કરો." },
    { icon: "Newspaper", title: "સમાચાર", desc: "સમાજના સત્તાવાર સમાચારો અને મહત્વપૂર્ણ અપડેટ્સથી માહિતગાર રહો." },
    { icon: "GraduationCap", title: "વિદ્યાર્થીઓ", desc: "શૈક્ષણિક પ્રગતિને પ્રોત્સાહિત કરો અને તેજસ્વી વિદ્યાર્થીઓના પ્રોફાઇલ જુઓ." }
  ],
  hi: [
    { icon: "Users", title: "मेरा परिवार", desc: "परिवार के सभी सदस्यों का प्रबंधन करें और विवरण अपडेट रखें." },
    { icon: "ImageIcon", title: "गैलरी", desc: "सामुदायिक आयोजनों और सांस्कृतिक कार्यक्रमों के फोटो ब्राउज़ करें." },
    { icon: "CalendarCheck", title: "इवेंट्स", desc: "आगामी सामुदायिक बैठकों की जानकारी प्राप्त करें और उपस्थिति दर्ज करें." },
    { icon: "Sparkles", title: "त्यौहार", desc: "आगामी त्योहारों और समारोहों के लिए लाइव शुभकामनाएं प्राप्त करें." },
    { icon: "UserPlus", title: "सदस्य", desc: "सभी सामुदायिक सदस्यों की सत्यापित सूची तक त्वरित पहुंच प्राप्त करें." },
    { icon: "Briefcase", title: "बिजनेस", desc: "समाज के प्रमाणित व्यवसायों, दुकानों और सेवाओं से संपर्क करें." },
    { icon: "Heart", title: "मैट्रिमोनियल", desc: "समाज के भीतर उपयुक्त जीवनसाथी और रिश्ते की खोज करें." },
    { icon: "ShieldCheck", title: "समिति (कमेटी)", desc: "सक्रिय समिति सदस्यों, पदाधिकारियों और उनके पदों को देखें." },
    { icon: "Building", title: "नौकरियां", desc: "सामुदायिक सदस्यों द्वारा पोस्ट की गई नौकरियों की सूची खोजें." },
    { icon: "FileText", title: "पोस्ट", desc: "समुदाय के साथ महत्वपूर्ण घोषणाएं और उपलब्धियां साझा करें." },
    { icon: "Newspaper", title: "समाचार", desc: "समाज के आधिकारिक समाचारों और नवीनतम घोषणाओं से अपडेट रहें." },
    { icon: "GraduationCap", title: "छात्र", desc: "शैक्षणिक प्रगति को प्रोत्साहित करें और छात्र प्रोफाइल का प्रबंधन करें." }
  ]
};

export default function FeaturesSection() {
  const [currentMockupIndex, setCurrentMockupIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t, language } = useLanguage();
  
  const features = gridFeaturesTranslations[language] || gridFeaturesTranslations["en"];

  const mockups = [
    "/members.png",
    "/events.png",
    "/photos.png",
    "/bussiness.png",
    "/news.png"
  ];

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentMockupIndex((prev) => (prev + 1 >= mockups.length ? 0 : prev + 1));
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentMockupIndex((prev) => (prev - 1 < 0 ? mockups.length - 1 : prev - 1));
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <section id="features" className="py-16 md:py-24 bg-[#f8fafc] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1340] tracking-tight">
            {t("features.title")}
          </h2>
        </div>
 
        {/* 4x3 Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Users;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 flex flex-col items-center text-center space-y-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-800 mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mockups Carousel Section (Restored Carousel) */}
        <div className="relative bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200/60 shadow-xl shadow-slate-200/40 max-w-5xl mx-auto">
          
          <div className="flex items-center justify-center min-h-[500px]">
            
            {/* Single Mockup Display */}
            <div className={`w-full flex justify-center transition-all duration-300 transform ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
              <img 
                src={mockups[currentMockupIndex]} 
                alt={`App Screenshot ${currentMockupIndex + 1}`} 
                className="max-h-[500px] w-auto object-contain drop-shadow-2xl rounded-2xl border-[6px] border-slate-50"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            
          </div>

          {/* Carousel Controls */}
          <button 
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-110 transition-all z-20 border-4 border-white cursor-pointer animate-pulse"
            aria-label="Previous screenshot"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-110 transition-all z-20 border-4 border-white cursor-pointer animate-pulse"
            aria-label="Next screenshot"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

        </div>

      </div>
    </section>
  );
}
