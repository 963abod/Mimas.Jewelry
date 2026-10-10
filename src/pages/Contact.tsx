import React from 'react';
import { Sparkles, MapPin, Clock, Phone, MessageSquare, Mail, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const branches = [
    {
      city: 'الرياض - المعرض الرئيسي',
      address: 'سوق الذهب - شارع العليا العام، مقابل طيبة سنتر',
      phone: '+966 11 234 5678',
      hours: '09:30 ص - 11:30 م (السبت - الخميس)',
      fridayHours: '04:00 م - 11:30 م (الجمعة)'
    },
    {
      city: 'جدة - فرع رد سي مول',
      address: 'رد سي مول - البوابة الرقمية 3، الدور الأرضي',
      phone: '+966 12 654 3210',
      hours: '10:00 ص - 11:00 م (السبت - الخميس)',
      fridayHours: '04:30 م - 11:30 م (الجمعة)'
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('شُكراً لتواصلك مع مجوهرات الميماس! سيقوم ممثل خدمة العملاء بالرد عليك خلال ساعات قليلة.');
  };

  const whatsappLink = `https://wa.me/966500000000?text=${encodeURIComponent('مرحباً مجوهرات الميماس، أود الاستفسار عن فروعكم وأوقات العمل أو حجز موعد زيارة.')}`;

  return (
    <div className="py-12 space-y-16">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE9E0] border border-[#C5A880]/30 text-[#8C6D37] text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>يسعدنا دائماً استقبالكم واستفساراتكم</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2724]">
          فروعنا وتواصل معنا
        </h1>
        <p className="text-base text-[#4A443F] max-w-2xl mx-auto leading-relaxed">
          فريق مجوهرات الميماس في خدمتكم دائماً للإجابة على جميع تساؤلاتكم وتسهيل تجربة تسوقكم الفاخرة.
        </p>
      </section>

      {/* Direct Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WhatsApp Direct Card */}
          <div className="bg-[#FAF8F5] p-8 rounded-2xl border-2 border-[#C5A880]/40 shadow-sm flex flex-col justify-between space-y-6 hover:border-[#C5A880] transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#8C6D37]">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2C2724]">المحادثة الفورية</h3>
              <p className="text-xs text-[#8A827A] leading-relaxed">
                تواصل مباشر وسريع مع ممثلي الخدمة عبر الواتساب للاستفسارات الفورية.
              </p>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#B89758] text-white font-bold text-xs text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>محادثة واتساب مباشرة</span>
            </a>
          </div>

          {/* Phone Call Card */}
          <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-[#C5A880]/30 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#8C6D37]">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2C2724]">الهاتف المباشر</h3>
              <p className="text-xs text-[#8A827A] leading-relaxed">
                يسعدنا تلقي اتصالاتكم الهاتفيّة وحجز المواعيد طوال أوقات العمل الرسمية.
              </p>
            </div>
            <a
              href="tel:+966500000000"
              className="w-full py-3.5 px-4 rounded-xl bg-[#F4EFEA] border border-[#C5A880]/60 text-[#2C2724] font-bold text-xs text-center hover:bg-[#EFE9E0] transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#8C6D37]" />
              <span dir="ltr">+966 50 000 0000</span>
            </a>
          </div>

          {/* Email Inquiry Card */}
          <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-[#C5A880]/30 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#8C6D37]">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2C2724]">البريد الإلكتروني</h3>
              <p className="text-xs text-[#8A827A] leading-relaxed">
                للمراسلات الرسمية والطلبات الخاصة بالتصميم وتوريد الكميات.
              </p>
            </div>
            <a
              href="mailto:info@almimas-jewelry.com"
              className="w-full py-3.5 px-4 rounded-xl bg-[#F4EFEA] border border-[#C5A880]/60 text-[#2C2724] font-bold text-xs text-center hover:bg-[#EFE9E0] transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#8C6D37]" />
              <span>info@almimas-jewelry.com</span>
            </a>
          </div>
        </div>
      </section>

      {/* Branches & Google Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Branch Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D37]">فروعنا والمعارض</span>
              <h2 className="font-serif text-3xl font-bold text-[#2C2724]">معارض الميماس في المملكة</h2>
            </div>

            <div className="space-y-4">
              {branches.map((b, i) => (
                <div key={i} className="bg-[#F4EFEA] border border-[#C5A880]/30 p-6 rounded-xl space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-[#C5A880]/20 pb-2">
                    <MapPin className="w-5 h-5 text-[#8C6D37]" />
                    <h3 className="font-bold text-[#2C2724] text-base">{b.city}</h3>
                  </div>
                  <p className="text-xs text-[#4A443F] leading-relaxed">{b.address}</p>
                  <div className="pt-2 text-xs space-y-1 text-[#8A827A]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8C6D37]" />
                      <span>{b.hours}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8C6D37]" />
                      <span>{b.fridayHours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Google Map Preview Placeholder */}
          <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#C5A880]/30 rounded-2xl overflow-hidden shadow-sm p-2 bg-[#F4EFEA]">
            <div className="relative w-full h-[420px] rounded-xl overflow-hidden bg-[#EFE9E0] flex flex-col items-center justify-center p-6 text-center">
              <iframe
                title="موقع مجوهرات الميماس"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.123456789!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzE5LjAiTiA0NsKwNDAnMzEuMSJF!5e0!3m2!1sar!2ssa!4v1600000000000!5m2!1sar!2ssa"
                className="w-full h-full border-0 absolute inset-0 opacity-80 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
              <div className="absolute bottom-4 right-4 left-4 bg-[#FAF8F5]/90 backdrop-blur-md p-4 rounded-xl border border-[#C5A880]/40 shadow-lg text-right flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#2C2724] text-sm">موقع المعرض الرئيسي - الرياض</h4>
                  <p className="text-xs text-[#8A827A]">طريق العليا العام، مجمع الذهب والجوهر</p>
                </div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#8C6D37] text-white text-xs font-bold shrink-0 hover:bg-[#2C2724] transition-colors"
                >
                  فتح في خريطة Google
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Contact Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] border border-[#C5A880]/30 rounded-2xl p-8 sm:p-12 shadow-md space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl font-bold text-[#2C2724]">أرسل لنا رسالة مباشرة</h2>
            <p className="text-xs text-[#8A827A]">
              يسعدنا تلقي اقتراحاتكم واستفساراتكم الخاصة بالقطع المصوغة حسب الطلب
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-right">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2C2724] mb-1.5">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: نورة الشمري"
                  className="w-full px-4 py-3 rounded-xl bg-[#F4EFEA] border border-[#C5A880]/30 text-sm focus:outline-none focus:border-[#8C6D37] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2C2724] mb-1.5">رقم الجوال</label>
                <input
                  type="tel"
                  required
                  placeholder="05xxxxxxxx"
                  className="w-full px-4 py-3 rounded-xl bg-[#F4EFEA] border border-[#C5A880]/30 text-sm focus:outline-none focus:border-[#8C6D37] transition-colors text-right"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C2724] mb-1.5">موضوع الاستفسار</label>
              <select className="w-full px-4 py-3 rounded-xl bg-[#F4EFEA] border border-[#C5A880]/30 text-sm focus:outline-none focus:border-[#8C6D37] transition-colors">
                <option>استفسار عام عن المجموعات والأسعار</option>
                <option>تفصيل وصياغة قطعة خاصة</option>
                <option>حجز موعد زيارة للمعرض</option>
                <option>خدمات الصيانة والضمان</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C2724] mb-1.5">تفاصيل الرسالة</label>
              <textarea
                rows={4}
                required
                placeholder="اكتب استفسارك بالتفصيل هنا..."
                className="w-full px-4 py-3 rounded-xl bg-[#F4EFEA] border border-[#C5A880]/30 text-sm focus:outline-none focus:border-[#8C6D37] transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C5A880] via-[#B89758] to-[#8C6D37] text-white font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>إرسال الرسالة إلى خدمة العملاء</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
