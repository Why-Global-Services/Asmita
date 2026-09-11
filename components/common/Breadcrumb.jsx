"use client";

import Link from "next/link";
import { useLanguage } from "../../i18n/LanguageContext";

export default function Breadcrumb({ items = [], light = false }) {
  const { t } = useLanguage();
  const textColor = light ? "text-white/85" : "text-slate-600";
  const linkHover = light ? "hover:text-white" : "hover:text-[#79259c]";
  const separatorColor = light ? "text-white/60" : "text-[#a668be]";
  const currentColor = light ? "text-white" : "text-slate-800";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`mt-3 flex flex-wrap items-center gap-1 text-[11px] sm:gap-2 sm:text-xs ${textColor}`}
    >
      <Link
        className={`transition-colors ${linkHover}`}
        href="/"
      >
        {t("common.home_breadcrumb")}
      </Link>

      {items.map((item) => (
        <span
          key={item.label}
          className="flex items-center gap-1 sm:gap-2"
        >
          <span className={separatorColor}>/</span>

          {item.href ? (
            <Link
              className={`transition-colors ${linkHover}`}
              href={item.href.replace(/^#/, "")}
            >
              {item.label}
            </Link>
          ) : (
            <span className={`break-words font-semibold ${currentColor}`}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
