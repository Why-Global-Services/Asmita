import { useEffect, useMemo, useState } from "react";
import PageHero from "../components/layout/PageHero";
import FilterSidebar from "../components/products/FilterSidebar";
import ProductCard from "../components/products/ProductCard";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import QuickView from "../components/products/QuickView";
import { catalogService } from "../services/catalogService";
import {
  categoryProductSectionId,
  getCategoryHeading,
  getCategoryRoute,
  productMatchesCategory,
  productMatchesSubcategory,
  scrollToCategorySection,
} from "../utils/categoryNavigation";

export default function Products({ query = {} }) {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    category: query.category || "",
    subcategory: query.subcategory || "",
  });
  const [search, setSearch] = useState(query.search || "");
  const [sort, setSort] = useState("Popularity");
  const [quick, setQuick] = useState(null);
  const [page, setPage] = useState(1);

  // Synchronize state when query prop changes (e.g. from Navbar dropdown or external navigation)
  useEffect(() => {
    setFilters({
      category: query.category || "",
      subcategory: query.subcategory || "",
    });
    setSearch(query.search || "");
    setPage(1);
  }, [query.category, query.subcategory, query.search]);

  const updateCategoryRoute = (nextFilters) => {
    const nextPath = getCategoryRoute(
      nextFilters.category,
      nextFilters.subcategory
    );
    if (location.hash.replace(/^#/, "") !== nextPath) {
      location.hash = nextPath;
    }
  };

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
        (!filters.category ||
          productMatchesCategory(product, filters.category)) &&
        (!filters.subcategory ||
          productMatchesSubcategory(product, filters.subcategory))
    );

    return sort.includes("Low")
      ? a.sort((x, y) => x.price - y.price)
      : sort.includes("High")
      ? a.sort((x, y) => y.price - x.price)
      : a;
  }, [data, filters.category, filters.subcategory, search, sort]);

  useEffect(() => {
    if (!data || !filters.category) return;
    const rafId = requestAnimationFrame(() => {
      scrollToCategorySection(filters.category, "smooth");
    });
    return () => cancelAnimationFrame(rafId);
  }, [data, filters.category, filters.subcategory]);

  if (!data) return <Loader />;

  const categoryHeading = getCategoryHeading(filters.category, data.categories);

  return (
    <>
      <PageHero title="Products" />

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:px-8 lg:grid-cols-[250px_1fr]">
        <FilterSidebar
          categories={data.categories}
          filters={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
            updateCategoryRoute(next);
          }}
        />

        <section
          id={categoryProductSectionId(filters.category)}
          data-category-product-section
          className="scroll-mt-24 sm:scroll-mt-28 lg:scroll-mt-32"
        >
          <h2 className="text-xl font-bold text-[#54206f]">
            {categoryHeading}
          </h2>

          <div className="my-5 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <span className="text-sm text-slate-500">
              Showing {list.length} products
            </span>

            <div className="w-full sm:ml-auto sm:w-72">
              <SearchBar
                onSearch={setSearch}
                placeholder="Search products"
              />
            </div>

            <select
              className="w-full rounded-md border border-slate-200 p-2 text-sm sm:w-auto"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {list.length ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {list.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuick}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}

          <div className="mt-8">
            <Pagination page={page} onChange={setPage} />
          </div>
        </section>
      </main>

      <QuickView
        product={quick}
        onClose={() => setQuick(null)}
      />
    </>
  );
}
