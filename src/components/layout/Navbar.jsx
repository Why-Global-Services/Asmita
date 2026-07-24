import { useEffect, useState } from 'react';
import AsmitaLogo from './AsmitaLogo';
import NavigationDropdown from './NavigationDropdown';
import HeaderSearch from '../common/HeaderSearch';
import { catalogService } from '../../services/catalogService';

const links = [['Home', '/'], ['About Us', '/about'], ['Products', '/products'], ['Promotion', '/promotions'], ['New Arrivals', '/new-arrivals'], ['Events', '/events'], ['Blog', '/blog'], ['Contact Us', '/contact']];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => { catalogService.getCategories().then(setCategories); }, []);
  const close = () => setOpen(false);

  return <><div className="hidden bg-gradient-to-r from-[#5d197b] to-[#8625a7] px-5 py-3 text-xs text-white md:flex md:justify-between"><span>♧　High Quality Medical Products</span><span>◔　24/7 Customer Support</span><span>◉　♥　◎　in</span></div><header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur"><div className="mx-auto flex h-[92px] max-w-7xl items-center px-5 sm:px-8"><AsmitaLogo/><button className="ml-auto text-2xl text-[#79259c] lg:hidden" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? '×' : '☰'}</button><nav className={`${open ? 'absolute left-0 right-0 top-[92px] grid border-y bg-white px-6 py-3 shadow-lg' : 'hidden'} lg:static lg:ml-auto lg:flex lg:items-center lg:gap-3 lg:border-0 lg:p-0 lg:shadow-none xl:gap-6`}>{links.map(([name, path]) => ['Promotion', 'New Arrivals'].includes(name) ? <NavigationDropdown key={name} label={name} categories={categories} onNavigate={close}/> : <a key={path} href={'#' + path} onClick={close} className="border-b border-slate-100 py-3 text-sm font-bold text-slate-900 hover:text-[#79259c] lg:border-0 lg:p-0">{name}{name === 'Products' && <small className="ml-1">⌄</small>}</a>)}<div className="pt-3 lg:hidden"><HeaderSearch categories={categories} onNavigate={close}/></div></nav><div className="ml-4 hidden w-44 lg:block xl:w-52"><HeaderSearch categories={categories}/></div></div></header></>;
}
