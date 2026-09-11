"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import ProductCard from "@/components/products/ProductCard";
import Loader from "@/components/common/Loader";
import { catalogService } from "@/services/catalogService";
import { useLanguage } from "@/i18n/LanguageContext";

export default function NewArrivalsPage() {
  const [items, setItems] = useState();
  const { t } = useLanguage();

  useEffect(() => {
    catalogService.getProducts().then((x) => setItems(x.items.slice(0, 8)));
  }, []);

  return (
    <>
      <PageHero title={t("new_arrivals.hero_title")} subtitle={t("new_arrivals.hero_sub")} image="/images/heroes/new-arrivals-capsule.jpeg" />
      <section className="mx-auto mt-2 max-w-7xl px-4 py-10 sm:px-6 md:px-8 md:py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold tracking-widest text-[#79259c]">{t("new_arrivals.eyebrow")}</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">{t("new_arrivals.title")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 sm:text-base">{t("new_arrivals.desc")}</p>
        </div>
        {!items ? (
          <Loader label={t("new_arrivals.loading")} />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((x) => <ProductCard key={x.id} product={x} />)}
          </div>
        )}
      </section>
    </>
  );
}
