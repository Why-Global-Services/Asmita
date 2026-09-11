"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "../common/Button";
import { useLanguage } from "../../i18n/LanguageContext";

const careReliefBanner = "/images/banners/care-relief.jpeg";
const everydayCareBanner = "/images/banners/everyday-care.jpeg";
const wellbeingBanner = "/images/banners/wellbeing.jpeg";
const hospitalCareBanner = "/images/banners/hospital-care.jpeg";

export default function Hero() {
  const [index, setIndex] = useState(0);
  const { t } = useLanguage();

  const slides = [
    {
      image: careReliefBanner,
      alt: "Asmita products for pain relief, inflammation and infection care",
      title: t("hero.slide1_title"),
      copy: t("hero.slide1_copy"),
    },
    {
      image: everydayCareBanner,
      alt: "Asmita everyday healthcare products for the whole family",
      title: t("hero.slide2_title"),
      copy: t("hero.slide2_copy"),
    },
    {
      image: wellbeingBanner,
      alt: "Asmita health and wellbeing product range",
      title: t("hero.slide3_title"),
      copy: t("hero.slide3_copy"),
    },
    {
      image: hospitalCareBanner,
      alt: "Asmita hospital medicines and medical supplies",
      title: t("hero.slide4_title"),
      copy: t("hero.slide4_copy"),
    },
  ];

  useEffect(() => {
    const autoplay = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      3800
    );
    return () => window.clearInterval(autoplay);
  }, [slides.length]);

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
          aria-label={t("hero.prev_banner")}
          className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-2xl text-slate-600 shadow-sm transition hover:bg-white sm:left-4 sm:h-10 sm:w-10"
          onClick={() => change(-1)}
        >
          <span className="-translate-y-px">‹</span>
        </button>

        <button
          type="button"
          aria-label={t("hero.next_banner")}
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-2xl text-slate-600 shadow-sm transition hover:bg-white sm:right-4 sm:h-10 sm:w-10"
          onClick={() => change(1)}
        >
          <span className="-translate-y-px">›</span>
        </button>

        <div className="absolute bottom-3 right-3 flex gap-2 sm:bottom-5 sm:right-5">
          <Link href="/products" aria-label={t("hero.explore_products")}>
            <Button className="px-3 py-2 text-xs sm:px-4 sm:text-sm">{t("hero.explore_products")}</Button>
          </Link>
          <Link href="/about" aria-label={t("hero.learn_more")}>
            <Button variant="outline" className="bg-white/90 px-3 py-2 text-xs sm:px-4 sm:text-sm">{t("hero.learn_more")}</Button>
          </Link>
        </div>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-5 sm:gap-2">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.image}
              type="button"
              aria-label={t("hero.banner_slide", { index: slideIndex + 1 })}
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
