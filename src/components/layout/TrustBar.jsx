import { useLanguage } from "../../i18n/LanguageContext";

export default function TrustBar() {
  const { t } = useLanguage();

  const benefits = [
    ["♢", t("trustbar.genuine_title"), t("trustbar.genuine_sub")],
    ["✿", t("trustbar.care_title"), t("trustbar.care_sub")],
    ["▣", t("trustbar.delivery_title"), t("trustbar.delivery_sub")],
    ["♙", t("trustbar.payment_title"), t("trustbar.payment_sub")],
    ["◔", t("trustbar.support_title"), t("trustbar.support_sub")],
  ];

  return (
    <section
      aria-label="Asmita service benefits"
      className="border-y border-[#f0e6f3] bg-white"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-5 sm:grid-cols-3 sm:gap-5 sm:px-6 lg:grid-cols-5 lg:gap-5 lg:px-5 lg:py-6">
        {benefits.map(([icon, title, text]) => (
          <div
            key={title}
            className="flex flex-col items-center gap-2 rounded-lg p-3 text-center transition hover:bg-[#fcf6fd] sm:flex-row sm:items-center sm:text-left sm:p-0"
          >
            <i className="text-3xl not-italic text-[#79259c]">
              {icon}
            </i>

            <div>
              <b className="block text-sm text-slate-900">
                {title}
              </b>

              <small className="text-xs text-slate-500">
                {text}
              </small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
