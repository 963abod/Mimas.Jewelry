import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PhoneCall, Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  const whatsappMessage = encodeURIComponent('مرحباً مجوهرات الميماس، أود الاستفسار عن التشكيلة والأسعار.');

  return (
    <section className="relative min-h-[calc(100svh-7rem)] flex items-center justify-center bg-gradient-to-b from-[#F4EFEA] via-[#FAF8F5] to-[#FAF8F5] overflow-hidden px-4 sm:px-6">
      <div className="absolute top-10 right-10 w-72 h-72 sm:w-96 sm:h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 sm:w-96 sm:h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center py-10 sm:py-12">
        <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE9E0] border border-[#C5A880]/40 text-[#8C6D37] text-xs sm:text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>فخامة الأصالة والرقي العالي</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#2C2724] leading-[1.25]">
            بريقٌ يتجاوز الزمن...
            <br />
            <span className="bg-gradient-to-r from-[#8C6D37] via-[#D4AF37] to-[#B89758] bg-clip-text text-transparent">
              مجوهرات الميماس
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#4A443F] max-w-2xl leading-relaxed mx-auto lg:mx-0">
            اكتشفوا أناقة مجوهرات الميماس، وتعرّفوا على تشكيلاتنا من الذهب بتفاصيل تجمع بين الأصالة والرقي.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              to="/products"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#C5A880] via-[#B89758] to-[#8C6D37] text-white font-bold text-base hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 group"
            >
              <span>استكشف المنتجات</span>
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </Link>
            <a
              href={`https://wa.me/963967818728?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#F4EFEA] border border-[#C5A880]/60 text-[#2C2724] font-bold text-base hover:bg-[#EFE9E0] transition-all flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-5 h-5 text-[#8C6D37]" />
              <span>تواصل معنا</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] max-h-[62svh] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C5A880]/40 p-2 bg-[#F4EFEA]">
            <div className="w-full h-full rounded-xl overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80"
                alt="مجوهرات الميماس"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2724]/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Al-Mimas Jewelry</span>
                <p className="text-xl sm:text-2xl font-serif font-bold mt-1">أناقة تدوم</p>
                <p className="text-xs text-[#FAF8F5]/80 mt-1">اكتشفوا تشكيلات الميماس</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
