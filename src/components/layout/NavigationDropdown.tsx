import { useState } from "react";
import { getCategoryRoute } from "../../utils/categoryNavigation";

type SubCategoryItem = {
  id?: string;
  _id?: string;
  name?: string;
  subCategoryTitle?: string;
};

type Category = {
  id: string;
  _id?: string;
  name: string;
  categoryTitle?: string;
  subcategories?: (SubCategoryItem | string)[];
};

type NavigationDropdownProps = {
  categories: Category[];
  onNavigate?: () => void;
};

export default function NavigationDropdown({
  categories,
  onNavigate,
}: NavigationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  const isDesktop = () =>
    window.matchMedia("(min-width: 1024px)").matches;

  const toggleOnTouch = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
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
      {/* Products Button */}
      <a
        href="#/products"
        className="flex w-full items-center border-b border-slate-100 py-3 text-left text-sm font-bold text-slate-900 hover:text-[#79259c] lg:w-auto lg:border-0 lg:p-0"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={toggleOnTouch}
      >
        Products
        <span className="ml-1 text-xs" aria-hidden="true">
          ⌄
        </span>
      </a>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-[0_14px_32px_rgba(31,41,55,0.14)] lg:absolute lg:left-0 lg:top-full lg:z-[60] lg:mt-0 lg:min-w-64 lg:max-h-[80vh] lg:overflow-y-auto"
          role="menu"
          aria-label="Product categories"
        >
          {/* Header */}
          <div className="mb-2 flex items-center justify-between border-b border-slate-100 px-2 pb-1.5">
            <p className="text-[10px] font-bold tracking-widest text-[#8e699e]">
              PRODUCT CATEGORIES
            </p>

            <a
              href="#/products"
              onClick={close}
              className="text-xs font-semibold text-[#79259c] hover:underline"
            >
              All Products
            </a>
          </div>

          {/* Categories */}
          <div className="grid gap-1">
            {categories.map((category) => {
              const catName =
                category.name || category.categoryTitle;

              const subcats = (category.subcategories || [])
                .map((sub) =>
                  typeof sub === "string"
                    ? sub
                    : sub?.name || sub?.subCategoryTitle
                )
                .filter(Boolean);

              return (
                <div
                  key={
                    category.id ||
                    category._id ||
                    catName
                  }
                  className="rounded-lg p-1 transition hover:bg-[#faf4fc]"
                >
                  {/* Category Name */}
                  <a
                    href={`#${getCategoryRoute(category)}`}
                    onClick={close}
                    role="menuitem"
                    className="flex items-center justify-between px-2 py-1.5 text-sm font-bold text-slate-800 hover:text-[#79259c] focus:outline-none"
                  >
                    <span>{catName}</span>
                  </a>

                  {/* Subcategories */}
                  {subcats.length > 0 && (
                    <div className="ml-3 flex flex-col gap-1 border-l-2 border-[#f0dcf5] pb-1 pl-2">
                      {subcats.map((subTitle) => (
                        <a
                          key={String(subTitle)}
                          href={`#${getCategoryRoute(
                            category,
                            String(subTitle)
                          )}`}
                          onClick={close}
                          className="block rounded px-2 py-1 text-xs text-slate-600 transition hover:bg-white hover:text-[#79259c] hover:font-semibold"
                        >
                          {subTitle}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading */}
            {!categories.length && (
              <p className="px-2 py-2 text-sm text-slate-500">
                Categories are loading…
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}