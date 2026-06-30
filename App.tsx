import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import BookingSection from './components/Booking';
import Contact from './components/Contact';
import AiAdvisor from './components/AiAdvisor';
import AdminDashboard from './components/AdminDashboard';
import { Language, Service, ClientData } from './types';

// ── Currency auto-detection from country name ─────────────────────────────────
function detectCurrency(country: string): string {
  const c = country?.toLowerCase() || '';
  if (c.includes('saudi') || c.includes('arabie'))  return 'SAR';
  if (c.includes('qatar'))                            return 'QAR';
  if (c.includes('uae') || c.includes('emirates'))   return 'AED';
  if (c.includes('kuwait'))                           return 'KWD';
  if (c.includes('bahrain'))                          return 'BHD';
  if (c.includes('oman'))                             return 'OMR';
  if (c.includes('egypt'))                            return 'EGP';
  if (c.includes('jordan'))                           return 'JOD';
  if (c.includes('morocco') || c.includes('maroc'))  return 'MAD';
  if (c.includes('tunisia'))                          return 'TND';
  if (c.includes('algeria') || c.includes('algérie'))return 'DZD';
  if (c.includes('libya') || c.includes('libye'))    return 'LYD';
  return 'USD';
}

// ── Parse raw entry from data.json into clean ClientData ──────────────────────
function parseClientEntry(entry: Record<string, unknown>): ClientData {
  // images can be a comma-separated string or an array
  let images: string[] = [];
  const rawImages = entry['images'];
  if (typeof rawImages === 'string' && rawImages.trim()) {
    images = rawImages.split(',').map((s) => s.trim()).filter(Boolean);
  } else if (Array.isArray(rawImages)) {
    images = rawImages as string[];
  }

  const country = String(entry['country'] || '');
  return {
    name:     String(entry['name']    || ''),
    phone:    String(entry['phone']   || ''),
    city:     String(entry['city']    || ''),
    country,
    niche:    String(entry['niche']   || ''),
    address:  String(entry['address'] || ''),
    images,
    currency: String(entry['currency'] || detectCurrency(country)),
  };
}

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [lang, setLang] = useState<Language>('ar');
  const [clientData, setClientData] = useState<ClientData | null>(null);

  // ── Load client by ?id=N from data.json ──────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');

    if (idParam !== null && idParam !== '') {
      const idx = parseInt(idParam, 10);
      if (!isNaN(idx)) {
        fetch('/data.json')
          .then((r) => r.json())
          .then((data: Record<string, unknown>[]) => {
            if (Array.isArray(data) && data[idx]) {
              setClientData(parseClientEntry(data[idx]));
            }
          })
          .catch(() => {
            console.warn('Could not load data.json — using default salon data.');
          });
      }
    } else {
      // Legacy support: ?name=...&phone=...&images=... (old long URL format)
      const legacyName   = params.get('name');
      const legacyPhone  = params.get('phone');
      const legacyCity   = params.get('city') || '';
      const legacyImages = params.get('images') || '';
      if (legacyName || legacyPhone) {
        setClientData({
          name:    legacyName  || '',
          phone:   legacyPhone || '',
          city:    legacyCity,
          country: '',
          images:  legacyImages.split(',').map((s) => s.trim()).filter(Boolean),
          currency: 'SAR',
        });
      }
    }
  }, []);

  // ── Admin access ──────────────────────────────────────────────────────────────
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('admin') || window.location.hash === '#admin') {
      setIsAdminOpen(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const isKeyA = e.key === 'a' || e.key === 'A' || e.keyCode === 65;
      const isKeyN = e.key === 'n' || e.key === 'N' || e.keyCode === 78;

      const isTyping = document.activeElement && (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement).isContentEditable
      );

      const isBacktick = e.key === '`';

      const isMatch = 
        (e.ctrlKey && e.shiftKey && (isKeyA || isKeyN)) || 
        (e.altKey && e.shiftKey && isKeyA) ||
        (e.altKey && isKeyA) ||
        (e.ctrlKey && e.altKey && isKeyA) ||
        isKeyN && e.altKey;

      if (isMatch || (isBacktick && !isTyping)) {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setActiveSection('booking');
  };

  const handleBookingCompleted = () => {
    setRefreshSignal(prev => prev + 1);
  };

  return (
    <Layout 
      activeSection={activeSection} 
      setActiveSection={setActiveSection}
      openAdmin={() => setIsAdminOpen(true)}
      isAdminOpen={isAdminOpen}
      lang={lang}
      setLang={setLang}
      clientData={clientData}
    >
      {/* Prime Sections Layout */}
      <Hero lang={lang} clientData={clientData} />
      <About lang={lang} />
      <Services lang={lang} onSelectService={handleSelectService} refreshSignal={refreshSignal} />
      <Gallery lang={lang} refreshSignal={refreshSignal} />
      <Testimonials lang={lang} refreshSignal={refreshSignal} />
      <BookingSection 
        selectedService={selectedService} 
        onBookingSuccess={handleBookingCompleted}
        refreshSignal={refreshSignal}
        lang={lang}
      />
      <Contact lang={lang} clientData={clientData} />

      {/* Floating Virtuous AI Boutique Concierge */}
      <AiAdvisor lang={lang} />

      {/* Admin Central Dashboard Overlays */}
      {isAdminOpen && (
        <AdminDashboard 
          onClose={() => setIsAdminOpen(false)} 
          refreshSignal={refreshSignal}
          triggerRefresh={handleBookingCompleted}
          lang={lang}
          setLang={setLang}
        />
      )}
    </Layout>
  );
}


