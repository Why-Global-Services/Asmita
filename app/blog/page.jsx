"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PageHero from "@/components/layout/PageHero";
import BlogCard from "@/components/blog/BlogCard";
import Loader from "@/components/common/Loader";
import BlogDetailsClient from "@/app/blog/[id]/BlogDetailsClient";
import { catalogService } from "@/services/catalogService";
import { useLanguage } from "@/i18n/LanguageContext";

function BlogContent() {
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");
  const [items, setItems] = useState();
  const { t } = useLanguage();

  useEffect(() => { catalogService.getBlogs().then(setItems); }, []);

  if (blogId) {
    return <BlogDetailsClient id={blogId} />;
  }

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
                  <Link className="mt-5 inline-block font-bold text-[#79259c] hover:underline" href={"/blog?id=" + encodeURIComponent(items[0].id)}>
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

export default function BlogPage() {
  return (
    <Suspense fallback={<Loader />}>
      <BlogContent />
    </Suspense>
  );
}
