import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Promotions from "../pages/Promotions";
import NewArrivals from "../pages/NewArrivals";
import Events from "../pages/Events";
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";
import About from "../pages/About";
import Contact from "../pages/Contact";
import TermsConditions from "../pages/TermsConditions";
import NotFound from "../pages/NotFound";

function pageFor(rawPath) {
  const [path, queryString = ""] = rawPath.split("?");
  const query = Object.fromEntries(new URLSearchParams(queryString));
  const detail = path.match(/^\/products\/([^/]+)$/);

  if (detail) return <ProductDetails key={detail[1]} id={detail[1]} />;

  const blogDetail = path.match(/^\/blog\/([^/]+)$/);
  if (blogDetail) return <BlogDetails key={blogDetail[1]} id={blogDetail[1]} />;

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
