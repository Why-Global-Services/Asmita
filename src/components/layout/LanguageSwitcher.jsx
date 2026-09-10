import { useLanguage } from "../../i18n/LanguageContext";

export default function LanguageSwitcher({ className = "" }) {
  const { lang, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-full bg-white/15 p-0.5 backdrop-blur-sm ring-1 ring-white/25 ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={lang === "en"}
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-all duration-200 ${
          lang === "en"
            ? "bg-white text-[#5d197b] shadow-sm"
            : "text-white/80 hover:text-white"
        }`}
      >
        <span className="text-[11px]" aria-hidden="true">🇬🇧</span>
        <span>EN</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage("pt")}
        aria-pressed={lang === "pt"}
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-all duration-200 ${
          lang === "pt"
            ? "bg-white text-[#5d197b] shadow-sm"
            : "text-white/80 hover:text-white"
        }`}
      >
        <span className="text-[11px]" aria-hidden="true">🇦🇴</span>
        <span>PT</span>
      </button>
    </div>
  );
}
