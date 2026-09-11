import { useEffect, useMemo, useState } from 'react';
import Hero from '../components/home/Hero';
import ProductCard from '../components/products/ProductCard';
import PromotionCard from '../components/promotions/PromotionCard';
import EventCard from '../components/events/EventCard';
import BlogCard from '../components/blog/BlogCard';
import TrustBar from '../components/layout/TrustBar';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { catalogService } from '../services/catalogService';
import { getCategoryRoute, normalizeCategoryString } from '../utils/categoryNavigation';
import { useLanguage } from '../i18n/LanguageContext';

const sectionTitle = (eyebrow, title, description) => (
  <div className="mx-auto max-w-xl text-center">
    <span className="text-xs font-bold tracking-widest text-[#79259c]">{eyebrow}</span>
    <h2 className="mt-2 font-serif text-3xl text-slate-900">{title}</h2>
    <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
  </div>
);

export default function Home() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('New Arrivals');
  const [error, setError] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    let mounted = true;
    Promise.all([
      catalogService.getCategories(),
      catalogService.getProducts(),
      catalogService.getPromotions(),
      catalogService.getEvents(),
      catalogService.getBlogs(),
    ])
      .then(([categories, productResponse, promotions, events, blogs]) => {
        if (mounted) setData({ categories, products: productResponse.items, promotions, events, blogs });
      })
      .catch(() => mounted && setError(true));
    return () => { mounted = false; };
  }, []);

  const displayedProducts = useMemo(() => {
    if (!data) return [];
    return activeTab === 'Featured Products' ? data.products.slice(5, 10) : data.products.slice(0, 5);
  }, [activeTab, data]);

  const subcategories = useMemo(() => {
    if (!data) return [];

    const uniqueSubcategories = new Map();
    data.categories.forEach((category) => {
      (category.subcategories || []).forEach((rawSubcategory) => {
        const subcategory = typeof rawSubcategory === 'string'
          ? { name: rawSubcategory, subCategoryTitle: rawSubcategory }
          : rawSubcategory;
        const name = subcategory?.name || subcategory?.subCategoryTitle || subcategory?.title;
        if (!name) return;

        const key = subcategory.id || subcategory._id || normalizeCategoryString(name);
        if (!uniqueSubcategories.has(key)) {
          uniqueSubcategories.set(key, { category, subcategory: { ...subcategory, name } });
        }
      });
    });

    return Array.from(uniqueSubcategories.values());
  }, [data]);

  if (error) return <EmptyState title={t("home.error_title")} message={t("home.error_message")} />;
  if (!data) return <Loader label={t("home.loading_label")} />;

  const tabs = [
    { key: 'New Arrivals', label: t('home.tab_new_arrivals') },
    { key: 'Featured Products', label: t('home.tab_featured') },
  ];

  return (
    <main>
      <Hero />
      <TrustBar />

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        {sectionTitle(
          t('home.categories_eyebrow'),
          t('home.categories_title'),
          t('home.categories_desc')
        )}
        <div className="mt-10 grid grid-cols-2 justify-items-center gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-6">
          {subcategories.map(({ category, subcategory }) => {
            const imageSrc = subcategory.subCategoryImage || subcategory.image || subcategory.imageUrl;

            return (
              <a
                key={subcategory.id || subcategory._id || `${category.id}-${subcategory.name}`}
                href={`#${getCategoryRoute(category, subcategory)}`}
                className="group flex min-w-0 flex-col items-center text-center"
              >
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#faf2fc] ring-1 ring-[#79259c]/10 transition duration-200 group-hover:scale-105 group-hover:ring-[#79259c]/40 sm:h-24 sm:w-24">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={subcategory.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-[#79259c]" aria-hidden="true">
                      {subcategory.icon || '✦'}
                    </span>
                  )}
                </div>
                <span className="mt-3 max-w-28 text-sm font-semibold leading-5 text-slate-800 transition group-hover:text-[#79259c]">
                  {subcategory.name}
                </span>
              </a>
            );
          })}
        </div>
      </section>

      <section
        className="mx-auto grid max-w-7xl gap-4 px-5 sm:px-8 md:grid-cols-3"
        aria-label="Current promotions"
      >
        {data.promotions.map((promotion) => (
          <PromotionCard key={promotion.id} promotion={promotion} />
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8 md:py-16">
        {sectionTitle(
          t('home.selection_eyebrow'),
          activeTab === 'Featured Products' ? t('home.tab_featured') : t('home.tab_new_arrivals'),
          t('home.selection_desc')
        )}
        <div
          className="mt-7 flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:flex-wrap sm:items-center"
          role="tablist"
          aria-label="Product groups"
        >
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                className={`rounded-md px-4 py-2 text-sm font-bold transition ${
                  activeTab === tab.key
                    ? 'bg-[#79259c] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <a
            className="text-sm font-bold text-[#79259c] sm:ml-auto transition hover:underline"
            href="#/products"
          >
            {t('home.view_all_products')}
          </a>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {displayedProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="mx-auto mb-14 grid max-w-7xl gap-8 bg-[#fbf7fc] p-6 lg:grid-cols-2 rounded-2xl">
        <div>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#79259c]">
                {t('home.community_eyebrow')}
              </span>
              <h2 className="font-serif text-2xl">
                {t('home.upcoming_events')}
              </h2>
            </div>
            <a className="text-xs font-bold text-[#79259c] hover:underline" href="#/events">
              {t('home.view_all_events')}
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">{data.events.slice(0, 2).map(event => <EventCard key={event.id} event={event} />)}</div>
        </div>
        <div>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#79259c]">
                {t('home.insights_eyebrow')}
              </span>
              <h2 className="font-serif text-2xl">
                {t('home.latest_blog')}
              </h2>
            </div>
            <a className="text-xs font-bold text-[#79259c] hover:underline" href="#/blog">
              {t('home.view_all_blogs')}
            </a>
          </div>
          <div className="grid gap-4">{data.blogs.slice(0, 2).map(blog => <BlogCard key={blog.id} blog={blog} />)}</div>
        </div>
      </section>

      <TrustBar />
    </main>
  );
}
