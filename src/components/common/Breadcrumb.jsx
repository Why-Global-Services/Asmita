export default function Breadcrumb({ items = [] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
      <a className="hover:text-[#79259c]" href="#/">
        Home
      </a>
      {items.map((item) => (
        <span className="flex items-center gap-2" key={item.label}>
          <b className="font-normal text-[#a668be]">/</b>
          {item.href ? (
            <a className="hover:text-[#79259c]" href={item.href}>
              {item.label}
            </a>
          ) : (
            <span className="font-semibold text-slate-800">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