export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [lang, setLang] = useState<Language>('en');

  // Backend / secret administration trigger via URL query parameters, hashes, or multiple key shortcuts (Ctrl+Shift+A, Alt+A, etc.)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('admin') || window.location.hash === '#admin') {
      setIsAdminOpen(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const isKeyA = e.key === 'a' || e.key === 'A' || e.keyCode === 65;
      const isKeyN = e.key === 'n' || e.key === 'N' || e.keyCode === 78;

      const isTyping = document.activeElement && (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement).isContentEditable
      );

      // Support Backtick (`) for ultra-convenient toggle without key conflicts (as long as they aren't typing)
      const isBacktick = e.key === '`';

      // Support Alt + A, Alt + Shift + A, Ctrl + Shift + A, Ctrl + Shift + N, Ctrl + Alt + A
      const isMatch = 
        (e.ctrlKey && e.shiftKey && (isKeyA || isKeyN)) || 
        (e.altKey && e.shiftKey && isKeyA) ||
        (e.altKey && isKeyA) ||
        (e.ctrlKey && e.altKey && isKeyA) ||
        isKeyN && e.altKey;

      if (isMatch || (isBacktick && !isTyping)) {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setActiveSection('booking');
  };

  const handleBookingCompleted = () => {
    // Increment signal counter to notify calendars and admin dashboards to reload data immediately
    setRefreshSignal(prev => prev + 1);
  };

  return (
    <Layout 
      activeSection={activeSection} 
      setActiveSection={setActiveSection}
      openAdmin={() => setIsAdminOpen(true)}
      isAdminOpen={isAdminOpen}
      lang={lang}
      setLang={setLang}
    >
      {/* Prime Sections Layout */}
      <Hero lang={lang} />
      <About lang={lang} />
      <Services lang={lang} onSelectService={handleSelectService} refreshSignal={refreshSignal} />
      <Gallery lang={lang} refreshSignal={refreshSignal} />
      <Testimonials lang={lang} refreshSignal={refreshSignal} />
      <BookingSection 
        selectedService={selectedService} 
        onBookingSuccess={handleBookingCompleted}
        refreshSignal={refreshSignal}
        lang={lang}
      />
      <Contact lang={lang} />

      {/* Floating Virtuous AI Boutique Concierge */}
      <AiAdvisor lang={lang} />

      {/* Admin Central Dashboard Overlays */}
      {isAdminOpen && (
        <AdminDashboard 
          onClose={() => setIsAdminOpen(false)} 
          refreshSignal={refreshSignal}
          triggerRefresh={handleBookingCompleted}
          lang={lang}
          setLang={setLang}
        />
      )}
    </Layout>
  );
}
