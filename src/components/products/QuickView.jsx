import Modal from "../common/Modal";
import Button from "../common/Button";
import { money } from "../../utils/formatters";
import { useEnquiry } from "../../hooks/useEnquiry";
export default function QuickView({ product, onClose }) {
  const { openEnquiry } = useEnquiry();
  return (
    <Modal open={Boolean(product)} onClose={onClose}>
      {product && (
        <div className="grid gap-7 sm:grid-cols-2">
          <div className="grid min-h-64 place-items-center rounded-xl bg-[#faf2fc] text-9xl">
            {product.emoji}
          </div>
          <section className="py-3">
            <small className="font-bold uppercase tracking-widest text-[#8d57a2]">
              {product.category}
            </small>
            <h2 className="mt-2 font-serif text-3xl font-semibold">
              {product.name}
            </h2>
            <p className="mt-2 text-amber-500">
              ★★★★★{" "}
              <span className="text-slate-500">{product.rating || 4.5}/5</span>
            </p>
            <strong className="mt-4 block text-2xl text-[#79259c]">
              {money(product.price)}
            </strong>
            <p className="mt-4 leading-6 text-slate-600">
              {product.description}
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => {
                  onClose();
                  openEnquiry(product);
                }}>
                Enquiry Now
              </Button>
              <a
                className="rounded-md border border-[#79259c] px-4 py-2 text-sm font-bold text-[#79259c]"
                href={`#/products/${product.id}`}>
                Full Details
              </a>
            </div>
          </section>
        </div>
      )}
    </Modal>
  );
}
