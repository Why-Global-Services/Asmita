


import Button from "../common/Button";
import { money } from "../../utils/formatters";
import { useEnquiry } from "../../hooks/useEnquiry";

export default function ProductCard({ product, onQuickView }) {
  const { openEnquiry } = useEnquiry();

  return (
    <article className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:min-h-[330px] sm:p-4">
      <button
        className="grid h-32 place-items-center rounded-lg bg-gradient-to-br from-slate-50 to-[#fbf1fd] text-6xl transition group-hover:scale-105 sm:h-40 sm:text-7xl"
        aria-label={`Quick view ${product.name}`}
        onClick={() => onQuickView?.(product)}
      >
        {product.emoji}
      </button>

      <span className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#8e699e]">
        {product.category}
      </span>

      <a
        href={`#/products/${product.id}`}
        className="mt-2 min-h-[40px] text-sm font-bold leading-5 text-slate-900 transition hover:text-[#79259c] sm:min-h-10"
      >
        {product.name}
      </a>

      <span className="mt-1 text-xs text-amber-500">
        ★★★★★{" "}
        <small className="text-slate-500">
          {product.rating || 4.5}
        </small>
      </span>

      <strong className="mt-2 text-base font-bold text-slate-900">
        {money(product.price)}
      </strong>

      <Button
        className="mt-auto w-full py-2"
        onClick={() => openEnquiry(product)}>
        Enquiry Now
      </Button>
    </article>
  );
}