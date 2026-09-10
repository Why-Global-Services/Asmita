import AsmitaLogo from "./AsmitaLogo";
import { useLanguage } from "../../i18n/LanguageContext";

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
            text-center

            sm:grid-cols-2
            sm:text-left

            lg:grid-cols-12
            lg:items-start
            lg:gap-x-8
            lg:gap-y-12
          "
        >

          {/* =========================================
              COMPANY
          ========================================= */}

          <div className="lg:col-span-3">
            
            <a
              href="#/"
              onClick={scrollToTop}
              className="inline-block"
            >
              <AsmitaLogo />
            </a>

            <p
              className="
                mx-auto
                mt-5
                max-w-xs
                text-sm
                leading-6
                text-white/75

                sm:mx-0
              "
            >
              {t("footer.tagline")}
            </p>

            {/* Social Icons */}
            <div
              className="
                mt-5
                flex
                justify-center
                gap-5
                text-xl
                sm:justify-start
              "
            >
              <span>◉</span>
              <span>♥</span>
              <span>◎</span>
              <span>in</span>
            </div>
          </div>


          {/* =========================================
              QUICK LINKS
          ========================================= */}

          <div className="lg:col-span-2">
            
            <h3 className="text-sm font-semibold">
              {t("footer.quick_links")}
            </h3>

            <nav className="mt-5 grid gap-3">
              {links.map(([name, path]) => (
                <a
                  key={path}
                  href={`#${path}`}
                  onClick={scrollToTop}
                  className="
                    text-sm
                    text-white/75
                    transition
                    duration-200
                    hover:text-white
                  "
                >
                  {name}
                </a>
              ))}
            </nav>
          </div>


          {/* =========================================
              CUSTOMER SERVICE
          ========================================= */}

          <div className="lg:col-span-2">
            
            <h3 className="text-sm font-semibold">
              {t("footer.customer_service")}
            </h3>

            <nav className="mt-5 grid gap-3">
              {serviceLinks.map(([name, path]) => (
                <a
                  key={name}
                  href={`#${path}`}
                  onClick={scrollToTop}
                  className="
                    text-sm
                    text-white/75
                    transition
                    duration-200
                    hover:text-white
                  "
                >
                  {name}
                </a>
              ))}
            </nav>


            {/* Contact */}
            <div className="mt-8">
              
              <h3 className="text-sm font-semibold">
                {t("footer.contact_us")}
              </h3>

              <div className="mt-4 grid gap-3 text-sm text-white/75">
                
                <p className="flex items-start gap-2">
                  <span>☎</span>
                  <span>{t("footer.phone")}</span>
                </p>

                <p className="flex items-start gap-2 break-all">
                  <span>✉</span>
                  <span>{t("footer.email")}</span>
                </p>

                <p className="flex items-start gap-2">
                  <span>⌖</span>
                  <span>{t("footer.location")}</span>
                </p>

              </div>
            </div>
          </div>


          {/* =========================================
              WAREHOUSE SECTION
          ========================================= */}

          <div className="lg:col-span-5">

            {/* Warehouse Heading */}
            <h3
              className="
                text-left
                text-sm
                font-semibold
                uppercase
                tracking-wide
              "
            >
              ENDEREÇO DE ARMAZENS
            </h3>


            {/* Warehouse Grid */}
            <div
              className="
                mt-5
                grid
                grid-cols-1
                gap-8
                text-left

                sm:grid-cols-2

                lg:grid-cols-2
                xl:grid-cols-4
                xl:gap-6
              "
            >
              
              {warehouses.map((warehouse) => (
                <div
                  key={warehouse.name}
                  className="
                    min-w-0
                    text-left
                  "
                >

                  {/* Warehouse Name */}
                  <h4
                    className="
                      min-h-[40px]
                      text-xs
                      font-bold
                      leading-5
                      tracking-wide
                      text-white
                    "
                  >
                    {warehouse.name}
                  </h4>


                  {/* Address */}
                  <div
                    className="
                      mt-2
                      space-y-0.5
                      text-xs
                      leading-5
                      text-white/70
                    "
                  >
                    {warehouse.address.map((line, index) => (
                      <p key={index}>
                        {line}
                      </p>
                    ))}
                  </div>


                  {/* Phone */}
                  <div className="mt-3">
                    
                    <p
                      className="
                        text-xs
                        font-semibold
                        leading-5
                        text-white
                      "
                    >
                      Número de contato:
                    </p>

                    <p
                      className="
                        mt-0.5
                        break-words
                        text-xs
                        leading-5
                        text-white/75
                      "
                    >
                      {warehouse.phone}
                    </p>

                  </div>

                </div>
              ))}

            </div>
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

            sm:px-8

            sm:flex-row
            sm:text-left

            lg:px-10
          "
        >
          
          <p>
            {t("footer.rights_reserved")}
          </p>

          <p>
            {t("footer.designed_with")}
          </p>

        </div>
      </div>

    </footer>
  );
}