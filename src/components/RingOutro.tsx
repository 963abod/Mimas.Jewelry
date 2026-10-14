import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PhoneCall } from 'lucide-react';

/**
 * Closing panel after the scroll sequence. It deliberately sits OUTSIDE the pinned stage, so nothing is ever
 * overlaid on the ring footage. All copy and button styles are the ones already used by the home hero.
 */
export const RingOutro: React.FC = () => {
  const whatsappMessage = encodeURIComponent('مرحباً مجوهرات الميماس، أود الاستفسار عن التشكيلة والأسعار.');

  return (
    <section className="relative bg-[#070605] text-[#FAF8F5] px-4 sm:px-6 py-20 sm:py-28">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <span className="block text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Al-Mimas Jewelry</span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-[1.25]">أناقة تدوم</h2>
        <p className="text-base sm:text-lg text-[#FAF8F5]/75 leading-relaxed">اكتشفوا تشكيلات الميماس</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
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
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#C5A880]/60 text-[#FAF8F5] font-bold text-base hover:bg-[#FAF8F5]/10 transition-all flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-5 h-5 text-[#D4AF37]" />
            <span>تواصل معنا</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default RingOutro;
