"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import axiosInstance from "../lib/axiosInstance";
import { ENDPOINTS } from "../lib/endpoints";
import { useLanguage } from "../context/LanguageContext";

// ─── PHRASE-LEVEL TRANSLATIONS (checked first, longest match wins) ───
const guPhrases: Record<string, string> = {
  "instant notifications": "ઇન્સ્ટન્ટ નોટિફિકેશન",
  "continued smart automation": "સતત સ્માર્ટ ઓટોમેશન",
  "smart automation": "સ્માર્ટ ઓટોમેશન",
  "preserved digital heritage": "સુરક્ષિત ડિજિટલ વારસો",
  "1 official whatsapp api number": "1 ઓફિશિયલ વોટ્સએપ API નંબર",
  "official whatsapp api number": "ઓફિશિયલ વોટ્સએપ API નંબર",
  "additional whatsapp number": "વધારાનો WhatsApp નંબર",
  "special renewal deal": "સ્પેશિયલ રીન્યુઅલ ડીલ",
  "exclusive deal": "એક્સક્લુસિવ ડીલ",
  "renewal offer": "રીન્યુઅલ ઓફર",
  "new offer": "નવી ઓફર",
  "get free demo": "ફ્રી ડેમો મેળવો",
  "free domain": "ફ્રી ડોમેન",
  "free server": "ફ્રી સર્વર",
  "free sms": "ફ્રી એસએમએસ",
  "free ads": "ફ્રી એડ્સ",
  "free training": "ફ્રી ટ્રેનિંગ",
  "free setup": "ફ્રી સેટઅપ",
  "free support": "ફ્રી સપોર્ટ",
  "free update": "ફ્રી અપડેટ",
  "free updates": "ફ્રી અપડેટ્સ",
  "free maintenance": "ફ્રી મેઇન્ટેનન્સ",
  "free hosting": "ફ્રી હોસ્ટિંગ",
  "free consultation": "ફ્રી કન્સલ્ટેશન",
  "free migration": "ફ્રી માઇગ્રેશન",
  "play store, app store application available": "પ્લે સ્ટોર અને એપ સ્ટોર પર એપ્લિકેશન ઉપલબ્ધ",
  "play store and app store available": "પ્લે સ્ટોર અને એપ સ્ટોર ઉપલબ્ધ",
  "whatsapp automation": "વોટ્સએપ ઓટોમેશન",
  "whatsapp integration": "વોટ્સએપ ઇન્ટીગ્રેશન",
  "member management": "સભ્ય મેનેજમેન્ટ",
  "event management": "ઇવેન્ટ મેનેજમેન્ટ",
  "donation management": "ડોનેશન મેનેજમેન્ટ",
  "expense management": "ખર્ચ મેનેજમેન્ટ",
  "gallery management": "ગેલેરી મેનેજમેન્ટ",
  "committee management": "સમિતિ મેનેજમેન્ટ",
  "business directory": "બિઝનેસ ડિરેક્ટરી",
  "matrimonial module": "મેટ્રિમોનિયલ મોડ્યુલ",
  "job vacancy module": "જોબ વેકેન્સી મોડ્યુલ",
  "student module": "સ્ટુડન્ટ મોડ્યુલ",
  "news module": "ન્યૂઝ મોડ્યુલ",
  "post module": "પોસ્ટ મોડ્યુલ",
  "push notifications": "પુશ નોટિફિકેશન",
  "custom branding": "કસ્ટમ બ્રાન્ડિંગ",
  "custom domain": "કસ્ટમ ડોમેન",
  "data backup": "ડેટા બેકઅપ",
  "cloud storage": "ક્લાઉડ સ્ટોરેજ",
  "admin panel": "એડમિન પેનલ",
  "super admin": "સુપર એડમિન",
  "role management": "રોલ મેનેજમેન્ટ",
  "annual plan": "વાર્ષિક પ્લાન",
  "monthly plan": "માસિક પ્લાન",
  "lifetime access": "લાઇફટાઇમ એક્સેસ",
  "unlimited members": "અનલિમિટેડ સભ્યો",
  "unlimited storage": "અનલિમિટેડ સ્ટોરેજ",
  "priority support": "પ્રાયોરિટી સપોર્ટ",
  "24/7 support": "24/7 સપોર્ટ",
  "dedicated support": "ડેડિકેટેડ સપોર્ટ",
  "technical support": "ટેકનિકલ સપોર્ટ",
  "mobile app": "મોબાઇલ એપ",
  "web panel": "વેબ પેનલ",
  "festival greetings": "તહેવાર શુભેચ્છાઓ",
  "birthday greetings": "જન્મદિવસ શુભેચ્છાઓ",
  "bulk sms": "બલ્ક એસએમએસ",
  "bulk notification": "બલ્ક નોટિફિકેશન",
  "auto notification": "ઓટો નોટિફિકેશન",
  "auto reminder": "ઓટો રિમાઇન્ડર",
};

