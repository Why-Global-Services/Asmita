import { request } from './http';
import {
  productMatchesCategory,
  productMatchesSubcategory,
} from '../utils/categoryNavigation';

const slug = (value) => (value ? String(value).toLowerCase().replaceAll(' ', '-') : '');

const fetchApi = async (path, options) => {
  try {
    const res = await request(path, options);
    if (res && res.data !== undefined) return res.data;
    return res;
  } catch {
    return null;
  }
};

const normalizeProduct = (product) => {
  if (!product) return product;
  const id = product._id || product.id;
  const name = product.productTitle || product.name || 'Product';
  const catName = product.categoryName || product.categoryTitle || product.category || '';
  const subCatName = product.subCategoryName || product.subCategoryTitle || product.subcategory || '';
  return {
    ...product,
    id,
    _id: id,
    name,
    productTitle: name,
    price: product.price !== undefined ? product.price : 0,
    category: catName,
    categoryName: catName,
    categoryTitle: catName,
    subcategory: subCatName,
    subCategoryName: subCatName,
    subCategoryTitle: subCatName,
    productImages: product.productImages || (product.image ? [product.image] : []),
    emoji: product.emoji || '🩺',
    rating: product.rating || 4.5,
    inStock: product.status !== undefined ? Boolean(product.status) : true,
    description: product.description || product.productDescription || '',
    productDescription: product.productDescription || product.description || '',
    categoryId: product.categoryId || id,
    subCategoryId: product.subCategoryId || '',
    ingredients: Array.isArray(product.ingredients) ? product.ingredients : [],
    additionalInformation: product.additionalInformation || '',
  };
};

const normalizeCategory = (cat, subCategoryMap = {}) => {
  if (!cat) return cat;
  const id = cat._id || cat.id;
  const name = cat.categoryTitle || cat.name || 'Category';
  const dynamicSubcats = subCategoryMap[id] || subCategoryMap[name] || (Array.isArray(cat.subcategories) ? cat.subcategories : []);
  return {
    ...cat,
    id,
    _id: id,
    name,
    categoryTitle: name,
    categoryImage: cat.categoryImage || cat.image,
    categoryDescription: cat.categoryDescription || cat.description || '',
    icon: cat.icon || '💊',
    subcategories: dynamicSubcats,
  };
};

const normalizeEvent = (ev) => {
  if (!ev) return ev;
  const id = ev._id || ev.id;
  let dayStr = ev.day;
  if (!dayStr && ev.eventDate) {
    const d = new Date(ev.eventDate);
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    dayStr = `${day} ${month}`;
  }
  return {
    ...ev,
    id,
    _id: id,
    type: ev.eventType || ev.type || 'Health Camp',
    title: ev.title,
    day: dayStr || '25 MAY',
    emoji: ev.emoji || '📅',
    date: ev.eventDate ? new Date(ev.eventDate).toISOString().split('T')[0] : ev.date,
    location: ev.location || 'Luanda, Angola',
    time: (ev.startTime && ev.endTime) ? `${ev.startTime} - ${ev.endTime}` : (ev.time || '09:00 AM - 01:00 PM'),
    description: ev.description || '',
    bannerImage: ev.bannerImage || '',
  };
};

const normalizeBlog = (bl) => {
  if (!bl) return bl;
  const id = bl._id || bl.slug || bl.id;
  return {
    ...bl,
    id,
    _id: id,
    title: bl.title,
    excerpt: bl.excerpt || (bl.content ? bl.content.slice(0, 120) + '...' : ''),
    emoji: bl.emoji || '🩺',
    category: bl.category || 'Healthcare',
    publishedAt: bl.createdAt ? new Date(bl.createdAt).toISOString().split('T')[0] : (bl.publishedAt || '2026-05-10'),
    coverImage: bl.coverImage || '',
    content: bl.content || '',
    slug: bl.slug || id,
  };
};

