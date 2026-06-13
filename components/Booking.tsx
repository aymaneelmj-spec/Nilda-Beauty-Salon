import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle2, ChevronRight, Lock, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { Service, Booking, Language } from '../types';
import { translations } from '../data/translations';

export interface BookingProps {
  selectedService: Service | null;
  onBookingSuccess: () => void;
  refreshSignal: number;
  lang: Language;
}

const AVAILABLE_TIMES = [
  '10:00', '11:00', '12:00', '13:00', '14:00', 
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export default function BookingSection({ selectedService, onBookingSuccess, refreshSignal, lang }: BookingProps) {
  const [dbServices, setDbServices] = useState<Service[]>([]);
  const [category, setCategory] = useState<'hair' | 'nails' | 'hammam' | 'henna' | 'facial' | 'spa'>('hair');
  const [serviceId, setServiceId] = useState('');
  
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [sendWhatsApp, setSendWhatsApp] = useState(true);

  // Calendar dates setup: show next 14 days
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Loaded database bookings to check availability
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState<any | null>(null);

  const t = translations[lang];
  const isRtl = lang === 'ar';

  // Fetch dynamic services list
  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        setDbServices(data);
      }
    } catch (err) {
      console.error('Error fetching services directory:', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [refreshSignal]);

  // Load existing reservations from server API to block double-bookings
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setExistingBookings(data);
      }
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [refreshSignal]);

  // Synchronize category and serviceId if selectedService comes from header/services menu clicks!
  useEffect(() => {
    if (selectedService) {
      setCategory(selectedService.category);
      setServiceId(selectedService.id);
    }
  }, [selectedService]);

  // Get days starting from today for selection (14 days)
  const bookingDays = useMemo(() => {
    const days = [];
    const now = new Date();
    // In UTC or local, let's create dates accurately
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      
      const dayName = d.toLocaleDateString(lang === 'ar' ? 'ar-QA' : 'en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString(lang === 'ar' ? 'ar-QA' : 'en-US', { month: 'short' }).replace("،", "");
      const year = d.getFullYear();
      
      // Formatted date string (YYYY-MM-DD)
      const monthPad = String(d.getMonth() + 1).padStart(2, '0');
      const dayPad = String(dayNum).padStart(2, '0');
      const formatted = `${year}-${monthPad}-${dayPad}`;

      days.push({
        formatted,
        dayName,
        dayNum,
        monthName,
        isFriday: d.getDay() === 5 // Friday has different hours in Qatar
      });
    }
    return days;
  }, [lang]);

  // Initialize selectedDate to first day if none selected
  useEffect(() => {
    if (bookingDays.length > 0 && !selectedDate) {
      setSelectedDate(bookingDays[0].formatted);
    }
  }, [bookingDays, selectedDate]);

  // Filter Services by category
  const filteredServices = useMemo(() => {
    return dbServices.filter(s => s.category === category);
  }, [dbServices, category]);

  // Handle service category change -> default first service in list
  useEffect(() => {
    if (filteredServices.length > 0 && !selectedService) {
      // Find matches. If the current serviceId is not in the filtered category list, reset it.
      const exists = filteredServices.some(s => s.id === serviceId);
      if (!exists) {
        setServiceId(filteredServices[0].id);
      }
    }
  }, [category, filteredServices, serviceId, selectedService]);

  // Find currently selected service profile details
  const activeServiceObj = useMemo(() => {
    return dbServices.find(s => s.id === serviceId) || null;
  }, [dbServices, serviceId]);

  // Check which time slots are disabled on the selected date
  const disabledTimeSlots = useMemo(() => {
    return existingBookings
      .filter(b => b.date === selectedDate && b.status !== 'cancelled')
      .map(b => b.timeSlot);
  }, [existingBookings, selectedDate]);

  // Get time slots available for the selected day (Fridays open after 13:00 in Qatar)
  const activeDateDetails = useMemo(() => {
    return bookingDays.find(d => d.formatted === selectedDate) || null;
  }, [bookingDays, selectedDate]);

  const slotsAvailableForDay = useMemo(() => {
    if (activeDateDetails?.isFriday) {
      // Fridays start at 13:00 (after Friday prayer time in Al-Rayyan)
      return AVAILABLE_TIMES.filter(t => parseInt(t.split(':')[0]) >= 13);
    }
    return AVAILABLE_TIMES;
  }, [activeDateDetails]);

  // Form submission handler
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(null);

    if (!clientName.trim()) {
      return setSubmitError(isRtl ? 'يرجى تحديد اسمكِ الكريم الأنيق أولاً يا حبيبتي.' : 'Kindly specify your elegant name, darling.');
    }
    if (!clientPhone.trim()) {
      return setSubmitError(isRtl ? 'رقم الهاتف ضروري جداً لتنسيق المواعيد والتأكيد.' : 'Phone number is necessary to coordinate slots.');
    }
    if (!serviceId) {
      return setSubmitError(isRtl ? 'يرجى تحديد علاج التجميل المفضل.' : 'Please select a luxury treatment.');
    }
    if (!selectedDate) {
      return setSubmitError(isRtl ? 'يرجى تحديد تاريخ الجلسة المناسب.' : 'Select a preferred date.');
    }
    if (!selectedTimeSlot) {
      return setSubmitError(isRtl ? 'يرجى تحديد ساعة الحجز المتاحة.' : 'Choose a luxurious time hour.');
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientPhone,
          clientEmail,
          serviceId,
          serviceName: activeServiceObj?.name || 'Luxury Service',
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          notes
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || (isRtl ? 'فشل حجز الموعد، يرجى المحاولة لاحقاً.' : 'Failed to capture appointments.'));
      }

      setSubmitSuccess(result.booking);
      
      // WhatsApp Integration Redirect
      if (sendWhatsApp) {
        const dateObj = new Date(selectedDate);
        const readableDate = dateObj.toLocaleDateString(isRtl ? 'ar-QA' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        
        const messageText = isRtl
          ? `مرحباً صالون نيلدا للتجميل! ✨ لقد قمت بطلب حجز جلسة استجمام عبر موقعكم الإلكتروني:
• الاسم: ${clientName}
• الهاتف: ${clientPhone}
• الخدمة: ${activeServiceObj?.name_ar || activeServiceObj?.name} (${activeServiceObj?.price.replace("QAR", "رق")})
• التاريخ: ${readableDate}
• الساعة: ${selectedTimeSlot}
• طلبات خاصة: ${notes || 'لا يوجد'}

يرجى تأكيد موعدي الفاخر، وشكراً جزيلاً محمل بالحب والود! 🌸`
          : `Hello Nilda Beauty Salon! ✨ I have reserved an appointment on your portal:
• Name: ${clientName}
• Phone: ${clientPhone}
• Treatment: ${activeServiceObj?.name} (${activeServiceObj?.price})
• Date: ${readableDate}
• Time: ${selectedTimeSlot} PM
• Custom Requests: ${notes || 'None'}

Please confirm my luxury appointment, thank you!`;

        const waUrl = `https://wa.me/97470377076?text=${encodeURIComponent(messageText)}`;
        window.open(waUrl, '_blank');
      }

      // Reset state inputs
      setClientName('');
      setClientPhone('');
      setClientEmail('');
      setNotes('');
      setSelectedTimeSlot('');
      
      // Trigger parent callback to reload booking boards!
      onBookingSuccess();

    } catch (err: any) {
      setSubmitError(err.message || (isRtl ? 'حدث خطأ ما، يرجى التواصل معنا عبر واتساب مباشرة للتنسيق الفوري!' : 'Something went wrong. Let us contact on WhatsApp instead!'));
    } finally {
      setSubmitting(false);
    }
  };

  const getTranslatedCategoryBtnLabel = (cId: string) => {
    if (isRtl) {
      switch (cId) {
        case 'hair': return 'شعر';
        case 'nails': return 'أظافر';
        case 'hammam': return 'حمام';
        case 'henna': return 'حناء';
        case 'facial': return 'فيشال';
        case 'spa': return 'سبا';
        default: return cId;
      }
    }
    return cId;
  };

  return (
    <section id="booking" className="py-24 bg-white relative overflow-hidden text-start">
      {/* Decorative side accent lines */}
      <div className={`absolute ${isRtl ? 'right-0' : 'left-0'} top-1/2 w-48 h-96 bg-gold-400/5 blur-3xl rounded-full`}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core titles */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs tracking-widest text-gold-600 font-mono font-bold uppercase block">
            {t.booking_subtitle}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
            {t.booking_title}
          </h2>
          <div className="w-16 h-1 bg-gold-400 rounded mx-auto"></div>
          <p className="text-sm sm:text-base text-neutral-500 font-light max-w-xl mx-auto mt-4">
            {t.booking_desc}
          </p>
        </div>

        {/* Success modal message banner */}
        {submitSuccess && (
          <div className="max-w-2xl mx-auto mb-10 p-6 rounded-2xl bg-green-50 border border-green-200 text-green-800 space-y-4 animate-in fade-in duration-300 text-start">
            <div className="flex items-start gap-3 text-start">
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
              <div className="text-start">
                <h4 className="font-serif font-bold text-lg text-green-950">{t.success_placed}</h4>
                <p className="text-sm leading-relaxed mt-1 font-light text-start select-all">
                  {isRtl ? (
                    <>
                      تم تسجيل الحجز لـ <strong>{submitSuccess.clientName}</strong> بنجاح. العلاج المحدد: <strong>{submitSuccess.serviceName}</strong> في تاريخ {submitSuccess.date} في تمام الساعة {submitSuccess.timeSlot}. نتطلع بشغف لزيارتكِ الميمونة يا عزيزتي!
                    </>
                  ) : (
                    <>
                      An appointment for <strong>{submitSuccess.clientName}</strong> is logged. Selected treatment: <strong>{submitSuccess.serviceName}</strong> on {submitSuccess.date} at {submitSuccess.timeSlot}.
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 text-xs">
              <a 
                href="https://wa.me/97470377076"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded bg-green-600 hover:bg-green-700 text-white font-bold tracking-wider text-center cursor-pointer"
              >
                {t.send_wa_confirm}
              </a>
              <button 
                onClick={() => setSubmitSuccess(null)}
                className="py-2.5 px-4 rounded bg-white border border-green-300 text-green-800 hover:bg-green-50 font-semibold cursor-pointer"
              >
                {t.book_another}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-gold-50/20 rounded-2xl border border-gold-300/15 overflow-hidden shadow-sm text-start">
          
          {/* LEFT SIDE: SELECTION STEPS (7/12 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-8 bg-white text-start">
            
            <h3 className="font-serif text-neutral-900 text-xl font-bold tracking-wide flex items-center gap-2 text-start">
              <Sparkles className="w-5 h-5 text-gold-400 shrink-0" />
              {t.step_1}
            </h3>

            {/* Category tabs */}
            <div className="space-y-2 text-start">
              <label className="text-xs uppercase font-mono text-neutral-400 tracking-wider font-bold block text-start">
                {t.category_label}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-start">
                {[
                  { id: 'hair', label: 'Hair' },
                  { id: 'nails', label: 'Nails' },
                  { id: 'hammam', label: 'Hammam' },
                  { id: 'henna', label: 'Henna' },
                  { id: 'facial', label: 'Facial' },
                  { id: 'spa', label: 'Spa' }
                ].map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCategory(c.id as any);
                    }}
                    className={`py-2 px-1 text-xs rounded transition font-semibold cursor-pointer text-center capitalize border ${
                      category === c.id 
                        ? 'bg-burgundy-950 text-gold-300 border-burgundy-950 shadow'
                        : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border-neutral-200'
                    }`}
                  >
                    {getTranslatedCategoryBtnLabel(c.id)}
                  </button>
                ))}
              </div>
            </div>

            {/* Service selector */}
            <div className="space-y-2 text-start">
              <label htmlFor="service-select" className="text-xs uppercase font-mono text-neutral-400 tracking-wider font-bold block text-start">
                {t.select_treatment_label}
              </label>
              <select
                id="service-select"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full bg-neutral-50 p-3 h-12 rounded border border-neutral-300 text-neutral-700 focus:border-gold-400 outline-none hover:bg-neutral-100/50 cursor-pointer text-start"
              >
                {filteredServices.map(s => (
                  <option key={s.id} value={s.id}>
                    {isRtl && s.name_ar ? s.name_ar : s.name} ({isRtl ? s.price.replace("QAR", "رق") : s.price} • {isRtl ? s.duration.replace("mins", "دقيقة").replace("hours", "ساعات").replace("hour", "ساعة") : s.duration})
                  </option>
                ))}
              </select>
            </div>

            {/* Modern Day Grid Picker */}
            <div className="space-y-2 text-start">
              <label className="text-xs uppercase font-mono text-neutral-400 tracking-wider font-bold block text-start">
                {t.choose_date_label}
              </label>
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
                {bookingDays.map((day) => (
                  <button
                    key={day.formatted}
                    type="button"
                    onClick={() => {
                      setSelectedDate(day.formatted);
                      setSelectedTimeSlot(''); // reset time
                    }}
                    className={`p-3 rounded-xl min-w-[70px] flex flex-col items-center justify-center border transition shrink-0 cursor-pointer ${
                      selectedDate === day.formatted
                        ? 'bg-burgundy-900 text-white border-burgundy-900 shadow-lg scale-102 font-bold'
                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border-neutral-200'
                    }`}
                    id={`date-btn-${day.formatted}`}
                  >
                    <span className="text-[10px] uppercase font-light tracking-wider block">{day.monthName}</span>
                    <span className="text-lg leading-none py-1 block">{day.dayNum}</span>
                    <span className={`text-[9.5px] uppercase tracking-widest block ${selectedDate === day.formatted ? 'text-gold-300' : 'text-neutral-400'}`}>
                      {day.dayName}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Picker chips */}
            <div className="space-y-4 text-start bg-neutral-50/30 p-4 rounded-xl border border-neutral-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                <label className="text-xs uppercase font-mono text-neutral-400 tracking-wider font-bold text-start">
                  {t.select_hours_label}
                </label>
                {activeDateDetails?.isFriday && (
                  <span className="text-[10px] uppercase font-mono text-burgundy-500 bg-burgundy-50 py-0.5 px-2.5 rounded font-bold">
                     {t.friday_notice}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 text-start">
                {slotsAvailableForDay.map(time => {
                  const isTaken = disabledTimeSlots.includes(time);
                  const isSelected = selectedTimeSlot === time;

                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={isTaken}
                      onClick={() => setSelectedTimeSlot(time)}
                      className={`py-3 px-2 text-xs rounded-xl flex items-center justify-center gap-1.5 font-semibold transition border cursor-pointer ${
                        isTaken
                          ? 'bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed cross'
                          : isSelected
                            ? 'bg-gold-400 text-burgundy-950 border-gold-400 shadow-md scale-102 font-bold'
                            : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100/80 border-neutral-200'
                      }`}
                      id={`time-btn-${time}`}
                    >
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{time}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: CUSTOMER DETAIL COMPONENT FORM (5/12 cols) */}
          <form onSubmit={handleBookingSubmit} className="lg:col-span-5 p-6 sm:p-8 bg-gradient-to-br from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white flex flex-col justify-between space-y-6 text-start">
            
            <div className="space-y-6 text-start">
              <div className="space-y-2 text-start">
                <h3 className="font-serif text-gold-300 text-xl font-bold tracking-wide text-start">
                  {t.step_2}
                </h3>
                <p className="text-xs text-rose-100 font-light leading-normal text-start">
                  {t.step_2_desc}
                </p>
              </div>

              {submitError && (
                <div className="p-3 bg-red-900/50 border border-red-500/30 rounded text-xs text-red-200 flex items-center gap-2 text-start">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Form inputs */}
              <div className="space-y-4 text-start">
                <div className="space-y-1 text-start">
                  <label htmlFor="client-name" className="text-[10px] uppercase tracking-wider font-mono text-gold-400 text-start block">{t.name_label}</label>
                  <div className="relative">
                    <User className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-rose-300/60`} />
                    <input
                      type="text"
                      id="client-name"
                      placeholder={t.name_placeholder}
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className={`w-full bg-white/5 border border-white/10 p-3 h-12 ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} rounded text-sm text-white placeholder:text-white/30 focus:border-gold-400 outline-none text-start`}
                    />
                  </div>
                </div>

                <div className="space-y-1 text-start">
                  <label htmlFor="client-phone" className="text-[10px] uppercase tracking-wider font-mono text-gold-400 text-start block">{t.phone_label}</label>
                  <div className="relative">
                    <Phone className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-rose-300/60`} />
                    <input
                      type="tel"
                      id="client-phone"
                      placeholder={t.phone_placeholder}
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className={`w-full bg-white/5 border border-white/10 p-3 h-12 ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} rounded text-sm text-white placeholder:text-white/30 focus:border-gold-400 outline-none text-start`}
                    />
                  </div>
                </div>

                <div className="space-y-1 text-start">
                  <label htmlFor="client-email" className="text-[10px] uppercase tracking-wider font-mono text-gold-400 text-start block">{t.email_label}</label>
                  <input
                    type="email"
                    id="client-email"
                    placeholder={t.email_placeholder}
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-3 h-12 rounded text-sm text-white placeholder:text-white/30 focus:border-gold-400 outline-none text-start"
                  />
                </div>

                <div className="space-y-1 text-start">
                  <label htmlFor="booking-notes" className="text-[10px] uppercase tracking-wider font-mono text-gold-400 text-start block">{t.requests_label}</label>
                  <textarea
                    id="booking-notes"
                    placeholder={t.requests_placeholder}
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded text-sm text-white placeholder:text-white/30 focus:border-gold-400 outline-none resize-none text-start"
                  ></textarea>
                </div>

                {/* WhatsApp auto-redirect toggle */}
                <label className="flex items-start gap-2.5 cursor-pointer pt-2 select-none text-start">
                  <input
                    type="checkbox"
                    checked={sendWhatsApp}
                    onChange={(e) => setSendWhatsApp(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-gold-500 focus:ring-0 accent-gold-400 border-white/20 bg-white/5 mt-0.5"
                  />
                  <div className="space-y-0.5 text-start">
                    <span className="text-xs font-bold block text-gold-300 text-start">{t.wa_itinerary}</span>
                    <span className="text-[10px] text-rose-100 font-light block text-start">{t.wa_itinerary_desc}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Cost overview & Button actions */}
            <div className="space-y-4 pt-6 border-t border-white/10 text-start">
              <div className="flex items-center justify-between font-serif text-sm">
                <span className="text-rose-200">{t.treatment_cost}</span>
                <span className="text-gold-300 text-lg font-bold font-mono">
                  {activeServiceObj 
                    ? (isRtl ? activeServiceObj.price.replace("QAR", "رق") : activeServiceObj.price)
                    : (isRtl ? 'حددي الخدمة أعلاه' : 'Select above')}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gold-400 hover:bg-gold-300 text-burgundy-950 font-bold tracking-widest uppercase text-xs shadow-xl transition-all duration-300 transform hover:scale-103 cursor-pointer flex items-center justify-center gap-2 disabled:bg-neutral-600 disabled:text-neutral-400"
                id="booking-submit-btn"
              >
                {submitting ? (
                  <span>{t.processing_spot}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-burgundy-950 shrink-0" />
                    <span>{t.confirm_appointment}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-rose-300/70 text-center font-mono">
                <Lock className="w-3 h-3 text-gold-400 shrink-0" /> {t.gated_security_footer}
              </div>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
}
