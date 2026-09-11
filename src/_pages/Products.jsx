import { useEffect, useMemo, useRef, useState } from "react";
import PageHero from "../components/layout/PageHero";
import FilterSidebar from "../components/products/FilterSidebar";
import ProductCard from "../components/products/ProductCard";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { catalogService } from "../services/catalogService";
import {
  getCategoryHeading,
  productMatchesCategory,
  productMatchesSubcategory,
} from "../utils/categoryNavigation";
import productsHeroImage from "../assets/images/heroes/products-tablets.jpeg";
import { useLanguage } from "../i18n/LanguageContext";

export default function Products({ query = {} }) {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    category: query.category || "",
    subcategory: query.subcategory || "",
  });
  const [search, setSearch] = useState(query.search || "");
  const [sortKey, setSortKey] = useState("popularity");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();

  const listingRef = useRef(null);

  useEffect(() => {
    setFilters({
      category: query.category || "",
      subcategory: query.subcategory || "",
    });
    setSearch(query.search || "");
    setPage(1);
  }, [query.category, query.subcategory, query.search]);

  useEffect(() => {
    Promise.all([
      catalogService.getProducts(),
      catalogService.getCategories(),
    ]).then(([products, categories]) =>
      setData({
        products: products.items,
        categories,
      })
    );
  }, []);

  const list = useMemo(() => {
    if (!data) return [];

    let a = data.products.filter(
      (product) =>
        (!search ||
          product.name.toLowerCase().includes(search.toLowerCase())) &&
        productMatchesCategory(product, filters.category) &&
        productMatchesSubcategory(product, filters.subcategory)
    );

    if (sortKey === "price_low") {
      return a.sort((x, y) => (x.price || 0) - (y.price || 0));
    }
    if (sortKey === "price_high") {
      return a.sort((x, y) => (y.price || 0) - (x.price || 0));
    }
    return a;
  }, [data, filters, search, sortKey]);

  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(list.length / itemsPerPage));

  const paginatedProducts = list.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const scrollToListingTop = (behavior = "smooth") => {
    if (listingRef.current) {
      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height : 80;
      const extraOffset = 16;
      const elementTop =
        listingRef.current.getBoundingClientRect().top + window.pageYOffset;
      const targetY = Math.max(0, elementTop - headerHeight - extraOffset);

      window.scrollTo({
        top: targetY,
        behavior,
      });
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    scrollToListingTop("smooth");
  };

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
    const params = new URLSearchParams();
    if (nextFilters.category) params.set("category", nextFilters.category);
    if (nextFilters.subcategory) params.set("subcategory", nextFilters.subcategory);
    if (search) params.set("search", search);

    const queryString = params.toString();
    const targetHash = queryString ? `/products?${queryString}` : "/products";
    if (location.hash !== `#${targetHash}`) {
      window.location.hash = targetHash;
    }
  };

  const headingText = useMemo(() => {
    if (!filters.category && !filters.subcategory) return t("products.all_heading");
    if (filters.category && filters.subcategory) {
      return `${filters.category} — ${filters.subcategory}`;
    }
    if (filters.category) {
      return getCategoryHeading(filters.category, data?.categories);
    }
    return t("products.products_heading", { name: filters.subcategory });
  }, [filters.category, filters.subcategory, data?.categories, t]);

  return (
    <>
      <PageHero title={t("products.hero_title")} image={productsHeroImage} />

      {!data ? (
        <Loader label={t("products.loading")} />
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:px-8">
          {/* Mobile filter toggle */}
          <button
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#79259c] py-2.5 text-sm font-bold text-[#79259c] transition hover:bg-[#faf4fc] lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? t("products.hide_filters") : t("products.show_filters")}
          </button>

          <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
              <FilterSidebar
                categories={data.categories}
                filters={filters}
                onChange={(next) => {
                  handleFilterChange(next);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
              />
            </div>

            <section id="products-listing-section" ref={listingRef}>
              <h2 className="text-xl font-bold text-[#54206f]">
                {headingText}
              </h2>

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
                    onSearch={(val) => {
                      setSearch(val);
                      setPage(1);
                    }}
                    placeholder={t("products.search_placeholder")}
                  />
                </div>

                <select
                  className="w-full rounded-md border border-slate-200 p-2 text-sm sm:w-auto"
                  value={sortKey}
                  onChange={(event) => setSortKey(event.target.value)}
                >
                  <option value="popularity">{t("products.sort_popularity")}</option>
                  <option value="price_low">{t("products.sort_price_low")}</option>
                  <option value="price_high">{t("products.sort_price_high")}</option>
                </select>
              </div>

              {list.length ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={t("products.no_products_title")}
                  message={t("products.no_products_msg")}
                />
              )}

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={handlePageChange}
                  />
                </div>
              )}
            </section>
          </div>
        </main>
      )}
    </>
  );
}
