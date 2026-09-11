import Breadcrumb from "../components/common/Breadcrumb";
import { useLanguage } from "../i18n/LanguageContext";

export default function TermsConditions() {
  const { t } = useLanguage();

  const sections = [
    {
      id: "use-of-the-website",
      title: t("terms.sec1_title"),
      content: t("terms.sec1_content"),
      additional: t("terms.sec1_add"),
    },
    {
      id: "intellectual-property",
      title: t("terms.sec2_title"),
      content: t("terms.sec2_content"),
      additional: t("terms.sec2_add"),
    },
    {
      id: "product-information",
      title: t("terms.sec3_title"),
      content: t("terms.sec3_content"),
      additional: t("terms.sec3_add"),
    },
    {
      id: "medical-disclaimer",
      title: t("terms.sec4_title"),
      content: t("terms.sec4_content"),
      additional: t("terms.sec4_add"),
    },
    {
      id: "limitation-of-liability",
      title: t("terms.sec5_title"),
      content: t("terms.sec5_content"),
      additional: t("terms.sec5_add"),
    },
    {
      id: "external-services",
      title: t("terms.sec6_title"),
      content: t("terms.sec6_content"),
    },
    {
      id: "changes-to-these-terms",
      title: t("terms.sec7_title"),
      content: t("terms.sec7_content"),
      additional: t("terms.sec7_add"),
    },
  ];

  const scrollToSection = (event, id) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="bg-[#fbf9fc]">
      <section className="overflow-hidden bg-gradient-to-br from-[#351044] via-[#5d197b] to-[#8d36aa] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
          <div className="[&_a]:!text-white/70 [&_a:hover]:!text-white [&_span]:!text-white/70">
            <Breadcrumb items={[{ label: t("terms.breadcrumb") }]} />
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#ead1f4]">
                {t("terms.eyebrow")}
              </p>
              <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                {t("terms.hero_title")}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                {t("terms.hero_desc")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/65">
                {t("terms.effective_date_label")}
              </p>
              <p className="mt-2 text-xl font-semibold">{t("terms.effective_date")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
          <aside className="min-w-0 lg:sticky lg:top-28 lg:h-fit">
            <p className="text-xs font-bold tracking-[0.16em] text-[#79259c]">
              {t("terms.on_this_page")}
            </p>
            <nav className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-2 lg:grid lg:gap-1 lg:overflow-visible lg:border-l lg:border-[#e9d9ee] lg:pb-0">
              {sections.map(({ id, title }, index) => (
                <a
                  key={id}
                  href="#/terms-and-conditions"
                  onClick={(event) => scrollToSection(event, id)}
                  className="shrink-0 rounded-full border border-[#eadced] bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-[#b76dce] hover:text-[#79259c] lg:rounded-none lg:border-0 lg:border-l-2 lg:border-transparent lg:bg-transparent lg:px-4 lg:py-2 lg:hover:border-[#79259c]"
                >
                  <span className="mr-2 text-xs font-bold text-[#a668be]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {title}
                </a>
              ))}
              <a
                href="#/terms-and-conditions"
                onClick={(event) => scrollToSection(event, "contact-us")}
                className="shrink-0 rounded-full border border-[#eadced] bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-[#b76dce] hover:text-[#79259c] lg:rounded-none lg:border-0 lg:border-l-2 lg:border-transparent lg:bg-transparent lg:px-4 lg:py-2 lg:hover:border-[#79259c]"
              >
                <span className="mr-2 text-xs font-bold text-[#a668be]">08</span>
                {t("terms.contact_us_nav")}
              </a>
            </nav>
          </aside>

          <article className="min-w-0">
            <div className="rounded-3xl border border-[#eadced] bg-white p-6 shadow-[0_18px_50px_rgba(75,21,95,0.08)] sm:p-10 lg:p-12">
              <div className="border-b border-[#eee5f0] pb-8">
                <p className="text-sm font-bold tracking-[0.14em] text-[#79259c]">
                  {t("terms.badge")}
                </p>
                <h2 className="mt-3 font-serif text-3xl font-semibold text-[#371046] sm:text-4xl">
                  {t("terms.title")}
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                  {t("terms.intro")}
                </p>
              </div>

              <div className="divide-y divide-[#eee5f0]">
                {sections.map(({ id, title, content, additional }, index) => (
                  <section id={id} key={id} className="scroll-mt-28 py-9 first:pt-10 sm:py-11">
                    <div className="grid gap-3 sm:grid-cols-[52px_minmax(0,1fr)] sm:gap-5">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f6eefa] text-sm font-bold text-[#79259c]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h2 className="font-serif text-2xl font-semibold text-[#54206f] sm:text-3xl">
                          {title}
                        </h2>
                        <p className="mt-4 leading-8 text-slate-600">{content}</p>
                        {additional && (
                          <p className="mt-4 leading-8 text-slate-600">{additional}</p>
                        )}
                      </div>
                    </div>
                  </section>
                ))}

                <section id="contact-us" className="scroll-mt-28 py-10 sm:py-12">
                  <div className="grid gap-3 sm:grid-cols-[52px_minmax(0,1fr)] sm:gap-5">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f6eefa] text-sm font-bold text-[#79259c]">08</span>
                    <div>
                      <h2 className="font-serif text-2xl font-semibold text-[#54206f] sm:text-3xl">{t("terms.sec8_title")}</h2>
                      <p className="mt-4 leading-8 text-slate-600">
                        {t("terms.sec8_content")}
                      </p>
                      <address className="mt-5 rounded-2xl bg-[#faf5fc] p-5 not-italic leading-8 text-slate-600 sm:p-6">
                        <span className="font-semibold text-[#54206f]">Asmita - Comercio Geral, (SU), LDA</span>
                        <br />
                        Email: info@asmitaangola.com
                        <br />
                        Website: https://www.asmitaangola.com
                      </address>
                    </div>
                  </div>
                </section>
              </div>

              <p className="rounded-2xl bg-[#351044] px-6 py-5 text-sm leading-7 text-white/85 sm:text-base">
                {t("terms.closing")}
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
