import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Language, TranslationKey } from "./translations";
import { getTranslation } from "./translations";
import { getLanguage, setLanguage as saveLanguage } from "../services/settings";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh");

  useEffect(() => {
    void getLanguage().then(setLanguageState);
  }, []);

  const setLanguage = async (lang: Language) => {
    await saveLanguage(lang);
    setLanguageState(lang);
  };

  const t = (key: TranslationKey) => getTranslation(language, key);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
