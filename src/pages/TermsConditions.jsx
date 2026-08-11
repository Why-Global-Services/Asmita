import Breadcrumb from "../components/common/Breadcrumb";

const sections = [
  {
    id: "use-of-the-website",
    title: "Use of the Website",
    content:
      "This website is provided for general information about our company, products, and services. You agree to use this website only for lawful purposes and in a manner that does not interfere with its operation or the rights of other users.",
    additional:
      "You must not attempt to gain unauthorized access to any part of the website, introduce malicious software, or engage in any activity that could damage, disable, or impair the website or its services.",
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content:
      "All content on this website, including text, images, graphics, logos, trademarks, product information, and other materials, is the property of Asmita - Comercio Geral, (SU), LDA or is used with permission. It is protected by applicable intellectual property laws.",
    additional:
      "You may view, download, or print content for your personal and non-commercial use only. You may not reproduce, distribute, modify, publish, or use any content from this website without our prior written permission.",
  },
  {
    id: "product-information",
    title: "Product Information",
    content:
      "We make every effort to ensure that the information presented on this website is accurate and up to date. However, product descriptions, specifications, availability, and other information may change without notice.",
    additional:
      "Nothing on this website should be interpreted as a guarantee of product availability or suitability for a particular purpose.",
  },
  {
    id: "medical-disclaimer",
    title: "Medical Disclaimer",
    content:
      "Any information relating to medicines, healthcare products, or medical topics is provided for general informational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment.",
    additional:
      "Always consult a qualified healthcare professional before using any medicine or making healthcare decisions. Never disregard professional medical advice because of information found on this website.",
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    content:
      "While we strive to keep the information on this website accurate and current, Asmita - Comercio Geral, (SU), LDA makes no warranties or representations regarding the completeness, accuracy, or reliability of the information provided.",
    additional:
      "To the fullest extent permitted by law, we shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from or related to the use of, or inability to use, this website or its content.",
  },
  {
    id: "external-services",
    title: "External Services",
    content:
      "Our website may make use of third-party services that support its operation, such as website hosting, analytics, or communication tools. These services operate under their own terms and privacy practices.",
  },
  {
    id: "changes-to-these-terms",
    title: "Changes to These Terms",
    content:
      "We reserve the right to update or modify these Terms & Conditions at any time without prior notice. Any changes will become effective immediately upon publication on this website.",
    additional:
      "Your continued use of the website after changes are posted constitutes your acceptance of the updated Terms.",
  },
];

export default function TermsConditions() {
  return (
    <main className="bg-[#fbf9fc]">
      <section className="overflow-hidden bg-gradient-to-br from-[#351044] via-[#5d197b] to-[#8d36aa] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
          <div className="[&_a]:!text-white/70 [&_a:hover]:!text-white [&_span]:!text-white/70">
            <Breadcrumb items={[{ label: "Terms & Conditions" }]} />
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#ead1f4]">
                ASMITA COMERCIO GERAL
              </p>
              <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Clear terms. Trusted care.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                The terms that guide how you use our website, products, and
                healthcare information.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/65">
                Effective date
              </p>
              <p className="mt-2 text-xl font-semibold">July 25, 2026</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <p className="text-xs font-bold tracking-[0.16em] text-[#79259c]">
              ON THIS PAGE
            </p>
            <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:grid lg:gap-1 lg:overflow-visible lg:border-l lg:border-[#e9d9ee] lg:pb-0">
              {sections.map(({ id, title }, index) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="shrink-0 rounded-full border border-[#eadced] bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-[#b76dce] hover:text-[#79259c] lg:rounded-none lg:border-0 lg:border-l-2 lg:border-transparent lg:bg-transparent lg:px-4 lg:py-2 lg:hover:border-[#79259c]"
                >
                  <span className="mr-2 text-xs font-bold text-[#a668be]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {title}
                </a>
              ))}
              <a
                href="#contact-us"
                className="shrink-0 rounded-full border border-[#eadced] bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-[#b76dce] hover:text-[#79259c] lg:rounded-none lg:border-0 lg:border-l-2 lg:border-transparent lg:bg-transparent lg:px-4 lg:py-2 lg:hover:border-[#79259c]"
              >
                <span className="mr-2 text-xs font-bold text-[#a668be]">08</span>
                Contact Us
              </a>
            </nav>
          </aside>

          <article className="min-w-0">
            <div className="rounded-3xl border border-[#eadced] bg-white p-6 shadow-[0_18px_50px_rgba(75,21,95,0.08)] sm:p-10 lg:p-12">
              <div className="border-b border-[#eee5f0] pb-8">
                <p className="text-sm font-bold tracking-[0.14em] text-[#79259c]">
                  TERMS & CONDITIONS
                </p>
                <h2 className="mt-3 font-serif text-3xl font-semibold text-[#371046] sm:text-4xl">
                  Website use, explained simply
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                  Welcome to the website of Asmita - Comercio Geral, (SU), LDA.
                  By accessing or using this website, you agree to be bound by
                  these Terms & Conditions. If you do not agree with any part
                  of these terms, please discontinue use of the website.
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
                      <h2 className="font-serif text-2xl font-semibold text-[#54206f] sm:text-3xl">Contact Us</h2>
                      <p className="mt-4 leading-8 text-slate-600">
                        If you have any questions regarding these Terms & Conditions,
                        please contact us.
                      </p>
                      <address className="mt-5 rounded-2xl bg-[#faf5fc] p-5 not-italic leading-8 text-slate-600 sm:p-6">
                        <span className="font-semibold text-[#54206f]">Asmita - Comercio Geral, (SU), LDA</span>
                        <br />
                        Email: info@yourwebsite.com
                        <br />
                        Website: https://www.yourwebsite.com
                      </address>
                    </div>
                  </div>
                </section>
              </div>

              <p className="rounded-2xl bg-[#351044] px-6 py-5 text-sm leading-7 text-white/85 sm:text-base">
                Thank you for visiting our website. We appreciate your trust and
                are committed to providing accurate information and a professional
                online experience.
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
