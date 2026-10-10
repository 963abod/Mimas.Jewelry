import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Send } from 'lucide-react';
const WHATSAPP_NUMBER = '963967818728';
export const Contact: React.FC = () => {
  const whatsappLink = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const text = ['مرحباً مجوهرات الميماس، لدي استفسار جديد.', name ? `الاسم: ${name}` : '', phone ? `رقم التواصل: ${phone}` : '', message ? `الاستفسار: ${message}` : ''].filter(Boolean).join('\n');
    window.location.href = whatsappLink(text);
  };
  return (
    <div className="py-12 space-y-12">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE9E0] border border-[#C5A880]/30 text-[#8C6D37] text-xs font-semibold"><MessageSquare className="w-4 h-4" /><span>نحن هنا لمساعدتك</span></div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2724]">تواصل مع مجوهرات الميماس</h1>
        <p className="text-base text-[#4A443F] max-w-2xl mx-auto leading-relaxed">للاستفسار عن القطع المتوفرة والأوزان والأسعار، تواصل معنا مباشرة عبر واتساب.</p>
      </section>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-[#C5A880]/30 shadow-sm flex flex-col justify-between gap-6">
          <div className="space-y-4"><div className="w-12 h-12 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#8C6D37]"><MessageSquare className="w-6 h-6" /></div><h2 className="font-serif text-2xl font-bold text-[#2C2724]">واتساب مباشر</h2><p className="text-sm text-[#8A827A] leading-relaxed">راسلنا للاستفسار عن التشكيلات أو تأكيد السعر النهائي للقطعة.</p><p className="font-bold text-[#2C2724]" dir="ltr">+963 967 818 728</p></div>
          <a href={whatsappLink('مرحباً مجوهرات الميماس، أود الاستفسار عن التشكيلات والأسعار.')} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#B89758] text-white font-bold text-sm text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2"><MessageSquare className="w-4 h-4" /> بدء محادثة واتساب</a>
        </div>
        <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-[#C5A880]/30 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#8C6D37]"><MapPin className="w-6 h-6" /></div><h2 className="font-serif text-2xl font-bold text-[#2C2724]">فرع حلب — سوريا</h2><p className="text-sm text-[#4A443F] leading-relaxed">مجوهرات الميماس، حلب، سوريا.</p>
          <div className="flex items-start gap-2 text-sm text-[#8A827A]"><Clock className="w-4 h-4 mt-0.5 shrink-0 text-[#8C6D37]" /><span>للتأكد من أوقات العمل وتفاصيل العنوان، يرجى التواصل عبر واتساب.</span></div>
          <a href="https://www.google.com/maps/search/?api=1&query=Mimas+Jewelry+Aleppo+Syria" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#8C6D37] underline"><MapPin className="w-4 h-4" /> البحث عن الموقع على خرائط Google</a>
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"><div className="bg-[#F4EFEA] border border-[#C5A880]/30 rounded-2xl p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-bold text-[#2C2724] mb-2">أرسل استفسارك</h2><p className="text-sm text-[#8A827A] mb-6">سيتم تجهيز الرسالة وفتح واتساب لإرسالها بنفسك؛ لا تُرسل البيانات إلى خادم الموقع.</p>
        <form onSubmit={handleFormSubmit} className="space-y-4 text-right">
          <div><label htmlFor="contact-name" className="block text-sm font-medium text-[#4A443F] mb-1.5">الاسم</label><input id="contact-name" name="name" type="text" autoComplete="name" className="w-full rounded-xl border border-[#C5A880]/40 bg-[#FAF8F5] px-4 py-3 text-sm outline-none focus:border-[#8C6D37]" placeholder="اسمك" /></div>
          <div><label htmlFor="contact-phone" className="block text-sm font-medium text-[#4A443F] mb-1.5">رقم التواصل (اختياري)</label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" className="w-full rounded-xl border border-[#C5A880]/40 bg-[#FAF8F5] px-4 py-3 text-sm outline-none focus:border-[#8C6D37]" placeholder="رقم هاتفك" /></div>
          <div><label htmlFor="contact-message" className="block text-sm font-medium text-[#4A443F] mb-1.5">الاستفسار</label><textarea id="contact-message" name="message" required rows={4} className="w-full rounded-xl border border-[#C5A880]/40 bg-[#FAF8F5] px-4 py-3 text-sm outline-none focus:border-[#8C6D37] resize-y" placeholder="اكتب استفسارك هنا..." /></div>
          <button type="submit" className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#B89758] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"><Send className="w-4 h-4" /> متابعة عبر واتساب</button>
        </form>
      </div></section>
    </div>
  );
};
