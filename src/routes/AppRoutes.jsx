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

  if (detail) return <ProductDetails id={detail[1]} />;

  const blogDetail = path.match(/^\/blog\/([^/]+)$/);
  if (blogDetail) return <BlogDetails key={rawPath} id={blogDetail[1]} />;

  return (
    {
      "/": <Home />,
      "/products": <Products key={path} query={query} />,
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
  const shouldScrollToTop = useRef(false);

  useEffect(() => {
    let isHistoryNavigation = false;
    const markHistoryNavigation = () => {
      isHistoryNavigation = true;
    };
    const sync = () => {
      const nextPath = current();
      const [, queryString = ""] = nextPath.split("?");
      const isCategoryNavigation = new URLSearchParams(queryString).has("category");
      shouldScrollToTop.current = !isHistoryNavigation && !isCategoryNavigation;
      setPath(nextPath);
      isHistoryNavigation = false;
    };
    addEventListener("popstate", markHistoryNavigation);
    addEventListener("hashchange", sync);
    return () => {
      removeEventListener("popstate", markHistoryNavigation);
      removeEventListener("hashchange", sync);
    };
  }, []);

  // Hash changes are this application's route changes. Scrolling after the
  // next route is rendered makes the behavior reliable for every internal link
  // while leaving browser history restoration and same-page anchors untouched.
  useLayoutEffect(() => {
    if (!shouldScrollToTop.current) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    shouldScrollToTop.current = false;
  }, [path]);

  return (
    <>
      <Navbar />
      {pageFor(path)}
      <Footer />
    </>
  );
}
