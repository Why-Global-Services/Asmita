import { useEffect, useMemo, useState } from "react";
import PageHero from "../components/layout/PageHero";
import FilterSidebar from "../components/products/FilterSidebar";
import ProductCard from "../components/products/ProductCard";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { catalogService } from "../services/catalogService";
import productsHeroImage from "../assets/images/heroes/products-tablets.jpeg";

export default function Products({ query = {} }) {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    category: query.category || "",
    subcategory: query.subcategory || "",
  });
  const [search, setSearch] = useState(query.search || "");
  const [sort, setSort] = useState("Popularity");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          product.category === filters.category ||
          product.categoryTitle === filters.category ||
          product.category.toLowerCase().replaceAll(" ", "-") ===
            filters.category) &&
        (!filters.subcategory ||
          product.subcategory === filters.subcategory ||
          product.subCategoryName === filters.subcategory ||
          product.subCategoryTitle === filters.subcategory)
    );

    return sort.includes("Low")
      ? a.sort((x, y) => x.price - y.price)
      : sort.includes("High")
      ? a.sort((x, y) => y.price - x.price)
      : a;
  }, [data, filters, search, sort]);
    const itemsPerPage = 8;

  const totalPages = Math.ceil(list.length / itemsPerPage);

  const paginatedProducts = list.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );


  return (
    <>
      <PageHero title="Products" image={productsHeroImage} />

      {!data ? (
        <Loader />
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:px-8">
          {/* Mobile filter toggle */}
          <button
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#79259c] py-2.5 text-sm font-bold text-[#79259c] transition hover:bg-[#faf4fc] lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? "✕ Hide Filters" : "⚙ Show Filters"}
          </button>

          <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
              <FilterSidebar
                categories={data.categories}
                filters={filters}
                onChange={(next) => {
                  setFilters(next);
                  setPage(1);
                  // Auto-close sidebar on mobile after filter selection
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
              />
            </div>

            <section>
              <h2 className="text-xl font-bold text-[#54206f]">
                Healthcare Products
              </h2>

              <div className="my-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <span className="text-sm text-slate-500">
                  Showing {list.length} products
                </span>

                <div className="w-full sm:ml-auto sm:w-64 md:w-72">
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
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}

              <div className="mt-8">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            </section>
          </div>
        </main>
      )}
    </>
  );
}
