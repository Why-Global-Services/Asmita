import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import en from "./en.json";
import pt from "./pt.json";

const translations = { en, pt };
const STORAGE_KEY = "asmita_lang";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "pt") return saved;
    } catch {
      // Ignore localStorage errors
    }
    return "en";
  });

  const changeLanguage = useCallback((newLang) => {
    if (newLang === "en" || newLang === "pt") {
      setLang(newLang);
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
      } catch {
        // Ignore localStorage errors
      }
      document.documentElement.lang = newLang;
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (keyPath, params = {}) => {
      const keys = keyPath.split(".");
      let current = translations[lang] || translations.en;

      for (const k of keys) {
        if (current && typeof current === "object" && k in current) {
          current = current[k];
        } else {
          // Fallback to English if missing in selected language
          let fallback = translations.en;
          for (const fbKey of keys) {
            if (fallback && typeof fallback === "object" && fbKey in fallback) {
              fallback = fallback[fbKey];
            } else {
              return keyPath;
            }
          }
          current = fallback;
          break;
        }
      }

      if (typeof current !== "string") {
        return keyPath;
      }

      // Replace {{variable}} template strings
      let result = current;
      for (const [paramKey, paramVal] of Object.entries(params)) {
        result = result.replace(new RegExp(`{{${paramKey}}}`, "g"), String(paramVal));
      }

      return result;
    },
    [lang]
  );

  const value = useMemo(
    () => ({
      lang,
      setLanguage: changeLanguage,
      t,
    }),
    [lang, changeLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
