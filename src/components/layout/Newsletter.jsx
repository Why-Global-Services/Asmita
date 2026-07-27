import { useState } from "react";
import Button from "../common/Button";
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="bg-gradient-to-r from-[#3d1652] via-[#79259c] to-[#b95bd0] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:px-8 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-white/70 text-2xl">
            ✉
          </span>
          <p>
            <b className="block text-lg">Stay Updated!</b>
            <small className="text-white/80">
              Exclusive offers and healthcare updates, delivered to you.
            </small>
          </p>
        </div>
        <form
          className="flex w-full max-w-lg gap-2 lg:ml-auto"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}>
          {sent ? (
            <b className="py-3">Thank you — you are subscribed.</b>
          ) : (
            <>
              <input
                className="min-w-0 flex-1 rounded-md px-4 py-3 text-sm text-slate-900 outline-none"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
              />
              <Button
                className="border border-white bg-[#79259c] hover:bg-[#621b80]"
                type="submit">
                Subscribe
              </Button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
