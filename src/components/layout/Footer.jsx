import AsmitaLogo from "./AsmitaLogo";
import { useLanguage } from "../../i18n/LanguageContext";

function WarehouseItem({ warehouse, isFirst = false }) {
  const HeadingTag = isFirst ? "h3" : "h4";
  const phoneNumbers = warehouse.phone.split(" / ");

  return (
    <div className={isFirst ? "" : "mt-8"}>
      <HeadingTag className="text-sm font-semibold uppercase tracking-wide text-white">
        {warehouse.name}
      </HeadingTag>

      <div className="mt-2.5 space-y-1 text-xs leading-5 text-white/70">
        {warehouse.address.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      <div className="mt-3">
        <p className="text-xs font-semibold leading-5 text-white">
          Número de contato:
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs leading-5 text-white/75">
          {phoneNumbers.map((phone, idx) => (
            <span key={phone} className="inline-block whitespace-nowrap">
              {phone}
              {idx < phoneNumbers.length - 1 && (
                <span className="ml-1.5 text-white/50">/</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const links = [
    [t("nav.home"), "/"],
    [t("nav.about"), "/about"],
    [t("nav.products"), "/products"],
    [t("nav.promotion"), "/promotions"],
    [t("nav.new_arrivals"), "/new-arrivals"],
    [t("nav.events"), "/events"],
    [t("nav.blog"), "/blog"],
    [t("nav.contact"), "/contact"],
  ];

  const serviceLinks = [
    [t("footer.terms"), "/terms-and-conditions"],
    [t("footer.privacy"), "/contact"],
    [t("footer.faq"), "/contact"],
  ];

  // =========================================
  // WAREHOUSE ADDRESSES
  // =========================================

  const warehouses = [
    {
      name: "ARMAZEM PALANCA",
      address: [
        "Avenida Pedro de Castro Van-Dunem Loy,",
        "Bairro Palanca,",
        "Município do Kilamba Kiaxi,",
        "Província de Luanda.",
      ],
      phone: "+244 935375927 / +244 921678404",
    },
    {
      name: "ARMAZEM LUBANGO",
      address: [
        "Rua 4 de Fevereiro,",
        "Bairro Patrice Lumumba,",
        "Município do Lubango,",
        "Província da Huíla.",
      ],
      phone: "+244 947980007 / +244 952346218",
    },
    {
      name: "ARMAZEM HUAMBO",
      address: [
        "Rua Principal,",
        "Bairro São Pedro Calundo,",
        "Casa nº: S/N, Município do Huambo,",
        "Província do Huambo.",
      ],
      phone: "+244 947980404 / +244 931679032",
    },
    {
      name: "ARMAZEM LOBITO",
      address: [
        "Rua da Cidade da Guarda,",
        "Bairro da Canata,",
        "Município do Lobito,",
        "Província de Benguela.",
      ],
      phone: "+244 935873400",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#24102f] to-[#4d155f] text-white">
      {/* =========================================
          MAIN FOOTER
      ========================================= */}
      <div className="mx-auto w-full max-w-[1500px] px-5 py-12 sm:px-8 lg:px-10">
        <div
          className="
            grid
            grid-cols-1
            gap-10
            text-left
            sm:grid-cols-2
            sm:gap-8
            lg:grid-cols-3
            lg:gap-8
            xl:grid-cols-5
            xl:gap-8
            items-start
          "
        >
          {/* =========================================
              COLUMN 1 – BRAND
          ========================================= */}
          <div className="min-w-0">
            <a
              href="#/"
              onClick={scrollToTop}
              className="inline-block"
            >
              <AsmitaLogo />
            </a>

            <p className="mt-5 max-w-xs text-sm leading-6 text-white/75">
              {t("footer.tagline")}
            </p>

            {/* Social Icons */}
            <div className="mt-5 flex items-center gap-5 text-xl">
              <span>◉</span>
              <span>♥</span>
              <span>◎</span>
              <span>in</span>
            </div>
          </div>

          {/* =========================================
              COLUMN 2 – QUICK LINKS
          ========================================= */}
          <div className="min-w-0">
            <h3 className="text-sm font-semibold tracking-wide text-white">
              {t("footer.quick_links")}
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              {links.map(([name, path]) => (
                <a
                  key={path}
                  href={`#${path}`}
                  onClick={scrollToTop}
                  className="text-sm text-white/75 transition duration-200 hover:text-white"
                >
                  {name}
                </a>
              ))}
            </nav>
          </div>

          {/* =========================================
              COLUMN 3 – CUSTOMER SERVICE
          ========================================= */}
          <div className="min-w-0">
            <h3 className="text-sm font-semibold tracking-wide text-white">
              {t("footer.customer_service")}
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              {serviceLinks.map(([name, path]) => (
                <a
                  key={name}
                  href={`#${path}`}
                  onClick={scrollToTop}
                  className="text-sm text-white/75 transition duration-200 hover:text-white"
                >
                  {name}
                </a>
              ))}
            </nav>

            {/* Contact Us */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold tracking-wide text-white">
                {t("footer.contact_us")}
              </h4>

              <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
                <p className="flex items-start gap-2">
                  <span className="shrink-0">☎</span>
                  <span className="whitespace-nowrap">{t("footer.phone")}</span>
                </p>

                <p className="flex items-start gap-2">
                  <span className="shrink-0">✉</span>
                  <span className="break-words [overflow-wrap:anywhere]">{t("footer.email")}</span>
                </p>

                <p className="flex items-start gap-2">
                  <span className="shrink-0">⌖</span>
                  <span>{t("footer.location")}</span>
                </p>
              </div>
            </div>
          </div>

          {/* =========================================
              COLUMN 4 – WAREHOUSE 1 & 2
          ========================================= */}
          <div className="min-w-0">
            <WarehouseItem warehouse={warehouses[0]} isFirst={true} />
            <WarehouseItem warehouse={warehouses[1]} isFirst={false} />
          </div>

          {/* =========================================
              COLUMN 5 – WAREHOUSE 3 & 4
          ========================================= */}
          <div className="min-w-0">
            <WarehouseItem warehouse={warehouses[2]} isFirst={true} />
            <WarehouseItem warehouse={warehouses[3]} isFirst={false} />
          </div>
        </div>
      </div>

      {/* =========================================
          BOTTOM FOOTER
      ========================================= */}
      <div className="border-t border-white/15">
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-[1500px]
            flex-col
            items-center
            justify-between
            gap-3
            px-5
            py-5
            text-center
            text-xs
            text-white/60
            sm:flex-row
            sm:text-left
            sm:px-8
            lg:px-10
          "
        >
          <p>{t("footer.rights_reserved")}</p>
          <p>{t("footer.designed_with")}</p>
        </div>
      </div>
    </footer>
  );
}