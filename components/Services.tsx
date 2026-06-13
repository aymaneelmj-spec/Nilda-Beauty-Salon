import React, { useState, useMemo, useEffect } from 'react';
import { Search, Sparkles, Clock, CircleDollarSign, ArrowRight } from 'lucide-react';
import { Language, Service } from '../types';
import { salonImages } from '../assets/images';
import { translations } from '../data/translations';

export interface ServicesProps {
  onSelectService: (service: Service) => void;
  lang: Language;
  refreshSignal?: number;
}

type CategoryType = 'all' | 'hair' | 'nails' | 'hammam' | 'henna' | 'facial' | 'spa';

export default function Services({ onSelectService, lang, refreshSignal }: ServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const t = translations[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    setLoading(true);
    fetch('/api/services')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching services:', err);
        setServices([]);
        setLoading(false);
      });
  }, [refreshSignal]);

  const categories = [
    { id: 'all', label: isRtl ? 'كل الخدمات' : 'All Services', icon: '✨', img: salonImages.hair },
    { id: 'hair', label: isRtl ? 'شعر وتصفيف' : 'Hair & Styling', icon: '💇‍♀️', img: salonImages.hair },
    { id: 'nails', label: isRtl ? 'أظافر وفنها' : 'Nails & Art', icon: '💅', img: salonImages.nails },
    { id: 'hammam', label: isRtl ? 'حمام مغربي' : 'Moroccan Hammam', icon: '🧖‍♀️', img: salonImages.hammam },
    { id: 'henna', label: isRtl ? 'نقوش الحناء' : 'Henna Designs', icon: '🌿', img: salonImages.logo }, // backup with logo
    { id: 'facial', label: isRtl ? 'بشرة وفيشال' : 'Facials & Skin', icon: '💆‍♀️', img: salonImages.interior },
    { id: 'spa', label: isRtl ? 'مساج وسبا' : 'Massages & Spas', icon: '🌸', img: salonImages.interior },
  ];

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
      const searchLower = searchQuery.toLowerCase();
      
      const sName = (service.name + " " + (service.name_ar || "")).toLowerCase();
      const sDesc = (service.description + " " + (service.description_ar || "")).toLowerCase();
      
      const matchesSearch = sName.includes(searchLower) || sDesc.includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, searchQuery]);

  const handleQuickBook = (service: Service) => {
    onSelectService(service);
    const element = document.getElementById('booking');
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // Get active category promo image
  const categoryPromoImage = useMemo(() => {
    const found = categories.find((c) => c.id === activeCategory);
    if (found && found.img) return found.img;
    return salonImages.interior; // default fallback
  }, [activeCategory]);

  const categoryHeadline = useMemo(() => {
    if (isRtl) {
      switch (activeCategory) {
        case 'hair': return 'سيشوار متوج، صبغات غلاز مخصصة، وجلسات مغذية لفروة الرأس والشعر.';
        case 'nails': return 'عناية فائقة بالجلد الزائد، تقوية الأظافر، مانيكير روسي جاف، وفن نقوش رائع.';
        case 'hammam': return 'حمام بخار مغربي أصيل بالصابون البلدي الأسود، طين الغاسول، وترطيب مكثف بزيت الأرغان.';
        case 'henna': return 'نقوش حناء عضوية ساحرة، أشكال هندسية راقية، وتصاميم زفاف ملوكية.';
        case 'facial': return 'تنظيف هيدرا فيشال مائي، تحفيز الكولاجين لشد البشرة، وماسكات طبيعية فاخرة.';
        case 'spa': return 'جلسات سبا فروة الرأس اليابانية المذهلة، ومساج دافئ رائع بنقاط الضغط لراحة تامة.';
        default: return 'اكتشفي قائمة علاجات نيلدا المثالية والذهبية الموجهة حصرياً لرفاهيتكِ في الريان.';
      }
    }
    switch (activeCategory) {
      case 'hair': return 'Glossy hair blowouts, customized color glaze, and scalp nourishment packages.';
      case 'nails': return 'Precision cuticle care, nail strengthening, Russian dry manicures, and custom nail art.';
      case 'hammam': return 'Traditional hot steam Moroccan black soap bathing, body mud, and Argan hydration massage.';
      case 'henna': return 'Intricate organic henna designs, geometric mandalas, and majestic bridal layouts.';
      case 'facial': return 'Vortex-infused hydra facials, firming collagen therapy, and premium herbal masks.';
      case 'spa': return 'Soothing Japanese head spas, and deep therapeutic hot stones and lavender therapy.';
      default: return 'Discover Al-Rayyan’s ultimate menu of ladies exclusive gold-standard pampering treatments.';
    }
  }, [activeCategory, isRtl]);

  const getTranslatedCategoryLabel = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.label : catId;
  };

  return (
    <section id="services" className="py-24 bg-amber-50/10 text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title with premium alignment */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs tracking-widest text-gold-600 font-mono font-bold uppercase block">
            {t.services_subtitle}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
            {t.services_title}
          </h2>
          <div className="w-16 h-1 bg-gold-400 rounded mx-auto"></div>
          <p className="text-sm sm:text-base text-neutral-500 font-light max-w-2xl mx-auto mt-4">
            {t.services_desc}
          </p>
        </div>

        {/* Dynamic Category Context Card (Blending beautiful generated images based on Selected tab!) */}
        <div className="mb-12 bg-white rounded-2xl overflow-hidden border border-gold-300/10 shadow-lg grid grid-cols-1 md:grid-cols-12 text-start">
          <div className="md:col-span-4 h-48 md:h-auto min-h-[160px] relative">
            <img 
              src={categoryPromoImage} 
              alt="Category Visual Showcase" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-burgundy-950/60 to-transparent"></div>
          </div>
          <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-center space-y-3 bg-gradient-to-br from-white to-gold-50/10 text-start">
            <span className="text-xs uppercase bg-gold-100 text-gold-700 tracking-wider font-bold py-1 px-3.5 rounded-full w-fit">
              {getTranslatedCategoryLabel(activeCategory)} {t.category_care}
            </span>
            <h3 className="font-serif text-neutral-900 text-xl font-bold tracking-wide">
              {activeCategory === 'all' 
                ? t.category_all_title 
                : `${getTranslatedCategoryLabel(activeCategory)} ${isRtl ? 'جلسات في صالوننا' : 'Royal Treatments'}`}
            </h3>
            <p className="text-sm font-light leading-relaxed text-neutral-600 select-all">
              {categoryHeadline} {isRtl 
                ? "خدماتنا مصممة خصيصاً لتلبية متطلبات الخصوصية الكاملة في بيئة معقمة ومبهجة وهادئة تليق بزيارتكِ يا حبيبتي." 
                : "We cater exclusively to ladies, ensuring complete privacy, sanitized spaces, and luxurious pampering, darling."}
            </p>
          </div>
        </div>

        {/* Categories Tab Bar & Search Input Container */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-gold-400/10">
          
          {/* Tabs Scrolling bar */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full lg:w-auto pb-3 lg:pb-0 scrollbar-none scroll-smooth">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as CategoryType);
                  setSearchQuery('');
                }}
                className={`py-2.5 px-5 rounded-full text-xs font-semibold tracking-wider transition-all uppercase whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeCategory === cat.id 
                    ? 'bg-burgundy-950 text-gold-300 shadow-md border border-gold-400/20' 
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/50'
                }`}
                id={`tab-btn-${cat.id}`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:max-w-xs">
            <Search className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4`} />
            <input
              type="text"
              placeholder={isRtl ? "ابحثي عن خدمة (مثل صبغة، حمام...)" : "Search services (e.g. Balayage, Hammam...)"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 rounded-full bg-white text-sm border border-neutral-300/60 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none text-neutral-700 placeholder:text-neutral-400`}
            />
          </div>
        </div>

        {/* Services Listings Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div 
                key={service.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-gold-300/10 hover:border-gold-400/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative text-start"
                id={`service-card-${service.id}`}
              >
                {/* Popularity crown ribbon */}
                {service.popular && (
                  <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} bg-burgundy-900 border border-gold-300/30 text-gold-300 py-1 px-3 rounded-full text-[10px] tracking-widest font-mono font-semibold uppercase flex items-center gap-1`}>
                    <Sparkles className="w-3 h-3 text-gold-400 fill-gold-400 animate-pulse" /> {t.popular_choice}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-mono tracking-wider text-rose-500 font-semibold bg-rose-50 py-0.5 px-2 rounded block">
                      {isRtl ? getTranslatedCategoryLabel(service.category) : service.category}
                    </span>
                  </div>

                  <h4 className="font-serif text-neutral-900 text-lg sm:text-lg font-bold tracking-wide group-hover:text-gold-600 transition duration-300">
                    {isRtl && service.name_ar ? service.name_ar : service.name}
                  </h4>

                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">
                    {isRtl && service.description_ar ? service.description_ar : service.description}
                  </p>
                </div>

                {/* Pricing and Action row */}
                <div className="border-t border-neutral-100 pt-5 mt-6 flex items-center justify-between">
                  <div className="space-y-0.5 text-start">
                    <div className="flex items-center gap-1 text-gold-600">
                      <CircleDollarSign className="w-4 h-4 text-gold-500" />
                      <span className="text-base font-bold font-mono text-neutral-900 group-hover:text-gold-600 transition">
                        {isRtl ? service.price.replace("QAR", "رق") : service.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                      <Clock className="w-3.5 h-3.5 text-neutral-300" />
                      <span>{t.duration}: {isRtl ? service.duration.replace("mins", "دقيقة").replace("hours", "ساعات").replace("hour", "ساعة") : service.duration}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickBook(service)}
                    className="py-2 px-4 rounded-full bg-burgundy-50 text-burgundy-700 hover:bg-gold-400 hover:text-burgundy-950 font-bold tracking-wider uppercase text-[10px] flex items-center gap-1 shadow-sm transition duration-300 group-hover:bg-burgundy-950 group-hover:text-white cursor-pointer"
                    id={`quick-book-${service.id}`}
                  >
                    <span>{t.instant_book}</span>
                    <ArrowRight className={`w-3 h-3 group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200/50 p-12 text-center max-w-md mx-auto space-y-4">
            <span className="text-4xl">💅</span>
            <h4 className="font-serif text-neutral-900 font-bold text-lg">
              {isRtl ? "لا توجد خدمات مضافة بعد." : "No services added yet."}
            </h4>
            <p className="text-sm text-neutral-500 font-light">
              {isRtl 
                ? "يرجى الانتقال إلى لوحة المدير لإضافة فئات علاجات ملوكية جديدة." 
                : "Please use the administrative board dashboard to register your first gold-standard treatments."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200/50 p-12 text-center max-w-md mx-auto space-y-4">
            <span className="text-4xl">🔎</span>
            <h4 className="font-serif text-neutral-900 font-bold text-lg">{t.no_treatment}</h4>
            <p className="text-sm text-neutral-500 font-light">
              {t.no_treatment_desc}
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2 rounded-full border border-neutral-300 text-xs font-bold tracking-wider hover:bg-neutral-50 uppercase transition cursor-pointer"
            >
              {t.reset_menu}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
