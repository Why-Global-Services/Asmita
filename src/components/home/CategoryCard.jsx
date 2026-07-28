export default function CategoryCard({ category }) {
  return (
    <a
      className="flex min-h-[150px] flex-col items-center justify-center gap-3 rounded-xl p-4 text-center transition hover:-translate-y-1 hover:bg-[#fcf6fd] hover:shadow-md sm:min-h-36 sm:gap-2 sm:p-3"
      href={`#/products?category=${category.id}`}
    >
      <i className="grid h-18 w-18 place-items-center rounded-full border border-[#d995ef] bg-[#fcf6fd] text-4xl not-italic text-[#79259c] sm:h-16 sm:w-16 sm:text-3xl">
        {category.icon}
      </i>

      <b className="text-sm font-semibold leading-5 text-slate-800 sm:text-xs">
        {category.name}
      </b>

      <small className="text-xs text-slate-500 sm:text-[10px]">
        Explore care
      </small>
    </a>
  );
}