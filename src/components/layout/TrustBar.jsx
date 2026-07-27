// const benefits = [
//   ["♢", "100% Genuine", "Trusted Quality"],
//   ["✿", "Premium Care", "For Every Need"],
//   ["▣", "Fast Delivery", "Across Angola"],
//   ["♙", "Secure Payment", "Safe & Encrypted"],
//   ["◔", "Customer Support", "We’re here to help!"],
// ];
// export default function TrustBar() {
//   return (
//     <section
//       aria-label="Asmita service benefits"
//       className="border-y border-[#f0e6f3] bg-white">
//       <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-5 py-6 sm:grid-cols-3 lg:grid-cols-5">
//         {benefits.map(([icon, title, text]) => (
//           <div key={title} className="flex items-center gap-3">
//             <i className="text-3xl not-italic text-[#79259c]">{icon}</i>
//             <p>
//               <b className="block text-sm text-slate-900">{title}</b>
//               <small className="text-xs text-slate-500">{text}</small>
//             </p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }


const benefits = [
  ["♢", "100% Genuine", "Trusted Quality"],
  ["✿", "Premium Care", "For Every Need"],
  ["▣", "Fast Delivery", "Across Angola"],
  ["♙", "Secure Payment", "Safe & Encrypted"],
  ["◔", "Customer Support", "We're here to help!"],
];

export default function TrustBar() {
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
