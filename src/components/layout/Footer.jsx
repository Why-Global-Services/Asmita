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
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gradient-to-br from-[#24102f] to-[#4d155f] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 text-center sm:grid-cols-2 sm:px-8 sm:text-left lg:grid-cols-4">
        {/* Company */}
        <div>
          <a href="#/" onClick={scrollToTop} className="font-serif text-3xl font-bold">
            ✦Asmita
          </a>

          <small className="block text-white/70">
            Comercio,(Su),Lda
          </small>

          <p className="mx-auto mt-5 max-w-xs text-sm leading-6 text-white/75 sm:mx-0">
            Your trusted partner in quality medical products and healthcare
            solutions.
          </p>

          <div className="mt-5 flex justify-center gap-5 text-xl sm:justify-start">
            <span>◉</span>
            <span>♥</span>
            <span>◎</span>
            <span>in</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <b className="text-sm">Quick Links</b>

          <nav className="mt-4 grid gap-3">
            {links.map(([name, path]) => (
              <a
                key={path}
                href={"#" + path}
                onClick={scrollToTop}
                className="text-sm text-white/75 transition hover:text-white"
              >
                {name}
              </a>
            ))}
          </nav>
        </div>

        {/* Customer Service */}
        <div>
          <b className="text-sm">Customer Service</b>

          <nav className="mt-4 grid gap-3">
            {[
              ["Terms & Conditions", "/terms-and-conditions"],
              ["Privacy Policy", "/contact"],
              ["FAQ", "/contact"],
            ].map(([name, path]) => (
              <a
                key={name}
                href={`#${path}`}
                onClick={scrollToTop}
                className="text-sm text-white/75 transition hover:text-white"
              >
                {name}
              </a>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <b className="text-sm">Contact Us</b>

          <div className="mt-4 grid gap-3 text-sm text-white/75">
            <p>☎ +244 923 456 789</p>
            <p>✉ info@asmitaangola.com</p>
            <p>⌖ Luanda, Angola</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/15 px-5 py-5 text-center text-xs text-white/60 sm:px-8 sm:text-left">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
          <p>© 2026 Asmita Angola. All Rights Reserved.</p>

          <p>Designed with ♥ by Asmita Angola</p>
        </div>
      </div>
    </footer>
  );
}
