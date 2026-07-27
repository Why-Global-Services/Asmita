import { useState } from "react";
import Button from "../common/Button";

const slides = [
  {
    title: (
      <>
        Essential Care.
        <br />
        <em>Better Tomorrow.</em>
      </>
    ),
    copy:
      "Discover our wide range of high-quality medical products designed for healthcare professionals and everyday medical needs.",
  },
  {
    title: (
      <>
        Your Health.
        <br />
        <em>Our Priority.</em>
      </>
    ),
    copy:
      "Trusted supplies, quick delivery, and dependable care at every stage of life.",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  const slide = slides[index];

  const change = (offset) =>
    setIndex((index + offset + slides.length) % slides.length);

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-white via-[#fcf4fd] to-[#edd9f2]">
      <div className="mx-auto flex min-h-[520px] max-w-7xl items-center justify-center px-14 py-16 text-center sm:min-h-[470px] sm:justify-start sm:px-16 sm:py-0 sm:text-left">
        {/* Previous Button */}
        <button
          className="absolute left-2 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl text-slate-500 shadow transition hover:text-[#79259c] sm:left-4 sm:h-10 sm:w-10 sm:text-3xl"
          onClick={() => change(-1)}
        >
              <span className="-translate-y-[4px] inline-block">
          ‹
          </span>
        </button>

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <p className="text-xs font-bold tracking-widest text-[#79259c]">
            YOUR TRUSTED HEALTHCARE PARTNER
          </p>

          <h1 className="mt-4 font-serif text-4xl leading-tight text-slate-900 sm:text-6xl">
            {slide.title}
          </h1>

          <p className="mx-auto mt-5 max-w-md leading-7 text-slate-600 sm:mx-0 sm:max-w-sm">
            {slide.copy}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-6 sm:flex-row">
            <a href="#/products" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                Explore Products →
              </Button>
            </a>

            <a href="#/about" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </a>
          </div>
        </div>

        {/* Illustration (Desktop Only - Same as Original) */}
        <div className="absolute right-[9%] hidden text-[150px] sm:block">
          🩺<span className="text-[#8e42aa]">✚</span>🌡️
        </div>

        {/* Next Button */}
        <button
          className="absolute right-2 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl text-slate-500 shadow transition hover:text-[#79259c] sm:right-4 sm:h-10 sm:w-10 sm:text-3xl"
          onClick={() => change(1)}
        >
           <span className="-translate-y-[4px] inline-block">
          ›
          </span>
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === index
                  ? "bg-[#79259c]"
                  : "border border-[#b76dce]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}