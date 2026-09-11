"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import PromotionCard from "@/components/promotions/PromotionCard";
import Loader from "@/components/common/Loader";
import { catalogService } from "@/services/catalogService";
import { useLanguage } from "@/i18n/LanguageContext";

export default function PromotionsPage() {
  const [items, setItems] = useState();
  const { t } = useLanguage();

  useEffect(() => { catalogService.getPromotions().then(setItems); }, []);

  return (
    <>
      <PageHero title={t("promotions.hero_title")} subtitle={t("promotions.hero_sub")} image="/images/heroes/promotions-capsules.jpeg" />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-8 md:py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold tracking-widest text-[#79259c]">{t("promotions.eyebrow")}</p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl">{t("promotions.title")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 sm:text-base">{t("promotions.desc")}</p>
        </div>
        {!items ? (
          <Loader label={t("promotions.loading")} />
        ) : (
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((x) => <PromotionCard key={x.id} promotion={x} />)}
          </div>
        )}
      </section>
    </>
  );
}
