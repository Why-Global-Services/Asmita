import { useEffect, useState } from "react";
import PageHero from "../components/layout/PageHero";
import PromotionCard from "../components/promotions/PromotionCard";
import Loader from "../components/common/Loader";
import { catalogService } from "../services/catalogService";

export default function Promotions() {
  const [items, setItems] = useState();

  useEffect(() => {
    catalogService.getPromotions().then(setItems);
  }, []);

  return (
    <>
      <PageHero
        title="Promotions"
        subtitle="Health essentials, exceptional value."
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-8 md:py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold tracking-widest text-[#79259c]">
            LIMITED TIME SAVINGS
          </p>

          <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
            Current Offers
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
            Discover limited-time offers on quality healthcare products.
          </p>
        </div>

        {!items ? (
          <Loader />
        ) : (
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((x) => (
              <PromotionCard key={x.id} promotion={x} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}