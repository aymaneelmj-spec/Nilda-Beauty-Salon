import React, { useState, useEffect } from 'react';
import { Star, Quote, Heart } from 'lucide-react';
import { Language, Review } from '../types';
import { translations } from '../data/translations';

export interface TestimonialsProps {
  lang: Language;
  refreshSignal?: number;
}

export default function Testimonials({ lang, refreshSignal }: TestimonialsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const t = translations[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    setLoading(true);
    fetch('/api/reviews')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching reviews:', err);
        setReviews([]);
        setLoading(false);
      });
  }, [refreshSignal]);

  return (
    <section id="testimonials" className="py-24 bg-rose-50/10 text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Testimonials Titles */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs tracking-widest text-gold-600 font-mono font-bold uppercase block">
            {t.reviews_subtitle}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
            {t.reviews_title}
          </h2>
          <div className="w-16 h-1 bg-gold-400 rounded mx-auto"></div>
          <p className="text-sm sm:text-base text-neutral-500 font-light mt-4">
            {t.reviews_desc}
          </p>
        </div>

        {reviews.length > 0 ? (
          /* Dynamic Reviews Banners Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((rev) => (
              <div 
                key={rev.id}
                className="bg-white rounded-2xl p-7 sm:p-8 border border-gold-300/15 hover:border-gold-400/40 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
                id={`review-card-${rev.id}`}
              >
                <div className="space-y-4 relative text-start">
                  
                  {/* Floating quote watermark */}
                  <Quote className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-0 w-11 h-11 text-gold-100 opacity-30 shrink-0 select-none pointer-events-none`} />

                  {/* Rating Stars row */}
                  <div className={`flex text-amber-400 gap-1 ${isRtl ? 'flex-row-reverse w-fit mr-auto' : 'flex-row w-fit'}`}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-neutral-600 font-light italic text-sm sm:text-base leading-relaxed pt-2 leading-relaxed text-start">
                    "{isRtl && rev.content_ar ? rev.content_ar : rev.content}"
                  </p>
                </div>

                {/* Patient / reviewer info details */}
                <div className="border-t border-neutral-100 pt-5 mt-6 flex items-center justify-between text-start">
                  <div className="text-start">
                    <h4 className="font-serif font-bold text-neutral-900 text-sm tracking-wide text-start">
                      {isRtl && rev.name_ar ? rev.name_ar : rev.name}
                    </h4>
                    <span className="text-xs text-neutral-400 font-light block text-start mt-0.5">
                      {isRtl && rev.location_ar ? rev.location_ar : rev.location} • {rev.date}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-burgundy-600 bg-burgundy-50 py-1 px-2.5 rounded block whitespace-nowrap">
                      {isRtl && rev.service_ar ? rev.service_ar : rev.service}
                    </span>
                  </div>
                </div>

                <Heart className={`absolute bottom-4 ${isRtl ? 'left-4' : 'right-4'} w-3.5 h-3.5 text-neutral-200 fill-neutral-100 group-hover:text-rose-400`} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200/50 p-12 text-center max-w-md mx-auto space-y-4">
            <span className="text-4xl block">✨</span>
            <h4 className="font-serif text-neutral-900 font-bold text-lg">
              {isRtl ? "لم يتم تسجيل تقييمات بعد." : "No reviews logged."}
            </h4>
            <p className="text-sm text-neutral-500 font-light leading-relaxed">
              {isRtl 
                ? "لم تبدأ بعد مشاركة التقييمات من عملائنا الكرام. يمكنكِ استخدام لوحة المدير لتسجيل أولى المراجعات."
                : "No customer reviews have been published yet. The salon director will log client feedback shortly."}
            </p>
          </div>
        )}

        {/* Brand Trust Bar */}
        <div className="text-center pt-16 mt-4">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 py-4 px-8 rounded-full bg-white border border-gold-400/10 shadow-sm text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">
            <span>{t.clean_sterile}</span>
            <span>{t.female_team}</span>
            <span>{t.complimentary_coffee}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
