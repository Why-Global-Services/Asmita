import {request} from './http';
import * as mock from './mockData';

const fallback = async (path, data, options) => { try { return await request(path, options); } catch { return data; } };

const categorySubcategories = {
  Medicines: ['Vitamins & Supplements', 'Daily Health'],
  'Medical Equipment': ['Monitoring Devices', 'Clinical Equipment'],
  Disposables: ['Protective Supplies', 'Everyday Essentials'],
  Diagnostics: ['Monitoring Devices', 'Test Kits'],
  'Personal Care': ['Skin Care', 'Hygiene'],
  'First Aid': ['Wound Care', 'Emergency Kits'],
};

const productSubcategories = {
  thermometer: 'Monitoring Devices', stethoscope: 'Clinical Equipment', 'bp-monitor': 'Monitoring Devices', oximeter: 'Monitoring Devices', 'n95-mask': 'Protective Supplies',
  'vitamin-d3': 'Vitamins & Supplements', 'calcium-d3': 'Vitamins & Supplements', 'vitamin-c': 'Vitamins & Supplements', 'omega-3': 'Vitamins & Supplements', multivitamin: 'Daily Health', 'iron-folic': 'Daily Health', zinc: 'Daily Health',
};

const slug = (value) => value.toLowerCase().replaceAll(' ', '-');
const enrichProduct = (product) => ({ ...product, subcategory: product.subcategory || productSubcategories[product.id] });

export const catalogService = {
  getProducts: async (params) => {
    let list = (await fallback('/products', mock.products, {params})).map(enrichProduct);
    if (params?.search) list = list.filter((product) => product.name.toLowerCase().includes(params.search.toLowerCase()));
    if (params?.category) list = list.filter((product) => product.category === params.category || slug(product.category) === params.category);
    if (params?.subcategory) list = list.filter((product) => product.subcategory === params.subcategory);
    return {items: list, total: list.length};
  },
  getProduct: async (id) => enrichProduct(await fallback(`/products/${id}`, mock.products.find((product) => product.id === id))),
  getCategories: async () => (await fallback('/categories', mock.categories)).map((category) => ({ ...category, subcategories: category.subcategories || categorySubcategories[category.name] || [] })),
  getPromotions: () => fallback('/promotions', mock.promotions),
  getEvents: () => fallback('/events', mock.events),
  getBlogs: () => fallback('/blogs', mock.blogs),
};
