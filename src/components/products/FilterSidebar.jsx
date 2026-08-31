

import { isSameCategory } from "../../utils/categoryNavigation";

export default function FilterSidebar({
  categories = [],
  filters = {},
  onChange,
}) {
  const set = (key, value) => {
    if (filters[key] === value || (key === "category" && isSameCategory(filters.category, value))) {
      const next = { ...filters };
      delete next[key];
      onChange?.(next);
    } else {
      onChange?.({ ...filters, [key]: value });
    }
  };

  const label =
    "flex cursor-pointer items-center gap-3 rounded-md py-2 text-sm text-slate-600 transition hover:bg-[#faf4fc]";

  const activeCategories = filters.category
    ? categories.filter((c) => isSameCategory(c, filters.category))
    : categories;

  const rawSubcats = activeCategories.flatMap(
    (category) => category.subcategories || []
  );

  const subcategories = [
    ...new Set(
      rawSubcats
        .map((s) =>
          typeof s === "string"
            ? s
            : s?.subCategoryTitle || s?.name || s?.title
        )
        .filter(Boolean)
    ),
  ];

  return (
    <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white lg:sticky lg:top-24 lg:h-max">
      <h3 className="rounded-t-xl bg-gradient-to-r from-[#651b89] to-[#932db3] px-5 py-4 font-bold text-white">
        ⚙ Filters
      </h3>

      <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-5 lg:max-h-none">
        {/* Category */}
        <b className="text-sm text-slate-900">Category</b>

        <div className="mt-2 grid gap-1">
          {categories.map((category) => {
            const catLabel = category.name || category.categoryTitle;
            const isChecked = isSameCategory(filters.category, category);
            return (
              <label className={label} key={category.id || category._id || catLabel}>
                <input
                  className="accent-[#79259c]"
                  type="radio"
                  name="category"
                  checked={isChecked}
                  onChange={() => set("category", catLabel)}
                />
                {catLabel}
              </label>
            );
          })}
        </div>

        {/* Subcategory section temporarily disabled
        {subcategories.length > 0 && (
          <>
            <b className="mt-5 block text-sm text-slate-900">Sub-category</b>

            <div className="mt-2 grid gap-1">
              {subcategories.map((subcategory) => (
                <label className={label} key={subcategory}>
                  <input
                    className="accent-[#79259c]"
                    type="radio"
                    name="subcategory"
                    checked={filters.subcategory === subcategory}
                    onChange={() => set("subcategory", subcategory)}
                  />
                  {subcategory}
                </label>
              ))}
            </div>
          </>
        )}
        */}

        {(filters.category || filters.subcategory) && (
          <button
            className="mt-6 w-full rounded-md border border-[#79259c] py-2.5 text-sm font-bold text-[#79259c] transition hover:bg-[#faf4fc]"
            onClick={() => onChange?.({})}
          >
            ↻ Reset Filters
          </button>
        )}
      </div>
    </aside>
  );
}