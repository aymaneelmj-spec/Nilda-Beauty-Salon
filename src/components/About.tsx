import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react';
import { salonImages } from '../assets/images';
import { Language } from '../types';
import { translations } from '../data/translations';

export interface AboutProps {
  lang: Language;
}

export default function About({ lang }: AboutProps) {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden text-start">
      
      {/* Decorative floral watermark backing inside the section */}
      <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} bottom-0 w-96 h-96 opacity-5 pointer-events-none mix-blend-multiply`}>
        <img 
          src={salonImages.logo} 
          alt="Watermark Brand" 
          className="w-full h-full grayscale rounded-full" 
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Story text and core statements (7/12 cols) */}
          <div className="lg:col-span-7 space-y-8 text-start">
            <div className="space-y-4">
              <span className="text-xs tracking-widest text-gold-600 font-mono font-bold uppercase block">
                {t.about_subtitle}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight leading-snug">
                {t.about_title_1} <br />
                <span className="font-serif text-burgundy-600 italic">{t.about_title_2}</span>
              </h2>
              <div className="w-16 h-1 bg-gold-400 rounded"></div>
            </div>

            <p className="text-neutral-600 leading-relaxed font-light text-base sm:text-lg">
              {t.about_desc_1}
            </p>

            <p className="text-neutral-500 leading-relaxed font-light text-sm sm:text-base">
              {t.about_desc_2}
            </p>

            {/* Premium USP checklist blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-xl bg-burgundy-50 text-burgundy-600 shadow-sm shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-neutral-800 text-sm tracking-wide">{t.privacy_title}</h4>
                  <p className="text-xs text-neutral-500 font-light mt-1">{t.privacy_desc}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-xl bg-gold-50 text-gold-600 shadow-sm shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-neutral-800 text-sm tracking-wide">{t.talent_title}</h4>
                  <p className="text-xs text-neutral-500 font-light mt-1">{t.talent_desc}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-xl bg-orange-50 text-orange-600 shadow-sm shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-neutral-800 text-sm tracking-wide">{t.hammam_title}</h4>
                  <p className="text-xs text-neutral-500 font-light mt-1">{t.hammam_desc}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-xl bg-rose-50 text-rose-600 shadow-sm shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-neutral-800 text-sm tracking-wide">{t.villa_loc_title}</h4>
                  <p className="text-xs text-neutral-500 font-light mt-1">{t.villa_loc_desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual framing of the Villa building (5/12 cols) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-burgundy-900/10 to-gold-400/10 rounded-2xl transform rotate-3 scale-102 z-0"></div>
            
            <div className="relative z-10 p-2.5 bg-neutral-100 border border-gold-300/20 rounded-2xl shadow-2xl">
              <img 
                src={salonImages.villa} 
                alt="Nilda Beauty Salon Villa Exterior in Qatar" 
                className="w-full h-auto rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay sticker for villa style verification */}
              <div className={`absolute -bottom-6 ${isRtl ? '-right-6' : '-left-6'} bg-burgundy-950 text-white p-4 rounded-xl border border-gold-400/30 shadow-2xl max-w-xs text-start`}>
                <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 font-bold block mb-1">
                  {t.visit_villa_sticker}
                </span>
                <p className="text-xs font-light leading-relaxed text-rose-100">
                  {t.visit_villa_sticker_desc}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