const hiPhrases: Record<string, string> = {
  "instant notifications": "इंस्टेंट नोटिफिकेशन",
  "continued smart automation": "निरंतर स्मार्ट ऑटोमेशन",
  "smart automation": "स्मार्ट ऑटोमेशन",
  "preserved digital heritage": "संरक्षित डिजिटल विरासत",
  "1 official whatsapp api number": "1 आधिकारिक व्हाट्सएप एपीआई नंबर",
  "official whatsapp api number": "आधिकारिक व्हाट्सएप एपीआई नंबर",
  "additional whatsapp number": "अतिरिक्त WhatsApp नंबर",
  "special renewal deal": "स्पेशल रिन्यूअल डील",
  "exclusive deal": "एक्सक्लूसिव डील",
  "renewal offer": "रिन्यूअल ऑफर",
  "new offer": "नया ऑफर",
  "get free demo": "फ्री डेमो प्राप्त करें",
  "free domain": "फ्री डोमेन",
  "free server": "फ्री सर्वर",
  "free sms": "फ्री एसएमएस",
  "free ads": "फ्री एड्स",
  "free training": "फ्री ट्रेनिंग",
  "free setup": "फ्री सेटअप",
  "free support": "फ्री सपोर्ट",
  "free update": "फ्री अपडेट",
  "free updates": "फ्री अपडेट्स",
  "free maintenance": "फ्री मेंटेनेंस",
  "free hosting": "फ्री होस्टिंग",
  "free consultation": "फ्री कंसल्टेशन",
  "free migration": "फ्री माइग्रेशन",
  "play store, app store application available": "प्ले स्टोर और ऐप स्टोर पर एप्लीकेशन उपलब्ध",
  "play store and app store available": "प्ले स्टोर और ऐप स्टोर उपलब्ध",
  "whatsapp automation": "व्हाट्सएप ऑटोमेशन",
  "whatsapp integration": "व्हाट्सएप इंटीग्रेशन",
  "member management": "सदस्य प्रबंधन",
  "event management": "इवेंट प्रबंधन",
  "donation management": "डोनेशन प्रबंधन",
  "expense management": "खर्च प्रबंधन",
  "gallery management": "गैलरी प्रबंधन",
  "committee management": "समिति प्रबंधन",
  "business directory": "बिजनेस डायरेक्टरी",
  "matrimonial module": "मैट्रिमोनियल मॉड्यूल",
  "job vacancy module": "जॉब वैकेंसी मॉड्यूल",
  "student module": "स्टूडेंट मॉड्यूल",
  "news module": "न्यूज मॉड्यूल",
  "post module": "पोस्ट मॉड्यूल",
  "push notifications": "पुश नोटिफिकेशन",
  "custom branding": "कस्टम ब्रांडिंग",
  "custom domain": "कस्टम डोमेन",
  "data backup": "डेटा बैकअप",
  "cloud storage": "क्लाउड स्टोरेज",
  "admin panel": "एडमिन पैनल",
  "super admin": "सुपर एडमिन",
  "role management": "रोल प्रबंधन",
  "annual plan": "वार्षिक प्लान",
  "monthly plan": "मासिक प्लान",
  "lifetime access": "लाइफटाइम एक्सेस",
  "unlimited members": "असीमित सदस्य",
  "unlimited storage": "असीमित स्टोरेज",
  "priority support": "प्राथमिकता सपोर्ट",
  "24/7 support": "24/7 सपोर्ट",
  "dedicated support": "डेडिकेटेड सपोर्ट",
  "technical support": "टेक्निकल सपोर्ट",
  "mobile app": "मोबाइल ऐप",
  "web panel": "वेब पैनल",
  "festival greetings": "त्योहार शुभकामनाएं",
  "birthday greetings": "जन्मदिन शुभकामनाएं",
  "bulk sms": "बल्क एसएमएस",
  "bulk notification": "बल्क नोटिफिकेशन",
  "auto notification": "ऑटो नोटिफिकेशन",
  "auto reminder": "ऑटो रिमाइंडर",
};

