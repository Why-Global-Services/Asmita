import { useEffect, useState } from "react";
import PageHero from "../components/layout/PageHero";
import BlogCard from "../components/blog/BlogCard";
import Loader from "../components/common/Loader";
import { catalogService } from "../services/catalogService";

export default function Blog() {
  const [items, setItems] = useState();

  useEffect(() => {
    catalogService.getBlogs().then(setItems);
  }, []);

  return (
    <>
      <PageHero title="Health & Wellness Blog" />

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:px-8 lg:grid-cols-[1fr_250px]">
        {/* Blog Content */}
        <section>
          <div className="mb-7">
            <p className="text-xs font-bold tracking-widest text-[#79259c]">
              HEALTH INSIGHTS
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
              Latest Articles
            </h2>
          </div>

          {!items ? (
            <Loader />
          ) : (
            <>
              {/* Featured Article */}
              <article className="mb-7 rounded-xl bg-gradient-to-r from-[#f5e8f8] to-[#e4edf0] p-5 sm:p-7">
                <small className="font-bold text-[#79259c]">
                  FEATURED ARTICLE
                </small>

                <h2 className="mt-3 max-w-xl font-serif text-2xl sm:text-3xl">
                  {items[0].title}
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  {items[0].excerpt}
                </p>

                <a
                  className="mt-5 inline-block font-bold text-[#79259c]"
                  href={`#/blog/${items[0].id}`}
                >
                  Read Featured Story →
                </a>
              </article>

              {/* Blog Cards */}
              <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                {items.map((x) => (
                  <BlogCard key={x.id} blog={x} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Sidebar */}
        <aside className="h-max rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-[#79259c]">Categories</h3>

          {[
            "Healthcare",
            "Medical Equipment",
            "Wellness",
            "Nutrition",
            "News",
          ].map((x) => (
            <a
              key={x}
              className="block border-b border-slate-100 py-3 text-sm transition-colors hover:text-[#79259c]"
            >
              {x}
            </a>
          ))}

          <h3 className="mt-6 font-bold text-[#79259c]">
            Latest Posts
          </h3>

          {items?.slice(0, 2).map((x) => (
            <div
              key={x.id}
              className="border-b border-slate-100 py-3"
            >
              <p className="text-sm font-semibold">{x.title}</p>

              <small className="mt-1 block text-slate-500">
                May 10, 2026
              </small>
            </div>
          ))}
        </aside>
      </main>
    </>
  );
}