import PageHero from "../components/layout/PageHero";
import TrustBar from "../components/layout/TrustBar";
import aboutHeroImage from "../assets/images/heroes/about-laboratory.jpeg";
export default function About() {
  return (
    <>
      <PageHero title="About Us" image={aboutHeroImage} />
      <main className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 sm:px-8">
        <section>
          <p className="text-xs font-bold tracking-widest text-[#79259c]">
            CARE WITH CONFIDENCE
          </p>
          <h2 className="mt-3 font-serif text-4xl text-[#54206f]">
            Healthcare with Heart
          </h2>
          <p className="mt-5 leading-8 text-slate-600">
            Founded on 31st May 2021 in Angola, ASMITA COMÉRCIO GERAL (SU) LDA is a trusted importer and distributor of high-quality pharmaceutical products. We source medicines, medical supplies, and healthcare essentials from reputable manufacturers across Asia and Europe, ensuring international standards of safety and efficacy.
          </p>
          <p className="mt-4 leading-8 text-slate-600">
           Our network serves pharmacies, private clinics, government hospitals, and the Ministry of Health. With reliable logistics, regulated import practices, and professional distribution channels, we ensure timely delivery and product integrity across the country.
          <p className="mt-5 leading-8 text-slate-600">
            Quality and compliance are central to our operations. We work only with certified suppliers, perform strict quality checks, and adhere to Angolan regulatory requirements and international best practices.
           
            </p> 
          </p>
<br></br>
        <h1><b>Mission</b></h1>
        <p>
          To improve health outcomes in Angola by providing safe, affordable, and reliable pharmaceutical products.
        </p>
        <br></br>
<h1><b>Vission</b></h1>
<p>
  To be the leading partner for healthcare providers in Angola, recognized for quality, integrity, and service excellence.
</p>
<br></br>
<h1><b>Values</b></h1>
<p>
  Patient safety, regulatory compliance, transparency, and long-term partnerships.
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
