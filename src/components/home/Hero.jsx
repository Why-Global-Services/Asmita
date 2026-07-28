
import { useState } from "react";
import bannerImage from "../../assets/images/banner.png";
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
    copy: "Discover our wide range of high-quality medical products designed for healthcare professionals and everyday medical needs.",
  },
  {
    title: (
      <>
        Your Health.
        <br />
        <em>Our Priority.</em>
      </>
    ),
    copy: "Trusted supplies, quick delivery, and dependable care at every stage of life.",
  },
];
export default function Hero() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const change = (o) => setIndex((index + o + slides.length) % slides.length);
  return (
    <section className="relative min-h-[470px] overflow-hidden">
      {/* Full background image */}
      <img
        src={bannerImage}
        alt="Medical care essentials"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay: light on left (for text), dark on right (over image) */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-black/50" />

      <div className="relative z-10 mx-auto flex min-h-[470px] max-w-7xl items-center px-10 sm:px-16">
        <button
          className="absolute left-4 grid h-10 w-10 place-items-center rounded-full bg-white text-3xl text-slate-500 shadow"
          onClick={() => change(-1)}>
          <span className="-translate-y-[4px] inline-block">
          ‹
          </span>
        </button>

        <div className="relative z-10 max-w-lg">
          <p className="text-xs font-bold tracking-widest text-[#79259c]">
            YOUR TRUSTED HEALTHCARE PARTNER
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-slate-900 sm:text-6xl">
            {slide.title}
          </h1>
          <p className="mt-5 max-w-sm leading-7 text-slate-600">{slide.copy}</p>
          <div className="mt-6 flex gap-3">
            <a href="#/products">
              <Button>Explore Products →</Button>
            </a>
            <a href="#/about">
              <Button variant="outline">Learn More</Button>
            </a>
          </div>
        </div>

        <button
          className="absolute right-4 grid h-10 w-10 place-items-center rounded-full bg-white text-3xl text-slate-500 shadow"
          onClick={() => change(1)}>
       <span className="-translate-y-[4px] inline-block">
          ›
          </span>
        </button>

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              className={`h-2 w-2 rounded-full ${i === index ? "bg-[#79259c]" : "border border-[#b76dce]"}`}
              key={i}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}