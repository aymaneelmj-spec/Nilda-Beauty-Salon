import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Sparkles, Send, X, ArrowRight, Loader } from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { salonImages } from '../assets/images';
import { translations } from '../data/translations';

export interface AiAdvisorProps {
  lang: Language;
}

export default function AiAdvisor({ lang }: AiAdvisorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];
  const isRtl = lang === 'ar';

  // Sette initial greeting dynamically on mount and when language changes
  useEffect(() => {
    setMessages([
      {
        id: "wel_msg",
        role: "assistant",
        content: t.ai_welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [lang, t.ai_welcome]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    { 
      text: isRtl ? 'أي حمام مغربي هو الأفضل؟' : 'Which Moroccan Hammam is best?', 
      q: 'What Moroccan Hammam packages do you recommend and what are the steps?' 
    },
    { 
      text: isRtl ? 'أسعار السيشوار والكيراتين لشعري' : 'Hair blowout & Keratin pricing', 
      q: 'What hair blowouts and keratin treatments do you offer and what are the prices?' 
    },
    { 
      text: isRtl ? 'هل الصالون مغلق وحصري للسيدات؟' : 'Are you ladies-only?', 
      q: 'Can you tell me about salon security, privacy, and if it is exclusively ladies-only?' 
    },
    { 
      text: isRtl ? 'أين يقع الصالون بالريان ومواعيد العمل؟' : 'Where in Al-Rayyan are you?', 
      q: 'What is the physical address, exterior look of the villa, and opening hours?' 
    }
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || sending) return;

    const userMsg: ChatMessage = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          lang, // pass current language context to the backend!
          history: messages.slice(1).map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || (isRtl ? "يبدو أن خادم التجميل يستريح قليلاً." : "The AI network is momentarily resting."));
      }

      const aiReply: ChatMessage = {
        id: "ai_" + Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiReply]);

    } catch (error: any) {
      console.error("AI Advisor Error:", error);
      
      let displayMessage = isRtl
        ? "أيمكنكِ تكرار السؤال يا حبيبتي؟ أو تواصلِ مباشرة مع استقبال صالون نيلدا على ٧٠٣٧٧٠٧٦ ٩٧٤+!"
        : "Can you repeat that, my lady? Or contact our salon desk directly on +974 7037 7076!";
        
      const errMsgStr = String(error.message || "");
      
      if (errMsgStr.includes("{") || errMsgStr.includes("}") || errMsgStr.includes("code") || errMsgStr.includes("503") || errMsgStr.includes("UNAVAILABLE") || errMsgStr.includes("error")) {
        displayMessage = isRtl
          ? "نيلدا مشغولة حالياً مع ملكات أخريات في صالون الريان! يرجى الانتظار للحظة وإرسال استفساركِ ثانية، أو تواصلي لتنسيق موعد فيلا نيلدا المغلق عبر واتساب على الرقم ٧٠٣٧٧٠٧٦ ٩٧٤+!"
          : "Nilda is currently speaking with many lovely ladies in Al-Rayyan, darling! Please wait a tiny moment and send your question again, or let us coordinate your private villa visit on WhatsApp at +974 7037 7076!";
      } else {
        displayMessage = errMsgStr;
      }

      const errorMsg: ChatMessage = {
        id: "err_" + Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content: (isRtl ? "لقد انبهرتُ بجمالكِ الخلاب يا ملكتي! 🌸 " : "I am momentarily dazzled by your glamour, lovely lady. 🌸 ") + displayMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputValue);
    }
  };

  return (
    <>
      {/* FLOATING CHAT BUTTON - Floating slightly above back-to-top */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-26 ${isRtl ? 'left-6' : 'right-6'} p-4 rounded-full bg-burgundy-950 text-gold-300 border border-gold-400/30 shadow-2xl hover:bg-burgundy-900 transition-all duration-300 hover:scale-110 transform cursor-pointer flex items-center justify-center z-30 group`}
        title={t.ai_advisor_title}
        id="ai-advisor-trigger"
      >
        <Sparkles className="absolute inset-0 rounded-full animate-ping bg-gold-400 opacity-20" />
        <MessageSquare className="w-6 h-6 fill-gold-400/20" />
        
        {/* Simple count dot */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border border-white animate-bounce animate-duration-1000"></span>

        {/* Floating label tooltip */}
        <span className={`absolute ${isRtl ? 'left-14 ml-2' : 'right-14 mr-2'} whitespace-nowrap bg-white text-burgundy-950 text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none border border-gold-400/20`}>
          {t.ai_advisor_title} 🌸
        </span>
      </button>

      {/* RIGHT/LEFT SIDE DRAWER CONCIERGE */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end" id="ai-advisor-drawer-overlay" onClick={() => setIsOpen(false)}>
          
          <div 
            className={`w-full max-w-md h-full bg-amber-50/10 lux-glass-dark ${isRtl ? 'border-r border-l-0' : 'border-l border-r-0'} border-gold-400/20 shadow-2xl flex flex-col justify-between`}
            onClick={(e) => e.stopPropagation()}
            id="ai-advisor-drawer"
          >
            {/* Header section styled with Rose gold luxury */}
            <div className="bg-gradient-to-r from-burgundy-950 to-burgundy-900 text-white p-5 border-b border-gold-400/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={salonImages.logo} 
                  alt="Nilda Avatar" 
                  className="w-10 h-10 rounded-full object-cover border border-gold-400"
                  referrerPolicy="no-referrer"
                />
                <div className="text-start">
                  <h4 className="font-serif font-bold text-base text-gold-300 flex items-center gap-1 text-start">
                    {t.ai_advisor_title} <Sparkles className="w-4 h-4 text-gold-400 animate-pulse shrink-0" />
                  </h4>
                  <span className="text-[10px] tracking-wider text-rose-200 block uppercase font-mono text-start">{t.ai_concierge_tag}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition"
                id="ai-close-drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat message body logs */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-neutral-200" ref={scrollRef} id="chat-messages-container">
              {messages.map((m) => {
                const isAi = m.role === 'assistant';

                return (
                  <div 
                    key={m.id}
                    className={`flex items-start gap-2.5 ${isAi === !isRtl ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAi && (
                      <img 
                        src={salonImages.logo} 
                        alt="Nilda Icon" 
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-gold-400/30"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm text-sm text-start ${
                      isAi 
                        ? 'bg-white/8 text-rose-100 rounded-tl-none border border-white/5 whitespace-pre-line text-start' 
                        : 'bg-gold-400 text-burgundy-950 rounded-tr-none font-medium text-start'
                    }`}>
                      {/* Bold replacement hack for simple rendering */}
                      {m.content.split('\n').map((para, pIdx) => {
                        // replace markdown bold **xxx** with bold tags
                        const parts = para.split('**');
                        return (
                          <p key={pIdx} className={pIdx > 0 ? 'mt-1.5' : ''}>
                            {parts.map((part, partIdx) => 
                              partIdx % 2 === 1 ? <strong key={partIdx} className="font-bold text-white">{part}</strong> : part
                            )}
                          </p>
                        );
                      })}
                      <span className={`block text-[9px] mt-1 text-right ${isAi ? 'text-rose-200/50' : 'text-burgundy-950/50'}`}>
                        {m.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Loader indicator while generating */}
              {sending && (
                <div className="flex items-start gap-2.5">
                  <img 
                    src={salonImages.logo} 
                    alt="Nilda Icon" 
                    className="w-7 h-7 rounded-full object-cover shrink-0 animate-pulse border border-gold-400/30"
                    referrerPolicy="no-referrer"
                  />
                  <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                    <Loader className="w-4 h-4 text-gold-300 animate-spin" />
                    <span className="text-xs text-rose-200 italic font-light animate-pulse">{t.ai_typing}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom input segment */}
            <div className="p-4 border-t border-gold-400/10 bg-burgundy-950/70">
              
              {/* Quick Prompt Cards (Only visible when starting or history is short) */}
              {messages.length <= 2 && !sending && (
                <div className="mb-4 space-y-1.5 text-start">
                  <span className="text-[10px] text-rose-200 font-mono tracking-widest block uppercase text-start">
                    {t.ai_suggestions_lbl}
                  </span>
                  <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {quickPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(p.q)}
                        className="text-start text-xs bg-white/5 hover:bg-white/10 text-rose-100 border border-white/5 py-2 px-3 rounded-lg flex items-center justify-between group transition cursor-pointer"
                      >
                        <span className="truncate">{p.text}</span>
                        <ArrowRight className={`w-3.5 h-3.5 text-gold-400 group-hover:translate-x-1 transition shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input row block */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t.ai_placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={sending}
                  className="flex-1 bg-white/5 border border-white/10 h-11 px-4 rounded-xl text-xs text-white placeholder:text-rose-200/40 outline-none focus:border-gold-400 focus:bg-white/10 disabled:opacity-50 text-start"
                />
                
                <button
                  type="button"
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || sending}
                  className="p-3 bg-gold-400 text-burgundy-950 hover:bg-gold-300 disabled:bg-neutral-600 disabled:text-neutral-400 transition-colors duration-200 rounded-xl flex items-center justify-center cursor-pointer shrink-0"
                  id="ai-send-btn"
                >
                  <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <div className="text-[9px] text-center text-rose-200/40 mt-3.5 font-mono">
                {t.ai_secured_footer}
              </div>
            </div>

          </div>

        </div>
      )}
    </>
  );
}
