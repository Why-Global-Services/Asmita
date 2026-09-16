import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Home from "../_pages/Home";
import Products from "../_pages/Products";
import ProductDetails from "../_pages/ProductDetails";
import Promotions from "../_pages/Promotions";
import NewArrivals from "../_pages/NewArrivals";
import Events from "../_pages/Events";
import Blog from "../_pages/Blog";
import BlogDetails from "../_pages/BlogDetails";
import About from "../_pages/About";
import Contact from "../_pages/Contact";
import TermsConditions from "../_pages/TermsConditions";
import NotFound from "../_pages/NotFound";

function pageFor(rawPath) {
  const [path, queryString = ""] = rawPath.split("?");
  const query = Object.fromEntries(new URLSearchParams(queryString));
  const detailId = query.id;

  if (path === "/products" && detailId) return <ProductDetails key={detailId} id={detailId} />;

  if (path === "/blog" && detailId) return <BlogDetails key={detailId} id={detailId} />;

  return (
    {
      "/": <Home />,
      "/products": <Products key="products-page" query={query} />,
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
    const sync = () => {
      setPath(current());
    };
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [path]);

  return (
    <>
      <Navbar />
      {pageFor(path)}
      <Footer />
    </>
  );
}
