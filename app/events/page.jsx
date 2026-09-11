"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import EventCard from "@/components/events/EventCard";
import Pagination from "@/components/common/Pagination";
import Loader from "@/components/common/Loader";
import { catalogService } from "@/services/catalogService";
import { useLanguage } from "@/i18n/LanguageContext";

export default function EventsPage() {
  const [items, setItems] = useState();
  const [typeKey, setTypeKey] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useLanguage();

  useEffect(() => { catalogService.getEvents().then(setItems); }, []);

  const eventTypeMap = [
    { key: "all", raw: "All Events", label: t("events.all_events") },
    { key: "camp", raw: "Health Camp", label: t("events.health_camp") },
    { key: "webinar", raw: "Webinar", label: t("events.webinar") },
    { key: "workshop", raw: "Workshop", label: t("events.workshop") },
    { key: "conf", raw: "Conference", label: t("events.conference") },
    { key: "awareness", raw: "Awareness Program", label: t("events.awareness_program") },
  ];

  const selectedItem = eventTypeMap.find((e) => e.key === typeKey) || eventTypeMap[0];
  const filtered = items?.filter((x) => selectedItem.key === "all" || x.type === selectedItem.raw);

  return (
    <>
      <PageHero title={t("events.hero_title")} subtitle={t("events.hero_sub")} image="/images/heroes/events-healthcare.jpeg" />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:px-8 lg:grid-cols-[220px_1fr]">
        <button
          className="flex w-full items-center justify-center rounded-lg border border-[#79259c] py-3 font-semibold text-[#79259c] transition hover:bg-[#79259c] hover:text-white lg:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? t("events.hide_filters") : t("events.show_filters")}
        </button>
        <aside className={"h-max rounded-xl border border-slate-200 p-5 " + (showFilters ? "block" : "hidden") + " lg:block"}>
          <h3 className="font-bold">{t("events.filter_title")}</h3>
          {eventTypeMap.map(({ key, label }) => (
            <label key={key} className="mt-3 flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                className="accent-[#79259c]"
                type="radio"
                name="event"
                checked={typeKey === key}
                onChange={() => { setTypeKey(key); setShowFilters(false); }}
              />
              {label}
            </label>
          ))}
          <button
            className="mt-6 w-full rounded-lg border border-[#79259c] py-2 text-sm font-bold text-[#79259c] transition hover:bg-[#79259c] hover:text-white"
            onClick={() => { setTypeKey("all"); setShowFilters(false); }}
          >
            {t("events.reset_filters")}
          </button>
        </aside>
        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#79259c]">{t("events.upcoming_events")}</h3>
              <small className="text-slate-500">{t("events.showing_events", { count: filtered?.length || 0 })}</small>
            </div>
            <select className="w-full rounded-md border border-slate-200 p-2 text-sm sm:w-auto">
              <option>{t("events.upcoming_sort")}</option>
            </select>
          </div>
          {!items ? (
            <Loader label={t("events.loading")} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {filtered.map((x) => <EventCard key={x.id} event={x} />)}
            </div>
          )}
          <div className="mt-8"><Pagination /></div>
        </section>
      </main>
    </>
  );
}
