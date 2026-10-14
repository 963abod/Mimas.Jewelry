import React, { useState } from 'react';
import { useGoldPrice, goldPriceForKarat, formatUsd } from '../hooks/useGoldPrice';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, Sparkles, TrendingUp } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pricePerGram24K, loading: goldLoading } = useGoldPrice();
  const price21 = pricePerGram24K ? formatUsd(goldPriceForKarat(pricePerGram24K, 21)) : null;
  const price18 = pricePerGram24K ? formatUsd(goldPriceForKarat(pricePerGram24K, 18)) : null;
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'الرئيسية' },
    { path: '/products', label: 'منتجاتنا' },
    { path: '/about', label: 'من نحن' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const whatsappMessage = encodeURIComponent('مرحباً مجوهرات الميماس، أود الاستفسار عن التشكيلة والأسعار.');

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF8F5]/85 border-b border-[#C5A880]/20 transition-all duration-300">
      <div className="bg-[#F4EFEA] border-b border-[#C5A880]/15 py-1.5 px-4 text-xs font-medium text-[#4A443F]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-[#C5A880]/15 text-[#8C6D37] px-2.5 py-0.5 rounded-full font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              سعر الذهب العالمي المرجعي
            </span>
            <div className="hidden sm:flex items-center gap-4 text-[#4A443F]">
              <span>عيار 21: <strong className="text-[#2C2724] font-bold">{price21 ? `${price21} / غرام (USD)` : goldLoading ? 'جارٍ التحميل...' : 'غير متاح'}</strong></span>
              <span className="text-[#C5A880]">|</span>
              <span>عيار 18: <strong className="text-[#2C2724] font-bold">{price18 ? `${price18} / غرام (USD)` : goldLoading ? 'جارٍ التحميل...' : 'غير متاح'}</strong></span>
              <a href="https://gold-api.com/docs" target="_blank" rel="noopener noreferrer" className="text-[10px] underline text-[#8C6D37]">المصدر: Gold API</a>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[#8A827A] text-[11px]">
            <span className="hidden md:inline">مجوهرات الميماس — حلب، سوريا</span>
            <span className="hidden md:inline">•</span>
            <span className="text-[#8C6D37] font-semibold">تواصل مباشر عبر واتساب</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#C5A880] via-[#D4AF37] to-[#B89758] flex items-center justify-center p-[1px] shadow-sm group-hover:shadow-md transition-all">
            <div className="w-full h-full bg-[#FAF8F5] rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#8C6D37]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#2C2724] group-hover:text-[#8C6D37] transition-colors">مجوهرات الميماس</span>
            <span className="text-[10px] tracking-[0.2em] text-[#8C6D37] font-medium uppercase -mt-1">Al-Mimas Jewelry</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className={`relative text-base font-medium transition-colors py-1 ${isActive(link.path) ? 'text-[#8C6D37] font-bold' : 'text-[#4A443F] hover:text-[#8C6D37]'}`}>
              {link.label}
              {isActive(link.path) && <span className="absolute bottom-0 right-0 left-0 h-[2px] bg-gradient-to-r from-[#C5A880] to-[#D4AF37] rounded-full" />}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href={`https://wa.me/963967818728?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#B89758] text-white font-medium text-sm hover:from-[#B89758] hover:to-[#8C6D37] transition-all shadow-sm hover:shadow group">
            <Phone className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>استفسار مباشر (واتساب)</span>
          </a>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg text-[#2C2724] hover:bg-[#F4EFEA] transition-colors" aria-label="القائمة" aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#C5A880]/30 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="p-3 bg-[#F4EFEA] rounded-lg border border-[#C5A880]/20 text-xs space-y-2">
            <div className="font-bold text-[#8C6D37] flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> سعر الذهب العالمي المرجعي:</div>
            <div className="flex flex-col gap-1 text-[#4A443F]">
              <span>عيار 21: <strong>{price21 ?? (goldLoading ? 'جارٍ التحميل...' : 'غير متاح')} / غرام</strong></span>
              <span>عيار 18: <strong>{price18 ?? (goldLoading ? 'جارٍ التحميل...' : 'غير متاح')} / غرام</strong></span>
            </div>
            <p className="text-[10px] text-[#8A827A]">بالدولار الأمريكي، دون مصنعية. <a href="https://gold-api.com/docs" target="_blank" rel="noopener noreferrer" className="underline">المصدر: Gold API</a></p>
          </div>
          <div className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} className={`px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${isActive(link.path) ? 'bg-[#EFE9E0] text-[#8C6D37] font-bold' : 'text-[#2C2724] hover:bg-[#F4EFEA]'}`}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-2">
            <a href={`https://wa.me/963967818728?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#B89758] text-white font-medium text-sm shadow">
              <Phone className="w-4 h-4" />
              <span>استفسار مباشر عبر واتساب</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
