import PageHero from "../components/layout/PageHero";
import TrustBar from "../components/layout/TrustBar";
import aboutHeroImage from "../assets/images/heroes/about-laboratory.jpeg";
import { useLanguage } from "../i18n/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero title={t("about.hero_title")} image={aboutHeroImage} />
      <main className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 sm:px-8">
        <section>
          <p className="text-xs font-bold tracking-widest text-[#79259c]">
            {t("about.eyebrow")}
          </p>
          <h2 className="mt-3 font-serif text-4xl text-[#54206f]">
            {t("about.title")}
          </h2>
          <p className="mt-5 leading-8 text-slate-600">
            {t("about.p1")}
          </p>
          <p className="mt-4 leading-8 text-slate-600">
            {t("about.p2")}
          </p>
          <p className="mt-4 leading-8 text-slate-600">
            {t("about.p3")}
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#54206f]">
                {t("about.mission_title")}
              </h3>
              <p className="mt-2 text-slate-600 leading-7">
                {t("about.mission_text")}
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-[#54206f]">
                {t("about.vision_title")}
              </h3>
              <p className="mt-2 text-slate-600 leading-7">
                {t("about.vision_text")}
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-[#54206f]">
                {t("about.values_title")}
              </h3>
              <p className="mt-2 text-slate-600 leading-7">
                {t("about.values_text")}
              </p>
            </div>
          </div>
        </section>

        <div className="grid min-h-72 place-items-center rounded-2xl bg-gradient-to-br from-[#f8edfb] to-[#e5d4ec] text-8xl shadow-inner">
          ✚　🩺　💜
        </div>
      </main>
      <TrustBar />
    </>
  );
}
