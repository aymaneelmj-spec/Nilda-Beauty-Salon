import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, HelpCircle, ChevronDown, Compass, CheckCircle } from 'lucide-react';
import { Language, ClientData } from '../types';
import { translations } from '../data/translations';
import { salonImages } from '../assets/images';

const GOOGLE_MAPS_URL = "https://www.google.com/maps/dir//Nilda+beauty+salon,+Al-Rayyan,+Qatar/@25.3121423,51.3868071,13z/data=!4m17!1m8!3m7!1s0x3e45db8d08bcc5ef:0x3146f711d3bb3b1e!2sNilda+beauty+salon!8m2!3d25.300736!4d51.456845!15sChJxYXRhciBsYWRpZXMgc2Fsb25aFCIScWF0YXIgbGFkaWVzIHNhbG9ukgEMYmVhdXR5X3NhbG9umgFEQ2k5RFFVbFJRVU52WkVOb2RIbGpSamx2VDJ0NFlXVnJTbGhYUm1kMFZWaFZNMlZyY3pWUmJsWnBXak5TUjJOWFl4QULgAQD6AQQISxAy!16s%2Fg%2F11mwk83hcq!4m7!1m0!1m5!1m1!1s0x3e45db8d08bcc5ef:0x3146f711d3bb3b1e!2m2!1d51.456845!2d25.300736?entry=ttu&g_ep=EgoyMDI2MDYwOS4wIKXMDSoASAFQAw%3D%3D";

export interface ContactProps {
  lang: Language;
  clientData?: ClientData | null;
}

