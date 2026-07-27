import PageHero from "../components/layout/PageHero";
import TrustBar from "../components/layout/TrustBar";
export default function About() {
  return (
    <>
      <PageHero title="About Us" />
      <main className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 sm:px-8">
        <section>
          <p className="text-xs font-bold tracking-widest text-[#79259c]">
            CARE WITH CONFIDENCE
          </p>
          <h2 className="mt-3 font-serif text-4xl text-[#54206f]">
            Healthcare with Heart
          </h2>
          <p className="mt-5 leading-8 text-slate-600">
            Asmita is committed to making trusted healthcare products accessible
            to families, professionals, and communities. Every item is selected
            with quality, safety, and everyday care in mind.
          </p>
          <p className="mt-4 leading-8 text-slate-600">
            From essential medical equipment to wellness products, we help you
            care with confidence.
          </p>
        </section>
        <div className="grid min-h-72 place-items-center rounded-2xl bg-gradient-to-br from-[#f8edfb] to-[#e5d4ec] text-8xl">
          ✚　🩺　💜
        </div>
      </main>
      <TrustBar />
    </>
  );
}
