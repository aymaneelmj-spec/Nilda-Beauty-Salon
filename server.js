/**
 * NILDA BEAUTY SALON — Express Backend Server
 * File-based JSON database (no native deps), Gemini AI chat, rate limiting, helmet security
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '2mb' }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { error: 'Too many requests, please slow down.' }
});
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Chat rate limit reached. Try again in a minute.' }
});
app.use('/api/', apiLimiter);
app.use('/api/chat', chatLimiter);

// ─── Admin PIN Auth (simple server-side check) ────────────────────────────────
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@nilda.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'NildaAdmin2024!';
const loginAttempts  = new Map(); // IP -> { count, blockedUntil }

function checkAdminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_TOKEN || 'nilda_admin_secret_2024') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ─── JSON File DB helpers ─────────────────────────────────────────────────────
const DB_DIR = join(__dirname, 'db');
if (!existsSync(DB_DIR)) mkdirSync(DB_DIR);

function readDb(name) {
  const file = join(DB_DIR, `${name}.json`);
  if (!existsSync(file)) return [];
  try { return JSON.parse(readFileSync(file, 'utf8')); }
  catch { return []; }
}

function writeDb(name, data) {
  writeFileSync(join(DB_DIR, `${name}.json`), JSON.stringify(data, null, 2));
}

function readDbObj(name, defaults = {}) {
  const file = join(DB_DIR, `${name}.json`);
  if (!existsSync(file)) return defaults;
  try { return JSON.parse(readFileSync(file, 'utf8')); }
  catch { return defaults; }
}

function writeDbObj(name, data) {
  writeFileSync(join(DB_DIR, `${name}.json`), JSON.stringify(data, null, 2));
}

// ─── Seed Default Services ─────────────────────────────────────────────────────
function seedServices() {
  if (readDb('services').length > 0) return;
  const services = [
    { id: 'hair-blowout',    name: 'Royal Signature Blowout',            name_ar: 'تصفيف سيشوار ملوكي مميز',              category: 'hair',    description: 'Nilda signature dynamic bouncy volume blowout with premium moisturizing oils and luxury heat styling.',                                                    description_ar: 'تصفيف نيلدا الحصري المتموج والممتلئ بكامل الحجم، باستخدام زيوت مرطبة فاخرة وأرقى أجهزة التصفيف الحرارية.',  price: '150 QAR', duration: '45 mins',   popular: true  },
    { id: 'hair-balayage',   name: 'Parisian Balayage & Highlight',       name_ar: 'بالياج باريسي وهايلايت دقيق',          category: 'hair',    description: 'Hand-painted glowing highlights custom matched to your complexion, includes intensive conditioning glaze.',                                                description_ar: 'خصلات هايلايت متوهجة مرسومة يدوياً بكامل الدقة لتناسب درجة بشرتكِ، تشتمل على طبقة غلاز حماية وتلميع مكثفة.',   price: '850 QAR', duration: '3 hours',   popular: true  },
    { id: 'hair-keratin',    name: 'Intensive Liquid Keratin Care',        name_ar: 'علاج الكيراتين السائل المكثف',          category: 'hair',    description: 'Gold-standard smoothing and repair treatment to hydrate, strengthen, and eliminate frizz for up to 4 months.',                                            description_ar: 'العلاج الذهبي لتمليس وترطيب وإصلاح الشعر، يساهم في تغذية وتقوية الشعر وإزالة أي تجعد لمدة تصل إلى ٤ أشهر.',    price: '1,200 QAR', duration: '2.5 hours', popular: false },
    { id: 'hair-cut',        name: 'Haute Couture Cut & Style',            name_ar: 'قص شعر هوت كوتور مع تصفيف فني',       category: 'hair',    description: 'Bespoke precision haircutting tailored to your face structure, including intensive wash and essential mask.',                                              description_ar: 'قص شعر احترافي مخصص ومصمم وفقاً لملامح وتفاصيل وجهكِ، مع غسيل فاخر وماسك مغذٍ أساسي.',                      price: '250 QAR', duration: '60 mins',   popular: false },
    { id: 'nails-classic',   name: 'Classic Rose-Gold Mani-Pedi',          name_ar: 'مانيكير وباديكير الذهب الوردي الكلاسيكي', category: 'nails', description: 'Essential soaking, cuticle grooming, exfoliation scrub, and massage capped with elite long-wear luxury polish.',                                       description_ar: 'نقع معطر، تنظيف البشرة وترتيب الأظافر، صنفرة تقشير لطيفة، ومساج مرطب ناعم ينتهي بطلاء أظافر طويل الأمد.',    price: '180 QAR', duration: '60 mins',   popular: false },
    { id: 'nails-gel',       name: 'Elite Russian Gel Manicure',           name_ar: 'مانيكير جل روسي فاخر جاف',            category: 'nails',   description: 'Ultra-precise electric file dry manicure, structure gel overlay to strengthen natural nails, finished with gel shade.',                                   description_ar: 'تنظيف أظافر جاف فائق الدقة بالمبرد الكهربائي الروسي، مع طبقة جل داعمة لتقوية الأظافر الطبيعية.',             price: '220 QAR', duration: '75 mins',   popular: true  },
    { id: 'nails-acrylic',   name: 'Couture Acrylic Extensions',           name_ar: 'تركيب أكليريك فاخر مع رسم أظافر',    category: 'nails',   description: 'Handcrafted premium acrylic extensions with modern custom hand-painted nail designs, crystal gems, or gold foil.',                                       description_ar: 'تمديد وتركيب أظافر أكريليك صلب ومتين مع رسم فني يدوي رائع، ورقائق ذهبية مذهلة أو فصوص كريستال.',            price: '350 QAR', duration: '2 hours',   popular: false },
    { id: 'hammam-royal',    name: 'Royal Hammam & Pure Argan Ritual',     name_ar: 'حمام مغربي ملكي مع طقوس الأرغان النقي', category: 'hammam', description: 'Authentic Moroccan black soap steam bath, professional Kessa glove full-body scrub, finished with Argan oil massage.',                                  description_ar: 'حمام بخار تقليدي مع الصابون البلدي الأسود الأصيل، فرك كامل للجسم بليفة كيسة احترافية، متبوعاً بمساج منعش بزيت الأرغان.', price: '450 QAR', duration: '90 mins', popular: true  },
    { id: 'hammam-bridal',   name: 'Imperial Moroccan Bridal Hammam',       name_ar: 'حمام مغربي ملكي إمبراطوري للعرائس', category: 'hammam',  description: 'Ultimate body restoration incorporating seven natural clays, rosewater mask, honey body wrap, and deep cellular hydration.',                               description_ar: 'الطقس المتكامل لرفاهية الجسم الفاخر باستعمال الطين المغربي السبعة، ماسك بماء الورد، تغليف بالعسل ومساج ترطيب عميق.', price: '750 QAR', duration: '2 hours', popular: false },
    { id: 'henna-hand',      name: 'Delicate Henna Hand Designs',           name_ar: 'نقوش حناء يد دقيقة وناعمة',          category: 'henna',   description: 'Bespoke geometric and organic henna designs for both hands, applied using pure organic skin-friendly henna paste.',                                       description_ar: 'نقوش حناء عربية وهندسية دقيقة تناسب ذوقكِ على كلا اليدين، مصنوعة من حناء طبيعية مغذية وآمنة.',               price: '150 QAR', duration: '45 mins',   popular: false },
    { id: 'henna-bridal',    name: 'Majestic Bridal Full Henna',            name_ar: 'نقش حناء كامل فخم للعرائس',          category: 'henna',   description: 'Exquisite, detailed custom bridal henna patterns covering hands, wrists, forearms, and feet. Includes design consultation.',                             description_ar: 'نقوش حناء زفاف تفصيلية ملوكية ممتدة تغطي اليدين والمعصمين والساعدين والقدمين، مع جلسة تشاور مسبقة.',          price: '900 QAR', duration: '4 hours',   popular: false },
    { id: 'facial-glow',     name: 'Rose-Gold Glowing Hydra-Facial',        name_ar: 'هيدرا فيشال الذهب الوردي لتوهج البشرة', category: 'facial', description: 'Deep micro-dermabrasion hydration vortex infusion with multi-peptides and luxurious organic rose extract mask.',                                         description_ar: 'جلسة تنظيف وتغذية عميقة بتقنية الدفع المائي مع سيرومات الببتيدات المغذية وماسك طبيعي غني بمستخلص الورد.',   price: '350 QAR', duration: '60 mins',   popular: true  },
    { id: 'facial-collagen', name: 'Sculpting Collagen Lift Facial',        name_ar: 'فيشال لشد ونحت البشرة بالكولاجين',  category: 'facial',  description: 'Anti-aging structural facial utilizing double-collagen serums, micro-current lifting, and cold-stone sculpting massage.',                              description_ar: 'علاج مكثف لمكافحة علامات التقدم بالسن باستعمال سيروم الكولاجين المزدوج وتقنية التحفيز الجزئي للشد.',         price: '500 QAR', duration: '75 mins',   popular: false },
    { id: 'spa-massage',     name: 'Lavender Head-to-Toe Massage Spa',      name_ar: 'مساج استرخاء اللافندر من الرأس للقدم', category: 'spa',   description: 'Sensory full body massage using warm organic French lavender oil and hot lava stones for profound deep muscle relief.',                                  description_ar: 'مساج حسي وجسدي كامل للجسم باستخدام زيت الخزامى الفرنسي العضوي الدافئ وأحجار الصخر البركاني الساخنة.',        price: '300 QAR', duration: '60 mins',   popular: false },
    { id: 'spa-head',        name: 'Royal Japanese Head-Spa Treatment',     name_ar: 'علاج ومساج فروة الرأس الياباني الملكي', category: 'spa',   description: 'Luxurious scalp exfoliating massage, custom herbal water scaling rings, moisture steaming hair mask, and shoulder massage.',                            description_ar: 'استرخاء يبدأ بتقشير الفروة برغوة غنية، وتمرير المياه العشبية الحلقية الدافئة، حمام بخار مكثف للشعر.',         price: '280 QAR', duration: '50 mins',   popular: false },
  ];
  writeDb('services', services);
  console.log('✅ Seeded', services.length, 'services');
}

seedServices();

// ─── AI Gemini Setup ──────────────────────────────────────────────────────────
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const SALON_SYSTEM_PROMPT = `You are "Nilda AI", the exclusive luxury virtual beauty concierge for Nilda Ladies Beauty Salon in Al-Rayyan, Qatar. You are warm, elegant, personalized and fluent in both English and Arabic (respond in same language as user).

SALON DETAILS:
- Name: Nilda Ladies Beauty Salon (نيلدا للتجميل)
- Location: Al-Rayyan, Qatar (private luxury villa)
- Phone: +974 7037 7076
- Hours: Sunday–Saturday 10AM–9PM (Friday: 1PM–9PM)
- Email: contact@nilda.com
- 100% ladies-only sanctuary — no men permitted
- Full female staff team only
- Private gated villa with parking
- Complimentary Qatari coffee & dates

SERVICES & PRICES (QAR):
HAIR: Royal Blowout 150 QAR (45min) | Parisian Balayage 850 QAR (3hr) | Keratin 1200 QAR (2.5hr) | Haute Couture Cut 250 QAR (1hr)
NAILS: Rose-Gold Mani-Pedi 180 QAR (1hr) | Russian Gel Manicure 220 QAR (75min) | Acrylic Extensions 350 QAR (2hr)
MOROCCAN HAMMAM: Royal Hammam & Argan 450 QAR (90min) | Imperial Bridal Hammam 750 QAR (2hr)
HENNA: Delicate Hand Designs 150 QAR (45min) | Majestic Bridal Henna 900 QAR (4hr)
FACIALS: Hydra-Facial 350 QAR (1hr) | Collagen Lift 500 QAR (75min)
SPA: Lavender Full Body Massage 300 QAR (1hr) | Japanese Head Spa 280 QAR (50min)

PERSONALITY: Speak warmly with luxury flair. Use "darling" or "lovely lady" occasionally in English. In Arabic be elegant and respectful. Be concise (max 200 words). Always offer to help book an appointment and direct to WhatsApp +974 7037 7076 for complex questions.`;

// ─── API ROUTES ───────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', salon: 'Nilda Beauty' }));

// ── Services ──
app.get('/api/services', (req, res) => {
  res.json(readDb('services'));
});

app.post('/api/services', (req, res) => {
  const { name, name_ar, category, description, description_ar, price, duration, popular } = req.body;
  if (!name || !category || !description || !price || !duration) {
    return res.status(400).json({ error: 'Missing required service fields' });
  }
  const services = readDb('services');
  const newService = {
    id: `${category}-${uuidv4().split('-')[0]}`,
    name, name_ar: name_ar || '', category, description,
    description_ar: description_ar || '', price, duration,
    popular: popular || false,
    createdAt: new Date().toISOString()
  };
  services.push(newService);
  writeDb('services', services);
  res.status(201).json(newService);
});

app.delete('/api/services/:id', (req, res) => {
  const services = readDb('services');
  const filtered = services.filter(s => s.id !== req.params.id);
  writeDb('services', filtered);
  res.json({ success: true });
});

// ── Bookings ──
app.get('/api/bookings', (req, res) => {
  res.json(readDb('bookings'));
});

app.post('/api/bookings', (req, res) => {
  const { clientName, clientPhone, clientEmail, serviceId, serviceName, date, timeSlot, notes, sendWhatsApp } = req.body;
  if (!clientName || !clientPhone || !serviceId || !date || !timeSlot) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  // Sanitize inputs
  const sanitized = {
    clientName: clientName.trim().slice(0, 100),
    clientPhone: clientPhone.trim().slice(0, 20),
    clientEmail: (clientEmail || '').trim().slice(0, 100),
    serviceId: serviceId.trim(),
    serviceName: (serviceName || '').trim().slice(0, 100),
    date: date.trim(),
    timeSlot: timeSlot.trim(),
    notes: (notes || '').trim().slice(0, 500),
  };

  // Check date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(sanitized.date)) {
    return res.status(400).json({ error: 'Invalid date format' });
  }
  // Check time slot
  if (!/^\d{2}:\d{2}$/.test(sanitized.timeSlot)) {
    return res.status(400).json({ error: 'Invalid time slot format' });
  }

  const bookings = readDb('bookings');

  // Check double-booking
  const conflict = bookings.find(b =>
    b.date === sanitized.date &&
    b.timeSlot === sanitized.timeSlot &&
    b.status !== 'cancelled'
  );
  if (conflict) {
    return res.status(409).json({ error: 'Time slot already booked. Please choose another.' });
  }

  const newBooking = {
    id: uuidv4(),
    ...sanitized,
    status: 'pending',
    sendWhatsApp: !!sendWhatsApp,
    createdAt: new Date().toISOString()
  };

  bookings.push(newBooking);
  writeDb('bookings', bookings);

  // Build WhatsApp message URL
  const waMsg = encodeURIComponent(
    `🌸 New Booking Request — Nilda Beauty Salon\n\nClient: ${sanitized.clientName}\nPhone: ${sanitized.clientPhone}\nService: ${sanitized.serviceName}\nDate: ${sanitized.date}\nTime: ${sanitized.timeSlot}\nNotes: ${sanitized.notes || 'None'}\n\nPlease confirm this appointment.`
  );
  const waUrl = `https://wa.me/97470377076?text=${waMsg}`;

  res.status(201).json({ booking: newBooking, waUrl });
});

app.patch('/api/bookings/:id', (req, res) => {
  const bookings = readDb('bookings');
  const idx = bookings.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Booking not found' });
  bookings[idx] = { ...bookings[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeDb('bookings', bookings);
  res.json(bookings[idx]);
});

app.delete('/api/bookings/:id', (req, res) => {
  const bookings = readDb('bookings');
  writeDb('bookings', bookings.filter(b => b.id !== req.params.id));
  res.json({ success: true });
});

// ── Gallery ──
app.get('/api/gallery', (req, res) => {
  res.json(readDb('gallery'));
});

app.post('/api/gallery', (req, res) => {
  const { src, title, title_ar, type, desc, desc_ar } = req.body;
  if (!src || !title || !type) return res.status(400).json({ error: 'Missing gallery fields' });

  // Validate URL
  try { new URL(src); } catch { return res.status(400).json({ error: 'Invalid image URL' }); }

  const gallery = readDb('gallery');
  const item = {
    id: uuidv4(),
    src: src.slice(0, 1000),
    title: title.slice(0, 100),
    title_ar: (title_ar || '').slice(0, 100),
    type,
    desc: (desc || '').slice(0, 300),
    desc_ar: (desc_ar || '').slice(0, 300),
    createdAt: new Date().toISOString()
  };
  gallery.push(item);
  writeDb('gallery', gallery);
  res.status(201).json(item);
});

app.delete('/api/gallery/:id', (req, res) => {
  const gallery = readDb('gallery');
  writeDb('gallery', gallery.filter(g => g.id !== req.params.id));
  res.json({ success: true });
});

// ── Reviews ──
app.get('/api/reviews', (req, res) => {
  res.json(readDb('reviews'));
});

app.post('/api/reviews', (req, res) => {
  const { name, name_ar, location, location_ar, service, service_ar, content, content_ar, rating, date } = req.body;
  if (!name || !content || !rating) return res.status(400).json({ error: 'Missing review fields' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

  const reviews = readDb('reviews');
  const review = {
    id: uuidv4(),
    name: name.slice(0, 60),
    name_ar: (name_ar || '').slice(0, 60),
    location: (location || 'Qatar').slice(0, 60),
    location_ar: (location_ar || '').slice(0, 60),
    service: (service || '').slice(0, 80),
    service_ar: (service_ar || '').slice(0, 80),
    content: content.slice(0, 500),
    content_ar: (content_ar || '').slice(0, 500),
    rating: parseInt(rating),
    date: (date || new Date().toLocaleDateString('en-GB')).slice(0, 20),
    createdAt: new Date().toISOString()
  };
  reviews.push(review);
  writeDb('reviews', reviews);
  res.status(201).json(review);
});

app.delete('/api/reviews/:id', (req, res) => {
  const reviews = readDb('reviews');
  writeDb('reviews', reviews.filter(r => r.id !== req.params.id));
  res.json({ success: true });
});

// ── Staff ──
app.get('/api/staff', (req, res) => res.json(readDb('staff')));
app.post('/api/staff', (req, res) => {
  const { name, role, bio } = req.body;
  if (!name || !role) return res.status(400).json({ error: 'Missing staff fields' });
  const staff = readDb('staff');
  const member = { id: uuidv4(), name, role, bio: bio || '', createdAt: new Date().toISOString() };
  staff.push(member);
  writeDb('staff', staff);
  res.status(201).json(member);
});
app.delete('/api/staff/:id', (req, res) => {
  writeDb('staff', readDb('staff').filter(s => s.id !== req.params.id));
  res.json({ success: true });
});

// ── Products ──
app.get('/api/products', (req, res) => res.json(readDb('products')));
app.post('/api/products', (req, res) => {
  const { name, price, description } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Missing product fields' });
  const products = readDb('products');
  const product = { id: uuidv4(), name, price, description: description || '', createdAt: new Date().toISOString() };
  products.push(product);
  writeDb('products', products);
  res.status(201).json(product);
});
app.delete('/api/products/:id', (req, res) => {
  writeDb('products', readDb('products').filter(p => p.id !== req.params.id));
  res.json({ success: true });
});

// ── Blog ──
app.get('/api/blog', (req, res) => res.json(readDb('blog')));
app.post('/api/blog', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Missing blog fields' });
  const blog = readDb('blog');
  const post = { id: uuidv4(), title, content, createdAt: new Date().toISOString() };
  blog.push(post);
  writeDb('blog', blog);
  res.status(201).json(post);
});
app.delete('/api/blog/:id', (req, res) => {
  writeDb('blog', readDb('blog').filter(p => p.id !== req.params.id));
  res.json({ success: true });
});

// ── Admin Login ──
app.post('/api/admin/login', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  const attempt = loginAttempts.get(ip) || { count: 0, blockedUntil: 0 };
  if (attempt.blockedUntil > now) {
    return res.status(429).json({ error: 'Device temporarily blocked. Try again later.', blocked: true });
  }

  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    loginAttempts.delete(ip);
    return res.json({ success: true, token: process.env.ADMIN_TOKEN || 'nilda_admin_secret_2024' });
  }

  attempt.count += 1;
  if (attempt.count >= 5) {
    attempt.blockedUntil = now + 15 * 60 * 1000; // block 15 min
    attempt.count = 0;
  }
  loginAttempts.set(ip, attempt);
  return res.status(401).json({ error: 'Invalid credentials', attemptsLeft: Math.max(0, 5 - attempt.count) });
});

// ── AI Chat ──
app.post('/api/chat', async (req, res) => {
  const { message, lang, history } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }
  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message too long' });
  }

  if (!genAI) {
    // Fallback response when no API key
    const fallback = lang === 'ar'
      ? 'مرحباً يا حبيبتي! 🌸 للاستفسار عن الخدمات أو حجز موعد، تواصلي معنا مباشرة على واتساب: +974 7037 7076'
      : 'Hello lovely! 🌸 For inquiries or to book an appointment, reach us on WhatsApp: +974 7037 7076';
    return res.json({ reply: fallback });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build conversation history for Gemini
    const safeHistory = (Array.isArray(history) ? history : [])
      .slice(-10) // last 10 turns
      .filter(m => m.role && m.content)
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SALON_SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I am Nilda AI, your luxury beauty concierge. How may I help you today?' }] },
        ...safeHistory
      ],
      generationConfig: { maxOutputTokens: 350, temperature: 0.7 }
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();
    res.json({ reply });

  } catch (err) {
    console.error('Gemini error:', err.message);
    const fallback = lang === 'ar'
      ? '🌸 نيلدا مشغولة الآن! تواصلي على واتساب: +974 7037 7076'
      : '🌸 Nilda is briefly away! Contact us on WhatsApp: +974 7037 7076';
    res.json({ reply: fallback });
  }
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌸 Nilda Beauty Salon API running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints: /api/services | /api/bookings | /api/gallery | /api/reviews | /api/chat`);
  console.log(`🔐 Admin login: POST /api/admin/login`);
  console.log(`💾 Database: ${DB_DIR}\n`);
});