// ─── WORD-LEVEL DICTIONARY (fallback for any remaining English words) ───
const guWords: Record<string, string> = {
  "free": "ફ્રી", "domain": "ડોમેન", "server": "સર્વર", "sms": "એસએમએસ",
  "ads": "એડ્સ", "ad": "એડ", "app": "એપ", "api": "API",
  "smart": "સ્માર્ટ", "automation": "ઓટોમેશન", "digital": "ડિજિટલ",
  "heritage": "વારસો", "instant": "ઇન્સ્ટન્ટ", "notifications": "નોટિફિકેશન",
  "notification": "નોટિફિકેશન", "whatsapp": "વોટ્સએપ", "official": "ઓફિશિયલ",
  "number": "નંબર", "additional": "વધારાનો", "special": "સ્પેશિયલ",
  "renewal": "રીન્યુઅલ", "deal": "ડીલ", "exclusive": "એક્સક્લુસિવ",
  "offer": "ઓફર", "new": "નવી", "get": "મેળવો", "demo": "ડેમો",
  "training": "ટ્રેનિંગ", "setup": "સેટઅપ", "support": "સપોર્ટ",
  "update": "અપડેટ", "updates": "અપડેટ્સ", "maintenance": "મેઇન્ટેનન્સ",
  "hosting": "હોસ્ટિંગ", "play": "પ્લે", "store": "સ્ટોર",
  "application": "એપ્લિકેશન", "available": "ઉપલબ્ધ", "integration": "ઇન્ટીગ્રેશન",
  "member": "સભ્ય", "members": "સભ્યો", "management": "મેનેજમેન્ટ",
  "event": "ઇવેન્ટ", "events": "ઇવેન્ટ્સ", "donation": "ડોનેશન",
  "expense": "ખર્ચ", "gallery": "ગેલેરી", "committee": "સમિતિ",
  "business": "બિઝનેસ", "directory": "ડિરેક્ટરી", "matrimonial": "મેટ્રિમોનિયલ",
  "module": "મોડ્યુલ", "job": "જોબ", "vacancy": "વેકેન્સી",
  "student": "સ્ટુડન્ટ", "news": "ન્યૂઝ", "post": "પોસ્ટ",
  "push": "પુશ", "custom": "કસ્ટમ", "branding": "બ્રાન્ડિંગ",
  "data": "ડેટા", "backup": "બેકઅપ", "cloud": "ક્લાઉડ",
  "storage": "સ્ટોરેજ", "admin": "એડમિન", "panel": "પેનલ",
  "super": "સુપર", "role": "રોલ", "annual": "વાર્ષિક",
  "monthly": "માસિક", "plan": "પ્લાન", "lifetime": "લાઇફટાઇમ",
  "access": "એક્સેસ", "unlimited": "અનલિમિટેડ", "priority": "પ્રાયોરિટી",
  "dedicated": "ડેડિકેટેડ", "technical": "ટેકનિકલ", "mobile": "મોબાઇલ",
  "web": "વેબ", "festival": "તહેવાર", "birthday": "જન્મદિવસ",
  "greetings": "શુભેચ્છાઓ", "bulk": "બલ્ક", "auto": "ઓટો",
  "reminder": "રિમાઇન્ડર", "package": "પેકેજ", "complete": "સંપૂર્ણ",
  "renew": "રીન્યુ", "only": "માત્ર", "just": "માત્ર",
  "continued": "સતત", "preserved": "સુરક્ષિત", "connected": "જોડાયેલ",
  "secure": "સુરક્ષિત", "premium": "પ્રીમિયમ", "basic": "બેસિક",
  "standard": "સ્ટાન્ડર્ડ", "advanced": "એડવાન્સ્ડ", "pro": "પ્રો",
  "plus": "પ્લસ", "enterprise": "એન્ટરપ્રાઇઝ", "starter": "સ્ટાર્ટર",
  "full": "સંપૂર્ણ", "all": "બધું", "service": "સેવા",
  "services": "સેવાઓ", "feature": "ફીચર", "features": "ફીચર્સ",
  "report": "રિપોર્ટ", "reports": "રિપોર્ટ્સ", "analytics": "એનાલિટિક્સ",
  "dashboard": "ડેશબોર્ડ", "website": "વેબસાઇટ", "online": "ઓનલાઇન",
  "offline": "ઓફલાઇન", "payment": "પેમેન્ટ", "payments": "પેમેન્ટ્સ",
  "invoice": "ઇન્વોઇસ", "billing": "બિલિંગ", "receipt": "રસીદ",
  "security": "સિક્યુરિટી", "verified": "વેરિફાઇડ", "certified": "સર્ટિફાઇડ",
  "consultation": "કન્સલ્ટેશન", "migration": "માઇગ્રેશન",
  "download": "ડાઉનલોડ", "upload": "અપલોડ", "import": "ઇમ્પોર્ટ",
  "export": "એક્સપોર્ટ", "email": "ઇમેઇલ", "call": "કોલ",
  "message": "મેસેજ", "chat": "ચેટ", "video": "વિડીયો",
  "photo": "ફોટો", "image": "ઇમેજ", "logo": "લોગો",
  "banner": "બેનર", "template": "ટેમ્પલેટ", "design": "ડિઝાઇન",
  "theme": "થીમ", "color": "કલર", "font": "ફોન્ટ",
  "page": "પેજ", "pages": "પેજ", "link": "લિંક",
  "share": "શેર", "print": "પ્રિન્ટ", "scan": "સ્કેન",
  "copy": "કોપી", "delete": "ડિલીટ", "edit": "એડિટ",
  "add": "ઍડ", "remove": "રિમૂવ", "save": "સેવ",
  "cancel": "કેન્સલ", "confirm": "કન્ફર્મ", "submit": "સબમિટ",
  "register": "રજિસ્ટર", "login": "લોગિન", "logout": "લોગઆઉટ",
  "profile": "પ્રોફાઇલ", "account": "એકાઉન્ટ", "password": "પાસવર્ડ",
  "user": "યૂઝર", "users": "યૂઝર્સ", "family": "ફેમિલી",
  "community": "સમુદાય", "society": "સમાજ", "group": "ગ્રુપ",
  "list": "લિસ્ટ", "search": "સર્ચ", "filter": "ફિલ્ટર",
  "sort": "સોર્ટ", "status": "સ્ટેટસ", "active": "એક્ટિવ",
  "inactive": "ઇનએક્ટિવ", "pending": "પેન્ડિંગ", "approved": "એપ્રૂવ્ડ",
  "rejected": "રિજેક્ટેડ", "and": "અને", "or": "અથવા",
  "with": "સાથે", "without": "વિના", "for": "માટે",
  "the": "", "a": "", "an": "", "is": "", "are": "", "was": "", "at": "",
  "your": "તમારું", "our": "અમારું", "my": "મારું",
};

