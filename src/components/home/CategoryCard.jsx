export default function CategoryCard({ category }) {
  return (
    <a
      className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-xl p-3 text-center transition hover:-translate-y-1 hover:bg-[#fcf6fd] hover:shadow-md"
      href={`#/products?category=${category.id}`}>
      <i className="grid h-16 w-16 place-items-center rounded-full border border-[#d995ef] bg-[#fcf6fd] text-3xl not-italic text-[#79259c]">
        {category.icon}
      </i>
      <b className="text-xs text-slate-800">{category.name}</b>
      <small className="text-[10px] text-slate-500">Explore care</small>
    </a>
  );
}
