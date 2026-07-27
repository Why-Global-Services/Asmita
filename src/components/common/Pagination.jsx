export default function Pagination({
  page = 1,
  totalPages = 4,
  onChange,
}) {
  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-2 px-4"
    >
      <button
        className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 transition hover:bg-[#faf4fc]"
        onClick={() => onChange?.(Math.max(1, page - 1))}
      >
        ‹
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={`flex h-10 min-w-[40px] items-center justify-center rounded-md border text-sm font-medium transition ${
            page === i + 1
              ? "border-[#79259c] bg-[#79259c] text-white"
              : "border-slate-200 hover:bg-[#faf4fc]"
          }`}
          onClick={() => onChange?.(i + 1)}
        >
          {i + 1}
        </button>
      ))}

      <button
        className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 transition hover:bg-[#faf4fc]"
        onClick={() => onChange?.(Math.min(totalPages, page + 1))}
      >
        ›
      </button>
    </nav>
  );
}