const hiWords: Record<string, string> = {
  "free": "फ्री", "domain": "डोमेन", "server": "सर्वर", "sms": "एसएमएस",
  "ads": "एड्स", "ad": "एड", "app": "ऐप", "api": "API",
  "smart": "स्मार्ट", "automation": "ऑटोमेशन", "digital": "डिजिटल",
  "heritage": "विरासत", "instant": "इंस्टेंट", "notifications": "नोटिफिकेशन",
  "notification": "नोटिफिकेशन", "whatsapp": "व्हाट्सएप", "official": "आधिकारिक",
  "number": "नंबर", "additional": "अतिरिक्त", "special": "स्पेशल",
  "renewal": "रिन्यूअल", "deal": "डील", "exclusive": "एक्सक्लूसिव",
  "offer": "ऑफर", "new": "नया", "get": "प्राप्त करें", "demo": "डेमो",
  "training": "ट्रेनिंग", "setup": "सेटअप", "support": "सपोर्ट",
  "update": "अपडेट", "updates": "अपडेट्स", "maintenance": "मेंटेनेंस",
  "hosting": "होस्टिंग", "play": "प्ले", "store": "स्टोर",
  "application": "एप्लीकेशन", "available": "उपलब्ध", "integration": "इंटीग्रेशन",
  "member": "सदस्य", "members": "सदस्य", "management": "प्रबंधन",
  "event": "इवेंट", "events": "इवेंट्स", "donation": "डोनेशन",
  "expense": "खर्च", "gallery": "गैलरी", "committee": "समिति",
  "business": "बिजनेस", "directory": "डायरेक्टरी", "matrimonial": "मैट्रिमोनियल",
  "module": "मॉड्यूल", "job": "जॉब", "vacancy": "वैकेंसी",
  "student": "स्टूडेंट", "news": "न्यूज", "post": "पोस्ट",
  "push": "पुश", "custom": "कस्टम", "branding": "ब्रांडिंग",
  "data": "डेटा", "backup": "बैकअप", "cloud": "क्लाउड",
  "storage": "स्टोरेज", "admin": "एडमिन", "panel": "पैनल",
  "super": "सुपर", "role": "रोल", "annual": "वार्षिक",
  "monthly": "मासिक", "plan": "प्लान", "lifetime": "लाइफटाइम",
  "access": "एक्सेस", "unlimited": "असीमित", "priority": "प्राथमिकता",
  "dedicated": "डेडिकेटेड", "technical": "टेक्निकल", "mobile": "मोबाइल",
  "web": "वेब", "festival": "त्योहार", "birthday": "जन्मदिन",
  "greetings": "शुभकामनाएं", "bulk": "बल्क", "auto": "ऑटो",
  "reminder": "रिमाइंडर", "package": "पैकेज", "complete": "पूरा",
  "renew": "रिन्यू", "only": "मात्र", "just": "मात्र",
  "continued": "निरंतर", "preserved": "संरक्षित", "connected": "जुड़ा",
  "secure": "सुरक्षित", "premium": "प्रीमियम", "basic": "बेसिक",
  "standard": "स्टैंडर्ड", "advanced": "एडवांस्ड", "pro": "प्रो",
  "plus": "प्लस", "enterprise": "एंटरप्राइज", "starter": "स्टार्टर",
  "full": "पूर्ण", "all": "सभी", "service": "सेवा",
  "services": "सेवाएं", "feature": "फीचर", "features": "फीचर्स",
  "report": "रिपोर्ट", "reports": "रिपोर्ट्स", "analytics": "एनालिटिक्स",
  "dashboard": "डैशबोर्ड", "website": "वेबसाइट", "online": "ऑनलाइन",
  "offline": "ऑफलाइन", "payment": "पेमेंट", "payments": "पेमेंट्स",
  "invoice": "इनवॉइस", "billing": "बिलिंग", "receipt": "रसीद",
  "security": "सिक्योरिटी", "verified": "वेरिफाइड", "certified": "सर्टिफाइड",
  "consultation": "कंसल्टेशन", "migration": "माइग्रेशन",
  "download": "डाउनलोड", "upload": "अपलोड", "import": "इंपोर्ट",
  "export": "एक्सपोर्ट", "email": "ईमेल", "call": "कॉल",
  "message": "मैसेज", "chat": "चैट", "video": "वीडियो",
  "photo": "फोटो", "image": "इमेज", "logo": "लोगो",
  "banner": "बैनर", "template": "टेम्पलेट", "design": "डिजाइन",
  "theme": "थीम", "color": "कलर", "font": "फॉन्ट",
  "page": "पेज", "pages": "पेज", "link": "लिंक",
  "share": "शेयर", "print": "प्रिंट", "scan": "स्कैन",
  "copy": "कॉपी", "delete": "डिलीट", "edit": "एडिट",
  "add": "जोड़ें", "remove": "हटाएं", "save": "सेव",
  "cancel": "कैंसल", "confirm": "कन्फर्म", "submit": "सबमिट",
  "register": "रजिस्टर", "login": "लॉगिन", "logout": "लॉगआउट",
  "profile": "प्रोफाइल", "account": "अकाउंट", "password": "पासवर्ड",
  "user": "यूजर", "users": "यूजर्स", "family": "परिवार",
  "community": "समुदाय", "society": "समाज", "group": "ग्रुप",
  "list": "सूची", "search": "खोजें", "filter": "फ़िल्टर",
  "sort": "सॉर्ट", "status": "स्टेटस", "active": "एक्टिव",
  "inactive": "इनएक्टिव", "pending": "पेंडिंग", "approved": "अप्रूव्ड",
  "rejected": "रिजेक्टेड", "and": "और", "or": "या",
  "with": "के साथ", "without": "के बिना", "for": "के लिए",
  "the": "", "a": "", "an": "", "is": "", "are": "", "was": "", "at": "",
  "your": "आपका", "our": "हमारा", "my": "मेरा",
};

