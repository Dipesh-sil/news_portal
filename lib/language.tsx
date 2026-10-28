'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'np';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isNepali: boolean;
  t: (translations: { en: string; np: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('np');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('bk_lang') as Language;
    if (saved === 'en' || saved === 'np') {
      setLanguageState(saved);
    } else {
      setLanguageState('np');
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bk_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'np' : 'en';
    setLanguage(next);
  };

  const t = (translations: { en: string; np: string }) => {
    return language === 'np' ? translations.np : translations.en;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, isNepali: language === 'np', t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'np' as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      isNepali: true,
      t: (tr: { en: string; np: string }) => tr.np,
    };
  }
  return context;
}
