import React, { useState } from 'react';
import { useGoldPrice, goldPriceForKarat, formatUsd } from '../hooks/useGoldPrice';
import { useGoldPrice, goldPriceForKarat, formatUsd } from '../hooks/useGoldPrice';
import { Sparkles, Phone, Scale, Filter, CheckCircle2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: 'rings' | 'bracelets' | 'necklaces' | 'full-sets';
  categoryLabel: string;
  purity: 'عيار 21' | 'عيار 18';
  weight: string;
  image: string;
  description: string;
  isPopular?: boolean;
}

export const Products: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { pricePerGram24K, loading: goldLoading } = useGoldPrice();
  const { pricePerGram24K, loading: goldLoading } = useGoldPrice();

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'rings', label: 'خواتم (Rings)' },
    { id: 'bracelets', label: 'أساور (Bracelets)' },
    { id: 'necklaces', label: 'عقود وسلاسل (Necklaces)' },
    { id: 'full-sets', label: 'أطقم كاملة (Full Sets)' },
  ];

  const products: Product[] = [
    {
      id: 'p1',
      name: 'طقم الميماس الملكي الذهبي',
      category: 'full-sets',
      categoryLabel: 'أطقم كاملة',
      purity: 'عيار 21',
      weight: '48.5 جرام',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      description: 'طقم زفاف فاخر يتضمن عقد، أساور، وأقراط بتصاميم مستوحاة من الملكية الأصيلة.',
      isPopular: true,
    },
    {
      id: 'p2',
      name: 'عقد لؤلؤ وذهب صَافِي',
      category: 'necklaces',
      categoryLabel: 'عقود وسلاسل',
      purity: 'عيار 18',
      weight: '16.2 جرام',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
      description: 'عقد ذهبي مرصع باللؤلؤ الطبيعي المصفي يمنح لمسة أنثوية ناعمة.',
      isPopular: true,
    },
    {
      id: 'p3',
      name: 'سوار التراث السعودي المجدول',
      category: 'bracelets',
      categoryLabel: 'أساور',
      purity: 'عيار 21',
      weight: '24.8 جرام',
      image: 'https://images.unsplash.com/photo-1611591475155-4282faa23235?auto=format&fit=crop&w=800&q=80',
      description: 'سوار ذهبي عريض بنقوش يدوية تقليدية تظهر أصل الصياغة الوطنية.',
    },
    {
      id: 'p4',
      name: 'خاتم سوليتير الزمرد والذهب',
      category: 'rings',
      categoryLabel: 'خواتم',
      purity: 'عيار 18',
      weight: '6.4 جرام',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      description: 'خاتم ذهب أصفر ناعم يتوسطه حجر فاخر مصقول بكل حرفية.',
    },
    {
      id: 'p5',
      name: 'طقم الشبكة الكلاسيكي الناعم',
      category: 'full-sets',
      categoryLabel: 'أطقم كاملة',
      purity: 'عيار 18',
      weight: '32.1 جرام',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      description: 'طقم عرايسي عصري خفيف يجمع بين الرقة والفخامة اليومية.',
    },
    {
      id: 'p6',
      name: 'سلسلة ذهبية متدلية بالفراشة',
      category: 'necklaces',
      categoryLabel: 'عقود وسلاسل',
      purity: 'عيار 21',
      weight: '11.5 جرام',
      image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
      description: 'سلسلة ناعمة مع تعليقة فراشة ذهبية مصوغة بأعلى مستويات الإتقان.',
    },
    {
      id: 'p7',
      name: 'بناجر ذهبية نقشة الميماس',
      category: 'bracelets',
      categoryLabel: 'أساور',
      purity: 'عيار 21',
      weight: '38.0 جرام',
      image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80',
      description: 'مجموعة بناجر ذهبية مقفلة بلون برّاق ولمعان يدوم مدى الحياة.',
      isPopular: true,
    },
    {
      id: 'p8',
      name: 'خاتم ذهبي هندسي مزدوج',
      category: 'rings',
      categoryLabel: 'خواتم',
      purity: 'عيار 21',
      weight: '8.2 جرام',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80',
      description: 'خاتم مصاغ بأسلوب معماري مودرن يناسب محبي العصري الجريء.',
    },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const getWhatsAppLink = (productName: string, purity: string) => {
    const text = `مرحباً مجوهرات الميماس في حلب، أود الاستفسار عن القطعة: (${productName} - ${purity}). هل هي متوفرة؟ وما وزنها وسعرها النهائي؟`;
    return `https://wa.me/963967818728?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="py-12 space-y-12">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE9E0] border border-[#C5A880]/30 text-[#8C6D37] text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>تشكيلة حصرية من أحدث التصاميم</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2724]">
          مجموعات مجوهرات الميماس
        </h1>
        <p className="text-base text-[#4A443F] max-w-2xl mx-auto leading-relaxed">
          تعرّف على نماذج من التشكيلات. الوزن والسعر المعروضان تقديريان، ويمكنك الاستفسار عن القطعة المتوفرة والسعر النهائي عبر واتساب.
        </p>
      </section>

      {/* Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap pb-4 border-b border-[#C5A880]/20">
          <div className="flex items-center gap-1.5 text-xs text-[#8A827A] ml-2 hidden md:flex">
            <Filter className="w-3.5 h-3.5 text-[#8C6D37]" />
            <span>تصفية حسب الفئة:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#C5A880] to-[#B89758] text-white shadow-md'
                  : 'bg-[#F4EFEA] border border-[#C5A880]/30 text-[#4A443F] hover:bg-[#EFE9E0] hover:text-[#8C6D37]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#FAF8F5] rounded-2xl border border-[#C5A880]/30 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Product Image Box */}
              <div className="relative aspect-square overflow-hidden bg-[#F4EFEA]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold shadow-sm ${
                    product.purity === 'عيار 21'
                      ? 'bg-[#D4AF37] text-white'
                      : 'bg-[#8C6D37] text-white'
                  }`}>
                    {product.purity}
                  </span>
                  {product.isPopular && (
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#2C2724] text-[#FAF8F5] border border-[#C5A880]/40">
                      مميز
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#8C6D37] uppercase tracking-wider block">
                    {product.categoryLabel}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#2C2724] leading-snug group-hover:text-[#8C6D37] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#8A827A] leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Weight & Price Spec */}
                <div className="pt-3 border-t border-[#C5A880]/20 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#4A443F]">
                    <span className="flex items-center gap-1 text-[#8A827A]">
                      <Scale className="w-3.5 h-3.5 text-[#8C6D37]" /> الوزن التقريبي:
                    </span>
                    <strong className="text-[#2C2724] font-bold">{product.weight}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8A827A]">قيمة الذهب الخام التقريبية:</span>
                    <strong className="text-base text-[#8C6D37] font-bold">{pricePerGram24K ? formatUsd(parseFloat(product.weight) * goldPriceForKarat(pricePerGram24K, product.purity === 'عيار 21' ? 21 : 18)) : goldLoading ? 'جارٍ جلب السعر...' : 'غير متاح حالياً'}</strong>
                  </div>
                </div>

                {/* WhatsApp Order Button */}
                <a
                  href={getWhatsAppLink(product.name, product.purity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#F4EFEA] border border-[#C5A880]/60 text-[#2C2724] font-bold text-xs hover:bg-gradient-to-r hover:from-[#C5A880] hover:to-[#B89758] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-sm"
                >
                  <Phone className="w-4 h-4 text-[#8C6D37] group-hover/btn:text-white transition-colors" />
                  <span>طلب مباشر عبر واتساب</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Guarantee Note */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-[#F4EFEA] border border-[#C5A880]/30 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#8C6D37] shrink-0" />
            <p className="text-xs sm:text-sm text-[#4A443F]">
              السعر المرجعي يُجلب من سوق الذهب العالمي بالدولار ويُحسب بحسب العيار والوزن المدرج. الأوزان المعروضة توضيحية ويجب تأكيد الوزن الفعلي من المعرض؛ القيمة لا تشمل المصنعية أو الأحجار أو الضرائب.
            </p>
          </div>
          <a
            href="https://wa.me/963967818728"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs font-bold text-[#8C6D37] underline hover:text-[#2C2724]"
          >
            تأكيد السعر النهائي عبر واتساب
          </a>
        </div>
      </section>
    </div>
  );
};