// ─── Dynamic price pattern regexes ───
const pricePatterns: Array<{ pattern: RegExp; gu: string; hi: string }> = [
  { pattern: /Renew your package at just ₹([0-9,]+)/gi, gu: "માત્ર ₹$1 માં તમારું પેકેજ રીન્યુ કરો", hi: "मात्र ₹$1 में अपना पैकेज रिन्यू करें" },
  { pattern: /Get the Complete Package at Just ₹([0-9,]+)/gi, gu: "માત્ર ₹$1 માં સંપૂર્ણ પેકેજ મેળવો", hi: "मात्र ₹$1 में पूरा पैकेज प्राप्त करें" },
  { pattern: /Only ₹([0-9,]+)/gi, gu: "માત્ર ₹$1", hi: "मात्र ₹$1" },
];

function translateText(text: string, lang: string): string {
  if (!text || lang === "en") return text;

  const phrases = lang === "gu" ? guPhrases : hiPhrases;
  const words = lang === "gu" ? guWords : hiWords;

  let result = text;

  // Step 1: Apply dynamic price patterns
  for (const pp of pricePatterns) {
    result = result.replace(pp.pattern, lang === "gu" ? pp.gu : pp.hi);
  }

  // Step 2: Try phrase-level replacements (longest phrases first)
  const sortedPhrases = Object.keys(phrases).sort((a, b) => b.length - a.length);
  for (const phrase of sortedPhrases) {
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    result = result.replace(regex, phrases[phrase]);
  }

  // Step 3: Word-by-word fallback for any remaining English words
  result = result.replace(/[a-zA-Z]+/g, (word) => {
    const lower = word.toLowerCase();
    if (words[lower] !== undefined) {
      // Preserve casing style
      return words[lower];
    }
    return word; // Keep original if not found
  });

  // Clean up any double spaces
  result = result.replace(/\s{2,}/g, " ").trim();

  return result;
}

