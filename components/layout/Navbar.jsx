"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AsmitaLogo from "./AsmitaLogo";
import NavigationDropdown from "./NavigationDropdown";
import HeaderSearch from "../common/HeaderSearch";
import LanguageSwitcher from "./LanguageSwitcher";
import { catalogService } from "../../services/catalogService";
import { useLanguage } from "../../i18n/LanguageContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    catalogService.getCategories().then(setCategories);
  }, []);

  const close = () => setOpen(false);

  const links = [
    [t("nav.home"), "/"],
    [t("nav.about"), "/about"],
    [t("nav.products"), "/products"],
    [t("nav.promotion"), "/promotions"],
    [t("nav.new_arrivals"), "/new-arrivals"],
    [t("nav.events"), "/events"],
    [t("nav.blog"), "/blog"],
    [t("nav.contact"), "/contact"],
  ];

  return (
    <>
      {/* Top Bar with Language Selector at the TOP of the website */}
      <div className="bg-gradient-to-r from-[#5d197b] via-[#6f1d93] to-[#8625a7] px-4 py-2 text-xs text-white sm:px-6 sm:py-2.5 sm:text-sm shadow-inner">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium tracking-wide">
              {t("nav.topbar_quality")}
            </span>
            <span className="hidden md:inline text-white/40">|</span>
            <span className="hidden md:inline text-white/90">
              {t("nav.topbar_support")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden lg:inline text-xs text-white/75">Language:</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-4 sm:h-[80px] sm:px-6 lg:h-[92px] lg:px-8">
          {/* Logo */}
          <AsmitaLogo />

          {/* Mobile Menu Button */}
          <button
            className="ml-auto rounded-md p-2 text-2xl text-[#79259c] transition hover:bg-[#faf4fc] lg:hidden"
            aria-label={t("nav.toggle_nav")}
            onClick={() => setOpen(!open)}
          >
            {open ? "×" : "☰"}
          </button>

          {/* Navigation */}
          <nav
            className={`${
              open
                ? "absolute left-0 right-0 top-[72px] max-h-[calc(100vh-72px)] overflow-y-auto border-y border-slate-200 bg-white px-5 py-5 shadow-xl sm:top-[80px]"
                : "hidden"
            } lg:static lg:ml-auto lg:flex lg:items-center lg:gap-3 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:overflow-visible xl:gap-6`}
          >
            {links.map(([name, path]) =>
              path === "/products" ? (
                <NavigationDropdown
                  key={path}
                  categories={categories}
                  onNavigate={close}
                />
              ) : (
                <Link
                  key={path}
                  href={path}
                  onClick={close}
                  className="block border-b border-slate-100 py-3 text-base font-semibold text-slate-800 transition hover:text-[#79259c] lg:border-0 lg:p-0 lg:text-sm lg:font-bold"
                >
                  {name}
                </Link>
              )
            )}

            {/* Mobile Search */}
            <div className="mt-5 lg:hidden">
              <HeaderSearch
                categories={categories}
                onNavigate={close}
              />
            </div>
          </nav>

          {/* Desktop Search */}
          <div className="ml-4 hidden w-44 lg:block xl:w-52">
            <HeaderSearch categories={categories} />
          </div>
        </div>
      </header>
    </>
  );
}
