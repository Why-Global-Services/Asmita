"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { catalogService } from "../../services/catalogService";
import { getCategoryRoute } from "../../utils/categoryNavigation";
import { useLanguage } from "../../i18n/LanguageContext";
import SearchBar from "./SearchBar";

const matches = (value, query) =>
  value.toLowerCase().includes(query.toLowerCase());

export default function HeaderSearch({ categories = [], onNavigate }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    catalogService
      .getProducts()
      .then((response) => setProducts(response.items || []));
  }, []);

  const results = useMemo(() => {
    const term = query.trim();

    if (!term) return [];

    const categoryMatches = (categories || [])
      .filter((category) => matches(category.name || category.categoryTitle || "", term))
      .map((category) => ({
        key: `category-${category.id || category._id}`,
        label: category.name || category.categoryTitle,
        meta: t("products.category"),
        href: getCategoryRoute(category),
      }));

    const subcategoryMatches = (categories || []).flatMap((category) =>
      (category.subcategories || [])
        .map((sub) => (typeof sub === "string" ? sub : sub?.name || sub?.subCategoryTitle))
        .filter(Boolean)
        .filter((subTitle) => matches(subTitle, term))
        .map((subTitle) => ({
          key: `subcategory-${category.id || category._id}-${subTitle}`,
          label: subTitle,
          meta: `${category.name || category.categoryTitle} • ${t("products.subcategory")}`,
          href: getCategoryRoute(category, subTitle),
        }))
    );

    const productMatches = (products || [])
      .filter((product) => matches(product.name || product.productTitle || "", term))
      .map((product) => ({
        key: `product-${product.id || product._id}`,
        label: product.name || product.productTitle,
        meta: product.category || t("products.product_singular"),
        href: `/products/${product.id || product._id}`,
      }));

    return [
      ...productMatches,
      ...categoryMatches,
      ...subcategoryMatches,
    ].slice(0, 8);
  }, [categories, products, query, t]);

  const close = () => {
    setFocused(false);
    setQuery("");
    onNavigate?.();
  };

  const submit = (term) => {
    const value = term.trim();

    if (!value) return;

    router.push(`/products?search=${encodeURIComponent(value)}`);
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
        placeholder={t("nav.search_placeholder")}
        className="w-full max-w-none"
      />

      {focused && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
          {results.length ? (
            results.map((result) => (
              <Link
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
              </Link>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-slate-500">
              {t("nav.search_no_results")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}