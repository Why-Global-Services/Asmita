


import Button from "../common/Button";
import { useEnquiry } from "../../hooks/useEnquiry";

export default function ProductCard({ product, onQuickView }) {
  const { openEnquiry } = useEnquiry();

  return (
    <article className="group relative flex min-h-[250px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:min-h-[280px] sm:p-4">
      <button
        className="grid h-32 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-[#fbf1fd] text-6xl transition group-hover:scale-105 sm:h-40 sm:text-7xl"
        aria-label={`Quick view ${product.name}`}
        onClick={() => onQuickView?.(product)}
      >
        {product.productImages && product.productImages[0] ? (
          <img
            src={product.productImages[0]}
            alt={product.name}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          product.emoji
        )}
      </button>

      <a
        href={`#/products/${product.id}`}
        className="mt-3 min-h-[40px] text-sm font-bold leading-5 text-slate-900 transition hover:text-[#79259c] sm:min-h-10"
      >
        {product.name}
      </a>

      <Button
        className="mt-auto w-full py-2"
        onClick={() => openEnquiry(product)}>
        Enquiry Now
      </Button>
    </article>
  );
}