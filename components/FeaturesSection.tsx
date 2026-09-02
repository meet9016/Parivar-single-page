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
    "/application/Device.png",
    "/application/Device-1.png",
    "/application/Device-2.png",
    "/application/Device-3.png",
    "/application/Device-4.png",
    "/application/Device-5.png",
    "/application/Device-6.png",
    "/application/Device-7.png",
    "/application/Device-8.png",
    "/application/Device-9.png",
    "/application/Group 12.png",
    "/application/Group 12-1.png",
    "/application/Group 12-2.png",
    "/application/Group 12-3.png",
    "/application/Group 12-4.png",
    "/application/Group 13.png",
    "/application/Group 16.png",
    "/application/Group 17.png"
  ];

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentMockupIndex((prev) => (prev + 1 >= mockups.length ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentMockupIndex((prev) => (prev - 1 < 0 ? mockups.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <section id="features" className="relative overflow-x-hidden bg-[#F8FAFC]">
      
      {/* Grid Section */}
      <div className="pt-12 pb-6 md:pt-16 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1340] tracking-tight">
            {t("features.title")}
          </h2>
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
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
        </div>
      </div>

      {/* Mockups Carousel Section (Premium Coverflow Showcase) */}
      <div className="pb-12 md:pb-16 pt-6 md:pt-6">
        <div className="w-full max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="rounded-[2rem] p-6 md:p-12 relative overflow-hidden">
            
            {/* Title above carousel */}
            <div className="text-center mb-10 relative z-10">
               <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{t("features.experienceTitle1")}</span> {t("features.experienceTitle2")}
               </h3>
               <p className="text-slate-500 font-medium mt-3">{t("features.experienceSubtitle")}</p>
            </div>

            <div className="flex items-center justify-center min-h-[650px] sm:min-h-[800px] relative z-10">
              
              {mockups.map((mockup, index) => {
                let diff = index - currentMockupIndex;
                if (diff > mockups.length / 2) diff -= mockups.length;
                if (diff < -mockups.length / 2) diff += mockups.length;

                let styles = "";
                let zIndex = 0;

                if (diff === 0) {
                  styles = "opacity-100 scale-100 translate-x-0 drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-30";
                  zIndex = 30;
                } else if (diff === -1) {
                  styles = "opacity-70 scale-[0.8] -translate-x-[85%] sm:-translate-x-[115%] drop-shadow-lg cursor-pointer z-20 hover:opacity-90";
                  zIndex = 20;
                } else if (diff === 1) {
                  styles = "opacity-70 scale-[0.8] translate-x-[85%] sm:translate-x-[115%] drop-shadow-lg cursor-pointer z-20 hover:opacity-90";
                  zIndex = 20;
                } else if (diff < -1) {
                  styles = "opacity-0 scale-[0.6] -translate-x-[170%] sm:-translate-x-[230%] pointer-events-none";
                  zIndex = 0;
                } else {
                  styles = "opacity-0 scale-[0.6] translate-x-[170%] sm:translate-x-[230%] pointer-events-none";
                  zIndex = 0;
                }

                return (
                  <div 
                    key={index} 
                    onClick={() => {
                      if (diff !== 0 && !isTransitioning) {
                        setIsTransitioning(true);
                        setCurrentMockupIndex(index);
                        setTimeout(() => setIsTransitioning(false), 500);
                      }
                    }}
                    className={`absolute transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] w-[320px] sm:w-[400px] transform-gpu will-change-transform [backface-visibility:hidden] ${styles}`}
                    style={{ zIndex }}
                  >
                    <img 
                      src={mockup} 
                      alt={`App Screenshot ${index + 1}`} 
                      className="w-full h-auto object-contain pointer-events-none"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                );
              })}

              {/* Carousel Controls */}
              <button 
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white text-slate-700 flex items-center justify-center shadow-lg hover:bg-blue-600 hover:text-white hover:scale-110 hover:shadow-blue-500/30 transition-all z-40 border border-slate-100 cursor-pointer opacity-80 hover:opacity-100"
                aria-label="Previous screenshot"
              >
                <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
              </button>
              
              <button 
                onClick={handleNext}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white text-slate-700 flex items-center justify-center shadow-lg hover:bg-blue-600 hover:text-white hover:scale-110 hover:shadow-blue-500/30 transition-all z-40 border border-slate-100 cursor-pointer opacity-80 hover:opacity-100"
                aria-label="Next screenshot"
              >
                <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
              </button>
            </div>
            
            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-40 flex-wrap justify-center w-full px-8">
              {mockups.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-2 rounded-full transition-all duration-300 ${currentMockupIndex === idx ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-blue-400 cursor-pointer'}`}
                  onClick={() => {
                    if (isTransitioning) return;
                    setIsTransitioning(true);
                    setCurrentMockupIndex(idx);
                    setTimeout(() => setIsTransitioning(false), 500);
                  }}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
