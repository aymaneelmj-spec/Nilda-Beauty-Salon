import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Heart, MessageCircle, MapPin, Clock, AlignRight, X, ChevronUp, Lock } from 'lucide-react';
import { salonImages } from '../assets/images';
import { Language, ClientData } from '../types';
import { translations } from '../data/translations';

export interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  openAdmin: () => void;
  isAdminOpen: boolean;
  lang: Language;
  setLang: (lang: Language) => void;
  clientData?: ClientData | null;
}

export default function Layout({ 
  children, 
  activeSection, 
  setActiveSection, 
  openAdmin, 
  isAdminOpen,
  lang,
  setLang,
  clientData
}: LayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Dynamic phone/whatsapp from clientData, falls back to default Nilda number
  const phone        = clientData?.phone || '97470377076';
  const displayPhone = phone.startsWith('974') ? `+${phone}` : `+${phone}`;
  const waLink       = `https://wa.me/${phone}`;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = translations[lang];
  const isRtl = lang === 'ar';

  const navItems = [
    { id: 'hero', label: t.home },
    { id: 'about', label: t.story },
    { id: 'services', label: t.services },
    { id: 'gallery', label: t.gallery },
    { id: 'testimonials', label: t.reviews },
    { id: 'booking', label: t.book_spot },
    { id: 'contact', label: t.location },
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  return (
    <div 
      className={`min-h-screen bg-amber-50/20 text-neutral-800 selection:bg-rose-100 selection:text-burgundy-900 ${isRtl ? 'font-sans' : 'font-sans'}`} 
      id="top"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top Notification Bar */}
      <div className="bg-burgundy-950 text-gold-300 py-2.5 px-4 text-xs tracking-wider text-center flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 border-b border-gold-300/10 font-mono">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 shrink-0" /> {t.top_notice}
        </span>
        <span className="hidden md:inline">|</span>
        <span className="hidden md:flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 shrink-0" /> {t.location_qatar}
        </span>
        <span className="hidden md:inline">|</span>
        <a 
          href={`tel:+${phone}`} 
          className="font-bold hover:text-white transition flex items-center gap-1"
        >
          <Phone className="w-3" /> {displayPhone}
        </a>
      </div>

      {/* Main Luxury Header */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-burgundy-950 text-white shadow-lg py-3' : 'bg-white/95 text-burgundy-950 shadow-sm py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Brand Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none" 
            onClick={() => scrollToSection('hero')} 
            onDoubleClick={openAdmin}
            title={isRtl ? "انقر مرتين للوحة التحكم" : "Double-click for administrative dashboard"}
            id="header-logo"
          >
            <img 
              src={salonImages.logo} 
              alt="Nilda Beauty Salon Logo" 
              className="w-11 h-11 rounded-full object-cover border-2 border-gold-400" 
              referrerPolicy="no-referrer"
            />
            <div className="text-start">
              <span className="font-serif text-lg tracking-widest font-bold leading-none block uppercase">Nilda</span>
              <span className="text-[9px] tracking-widest text-gold-400 font-bold block uppercase leading-none mt-0.5">
                {isRtl ? "صالون تجميل" : "Beauty Salon"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7 text-[13px] tracking-widest uppercase font-semibold">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`transition-all duration-200 py-2 relative border-b-2 hover:text-gold-400 cursor-pointer ${activeSection === item.id ? 'border-gold-400 text-gold-400' : 'border-transparent text-current'}`}
                id={`nav-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Call to Actions & Gorgeous Arabic Logo Button */}
          <div className="hidden md:flex items-center gap-3.5">
            {/* Elegant Arab Language logo button */}
            <button
              onClick={toggleLanguage}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-burgundy-950 text-gold-300 border border-gold-400/30 hover:border-gold-400 shadow cursor-pointer transition-all duration-300 hover:scale-110 relative group bg-gradient-to-tr hover:from-burgundy-900 group-hover:text-white"
              title={isRtl ? 'English Version' : 'النسخة العربية'}
              id="lang-toggle-btn-desktop"
            >
              {isRtl ? (
                <span className="font-serif text-[10px] tracking-widest font-extrabold uppercase relative -top-[0.5px]">EN</span>
              ) : (
                <span className="font-serif text-lg font-bold leading-none relative -top-[1.5px] text-gold-400">ع</span>
              )}
              {/* Soft pulsating gold radar on English back to Arab option */}
              {!isRtl && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-400"></span>
                </span>
              )}
            </button>

            <button
              onClick={() => scrollToSection('booking')}
              className="px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase bg-gold-400 hover:bg-gold-500 text-burgundy-950 transition hover:scale-105 transform cursor-pointer flex items-center gap-1.5 shadow"
              id="header-book-btn"
            >
              <Calendar className="w-3.5 h-3.5" /> {t.book_spot}
            </button>
          </div>

          {/* Mobile hamburger & Mob Lang selection */}
          <div className="md:hidden flex items-center gap-2.5">
            {/* Elegant Arab Language logo button for mobile */}
            <button
              onClick={toggleLanguage}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-burgundy-950 text-gold-300 border border-gold-400/30 hover:border-gold-400 cursor-pointer text-xs"
              title={isRtl ? 'English Version' : 'النسخة العربية'}
              id="lang-toggle-btn-mobile"
            >
              {isRtl ? (
                <span className="font-serif text-[9px] font-bold uppercase">EN</span>
              ) : (
                <span className="font-serif text-base font-bold relative -top-[1px] text-gold-400">ع</span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -mr-1 rounded-md transition hover:bg-gold-500/10"
              aria-label="Toggle Menu"
              id="mobile-menu-trigger"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <AlignRight className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-burgundy-950 text-white border-t border-gold-400/10 shadow-xl overflow-hidden py-5 px-6" id="mobile-menu-panel">
            <div className="flex flex-col space-y-4 text-sm tracking-widest uppercase font-medium text-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`py-2 border-b border-white/5 cursor-pointer ${activeSection === item.id ? 'text-gold-400 font-bold' : 'text-neutral-300'}`}
                  id={`m-nav-${item.id}`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2 flex flex-col gap-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 rounded-full text-xs font-bold tracking-widest uppercase bg-green-600 text-white flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white shrink-0" /> {t.chat_whatsapp}
                </a>
                <button
                  onClick={() => scrollToSection('booking')}
                  className="py-3 rounded-full text-xs font-bold tracking-widest uppercase bg-gold-400 text-burgundy-950 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 shrink-0" /> {t.reserve_online}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main id="main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-8 border-t border-gold-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 text-start">
            
            {/* Column 1 - Brand Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src={salonImages.logo} 
                  alt="Nilda Logo" 
                  className="w-12 h-12 rounded-full object-cover border border-gold-400" 
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-serif text-xl tracking-widest text-white leading-none uppercase">Nilda</h3>
                  <span className="text-[10px] tracking-widest text-gold-400 block uppercase mt-1">
                    {isRtl ? "صالون التمهيد المتميز" : "Beauty Salon"}
                  </span>
                </div>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed font-light">
                {isRtl ? (
                  "اكتشفي الرفاهية الاستثنائية والدلال المخصص لكِ بكل خصوصية في قطر. من علاجات الشعر الرائدة إلى الحمام المغربي الملكي ونقوش الحناء الساحرة، رسالتنا هي الاحتفاء بجمالكِ الملوكي."
                ) : (
                  "Discover uncompromised luxury and personalized pampering in Qatar. From iconic hair treatments to royal Moroccan baths and intricate hand henna art, our mission is to empower your inner queen."
                )}
              </p>
              <div className="flex items-center gap-2 text-gold-400 pt-2 text-xs">
                <Heart className="w-4 h-4 text-burgundy-500 fill-burgundy-500 shrink-0" />
                <span>{t.exclusive_ladies}</span>
              </div>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h4 className="font-serif text-white tracking-widest uppercase text-sm mb-5 border-b border-gold-400/10 pb-2">
                {isRtl ? "استكشفي" : "Explore"}
              </h4>
              <ul className="space-y-3.5 text-sm">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-gold-400 transition cursor-pointer text-start w-full">{isRtl ? "من نحن" : "About Nilda"}</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-gold-400 transition cursor-pointer text-start w-full">{isRtl ? "أرقى الخدمات" : "Premium Services"}</button></li>
                <li><button onClick={() => scrollToSection('gallery')} className="hover:text-gold-400 transition cursor-pointer text-start w-full">{isRtl ? "معرض الصور" : "Style Gallery"}</button></li>
                <li><button onClick={() => scrollToSection('booking')} className="hover:text-gold-400 transition cursor-pointer text-start w-full">{isRtl ? "الحجز المباشر" : "Instant Reservation"}</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-gold-400 transition cursor-pointer text-start w-full">{isRtl ? "موقعنا في الريان" : "Find Our Villa"}</button></li>
              </ul>
            </div>

            {/* Column 3 - Popular Services Quick List */}
            <div>
              <h4 className="font-serif text-white tracking-widest uppercase text-sm mb-5 border-b border-gold-400/10 pb-2">
                {isRtl ? "علاجات مميزة" : "Featured Treatments"}
              </h4>
              <ul className="space-y-3.5 text-sm text-neutral-400 font-light list-none p-0">
                <li className="hover:text-white transition">{isRtl ? "حمام أرغان مغربي ملكي" : "Royal Moroccan Argan Hammam"}</li>
                <li className="hover:text-white transition">{isRtl ? "تنعيم وتمليس الشعر بالكيراتين المكثف" : "Intensive Keratin Hair Smoothing"}</li>
                <li className="hover:text-white transition">{isRtl ? "مانيكير جل روسي أنيق جاف" : "Elegant Russian Dry Gel Mani"}</li>
                <li className="hover:text-white transition">{isRtl ? "نقوش حناء يد دقيقة وراقية" : "Delicate Hand Henna Mandalas"}</li>
                <li className="hover:text-white transition">{isRtl ? "باريسيان بالياج ذهبي ساحر" : "Parisian Golden Balayage"}</li>
              </ul>
            </div>

            {/* Column 4 - Direct Contact Info */}
            <div>
              <h4 className="font-serif text-white tracking-widest uppercase text-sm mb-5 border-b border-gold-400/10 pb-2">
                {isRtl ? "تواصل معي" : "Connect With us"}
              </h4>
              <ul className="space-y-4 text-sm text-neutral-400 font-light text-start p-0 list-none">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-gold-400 shrink-0" />
                  <span>{isRtl ? "الريان، قطر (فيلا أنيقة بالقرب من طريق الدوحة السريع)" : "Al-Rayyan, Qatar (Chic salon villa near Doha)"}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-5 h-5 text-gold-400 shrink-0" />
                  <a href="tel:+97470377076" className="hover:text-gold-400 transition font-mono font-medium">+974 7037 7076</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-gold-400 shrink-0" />
                  <span className="leading-snug">
                    {isRtl ? (
                      <>الأحد – السبت: ١٠:٠٠ ص – ٩:٠٠ م<br/><span className="text-xs text-burgundy-400">ساعات الجمعة: ١:٠٠ م – ٩:٠٠ م</span></>
                    ) : (
                      <>Mon – Sun: 10:00 AM – 9:00 PM<br/><span className="text-xs text-burgundy-400">Friday Hours: 1:00 PM – 9:00 PM</span></>
                    )}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Icons Strip */}
          <div className="border-t border-neutral-800 pt-8 mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light tracking-wide text-neutral-500 text-start">
            <div className="flex items-center gap-2 flex-wrap">
              <p>© {new Date().getFullYear()} Nilda Ladies Beauty Salon. {isRtl ? "جميع الحقوق محفوظة." : "All rights reserved."} Doha, Qatar.</p>
              <button
                onClick={openAdmin}
                className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-neutral-400 hover:text-gold-300 hover:underline transition duration-250 cursor-pointer ml-3 bg-white/5 px-2 py-1 rounded border border-neutral-800"
                title={isRtl ? "لوحة التحكم" : "Admin Board Dashboard"}
                id="footer-admin-lock"
              >
                <Lock className="w-3 h-3 text-gold-400" />
                <span>{isRtl ? "لوحة المدير" : "Staff Portal"}</span>
              </button>
            </div>
            <div className="flex space-x-6 text-sm text-neutral-400">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition">Instagram</a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition">TikTok</a>
              <a href="https://snapchat.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition">Snapchat</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition">Facebook</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA Buttons */}
      <div className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} flex flex-col gap-3.5 z-30`}>
        
        {/* Scroll Back To Top */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3.5 rounded-full bg-white text-burgundy-950 border border-gold-400/20 shadow-xl hover:bg-neutral-100 transition duration-300 hover:scale-[1.15] transform cursor-pointer flex items-center justify-center"
            title={isRtl ? "العودة للأعلى" : "Scroll to Top"}
            id="back-to-top"
          >
            <ChevronUp className="w-5 h-5 stroke-2" />
          </button>
        )}

        {/* WhatsApp Sticky Floating Button */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-full bg-green-500 text-white shadow-2xl hover:bg-green-600 transition-all duration-300 hover:scale-110 transform flex items-center justify-center relative group"
          id="whatsapp-sticky"
        >
          {/* Animated pulse halo ring */}
          <span className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-25"></span>
          <MessageCircle className="w-6 h-6 fill-white stroke-none" />
          
          {/* Elegant tooltip */}
          <span className={`absolute ${isRtl ? 'left-14 ml-2' : 'right-14 mr-2'} whitespace-nowrap bg-burgundy-950 text-gold-300 text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded shadow-xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none`}>
            {isRtl ? "واتساب الصالون" : "Chat On WhatsApp"}
          </span>
        </a>
      </div>
    </div>
  );
}
