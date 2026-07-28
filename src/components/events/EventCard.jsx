import Button from "../common/Button";

export default function EventCard({ event }) {
  const [day, month] = event.day.split(" ");

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md sm:p-2">
      <div className="relative grid h-36 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-[#d7e3eb] to-[#f4eaf7] text-6xl sm:h-32">
        <span className="absolute left-2 top-2 rounded bg-white px-2 py-1 text-[10px] font-bold text-[#79259c]">
          {event.type}
        </span>

        <i className="not-italic">{event.emoji}</i>

        <b className="absolute right-2 top-0 rounded-b-lg bg-white px-3 py-2 text-2xl text-[#79259c]">
          {day}
          <small className="block text-center text-[10px]">
            {month}
          </small>
        </b>
      </div>

      <div className="p-2">
        <h3 className="min-h-[48px] text-base font-bold leading-6 text-slate-900 sm:min-h-10 sm:text-sm sm:leading-normal">
          {event.title}
        </h3>

        <small className="mt-2 block text-xs text-slate-500 sm:mt-1 sm:text-[10px]">
          ▧ {event.day} 2026 &nbsp; ◷ {event.time}
        </small>

        <small className="mt-1 block text-xs text-slate-500 sm:text-[10px]">
          ⌖ {event.location}
        </small>

        <a className="mt-4 block sm:mt-3 sm:inline-block" href="#/events">
          <Button
            variant="outline"
            className="w-full px-4 py-2 text-sm sm:w-auto sm:px-3 sm:py-1 sm:text-xs"
          >
            View Details
          </Button>
        </a>
      </div>
    </article>
  );
}