export const catalogService = {
  getProducts: async (params) => {
    let apiData = await fetchApi('/getAllActiveProducts', { params });
    let list = Array.isArray(apiData) ? apiData.map(normalizeProduct) : [];
    if (params?.search) list = list.filter((product) => product.name.toLowerCase().includes(params.search.toLowerCase()));
    if (params?.category) list = list.filter((product) => productMatchesCategory(product, params.category));
    if (params?.subcategory) list = list.filter((product) => productMatchesSubcategory(product, params.subcategory));
    return { items: list, total: list.length };
  },

  getProduct: async (id) => {
    if (!id) return null;
    let apiData = await fetchApi(`/getActiveProducts/${id}`);
    let rawProduct = null;
    if (Array.isArray(apiData) && apiData.length) {
      rawProduct = apiData[0]?.mainProduct || apiData[0];
    } else if (apiData && typeof apiData === 'object') {
      rawProduct = apiData.mainProduct || apiData.data || apiData;
    }
    if (!rawProduct || !rawProduct._id) {
      const allRes = await fetchApi('/getAllActiveProducts');
      if (Array.isArray(allRes)) {
        rawProduct = allRes.find(
          (p) =>
            (p._id && String(p._id) === String(id)) ||
            (p.id && String(p.id) === String(id)) ||
            (p.productTitle && slug(p.productTitle) === slug(id))
        );
      }
    }
    return rawProduct ? normalizeProduct(rawProduct) : null;
  },

  getCategories: async () => {
    const [categoriesRes, subCategoriesRes] = await Promise.all([
      fetchApi('/getActiveCategory'),
      fetchApi('/getActiveSubCategory'),
    ]);

    const activeSubcategories = Array.isArray(subCategoriesRes) ? subCategoriesRes : [];
    const subCategoryMap = {};

    activeSubcategories.forEach((sub) => {
      if (!sub || sub.status === false) return;
      const subTitle = sub.subCategoryTitle || sub.name || sub.title;
      if (!subTitle) return;

      const subItem = {
        id: sub._id || sub.id,
        _id: sub._id || sub.id,
        name: subTitle,
        subCategoryTitle: subTitle,
        categoryId: sub.categoryId,
        categoryTitle: sub.categoryTitle,
      };

      const pushSub = (key) => {
        if (!key) return;
        if (!subCategoryMap[key]) subCategoryMap[key] = [];
        if (!subCategoryMap[key].some((existing) => existing.id === subItem.id || existing.name === subTitle)) {
          subCategoryMap[key].push(subItem);
        }
      };

      pushSub(sub.categoryId);
      pushSub(sub.categoryTitle);
    });

    let list = Array.isArray(categoriesRes)
      ? categoriesRes
          .filter((cat) => cat && cat.status !== false)
          .map((cat) => normalizeCategory(cat, subCategoryMap))
      : [];
    return list;
  },

  getPromotions: async () => {
    return [];
  },

  getEvents: async () => {
    let apiData = await fetchApi('/getActiveEvents');
    let list = Array.isArray(apiData) ? apiData.map(normalizeEvent) : [];
    return list;
  },

  getBlogs: async () => {
    let apiData = await fetchApi('/getActiveBlogs');
    let list = Array.isArray(apiData) ? apiData.map(normalizeBlog) : [];
    return list;
  },

  getBlog: async (idOrSlug) => {
    if (!idOrSlug) return null;
    let apiData = await fetchApi(`/getBlogById/${idOrSlug}`);
    if (!apiData) {
      apiData = await fetchApi(`/getBlogBySlug/${idOrSlug}`);
    }
    let rawBlog = null;
    if (apiData && typeof apiData === 'object') {
      rawBlog = apiData.data || apiData.mainBlog || apiData;
    }
    return rawBlog && (rawBlog._id || rawBlog.title || rawBlog.slug) ? normalizeBlog(rawBlog) : null;
  },

  createContact: async (contactData) => {
    return await request('/createContact', {
      method: 'POST',
      body: contactData,
    });
  },

  bookProduct: async (bookingData) => {
    return await request('/bookProductForm', {
      method: 'POST',
      body: bookingData,
    });
  },
};


