import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'HI' },
    { code: 'te', label: 'TE' }
  ];

  return (
    <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-gray-100 shadow-sm">
      <div className="p-1.5 text-gray-400">
        <Languages size={14} />
      </div>
      <div className="flex gap-0.5">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
              i18n.language === lang.code 
                ? 'bg-green-600 text-white shadow-md shadow-green-500/20' 
                : 'text-gray-400 hover:text-green-600'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
