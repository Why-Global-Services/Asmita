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
          product.category.toLowerCase().replaceAll(" ", "-") ===
            filters.category) &&
        (!filters.subcategory ||
          product.subcategory === filters.subcategory) &&
        (!filters.inStock || product.inStock) &&
        (!filters.price ||
          (filters.price === "under500"
            ? product.price < 500
            : product.price >= 500)) &&
        (!filters.rating || product.rating >= filters.rating)
    );

    return sort.includes("Low")
      ? a.sort((x, y) => x.price - y.price)
      : sort.includes("High")
      ? a.sort((x, y) => y.price - x.price)
      : a;
  }, [data, filters, search, sort]);

  if (!data) return <Loader />;

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
          }}
        />

        <section>
          <h2 className="text-xl font-bold text-[#54206f]">
            Healthcare Products
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