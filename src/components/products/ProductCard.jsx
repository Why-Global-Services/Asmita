import Button from "../common/Button";
import { useEnquiry } from "../../hooks/useEnquiry";

export default function ProductCard({ product }) {
  const { openEnquiry } = useEnquiry();
  const productId = product.id || product._id;

  return (
    <article className="group relative flex min-h-[250px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:min-h-[280px] sm:p-4">
      <a
        href={`#/products/${productId}`}
        className="flex flex-1 flex-col items-center text-center cursor-pointer no-underline"
      >
        <div className="grid h-32 w-full place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-[#fbf1fd] text-6xl sm:h-40 sm:text-7xl transition-transform duration-200 group-hover:scale-[1.03]">
          {product.productImages && product.productImages[0] ? (
            <img
              src={product.productImages[0]}
              alt={product.name}
              className="h-full w-full object-contain p-2 pointer-events-none select-none"
            />
          ) : (
            <span className="pointer-events-none select-none">{product.emoji || "💊"}</span>
          )}
        </div>

        <h3 className="mt-3 min-h-[40px] text-sm font-bold leading-5 text-slate-900 transition-colors group-hover:text-[#79259c] select-none sm:min-h-10">
          {product.name}
        </h3>
      </a>

      <Button
        className="mt-auto w-full py-2"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          openEnquiry(product);
        }}
      >
        Enquiry Now
      </Button>
    </article>
  );
}