import Newsletter from "./Newsletter";
const links = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Products", "/products"],
  ["Promotions", "/promotions"],
  ["New Arrivals", "/new-arrivals"],
  ["Events", "/events"],
  ["Blog", "/blog"],
  ["Contact Us", "/contact"],
];
export default function Footer() {
  return (
    <>
      <Newsletter />
      <footer className="bg-gradient-to-br from-[#24102f] to-[#4d155f] text-white">
        <div className="mx-auto grid max-w-7xl gap-9 px-5 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          <div>
            <a href="#/" className="font-serif text-3xl font-bold">
              ✦Asmita
            </a>
            <small className="block text-white/70">Comercio,(Su),Lda</small>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/75">
              Your trusted partner in quality medical products and healthcare
              solutions.
            </p>
            <p className="mt-4 flex gap-4 text-lg">
              <span>◉</span>
              <span>♥</span>
              <span>◎</span>
              <span>in</span>
            </p>
          </div>
          <div>
            <b className="text-sm">Quick Links</b>
            <nav className="mt-4 grid gap-2">
              {links.map(([name, path]) => (
                <a
                  className="text-xs text-white/75 hover:text-white"
                  key={path}
                  href={"#" + path}>
                  {name}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <b className="text-sm">Customer Service</b>
            <nav className="mt-4 grid gap-2">
              {[
                "Shipping Policy",
                "Return & Refund Policy",
                "Terms & Conditions",
                "Privacy Policy",
                "FAQ",
              ].map((name) => (
                <a
                  className="text-xs text-white/75 hover:text-white"
                  key={name}
                  href="#/contact">
                  {name}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <b className="text-sm">Contact Us</b>
            <div className="mt-4 grid gap-3 text-xs text-white/75">
              <p>☎　+244 923 456 789</p>
              <p>✉　info@asmitaangola.com</p>
              <p>⌖　Luanda, Angola</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/15 px-5 py-4 text-center text-xs text-white/60 sm:px-8">
          © 2026 Asmita Angola. All Rights Reserved.{" "}
          <span className="sm:float-right">
            Designed with ♥ by Asmita Angola
          </span>
        </div>
      </footer>
    </>
  );
}
