import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware to parse JSON (with limit up to 50MB to accept custom image uploads)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Database File Paths
const bookingsFilePath = path.join(process.cwd(), "bookings.json");
const servicesFilePath = path.join(process.cwd(), "services.json");
const productsFilePath = path.join(process.cwd(), "products.json");
const staffFilePath = path.join(process.cwd(), "staff.json");
const reviewsFilePath = path.join(process.cwd(), "reviews.json");
const galleryFilePath = path.join(process.cwd(), "gallery.json");
const postsFilePath = path.join(process.cwd(), "posts.json");
const paymentsFilePath = path.join(process.cwd(), "payments.json");

// Core File Init helper
const initJsonFile = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
  }
};

// Initialize all databases with completely empty datasets in sync with strict business rules
[
  bookingsFilePath,
  servicesFilePath,
  productsFilePath,
  staffFilePath,
  reviewsFilePath,
  galleryFilePath,
  postsFilePath,
  paymentsFilePath
].forEach(initJsonFile);

// Helper to read and write database records cleanly
function readDb(filePath: string): any[] {
  try {
    const rawData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(rawData);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

function writeDb(filePath: string, data: any[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// ----------------- API Endpoints -----------------

// --- Services API ---
app.get("/api/services", (req, res) => {
  try {
    const services = readDb(servicesFilePath);
    res.json(services);
  } catch {
    res.status(500).json({ error: "Failed to read services database." });
  }
});

app.post("/api/services", (req, res) => {
  try {
    const { name, name_ar, category, description, description_ar, price, duration, popular } = req.body;
    if (!name || !category || !description || !price || !duration) {
      return res.status(400).json({ error: "Missing required service parameters." });
    }
    const services = readDb(servicesFilePath);
    const newService = {
      id: "ser_" + Math.random().toString(36).substr(2, 9),
      name,
      name_ar,
      category,
      description,
      description_ar,
      price,
      duration,
      popular: !!popular,
      createdAt: new Date().toISOString()
    };
    services.push(newService);
    writeDb(servicesFilePath, services);
    res.status(201).json(newService);
  } catch {
    res.status(500).json({ error: "Failed to build service." });
  }
});

app.delete("/api/services/:id", (req, res) => {
  try {
    const { id } = req.params;
    let services = readDb(servicesFilePath);
    services = services.filter((s: any) => s.id !== id);
    writeDb(servicesFilePath, services);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete service." });
  }
});

// --- Products API ---
app.get("/api/products", (req, res) => {
  try {
    const products = readDb(productsFilePath);
    res.json(products);
  } catch {
    res.status(500).json({ error: "Failed to read products database." });
  }
});

app.post("/api/products", (req, res) => {
  try {
    const { name, name_ar, description, description_ar, price, image } = req.body;
    if (!name || !description || !price) {
      return res.status(400).json({ error: "Missing product details." });
    }
    const products = readDb(productsFilePath);
    const newProduct = {
      id: "prod_" + Math.random().toString(36).substr(2, 9),
      name,
      name_ar,
      description,
      description_ar,
      price,
      image,
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    writeDb(productsFilePath, products);
    res.status(201).json(newProduct);
  } catch {
    res.status(500).json({ error: "Failed to save product." });
  }
});

app.delete("/api/products/:id", (req, res) => {
  try {
    const { id } = req.params;
    let products = readDb(productsFilePath);
    products = products.filter((p: any) => p.id !== id);
    writeDb(productsFilePath, products);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete product." });
  }
});

// --- Staff API ---
app.get("/api/staff", (req, res) => {
  try {
    const staff = readDb(staffFilePath);
    res.json(staff);
  } catch {
    res.status(500).json({ error: "Failed to read staff database." });
  }
});

app.post("/api/staff", (req, res) => {
  try {
    const { name, name_ar, role, role_ar, bio, bio_ar, image } = req.body;
    if (!name || !role) {
      return res.status(400).json({ error: "Missing staff information." });
    }
    const staff = readDb(staffFilePath);
    const newStaff = {
      id: "stf_" + Math.random().toString(36).substr(2, 9),
      name,
      name_ar,
      role,
      role_ar,
      bio,
      bio_ar,
      image,
      createdAt: new Date().toISOString()
    };
    staff.push(newStaff);
    writeDb(staffFilePath, staff);
    res.status(201).json(newStaff);
  } catch {
    res.status(500).json({ error: "Failed to add staff profile." });
  }
});

app.delete("/api/staff/:id", (req, res) => {
  try {
    const { id } = req.params;
    let staff = readDb(staffFilePath);
    staff = staff.filter((s: any) => s.id !== id);
    writeDb(staffFilePath, staff);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete staff." });
  }
});

// --- Gallery API ---
app.get("/api/gallery", (req, res) => {
  try {
    const gallery = readDb(galleryFilePath);
    res.json(gallery);
  } catch {
    res.status(500).json({ error: "Failed to read gallery database." });
  }
});

app.post("/api/gallery", (req, res) => {
  try {
    const { src, title, title_ar, desc, desc_ar, type } = req.body;
    if (!src || !title || !type) {
      return res.status(400).json({ error: "Missing gallery item parameters." });
    }
    const gallery = readDb(galleryFilePath);
    const newItem = {
      id: "gal_" + Math.random().toString(36).substr(2, 9),
      src,
      title,
      title_ar,
      desc,
      desc_ar,
      type,
      createdAt: new Date().toISOString()
    };
    gallery.push(newItem);
    writeDb(galleryFilePath, gallery);
    res.status(201).json(newItem);
  } catch {
    res.status(500).json({ error: "Failed to upload gallery image data." });
  }
});

app.delete("/api/gallery/:id", (req, res) => {
  try {
    const { id } = req.params;
    let gallery = readDb(galleryFilePath);
    gallery = gallery.filter((item: any) => item.id !== id);
    writeDb(galleryFilePath, gallery);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete gallery image." });
  }
});

// --- Reviews/Testimonials API ---
app.get("/api/reviews", (req, res) => {
  try {
    const reviews = readDb(reviewsFilePath);
    res.json(reviews);
  } catch {
    res.status(500).json({ error: "Failed to read review records." });
  }
});

app.post("/api/reviews", (req, res) => {
  try {
    const { name, name_ar, location, location_ar, rating, service, service_ar, content, content_ar } = req.body;
    if (!name || !rating || !service || !content) {
      return res.status(400).json({ error: "Missing review entries." });
    }
    const reviews = readDb(reviewsFilePath);
    const newReview = {
      id: "rev_" + Math.random().toString(36).substr(2, 9),
      name,
      name_ar,
      location: location || "Doha, Qatar",
      location_ar: location_ar || "الدوحة، قطر",
      rating: Number(rating),
      service,
      service_ar,
      content,
      content_ar,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
      createdAt: new Date().toISOString()
    };
    reviews.push(newReview);
    writeDb(reviewsFilePath, reviews);
    res.status(201).json(newReview);
  } catch {
    res.status(500).json({ error: "Failed to publish review." });
  }
});

app.delete("/api/reviews/:id", (req, res) => {
  try {
    const { id } = req.params;
    let reviews = readDb(reviewsFilePath);
    reviews = reviews.filter((r: any) => r.id !== id);
    writeDb(reviewsFilePath, reviews);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to remove review." });
  }
});

// --- Blog Posts API ---
app.get("/api/posts", (req, res) => {
  try {
    const posts = readDb(postsFilePath);
    res.json(posts);
  } catch {
    res.status(500).json({ error: "Failed to read blog database." });
  }
});

app.post("/api/posts", (req, res) => {
  try {
    const { title, title_ar, content, content_ar, author, author_ar, image } = req.body;
    if (!title || !content || !author) {
      return res.status(400).json({ error: "Missing required blog post details." });
    }
    const posts = readDb(postsFilePath);
    const newPost = {
      id: "post_" + Math.random().toString(36).substr(2, 9),
      title,
      title_ar,
      content,
      content_ar,
      author,
      author_ar: author_ar || "Nilda Team",
      image,
      createdAt: new Date().toISOString()
    };
    posts.push(newPost);
    writeDb(postsFilePath, posts);
    res.status(201).json(newPost);
  } catch {
    res.status(500).json({ error: "Failed to create blog post." });
  }
});

app.delete("/api/posts/:id", (req, res) => {
  try {
    const { id } = req.params;
    let posts = readDb(postsFilePath);
    posts = posts.filter((p: any) => p.id !== id);
    writeDb(postsFilePath, posts);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete blog post." });
  }
});

// --- Payments API ---
app.get("/api/payments", (req, res) => {
  try {
    const payments = readDb(paymentsFilePath);
    res.json(payments);
  } catch {
    res.status(500).json({ error: "Failed to read payments." });
  }
});

// Helper to calculate price integer value (from "150 QAR" -> 150)
function parsePriceToInt(priceStr: string): number {
  if (!priceStr) return 0;
  const match = priceStr.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

// --- Bookings API ---
app.get("/api/bookings", (req, res) => {
  try {
    const bookings = readDb(bookingsFilePath);
    res.json(bookings);
  } catch {
    res.status(500).json({ error: "Failed to read bookings history." });
  }
});

app.post("/api/bookings", (req, res) => {
  try {
    const { clientName, clientPhone, clientEmail, serviceId, serviceName, date, timeSlot, notes } = req.body;

    if (!clientName || !clientPhone || !serviceId || !serviceName || !date || !timeSlot) {
      return res.status(400).json({ error: "Missing required booking details." });
    }

    const bookings = readDb(bookingsFilePath);

    // Double booking guard
    const exists = bookings.some((b: any) => b.date === date && b.timeSlot === timeSlot && b.status !== "cancelled");
    if (exists) {
      return res.status(409).json({ error: "This time slot is already booked. Please choose another." });
    }

    const newBooking = {
      id: "bk_" + Math.random().toString(36).substr(2, 9),
      clientName,
      clientPhone,
      clientEmail: clientEmail || "",
      serviceId,
      serviceName,
      date,
      timeSlot,
      notes: notes || "",
      status: "pending",
      createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    writeDb(bookingsFilePath, bookings);

    res.status(201).json({ success: true, booking: newBooking });
  } catch {
    res.status(500).json({ error: "Failed to make a reservation." });
  }
});

app.patch("/api/bookings/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid booking status." });
    }

    const bookings = readDb(bookingsFilePath);
    const bookingIndex = bookings.findIndex((b: any) => b.id === id);

    if (bookingIndex === -1) {
      return res.status(404).json({ error: "Booking reservation not found." });
    }

    const oldStatus = bookings[bookingIndex].status;
    bookings[bookingIndex].status = status;
    writeDb(bookingsFilePath, bookings);

    // If booking changed to confirmed, create a payment record based on actual service prices
    if (status === "confirmed" && oldStatus !== "confirmed") {
      const payments = readDb(paymentsFilePath);
      const services = readDb(servicesFilePath);
      
      // Attempt to find actual price from services DB, or fallback to standard price parsing
      const svc = services.find((s: any) => s.id === bookings[bookingIndex].serviceId);
      const priceStr = svc ? svc.price : "200 QAR"; 
      const priceVal = parsePriceToInt(priceStr);

      // Create new payment model record
      const newPayment = {
        id: "pay_" + Math.random().toString(36).substr(2, 9),
        bookingId: id,
        amount: priceVal,
        status: "paid",
        createdAt: new Date().toISOString()
      };
      payments.push(newPayment);
      writeDb(paymentsFilePath, payments);
    } else if (status === "cancelled") {
      // Filter out payments associated with cancelled bookings to accurately calculate revenue
      let payments = readDb(paymentsFilePath);
      payments = payments.filter((p: any) => p.bookingId !== id);
      writeDb(paymentsFilePath, payments);
    }

    res.json({ success: true, booking: bookings[bookingIndex] });
  } catch (err) {
    console.error("Error patching booking status:", err);
    res.status(500).json({ error: "Failed to update reservation status." });
  }
});

// --- Analytics API ---
// Calculated dynamically from real records with absolute accuracy! No hardcoding!
app.get("/api/analytics", (req, res) => {
  try {
    const bookings = readDb(bookingsFilePath);
    const payments = readDb(paymentsFilePath);
    
    // Unique customers calculated via dynamic COUNT(customers)
    const uniquePhones = new Set(bookings.map((b: any) => b.clientPhone.trim()));
    const totalCustomersCount = uniquePhones.size;

    // Total appointments computed via dynamic COUNT(appointments)
    const totalAppointmentsCount = bookings.length;

    // Total actual revenue generated computed via dynamic SUM(payments.amount)
    const totalRevenueSum = payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    // Popular services calculated from completed bookings count
    const serviceCounts: { [key: string]: { name: string; count: number } } = {};
    bookings.forEach((b: any) => {
      if (b.status === "confirmed") {
        if (!serviceCounts[b.serviceId]) {
          serviceCounts[b.serviceId] = { name: b.serviceName, count: 0 };
        }
        serviceCounts[b.serviceId].count += 1;
      }
    });

    const popularServices = Object.keys(serviceCounts)
      .map(id => ({
        id,
        name: serviceCounts[id].name,
        count: serviceCounts[id].count
      }))
      .sort((a, b) => b.count - a.count);

    res.json({
      totalCustomers: totalCustomersCount,
      totalAppointments: totalAppointmentsCount,
      revenue: totalRevenueSum,
      popularServices
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch analytics." });
  }
});

// Gemini Chat advisor endpoint (Server side)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message content is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Virtual AI Assistant is available in premium mode, but its key configuration is missing. Please configure GEMINI_API_KEY."
      });
    }

    // Initialize GoogleGenAI SDK with custom header for telemetry
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });

    // Elegant and luxurious prompt instruction
    const systemInstruction = `You are "Nilda Custom AI Concierge", the virtual elite beauty, styling, and wellness advisor for Nilda Beauty Salon located in Al-Rayyan, Qatar (near Doha).
    Your character traits:
    - Highly sophisticated, warm, and elite. Make every visitor feel like royalty.
    - Standard greetings must include terms of endearment like "darling", "beautiful", "my lady".
    - You write cleanly, split your tips into elegant paragraphs, and use elegant formatting. Only use simple bullet points or beautiful bold text for highlighting names.
    - Fluent in English and friendly basic Arabic styling greetings (like "Ahlan wa sahlan, habibi! Welcome to luxury!").
    - Highly knowledgeable on beauty trends in Doha, premium nail art, hairstyles (blowouts, balayage, intensive keratin, royal care sessions), Moroccan Hammam body treatments, and relaxing head-spas.

    CRITICAL RULES:
    - Under NO circumstances should you output any programming code, coding syntax, markdown code blocks (such as \`\`\`html or \`\`\`javascript), markdown tables, bracket symbols like <kbd> or <script> tags, or json objects.
    - You are speaking directly to a human client looking to book a luxury service. Never talk about your AI backend, your code, API keys, endpoints, or anything technical.
    - If the user asks for code or says anything weird, gracefully steer them back to our premier haircare, nail designs, and Moroccan Hammam baths by speaking like a warm, loving salon hostess.

    Business and Booking Guidelines:
    - Open Hours: Monday to Surtday 10:00 to 21:00, Friday 13:00 to 21:00 (Always open, including Sundays 10:00 to 21:00).
    - Phone/WhatsApp Number: +97470377076
    - Address: Al-Rayyan, Qatar (gorgeous 2-story cream and burgundy villa salon).
    - Assist the visitor in discovering our services:
      * Hair Styling/Color: Blowout (starting 150 QAR), Balayage/Highlight (starting 800 QAR), Intensive Treatment (Starting 400 QAR)
      * Nail care: Manicure & Pedicure (Starting 180 QAR), Custom Acrylic Art (Starting 250 QAR)
      * Moroccan Hammam Bath: Royal Hammam with pure Argan oils, herbal wraps, and dead-skin exfoliation (450 QAR)
      * Spa & Facial Treatments: Premium Glowing hydra-facial (350 QAR)
    - If they asks about styling recommendations (e.g. skin tone matching, henna patterns, bridal treatments), offer detailed, beautiful advice with confidence.
    - Always conclude with a gentle reminder to book their slots using our booking system widget on the page or directly via WhatsApp (+97470377076).`;

    // Construct formatted parts from user's history
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }]
        });
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || "I was momentarily dazzled by your elegance, darling. Can you repeat that?";
    res.json({ reply });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    let userFriendlyError = "Our virtual advisor is enjoying a refreshing Moroccan tea session, darling. Please re-send your message, or chat with our live ladies now via WhatsApp!";
    const msg = String(error.message || "");
    
    if (msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("high demand") || msg.includes("overloaded") || msg.includes("resource") || msg.includes("exhausted")) {
      userFriendlyError = "Oh, my lady! Nilda is momentarily hearing from so many beautiful guests in Doha right now. Please repeat your question in a moment, or contact our team directly at +974 7037 7076!";
    } else if (msg.includes("API_KEY") || msg.includes("API key") || msg.includes("key") || msg.includes("credentials")) {
      userFriendlyError = "Nilda Advisor is currently operating in premium guest mode, but our styling keys are being polished. Please ping us on WhatsApp at +974 7037 7076 to book your private villa slot directly.";
    } else if (msg.includes("{") || msg.includes("}") || msg.includes("code") || msg.includes("status")) {
      userFriendlyError = "Nilda is momentarily styling another client, darling! Can you ask again in a brief second? Or book your secure spot using the scheduling form below.";
    }

    res.status(500).json({ error: userFriendlyError });
  }
});

// ----------------- Vite / Static Files Middleware -----------------

async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    // Integrate Vite development server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static asset serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SALON SERVER] Nilda Beauty Salon is live on http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  bootstrap();
}

export default app;
