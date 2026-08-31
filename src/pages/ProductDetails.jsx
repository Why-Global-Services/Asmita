import { useEffect, useState } from "react";
import PageHero from "../components/layout/PageHero";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { catalogService } from "../services/catalogService";
import { useEnquiry } from "../hooks/useEnquiry";
import productsHeroImage from "../assets/images/heroes/products-tablets.jpeg";

export default function ProductDetails({ id }) {
  const [product, setProduct] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const { openEnquiry } = useEnquiry();

  useEffect(() => {
    setLoading(true);
    catalogService
      .getProduct(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loader label="Loading product details..." />;

  if (!product) {
    return (
      <>
        <PageHero title="Product Not Found" image={productsHeroImage} />
        <main className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 md:px-8">
          <EmptyState
            title="Product Not Found"
            message="The product you are looking for does not exist or may have been removed."
          />
          <div className="mt-6">
            <a
              href="#/products"
              className="inline-block rounded-lg bg-[#79259c] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#621d80]"
            >
              ← Back to Products
            </a>
          </div>
        </main>
      </>
    );
  }

  const images =
    product.productImages && product.productImages.length > 0
      ? product.productImages
      : [];

  return (
    <>
      <PageHero title={product.name} image={productsHeroImage} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        {/* Back navigation */}
        <div className="mb-6">
          <a
            href="#/products"
            className="inline-flex items-center text-sm font-bold text-[#79259c] transition-colors hover:underline"
          >
            ← Back to Products
          </a>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Product Images */}
          <div>
            <div className="grid h-[280px] place-items-center overflow-hidden rounded-2xl bg-[#faf2fc] text-7xl sm:h-[380px] sm:text-9xl border border-slate-100 shadow-sm">
              {images.length > 0 ? (
                <img
                  src={images[activeImgIndex] || images[0]}
                  alt={product.name}
                  className="h-full w-full object-contain p-4"
                />
              ) : (
                product.emoji || "💊"
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`grid h-14 w-14 place-items-center overflow-hidden rounded-lg border p-1 sm:h-16 sm:w-16 transition ${
                      activeImgIndex === idx
                        ? "border-[#79259c] bg-[#faf2fc] ring-2 ring-[#79259c]/20"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details (Price and Rating completely removed per requirement) */}
          <section className="flex flex-col justify-start">
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <a
                  href={`#/products?category=${encodeURIComponent(product.category)}`}
                  className="rounded-full bg-[#f6eefa] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#79259c] transition hover:bg-[#ebd5f4]"
                >
                  {product.category}
                </a>
              )}
              {product.subcategory && (
                <a
                  href={`#/products?category=${encodeURIComponent(product.category)}&subcategory=${encodeURIComponent(product.subcategory)}`}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  {product.subcategory}
                </a>
              )}
            </div>

            <h1 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
              {product.description || "High quality healthcare product distributed with strict standards of safety and efficacy."}
            </p>

            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-bold tracking-widest text-[#79259c] uppercase">
                  Ingredients / Composition
                </h3>
                <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
                  {product.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.additionalInformation && (
              <div className="mt-5 rounded-lg bg-[#faf6fc] p-4 text-sm text-slate-700">
                <b className="block text-xs font-bold tracking-wider text-[#79259c] uppercase mb-1">
                  Additional Information
                </b>
                {product.additionalInformation}
              </div>
            )}

            <div className="mt-6 flex items-center gap-4 text-sm font-medium">
              <span className={product.inStock ? "text-emerald-600" : "text-amber-600"}>
                {product.inStock ? "✓ In stock" : "Check availability"}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-600">✓ Fast delivery</span>
            </div>

            <div className="mt-8">
              <Button
                className="w-full sm:w-auto px-8 py-3 text-base"
                onClick={() => openEnquiry(product)}
              >
                Enquiry Now
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}