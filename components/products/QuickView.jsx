



// Product QuickView modal is disabled in favor of direct full-page product detail navigation.
// Code preserved for reference.
/*
import Modal from "../common/Modal";
import Button from "../common/Button";
import { money } from "../../utils/formatters";
import { useEnquiry } from "../../hooks/useEnquiry";

export function QuickViewLegacy({ product, onClose }) {
  const { openEnquiry } = useEnquiry();

  return (
    <Modal open={Boolean(product)} onClose={onClose}>
      {product && (
        <div className="grid max-h-[80vh] gap-6 overflow-y-auto md:grid-cols-2 md:items-center md:gap-8">
          <div className="grid h-56 place-items-center overflow-hidden rounded-xl bg-[#faf2fc] p-6 text-7xl sm:h-64 sm:text-8xl md:h-72 md:text-9xl">
            {product.productImages && product.productImages[0] ? (
              <img
                src={product.productImages[0]}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              product.emoji
            )}
          </div>

          <section className="text-center md:text-left">
            <small className="font-bold uppercase tracking-widest text-[#8d57a2]">
              {product.category}
            </small>

            <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
              {product.name}
            </h2>

            <p className="mt-3 text-amber-500">
              ★★★★★{" "}
              <span className="text-slate-500">
                {product.rating || 4.5}/5
              </span>
            </p>

            <strong className="mt-4 block text-2xl font-bold text-[#79259c]">
              {money(product.price)}
            </strong>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              {product.description}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                className="w-full sm:flex-1"
                onClick={() => {
                  onClose();
                  openEnquiry(product);
                }}
              >
                Enquiry Now
              </Button>

              <a
                href={`#/products/${product.id}`}
                className="inline-flex w-full items-center justify-center rounded-md border border-[#79259c] px-5 py-2.5 text-sm font-bold text-[#79259c] transition hover:bg-[#faf4fc] sm:flex-1"
              >
                Full Details
              </a>
            </div>
          </section>
        </div>
      )}
    </Modal>
  );
}
*/

export default function QuickView() {
  return null;
}
