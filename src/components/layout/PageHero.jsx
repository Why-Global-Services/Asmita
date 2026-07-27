// import Breadcrumb from "../common/Breadcrumb";
// export default function PageHero({ title, subtitle }) {
//   return (
//     <section className="overflow-hidden bg-gradient-to-r from-[#fbf3fd] via-[#f7edf9] to-[#ebd9f1]">
//       <div className="mx-auto flex min-h-[190px] max-w-7xl items-center justify-between px-5 py-8 sm:px-8">
//         <div>
//           <h1 className="font-serif text-4xl font-semibold text-[#371046] sm:text-5xl">
//             {title}
//           </h1>
//           {subtitle && (
//             <>
//               <h3 className="mt-3 text-base font-bold text-slate-800">
//                 {subtitle}
//               </h3>
//               <p className="mt-1 max-w-xl text-sm text-slate-600">
//                 Discover quality healthcare solutions designed for better
//                 wellbeing.
//               </p>
//             </>
//           )}
//           <Breadcrumb items={[{ label: title }]} />
//         </div>
//         <div
//           aria-hidden="true"
//           className="hidden text-6xl text-[#8f53ae] opacity-70 md:block">
//           ✚　🩺　▣
//         </div>
//       </div>
//     </section>
//   );
// }



import Breadcrumb from "../common/Breadcrumb";

export default function PageHero({ title, subtitle }) {
  return (
    <section className="overflow-hidden bg-gradient-to-r from-[#fbf3fd] via-[#f7edf9] to-[#ebd9f1]">
      <div className="mx-auto flex min-h-[190px] max-w-7xl flex-col items-center justify-center px-5 py-10 text-center sm:px-8 md:min-h-[190px] md:flex-row md:items-center md:justify-between md:py-8 md:text-left">
        <div className="max-w-2xl">
          <h1 className="font-serif text-3xl font-semibold text-[#371046] sm:text-4xl md:text-5xl">
            {title}
          </h1>

          {subtitle && (
            <>
              <h3 className="mt-3 text-sm font-bold text-slate-800 sm:text-base">
                {subtitle}
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600 md:mx-0">
                Discover quality healthcare solutions designed for better
                wellbeing.
              </p>
            </>
          )}

          <div className="mt-4 flex justify-center md:justify-start">
            <Breadcrumb items={[{ label: title }]} />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="mt-8 text-5xl text-[#8f53ae] opacity-70 md:mt-0 md:block md:text-6xl"
        >
          ✚ 🩺 ▣
        </div>
      </div>
    </section>
  );
}