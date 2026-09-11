"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import Loader from "@/components/common/Loader";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import { catalogService } from "@/services/catalogService";
import { useEnquiry } from "@/hooks/useEnquiry";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ProductDetailsClient({ id }) {
  const [product, setProduct] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const { openEnquiry } = useEnquiry();
  const { t } = useLanguage();

  useEffect(() => {
    if (!id) return;
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

  if (loading) return <Loader label={t("product_details.loading")} />;

  if (!product) {
    return (
      <>
        <PageHero title={t("product_details.not_found_title")} image="/images/heroes/products-tablets.jpeg" />
        <main className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 md:px-8">
          <EmptyState
            title={t("product_details.not_found_title")}
            message={t("product_details.not_found_msg")}
          />
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-block rounded-lg bg-[#79259c] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#621d80]"
            >
              {t("product_details.back_to_products")}
            </Link>
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
      <PageHero title={product.name} image="/images/heroes/products-tablets.jpeg" />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-bold text-[#79259c] transition-colors hover:underline"
          >
            {t("product_details.back_to_products")}
          </Link>
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
                    className={"grid h-14 w-14 place-items-center overflow-hidden rounded-lg border p-1 sm:h-16 sm:w-16 transition " + (activeImgIndex === idx ? "border-[#79259c] bg-[#faf2fc] ring-2 ring-[#79259c]/20" : "border-slate-200 bg-slate-50 hover:border-slate-300")}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <section className="flex flex-col justify-start">
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <Link
                  href={"/products?category=" + encodeURIComponent(product.category)}
                  className="rounded-full bg-[#f6eefa] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#79259c] transition hover:bg-[#ebd5f4]"
                >
                  {product.category}
                </Link>
              )}
              {product.subcategory && (
                <Link
                  href={"/products?category=" + encodeURIComponent(product.category) + "&subcategory=" + encodeURIComponent(product.subcategory)}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  {product.subcategory}
                </Link>
              )}
            </div>

            <h1 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
              {product.description || t("product_details.default_description")}
            </p>

            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-bold tracking-widest text-[#79259c] uppercase">
                  {t("product_details.ingredients")}
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
                  {t("product_details.additional_info")}
                </b>
                {product.additionalInformation}
              </div>
            )}

            <div className="mt-6 flex items-center gap-4 text-sm font-medium">
              <span className={product.inStock ? "text-emerald-600" : "text-amber-600"}>
                {product.inStock ? t("product_details.in_stock") : t("product_details.check_availability")}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-600">{t("product_details.fast_delivery")}</span>
            </div>

            <div className="mt-8">
              <Button
                className="w-full sm:w-auto px-8 py-3 text-base"
                onClick={() => openEnquiry(product)}
              >
                {t("product_details.enquiry_now")}
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
