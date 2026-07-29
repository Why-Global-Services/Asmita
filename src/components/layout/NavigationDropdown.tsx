


import { useState } from "react";

type Category = { id: string; name: string; subcategories?: string[] };
type NavigationDropdownProps = {
  label: string;
  categories: Category[];
  onNavigate?: () => void;
};

export default function NavigationDropdown({
  label,
  categories,
  onNavigate,
}: NavigationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  return (
    <div className="relative lg:py-4" onMouseLeave={() => setIsOpen(false)}>
      <button
        type="button"
        className="flex w-full items-center border-b border-slate-100 py-3 text-left text-sm font-bold text-slate-900 hover:text-[#79259c] lg:w-auto lg:border-0 lg:p-0"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        onMouseEnter={() => setIsOpen(true)}>
        {label}
        <small className="ml-1">⌄</small>
      </button>
      {isOpen && (
        <div className="lg:absolute lg:left-0 lg:top-full lg:z-50 lg:w-72 lg:rounded-md lg:border lg:border-slate-200 lg:bg-white lg:p-3 lg:shadow-lg">
          <p className="pt-2 text-[10px] font-bold tracking-widest text-[#8e699e] lg:px-2 lg:pt-0">
            CATEGORIES
          </p>
          <div className="mt-1 grid gap-1">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-md px-2 py-1.5 hover:bg-[#faf4fc]">
                <a
                  href={`#/products?category=${encodeURIComponent(category.name)}`}
                  onClick={close}
                  className="text-sm font-bold text-slate-800 hover:text-[#79259c]">
                  {category.name}
                </a>
                {!!category.subcategories?.length && (
                  <div className="mt-1 grid gap-1 border-l border-[#e8cfef] pl-3">
                    {category.subcategories.map((subcategory) => (
                      <a
                        key={subcategory}
                        href={`#/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory)}`}
                        onClick={close}
                        className="text-xs text-slate-600 hover:text-[#79259c]">
                        {subcategory}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
