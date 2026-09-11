"use client";

import { Suspense } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageHero from "@/components/layout/PageHero";
import FilterSidebar from "@/components/products/FilterSidebar";
import ProductCard from "@/components/products/ProductCard";
import SearchBar from "@/components/common/SearchBar";
import Pagination from "@/components/common/Pagination";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import { catalogService } from "@/services/catalogService";
import { getCategoryHeading, productMatchesCategory, productMatchesSubcategory } from "@/utils/categoryNavigation";
import { useLanguage } from "@/i18n/LanguageContext";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    subcategory: searchParams.get("subcategory") || "",
  });
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sortKey, setSortKey] = useState("popularity");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const listingRef = useRef(null);

  useEffect(() => {
    setFilters({
      category: searchParams.get("category") || "",
      subcategory: searchParams.get("subcategory") || "",
    });
    setSearch(searchParams.get("search") || "");
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    Promise.all([catalogService.getProducts(), catalogService.getCategories()]).then(
      ([products, categories]) => setData({ products: products.items, categories })
    );
  }, []);

  const list = useMemo(() => {
    if (!data) return [];
    let a = data.products.filter(
      (p) =>
        (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
        productMatchesCategory(p, filters.category) &&
        productMatchesSubcategory(p, filters.subcategory)
    );
    if (sortKey === "price_low") return a.sort((x, y) => (x.price || 0) - (y.price || 0));
    if (sortKey === "price_high") return a.sort((x, y) => (y.price || 0) - (x.price || 0));
    return a;
  }, [data, filters, search, sortKey]);

  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(list.length / itemsPerPage));
  const paginatedProducts = list.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const scrollToTop = (behavior = "smooth") => {
    if (listingRef.current) {
      const header = document.querySelector("header");
      const hh = header ? header.getBoundingClientRect().height : 80;
      const top = listingRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: Math.max(0, top - hh - 16), behavior });
    }
  };

  const handlePageChange = (p) => { setPage(p); scrollToTop(); };

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
    const params = new URLSearchParams();
    if (nextFilters.category) params.set("category", nextFilters.category);
    if (nextFilters.subcategory) params.set("subcategory", nextFilters.subcategory);
    if (search) params.set("search", search);
    router.push("/products" + (params.toString() ? "?" + params.toString() : ""));
  };

  const headingText = useMemo(() => {
    if (!filters.category && !filters.subcategory) return t("products.all_heading");
    if (filters.category && filters.subcategory) return filters.category + " — " + filters.subcategory;
    if (filters.category) return getCategoryHeading(filters.category, data && data.categories);
    return t("products.products_heading", { name: filters.subcategory });
  }, [filters.category, filters.subcategory, data, t]);

  return (
    <>
      <PageHero title={t("products.hero_title")} image="/images/heroes/products-tablets.jpeg" />
      {!data ? (
        <Loader label={t("products.loading")} />
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:px-8">
          <button
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#79259c] py-2.5 text-sm font-bold text-[#79259c] transition hover:bg-[#faf4fc] lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? t("products.hide_filters") : t("products.show_filters")}
          </button>
          <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
            <div className={(sidebarOpen ? "block" : "hidden") + " lg:block"}>
              <FilterSidebar
                categories={data.categories}
                filters={filters}
                onChange={(next) => {
                  handleFilterChange(next);
                  if (typeof window !== "undefined" && window.innerWidth < 1024) setSidebarOpen(false);
                }}
              />
            </div>
            <section id="products-listing-section" ref={listingRef}>
              <h2 className="text-xl font-bold text-[#54206f]">{headingText}</h2>
              <div className="my-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <span className="text-sm text-slate-500">
                  {t("products.showing_products", {
                    count: list.length,
                    item: list.length === 1 ? t("products.product_singular") : t("products.product_plural"),
                  })}
                </span>
                <div className="w-full sm:ml-auto sm:w-64 md:w-72">
                  <SearchBar
                    value={search}
                    onSearch={(val) => { setSearch(val); setPage(1); }}
                    placeholder={t("products.search_placeholder")}
                  />
                </div>
                <select
                  className="w-full rounded-md border border-slate-200 p-2 text-sm sm:w-auto"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                >
                  <option value="popularity">{t("products.sort_popularity")}</option>
                  <option value="price_low">{t("products.sort_price_low")}</option>
                  <option value="price_high">{t("products.sort_price_high")}</option>
                </select>
              </div>
              {list.length ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <EmptyState title={t("products.no_products_title")} message={t("products.no_products_msg")} />
              )}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
                </div>
              )}
            </section>
          </div>
        </main>
      )}
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ProductsContent />
    </Suspense>
  );
}
