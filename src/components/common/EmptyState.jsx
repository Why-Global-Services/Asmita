import { useLanguage } from "../../i18n/LanguageContext";

export default function EmptyState({ title, message }) {
  const { t } = useLanguage();

  const displayTitle = title || t("common.empty_title");
  const displayMessage = message || t("common.empty_message");

  return (
    <div className="rounded-xl border border-dashed border-[#d9bce5] bg-[#fdf9fe] px-4 py-12 text-center sm:px-6 sm:py-16">
      <b className="text-4xl text-[#79259c] sm:text-5xl">⌕</b>

      <h3 className="mt-3 text-base font-bold text-slate-900 sm:text-lg">
        {displayTitle}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {displayMessage}
      </p>
    </div>
  );
}