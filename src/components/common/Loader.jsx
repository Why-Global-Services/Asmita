export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center gap-3 px-4 text-center text-sm font-semibold text-[#79259c] sm:min-h-[260px]">
      <i className="h-6 w-6 shrink-0 animate-spin rounded-full border-4 border-[#eddaf3] border-t-[#79259c] sm:h-7 sm:w-7" />

      <span className="break-words">{label}</span>
    </div>
  );
}