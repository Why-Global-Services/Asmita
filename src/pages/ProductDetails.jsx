import { useEffect, useState } from "react";
import PageHero from "../components/layout/PageHero";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import { catalogService } from "../services/catalogService";
import { money } from "../utils/formatters";
import { useEnquiry } from "../hooks/useEnquiry";

export default function ProductDetails({ id }) {
  const [product, setProduct] = useState();
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const { openEnquiry } = useEnquiry();

  useEffect(() => {
    catalogService.getProduct(id).then(setProduct);
  }, [id]);

  if (!product) return <Loader />;

  const images = product.productImages && product.productImages.length > 0 ? product.productImages : [];

  return (
    <>
      <PageHero title={product.name} />

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:gap-10 md:px-8 md:py-12">
        {/* Product Images */}
        <div>
          <div className="grid h-[280px] place-items-center overflow-hidden rounded-2xl bg-[#faf2fc] text-7xl sm:h-[360px] sm:text-9xl">
            {images.length > 0 ? (
              <img
                src={images[activeImgIndex] || images[0]}
                alt={product.name}
                className="h-full w-full object-contain p-4"
              />
            ) : (
              product.emoji
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`grid h-14 w-14 place-items-center overflow-hidden rounded-lg border p-1 text-2xl sm:h-16 sm:w-16 ${
                    activeImgIndex === idx
                      ? "border-[#79259c] bg-[#faf2fc]"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>


        {/* Product Details */}
        <section>
          <small className="font-bold uppercase tracking-widest text-[#8c57a0]">
            {product.category}
          </small>

          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-3 text-amber-500">
            ★★★★★{" "}
            <span className="text-sm text-slate-500 sm:text-base">
              {product.rating}/5 · 24 reviews
            </span>
          </p>

          <h2 className="mt-4 text-2xl font-bold text-[#79259c] sm:text-3xl">
            {money(product.price)}
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
            {product.description}
          </p>

          <p className="mt-4 text-sm text-emerald-600">
            ✓ In stock &nbsp;&nbsp; ✓ Fast delivery
          </p>

          <div className="mt-6 w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto"
              onClick={() => openEnquiry(product)}
            >
              Enquiry Now
            </Button>
          </div>
        </section>
      </main>

      {/* Reviews */}
      <section className="bg-[#fcf8fd] px-4 py-10 sm:px-6 md:px-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-2xl sm:text-3xl">
            Customer Reviews
          </h2>

          <article className="mt-5 rounded-xl bg-white p-5 shadow-sm">
            <b>Priya M.</b>

            <p className="mt-2 text-amber-500">★★★★★</p>

            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              Reliable product and quick delivery. Exactly what I needed for
              home care.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}