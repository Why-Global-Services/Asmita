


import { useState } from "react";
import { getCategoryRoute } from "../../utils/categoryNavigation";

type Category = { id: string; name: string };
type NavigationDropdownProps = { categories: Category[]; onNavigate?: () => void };

export default function NavigationDropdown({ categories, onNavigate }: NavigationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => {
    setIsOpen(false);
    onNavigate?.();
  };
  const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;
  const toggleOnTouch = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDesktop()) return;
    event.preventDefault();
    setIsOpen((current) => !current);
  };

  return (
    <div
      className="relative lg:py-4"
      onMouseEnter={() => isDesktop() && setIsOpen(true)}
      onMouseLeave={() => isDesktop() && setIsOpen(false)}
    >
      <a
        href="#/products"
        className="flex w-full items-center border-b border-slate-100 py-3 text-left text-sm font-bold text-slate-900 hover:text-[#79259c] lg:w-auto lg:border-0 lg:p-0"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={toggleOnTouch}>
        Products <span className="ml-1 text-xs" aria-hidden="true">⌄</span>
      </a>
      {isOpen && (
        <div className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-[0_14px_32px_rgba(31,41,55,0.14)] lg:absolute lg:left-0 lg:top-full lg:z-[60] lg:mt-0 lg:min-w-60 lg:w-64" role="menu" aria-label="Product categories">
          <p className="px-2 text-[10px] font-bold tracking-widest text-[#8e699e]">
            PRODUCT CATEGORIES
          </p>
          <div className="mt-3 grid gap-1.5">
            {categories.slice(0, 4).map((category) => (
              <a
                key={category.id}
                href={`#${getCategoryRoute(category)}`}
                onClick={close}
                role="menuitem"
                className="whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-bold text-slate-800 transition hover:bg-[#faf4fc] hover:text-[#79259c] focus:bg-[#faf4fc] focus:outline-none">
                <span className="block">{category.name}</span>
              </a>
            ))}
            {!categories.length && <p className="px-2 py-2 text-sm text-slate-500">Categories are loading…</p>}
          </div>
        </div>
      )}
    </div>
  );
}