export default function Contact({ lang, clientData }: ContactProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const t = translations[lang];
  const isRtl = lang === 'ar';

  // Dynamic contact info from clientData
  const clientPhone   = clientData?.phone   || '';
  const clientAddress = clientData?.address || '';
  const clientCity    = clientData?.city    || '';
  const displayPhone  = clientPhone ? `+${clientPhone}` : '+974 7037 7076';
  const telLink       = clientPhone ? `tel:+${clientPhone}` : 'tel:+97470377076';
  const displayAddress = clientAddress || (isRtl ? 'الريان، قطر' : 'Al-Rayyan, Qatar');

  const workingHours = [
    { 
      day: isRtl ? 'الأحد' : 'Sunday', 
      hours: isRtl ? '١٠:٠٠ ص – ٩:٠٠ م' : '10:00 AM – 9:00 PM', 
      remark: isRtl ? 'مفتوح دائماً' : 'Always Open' 
    },
    { 
      day: isRtl ? 'الاثنين' : 'Monday', 
      hours: isRtl ? '١٠:٠٠ ص – ٩:٠٠ م' : '10:00 AM – 9:00 PM' 
    },
    { 
      day: isRtl ? 'الثلاثاء' : 'Tuesday', 
      hours: isRtl ? '١٠:٠٠ ص – ٩:٠٠ م' : '10:00 AM – 9:00 PM' 
    },
    { 
      day: isRtl ? 'الأربعاء' : 'Wednesday', 
      hours: isRtl ? '١٠:٠٠ ص – ٩:٠٠ م' : '10:00 AM – 9:00 PM' 
    },
    { 
      day: isRtl ? 'الخميس' : 'Thursday', 
      hours: isRtl ? '١٠:٠٠ ص – ٩:٠٠ م' : '10:00 AM – 9:00 PM' 
    },
    { 
      day: isRtl ? 'الجمعة' : 'Friday', 
      hours: isRtl ? '١:٠٠ م – ٩:٠٠ م' : '1:00 PM – 9:00 PM', 
      remark: isRtl ? 'بعد صلاة الجمعة' : 'After Friday Prayer' 
    },
    { 
      day: isRtl ? 'السبت' : 'Saturday', 
      hours: isRtl ? '١٠:٠٠ ص – ٩:٠٠ م' : '10:00 AM – 9:00 PM' 
    },
  ];

  const faqs = [
    {
      id: 0,
      q: isRtl ? 'هل صالون نيلدا مخصص ومهيأ للسيدات فقط؟' : 'Do you operate strictly for ladies only?',
      a: isRtl 
        ? 'نعم يا عزيزتي تماً وبصورة حصرية ١٠٠٪. صالون نيلدا هو واحة مغلقة مخصصة للسيدات فقط. لا يسمح بدخول الرجال تحت أي ظرف من الظروف. نوافذ الفيلا مظللة بالكامل، وطاقم العمل بأكمله من النساء، والأسوار المحيطة تضمن لك الأمان التام والخصوصية وراحة البال الاستثنائية.'
        : 'Yes, darling. Nilda is a 100% exclusive ladies sanctuary. No gentlemen are permitted inside at any circumstances. Our doors feature tinted glass, our staff is entirely female, and gated walls guarantee complete physical block and discretion.',
    },
    {
      id: 1,
      q: isRtl ? 'أين تقع فيلا صالون نيلدا تحديداً في الريان؟' : 'Where exactly is the standalone villa located in Al-Rayyan?',
      a: isRtl
        ? 'تقع فيلتنا الفاخرة في حي سكني راقٍ وهادئ بالريان، قطر. المبنى ذو واجهة كريمية أنيقة ممسوحة بظلال دافئة، ويضم مواقف سيارات ممهدة وداخلية مخصصة للعميلات مباشرة أمام المدخل، لتوفر لكِ فرصة العبور مباشرة وبمنتهى الحشمة والأمان في قلب الفيلا.'
        : 'Our premium villa is located in a lovely premium residential street of Al-Rayyan, Qatar showing beautiful cream stucco walls and red-burgundy roofing. It features clean paved gated parking directly in front of the entry so you can walk straight inside with complete security.',
    },
    {
      id: 2,
      q: isRtl ? 'هل يتطلب حجز صبغات البالياج أو الحمام المغربي دفع عربون مسبق؟' : 'Is a booking deposit required for balayage or hammam sessions?',
      a: isRtl
        ? 'لا نطلب دفع أي عربون مالي مسبق للخدمات القياسية؛ يمكنكِ حجز موعدك وتأكيده مباشرة بلمسة زر عبر موقعنا. ومع ذلك، للخدمات الكبيرة جداً وتجهيز العرائس (مثل باقات الزفاف المتكاملة أو تركيب الشعر الكثيف بقيمة تزيد عن ٨٠٠ ريال قطري)، نتمنى منكِ التنسيق هاتفياً لتثبيت الميعاد.'
        : 'We do not require online pay deposits for standard bookings; you are welcome to make reservations directly on our portal. However, for massive sessions (e.g. bridal full henna or balayage extensions costing more than QAR 800), we kindly request a telephone slot verification and direct coordination.',
    },
    {
      id: 3,
      q: isRtl ? 'كيف يمكنني الاستعداد بالشكل الأمثل لجلسة الحمام المغربي الملكي؟' : 'How should I prepare for a Moroccan Hammam treatment?',
      a: isRtl
        ? 'يا حبيبتي، يفضل الوصول للفيلا قبل موعدك بـ ١٠ إلى ١٥ دقيقة للاسترخاء واحتساء القهوة القطرية الدافئة. نحن نوفر لك كل شيء: الصابون البلدي المغربي الأسود المعتق، الليف المغربية الخشنة المعقمة، الأرواب والنعال النظيفة، والمناشف الفاخرة. ننصح فقط بتجنب الوجبات الثقيلة أو التسمير الشديد قبل الجلسة بـ ٢٤ ساعة.'
        : 'Darling, please arrive 10-15 minutes prior to your steam appointment to settle and settle down. We provide pristine complimentary Moroccan black soap, loofah scrubbers, clean gowns, slippers, and towels. It is recommended to avoid heavy eating or intense tanning 24 hours prior.',
    }
  ];

  return (
    <section id="contact" className="py-24 bg-amber-50/10 relative overflow-hidden text-start">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact Titles */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs tracking-widest text-gold-600 font-mono font-bold uppercase block">
            {t.contact_subtitle}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
            {t.contact_title}
          </h2>
          <div className="w-16 h-1 bg-gold-400 rounded mx-auto"></div>
          <p className="text-sm sm:text-base text-neutral-500 font-light mt-4">
            {t.contact_desc}
          </p>
        </div>

        {/* Core Block layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-stretch text-start">
          
          {/* Working Hour Card (5/12 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-white border border-gold-400/10 rounded-2xl shadow-sm space-y-8 flex flex-col justify-between text-start">
            <div className="space-y-6 text-start">
              <div className="flex items-center gap-3 border-b border-gold-400/10 pb-4 text-start">
                <Clock className="w-6 h-6 text-gold-600 shrink-0" />
                <div className="text-start">
                  <h3 className="font-serif text-neutral-900 text-lg font-bold text-start">{t.opening_hours}</h3>
                  <span className="text-xs text-neutral-400 font-light block text-start">{t.flexible_schedule}</span>
                </div>
              </div>

              <div className="space-y-3 font-mono text-sm text-neutral-700 text-start">
                {workingHours.map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-neutral-100 last:border-0 text-start">
                    <span className="font-bold text-neutral-800 text-start">{h.day}</span>
                    <div className="text-end">
                      <span className="font-medium text-neutral-900 block">{h.hours}</span>
                      {h.remark && (
                        <span className="block text-[9.5px] uppercase font-bold text-burgundy-600 tracking-wider">
                          {h.remark}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contact Numbers block */}
            <div className="pt-6 border-t border-gold-400/10 grid grid-cols-2 gap-4 text-start">
              <div className="text-start">
                <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1 text-start">
                  {t.call_desk}
                </span>
                <a href={telLink} className="text-sm font-bold text-gold-700 hover:text-gold-600 transition font-mono block text-start">{displayPhone}</a>
              </div>
              <div className="text-start">
                <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1 text-start">
                  {t.email_support}
                </span>
                <a href="mailto:contact@nildabeautysalon.com" className="text-sm font-bold text-neutral-800 hover:text-gold-600 transition break-all block text-start">contact@nilda.com</a>
              </div>
            </div>
          </div>

          {/* Interactive Google Map verification frame (7/12 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white border border-gold-400/10 rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8 space-y-6 text-start">
            
            <div className="space-y-3 text-start">
              <div className="flex items-start gap-2 text-start">
                <MapPin className="w-5 h-5 text-burgundy-600 shrink-0 mt-0.5" />
                <div className="text-start">
                  <h3 className="font-serif text-neutral-900 text-lg font-bold text-start">{t.address_directions}</h3>
                  <p className="text-sm text-neutral-500 font-light mt-0.5 text-start">{displayAddress}</p>
                </div>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed font-light text-start">
                {t.villa_access_desc}
              </p>
            </div>

            {/* Real Map Illustration image nested nicely */}
            <div className="w-full h-64 bg-neutral-100 rounded-xl overflow-hidden relative border border-gold-400/20 shadow-inner group">
              <img
                src={salonImages.map}
                alt="Nilda Beauty Salon Al-Rayyan Map"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Embed translucent luxury overlay backdrop */}
              <div className="absolute inset-0 bg-burgundy-950/40 hover:bg-burgundy-950/20 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-lg shadow-lg border border-gold-400/20 text-center space-y-0.5 max-w-[280px]">
                  <h4 className="font-serif font-bold text-neutral-900 text-xs sm:text-sm">{t.gated_salon_title}</h4>
                  <p className="text-[11px] text-neutral-600 font-light leading-snug">{t.map_centered_lbl}</p>
                </div>
                
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-6 rounded-full bg-burgundy-950 text-gold-300 hover:bg-gold-400 hover:text-burgundy-950 border border-gold-400/25 text-xs tracking-wider uppercase font-bold shadow-md transition duration-300 cursor-pointer"
                >
                  {t.navigate_maps}
                </a>
              </div>
            </div>

            {/* Open directions button strip */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between text-xs pt-2 text-start">
              <span className="text-neutral-400 flex items-center gap-1.5 font-light text-start">
                <CheckCircle className="w-4 h-4 text-green-500 font-bold shrink-0" /> {t.villa_parking_notice}
              </span>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-700 font-bold tracking-wider uppercase hover:text-gold-600 transition hover:underline cursor-pointer"
              >
                {t.open_nav_redirect}
              </a>
            </div>

          </div>
        </div>

        {/* FAQ ACCORDION WRAPPER BLOCK */}
        <div className="max-w-4xl mx-auto space-y-6 pt-10 text-start" id="faq-section">
          <div className="text-center space-y-2">
            <h3 className="font-serif text-neutral-900 text-2xl font-bold tracking-wide">
              {isRtl ? 'الأسئلة الأكثر شيوعاً واستفسارات الخصوصية' : 'Frequently Asked Questions'}
            </h3>
            <p className="text-xs text-neutral-400 font-light uppercase tracking-wider font-mono">
              {t.faq_subtitle}
            </p>
          </div>

          <div className="space-y-4 text-start">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div 
                  key={faq.id}
                  className="bg-white rounded-xl border border-gold-300/10 shadow-sm overflow-hidden text-start"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-start transition hover:bg-neutral-50/50 cursor-pointer"
                    id={`faq-btn-${faq.id}`}
                  >
                    <span className="font-serif text-neutral-900 font-bold text-sm sm:text-base tracking-wide flex items-center gap-2 text-start">
                      <HelpCircle className="w-5 h-5 text-gold-500 shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-300 shrink-0 ${isOpen ? 'transform rotate-180 text-gold-500' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-neutral-600 leading-relaxed font-light border-t border-neutral-100 bg-neutral-50/30 text-start select-all">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
