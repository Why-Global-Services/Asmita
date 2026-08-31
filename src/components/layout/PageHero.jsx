


import Breadcrumb from "../common/Breadcrumb";
import defaultHeroImage from "../../assets/images/heroes/products-tablets.jpeg";

export default function PageHero({ title, subtitle, image = defaultHeroImage }) {
  return (
    <section className="relative w-full min-h-[220px] sm:min-h-[260px] md:min-h-[290px] lg:min-h-[310px] flex items-center overflow-hidden">
      <img
        src={image || defaultHeroImage}
        alt=""
        className="absolute inset-0 z-0 h-full w-full object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-black/40"
      />

      <div className="relative z-[2] mx-auto flex w-full max-w-7xl items-center px-5 py-8 sm:px-8 md:py-10">
        <div className="max-w-2xl">
          <h1 className="font-serif text-3xl font-bold text-white drop-shadow-md sm:text-4xl md:text-5xl">
            {title}
          </h1>

          {subtitle && (
            <h3 className="mt-2 text-sm font-medium text-white/90 drop-shadow sm:text-base">
              {subtitle}
            </h3>
          )}

          <div className="mt-4">
            <Breadcrumb light items={[{ label: title }]} />
          </div>
        </div>
      </div>
    </section>
  );
}
