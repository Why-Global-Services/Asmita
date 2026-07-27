import { date } from "../../utils/formatters";
export default function BlogCard({ blog }) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid h-40 place-items-center rounded-lg bg-gradient-to-br from-[#e5eef2] to-[#d7c4df] text-7xl">
        {blog.emoji}
      </div>
      <small className="mt-4 block text-[10px] font-bold tracking-wider text-[#79259c]">
        {blog.category.toUpperCase()} • {date(blog.publishedAt)}
      </small>
      <h3 className="mt-2 text-lg font-bold text-slate-900">{blog.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{blog.excerpt}</p>
      <a
        className="mt-4 inline-block text-sm font-bold text-[#79259c] hover:underline"
        href={`#/blog/${blog.id}`}>
        Read More →
      </a>
    </article>
  );
}
