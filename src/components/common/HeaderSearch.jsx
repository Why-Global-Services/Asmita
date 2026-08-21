import { useEffect, useMemo, useState } from "react";
import { catalogService } from "../../services/catalogService";
import { getCategoryRoute } from "../../utils/categoryNavigation";
import SearchBar from "./SearchBar";

const matches = (value, query) =>
  value.toLowerCase().includes(query.toLowerCase());

export default function HeaderSearch({ categories, onNavigate }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    catalogService
      .getProducts()
      .then((response) => setProducts(response.items));
  }, []);

  const results = useMemo(() => {
    const term = query.trim();

    if (!term) return [];

    const categoryMatches = categories
      .filter((category) => matches(category.name, term))
      .map((category) => ({
        key: `category-${category.id}`,
        label: category.name,
        meta: "Category",
        href: `#${getCategoryRoute(category)}`,
      }));

    const subcategoryMatches = categories.flatMap((category) =>
      (category.subcategories || [])
        .filter((subcategory) => matches(subcategory, term))
        .map((subcategory) => ({
          key: `subcategory-${category.id}-${subcategory}`,
          label: subcategory,
          meta: category.name,
          href: `#${getCategoryRoute(category, subcategory)}`,
        }))
    );

    const productMatches = products
      .filter((product) => matches(product.name, term))
      .map((product) => ({
        key: `product-${product.id}`,
        label: product.name,
        meta: product.category,
        href: `#/products/${product.id}`,
      }));

    return [
      ...productMatches,
      ...categoryMatches,
      ...subcategoryMatches,
    ].slice(0, 7);
  }, [categories, products, query]);

  const close = () => {
    setFocused(false);
    setQuery("");
    onNavigate?.();
  };

  const submit = (term) => {
    const value = term.trim();

    if (!value) return;

    window.location.hash = `/products?search=${encodeURIComponent(value)}`;
    close();
  };

  return (
    <div className="relative w-full">
      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={submit}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        placeholder="Search products"
        className="w-full max-w-none"
      />

      {focused && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
          {results.length ? (
            results.map((result) => (
              <a
                key={result.key}
                href={result.href}
                onClick={close}
                className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 transition-colors hover:bg-[#faf4fc] last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {result.label}
                  </p>

                  <p className="mt-1 text-xs text-[#79259c] sm:hidden">
                    {result.meta}
                  </p>
                </div>

                <small className="hidden shrink-0 text-xs text-[#79259c] sm:block">
                  {result.meta}
                </small>
              </a>
            ))
          ) : (
            <p className="px-4 py-4 text-sm text-slate-500">
              No matching products, categories, or subcategories.
            </p>
          )}
        </div>
      )}
    </div>
  );
}