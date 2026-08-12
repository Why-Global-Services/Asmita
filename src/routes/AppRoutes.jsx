import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Promotions from "../pages/Promotions";
import NewArrivals from "../pages/NewArrivals";
import Events from "../pages/Events";
import Blog from "../pages/Blog";
import About from "../pages/About";
import Contact from "../pages/Contact";
import TermsConditions from "../pages/TermsConditions";
import NotFound from "../pages/NotFound";

function pageFor(rawPath) {
  const [path, queryString = ""] = rawPath.split("?");
  const query = Object.fromEntries(new URLSearchParams(queryString));
  const detail = path.match(/^\/products\/([^/]+)$/);

  if (detail) return <ProductDetails id={detail[1]} />;

  return (
    {
      "/": <Home />,
      "/products": <Products key={rawPath} query={query} />,
      "/promotions": <Promotions />,
      "/promotion": <Promotions />,
      "/new-arrivals": <NewArrivals />,
      "/events": <Events />,
      "/blog": <Blog />,
      "/about": <About />,
      "/contact": <Contact />,
      "/terms-and-conditions": <TermsConditions />,
    }[path] || <NotFound />
  );
}

export default function AppRoutes() {
  const current = () => location.hash.replace(/^#/, "") || "/";
  const [path, setPath] = useState(current);

  useEffect(() => {
    const sync = () => setPath(current());
    addEventListener("hashchange", sync);
    return () => removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  return (
    <>
      <Navbar />
      {pageFor(path)}
      <Footer />
    </>
  );
}
