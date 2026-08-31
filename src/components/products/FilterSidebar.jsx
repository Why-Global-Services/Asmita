import { isSameCategory } from "../../utils/categoryNavigation";

export default function FilterSidebar({
  categories = [],
  filters = {},
  onChange,
}) {
  const handleCategorySelect = (category) => {
    const catLabel = category.name || category.categoryTitle;
    if (isSameCategory(filters.category, category)) {
      onChange?.({ ...filters, category: "", subcategory: "" });
    } else {
      onChange?.({ ...filters, category: catLabel, subcategory: "" });
    }
  };

  const handleSubcategorySelect = (subTitle) => {
    if (filters.subcategory === subTitle) {
      const next = { ...filters };
      delete next.subcategory;
      onChange?.(next);
    } else {
      onChange?.({ ...filters, subcategory: subTitle });
    }
  };

  const label =
    "flex cursor-pointer items-center gap-3 rounded-md py-2 px-2 text-sm text-slate-600 transition hover:bg-[#faf4fc]";

  const selectedCategoryObj = filters.category
    ? categories.find((c) => isSameCategory(c, filters.category))
    : null;

  const availableSubcategories = selectedCategoryObj
    ? (selectedCategoryObj.subcategories || [])
        .map((s) => (typeof s === "string" ? s : s?.subCategoryTitle || s?.name || s?.title))
        .filter(Boolean)
    : [];

  return (
    <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white lg:sticky lg:top-24 lg:h-max shadow-sm">
      <h3 className="rounded-t-xl bg-gradient-to-r from-[#651b89] to-[#932db3] px-5 py-4 font-bold text-white">
        ⚙ Filters
      </h3>

      <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-5 lg:max-h-none">
        {/* Category */}
        <div className="flex items-center justify-between">
          <b className="text-sm text-slate-900">Category</b>
          {filters.category && (
            <button
              onClick={() => onChange?.({ ...filters, category: "", subcategory: "" })}
              className="text-xs text-[#79259c] hover:underline font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-2 grid gap-1">
          {categories.map((category) => {
            const catLabel = category.name || category.categoryTitle;
            const isChecked = isSameCategory(filters.category, category);
            return (
              <label
                className={`${label} ${isChecked ? "bg-[#f8effb] font-semibold text-[#79259c]" : ""}`}
                key={category.id || category._id || catLabel}
              >
                <input
                  className="accent-[#79259c]"
                  type="radio"
                  name="category"
                  checked={isChecked}
                  onChange={() => handleCategorySelect(category)}
                  onClick={() => isChecked && handleCategorySelect(category)}
                />
                <span className="truncate">{catLabel}</span>
              </label>
            );
          })}
          {!categories.length && (
            <p className="py-2 text-xs text-slate-400">Loading categories...</p>
          )}
        </div>

        {/* Dynamic Subcategory section */}
        {availableSubcategories.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between">
              <b className="text-sm text-slate-900">Sub-category</b>
              {filters.subcategory && (
                <button
                  onClick={() => handleSubcategorySelect(filters.subcategory)}
                  className="text-xs text-[#79259c] hover:underline font-semibold"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="mt-2 grid gap-1">
              {availableSubcategories.map((subTitle) => {
                const isSubChecked = filters.subcategory === subTitle;
                return (
                  <label
                    className={`${label} ${isSubChecked ? "bg-[#f8effb] font-semibold text-[#79259c]" : ""}`}
                    key={subTitle}
                  >
                    <input
                      className="accent-[#79259c]"
                      type="radio"
                      name="subcategory"
                      checked={isSubChecked}
                      onChange={() => handleSubcategorySelect(subTitle)}
                      onClick={() => isSubChecked && handleSubcategorySelect(subTitle)}
                    />
                    <span className="truncate">{subTitle}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {(filters.category || filters.subcategory) && (
          <button
            className="mt-6 w-full rounded-md border border-[#79259c] py-2.5 text-sm font-bold text-[#79259c] transition hover:bg-[#faf4fc]"
            onClick={() => onChange?.({})}
          >
            ↻ Reset All Filters
          </button>
        )}
      </div>
    </aside>
  );
}