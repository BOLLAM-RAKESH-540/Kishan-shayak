import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations directly to avoid network overhead for core languages
const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "spend": "Spend",
        "modules": "Modules",
        "community": "Community",
        "profile": "Profile"
      },
      "dashboard": {
        "welcome": "Namaste",
        "subtitle": "Your digital farm assistant is ready.",
        "search": "Search modules...",
        "analytics": "Financial Intelligence",
        "connect": "Krishi Connect"
      },
      "expenses": {
        "title": "Expenses",
        "add": "Add Expense",
        "category": "Category",
        "amount": "Amount"
      },
      "community": {
        "title": "Krishi Connect",
        "share": "Share Update",
        "likes": "Likes",
        "comments": "Comments"
      }
    }
  },
  hi: {
    translation: {
      "nav": {
        "home": "मुख्य पृष्ठ",
        "spend": "खर्च",
        "modules": "मॉड्यूल",
        "community": "समुदाय",
        "profile": "प्रोफ़ाइल"
      },
      "dashboard": {
        "welcome": "नमस्ते",
        "subtitle": "आपका डिजिटल फार्म असिस्टेंट तैयार है।",
        "search": "मॉड्यूल खोजें...",
        "analytics": "वित्तीय बुद्धिमत्ता",
        "connect": "कृषि कनेक्ट"
      },
      "expenses": {
        "title": "खर्च",
        "add": "खर्च जोड़ें",
        "category": "श्रेणी",
        "amount": "राशि"
      },
      "community": {
        "title": "कृषि कनेक्ट",
        "share": "अपडेट साझा करें",
        "likes": "पसंद",
        "comments": "टिप्पणियाँ"
      }
    }
  },
  te: {
    translation: {
      "nav": {
        "home": "హోమ్",
        "spend": "ఖర్చులు",
        "modules": "మాడ్యూల్స్",
        "community": "కమ్యూనిటీ",
        "profile": "ప్రొఫైల్"
      },
      "dashboard": {
        "welcome": "నమస్తే",
        "subtitle": "మీ డిజిటల్ ఫార్మ్ అసిస్టెంట్ సిద్ధంగా ఉంది.",
        "search": "మాడ్యూల్స్ వెతకండి...",
        "analytics": "ఆర్థిక సమాచారం",
        "connect": "కృషి కనెక్ట్"
      },
      "expenses": {
        "title": "ఖర్చులు",
        "add": "ఖర్చును జోడించండి",
        "category": "వర్గం",
        "amount": "మొత్తం"
      },
      "community": {
        "title": "కృషి కనెక్ట్",
        "share": "అప్‌డేట్ పంచుకోండి",
        "likes": "లైక్‌లు",
        "comments": "కామెంట్‌లు"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;
