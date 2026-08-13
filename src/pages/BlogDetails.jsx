import { useEffect, useState } from "react";
import PageHero from "../components/layout/PageHero";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import BlogCard from "../components/blog/BlogCard";
import { catalogService } from "../services/catalogService";
import { date } from "../utils/formatters";

export default function BlogDetails({ id }) {
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    catalogService
      .getBlog(id)
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch(() => {
        setBlog(null);
        setLoading(false);
      });

    catalogService.getBlogs().then((blogs) => {
      if (Array.isArray(blogs)) {
        setRecentBlogs(blogs.filter((b) => b.id !== id).slice(0, 3));
      }
    });
  }, [id]);

  if (loading) {
    return <Loader label="Loading blog article..." />;
  }

  if (!blog) {
    return (
      <>
        <PageHero title="Blog Post Not Found" />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:px-8">
          <EmptyState
            title="Blog Article Not Found"
            message="The article you are looking for does not exist or may have been removed."
          />
          <div className="mt-6 text-center">
            <a
              href="#/blog"
              className="inline-block rounded-lg bg-[#79259c] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#621d80]"
            >
              ← Return to Blog Listing
            </a>
          </div>
        </main>
      </>
    );
  }

  // Split content by paragraphs if plain text with linebreaks
  const contentParagraphs = blog.content
    ? blog.content.split(/\n\s*\n/).filter(Boolean)
    : [];

  return (
    <>
      <PageHero title={blog.title} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        {/* Back Link */}
        <div className="mb-6">
          <a
            href="#/blog"
            className="inline-flex items-center text-sm font-bold text-[#79259c] transition-colors hover:underline"
          >
            ← Back to Blog
          </a>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          {/* Main Article Content */}
          <article className="min-w-0">
            {/* Meta header */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
              <span className="rounded-full bg-[#f5e8f8] px-3 py-1 text-[11px] tracking-wider text-[#79259c]">
                {blog.category ? blog.category.toUpperCase() : "HEALTHCARE"}
              </span>
              <span>•</span>
              <time>{date(blog.publishedAt)}</time>
              {blog.author && (
                <>
                  <span>•</span>
                  <span>By {blog.author}</span>
                </>
              )}
            </div>

            <h1 className="mt-4 font-serif text-2xl font-bold leading-snug text-slate-900 sm:text-3xl md:text-4xl">
              {blog.title}
            </h1>

            {/* Cover Image or Emoji Banner */}
            {blog.coverImage ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="h-auto max-h-[460px] w-full object-cover"
                />
              </div>
            ) : (
              <div className="mt-6 grid h-48 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#e5eef2] to-[#d7c4df] text-7xl sm:h-64 sm:text-8xl md:h-80 md:text-9xl shadow-sm">
                {blog.emoji || "🩺"}
              </div>
            )}

            {/* Excerpt callout */}
            {blog.excerpt && (
              <div className="my-6 rounded-r-xl border-l-4 border-[#79259c] bg-[#fdf9fe] p-4 text-base font-medium leading-relaxed text-slate-700 sm:p-5 sm:text-lg">
                {blog.excerpt}
              </div>
            )}

            {/* Main Body Paragraphs */}
            <div className="prose max-w-none text-slate-700">
              {contentParagraphs.length > 0 ? (
                contentParagraphs.map((para, idx) => (
                  <p key={idx} className="mt-4 text-base leading-7 sm:text-lg sm:leading-8">
                    {para}
                  </p>
                ))
              ) : (
                <p className="mt-4 text-base leading-7 sm:text-lg sm:leading-8">
                  {blog.content || blog.excerpt || "No content available for this article."}
                </p>
              )}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="h-max rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#79259c]">
              Recent Articles
            </h3>

            <div className="mt-4 flex flex-col divide-y divide-slate-100">
              {recentBlogs.length > 0 ? (
                recentBlogs.map((item) => (
                  <a
                    key={item.id}
                    href={`#/blog/${item.id}`}
                    className="group py-3 transition"
                  >
                    <p className="text-sm font-semibold text-slate-900 transition group-hover:text-[#79259c]">
                      {item.title}
                    </p>
                    <small className="mt-1 block text-slate-500">
                      {date(item.publishedAt)}
                    </small>
                  </a>
                ))
              ) : (
                <p className="py-3 text-xs text-slate-500">No other articles found.</p>
              )}
            </div>

            <div className="mt-8 rounded-lg bg-[#fcf8fd] p-4 text-center">
              <h4 className="text-sm font-bold text-[#79259c]">Need Assistance?</h4>
              <p className="mt-1 text-xs text-slate-600">
                Contact our healthcare team for personalized care advice.
              </p>
              <a
                href="#/contact"
                className="mt-3 inline-block rounded bg-[#79259c] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#621d80]"
              >
                Contact Us
              </a>
            </div>
          </aside>
        </div>

        {/* Related Articles Bottom Grid (Mobile/Tablet friendly) */}
        {recentBlogs.length > 0 && (
          <section className="mt-14 border-t border-slate-200 pt-10">
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              More Health Insights
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentBlogs.map((item) => (
                <BlogCard key={item.id} blog={item} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
