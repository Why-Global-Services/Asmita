import { useEffect, useMemo, useState } from 'react';
import Hero from '../components/home/Hero';
import CategoryCard from '../components/home/CategoryCard';
import ProductCard from '../components/products/ProductCard';
import PromotionCard from '../components/promotions/PromotionCard';
import EventCard from '../components/events/EventCard';
import BlogCard from '../components/blog/BlogCard';
import TrustBar from '../components/layout/TrustBar';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import QuickView from '../components/products/QuickView';
import { catalogService } from '../services/catalogService';

const sectionTitle = (eyebrow, title, description) => (
  <div className="mx-auto max-w-xl text-center">
    <span className="text-xs font-bold tracking-widest text-[#79259c]">{eyebrow}</span>
    <h2 className="mt-2 font-serif text-3xl text-slate-900">{title}</h2>
    <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
  </div>
);

export default function Home() {
  const [data, setData] = useState(null);
  const [quickProduct, setQuickProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('New Arrivals');
  const [error, setError] = useState(false);

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

  if (error) return <EmptyState title="We could not load the home page" message="Please refresh and try again." />;
  if (!data) return <Loader label="Preparing your healthcare store..." />;

  return <main>
    <Hero />
    <TrustBar />

    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      {sectionTitle('EXPLORE WITH CONFIDENCE', 'Shop by Category', 'Everything you need for everyday care, in one trusted place.')}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {data.categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
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
      {sectionTitle('QUALITY CARE, NEWLY SELECTED', activeTab, 'Health essentials chosen to support your every day.')}
      <div
        className="mt-7 flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:flex-wrap sm:items-center"
        role="tablist"
        aria-label="Product groups"
      >
        <div className="flex gap-2">
          {['New Arrivals', 'Featured Products'].map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`rounded-md px-4 py-2 text-sm font-bold transition ${activeTab === tab
                  ? 'bg-[#79259c] text-white'
                  : 'bg-slate-100 text-slate-600'
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <a
          className="text-sm font-bold text-[#79259c] sm:ml-auto"
          href="#/products"
        >
          View All Products →
        </a>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {displayedProducts.map(product => <ProductCard key={product.id} product={product} onQuickView={setQuickProduct} />)}
      </div>
    </section>

    <section className="mx-auto mb-14 grid max-w-7xl gap-8 bg-[#fbf7fc] p-6 lg:grid-cols-2">
      <div>
        <div className="mb-5 flex items-end justify-between"><div><span className="text-xs font-bold tracking-widest text-[#79259c]">JOIN THE COMMUNITY</span><h2 className="font-serif text-2xl">Upcoming Events</h2></div><a className="text-xs font-bold text-[#79259c]" href="#/events">View All Events →</a></div>
        <div className="grid gap-4 sm:grid-cols-2">{data.events.slice(0, 2).map(event => <EventCard key={event.id} event={event} />)}</div>
      </div>
      <div>
        <div className="mb-5 flex items-end justify-between"><div><span className="text-xs font-bold tracking-widest text-[#79259c]">HEALTH INSIGHTS</span><h2 className="font-serif text-2xl">Latest from Blog</h2></div><a className="text-xs font-bold text-[#79259c]" href="#/blog">View All Blogs →</a></div>
        <div className="grid gap-4">{data.blogs.slice(0, 2).map(blog => <BlogCard key={blog.id} blog={blog} />)}</div>
      </div>
    </section>

    <TrustBar />
    <QuickView product={quickProduct} onClose={() => setQuickProduct(null)} />
  </main>;
}
