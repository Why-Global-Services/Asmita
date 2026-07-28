// import Button from "../common/Button";
// import { date } from "../../utils/formatters";
// export default function PromotionCard({ promotion }) {
//   return (
//     <article className="relative min-h-[255px] overflow-hidden rounded-xl border border-[#ead7ef] bg-gradient-to-br from-white to-[#f1dcf5] p-7 shadow-sm">
//       <span className="text-xs font-bold uppercase tracking-wider text-[#79259c]">
//         {promotion.label}
//       </span>
//       <b className="float-right rounded-full bg-[#79259c] px-3 py-1 text-xs text-white">
//         Enquiry
//       </b>
//       <h3 className="mt-5 max-w-[220px] font-serif text-3xl leading-tight text-[#301334]">
//         {promotion.title}
//       </h3>
//       <p className="mt-3 max-w-[210px] text-sm text-slate-600">
//         {promotion.description}
//       </p>
//       <small className="mt-4 block text-xs font-semibold text-[#79259c]">
//         Expires {date(promotion.expiresAt)}
//       </small>
//       <a className="relative z-10 mt-4 inline-block" href="#/products">
//         <Button>Enquiry Now</Button>
//       </a>
//       <i className="absolute bottom-1 right-3 text-8xl not-italic opacity-70">
//         {promotion.emoji}
//       </i>
//     </article>
//   );
// }


import Button from "../common/Button";
import { date } from "../../utils/formatters";

export default function PromotionCard({ promotion }) {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-xl border border-[#ead7ef] bg-gradient-to-br from-white to-[#f1dcf5] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:min-h-[255px] sm:p-7">
      {/* Label & Badge */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#79259c]">
          {promotion.label}
        </span>

        <span className="rounded-full bg-[#79259c] px-3 py-1 text-xs font-semibold text-white">
          Enquiry
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-5 flex flex-1 flex-col">
        <h3 className="max-w-full font-serif text-2xl leading-tight text-[#301334] sm:max-w-[220px] sm:text-3xl">
          {promotion.title}
        </h3>

        <p className="mt-3 max-w-full text-sm leading-6 text-slate-600 sm:max-w-[210px]">
          {promotion.description}
        </p>

        <small className="mt-4 block text-xs font-semibold text-[#79259c]">
          Expires {date(promotion.expiresAt)}
        </small>

        <a href="#/products" className="mt-5 py-4 inline-block sm:mt-auto">
          <Button className="w-full sm:w-auto">
            Enquiry Now
          </Button>
        </a>
      </div>

      {/* Background Emoji */}
      <div className="pointer-events-none absolute bottom-2 right-2 text-6xl opacity-20 sm:bottom-1 sm:right-3 sm:text-8xl sm:opacity-70">
        {promotion.emoji}
      </div>
    </article>
  );
}