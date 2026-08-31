



import { useState } from "react";

export default function NavigationDropdown({
  label,
  categories,
  onNavigate,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  return (
    <div
      className="relative lg:py-4"
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex w-full items-center justify-between border-b border-slate-100 py-3 text-left text-base font-semibold text-slate-900 transition hover:text-[#79259c] lg:w-auto lg:justify-start lg:border-0 lg:p-0 lg:text-sm lg:font-bold"
      >
        <span>{label}</span>

        <small
          className={`ml-2 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ⌄
        </small>
      </button>

      {isOpen && (
        <div
          className="
            mt-2 rounded-lg bg-[#fafbfd]
            lg:absolute lg:left-0 lg:top-full lg:z-50
            lg:mt-0 lg:w-72 lg:rounded-md
            lg:border lg:border-slate-200
            lg:bg-white lg:p-3 lg:shadow-lg
          "
        >
          <p className="px-3 pt-3 text-[10px] font-bold tracking-widest text-[#8e699e] lg:px-2 lg:pt-0">
            CATEGORIES
          </p>

          <div className="mt-2 grid gap-1 lg:mt-1">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-md px-3 py-2 transition hover:bg-[#faf4fc] lg:px-2 lg:py-1.5"
              >
                <a
                  href={`#/products?category=${encodeURIComponent(
                    category.name
                  )}`}
                  onClick={close}
                  className="block text-sm font-bold text-slate-800 hover:text-[#79259c]"
                >
                  {category.name}
                </a>

                {/* Subcategory dropdown list temporarily disabled
                {!!category.subcategories?.length && (
                  <div className="mt-2 ml-2 grid gap-1 border-l border-[#e8cfef] pl-3">
                    {category.subcategories.map((subcategory) => (
                      <a
                        key={subcategory}
                        href={`#/products?category=${encodeURIComponent(
                          category.name
                        )}&subcategory=${encodeURIComponent(subcategory)}`}
                        onClick={close}
                        className="block py-1 text-xs text-slate-600 transition hover:text-[#79259c]"
                      >
                        {subcategory}
                      </a>
                    ))}
                  </div>
                )}
                */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}