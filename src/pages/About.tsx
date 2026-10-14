import React from 'react';
import { Sparkles, Award, ShieldCheck, HeartHandshake, Feather, Gem } from 'lucide-react';

export const About: React.FC = () => {
  const milestones = [
    { year: '01', title: 'تشكيلات متنوعة', desc: 'أطقم وخواتم وعقود وأساور بتصاميم متعددة.' },
    { year: '02', title: 'اختيار العيار', desc: 'الاستفسار عن القطع المتوفرة بعياري 18 و21.' },
    { year: '03', title: 'تأكيد الوزن', desc: 'يُؤكَّد الوزن الفعلي والسعر النهائي من المعرض قبل الشراء.' },
    { year: '04', title: 'تواصل مباشر', desc: 'خدمة الاستفسارات عبر واتساب لفرع حلب، سوريا.' },
  ];

  return (
    <div className="py-12 space-y-16">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE9E0] border border-[#C5A880]/30 text-[#8C6D37] text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>إرث يُصاغ بماء الذهب</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2724]">
          قصة مجوهرات الميماس
        </h1>
        <p className="text-base text-[#4A443F] max-w-2xl mx-auto leading-relaxed">
          تعرّف على تشكيلات مجوهرات الميماس، واستفسر عن توفر القطع وأوزانها وأسعارها عبر التواصل المباشر.
        </p>
      </section>

      {/* Narrative Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#F4EFEA] rounded-2xl border border-[#C5A880]/30 p-8 sm:p-12 shadow-sm">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D37]">رؤيتنا ورسالتنا</span>
            <h2 className="font-serif text-3xl font-bold text-[#2C2724] leading-snug">
              نحن لا نبيع الذهب فحسب، بل نصوغ مشاعر الإناقة والأصالة
            </h2>
            <p className="text-sm text-[#4A443F] leading-relaxed">
              يهدف هذا الموقع إلى عرض نماذج من تشكيلات المجوهرات وتسهيل الاستفسار عنها. يرجى تأكيد توفر أي قطعة وعيارها ووزنها الفعلي مع المعرض قبل الشراء.
            </p>
            <p className="text-sm text-[#4A443F] leading-relaxed">
              تتغير قيمة الذهب مع السوق، ويُعرض السعر المرجعي للتوضيح فقط؛ أما السعر النهائي فيحدده المعرض بحسب الوزن والمصنعية والتفاصيل.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4 border-t border-[#C5A880]/20">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-[#8C6D37]" />
                <div>
                  <h4 className="font-bold text-[#2C2724] text-sm">تفاصيل واضحة</h4>
                  <p className="text-xs text-[#8A827A]">تحقق من بيانات القطعة قبل الشراء</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-[#8C6D37]" />
                <div>
                  <h4 className="font-bold text-[#2C2724] text-sm">إتقان الصنع</h4>
                  <p className="text-xs text-[#8A827A]">تفاصيل كل قطعة بحسب المتاح</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg border-2 border-[#C5A880]/40">
            <img
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1000&q=80"
              alt="صياغة الميماس"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C2724]/40 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D37]">معلومات مهمة</span>
          <h2 className="font-serif text-3xl font-bold text-[#2C2724]">كيف تتسوق بثقة</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((item, index) => (
            <div
              key={index}
              className="bg-[#FAF8F5] p-6 rounded-xl border border-[#C5A880]/30 shadow-sm relative space-y-3 hover:border-[#C5A880]/80 transition-colors"
            >
              <div className="text-2xl font-bold font-serif text-[#8C6D37] border-b border-[#C5A880]/20 pb-2">
                {item.year}
              </div>
              <h3 className="font-bold text-[#2C2724] text-lg">{item.title}</h3>
              <p className="text-xs text-[#4A443F] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values & Quality Commitment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EFE9E0]/60 border border-[#C5A880]/30 rounded-2xl p-8 sm:p-12 text-center space-y-8">
          <h2 className="font-serif text-3xl font-bold text-[#2C2724]">قبل تأكيد الشراء</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <Gem className="w-8 h-8 text-[#8C6D37] mx-auto" />
              <h3 className="font-bold text-[#2C2724]">عيار القطعة</h3>
              <p className="text-xs text-[#4A443F] leading-relaxed">
                تأكد من عيار كل قطعة من بياناتها أو مباشرة من المعرض.
              </p>
            </div>
            <div className="space-y-2">
              <Feather className="w-8 h-8 text-[#8C6D37] mx-auto" />
              <h3 className="font-bold text-[#2C2724]">دقة الأوزان</h3>
              <p className="text-xs text-[#4A443F] leading-relaxed">
                الأوزان الظاهرة على الموقع توضيحية وليست بديلاً عن الوزن الفعلي للقطعة.
              </p>
            </div>
            <div className="space-y-2">
              <HeartHandshake className="w-8 h-8 text-[#8C6D37] mx-auto" />
              <h3 className="font-bold text-[#2C2724]">العلاقة الممتدة</h3>
              <p className="text-xs text-[#4A443F] leading-relaxed">
                للاستفسار عن الخدمات المتاحة، تواصل مع المعرض مباشرةً عبر واتساب.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
