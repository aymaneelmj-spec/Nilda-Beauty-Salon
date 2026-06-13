export type Language = 'en' | 'ar';

export interface Service {
  id: string;
  name: string;
  name_ar?: string;
  category: 'hair' | 'nails' | 'henna' | 'facial' | 'hammam' | 'spa';
  description: string;
  description_ar?: string;
  price: string; // e.g. "200 QAR" or "Starting from 150 QAR"
  duration: string; // e.g. "45 min" or "2 hours"
  popular?: boolean;
}

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "14:30"
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Product {
  id: string;
  name: string;
  name_ar?: string;
  description: string;
  description_ar?: string;
  price: string;
  image?: string;
  createdAt: string;
}

export interface Staff {
  id: string;
  name: string;
  name_ar?: string;
  role: string;
  role_ar?: string;
  bio?: string;
  bio_ar?: string;
  image?: string;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  title: string;
  title_ar?: string;
  desc?: string;
  desc_ar?: string;
  type: 'hair' | 'nails' | 'hammam' | 'villa';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  title_ar?: string;
  content: string;
  content_ar?: string;
  author: string;
  author_ar?: string;
  image?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  name_ar?: string;
  location?: string;
  location_ar?: string;
  rating: number; // 1 to 5
  date: string;
  service: string;
  service_ar?: string;
  content: string;
  content_ar?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: 'paid' | 'unpaid';
  createdAt: string;
}

