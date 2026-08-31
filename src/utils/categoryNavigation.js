export const normalizeCategoryString = (str) =>
  String(str || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const categorySlug = (category) => {
  if (!category) return "";
  if (typeof category === "object") {
    const raw =
      category.slug ||
      category.name ||
      category.categoryTitle ||
      category.title ||
      category.id ||
      category._id ||
      "";
    return categorySlug(raw);
  }
  const normalized = normalizeCategoryString(category);
  // Unify common alias/database variations (e.g. DESCARTAVELS vs DESCARTAVEIS / Disposables)
  if (
    normalized === "descartavels" ||
    normalized === "descartaveis" ||
    normalized === "descartavel" ||
    normalized === "disposables"
  ) {
    return "descartaveis";
  }
  return normalized;
};

export const categoryProductSectionId = (category) => {
  const slug = categorySlug(category);
  return slug ? `category-products-${slug}` : "category-products-all";
};

export const isSameCategory = (catA, catB) => {
  if (!catA || !catB) return false;

  const idA = typeof catA === "object" ? catA.id || catA._id : catA;
  const idB = typeof catB === "object" ? catB.id || catB._id : catB;
  if (idA && idB && String(idA) === String(idB)) {
    return true;
  }

  const slugA = categorySlug(catA);
  const slugB = categorySlug(catB);
  if (slugA && slugB && slugA === slugB) {
    return true;
  }

  return false;
};

export const productMatchesCategory = (product, categoryFilter) => {
  if (!categoryFilter) return true;
  if (!product) return false;

  if (isSameCategory(product.categoryId, categoryFilter)) return true;
  if (isSameCategory(product.category, categoryFilter)) return true;
  if (isSameCategory(product.categoryTitle, categoryFilter)) return true;
  if (isSameCategory(product.categoryName, categoryFilter)) return true;
  if (isSameCategory(product._id, categoryFilter)) return true;
  if (isSameCategory(product.id, categoryFilter)) return true;

  return false;
};

export const productMatchesSubcategory = (product, subcategoryFilter) => {
  if (!subcategoryFilter) return true;
  if (!product) return false;

  if (isSameCategory(product.subCategoryId, subcategoryFilter)) return true;
  if (isSameCategory(product.subcategory, subcategoryFilter)) return true;
  if (isSameCategory(product.subCategoryName, subcategoryFilter)) return true;
  if (isSameCategory(product.subCategoryTitle, subcategoryFilter)) return true;

  const subFilterNorm = normalizeCategoryString(subcategoryFilter);
  const prodSub =
    product.subcategory ||
    product.subCategoryName ||
    product.subCategoryTitle ||
    "";
  const prodSubNorm = normalizeCategoryString(prodSub);

  return prodSubNorm === subFilterNorm || prodSub === subcategoryFilter;
};

export const getCategoryRoute = (category, subcategory = "") => {
  const categoryParam =
    typeof category === "string"
      ? category
      : category?.name ||
        category?.categoryTitle ||
        category?.title ||
        category?.id ||
        "";

  const params = new URLSearchParams();
  if (categoryParam) {
    params.set("category", categoryParam);
  }
  if (subcategory) {
    const subcategoryParam =
      typeof subcategory === "string"
        ? subcategory
        : subcategory?.subCategoryTitle ||
          subcategory?.name ||
          subcategory?.title ||
          "";
    if (subcategoryParam) {
      params.set("subcategory", subcategoryParam);
    }
  }
  return params.size ? `/products?${params.toString()}` : "/products";
};

export const getCategoryHeading = (categoryFilter, categories = []) => {
  if (!categoryFilter) return "Healthcare Products";

  if (Array.isArray(categories)) {
    const matched = categories.find((c) => isSameCategory(c, categoryFilter));
    if (matched) {
      return `${matched.name || matched.categoryTitle} Products`;
    }
  }

  return `${categoryFilter} Products`;
};

export const scrollToCategorySection = (category, behavior = "smooth") => {
  const targetId = category ? categoryProductSectionId(category) : null;
  const element =
    (targetId ? document.getElementById(targetId) : null) ||
    document.querySelector("[data-category-product-section]") ||
    document.getElementById("products-listing-section");

  if (!element) return false;

  const header = document.querySelector("header");
  const headerHeight = header ? header.getBoundingClientRect().height : 92;
  const extraOffset = 18;
  const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
  const targetY = Math.max(0, elementTop - headerHeight - extraOffset);

  window.scrollTo({
    top: targetY,
    behavior,
  });

  return true;
};
