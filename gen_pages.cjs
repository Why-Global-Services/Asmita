const fs = require('fs');
const path = require('path');
const base = 'c:/Users/WELCOME/Desktop/asmita frontend';

function write(rel, content) {
  const full = path.join(base, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('Written:', rel);
}

// ── app/products/[id]/ProductDetailsClient.jsx ──────────────────────────────
write('app/products/[id]/ProductDetailsClient.jsx', `"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import Loader from "@/components/common/Loader";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import { catalogService } from "@/services/catalogService";
import { useEnquiry } from "@/hooks/useEnquiry";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ProductDetailsClient({ id }) {
  const [product, setProduct] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const { openEnquiry } = useEnquiry();
  const { t } = useLanguage();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    catalogService
      .getProduct(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loader label={t("product_details.loading")} />;

  if (!product) {
    return (
      <>
        <PageHero title={t("product_details.not_found_title")} image="/images/heroes/products-tablets.jpeg" />
        <main className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 md:px-8">
          <EmptyState
            title={t("product_details.not_found_title")}
            message={t("product_details.not_found_msg")}
          />
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-block rounded-lg bg-[#79259c] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#621d80]"
            >
              {t("product_details.back_to_products")}
            </Link>
          </div>
        </main>
      </>
    );
  }

  const images =
    product.productImages && product.productImages.length > 0
      ? product.productImages
      : [];

  return (
    <>
      <PageHero title={product.name} image="/images/heroes/products-tablets.jpeg" />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-bold text-[#79259c] transition-colors hover:underline"
          >
            {t("product_details.back_to_products")}
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Product Images */}
          <div>
            <div className="grid h-[280px] place-items-center overflow-hidden rounded-2xl bg-[#faf2fc] text-7xl sm:h-[380px] sm:text-9xl border border-slate-100 shadow-sm">
              {images.length > 0 ? (
                <img
                  src={images[activeImgIndex] || images[0]}
                  alt={product.name}
                  className="h-full w-full object-contain p-4"
                />
              ) : (
                product.emoji || "💊"
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={"grid h-14 w-14 place-items-center overflow-hidden rounded-lg border p-1 sm:h-16 sm:w-16 transition " + (activeImgIndex === idx ? "border-[#79259c] bg-[#faf2fc] ring-2 ring-[#79259c]/20" : "border-slate-200 bg-slate-50 hover:border-slate-300")}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <section className="flex flex-col justify-start">
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <Link
                  href={"/products?category=" + encodeURIComponent(product.category)}
                  className="rounded-full bg-[#f6eefa] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#79259c] transition hover:bg-[#ebd5f4]"
                >
                  {product.category}
                </Link>
              )}
              {product.subcategory && (
                <Link
                  href={"/products?category=" + encodeURIComponent(product.category) + "&subcategory=" + encodeURIComponent(product.subcategory)}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  {product.subcategory}
                </Link>
              )}
            </div>

            <h1 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
              {product.description || t("product_details.default_description")}
            </p>

            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-bold tracking-widest text-[#79259c] uppercase">
                  {t("product_details.ingredients")}
                </h3>
                <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
                  {product.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.additionalInformation && (
              <div className="mt-5 rounded-lg bg-[#faf6fc] p-4 text-sm text-slate-700">
                <b className="block text-xs font-bold tracking-wider text-[#79259c] uppercase mb-1">
                  {t("product_details.additional_info")}
                </b>
                {product.additionalInformation}
              </div>
            )}

            <div className="mt-6 flex items-center gap-4 text-sm font-medium">
              <span className={product.inStock ? "text-emerald-600" : "text-amber-600"}>
                {product.inStock ? t("product_details.in_stock") : t("product_details.check_availability")}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-600">{t("product_details.fast_delivery")}</span>
            </div>

            <div className="mt-8">
              <Button
                className="w-full sm:w-auto px-8 py-3 text-base"
                onClick={() => openEnquiry(product)}
              >
                {t("product_details.enquiry_now")}
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
`);


// ── app/products/page.jsx ────────────────────────────────────────────────────
write('app/products/page.jsx', `"use client";

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
`);

// ── app/products/[id]/page.jsx (Server Component) ────────────────────────────
write('app/products/[id]/page.jsx', `import ProductDetailsClient from "./ProductDetailsClient";

export async function generateStaticParams() {
  try {
    const { catalogService } = await import("@/services/catalogService");
    const result = await catalogService.getProducts();
    return (result.items || []).map((p) => ({ id: String(p.id) }));
  } catch {
    return [];
  }
}

export default async function ProductDetailsPage({ params }) {
  const resolvedParams = await params;
  return <ProductDetailsClient id={resolvedParams?.id} />;
}
`);


// ── app/promotions/page.jsx ──────────────────────────────────────────────────
write('app/promotions/page.jsx', `"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import PromotionCard from "@/components/promotions/PromotionCard";
import Loader from "@/components/common/Loader";
import { catalogService } from "@/services/catalogService";
import { useLanguage } from "@/i18n/LanguageContext";

export default function PromotionsPage() {
  const [items, setItems] = useState();
  const { t } = useLanguage();

  useEffect(() => { catalogService.getPromotions().then(setItems); }, []);

  return (
    <>
      <PageHero title={t("promotions.hero_title")} subtitle={t("promotions.hero_sub")} image="/images/heroes/promotions-capsules.jpeg" />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-8 md:py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold tracking-widest text-[#79259c]">{t("promotions.eyebrow")}</p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl">{t("promotions.title")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 sm:text-base">{t("promotions.desc")}</p>
        </div>
        {!items ? (
          <Loader label={t("promotions.loading")} />
        ) : (
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((x) => <PromotionCard key={x.id} promotion={x} />)}
          </div>
        )}
      </section>
    </>
  );
}
`);

// ── app/promotion/page.jsx (alias) ───────────────────────────────────────────
write('app/promotion/page.jsx', `export { default } from "@/app/promotions/page";
`);

// ── app/new-arrivals/page.jsx ────────────────────────────────────────────────
write('app/new-arrivals/page.jsx', `"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import ProductCard from "@/components/products/ProductCard";
import Loader from "@/components/common/Loader";
import { catalogService } from "@/services/catalogService";
import { useLanguage } from "@/i18n/LanguageContext";

export default function NewArrivalsPage() {
  const [items, setItems] = useState();
  const { t } = useLanguage();

  useEffect(() => {
    catalogService.getProducts().then((x) => setItems(x.items.slice(0, 8)));
  }, []);

  return (
    <>
      <PageHero title={t("new_arrivals.hero_title")} subtitle={t("new_arrivals.hero_sub")} image="/images/heroes/new-arrivals-capsule.jpeg" />
      <section className="mx-auto mt-2 max-w-7xl px-4 py-10 sm:px-6 md:px-8 md:py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold tracking-widest text-[#79259c]">{t("new_arrivals.eyebrow")}</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">{t("new_arrivals.title")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 sm:text-base">{t("new_arrivals.desc")}</p>
        </div>
        {!items ? (
          <Loader label={t("new_arrivals.loading")} />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((x) => <ProductCard key={x.id} product={x} />)}
          </div>
        )}
      </section>
    </>
  );
}
`);

// ── app/events/page.jsx ──────────────────────────────────────────────────────
write('app/events/page.jsx', `"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import EventCard from "@/components/events/EventCard";
import Pagination from "@/components/common/Pagination";
import Loader from "@/components/common/Loader";
import { catalogService } from "@/services/catalogService";
import { useLanguage } from "@/i18n/LanguageContext";

export default function EventsPage() {
  const [items, setItems] = useState();
  const [typeKey, setTypeKey] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useLanguage();

  useEffect(() => { catalogService.getEvents().then(setItems); }, []);

  const eventTypeMap = [
    { key: "all", raw: "All Events", label: t("events.all_events") },
    { key: "camp", raw: "Health Camp", label: t("events.health_camp") },
    { key: "webinar", raw: "Webinar", label: t("events.webinar") },
    { key: "workshop", raw: "Workshop", label: t("events.workshop") },
    { key: "conf", raw: "Conference", label: t("events.conference") },
    { key: "awareness", raw: "Awareness Program", label: t("events.awareness_program") },
  ];

  const selectedItem = eventTypeMap.find((e) => e.key === typeKey) || eventTypeMap[0];
  const filtered = items?.filter((x) => selectedItem.key === "all" || x.type === selectedItem.raw);

  return (
    <>
      <PageHero title={t("events.hero_title")} subtitle={t("events.hero_sub")} image="/images/heroes/events-healthcare.jpeg" />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:px-8 lg:grid-cols-[220px_1fr]">
        <button
          className="flex w-full items-center justify-center rounded-lg border border-[#79259c] py-3 font-semibold text-[#79259c] transition hover:bg-[#79259c] hover:text-white lg:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? t("events.hide_filters") : t("events.show_filters")}
        </button>
        <aside className={"h-max rounded-xl border border-slate-200 p-5 " + (showFilters ? "block" : "hidden") + " lg:block"}>
          <h3 className="font-bold">{t("events.filter_title")}</h3>
          {eventTypeMap.map(({ key, label }) => (
            <label key={key} className="mt-3 flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                className="accent-[#79259c]"
                type="radio"
                name="event"
                checked={typeKey === key}
                onChange={() => { setTypeKey(key); setShowFilters(false); }}
              />
              {label}
            </label>
          ))}
          <button
            className="mt-6 w-full rounded-lg border border-[#79259c] py-2 text-sm font-bold text-[#79259c] transition hover:bg-[#79259c] hover:text-white"
            onClick={() => { setTypeKey("all"); setShowFilters(false); }}
          >
            {t("events.reset_filters")}
          </button>
        </aside>
        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#79259c]">{t("events.upcoming_events")}</h3>
              <small className="text-slate-500">{t("events.showing_events", { count: filtered?.length || 0 })}</small>
            </div>
            <select className="w-full rounded-md border border-slate-200 p-2 text-sm sm:w-auto">
              <option>{t("events.upcoming_sort")}</option>
            </select>
          </div>
          {!items ? (
            <Loader label={t("events.loading")} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {filtered.map((x) => <EventCard key={x.id} event={x} />)}
            </div>
          )}
          <div className="mt-8"><Pagination /></div>
        </section>
      </main>
    </>
  );
}
`);

// ── app/blog/page.jsx ────────────────────────────────────────────────────────
write('app/blog/page.jsx', `"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import BlogCard from "@/components/blog/BlogCard";
import Loader from "@/components/common/Loader";
import { catalogService } from "@/services/catalogService";
import { useLanguage } from "@/i18n/LanguageContext";

export default function BlogPage() {
  const [items, setItems] = useState();
  const { t } = useLanguage();

  useEffect(() => { catalogService.getBlogs().then(setItems); }, []);

  const categories = [
    t("blog.cat_healthcare"),
    t("blog.cat_equipment"),
    t("blog.cat_wellness"),
    t("blog.cat_nutrition"),
    t("blog.cat_news"),
  ];

  return (
    <>
      <PageHero title={t("blog.hero_title")} image="/images/heroes/blog-research.jpeg" />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:px-8 lg:grid-cols-[1fr_250px]">
        <section>
          <div className="mb-7">
            <p className="text-xs font-bold tracking-widest text-[#79259c]">{t("blog.eyebrow")}</p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl">{t("blog.title")}</h2>
          </div>
          {!items ? (
            <Loader label={t("blog.loading")} />
          ) : (
            <>
              {items[0] && (
                <article className="mb-7 rounded-xl bg-gradient-to-r from-[#f5e8f8] to-[#e4edf0] p-5 sm:p-7">
                  <small className="font-bold text-[#79259c]">{t("blog.featured_tag")}</small>
                  <h2 className="mt-3 max-w-xl font-serif text-2xl sm:text-3xl">{items[0].title}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">{items[0].excerpt}</p>
                  <Link className="mt-5 inline-block font-bold text-[#79259c] hover:underline" href={"/blog/" + items[0].id}>
                    {t("blog.read_featured")}
                  </Link>
                </article>
              )}
              <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                {items.map((x) => <BlogCard key={x.id} blog={x} />)}
              </div>
            </>
          )}
        </section>
        <aside className="h-max rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-[#79259c]">{t("blog.categories")}</h3>
          {categories.map((x) => (
            <a key={x} className="block border-b border-slate-100 py-3 text-sm transition-colors hover:text-[#79259c]">{x}</a>
          ))}
          <h3 className="mt-6 font-bold text-[#79259c]">{t("blog.latest_posts")}</h3>
          {items?.slice(0, 2).map((x) => (
            <div key={x.id} className="border-b border-slate-100 py-3">
              <p className="text-sm font-semibold">{x.title}</p>
              <small className="mt-1 block text-slate-500">May 10, 2026</small>
            </div>
          ))}
        </aside>
      </main>
    </>
  );
}
`);

// ── app/blog/[id]/BlogDetailsClient.jsx ───────────────────────────────────────
write('app/blog/[id]/BlogDetailsClient.jsx', `"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import BlogCard from "@/components/blog/BlogCard";
import { catalogService } from "@/services/catalogService";
import { date } from "@/utils/formatters";
import { useLanguage } from "@/i18n/LanguageContext";

export default function BlogDetailsClient({ id }) {
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    catalogService.getBlog(id)
      .then((data) => { setBlog(data); setLoading(false); })
      .catch(() => { setBlog(null); setLoading(false); });
    catalogService.getBlogs().then((blogs) => {
      if (Array.isArray(blogs)) setRecentBlogs(blogs.filter((b) => b.id !== id).slice(0, 3));
    });
  }, [id]);

  if (loading) return <Loader label={t("blog_details.loading")} />;

  if (!blog) {
    return (
      <>
        <PageHero title={t("blog_details.not_found_title")} image="/images/heroes/blog-research.jpeg" />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:px-8">
          <EmptyState title={t("blog_details.not_found_title")} message={t("blog_details.not_found_msg")} />
          <div className="mt-6 text-center">
            <Link href="/blog" className="inline-block rounded-lg bg-[#79259c] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#621d80]">
              {t("blog_details.return_listing")}
            </Link>
          </div>
        </main>
      </>
    );
  }

  const contentParagraphs = blog.content ? blog.content.split(/\\s*\\n\\s*/).filter(Boolean) : [];

  return (
    <>
      <PageHero title={blog.title} image="/images/heroes/blog-research.jpeg" />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <div className="mb-6">
          <Link href="/blog" className="inline-flex items-center text-sm font-bold text-[#79259c] transition-colors hover:underline">
            {t("blog_details.back_to_blog")}
          </Link>
        </div>
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <article className="min-w-0">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
              <span className="rounded-full bg-[#f5e8f8] px-3 py-1 text-[11px] tracking-wider text-[#79259c]">
                {blog.category ? blog.category.toUpperCase() : "HEALTHCARE"}
              </span>
              <span>•</span>
              <time>{date(blog.publishedAt)}</time>
              {blog.author && (<><span>•</span><span>By {blog.author}</span></>)}
            </div>
            <h1 className="mt-4 font-serif text-2xl font-bold leading-snug text-slate-900 sm:text-3xl md:text-4xl">{blog.title}</h1>
            {blog.coverImage ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                <img src={blog.coverImage} alt={blog.title} className="h-auto max-h-[460px] w-full object-cover" />
              </div>
            ) : (
              <div className="mt-6 grid h-48 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#e5eef2] to-[#d7c4df] text-7xl sm:h-64 sm:text-8xl md:h-80 md:text-9xl shadow-sm">
                {blog.emoji || "🩺"}
              </div>
            )}
            {blog.excerpt && (
              <div className="my-6 rounded-r-xl border-l-4 border-[#79259c] bg-[#fdf9fe] p-4 text-base font-medium leading-relaxed text-slate-700 sm:p-5 sm:text-lg">
                {blog.excerpt}
              </div>
            )}
            <div className="prose max-w-none text-slate-700">
              {contentParagraphs.length > 0 ? (
                contentParagraphs.map((para, idx) => (
                  <p key={idx} className="mt-4 text-base leading-7 sm:text-lg sm:leading-8">{para}</p>
                ))
              ) : (
                <p className="mt-4 text-base leading-7 sm:text-lg sm:leading-8">
                  {blog.content || blog.excerpt || "No content available for this article."}
                </p>
              )}
            </div>
          </article>
          <aside className="h-max rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#79259c]">{t("blog_details.recent_articles")}</h3>
            <div className="mt-4 flex flex-col divide-y divide-slate-100">
              {recentBlogs.length > 0 ? (
                recentBlogs.map((item) => (
                  <Link key={item.id} href={"/blog/" + item.id} className="group py-3 transition">
                    <p className="text-sm font-semibold text-slate-900 transition group-hover:text-[#79259c]">{item.title}</p>
                    <small className="mt-1 block text-slate-500">{date(item.publishedAt)}</small>
                  </Link>
                ))
              ) : (
                <p className="py-3 text-xs text-slate-500">{t("blog_details.no_other_articles")}</p>
              )}
            </div>
            <div className="mt-8 rounded-lg bg-[#fcf8fd] p-4 text-center">
              <h4 className="text-sm font-bold text-[#79259c]">{t("blog_details.need_assistance")}</h4>
              <p className="mt-1 text-xs text-slate-600">{t("blog_details.assistance_desc")}</p>
              <Link href="/contact" className="mt-3 inline-block rounded bg-[#79259c] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#621d80]">
                {t("blog_details.contact_us")}
              </Link>
            </div>
          </aside>
        </div>
        {recentBlogs.length > 0 && (
          <section className="mt-14 border-t border-slate-200 pt-10">
            <h2 className="font-serif text-2xl font-bold text-slate-900">{t("blog_details.more_insights")}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentBlogs.map((item) => <BlogCard key={item.id} blog={item} />)}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
`);

// ── app/blog/[id]/page.jsx (Server Component) ────────────────────────────────
write('app/blog/[id]/page.jsx', `import BlogDetailsClient from "./BlogDetailsClient";

export async function generateStaticParams() {
  try {
    const { catalogService } = await import("@/services/catalogService");
    const blogs = await catalogService.getBlogs();
    return (Array.isArray(blogs) ? blogs : []).map((b) => ({ id: String(b.id) }));
  } catch {
    return [];
  }
}

export default async function BlogDetailsPage({ params }) {
  const resolvedParams = await params;
  return <BlogDetailsClient id={resolvedParams?.id} />;
}
`);


// ── app/contact/page.jsx ─────────────────────────────────────────────────────
write('app/contact/page.jsx', `"use client";

import { useState } from "react";
import PageHero from "@/components/layout/PageHero";
import Button from "@/components/common/Button";
import { catalogService } from "@/services/catalogService";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phoneNumber: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { t } = useLanguage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      await catalogService.createContact(formData);
      setSent(true);
    } catch (err) {
      setErrorMsg(err.message || t("contact.error_default"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero title={t("contact.hero_title")} image="/images/heroes/contact-stethoscope.jpeg" />
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:gap-10 md:px-8 md:py-12">
        <section>
          <p className="text-xs font-bold tracking-widest text-[#79259c]">{t("contact.eyebrow")}</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">{t("contact.title")}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{t("contact.subtitle")}</p>
          <div className="mt-7 grid gap-4 text-sm text-slate-700">
            <p>☎ +244 923 456 789</p>
            <p>✉ info@asmitaangola.com</p>
            <p>⌖ Luanda, Angola</p>
            <p>◉ ♥ ◎ in</p>
          </div>
          <div className="mt-8 grid h-40 place-items-center rounded-xl bg-slate-100 text-center text-sm font-bold text-slate-500 sm:h-44">
            {t("contact.map_label")}
          </div>
        </section>
        <form className="grid gap-4 rounded-xl border border-slate-200 p-5 shadow-sm sm:p-6" onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-[#79259c]" required placeholder={t("contact.placeholder_name")} />
          <input name="email" value={formData.email} onChange={handleChange} className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-[#79259c]" required type="email" placeholder={t("contact.placeholder_email")} />
          <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-[#79259c]" placeholder={t("contact.placeholder_phone")} />
          <textarea name="message" value={formData.message} onChange={handleChange} className="min-h-28 rounded-lg border border-slate-200 p-3 outline-none focus:border-[#79259c] sm:min-h-32" required placeholder={t("contact.placeholder_message")} />
          {errorMsg && <p className="text-sm text-red-600 font-semibold">{errorMsg}</p>}
          {sent ? (
            <b className="rounded-lg bg-[#f7eafb] p-3 text-center text-[#79259c]">{t("contact.success_msg")}</b>
          ) : (
            <Button className="w-full sm:w-auto" type="submit" disabled={loading}>
              {loading ? t("contact.btn_sending") : t("contact.btn_send")}
            </Button>
          )}
        </form>
      </main>
    </>
  );
}
`);

// ── app/terms-and-conditions/page.jsx ────────────────────────────────────────
write('app/terms-and-conditions/page.jsx', `"use client";

import Breadcrumb from "@/components/common/Breadcrumb";
import { useLanguage } from "@/i18n/LanguageContext";

export default function TermsConditionsPage() {
  const { t } = useLanguage();

  const sections = [
    { id: "use-of-the-website", title: t("terms.sec1_title"), content: t("terms.sec1_content"), additional: t("terms.sec1_add") },
    { id: "intellectual-property", title: t("terms.sec2_title"), content: t("terms.sec2_content"), additional: t("terms.sec2_add") },
    { id: "product-information", title: t("terms.sec3_title"), content: t("terms.sec3_content"), additional: t("terms.sec3_add") },
    { id: "medical-disclaimer", title: t("terms.sec4_title"), content: t("terms.sec4_content"), additional: t("terms.sec4_add") },
    { id: "limitation-of-liability", title: t("terms.sec5_title"), content: t("terms.sec5_content"), additional: t("terms.sec5_add") },
    { id: "external-services", title: t("terms.sec6_title"), content: t("terms.sec6_content") },
    { id: "changes-to-these-terms", title: t("terms.sec7_title"), content: t("terms.sec7_content"), additional: t("terms.sec7_add") },
  ];

  const scrollToSection = (event, id) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="bg-[#fbf9fc]">
      <section className="overflow-hidden bg-gradient-to-br from-[#351044] via-[#5d197b] to-[#8d36aa] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
          <div className="[&_a]:!text-white/70 [&_a:hover]:!text-white [&_span]:!text-white/70">
            <Breadcrumb items={[{ label: t("terms.breadcrumb") }]} />
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#ead1f4]">{t("terms.eyebrow")}</p>
              <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{t("terms.hero_title")}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">{t("terms.hero_desc")}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/65">{t("terms.effective_date_label")}</p>
              <p className="mt-2 text-xl font-semibold">{t("terms.effective_date")}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
          <aside className="min-w-0 lg:sticky lg:top-28 lg:h-fit">
            <p className="text-xs font-bold tracking-[0.16em] text-[#79259c]">{t("terms.on_this_page")}</p>
            <nav className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-2 lg:grid lg:gap-1 lg:overflow-visible lg:border-l lg:border-[#e9d9ee] lg:pb-0">
              {sections.map(({ id, title }, index) => (
                <a
                  key={id}
                  href="/terms-and-conditions"
                  onClick={(event) => scrollToSection(event, id)}
                  className="shrink-0 rounded-full border border-[#eadced] bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-[#b76dce] hover:text-[#79259c] lg:rounded-none lg:border-0 lg:border-l-2 lg:border-transparent lg:bg-transparent lg:px-4 lg:py-2 lg:hover:border-[#79259c]"
                >
                  <span className="mr-2 text-xs font-bold text-[#a668be]">{String(index + 1).padStart(2, "0")}</span>
                  {title}
                </a>
              ))}
              <a
                href="/terms-and-conditions"
                onClick={(event) => scrollToSection(event, "contact-us")}
                className="shrink-0 rounded-full border border-[#eadced] bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-[#b76dce] hover:text-[#79259c] lg:rounded-none lg:border-0 lg:border-l-2 lg:border-transparent lg:bg-transparent lg:px-4 lg:py-2 lg:hover:border-[#79259c]"
              >
                <span className="mr-2 text-xs font-bold text-[#a668be]">08</span>
                {t("terms.contact_us_nav")}
              </a>
            </nav>
          </aside>
          <article className="min-w-0">
            <div className="rounded-3xl border border-[#eadced] bg-white p-6 shadow-[0_18px_50px_rgba(75,21,95,0.08)] sm:p-10 lg:p-12">
              <div className="border-b border-[#eee5f0] pb-8">
                <p className="text-sm font-bold tracking-[0.14em] text-[#79259c]">{t("terms.badge")}</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold text-[#371046] sm:text-4xl">{t("terms.title")}</h2>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{t("terms.intro")}</p>
              </div>
              <div className="divide-y divide-[#eee5f0]">
                {sections.map(({ id, title, content, additional }, index) => (
                  <section id={id} key={id} className="scroll-mt-28 py-9 first:pt-10 sm:py-11">
                    <div className="grid gap-3 sm:grid-cols-[52px_minmax(0,1fr)] sm:gap-5">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f6eefa] text-sm font-bold text-[#79259c]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h2 className="font-serif text-2xl font-semibold text-[#54206f] sm:text-3xl">{title}</h2>
                        <p className="mt-4 leading-8 text-slate-600">{content}</p>
                        {additional && <p className="mt-4 leading-8 text-slate-600">{additional}</p>}
                      </div>
                    </div>
                  </section>
                ))}
                <section id="contact-us" className="scroll-mt-28 py-10 sm:py-12">
                  <div className="grid gap-3 sm:grid-cols-[52px_minmax(0,1fr)] sm:gap-5">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f6eefa] text-sm font-bold text-[#79259c]">08</span>
                    <div>
                      <h2 className="font-serif text-2xl font-semibold text-[#54206f] sm:text-3xl">{t("terms.sec8_title")}</h2>
                      <p className="mt-4 leading-8 text-slate-600">{t("terms.sec8_content")}</p>
                      <address className="mt-5 rounded-2xl bg-[#faf5fc] p-5 not-italic leading-8 text-slate-600 sm:p-6">
                        <span className="font-semibold text-[#54206f]">Asmita - Comercio Geral, (SU), LDA</span>
                        <br />
                        Email: info@asmitaangola.com
                        <br />
                        Website: https://www.asmitaangola.com
                      </address>
                    </div>
                  </div>
                </section>
              </div>
              <p className="rounded-2xl bg-[#351044] px-6 py-5 text-sm leading-7 text-white/85 sm:text-base">{t("terms.closing")}</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
`);

// ── app/not-found.jsx ────────────────────────────────────────────────────────
write('app/not-found.jsx', `"use client";

import Link from "next/link";
import Button from "@/components/common/Button";
import { useLanguage } from "@/i18n/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <main className="grid min-h-[60vh] place-items-center px-4 py-10 text-center sm:min-h-[55vh] sm:px-6">
      <section className="mx-auto max-w-md">
        <p className="font-serif text-7xl font-bold text-[#79259c] sm:text-8xl">404</p>
        <h2 className="mt-4 text-xl font-bold sm:text-2xl">{t("not_found.title")}</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600 sm:text-base">{t("not_found.desc")}</p>
        <Link className="mt-8 inline-block w-full sm:mt-6 sm:w-auto" href="/">
          <Button>{t("not_found.back_home")}</Button>
        </Link>
      </section>
    </main>
  );
}
`);

console.log('All pages generated successfully!');