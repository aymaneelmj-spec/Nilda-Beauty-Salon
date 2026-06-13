import React, { useState, useEffect } from 'react';
import { Eye, X, ZoomIn, Camera, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Language, GalleryImage } from '../types';
import { translations } from '../data/translations';

export interface GalleryProps {
  lang: Language;
  refreshSignal?: number;
}

export default function Gallery({ lang, refreshSignal }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'hair' | 'nails' | 'hammam' | 'villa'>('all');
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const t = translations[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    setLoading(true);
    fetch('/api/gallery')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setGalleryItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading gallery database:', err);
        setGalleryItems([]);
        setLoading(false);
      });
  }, [refreshSignal]);

  const filteredItems = galleryItems.filter(item => activeFilter === 'all' || item.type === activeFilter);

  const getFilterBtnText = (f: string) => {
    if (isRtl) {
      switch(f) {
        case 'all': return 'عرض الكل';
        case 'hair': return 'الشعر';
        case 'nails': return 'الأظافر';
        case 'hammam': return 'حمام مغربي';
        case 'villa': return 'الفيلا';
        default: return f;
      }
    }
    return f === 'all' ? 'View All' : f === 'hammam' ? 'Moroccan Hammam' : f;
  };

  return (
    <section id="gallery" className="py-24 bg-white text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Headers */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="text-xs tracking-widest text-gold-600 font-mono font-bold uppercase block">
            {t.gallery_subtitle}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
            {t.gallery_title}
          </h2>
          <div className="w-16 h-1 bg-gold-400 rounded mx-auto"></div>
          <p className="text-sm sm:text-base text-neutral-500 font-light mt-4">
            {t.gallery_desc}
          </p>
        </div>

        {galleryItems.length > 0 ? (
          <>
            {/* Gallery Filter buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              {['all', 'hair', 'nails', 'hammam', 'villa'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter as any)}
                  className={`py-2 px-5 rounded-full text-xs font-semibold tracking-wider transition uppercase cursor-pointer ${
                    activeFilter === filter 
                      ? 'bg-burgundy-950 text-gold-300 shadow-md border border-gold-300/20' 
                      : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200'
                  }`}
                  id={`gallery-filter-${filter}`}
                >
                  {getFilterBtnText(filter)}
                </button>
              ))}
            </div>

            {/* Masonry-Style Grid for dynamic images uploaded instantly! */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="gallery-grid">
              {filteredItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedImage(item.src)}
                  className="group overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-200/50 shadow-sm cursor-pointer relative aspect-4/3"
                  id={`gallery-item-${item.id}`}
                >
                  <img 
                    src={item.src} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />

                  {/* Hover Luxury Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/85 via-burgundy-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-start">
                    <div className="space-y-1.5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-[9px] uppercase font-mono tracking-widest text-gold-400 font-bold block text-start">
                        {getFilterBtnText(item.type)}
                      </span>
                      <h4 className="font-serif text-white font-bold text-base sm:text-lg leading-tight flex items-center gap-2 text-start">
                        {isRtl && item.title_ar ? item.title_ar : item.title} <ZoomIn className="w-4 h-4 text-gold-400 shrink-0" />
                      </h4>
                      {(item.desc || item.desc_ar) && (
                        <p className="text-xs text-rose-100/90 font-light text-start">
                          {isRtl && item.desc_ar ? item.desc_ar : item.desc}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Static camera icon corner indicator (to show it is click-interactive) */}
                  <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} bg-white/80 backdrop-blur p-2 rounded-full shadow border border-gold-300/10 group-hover:bg-burgundy-950 group-hover:text-white transition duration-200`}>
                    <Camera className="w-3.5 h-3.5 text-neutral-700 group-hover:text-gold-400" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200/50 p-12 text-center max-w-md mx-auto space-y-4">
            <span className="text-4xl block">📸</span>
            <h4 className="font-serif text-neutral-900 font-bold text-lg">
              {isRtl ? "No gallery images uploaded." : "No gallery images uploaded."}
            </h4>
            <p className="text-sm text-neutral-500 font-light leading-relaxed">
              {isRtl 
                ? "سيقوم فريق العمل برفع صور عالية الدقة من داخل فيلا الصالون بالريان لتعرض هنا فوراً، يا حبيبتي."
                : "The salon director will upload photos of real hairstyles, nail designs, and private boutique interiors shortly."}
            </p>
          </div>
        )}

        {/* Lightbox pop-up window */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedImage(null)}
            id="lightbox-backdrop"
          >
            {/* Close trigger button */}
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition duration-200 border border-white/20"
              id="lightbox-close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Click stopper inside frame */}
            <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-xl border border-white/25 shadow-2xl relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              <img 
                src={selectedImage} 
                alt="Selected Lightbox Zoom" 
                className="w-full h-auto max-h-[85vh] object-contain"
                referrerPolicy="no-referrer"
              />
              <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} inline-flex items-center gap-1.5 px-3 py-1 bg-burgundy-950/80 backdrop-blur rounded border border-gold-300/20 text-gold-400 text-[10px] font-mono whitespace-nowrap`}>
                <Sparkles className="w-3.5 h-3.5" /> {t.result_tag}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
