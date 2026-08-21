
import { useEffect, useState } from "react";
import careReliefBanner from "../../assets/images/banners/care-relief.jpeg";
import everydayCareBanner from "../../assets/images/banners/everyday-care.jpeg";
import wellbeingBanner from "../../assets/images/banners/wellbeing.jpeg";
import hospitalCareBanner from "../../assets/images/banners/hospital-care.jpeg";
import Button from "../common/Button";

const slides = [
  {
    image: careReliefBanner,
    alt: "Asmita products for pain relief, inflammation and infection care",
    title: "Essential Care. Better Tomorrow.",
    copy: "Discover our range of high-quality medical products.",
  },
  {
    image: everydayCareBanner,
    alt: "Asmita everyday healthcare products for the whole family",
    title: "Your Health. Our Priority.",
    copy: "Trusted supplies and dependable care for every stage of life.",
  },
  {
    image: wellbeingBanner,
    alt: "Asmita health and wellbeing product range",
    title: "Health and wellbeing in every choice.",
    copy: "Quality healthcare solutions for the whole family.",
  },
  {
    image: hospitalCareBanner,
    alt: "Asmita hospital medicines and medical supplies",
    title: "Quality that saves lives.",
    copy: "Reliable medical products for healthcare professionals.",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const autoplay = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      3800
    );
    return () => window.clearInterval(autoplay);
  }, []);

  const change = (offset) =>
    setIndex((current) => (current + offset + slides.length) % slides.length);

  return (
    <section className="relative aspect-[3/2] w-full overflow-hidden bg-slate-950" aria-label="Asmita healthcare highlights">
      {slides.map((slide, slideIndex) => (
        <img
          key={slide.image}
          src={slide.image}
          alt={slide.alt}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ease-in-out ${slideIndex === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
        />
      ))}

      <div className="sr-only" aria-live="polite">
        <h1>{slides[index].title}</h1>
        <p>{slides[index].copy}</p>
      </div>

      <div className="absolute inset-0">
        <button
          type="button"
          aria-label="Show previous banner"
          className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-2xl text-slate-600 shadow-sm transition hover:bg-white sm:left-4 sm:h-10 sm:w-10"
          onClick={() => change(-1)}
        >
          <span className="-translate-y-px">‹</span>
        </button>

        <button
          type="button"
          aria-label="Show next banner"
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-2xl text-slate-600 shadow-sm transition hover:bg-white sm:right-4 sm:h-10 sm:w-10"
          onClick={() => change(1)}
        >
          <span className="-translate-y-px">›</span>
        </button>

        <div className="absolute bottom-3 right-3 flex gap-2 sm:bottom-5 sm:right-5">
          <a href="#/products" aria-label="Explore products">
            <Button className="px-3 py-2 text-xs sm:px-4 sm:text-sm">Explore Products</Button>
          </a>
          <a href="#/about" aria-label="Learn more about Asmita">
            <Button variant="outline" className="bg-white/90 px-3 py-2 text-xs sm:px-4 sm:text-sm">Learn More</Button>
          </a>
        </div>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-5 sm:gap-2">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`Show banner ${slideIndex + 1}`}
              aria-current={slideIndex === index}
              onClick={() => setIndex(slideIndex)}
              className={`h-2 w-2 rounded-full transition sm:h-2.5 sm:w-2.5 ${slideIndex === index ? "bg-white" : "border border-white bg-black/20"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
