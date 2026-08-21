



import { useEffect, useState } from "react";
import AsmitaLogo from "./AsmitaLogo";
import NavigationDropdown from "./NavigationDropdown";
import HeaderSearch from "../common/HeaderSearch";
import { catalogService } from "../../services/catalogService";

const links = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Products", "/products"],
  ["Promotion", "/promotions"],
  ["New Arrivals", "/new-arrivals"],
  ["Events", "/events"],
  ["Blog", "/blog"],
  ["Contact Us", "/contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    catalogService.getCategories().then(setCategories);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      {/* Top Bar - Desktop Only */}
      <div className="hidden bg-gradient-to-r from-[#5d197b] to-[#8625a7] px-5 py-3 text-sm text-white md:flex md:justify-between">
        <span>♧ High Quality Medical Products</span>
        <span>◔ 24/7 Customer Support</span>
        <span className="">◉ ♥ ◎ in</span>
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-4 sm:h-[80px] sm:px-6 lg:h-[92px] lg:px-8">

          {/* Logo */}
          <AsmitaLogo />

          {/* Mobile Menu Button */}
          <button
            className="ml-auto rounded-md p-2 text-2xl text-[#79259c] transition hover:bg-[#faf4fc] lg:hidden"
            aria-label="Toggle navigation"
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
              name === "Products" ? (
                <NavigationDropdown
                  key={name}
                  categories={categories}
                  onNavigate={close}
                />
              ) : (
                <a
                  key={path}
                  href={"#" + path}
                  onClick={close}
                  className="block border-b border-slate-100 py-3 text-base font-semibold text-slate-800 transition hover:text-[#79259c] lg:border-0 lg:p-0 lg:text-sm lg:font-bold"
                >
                  {name}
                  {/* {name === "Products" && (
                    <small className="ml-1">⌄</small>
                  )} */}
                </a>
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
