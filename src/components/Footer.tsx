import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Clock, Phone, ShieldCheck, Award, HeartHandshake, Globe, Share2, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F4EFEA] border-t border-[#C5A880]/30 text-[#4A443F] mt-auto">
      {/* Brand Value Banner */}
      <div className="border-b border-[#C5A880]/20 py-10 bg-[#EFE9E0]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
            <div className="flex flex-col items-center md:items-start space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#8C6D37] mb-1">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-[#2C2724] text-lg">ذهب عيار 21 و 18 مضمون</h4>
              <p className="text-sm text-[#8A827A] leading-relaxed">
                كافة قطعنا مختومة بختم العيار ومصحوبة بكرت ضمان ومواصفات معتمدة رسمياً.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#8C6D37] mb-1">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-[#2C2724] text-lg">صياغة متقنة ودقيقة</h4>
              <p className="text-sm text-[#8A827A] leading-relaxed">
                تصاميم حصرية تجمع بين التراث الذهبي العريق وأرقى خطوط الموضة العالمية.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#8C6D37] mb-1">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-[#2C2724] text-lg">خدمة عملاء راقية</h4>
              <p className="text-sm text-[#8A827A] leading-relaxed">
                فريق متكفل بتقديم المشورة واختيار القطع الأنسب لمناسباتكم الخاصة بكل حب.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C5A880] to-[#B89758] flex items-center justify-center p-[1px]">
                <div className="w-full h-full bg-[#F4EFEA] rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#8C6D37]" />
                </div>
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-[#2C2724]">مجوهرات الميماس</span>
                <p className="text-[10px] text-[#8C6D37] tracking-widest font-semibold uppercase">Al-Mimas Jewelry</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#4A443F]">
              العنوان الأبرز للرقي والفخامة في عالم الذهب والمجوهرات. نصوغ لكم الذكريات بأيدي أمهر الصاغة.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#C5A880]/30 flex items-center justify-center text-[#8C6D37] hover:bg-[#C5A880] hover:text-white transition-colors" aria-label="انستغرام">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#C5A880]/30 flex items-center justify-center text-[#8C6D37] hover:bg-[#C5A880] hover:text-white transition-colors" aria-label="تويتر">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="https://wa.me/966500000000" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#C5A880]/30 flex items-center justify-center text-[#8C6D37] hover:bg-[#C5A880] hover:text-white transition-colors" aria-label="واتساب">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#2C2724] text-base border-b border-[#C5A880]/30 pb-2 inline-block">
              روابط سريعة
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-[#8C6D37] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C5A880]">‹</span> الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#8C6D37] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C5A880]">‹</span> تصفح التشكيلات والمجموعات
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#8C6D37] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C5A880]">‹</span> قصة الميماس وإرثنا
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#8C6D37] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C5A880]">‹</span> المعارض وفروع التواصل
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Hours & Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#2C2724] text-base border-b border-[#C5A880]/30 pb-2 inline-block">
              أوقات العمل
            </h3>
            <div className="space-y-2 text-sm text-[#4A443F]">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#8C6D37] mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-[#2C2724]">السبت - الخميس:</p>
                  <p className="text-xs text-[#8A827A]">09:30 صباحاً - 11:30 مساءً</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#8C6D37] mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-[#2C2724]">الجمعة:</p>
                  <p className="text-xs text-[#8A827A]">04:00 عصراً - 11:30 مساءً</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#2C2724] text-base border-b border-[#C5A880]/30 pb-2 inline-block">
              معلومات الاتصال
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#8C6D37] mt-1 shrink-0" />
                <span>المملكة العربية السعودية، الرياض - سوق الذهب الرئيسي، شارع العليا</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#8C6D37] shrink-0" />
                <span dir="ltr" className="text-right font-semibold">+966 50 000 0000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#C5A880]/20 py-4 bg-[#EFE9E0]/80 text-center text-xs text-[#8A827A]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} مجوهرات الميماس (Al-Mimas Jewelry). جميع الحقوق محفوظة.</p>
          <p className="text-[11px]">صياغة فاخرة وسجل تجاري معتمد برقم 1010000000</p>
        </div>
      </div>
    </footer>
  );
};
