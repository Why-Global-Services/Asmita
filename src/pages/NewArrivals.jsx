import { useEffect, useState } from "react";
import PageHero from "../components/layout/PageHero";
import ProductCard from "../components/products/ProductCard";
import Loader from "../components/common/Loader";
import { catalogService } from "../services/catalogService";
export default function NewArrivals() {
  const [items, setItems] = useState();
  useEffect(() => {
    catalogService.getProducts().then((x) => setItems(x.items.slice(0, 8)));
  }, []);
  return (
    <>
      <PageHero
        title="New Arrivals"
        subtitle="Discover our latest healthcare essentials."
      />
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold tracking-widest text-[#79259c]">
            FRESH CARE ESSENTIALS
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold">
            Just Arrived
          </h2>
          <p className="mt-2 text-slate-600">
            Fresh additions, selected for everyday care.
          </p>
        </div>
        {!items ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((x) => (
              <ProductCard key={x.id} product={x} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
