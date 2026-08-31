


import Button from "../common/Button";
import { useEnquiry } from "../../hooks/useEnquiry";

export default function ProductCard({ product }) {
  const { openEnquiry } = useEnquiry();

  return (
    <article className="group relative flex min-h-[250px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm sm:min-h-[280px] sm:p-4">
      <div className="grid h-32 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-[#fbf1fd] text-6xl sm:h-40 sm:text-7xl">
        {product.productImages && product.productImages[0] ? (
          <img
            src={product.productImages[0]}
            alt={product.name}
            className="h-full w-full object-contain p-2 pointer-events-none select-none"
          />
        ) : (
          <span className="pointer-events-none select-none">{product.emoji}</span>
        )}
      </div>

      <h3 className="mt-3 min-h-[40px] text-sm font-bold leading-5 text-slate-900 select-none sm:min-h-10">
        {product.name}
      </h3>

      <Button
        className="mt-auto w-full py-2"
        onClick={() => openEnquiry(product)}
      >
        Enquiry Now
      </Button>
    </article>
  );
}