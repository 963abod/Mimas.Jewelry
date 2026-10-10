import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, ShieldCheck, Award, Gem, ChevronLeft, PhoneCall } from 'lucide-react';

export const Home: React.FC = () => {
  const featuredCollections = [
    {
      id: 'full-sets',
      title: 'أطقم العرائس الملكية',
      subtitle: 'عيار 21 | صياغة فاخرة',
      description: 'أطقم ذهبية كاملة مصممة بعناية فائقة لتتوج أجمل لحظات العمر.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      tag: 'الأكثر طلباً'
    },
    {
      id: 'necklaces',
      title: 'عقود وسلاسل الميماس',
      subtitle: 'عيار 18 و 21 | لمسات عصرية',
      description: 'تصاميم تسحر الألباب بأناقتها المنسابة ودقة تفاصيلها الزاهية.',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
      tag: 'تشكيلة جديدة'
    },
    {
      id: 'bracelets',
      title: 'أساور وبناجر التراث العريق',
      subtitle: 'عيار 21 | نقوش يدوية',
      description: 'أساور ذهبية أصيلة تروي حكاية الأصالة والتراث الذهبي السعودي.',
      image: 'https://images.unsplash.com/photo-1611591475155-4282faa23235?auto=format&fit=crop&w=800&q=80',
      tag: 'أصالة وتراث'
    },
    {
      id: 'rings',
      title: 'خواتم السوليتير والذهب',
      subtitle: 'عيار 18 | مرصعة بأرقى الفصوص',
      description: 'خواتم تناسب كل يوم وكل المناسبات الخاصة بأناقة لا تضاهى.',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      tag: 'فخامة يومية'
    }
  ];

  const valueBadges = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#8C6D37]" />,
      title: 'ذهب عيار 21 و 18 مضمون',
      desc: 'شهادات جودة معتمدة مع كل قطعة ذهب مع وختم العيار الرسمي.'
    },
    {
      icon: <Award className="w-8 h-8 text-[#8C6D37]" />,
      title: 'صياغة متقنة ودقيقة',
      desc: 'بأيدي أفضل الصاغة الحرفيين وبأعلى المعايير العالمية.'
    },
    {
      icon: <Gem className="w-8 h-8 text-[#8C6D37]" />,
      title: 'أسعار رسمية شفافة',
      desc: 'حساب دقيق لوزن الذهب والمصنعية وفق مؤشرات السوق المباشرة.'
    }
  ];

  const whatsappMessage = encodeURIComponent('مرحباً مجوهرات الميماس، أود استكشاف التشكيلات والمجموعات المتوفرة لديكم.');

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-[#F4EFEA] via-[#FAF8F5] to-[#FAF8F5] border-b border-[#C5A880]/20 overflow-hidden px-4">
        {/* Subtle Decorative Backdrop Elements */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
          {/* Hero Typography & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-right z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE9E0] border border-[#C5A880]/40 text-[#8C6D37] text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>فخامة الأصالة والرقي العالي</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#2C2724] leading-[1.25]">
              بريقٌ يتجاوز الزمن... <br />
              <span className="bg-gradient-to-r from-[#8C6D37] via-[#D4AF37] to-[#B89758] bg-clip-text text-transparent">
                مجوهرات الميماس
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#4A443F] max-w-2xl leading-relaxed mx-auto lg:mx-0">
              نجمع بين عراقة الصياغة السعودية واللمسات العالمية الفاخرة. استكشفي أحدث تشكيلاتنا المبتكرة من أطقم الذهب، الخواتم، والعقود المصوغة بعناية مطلقة لتعكس جمالكِ الفريد.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#C5A880] via-[#B89758] to-[#8C6D37] text-white font-bold text-base hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>استكشف المجموعات</span>
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </Link>

              <a
                href={`https://wa.me/966500000000?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#F4EFEA] border border-[#C5A880]/60 text-[#2C2724] font-bold text-base hover:bg-[#EFE9E0] transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-5 h-5 text-[#8C6D37]" />
                <span>تواصل معنا مباشرة</span>
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 border-t border-[#C5A880]/20 grid grid-cols-3 gap-4 text-center lg:text-right max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold text-[#8C6D37]">21K & 18K</p>
                <p className="text-xs text-[#8A827A] mt-0.5">عيارات مضمونة</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#8C6D37]">30+</p>
                <p className="text-xs text-[#8A827A] mt-0.5">عاماً من الخبرة</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#8C6D37]">100%</p>
                <p className="text-xs text-[#8A827A] mt-0.5">ضمان أصالة ومعتمدة</p>
              </div>
            </div>
          </div>

          {/* Hero Featured Image Display */}
          <div className="lg:col-span-5 relative z-10 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C5A880]/40 p-2 bg-[#F4EFEA]">
              <div className="w-full h-full rounded-xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80"
                  alt="مجوهرات الميماس الفاخرة"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2724]/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">تشكيلة الميماس الملكية</span>
                  <p className="text-xl font-serif font-bold mt-1">طقم ذهب عيار 21 فاخر</p>
                  <p className="text-xs text-[#FAF8F5]/80 mt-1">مصوغ بدقة عالية وحرفية سعودية متقنة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Highlights & Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4EFEA] border border-[#C5A880]/30 rounded-2xl p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="font-serif text-3xl font-bold text-[#2C2724]">معايير جودة مجوهرات الميماس</h2>
            <p className="text-sm text-[#8A827A]">
              نلتزم بأعلى معايير الشفافية والدقة في كافة المعاملات والقطع المعروضة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueBadges.map((badge, idx) => (
              <div key={idx} className="bg-[#FAF8F5] p-6 rounded-xl border border-[#C5A880]/20 flex flex-col items-center text-center space-y-3 hover:border-[#C5A880]/60 transition-all">
                <div className="p-3 bg-[#F4EFEA] rounded-full border border-[#C5A880]/30">
                  {badge.icon}
                </div>
                <h3 className="font-bold text-[#2C2724] text-lg">{badge.title}</h3>
                <p className="text-sm text-[#4A443F] leading-relaxed">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#C5A880]/20 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D37]">مجموعاتنا المتميزة</span>
            <h2 className="font-serif text-3xl font-bold text-[#2C2724] mt-1">تصفح تشكيلات الذهب الفاخرة</h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#8C6D37] hover:text-[#2C2724] transition-colors"
          >
            <span>عرض كافة المنتجات والمجموعات</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCollections.map((col) => (
            <Link
              key={col.id}
              to="/products"
              className="group bg-[#FAF8F5] rounded-xl border border-[#C5A880]/30 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-[#F4EFEA]">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-[#FAF8F5]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#C5A880]/40 text-[11px] font-bold text-[#8C6D37]">
                  {col.tag}
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-xs font-medium text-[#8C6D37] block">{col.subtitle}</span>
                  <h3 className="font-serif text-xl font-bold text-[#2C2724] group-hover:text-[#8C6D37] transition-colors mt-0.5">
                    {col.title}
                  </h3>
                  <p className="text-xs text-[#8A827A] line-clamp-2 mt-2 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#C5A880]/15 flex items-center justify-between text-xs font-bold text-[#8C6D37] group-hover:text-[#2C2724]">
                  <span>استعرض التشكيلة</span>
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#2C2724] via-[#4A443F] to-[#2C2724] text-[#FAF8F5] p-8 sm:p-14 shadow-xl border border-[#C5A880]/40">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">خدمة التصميم والمصنعية الخاصة</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-snug">
              هل تبحثين عن قطعة خاصة تم تفصيلها حسب طلبكِ؟
            </h2>
            <p className="text-sm sm:text-base text-[#FAF8F5]/80 leading-relaxed">
              يقدم صاغة مجوهرات الميماس خدمة تفصيل وصياغة القطع الخاصة بكل احترافية، من الفكرة الأولية إلى التنفيذ بختم جودة العيار.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/966500000000?text=${encodeURIComponent('مرحباً مجوهرات الميماس، أود الاستفسار عن تفصيل وصياغة قطعة خاصة.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-white font-bold text-sm hover:opacity-90 transition-opacity"
              >
                <PhoneCall className="w-4 h-4" />
                <span>تواصل معنا للاستشارة المجانية</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
