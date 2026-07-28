import { useState } from "react";
import PageHero from "../components/layout/PageHero";
import Button from "../components/common/Button";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero title="Contact Us" />

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:gap-10 md:px-8 md:py-12">
        {/* Contact Details */}
        <section>
          <p className="text-xs font-bold tracking-widest text-[#79259c]">
            GET IN TOUCH
          </p>

          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
            We would love to hear from you
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Our healthcare support team is ready to help.
          </p>

          <div className="mt-7 grid gap-4 text-sm text-slate-700">
            <p>☎ +244 923 456 789</p>
            <p>✉ info@asmitaangola.com</p>
            <p>⌖ Luanda, Angola</p>
            <p>◉ ♥ ◎ in</p>
          </div>

          <div className="mt-8 grid h-40 place-items-center rounded-xl bg-slate-100 text-center text-sm font-bold text-slate-500 sm:h-44">
            Map location — Luanda, Angola
          </div>
        </section>

        {/* Contact Form */}
        <form
          className="grid gap-4 rounded-xl border border-slate-200 p-5 shadow-sm sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <input
            className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-[#79259c]"
            required
            placeholder="Your name"
          />

          <input
            className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-[#79259c]"
            required
            type="email"
            placeholder="Email address"
          />

          <input
            className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-[#79259c]"
            placeholder="Phone number"
          />

          <textarea
            className="min-h-28 rounded-lg border border-slate-200 p-3 outline-none focus:border-[#79259c] sm:min-h-32"
            required
            placeholder="How can we help?"
          />

          {sent ? (
            <b className="rounded-lg bg-[#f7eafb] p-3 text-center text-[#79259c]">
              Thank you — we will be in touch shortly.
            </b>
          ) : (
            <Button className="w-full sm:w-auto" type="submit">
              Send Message
            </Button>
          )}
        </form>
      </main>
    </>
  );
}