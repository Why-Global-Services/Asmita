export default function EmptyState({
  title = "Nothing found",
  message = "Try changing your filters or search term.",
}) {
  return (
    <div className="rounded-xl border border-dashed border-[#d9bce5] bg-[#fdf9fe] px-4 py-12 text-center sm:px-6 sm:py-16">
      <b className="text-4xl text-[#79259c] sm:text-5xl">⌕</b>

      <h3 className="mt-3 text-base font-bold text-slate-900 sm:text-lg">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {message}
      </p>
    </div>
  );
}