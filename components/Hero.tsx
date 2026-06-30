import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MessageCircle, ArrowDown } from 'lucide-react';
import { salonImages } from '../assets/images';
import { Language, ClientData } from '../types';
import { translations } from '../data/translations';

export interface HeroProps {
  lang: Language;
  clientData?: ClientData | null;
}

export default function Hero({ lang, clientData }: HeroProps) {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const t = translations[lang];
  const isRtl = lang === 'ar';

  // Client-specific overrides
  const clientName    = clientData?.name || '';
  const clientPhone   = clientData?.phone || '';
  const heroImage     = clientData?.images?.[0] || salonImages.interior;
  const whatsappPhone = clientPhone ? clientPhone : '97470377076';

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 text-start">
      
      {/* Background Image with elegant gradient mask */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-x-0 inset-y-0 bg-gradient-to-r from-burgundy-950/95 via-burgundy-900/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40 z-10" />
        <img 
          src={heroImage} 
          alt={clientName || 'Beauty Salon'} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Hero Core Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full text-white grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Editorial Typography Headers */}
        <motion.div 
          initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="space-y-6 max-w-xl text-start"
        >
          {/* Subtle crown tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-400 text-xs tracking-widest uppercase font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"></span>
            {t.ladies_only_sanctuary}
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            {t.where_beauty_meets} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-rose-300">{t.meets_royalty}</span>
          </h1>

          <p className="text-base sm:text-lg text-rose-100/90 leading-relaxed font-light">
            {t.hero_desc}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button
              onClick={scrollToBooking}
              className="py-4 px-8 rounded-full bg-gradient-to-r from-gold-400 to-gold-300 text-burgundy-950 font-bold tracking-widest uppercase text-xs transition duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-gold-400/20 flex items-center justify-center gap-2 cursor-pointer"
              id="hero-cta-book"
            >
              <Calendar className="w-4 h-4 text-burgundy-950" /> {t.reserve_appointment}
            </button>
            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold tracking-widest uppercase text-xs transition duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              id="hero-cta-whatsapp"
            >
              <MessageCircle className="w-4 h-4 text-green-400 fill-green-400" /> {lang === 'ar' ? 'واتساب الصالون' : 'WhatsApp'}
            </a>
          </div>

          {/* Core Badges */}
          <div className="grid grid-cols-3 gap-4 pt-10 border-t border-white/10 font-mono text-start">
            <div>
              <span className="block text-2xl lg:text-3xl font-serif text-gold-300 font-bold">100%</span>
              <span className="text-[10px] uppercase text-rose-200 tracking-wider block">{t.ladies_exclusive}</span>
            </div>
            <div>
              <span className="block text-2xl lg:text-3xl font-serif text-gold-300 font-bold">8+</span>
              <span className="text-[10px] uppercase text-rose-200 tracking-wider block">{t.elite_stylists}</span>
            </div>
            <div>
              <span className="block text-2xl lg:text-3xl font-serif text-gold-300 font-bold">4.9★</span>
              <span className="text-[10px] uppercase text-rose-200 tracking-wider block">{t.client_reviews}</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Suspended 3D Card Overlay & Logo Display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="hidden lg:flex flex-col items-center justify-center"
        >
          {/* Framed Logo Card */}
          <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl max-w-sm w-full space-y-6 text-center transform hover:rotate-1 transition-transform duration-500">
            {/* Corner geometrical shapes mock */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold-400/50"></div>
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-gold-400/50"></div>
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-gold-400/50"></div>
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-gold-400/50"></div>

            <img 
              src={heroImage} 
              alt={clientName || 'Salon'} 
              className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-gold-400/60 shadow-lg" 
              referrerPolicy="no-referrer"
            />
            
            <div>
              <span className="font-mono text-gold-300 text-[10px] uppercase tracking-widest block mb-1">{clientData?.niche || 'Beauty Salon'}</span>
              <h2 className="font-serif text-xl font-bold tracking-widest text-white uppercase leading-tight">{clientName || 'نيلدا بيوتي'}</h2>
              {clientData?.city && clientData.city !== 'all' && (
                <span className="text-xs uppercase text-rose-200 tracking-widest block mt-2">{clientData.city}</span>
              )}
            </div>

            <div className="bg-white/10 p-3.5 rounded-lg text-xs leading-normal text-rose-100/90 font-light italic text-center">
              {t.villa_quote}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Infinite loop down-indicator arrow */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 hidden md:block">
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-gold-300 text-xs flex flex-col items-center gap-1 opacity-60 cursor-pointer"
          onClick={() => {
            const nextSec = document.getElementById('about');
            if (nextSec) nextSec.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="uppercase text-[9px] tracking-widest font-mono block">{t.explore_story}</span>
          <ArrowDown className="w-4 h-4 stroke-1.5" />
        </motion.div>
      </div>
    </section>
  );
}
