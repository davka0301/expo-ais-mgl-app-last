// languageContext.tsx
import React, { createContext, ReactNode, useState, useContext } from "react";

type Language = "EN" | "MN";

interface LanguageContextProps {
  language: Language;
  toggleLanguage: () => void;
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: "EN",
  toggleLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("EN");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "EN" ? "MN" : "EN"));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// custom hook for easy use
export const useLanguage = () => useContext(LanguageContext);
