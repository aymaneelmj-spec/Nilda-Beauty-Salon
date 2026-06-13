import React, { useState } from 'react';
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
import { Language, Service } from './types';

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
