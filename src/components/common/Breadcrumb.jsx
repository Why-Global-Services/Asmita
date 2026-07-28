export default function Breadcrumb({ items = [] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mt-3 flex flex-wrap items-center gap-1 text-[11px] text-slate-600 sm:gap-2 sm:text-xs"
    >
      <a
        className="transition-colors hover:text-[#79259c]"
        href="#/"
      >
        Home
      </a>

      {items.map((item) => (
        <span
          key={item.label}
          className="flex items-center gap-1 sm:gap-2"
        >
          <span className="text-[#a668be]">/</span>

          {item.href ? (
            <a
              className="transition-colors hover:text-[#79259c]"
              href={item.href}
            >
              {item.label}
            </a>
          ) : (
            <span className="font-semibold text-slate-800 break-words">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}