export default function PricingSection() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});
  const { t, language } = useLanguage();
  
  const whatsappNumber = "918866779008"; 

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(ENDPOINTS.PRICING);
        if (res.status === 200) {
          setPlans(Array.isArray(res.data.data) ? res.data.data : []);
        }
      } catch (err) {
        console.error("Failed to load pricing plans", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const togglePlanExpand = (planId: string) => {
    setExpandedPlans((prev) => ({ ...prev, [planId]: !prev[planId] }));
  };

  if (loading || plans.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#fafcff] py-16 md:py-24 border-t border-slate-100">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-300/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-300/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-blue-100 shadow-sm text-xs font-bold text-blue-900 tracking-wide">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span>{t("pricing.tag")}</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t("pricing.title1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {t("pricing.title2")}
            </span>
          </h2>
          <p className="text-slate-600 text-base font-medium max-w-lg mx-auto">
            {t("pricing.subtitle")}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {plans.map((plan) => {
            const defaultMsg = `Hello, I want to book a free demo of Parivar for the "${plan.title}" package.`;
            const waMsg = plan.whatsappMessage || defaultMsg;
            const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMsg)}`;
            
            const isExpanded = !!expandedPlans[plan._id];
            const allFeatures = plan.features || [];
            const remainingCount = allFeatures.length - 3;
            const visibleFeatures = isExpanded ? allFeatures : allFeatures.slice(0, 3);

            return (
              <div
                key={plan._id}
                className="bg-white/80 backdrop-blur-md border-2 border-indigo-100/50 hover:border-indigo-600 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-[0_4px_25px_-4px_rgba(59,130,246,0.06)] hover:shadow-[0_10px_35px_-4px_rgba(59,130,246,0.12)] transition-all duration-300 relative group overflow-hidden"
              >
                {/* Top highlight bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="space-y-6 relative z-10">
                  {/* Badges / Header */}
                  <div className="text-center space-y-2.5">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100/50 text-blue-700 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      🎯 {translateText(plan.subtitle || "Exclusive Deal", language)}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-[#0B1340]">
                      {translateText(plan.title, language)}
                    </h3>
                  </div>

                  {/* Pricing Display */}
                  <div className="text-center space-y-1.5 py-5 bg-[#F8FAFC]/80 rounded-2xl border border-slate-100/80">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-slate-400 text-sm md:text-base line-through font-bold">
                        ₹{plan.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-3xl md:text-4.5xl font-black text-slate-900 tracking-tight">
                        ₹{plan.discountedPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {plan.description && (
                      <p className="text-slate-500 text-xs md:text-sm font-medium">
                        {translateText(plan.description, language)}
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3.5 pt-2">
                    {visibleFeatures.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-sm font-semibold">
                          {translateText(feature, language)}
                        </span>
                      </div>
                    ))}
                    
                    {allFeatures.length > 3 && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => togglePlanExpand(plan._id)}
                          className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                        >
                          {isExpanded ? (
                            <>
                              <span>{t("pricing.less")}</span>
                              <ChevronUp className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              <span>+{remainingCount} {t("pricing.more")}</span>
                              <ChevronDown className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Yellow Highlight Banner & Green WhatsApp Button */}
                <div className="mt-8 pt-6 border-t border-slate-100 space-y-4 relative z-10">
                  {plan.badgeText && (
                    <div className="bg-[#FEF9C3] border border-yellow-200/70 text-yellow-900 text-center font-bold text-xs py-2.5 px-3 rounded-xl shadow-3xs flex items-center justify-center gap-2">
                      💡 {translateText(plan.badgeText, language)}
                    </div>
                  )}

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm md:text-base py-3.5 rounded-full shadow-[0_4px_15px_rgba(34,197,94,0.25)] hover:shadow-[0_4px_25px_rgba(34,197,94,0.4)] active:scale-98 transition-all duration-300 text-center"
                  >
                    <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                    <span>{translateText(plan.buttonText || "Get Free Demo", language)}</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
