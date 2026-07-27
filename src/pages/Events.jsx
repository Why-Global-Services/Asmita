import { useEffect, useState } from "react";
import PageHero from "../components/layout/PageHero";
import EventCard from "../components/events/EventCard";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";
import { catalogService } from "../services/catalogService";
export default function Events() {
  const [items, setItems] = useState(),
    [type, setType] = useState("All Events");
  useEffect(() => {
    catalogService.getEvents().then(setItems);
  }, []);
  const filtered = items?.filter(
    (x) => type === "All Events" || x.type === type,
  );
  return (
    <>
      <PageHero
        title="Events"
        subtitle="Connecting Healthcare. Inspiring Better Tomorrow."
      />
      <main className="mx-auto grid max-w-7xl gap-7 px-5 py-8 lg:grid-cols-[220px_1fr] sm:px-8">
        <aside className="h-max rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold">Event Type</h3>
          {[
            "All Events",
            "Health Camp",
            "Webinar",
            "Workshop",
            "Conference",
            "Awareness Program",
          ].map((x) => (
            <label className="mt-3 flex gap-2 text-sm text-slate-600" key={x}>
              <input
                className="accent-[#79259c]"
                type="radio"
                name="event"
                checked={type === x}
                onChange={() => setType(x)}
              />
              {x}
            </label>
          ))}
          <button
            className="mt-6 w-full rounded border border-[#79259c] py-2 text-sm font-bold text-[#79259c]"
            onClick={() => setType("All Events")}>
            Reset Filters
          </button>
        </aside>
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#79259c]">
                Upcoming Events
              </h3>
              <small className="text-slate-500">
                Showing {filtered?.length || 0} events
              </small>
            </div>
            <select className="rounded border border-slate-200 p-2 text-sm">
              <option>Upcoming</option>
            </select>
          </div>
          {!items ? (
            <Loader />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((x) => (
                <EventCard key={x.id} event={x} />
              ))}
            </div>
          )}
          <Pagination />
        </section>
      </main>
    </>
  );
}
