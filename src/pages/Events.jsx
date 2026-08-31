import { useEffect, useState } from "react";
import PageHero from "../components/layout/PageHero";
import EventCard from "../components/events/EventCard";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";
import { catalogService } from "../services/catalogService";
import eventsHeroImage from "../assets/images/heroes/events-healthcare.jpeg";

export default function Events() {
  const [items, setItems] = useState();
  const [type, setType] = useState("All Events");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    catalogService.getEvents().then(setItems);
  }, []);

  const filtered = items?.filter(
    (x) => type === "All Events" || x.type === type
  );

  return (
    <>
      <PageHero
        title="Events"
        subtitle="Connecting Healthcare. Inspiring Better Tomorrow."
        image={eventsHeroImage}
      />

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:px-8 lg:grid-cols-[220px_1fr]">
        {/* Mobile Filter Toggle */}
        <button
          className="flex w-full items-center justify-center rounded-lg border border-[#79259c] py-3 font-semibold text-[#79259c] transition hover:bg-[#79259c] hover:text-white lg:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Sidebar */}
        <aside
          className={`h-max rounded-xl border border-slate-200 p-5 ${
            showFilters ? "block" : "hidden"
          } lg:block`}
        >
          <h3 className="font-bold">Event Type</h3>

          {[
            "All Events",
            "Health Camp",
            "Webinar",
            "Workshop",
            "Conference",
            "Awareness Program",
          ].map((x) => (
            <label
              key={x}
              className="mt-3 flex items-center gap-2 text-sm text-slate-600"
            >
              <input
                className="accent-[#79259c]"
                type="radio"
                name="event"
                checked={type === x}
                onChange={() => {
                  setType(x);
                  setShowFilters(false); // Auto close on mobile
                }}
              />
              {x}
            </label>
          ))}

          <button
            className="mt-6 w-full rounded-lg border border-[#79259c] py-2 text-sm font-bold text-[#79259c] transition hover:bg-[#79259c] hover:text-white"
            onClick={() => {
              setType("All Events");
              setShowFilters(false);
            }}
          >
            Reset Filters
          </button>
        </aside>

        {/* Events */}
        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#79259c]">
                Upcoming Events
              </h3>

              <small className="text-slate-500">
                Showing {filtered?.length || 0} events
              </small>
            </div>

            <select className="w-full rounded-md border border-slate-200 p-2 text-sm sm:w-auto">
              <option>Upcoming</option>
            </select>
          </div>

          {!items ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {filtered.map((x) => (
                <EventCard key={x.id} event={x} />
              ))}
            </div>
          )}

          <div className="mt-8">
            <Pagination />
          </div>
        </section>
      </main>
    </>
  );
}
