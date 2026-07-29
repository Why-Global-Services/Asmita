

export default function FilterSidebar({
  categories = [],
  filters = {},
  onChange,
}) {
  const set = (key, value) => onChange?.({ ...filters, [key]: value });

  const label =
    "flex cursor-pointer items-center gap-3 rounded-md py-2 text-sm text-slate-600 transition hover:bg-[#faf4fc]";

  const subcategories = [
    ...new Set(categories.flatMap((category) => category.subcategories || [])),
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
          {categories.map((category) => (
            <label className={label} key={category.id}>
              <input
                className="accent-[#79259c]"
                type="radio"
                name="category"
                checked={
                  filters.category === category.name ||
                  filters.category === category.id
                }
                onChange={() => set("category", category.name)}
              />
              {category.name}
            </label>
          ))}
        </div>

        {/* Sub Category */}
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

        {/* Price */}
        <b className="mt-5 block text-sm text-slate-900">Price Range</b>

        <div className="mt-2 grid gap-1">
          <label className={label}>
            <input
              className="accent-[#79259c]"
              type="radio"
              name="price"
              checked={filters.price === "under500"}
              onChange={() => set("price", "under500")}
            />
            Under ₹500
          </label>

          <label className={label}>
            <input
              className="accent-[#79259c]"
              type="radio"
              name="price"
              checked={filters.price === "over500"}
              onChange={() => set("price", "over500")}
            />
            ₹500 and above
          </label>
        </div>

        {/* Availability */}
        <b className="mt-5 block text-sm text-slate-900">Availability</b>

        <div className="mt-2">
          <label className={label}>
            <input
              className="accent-[#79259c]"
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => set("inStock", e.target.checked)}
            />
            In Stock
          </label>
        </div>

        {/* Rating */}
        <b className="mt-5 block text-sm text-slate-900">Rating</b>

        <div className="mt-2">
          <label className={label}>
            <input
              className="accent-[#79259c]"
              type="radio"
              name="rating"
              checked={filters.rating === 4}
              onChange={() => set("rating", 4)}
            />
            ★★★★ & above
          </label>
        </div>

        <button
          className="mt-6 w-full rounded-md border border-[#79259c] py-2.5 text-sm font-bold text-[#79259c] transition hover:bg-[#faf4fc]"
          onClick={() => onChange?.({})}
        >
          ↻ Reset Filters
        </button>
      </div>
    </aside>
  );
}