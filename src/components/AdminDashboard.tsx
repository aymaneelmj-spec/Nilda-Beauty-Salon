import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Check, X, RefreshCw, Trash2, Phone, Calendar, Clock, Lock, 
  Sparkles, DollarSign, Users, Award, Star, BookOpen, Layers, 
  ShoppingBag, Image as ImageIcon, Plus, Trash
} from 'lucide-react';
import { Booking, Service, Product, Staff, GalleryImage, BlogPost, Review } from '../types';

export interface AdminDashboardProps {
  onClose: () => void;
  refreshSignal: number;
  triggerRefresh: () => void;
  lang?: 'en' | 'ar';
  setLang?: (lang: 'en' | 'ar') => void;
}

export default function AdminDashboard({ onClose, refreshSignal, triggerRefresh, lang, setLang }: AdminDashboardProps) {
  const currentLang = lang || 'en';
  const isRtl = currentLang === 'ar';
  
  const toggleLanguage = () => {
    if (setLang) {
      setLang(currentLang === 'en' ? 'ar' : 'en');
    }
  };

  const t = {
    // Portal unlock / Login
    staffPortal: isRtl ? 'بوابة إدارة نيلدا' : 'Nilda Staff Portal',
    restrictedArea: isRtl ? 'منطقة محظورة' : 'Restricted Area',
    restrictedDesc: isRtl 
      ? 'لوحة تحكم خاصة ومحمية لمالكة العمل والمدير العام. يرجى تسجيل الدخول باستخدام بياناتك.' 
      : 'Restricted dashboard. Please authorize with your salon owner credentials.',
    businessEmail: isRtl ? 'البريد الإلكتروني للعمل' : 'Business Email',
    securityPassword: isRtl ? 'كلمة المرور الأمنية' : 'Security Password',
    verifyUnlock: isRtl ? 'التحقق وفتح اللوحة' : 'Verify & Unlock',
    returnToWeb: isRtl ? 'العودة إلى الموقع' : 'Return to Website',
    deviceBlocked: isRtl 
      ? 'تم حظر هذا الجهاز مؤقتًا للأمان بسبب محاولات تسجيل دخول فاشلة متعددة.' 
      : 'This device is temporarily blocked for security due to multiple failed logins.',
    tooManyAttempts: isRtl 
      ? 'محاولات فاشلة كثيرة جداً. تم قفل الجهاز مؤقتاً.' 
      : 'Too many failed attempts. Device temporarily locked.',
    welcomeBack: isRtl ? 'مرحباً بعودتك، مدير الصالون!' : 'Welcome back, Salon Director!',

    // Header Panel
    directorBoard: isRtl ? 'إدارة صالون نيلدا' : 'Nilda Director Board',
    realTimeEPR: isRtl ? 'برنامج وقاعدة بيانات عمليات الصالون الإدارية الشاملة' : 'REAL-TIME BUSINESS PRODUCTION DIRECTORY & DATABASE',
    lockBoard: isRtl ? 'قفل الأمان' : 'Lock Board',
    refreshDb: isRtl ? 'تحديث قاعدة البيانات' : 'Refresh database',
    exitDashboard: isRtl ? 'خروج' : 'Exit Dashboard',

    // Tabs
    analytics: isRtl ? 'المبيعات والتقارير' : 'Analytics & Sales',
    bookings: isRtl ? 'جدول الحجوزات' : 'Bookings',
    services: isRtl ? 'الخدمات العلاجية' : 'Services Catalog',
    products: isRtl ? 'متجر المنتجات' : 'Products Boutique',
    staff: isRtl ? 'طاقم العمل' : 'Staff Directory',
    gallery: isRtl ? 'معرض الأعمال' : 'Gallery',
    blog: isRtl ? 'المدونة والأخبار' : 'Blog Posts',
    reviews: isRtl ? 'التقييمات والآراء' : 'Reviews',

    // Analytics Tab
    totalCustomers: isRtl ? 'الزبائن المسجلين' : 'Total Customers',
    totalAppointments: isRtl ? 'إجمالي المواعيد' : 'Total Appointments',
    totalRevenue: isRtl ? 'صافي المبيعات والإيرادات' : 'Total Revenue',
    treatmentTrends: isRtl ? 'اتجاهات الخدمات وصيحات التجميل الأكثر طلباً' : 'Treatment Trends & Popular Services',
    noCustomers: isRtl ? 'لا يوجد زبائن مسجلين بعد.' : 'No customers yet.',
    noAppointments: isRtl ? 'لا توجد مواعيد بعد.' : 'No appointments yet.',
    noRevenue: isRtl ? 'لا تتوفر مبيعات حالياً.' : 'No revenue data available.',
    confirmedBookings: isRtl ? 'حجوزات مؤكدة' : 'Confirmed Bookings',
    noMetrics: isRtl ? 'لا توجد مقاييس كافية لعرض نسب العمليات حالياً.' : 'No completed reservation metrics to calculate popular services.',

    // Bookings Tab
    bookingsItinerary: isRtl ? 'إدارة وتأكيد مواعيد العملاء' : 'Bookings Itinerary',
    reservationService: isRtl ? 'الخدمة المطلوبة والمسجلة' : 'Reservation Service',
    confirmAppt: isRtl ? 'تأكيد الحجز المالي' : 'Confirm Appointment',
    cancelAppt: isRtl ? 'إلغاء حجز العميل' : 'Cancel Appointment',
    noAppointmentsYet: isRtl ? 'لم يسجل أي موعد بعد.' : 'No appointments yet.',
    waitingClients: isRtl ? 'في انتظار تسجيل مواعيد جديدة من قبل العملاء.' : 'Waiting for clients to register dates.',

    // Services Tab
    addService: isRtl ? 'إضافة خدمة علاجية جديدة' : 'Add Service Treatment',
    savedCatalog: isRtl ? 'كتالوج وقائمة الخدمات المسجلة' : 'Saved Catalog Services',
    serviceTitleEn: isRtl ? 'عنوان الخدمة (باللغة الإنجليزية) *' : 'Service Title (english)*',
    serviceTitleAr: isRtl ? 'عنوان الخدمة (باللغة العربية)' : 'Service Title (Arabic)',
    category: isRtl ? 'فئة الخدمة والأقسام *' : 'Treatment Category*',
    pricing: isRtl ? 'سعر الخدمة (مثال: "250 QAR") *' : 'Pricing (Format: "X QAR")*',
    duration: isRtl ? 'مدة الجلسة (مثال: "45 min") *' : 'Duration*',
    descriptionEn: isRtl ? 'شرح الخدمة (بالإنجليزي) *' : 'Service Description (english)*',
    descriptionAr: isRtl ? 'شرح الخدمة (بالعربي)' : 'Service Description (Arabic)',
    markPopular: isRtl ? 'وضع إشارة كأكثر شعبية (أيقونة Sparkles)' : 'Mark as Popular Badge',
    saveTreatment: isRtl ? 'حفظ الخدمة في الكتالوج' : 'Save Treatment',
    popular: isRtl ? 'شائع ومفضل' : 'popular',
    delete: isRtl ? 'حذف السجل' : 'Delete',
    noServicesAdded: isRtl ? 'لم تتم إضافة أي خدمات بعد.' : 'No services added yet.',
    useFormToPublish: isRtl ? 'استخدمي النموذج الجانبي لإدراج علاجات تجميل جديدة.' : 'Use the left form to publish services.',

    // Categories names
    hair: isRtl ? 'تصميم الشعر وتصفيفه' : 'Hair Design',
    nails: isRtl ? 'عناية الأظافر الملكية' : 'Elite Nails',
    henna: isRtl ? 'نقش الحناء وفن التجميل' : 'Fine Henna',
    facial: isRtl ? 'علاجات ونضارة البشرة' : 'Facial Wellness',
    hammam: isRtl ? 'الحمام المغربي والاسترخاء' : 'Moroccan Hammam',
    spa: isRtl ? 'ريتوال المساج والسبا' : 'Spa Rituals',

    // Products Tab
    addProduct: isRtl ? 'إضافة منتج تجميلي جديد للمتجر' : 'Add Salon Product',
    savedProducts: isRtl ? 'المنتجات المعروضة في البوتيك' : 'Saved Boutique Products',
    productTitleEn: isRtl ? 'اسم المنتج بـ الإنجليزية *' : 'Product Title (english)*',
    productTitleAr: isRtl ? 'اسم المنتج بـ العربية' : 'Product Title (Arabic)',
    productPrice: isRtl ? 'سعر البيع للعملاء (مثال: "180 QAR") *' : 'Product Price (Format: "X QAR")*',
    productDescEn: isRtl ? 'وصف المنتج بالتفصيل (إنجليزي) *' : 'Product Description (english)*',
    productDescAr: isRtl ? 'وصف المنتج بالتفصيل (عربي)' : 'Product Description (Arabic)',
    productImage: isRtl ? 'صورة المنتج بجودة عالية' : 'Product Show Image',
    saveProduct: isRtl ? 'حفظ وعرض المنتج في البوتيك' : 'Save Product',
    noProductsYet: isRtl ? 'لا توجد أي منتجات معروضة حالياً.' : 'No products added yet.',
    useFormToPublishProduct: isRtl ? 'استخدمي هذا النموذج لرفع وبيع منتجات العناية بالبشرة والشعر.' : 'Use the left form to upload boutique products.',

    // Staff Tab
    addStaff: isRtl ? 'إضافة خبيرة تجميل جديدة للفريق' : 'Add Stylist / Expert',
    savedStaff: isRtl ? 'طاقم خبيرات وأخصائيات الصالون' : 'Registered Stylist Experts',
    staffNameEn: isRtl ? 'الاسم الكامل بـ الإنجليزية *' : 'Stylist Name (english)*',
    staffNameAr: isRtl ? 'الاسم الكامل بـ العربية' : 'Stylist Name (Arabic)',
    staffRoleEn: isRtl ? 'المسمى الوظيفي والدور (إنجليزي) *' : 'Expert Role (english)*',
    staffRoleAr: isRtl ? 'المسمى الوظيفي والدور (عربي)' : 'Expert Role (Arabic)',
    staffBioEn: isRtl ? 'السيرة المهنية والخبرات (إنجليزي) *' : 'Expert Biography (english)*',
    staffBioAr: isRtl ? 'السيرة المهنية والخبرات (عربي)' : 'Expert Biography (Arabic)',
    staffImage: isRtl ? 'صورة شخصية للخبيرة' : 'Stylist Showcase Image',
    saveStaff: isRtl ? 'حفظ وتسجيل الخبيرة بالفريق' : 'Save Expert to Directory',
    noStaffYet: isRtl ? 'لا توجد خبيرات مسجلات حالياً.' : 'No staff members added yet.',
    useFormToPublishStaff: isRtl ? 'سجلي بيانات الأخصائيات لعرضهن في قسم "فريقنا" الرئيسي.' : 'Use the left form to register salon professionals.',

    // Gallery Tab
    addGallery: isRtl ? 'إضافة لقطة لـ معرض الصور' : 'Add Treatment Showcase Photo',
    savedGallery: isRtl ? 'الألبوم البصري للأعمال وقبل/بعد' : 'Saved Visual Showcase Gallery',
    galleryTitleEn: isRtl ? 'عنوان اللقطة (إنجليزي) *' : 'Visual Title (english)*',
    galleryTitleAr: isRtl ? 'عنوان اللقطة (عربي)' : 'Visual Title (Arabic)',
    galleryDescEn: isRtl ? 'شرح أو تفاصيل قصيرة (إنجليزي)' : 'Short Description (english)',
    galleryDescAr: isRtl ? 'شرح أو تفاصيل قصيرة (عربي)' : 'Short Description (Arabic)',
    galleryCategory: isRtl ? 'فئة الألبوم المناسبة *' : 'Gallery Category*',
    galleryImage: isRtl ? 'اللقطة أو الصورة بـ دقة ممتازة' : 'Showcase Album Image',
    saveGallery: isRtl ? 'رفع وحفظ السجل' : 'Save & Publish Photo',
    noGalleryYet: isRtl ? 'الألبوم فارغ حالياً ولم يتم رفع أي لقطات.' : 'No gallery photos uploaded yet.',
    useFormToPublishGallery: isRtl ? 'ارفعي صوراً حقيقية لنتائج الصالون الفاخرة لزيادة ثقة العملاء.' : 'Use the left form to upload real salon results.',

    // Blog Tab
    addBlog: isRtl ? 'نشر مقال ثقافي أو خبر جديد بالمدونة' : 'Publish Blog Article',
    savedBlog: isRtl ? 'المنشورات والمقالات المفعلة حالياً بالمدونة' : 'Saved News & Editorial Articles',
    blogTitleEn: isRtl ? 'عنوان المقال المكتوب (إنجليزي) *' : 'Article Title (english)*',
    blogTitleAr: isRtl ? 'عنوان المقال المكتوب (عربي)' : 'Article Title (Arabic)',
    authorEn: isRtl ? 'اسم الكاتبة/الخبيرة (إنجليزي) *' : 'Author Name (english)*',
    authorAr: isRtl ? 'اسم الكاتبة/الخبيرة (عربي)' : 'Author Name (Arabic)',
    blogContentEn: isRtl ? 'نص المقال الكامل والمحتوى السردي (إنجليزي) *' : 'Editorial Content (english)*',
    blogContentAr: isRtl ? 'نص المقال الكامل والمحتوى السردي (عربي)' : 'Editorial Content (Arabic)',
    blogImage: isRtl ? 'صورة الغلاف للمنشور' : 'Editorial Cover Image',
    saveBlog: isRtl ? 'نشر المقال فوراً على الموقع والمدونة' : 'Publish Editorial Article',
    noBlogYet: isRtl ? 'المدونة فارغة حالياً ولا توجد مقالات.' : 'No blog articles written yet.',
    useFormToPublishBlog: isRtl ? 'انشري نصائح الجمال، العناية بالبشرة، والأنباء الموسمية.' : 'Share wellness advice and beauty trends.',

    // Reviews Tab
    addReview: isRtl ? 'إدخل مراجعة أو شهادة عميلة يدوياً' : 'Log Customer Review Manually',
    savedReviews: isRtl ? 'سجل شهادات وتقييمات العملاء' : 'Logged Customer Reviews',
    reviewAuthorEn: isRtl ? 'اسم العميلة بالكامل (إنجليزي) *' : 'Customer Name (english)*',
    reviewAuthorAr: isRtl ? 'اسم العميلة بالكامل (عربي)' : 'Customer Name (Arabic)',
    reviewLocationEn: isRtl ? 'موقع الإقامة أو السكن (إنجليزي)' : 'Location Place (english)',
    reviewLocationAr: isRtl ? 'موقع الإقامة أو السكن (عربي)' : 'Location Place (Arabic)',
    ratingScore: isRtl ? 'التقييم من 5 نجوم *' : 'Rating Score (1-5 stars)*',
    reviewServiceEn: isRtl ? 'الخدمة المجربة بالصالون (إنجليزي)' : 'Treatment Tried (english)',
    reviewServiceAr: isRtl ? 'الخدمة المجربة بالصالون (عربي)' : 'Treatment Tried (Arabic)',
    reviewContentEn: isRtl ? 'نص التعليق والشهادة الجمالية (إنجليزي) *' : 'Review Testimonial Text (english)*',
    reviewContentAr: isRtl ? 'نص التعليق والشهادة الجمالية (عربي)' : 'Review Testimonial Text (Arabic)',
    saveReview: isRtl ? 'حفظ ونشر التقييم في الواجهة' : 'Save Customer Testimonial',
    noReviewsYet: isRtl ? 'لم يتم تسجيل أي آراء للعميلات حتى الآن.' : 'No customer opinions logged yet.',
    useFormToPublishReview: isRtl ? 'يمكنك تدوين التقييمات الرائعة الواردة عبر واتساب وإنستغرام لتظهر على الموقع الرئيسي.' : 'Log positive endorsements from instagram/whatsapp.'
  };

  // Business Owner Access Authentication States
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return sessionStorage.getItem('nilda_admin_authorized') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Navigation / Tabs state
  const [activeTab, setActiveTab] = useState<'analytics' | 'bookings' | 'services' | 'products' | 'staff' | 'gallery' | 'blog' | 'reviews'>('analytics');
  
  // Database States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [analytics, setAnalytics] = useState({
    totalCustomers: 0,
    totalAppointments: 0,
    revenue: 0,
    popularServices: [] as { id: string; name: string; count: number }[]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form States for creating entities
  const [newService, setNewService] = useState({
    name: '', name_ar: '', category: 'hair' as any, description: '', description_ar: '', price: '', duration: '', popular: false
  });
  const [newProduct, setNewProduct] = useState({
    name: '', name_ar: '', description: '', description_ar: '', price: '', image: ''
  });
  const [newStaff, setNewStaff] = useState({
    name: '', name_ar: '', role: '', role_ar: '', bio: '', bio_ar: '', image: ''
  });
  const [newGallery, setNewGallery] = useState({
    title: '', title_ar: '', desc: '', desc_ar: '', type: 'hair' as any, src: ''
  });
  const [newPost, setNewPost] = useState({
    title: '', title_ar: '', content: '', content_ar: '', author: '', author_ar: '', image: ''
  });
  const [newReview, setNewReview] = useState({
    name: '', name_ar: '', location: '', location_ar: '', rating: 5, service: '', service_ar: '', content: '', content_ar: ''
  });

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [bkRes, svcRes, prdRes, stfRes, revRes, galRes, pstRes, anyRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/services'),
        fetch('/api/products'),
        fetch('/api/staff'),
        fetch('/api/reviews'),
        fetch('/api/gallery'),
        fetch('/api/posts'),
        fetch('/api/analytics')
      ]);

      if (bkRes.ok) {
        const bkData = await bkRes.json();
        bkData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(bkData);
      }
      if (svcRes.ok) setServices(await svcRes.json());
      if (prdRes.ok) setProducts(await prdRes.json());
      if (stfRes.ok) setStaff(await stfRes.json());
      if (revRes.ok) setReviews(await revRes.json());
      if (galRes.ok) setGallery(await galRes.json());
      if (pstRes.ok) setPosts(await pstRes.json());
      if (anyRes.ok) setAnalytics(await anyRes.json());

    } catch (err: any) {
      setError('Connection failed. Could not fetch salon ERP backend databases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [refreshSignal]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (failedAttempts >= 5) {
      setLoginError(t.tooManyAttempts);
      return;
    }
    
    const formattedEmail = adminEmail.trim().toLowerCase();
    const formattedPassword = adminPassword;

    // Single Authorized Account: admin@nildasalon.com
    const expectedEmail = 'admin@nildasalon.com';
    const expectedPassword = 'nilda2026';

    const isValidEmail = formattedEmail === expectedEmail;
    const isValidPassword = formattedPassword === expectedPassword;

    if (isValidEmail && isValidPassword) {
      setIsAdminUnlocked(true);
      sessionStorage.setItem('nilda_admin_authorized', 'true');
      setFailedAttempts(0);
      setAdminPassword('');
      showSuccess(t.welcomeBack);
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      setAdminPassword(''); // instantly clear sensitive password input
      if (nextAttempts >= 5) {
        setLoginError(t.tooManyAttempts);
      } else {
        setLoginError(isRtl ? `بيانات غير صحيحة. متبقي ${5 - nextAttempts} محاولات.` : `Invalid credentials. Access denied. (${5 - nextAttempts} attempts remaining)`);
      }
    }
  };

  const handleAdminLogout = () => {
    setIsAdminUnlocked(false);
    sessionStorage.removeItem('nilda_admin_authorized');
    showSuccess(isRtl ? 'تم قفل لوحة التحكم.' : 'Administrative session locked.');
  };

  // Status updates
  const updateBookingStatus = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchAllData();
        triggerRefresh();
        showSuccess(isRtl ? 'تم تحديث حالة الحجز بنجاح.' : `Reservation updated to ${newStatus}`);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update reservation.');
      }
    } catch {
      setError('Network failure while updating booking.');
    }
  };

  // REST API Actions -> Create Helper
  const createEntity = async (url: string, body: any, successFeedback: string, clearFormCallback: () => void) => {
    try {
      setError('');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        showSuccess(successFeedback);
        clearFormCallback();
        fetchAllData();
        triggerRefresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create record.');
      }
    } catch {
      setError('Failed to reach backend database server.');
    }
  };

  // REST API Actions -> Delete Helper
  const deleteEntity = async (url: string, id: string, successFeedback: string) => {
    try {
      setError('');
      const res = await fetch(`${url}/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showSuccess(successFeedback);
        fetchAllData();
        triggerRefresh();
      } else {
        setError('Failed to remove record.');
      }
    } catch {
      setError('Connection failed while attempting deletion.');
    }
  };

  // File to base64 converter
  const handleImageUploadHelper = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Drag and Drop Image Uploader
  const DragAndDropUploader = ({ onUpload, label }: { onUpload: (base64: string) => void, label: string }) => {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState('');

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        try {
          const base64 = await handleImageUploadHelper(e.dataTransfer.files[0]);
          setPreview(base64);
          onUpload(base64);
        } catch {
          setError('Failed to read files.');
        }
      }
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        try {
          const base64 = await handleImageUploadHelper(e.target.files[0]);
          setPreview(base64);
          onUpload(base64);
        } catch {
          setError('Failed to parse uploaded image file.');
        }
      }
    };

    return (
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
          dragActive ? 'border-gold-400 bg-gold-400/10' : 'border-neutral-200 hover:border-gold-300 bg-neutral-50/50'
        }`}
      >
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleChange} 
          className="hidden" 
          id={`file-input-${label.replace(/[^a-zA-Z0-9]/g, '')}`} 
        />
        <label htmlFor={`file-input-${label.replace(/[^a-zA-Z0-9]/g, '')}`} className="cursor-pointer block">
          {preview ? (
            <div className="space-y-1">
              <img src={preview} alt="Upload preview" className="h-16 mx-auto object-contain rounded-md animate-fade-in" />
              <span className="text-[10px] text-emerald-600 font-bold block">✓ {isRtl ? 'تم تحميل الصورة' : 'Image Loaded'}</span>
            </div>
          ) : (
            <div className="space-y-1">
              <ImageIcon className="w-5 h-5 mx-auto text-neutral-400" />
              <span className="text-[11px] text-neutral-500 font-medium block">{label}</span>
              <span className="text-[9px] text-neutral-400 block font-mono">{isRtl ? 'اسحبي وأسقطي أو اضغطي للتحميل' : 'Drag & Drop or Click'}</span>
            </div>
          )}
        </label>
      </div>
    );
  };

  if (!isAdminUnlocked) {
    return (
      <div className="fixed inset-0 bg-burgundy-950/95 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center backdrop-blur-md font-sans animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-gold-400/35 p-8 space-y-6 relative">
          
          {/* Interactive Floating Language Changer */}
          <button 
            type="button"
            onClick={toggleLanguage}
            className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1.5 bg-neutral-100 ring-1 ring-neutral-200/50 text-neutral-700 hover:bg-gold-400 hover:text-burgundy-950 rounded-xl transition cursor-pointer font-serif flex items-center gap-1 shadow-sm"
          >
            <span>🌐</span>
            <span>{isRtl ? 'English' : 'العربية'}</span>
          </button>

          {/* Header Brand */}
          <div className="text-center space-y-2 pt-4">
            <div className="w-14 h-14 bg-burgundy-950 text-gold-400 rounded-full flex items-center justify-center mx-auto border border-gold-400/20 shadow-md">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="font-serif text-2.5xl font-black text-burgundy-950">{t.staffPortal}</h2>
            <p className="text-xs text-neutral-500 font-light max-w-xs mx-auto leading-relaxed">
              {t.restrictedDesc}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminLogin} className={`space-y-4 ${isRtl ? 'text-right' : 'text-start'}`}>
            {loginError && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-red-600 text-xs font-semibold flex items-center gap-2 animate-bounce">
                <span className="shrink-0 text-base">⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block pb-0.5">
                {t.businessEmail}
              </label>
              <input
                type="email"
                required
                placeholder="director@nildasalon.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className={`w-full p-3 rounded-xl border border-neutral-200 outline-none text-sm focus:border-gold-500 bg-neutral-50/50 text-neutral-800 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block pb-0.5">
                {t.securityPassword}
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className={`w-full p-3 rounded-xl border border-neutral-200 outline-none text-sm focus:border-gold-500 bg-neutral-50/50 text-neutral-800 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-burgundy-950 text-gold-300 font-bold uppercase text-[11px] tracking-widest rounded-xl hover:bg-burgundy-900 transition duration-200 shadow cursor-pointer"
            >
              {t.verifyUnlock}
            </button>
          </form>

          {/* Footer Controls */}
          <div className="border-t border-neutral-100 pt-4 flex items-center justify-between text-xs">
            <span className="text-neutral-400 font-mono text-[9px] uppercase tracking-wider">{t.restrictedArea}</span>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-600 hover:text-burgundy-950 font-bold hover:underline cursor-pointer"
            >
              {t.returnToWeb}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-burgundy-950/95 z-50 overflow-y-auto p-4 sm:p-6 lg:p-10 flex items-center justify-center backdrop-blur-md font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col border border-gold-400/25 max-h-[92vh]">
        
        {/* Admin Header Panel */}
        <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white p-6 border-b border-gold-400/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 text-start">
            <div className="p-3 bg-gold-400 text-burgundy-950 rounded-xl">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-gold-300">{t.directorBoard}</h2>
              <span className="text-xs uppercase tracking-widest font-mono text-rose-200 block">{t.realTimeEPR}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Interactive Language Toggle Button inside Admin Header */}
            <button 
              type="button"
              onClick={toggleLanguage}
              className="py-2 px-3 rounded-lg bg-burgundy-900 border border-gold-400/20 text-xs font-semibold text-gold-300 transition cursor-pointer hover:bg-gold-400 hover:text-burgundy-950 active:scale-95 flex items-center gap-1.5"
              id="admin-lang-toggle"
            >
              <span>🌐</span>
              <span className="font-serif">{isRtl ? 'English' : 'العربية'}</span>
            </button>

            <button
              onClick={handleAdminLogout}
              className="py-2.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold uppercase text-gold-300 transition cursor-pointer active:scale-95 whitespace-nowrap flex items-center gap-1"
              title={t.lockBoard}
              id="admin-lock-session"
            >
              <Lock className="w-3 h-3 text-gold-400" />
              <span>{t.lockBoard}</span>
            </button>
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white cursor-pointer active:scale-95 transition"
              title={t.refreshDb}
              id="admin-refresh-btn"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-lg bg-gold-400 hover:bg-gold-300 font-bold uppercase text-xs text-burgundy-950 transition cursor-pointer active:scale-95 shadow"
              id="admin-close-btn"
            >
              {t.exitDashboard}
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 px-6 text-xs font-semibold border-b border-red-100 flex items-center justify-between shrink-0">
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')} className="hover:text-red-900">✕</button>
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-50 text-emerald-800 p-3 px-6 text-xs font-semibold border-b border-emerald-100 flex items-center justify-between shrink-0">
            <span>✓ {successMsg}</span>
            <button onClick={() => setSuccessMsg('')} className="hover:text-emerald-900">✕</button>
          </div>
        )}

        {/* ERP Modules Sub-navigation Menu */}
        <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-100 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none scroll-smooth">
          {(['analytics', 'bookings', 'services', 'products', 'staff', 'gallery', 'blog', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setError(''); }}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                activeTab === tab 
                  ? 'bg-burgundy-950 text-gold-300 shadow-sm border border-gold-300/10' 
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {t[tab]}
            </button>
          ))}
        </div>

        {/* Core ERP Workspace Panel */}
        <div className="p-6 overflow-y-auto flex-1 min-h-[450px]">
          
          {/* 1. ANALYTICS HUB TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 text-start animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="p-6 rounded-2xl bg-gradient-to-tr from-burgundy-50 to-white border border-burgundy-100 shadow-sm flex items-center gap-5">
                  <div className="p-4 bg-burgundy-100 text-burgundy-950 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block font-bold">Total Customers</span>
                    {analytics.totalCustomers > 0 ? (
                      <span className="text-3xl font-bold text-burgundy-900 font-serif leading-tight">{analytics.totalCustomers} Customers</span>
                    ) : (
                      <span className="text-sm font-semibold text-neutral-500 block mt-1">No customers yet.</span>
                    )}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-tr from-gold-50 to-white border border-gold-200/50 shadow-sm flex items-center gap-5">
                  <div className="p-4 bg-gold-400/20 text-gold-950 rounded-xl">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block font-bold">Total Appointments</span>
                    {analytics.totalAppointments > 0 ? (
                      <span className="text-3xl font-bold text-neutral-900 font-serif leading-tight">{analytics.totalAppointments} Spots</span>
                    ) : (
                      <span className="text-sm font-semibold text-neutral-500 block mt-1">No appointments yet.</span>
                    )}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-tr from-emerald-50 to-white border border-emerald-100 shadow-sm flex items-center gap-5">
                  <div className="p-4 bg-emerald-100 text-emerald-950 rounded-xl">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block font-bold">Total Revenue</span>
                    {analytics.revenue > 0 ? (
                      <span className="text-3xl font-bold text-emerald-800 font-serif leading-tight">{analytics.revenue} QAR</span>
                    ) : (
                      <span className="text-sm font-semibold text-neutral-500 block mt-1">No revenue data available.</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Popular treatment tracking segments */}
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/50">
                <h4 className="font-serif font-black text-lg text-neutral-800 mb-4">Treatment Trends & Popular Services</h4>
                {analytics.popularServices.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.popularServices.map((svc: any, idx: number) => (
                      <div key={svc.id} className="flex items-center justify-between p-3 bg-white border border-neutral-150 rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-gold-400 text-burgundy-950 flex items-center justify-center font-bold text-xs">{idx + 1}</span>
                          <span className="text-sm font-semibold text-neutral-800">{svc.name}</span>
                        </div>
                        <span className="text-xs font-mono font-bold bg-neutral-100 py-1 px-3 rounded text-neutral-650">{svc.count} Confirmed Bookings</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-neutral-400 text-xs">No completed reservation metrics to calculate popular services.</div>
                )}
              </div>
            </div>
          )}

          {/* 2. BOOKINGS MANAGEMENT MODULE */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 text-start animate-fade-in">
              <h3 className="font-serif font-bold text-xl text-neutral-900 border-b border-neutral-100 pb-3">Bookings Itinerary</h3>
              
              {bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div 
                      key={b.id} 
                      className={`p-5 rounded-2xl border transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                        b.status === 'confirmed' ? 'bg-emerald-50/10 border-emerald-200' :
                        b.status === 'cancelled' ? 'bg-red-50/10 border-red-150 text-neutral-400' : 'bg-white border-neutral-200'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-neutral-900 text-base">{b.clientName}</h4>
                          <span className={`text-[10px] font-mono tracking-widest uppercase font-black py-0.5 px-2 rounded-full ${
                            b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            b.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>{b.status}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1 gap-x-4 text-xs text-neutral-500 font-light font-mono">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {b.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {b.timeSlot}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {b.clientPhone}</span>
                        </div>
                        {b.notes && <p className="text-xs bg-neutral-50 border p-2.5 rounded text-neutral-500 italic">" {b.notes} "</p>}
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0 md:border-l md:pl-4 border-neutral-150 w-full md:w-auto">
                        <div className="text-right mb-1">
                          <span className="text-[10px] text-neutral-400 block uppercase font-mono">Reservation Service</span>
                          <span className="text-sm font-bold text-neutral-800">{b.serviceName}</span>
                        </div>
                        <div className="flex gap-2">
                          {b.status !== 'confirmed' && (
                            <button
                              onClick={() => updateBookingStatus(b.id, 'confirmed')}
                              className="p-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white transition hover:scale-105 active:scale-95 cursor-pointer"
                              title="Confirm Appointment"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {b.status !== 'cancelled' && (
                            <button
                              onClick={() => updateBookingStatus(b.id, 'cancelled')}
                              className="p-1.5 rounded bg-red-400 hover:bg-red-500 text-white transition hover:scale-105 active:scale-95 cursor-pointer"
                              title="Cancel Appointment"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 text-neutral-400 space-y-2 border-2 border-dashed border-neutral-100 rounded-2xl">
                  <span className="text-4xl block">📭</span>
                  <h4 className="font-serif font-black text-lg text-neutral-700">No appointments yet.</h4>
                  <p className="text-xs text-neutral-400">Waiting for clients to register dates.</p>
                </div>
              )}
            </div>
          )}

          {/* 3. SERVICES DATABASE MANAGEMENT */}
          {activeTab === 'services' && (
            <div className="space-y-8 text-start animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 bg-neutral-50 p-6 rounded-2xl border border-neutral-200/50 space-y-4">
                <h4 className="font-serif font-black text-md text-burgundy-950">Add Service Treatment</h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Service Title (english)*</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="e.g. Royal Balayage Blowout" value={newService.name} 
                      onChange={(e) => setNewService({...newService, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Service Title (Arabic)</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-right" 
                      placeholder="عنوان الخدمة" value={newService.name_ar} 
                      onChange={(e) => setNewService({...newService, name_ar: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Treatment Category*</label>
                    <select 
                      className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400"
                      value={newService.category} onChange={(e) => setNewService({...newService, category: e.target.value as any})}
                    >
                      <option value="hair">Hair Design</option>
                      <option value="nails">Elite Nails</option>
                      <option value="henna">Fine Henna</option>
                      <option value="facial">Facial Wellness</option>
                      <option value="hammam">Moroccan Hammam</option>
                      <option value="spa">Spa Rituals</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Pricing (Format: 'X QAR')*</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="e.g. 350 QAR" value={newService.price} 
                      onChange={(e) => setNewService({...newService, price: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Duration*</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="e.g. 45 min" value={newService.duration} 
                      onChange={(e) => setNewService({...newService, duration: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Service Description (english)*</label>
                    <textarea 
                      rows={2} className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="Describe treating steps..." value={newService.description} 
                      onChange={(e) => setNewService({...newService, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Service Description (Arabic)</label>
                    <textarea 
                      rows={2} className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-right" 
                      placeholder="شرح الخدمة بالتفصيل" value={newService.description_ar} 
                      onChange={(e) => setNewService({...newService, description_ar: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center gap-2 py-1.5">
                    <input 
                      type="checkbox" id="service-popular" checked={newService.popular} 
                      onChange={(e) => setNewService({...newService, popular: e.target.checked})}
                      className="w-4 h-4 accent-burgundy-900"
                    />
                    <label htmlFor="service-popular" className="text-[10px] uppercase font-bold text-neutral-600 cursor-pointer">Mark as Popular Badge</label>
                  </div>

                  <button
                    onClick={() => createEntity('/api/services', newService, 'Service category added successfully', () => {
                      setNewService({ name: '', name_ar: '', category: 'hair', description: '', description_ar: '', price: '', duration: '', popular: false });
                    })}
                    className="w-full py-2.5 rounded-lg bg-burgundy-950 text-gold-300 font-bold uppercase text-[10px] tracking-wider hover:bg-burgundy-900 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Treatment
                  </button>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <h4 className="font-serif font-black text-md text-neutral-900 pb-2 border-b border-neutral-100">Saved Catalog Services</h4>
                
                {services.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((svc) => (
                      <div key={svc.id} className="p-4 rounded-xl border border-neutral-250 bg-white flex flex-col justify-between group hover:border-gold-400/40 transition">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[9px] uppercase font-mono font-bold tracking-widest bg-burgundy-50 text-burgundy-900 px-2 py-0.5 rounded">
                              {svc.category}
                            </span>
                            {svc.popular && (
                              <span className="text-[9px] uppercase tracking-wider font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5 fill-amber-500 border-none" /> popular
                              </span>
                            )}
                          </div>
                          <h5 className="font-bold text-neutral-900 text-sm">{svc.name}</h5>
                          {svc.name_ar && <h6 className="text-xs text-neutral-400 text-right mt-0.5 font-semibold text-start">{svc.name_ar}</h6>}
                          <p className="text-xs text-neutral-500 font-light mt-2 line-clamp-2 leading-relaxed">"{svc.description}"</p>
                        </div>

                        <div className="border-t border-neutral-100 pt-3 mt-4 flex items-center justify-between text-xs">
                          <div className="font-mono text-neutral-600 font-bold">
                            <span>{svc.price}</span> • <span>{svc.duration}</span>
                          </div>
                          <button
                            onClick={() => deleteEntity('/api/services', svc.id, 'Service deleted')}
                            className="p-1 px-2 rounded bg-red-100 text-red-700 hover:bg-red-200 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 cursor-pointer transition active:scale-95"
                          >
                            <Trash className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-neutral-400 border border-neutral-150 border-dashed rounded-xl">
                    <Layers className="w-8 h-8 mx-auto text-neutral-300 block mb-2" />
                    <h5 className="font-serif font-black text-neutral-700 text-base">No services added yet.</h5>
                    <p className="text-xs text-neutral-400 mt-0.5">Use the left directory form to publish services.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. PRODUCTS BOUTIQUE MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-8 text-start animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 bg-neutral-50 p-6 rounded-2xl border border-neutral-200/50 space-y-4">
                <h4 className="font-serif font-black text-md text-burgundy-950">Add Salon Product</h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Product Title*</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="e.g. Organic Argan Elixir Hair Oil" value={newProduct.name} 
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Product Title (Arabic)</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-right" 
                      placeholder="اسم المنتج" value={newProduct.name_ar} 
                      onChange={(e) => setNewProduct({...newProduct, name_ar: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Retail Price (Format: 'X QAR')*</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="e.g. 180 QAR" value={newProduct.price} 
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Description*</label>
                    <textarea 
                      rows={2} className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="Rich botanical compounds..." value={newProduct.description} 
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Description (Arabic)</label>
                    <textarea 
                      rows={2} className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-right" 
                      placeholder="تركيبة المنتج والمميزات" value={newProduct.description_ar} 
                      onChange={(e) => setNewProduct({...newProduct, description_ar: e.target.value})}
                    />
                  </div>
                  
                  {/* Image uploader wrapper */}
                  <DragAndDropUploader label="Choose Product Photo" onUpload={(b64) => setNewProduct({...newProduct, image: b64})} />

                  <button
                    onClick={() => createEntity('/api/products', newProduct, 'Boutique beauty product published', () => {
                      setNewProduct({ name: '', name_ar: '', description: '', description_ar: '', price: '', image: '' });
                    })}
                    className="w-full py-2.5 rounded-lg bg-burgundy-950 text-gold-300 font-bold uppercase text-[10px] tracking-wider hover:bg-burgundy-900 transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Product
                  </button>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <h4 className="font-serif font-black text-md text-neutral-900 pb-2 border-b border-neutral-100">Boutique Catalog</h4>
                
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((p) => (
                      <div key={p.id} className="rounded-xl border border-neutral-200 overflow-hidden bg-white hover:shadow-md transition flex flex-col justify-between">
                        <div>
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-32 object-cover" />
                          ) : (
                            <div className="w-full h-32 bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs">No Product Image</div>
                          )}
                          <div className="p-4 space-y-1">
                            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 py-0.5 px-2 rounded">{p.price}</span>
                            <h5 className="font-bold text-neutral-900 text-sm pt-1.5">{p.name}</h5>
                            {p.name_ar && <h6 className="text-[11px] text-neutral-400 font-semibold">{p.name_ar}</h6>}
                            <p className="text-xs text-neutral-500 font-light mt-1.5 leading-relaxed line-clamp-3">"{p.description}"</p>
                          </div>
                        </div>

                        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end">
                          <button
                            onClick={() => deleteEntity('/api/products', p.id, 'Product removed')}
                            className="p-1 px-2 rounded bg-red-100 text-red-700 hover:bg-red-200 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 cursor-pointer transition active:scale-95"
                          >
                            <Trash className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-neutral-400 border border-neutral-150 border-dashed rounded-xl">
                    <ShoppingBag className="w-8 h-8 mx-auto text-neutral-300 block mb-2" />
                    <h5 className="font-serif font-black text-neutral-700 text-base">No products available.</h5>
                    <p className="text-xs text-neutral-400 mt-0.5">Publish retail cosmetics to show boutique collections.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. STAFF DIRECTORY MANAGEMENT */}
          {activeTab === 'staff' && (
            <div className="space-y-8 text-start animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 bg-neutral-50 p-6 rounded-2xl border border-neutral-200/50 space-y-4">
                <h4 className="font-serif font-black text-md text-burgundy-950">Add Staff Practitioner</h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Full Name*</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="e.g. Nilda Vance" value={newStaff.name} 
                      onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Full Name (Arabic)</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-right" 
                      placeholder="الاسم الكامل" value={newStaff.name_ar} 
                      onChange={(e) => setNewStaff({...newStaff, name_ar: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Role/Specialty*</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="e.g. Creative Hair Director" value={newStaff.role} 
                      onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Role/Specialty (Arabic)</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-right" 
                      placeholder="التخصص أو المسمى الوظيفي" value={newStaff.role_ar} 
                      onChange={(e) => setNewStaff({...newStaff, role_ar: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Staff Bio</label>
                    <textarea 
                      rows={2} className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="Licensed in Paris cosmetician academy..." value={newStaff.bio} 
                      onChange={(e) => setNewStaff({...newStaff, bio: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Staff Bio (Arabic)</label>
                    <textarea 
                      rows={2} className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-right" 
                      placeholder="نبذة مهنية عن الخبيرة" value={newStaff.bio_ar} 
                      onChange={(e) => setNewStaff({...newStaff, bio_ar: e.target.value})}
                    />
                  </div>

                  <DragAndDropUploader label="Choose Profile Photo" onUpload={(b64) => setNewStaff({...newStaff, image: b64})} />

                  <button
                    onClick={() => createEntity('/api/staff', newStaff, 'Certified staff practitioner registered', () => {
                      setNewStaff({ name: '', name_ar: '', role: '', role_ar: '', bio: '', bio_ar: '', image: '' });
                    })}
                    className="w-full py-2.5 rounded-lg bg-burgundy-950 text-gold-300 font-bold uppercase text-[10px] tracking-wider hover:bg-burgundy-900 transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Profile
                  </button>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <h4 className="font-serif font-black text-md text-neutral-900 pb-2 border-b border-neutral-100">Practitioners Board</h4>
                
                {staff.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {staff.map((s) => (
                      <div key={s.id} className="p-4 rounded-xl border border-neutral-200 bg-white flex gap-4 hover:border-gold-400/40 transition items-start">
                        {s.image ? (
                          <img src={s.image} alt={s.name} className="w-20 h-20 rounded-full object-cover border border-neutral-200 shrink-0" />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 text-[10px] shrink-0 font-medium">No Image</div>
                        )}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-neutral-900 text-sm leading-tight">{s.name}</h5>
                            <button
                              onClick={() => deleteEntity('/api/staff', s.id, 'Practitioner removed')}
                              className="text-red-600 hover:text-red-800 font-bold text-[10px] uppercase flex items-center gap-0.5"
                            >
                              <Trash className="w-3 h-3" /> Remove
                            </button>
                          </div>
                          <span className="text-[11px] font-semibold text-burgundy-900 block">{s.role}</span>
                          {s.role_ar && <span className="text-[10px] text-neutral-400 block font-semibold">{s.role_ar}</span>}
                          {s.bio && <p className="text-xs text-neutral-500 font-light pt-1 leading-normal">"{s.bio}"</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-neutral-400 border border-neutral-150 border-dashed rounded-xl">
                    <Users className="w-8 h-8 mx-auto text-neutral-300 block mb-2" />
                    <h5 className="font-serif font-black text-neutral-700 text-base">No staff added yet.</h5>
                    <p className="text-xs text-neutral-400 mt-0.5">Sponsor active clinicians or beauty specialists to the team.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. GALLERY SHOWCASE MANAGEMENT */}
          {activeTab === 'gallery' && (
            <div className="space-y-8 text-start animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 bg-neutral-50 p-6 rounded-2xl border border-neutral-200/50 space-y-4">
                <h4 className="font-serif font-black text-md text-burgundy-950">Publish Gallery Showcase</h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Image Title*</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="e.g. Royal Volume Blowout Wave" value={newGallery.title} 
                      onChange={(e) => setNewGallery({...newGallery, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Image Title (Arabic)</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-right" 
                      placeholder="عنوان الصورة" value={newGallery.title_ar} 
                      onChange={(e) => setNewGallery({...newGallery, title_ar: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Showcase Category*</label>
                    <select 
                      className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400"
                      value={newGallery.type} onChange={(e) => setNewGallery({...newGallery, type: e.target.value as any})}
                    >
                      <option value="hair">Hair Design</option>
                      <option value="nails">Elite Nails</option>
                      <option value="hammam">Moroccan Hammam</option>
                      <option value="villa">Salon Villa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Description (english)</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="Highlight details" value={newGallery.desc} 
                      onChange={(e) => setNewGallery({...newGallery, desc: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Description (Arabic)</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-right" 
                      placeholder="تفاصيل الصورة" value={newGallery.desc_ar} 
                      onChange={(e) => setNewGallery({...newGallery, desc_ar: e.target.value})}
                    />
                  </div>

                  <DragAndDropUploader label="Choose Gallery Photo" onUpload={(b64) => setNewGallery({...newGallery, src: b64})} />

                  <button
                    onClick={() => createEntity('/api/gallery', newGallery, 'Showcase photograph uploaded successfully', () => {
                      setNewGallery({ title: '', title_ar: '', desc: '', desc_ar: '', type: 'hair', src: '' });
                    })}
                    className="w-full py-2.5 rounded-lg bg-burgundy-950 text-gold-300 font-bold uppercase text-[10px] tracking-wider hover:bg-burgundy-900 transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Showcase
                  </button>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <h4 className="font-serif font-black text-md text-neutral-900 pb-2 border-b border-neutral-100">Active Gallery Board</h4>
                
                {gallery.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gallery.map((g) => (
                      <div key={g.id} className="rounded-xl border border-neutral-200 overflow-hidden bg-white hover:scale-[1.02] transition duration-300 relative aspect-[4/3] group">
                        <img src={g.src} alt={g.title} className="w-full h-full object-cover" />
                        
                        <div className="absolute inset-0 bg-black/80 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition duration-300 text-white text-xs">
                          <div>
                            <span className="text-[9px] uppercase font-mono tracking-widest text-gold-400 font-bold block">{g.type}</span>
                            <h5 className="font-bold text-sm leading-tight mt-1">{g.title}</h5>
                            {g.desc && <p className="text-[10px] text-neutral-300 font-light mt-1">"{g.desc}"</p>}
                          </div>
                          <div className="flex justify-end pt-2 border-t border-white/10">
                            <button
                              onClick={() => deleteEntity('/api/gallery', g.id, 'Gallery photo removed')}
                              className="text-red-400 hover:text-red-300 text-[10px] uppercase font-bold tracking-wider flex items-center gap-0.5 cursor-pointer"
                            >
                              <Trash className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-neutral-400 border border-neutral-150 border-dashed rounded-xl">
                    <ImageIcon className="w-8 h-8 mx-auto text-neutral-300 block mb-2" />
                    <h5 className="font-serif font-black text-neutral-700 text-base">No gallery images uploaded.</h5>
                    <p className="text-xs text-neutral-400 mt-0.5">Upload photos of beauty care directly to clients' show screens.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. BLOG POSTS MANAGEMENT */}
          {activeTab === 'blog' && (
            <div className="space-y-8 text-start animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 bg-neutral-50 p-6 rounded-2xl border border-neutral-200/50 space-y-4">
                <h4 className="font-serif font-black text-md text-burgundy-950">Publish Blog Article</h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Article Title*</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="e.g. Hair Wellness in Summer Heat" value={newPost.title} 
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Article Title (Arabic)</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-right" 
                      placeholder="عنوان المقال" value={newPost.title_ar} 
                      onChange={(e) => setNewPost({...newPost, title_ar: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Author*</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="e.g. Salon Expert Team" value={newPost.author} 
                      onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Author (Arabic)</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-right" 
                      placeholder="الكاتب" value={newPost.author_ar} 
                      onChange={(e) => setNewPost({...newPost, author_ar: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Article Body Content*</label>
                    <textarea 
                      rows={4} className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-xs" 
                      placeholder="Write blog content..." value={newPost.content} 
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Article Body Content (Arabic)</label>
                    <textarea 
                      rows={4} className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-right text-xs" 
                      placeholder="محتوى المقال بالتفصيل" value={newPost.content_ar} 
                      onChange={(e) => setNewPost({...newPost, content_ar: e.target.value})}
                    />
                  </div>

                  <DragAndDropUploader label="Choose Hero Banner Image" onUpload={(b64) => setNewPost({...newPost, image: b64})} />

                  <button
                    onClick={() => createEntity('/api/posts', newPost, 'Blog article published successfully', () => {
                      setNewPost({ title: '', title_ar: '', content: '', content_ar: '', author: '', author_ar: '', image: '' });
                    })}
                    className="w-full py-2.5 rounded-lg bg-burgundy-950 text-gold-300 font-bold uppercase text-[10px] tracking-wider hover:bg-burgundy-900 transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <Plus className="w-3.5 h-3.5" /> Publish Article
                  </button>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <h4 className="font-serif font-black text-md text-neutral-900 pb-2 border-b border-neutral-100">Active Articles</h4>
                
                {posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((p) => (
                      <div key={p.id} className="p-4 rounded-xl border border-neutral-200 bg-white flex flex-col md:flex-row gap-5 items-start hover:border-gold-400/40 transition">
                        {p.image ? (
                          <img src={p.image} alt={p.title} className="w-full md:w-36 h-28 object-cover rounded-lg shrink-0 border" />
                        ) : (
                          <div className="w-full md:w-36 h-28 bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs shrink-0 rounded-lg">No Banner Image</div>
                        )}
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <h5 className="font-bold text-neutral-900 text-base leading-tight">{p.title}</h5>
                            <button
                              onClick={() => deleteEntity('/api/posts', p.id, 'Blog post deleted')}
                              className="text-red-650 hover:text-red-800 font-bold text-[10px] uppercase flex items-center gap-0.5 text-right cursor-pointer"
                            >
                              <Trash className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                          {p.title_ar && <span className="text-xs text-neutral-400 block font-semibold">{p.title_ar}</span>}
                          <div className="text-[10px] font-mono text-neutral-450">Published by: <span className="font-black text-burgundy-900">{p.author}</span></div>
                          <p className="text-xs text-neutral-500 font-light leading-relaxed line-clamp-3">"{p.content}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-neutral-400 border border-neutral-150 border-dashed rounded-xl">
                    <BookOpen className="w-8 h-8 mx-auto text-neutral-300 block mb-2" />
                    <h5 className="font-serif font-black text-neutral-700 text-base">No blog posts published.</h5>
                    <p className="text-xs text-neutral-400 mt-0.5">Publish makeup tricks, health guides or newsletters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 8. REVIEWS/TESTIMONIALS LOG MANAGEMENT */}
          {activeTab === 'reviews' && (
            <div className="space-y-8 text-start animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 bg-neutral-50 p-6 rounded-2xl border border-neutral-200/50 space-y-4">
                <h4 className="font-serif font-black text-md text-burgundy-950">Add Review Entry</h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Participant Name*</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="e.g. Amna Al-Kuwari" value={newReview.name} 
                      onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Participant Name (Arabic)</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-right" 
                      placeholder="اسم المعلقة" value={newReview.name_ar} 
                      onChange={(e) => setNewReview({...newReview, name_ar: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Location City*</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="e.g. West Bay, Doha" value={newReview.location} 
                      onChange={(e) => setNewReview({...newReview, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Location City (Arabic)</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-250 outline-none focus:border-gold-400 text-right" 
                      placeholder="المنطقة" value={newReview.location_ar} 
                      onChange={(e) => setNewReview({...newReview, location_ar: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Star Rating (1 to 5)*</label>
                    <select 
                      className="w-full p-2.5 rounded-lg border bg-white border-neutral-250 outline-none"
                      value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                    >
                      <option value="5">★★★★★ (5 Stars)</option>
                      <option value="4">★★★★☆ (4 Stars)</option>
                      <option value="3">★★★☆☆ (3 Stars)</option>
                      <option value="2">★★☆☆☆ (2 Stars)</option>
                      <option value="1">★☆☆☆☆ (1 Star)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Treated Service Title*</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400" 
                      placeholder="e.g. Parisian Balayage Highlight" value={newReview.service} 
                      onChange={(e) => setNewReview({...newReview, service: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Treated Service (Arabic)</label>
                    <input 
                      type="text" className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-right" 
                      placeholder="الخدمة المعالجة" value={newReview.service_ar} 
                      onChange={(e) => setNewReview({...newReview, service_ar: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Review Content Message*</label>
                    <textarea 
                      rows={3} className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-xs" 
                      placeholder="Absolutely outstanding hair color treatment..." value={newReview.content} 
                      onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Review Content Message (Arabic)</label>
                    <textarea 
                      rows={3} className="w-full p-2.5 rounded-lg border bg-white border-neutral-200 outline-none focus:border-gold-400 text-right text-xs" 
                      placeholder="نص التقييم بالتفصيل" value={newReview.content_ar} 
                      onChange={(e) => setNewReview({...newReview, content_ar: e.target.value})}
                    />
                  </div>

                  <button
                    onClick={() => createEntity('/api/reviews', newReview, 'Client review published', () => {
                      setNewReview({ name: '', name_ar: '', location: '', location_ar: '', rating: 5, service: '', service_ar: '', content: '', content_ar: '' });
                    })}
                    className="w-full py-2.5 rounded-lg bg-burgundy-950 text-gold-300 font-bold uppercase text-[10px] tracking-wider hover:bg-burgundy-900 transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Review
                  </button>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <h4 className="font-serif font-black text-md text-neutral-900 pb-2 border-b border-neutral-100">Reviews & Testimonials Ledger</h4>
                
                {reviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="p-4 rounded-xl border border-neutral-200 bg-white flex flex-col justify-between hover:border-gold-400/40 transition">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex text-amber-400 gap-0.5">
                              {[...Array(r.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            <button
                              onClick={() => deleteEntity('/api/reviews', r.id, 'Review record deleted')}
                              className="text-red-655 hover:text-red-800 font-bold text-[9px] uppercase flex items-center gap-0.5"
                            >
                              <Trash className="w-3 h-3" /> Remove
                            </button>
                          </div>
                          
                          <h5 className="font-bold text-neutral-900 text-sm leading-tight">{r.name}</h5>
                          {r.name_ar && <span className="text-xs text-neutral-400 block font-semibold">{r.name_ar}</span>}
                          
                          <span className="text-[10px] text-neutral-400 block font-mono">{r.location} • {r.date}</span>
                          <span className="inline-block text-[9px] uppercase font-mono tracking-wider font-bold text-burgundy-900 bg-burgundy-50 py-0.5 px-2 rounded">
                            {r.service}
                          </span>
                          <p className="text-xs text-neutral-500 font-light pt-1.5 leading-normal">"{r.content}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-neutral-400 border border-neutral-150 border-dashed rounded-xl col-span-2">
                    <Star className="w-8 h-8 mx-auto text-neutral-300 block mb-2" />
                    <h5 className="font-serif font-black text-neutral-700 text-base">No reviews logged.</h5>
                    <p className="text-xs text-neutral-400 mt-0.5">Publish client recommendations directly onto the testimonials gallery.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer Audit Code info */}
        <div className="bg-neutral-50 p-4 border-t border-neutral-100 text-[10px] text-center text-neutral-400 font-mono shrink-0">
          🚨 Authorized access only. Real-time changes instantly synchronize with client services and front-end channels.
        </div>

      </div>
    </div>
  );
}
