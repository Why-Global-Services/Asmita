import { useEffect, useMemo, useState } from 'react';
import { catalogService } from '../../services/catalogService';
import SearchBar from './SearchBar';

type Category = { id: string; name: string; subcategories?: string[] };
type Product = { id: string; name: string; category: string; subcategory?: string };

type HeaderSearchProps = { categories: Category[]; onNavigate?: () => void };

const matches = (value: string, query: string) => value.toLowerCase().includes(query.toLowerCase());

export default function HeaderSearch({ categories, onNavigate }: HeaderSearchProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    catalogService.getProducts().then((response: { items: Product[] }) => setProducts(response.items));
  }, []);

  const results = useMemo(() => {
    const term = query.trim();
    if (!term) return [];
    const categoryMatches = categories.filter((category) => matches(category.name, term)).map((category) => ({ key: `category-${category.id}`, label: category.name, meta: 'Category', href: `#/products?category=${encodeURIComponent(category.name)}` }));
    const subcategoryMatches = categories.flatMap((category) => (category.subcategories || []).filter((subcategory) => matches(subcategory, term)).map((subcategory) => ({ key: `subcategory-${category.id}-${subcategory}`, label: subcategory, meta: category.name, href: `#/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory)}` })));
    const productMatches = products.filter((product) => matches(product.name, term)).map((product) => ({ key: `product-${product.id}`, label: product.name, meta: product.category, href: `#/products/${product.id}` }));
    return [...productMatches, ...categoryMatches, ...subcategoryMatches].slice(0, 7);
  }, [categories, products, query]);

  const close = () => { setFocused(false); setQuery(''); onNavigate?.(); };
  const submit = (term: string) => { const value = term.trim(); if (!value) return; window.location.hash = `/products?search=${encodeURIComponent(value)}`; close(); };

  return <div className="relative"><SearchBar value={query} onChange={setQuery} onSearch={submit} onFocus={() => setFocused(true)} placeholder="Search products" className="max-w-none" />{focused && query.trim() && <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">{results.length ? results.map((result) => <a key={result.key} href={result.href} onClick={close} className="flex items-center justify-between gap-3 border-b border-slate-100 px-3 py-2 text-sm last:border-0 hover:bg-[#faf4fc]"><span className="min-w-0 truncate font-semibold text-slate-800">{result.label}</span><small className="shrink-0 text-xs text-[#79259c]">{result.meta}</small></a>) : <p className="px-3 py-3 text-sm text-slate-500">No matching products, categories, or subcategories.</p>}</div>}</div>;
}
