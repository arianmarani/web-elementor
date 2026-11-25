import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Trash2, Copy, Eye, Edit3, Globe, Lock, Search, Layout, Type,
  Image as ImageIcon, Video, Square, Columns, MoveUp, MoveDown, Undo2, Redo2,
  Monitor, Tablet, Smartphone, FolderOpen, Download, ExternalLink, LogOut,
  LogIn, Sparkles, Layers, Code, List, Table as TableIcon, Minus, FileText,
  Share2, KeyRound, ArrowRight, X, CheckCircle2, AlignLeft, AlignCenter,
  AlignRight, Mic, Volume2, Inbox, StopCircle, Upload, Users, Shield,
  Sliders, Film, UserPlus, AlertTriangle, CheckSquare, Paintbrush,
  BarChart2, ChevronDown, DollarSign, MessageSquare, Hash,
  Activity, Clock, AlertCircle, MapPin, GripVertical
} from 'lucide-react';

// --- Nexora Brand Logo (Embedded Vector for Favicon & UI) ---
const NEXORA_LOGO_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#120638"/><stop offset="100%" stop-color="#07021c"/></linearGradient><linearGradient id="r1" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="#7dd3fc"/><stop offset="100%" stop-color="#6366f1"/></linearGradient><linearGradient id="r2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e879f9"/><stop offset="50%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#4f46e5"/></linearGradient></defs><rect x="16" y="16" width="480" height="480" rx="112" fill="url(#bg)"/><path d="M122 340C122 230 155 170 210 170v75c-35 0-45 40-45 95z" fill="url(#r1)"/><path d="M332 172h46v128c0 35-23 52-53 52v-77c7 0 7-15 7-103z" fill="url(#r1)"/><path d="M122 340c0-120 38-182 93-182 40 0 70 57 107 114 23 33 56 33 56-2v42c0 40-43 56-83 23-40-35-63-110-97-110-26 0-33 50-33 115z" fill="url(#r2)"/><path d="M396 86q5 38 42 42-37 4-42 42-5-38-42-42 37-4 42-42z" fill="#e879f9"/></svg>`
)}`;

// --- Ultra-Short Cloud Storage Helper for Short Shareable URLs ---
async function publishPageToShortCloud(pageObj, siteSettings, customThemes) {
  try {
    const matchedCustomTheme = (customThemes || []).find((t) => t.id === pageObj.pageTheme) || null;
    const payload = {
      id: pageObj.id,
      title: pageObj.title,
      slug: pageObj.slug,
      pageTheme: pageObj.pageTheme || 'default',
      customThemeObj: matchedCustomTheme,
      status: 'published',
      visibility: pageObj.visibility || 'public',
      password: pageObj.password || '',
      metaTitle: pageObj.metaTitle || pageObj.title,
      metaDescription: pageObj.metaDescription || '',
      direction: pageObj.direction || 'rtl',
      defaultFont: siteSettings?.defaultFont || "'Vazirmatn', sans-serif",
      footerText: siteSettings?.footerText || '',
      sections: pageObj.sections
    };
    const res = await fetch('https://bytebin.lucko.me/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.key || null; // Returns a short 7-char key like "aB3dE9f"
  } catch (e) {
    return null;
  }
}

async function fetchPageFromShortCloud(cloudKey) {
  try {
    const res = await fetch(`https://bytebin.lucko.me/${encodeURIComponent(cloudKey)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

const FONT_OPTIONS = [
  { label: 'فونت پیش‌فرض سایت', value: '' },
  { label: 'وزیرمتن (Vazirmatn)', value: "'Vazirmatn', sans-serif" },
  { label: 'لاله‌زار - تیتر ضخیم (Lalezar)', value: "'Lalezar', cursive, sans-serif" },
  { label: 'تاهوما (Tahoma)', value: "Tahoma, Geneva, sans-serif" },
  { label: 'مدرن (System Sans)', value: "system-ui, -apple-system, sans-serif" },
  { label: 'کلاسیک (Serif)', value: "Georgia, 'Times New Roman', serif" },
  { label: 'کدنویسی (Monospace)', value: "'Courier New', monospace" }
];

const BUILTIN_WP_THEMES = [
  { id: 'default', name: 'قالب استاندارد تمام‌عرض (Full Width)', desc: 'چیدمان مدرن و تمام‌صفحه مناسب لندینگ‌پیج‌ها' },
  { id: 'wp-boxed', name: 'قالب کلاسیک وردپرس (Boxed Container)', desc: 'کادر مرکزی برجسته با پس‌زمینه خاکستری روشن' },
  { id: 'wp-editorial', name: 'قالب مجله‌ای و وبلاگ (Editorial Paper)', desc: 'پس‌زمینه کرم کاغذی با تایپوگرافی خوانا' },
  { id: 'wp-dark', name: 'قالب استودیویی تیره (Dark Studio)', desc: 'تم تاریک حرفه‌ای با کنتراست بالا' },
  { id: 'wp-glass', name: 'قالب گلس‌مورفیسم (Gradient Glass)', desc: 'پس‌زمینه گرادیانت ملایم با باکس‌های شیشه‌ای' }
];

const PERMISSION_LABELS = [
  { key: 'createPages', label: 'ساخت صفحه جدید' },
  { key: 'editPages', label: 'ویرایش محتوای صفحات' },
  { key: 'publishPages', label: 'انتشار و تغییر وضعیت صفحه' },
  { key: 'deletePages', label: 'حذف صفحات' },
  { key: 'manageMedia', label: 'آپلود و حذف در کتابخانه رسانه' },
  { key: 'viewSubmissions', label: 'مشاهده فرم‌ها و نظرسنجی‌ها' },
  { key: 'manageSettings', label: 'تغییر تنظیمات سایت و قالب‌های وردپرس' },
  { key: 'manageUsers', label: 'مدیریت مدیران و سطوح دسترسی' }
];

const ROLE_PRESETS = {
  admin: { createPages: true, editPages: true, publishPages: true, deletePages: true, manageMedia: true, viewSubmissions: true, manageSettings: true, manageUsers: true },
  editor: { createPages: true, editPages: true, publishPages: true, deletePages: true, manageMedia: true, viewSubmissions: true, manageSettings: false, manageUsers: false },
  author: { createPages: true, editPages: true, publishPages: false, deletePages: false, manageMedia: true, viewSubmissions: false, manageSettings: false, manageUsers: false },
  support: { createPages: false, editPages: false, publishPages: false, deletePages: false, manageMedia: false, viewSubmissions: true, manageSettings: false, manageUsers: false }
};

const TEMPLATES = [
  {
    id: 'tpl-blank',
    name: { fa: 'صفحه خالی', en: 'Blank Page' },
    category: 'عمومی',
    description: { fa: 'شروع طراحی از صفر با کشیدن و رها کردن المان‌های المنتور', en: 'Start designing from scratch' },
    sections: [
      {
        id: 'sec-1',
        columns: 1,
        bgColor: '#ffffff',
        paddingY: 48,
        widgets: [
          { id: 'w-1', type: 'heading', content: 'عنوان صفحه جدید شما در نکسورا', align: 'center', color: '#0f172a', fontSize: 36, fontFamily: '', bgColor: 'transparent', padding: 12, borderRadius: 0 },
          { id: 'w-2', type: 'text', content: 'المان‌های دلخواه خود را از ستون سمت راست بکشید و روی این صفحه رها کنید.', align: 'center', color: '#475569', fontSize: 16, fontFamily: '', bgColor: 'transparent', padding: 8, borderRadius: 0 }
        ]
      }
    ]
  },
  {
    id: 'tpl-product',
    name: { fa: 'معرفی محصول', en: 'Product Showcase' },
    category: 'فروشگاهی',
    description: { fa: 'قالب حرفه‌ای برای معرفی ویژگی‌ها و فروش محصول', en: 'Showcase features and sell your product' },
    sections: [
      {
        id: 'sec-p1',
        columns: 2,
        bgColor: '#f8fafc',
        paddingY: 64,
        widgets: [
          { id: 'wp-1', type: 'heading', content: 'نسل جدید هدفون‌های بی‌سیم استودیویی', align: 'right', color: '#0f172a', fontSize: 38, bgColor: 'transparent', padding: 12, borderRadius: 0 },
          { id: 'wp-2', type: 'image', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', caption: 'طراحی ارگونومیک با حذف نویز هوشمند', borderRadius: 16, padding: 8, bgColor: 'transparent' },
          { id: 'wp-3', type: 'text', content: 'با ۴۰ ساعت شارژدهی مداوم و صدای شفاف Hi-Res، تجربه‌ای بی‌نظیر از موسیقی داشته باشید.', align: 'right', color: '#334155', fontSize: 17, bgColor: 'transparent', padding: 12, borderRadius: 0 },
          { id: 'wp-4', type: 'button', label: 'سفارش آنلاین با ارسال رایگان', url: '#order', align: 'right', color: '#ffffff', bgColor: '#6d28d9', fontSize: 16, padding: 14, borderRadius: 10 }
        ]
      }
    ]
  },
  {
    id: 'tpl-landing',
    name: { fa: 'صفحه فرود و نظرسنجی', en: 'Landing & Poll' },
    category: 'بازاریابی',
    description: { fa: 'صفحه فرود همراه با فرم ثبت‌نام و نظرسنجی تعاملی', en: 'Landing page with form and poll' },
    sections: [
      {
        id: 'sec-l1',
        columns: 1,
        bgColor: '#120638',
        paddingY: 64,
        widgets: [
          { id: 'wl-1', type: 'heading', content: 'کسب‌وکار خود را با نکسورا متحول کنید', align: 'center', color: '#ffffff', fontSize: 40, bgColor: 'transparent', padding: 12, borderRadius: 0 },
          { id: 'wl-2', type: 'text', content: 'در نظرسنجی زیر شرکت کنید یا فرم مشاوره رایگان را پر نمایید.', align: 'center', color: '#cbd5e1', fontSize: 18, bgColor: 'transparent', padding: 12, borderRadius: 0 }
        ]
      },
      {
        id: 'sec-l2',
        columns: 1,
        bgColor: '#ffffff',
        paddingY: 48,
        widgets: [
          {
            id: 'wl-poll',
            type: 'poll',
            question: 'کدام بخش از خدمات ما برای شما جذاب‌تر است؟',
            buttonText: 'ثبت رأی در نظرسنجی',
            showResults: true,
            options: [
              { id: 'o1', text: 'طراحی اختصاصی وب‌سایت', votes: 18 },
              { id: 'o2', text: 'اتوماسیون فروش و بازاریابی', votes: 12 },
              { id: 'o3', text: 'مشاوره رشد کسب‌وکار', votes: 7 }
            ],
            bgColor: '#f8fafc',
            padding: 28,
            borderRadius: 16
          }
        ]
      }
    ]
  },
  {
    id: 'tpl-register',
    name: { fa: 'صفحه ثبت‌نام رویداد', en: 'Registration Page' },
    category: 'رویداد',
    description: { fa: 'ثبت‌نام وبینار همراه با شمارشگر معکوس', en: 'Webinar registration with countdown' },
    sections: [
      {
        id: 'sec-r1',
        columns: 1,
        bgColor: '#f0fdf4',
        paddingY: 56,
        widgets: [
          { id: 'wr-1', type: 'heading', content: 'وبینار رایگان: رشد فروش با هوش مصنوعی', align: 'center', color: '#14532d', fontSize: 34, bgColor: 'transparent', padding: 10, borderRadius: 0 },
          { id: 'wr-cd', type: 'countdown', title: 'زمان باقی‌مانده تا شروع وبینار', targetDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16) },
          {
            id: 'wr-2',
            type: 'form',
            title: 'فرم رزرو صندلی رایگان',
            buttonText: 'تکمیل ثبت‌نام',
            fields: [
              { id: 'f1', label: 'نام و نام خانوادگی', type: 'text', required: true },
              { id: 'f2', label: 'شماره موبایل', type: 'tel', required: true }
            ],
            bgColor: '#ffffff',
            color: '#0f172a',
            padding: 28,
            borderRadius: 16
          }
        ]
      }
    ]
  }
];

const INITIAL_MEDIA = [
  { id: 'm-1', name: 'product-headphones.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', date: '۱۴۰۴/۰۱/۱۰' },
  { id: 'm-2', name: 'analytics-dashboard.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80', date: '۱۴۰۴/۰۱/۱۲' },
  { id: 'm-3', name: 'sample-promo-video.mp4', type: 'video', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', date: '۱۴۰۴/۰۱/۱۸' }
];

const INITIAL_USERS = [
  { id: 'u-1', name: 'مدیر اصلی نکسورا', username: 'admin', password: 'admin123', role: 'admin', permissions: { ...ROLE_PRESETS.admin }, createdAt: '۱۴۰۴/۰۱/۰۱' }
];

const DEFAULT_SITE_SETTINGS = {
  siteName: 'Nexora | نکسورا',
  defaultFont: "'Vazirmatn', sans-serif",
  faviconUrl: NEXORA_LOGO_DATA_URL,
  logoUrl: NEXORA_LOGO_DATA_URL,
  analyticsCode: '',
  footerText: 'قدرت‌گرفته از پلتفرم صفحه‌ساز Nexora | نکسورا'
};

const WIDGET_TYPES = [
  { type: 'heading', label: { fa: 'عنوان اصلی', en: 'Heading' }, icon: Type },
  { type: 'subheading', label: { fa: 'زیرعنوان', en: 'Subheading' }, icon: Type },
  { type: 'text', label: { fa: 'ویرایشگر متن', en: 'Text Editor' }, icon: FileText },
  { type: 'image', label: { fa: 'تصویر', en: 'Image' }, icon: ImageIcon },
  { type: 'video', label: { fa: 'ویدئو و فیلم', en: 'Video' }, icon: Video },
  { type: 'audio', label: { fa: 'صدا و ویس', en: 'Audio / Voice' }, icon: Mic },
  { type: 'button', label: { fa: 'دکمه و لینک', en: 'Button' }, icon: Square },
  { type: 'poll', label: { fa: 'نظرسنجی تعاملی', en: 'Poll / Survey' }, icon: BarChart2 },
  { type: 'form', label: { fa: 'فرم‌ساز پویا', en: 'Form Builder' }, icon: CheckCircle2 },
  { type: 'accordion', label: { fa: 'آکاردئون / FAQ', en: 'Accordion' }, icon: ChevronDown },
  { type: 'tabs', label: { fa: 'تب‌های محتوایی', en: 'Tabs' }, icon: Layers },
  { type: 'pricing', label: { fa: 'جدول قیمت‌گذاری', en: 'Pricing Table' }, icon: DollarSign },
  { type: 'testimonial', label: { fa: 'نظرات مشتریان', en: 'Testimonials' }, icon: MessageSquare },
  { type: 'counter', label: { fa: 'شمارنده آمار', en: 'Counter' }, icon: Hash },
  { type: 'progress', label: { fa: 'نوار پیشرفت', en: 'Progress Bar' }, icon: Activity },
  { type: 'countdown', label: { fa: 'شمارشگر معکوس', en: 'Countdown' }, icon: Clock },
  { type: 'alert', label: { fa: 'باکس هشدار / پیام', en: 'Alert Box' }, icon: AlertCircle },
  { type: 'social', label: { fa: 'شبکه‌های اجتماعی', en: 'Social Links' }, icon: Share2 },
  { type: 'map', label: { fa: 'نقشه گوگل', en: 'Google Maps' }, icon: MapPin },
  { type: 'card', label: { fa: 'کارت محتوایی', en: 'Content Card' }, icon: Layout },
  { type: 'gallery', label: { fa: 'گالری تصاویر', en: 'Image Gallery' }, icon: Columns },
  { type: 'table', label: { fa: 'جدول اطلاعات', en: 'Table' }, icon: TableIcon },
  { type: 'list', label: { fa: 'لیست آیکون‌دار', en: 'Icon List' }, icon: List },
  { type: 'divider', label: { fa: 'خط جداکننده', en: 'Divider' }, icon: Minus },
  { type: 'spacer', label: { fa: 'فضای خالی', en: 'Spacer' }, icon: MoveDown },
  { type: 'html', label: { fa: 'کد HTML/CSS', en: 'Custom HTML' }, icon: Code }
];

const generateId = () => Math.random().toString(36).substring(2, 10);

// Clean & Short Slug Formatter (Max 28 chars, lowercase alphanumeric + hyphens)
const slugifyShort = (text) => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]+/g, '')
    .replace(/--+/g, '-')
    .slice(0, 28);
};

function resolvePageThemeConfig(pageThemeId, customThemes = [], embeddedCustomTheme = null) {
  const customObj = embeddedCustomTheme || customThemes.find((t) => t.id === pageThemeId);
  if (customObj) {
    const isBoxed = customObj.layout === 'boxed';
    return {
      isCustom: true,
      customObj,
      outerClass: isBoxed ? 'py-6 md:py-10 px-3 md:px-6' : '',
      outerStyle: { backgroundColor: customObj.outerBg || '#f1f5f9', color: customObj.textColor || '#0f172a' },
      innerClass: isBoxed ? 'max-w-5xl mx-auto rounded-2xl shadow-xl border' : 'w-full',
      innerStyle: { backgroundColor: customObj.surfaceBg || '#ffffff', borderColor: customObj.accentColor || '#6d28d9', borderTopWidth: customObj.topBar ? '5px' : '1px' },
      sectionOverrideClass: customObj.overrideSectionBg ? '!bg-transparent' : '',
      customCss: customObj.customCss || ''
    };
  }
  switch (pageThemeId) {
    case 'wp-boxed':
      return { isCustom: false, outerClass: 'bg-slate-200/80 py-6 md:py-10 px-3 md:px-6', outerStyle: {}, innerClass: 'max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200', innerStyle: {}, sectionOverrideClass: '', customCss: '' };
    case 'wp-editorial':
      return { isCustom: false, outerClass: 'bg-[#f6f3eb] py-6 md:py-10 px-3 md:px-6 text-stone-900', outerStyle: {}, innerClass: 'max-w-4xl mx-auto bg-[#fffdf9] rounded-xl shadow-md border-t-4 border-purple-700 border-x border-b border-stone-200', innerStyle: {}, sectionOverrideClass: '!bg-transparent', customCss: '' };
    case 'wp-dark':
      return { isCustom: false, outerClass: 'bg-zinc-950 text-zinc-100', outerStyle: {}, innerClass: 'w-full bg-zinc-950 text-zinc-100', innerStyle: {}, sectionOverrideClass: '!bg-zinc-900/90 !text-zinc-100 border-b border-zinc-800', customCss: '' };
    case 'wp-glass':
      return { isCustom: false, outerClass: 'bg-gradient-to-br from-purple-100 via-indigo-50 to-sky-100 py-8 px-4', outerStyle: {}, innerClass: 'max-w-6xl mx-auto rounded-3xl shadow-2xl border border-white/70 backdrop-blur-md bg-white/75', innerStyle: {}, sectionOverrideClass: '!bg-white/60 backdrop-blur-sm', customCss: '' };
    default:
      return { isCustom: false, outerClass: 'bg-white', outerStyle: {}, innerClass: 'w-full bg-white', innerStyle: {}, sectionOverrideClass: '', customCss: '' };
  }
}

function CountdownDisplay({ targetDate, accentColor }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(targetDate).getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return (
    <div className="grid grid-cols-4 gap-3 max-w-md mx-auto text-center" dir="ltr">
      {[
        { label: 'روز', val: days },
        { label: 'ساعت', val: hours },
        { label: 'دقیقه', val: minutes },
        { label: 'ثانیه', val: seconds }
      ].map((b) => (
        <div key={b.label} className="bg-slate-900 text-white rounded-2xl p-3 shadow-md">
          <div style={{ color: accentColor || '#c084fc' }} className="text-2xl font-black">{String(b.val).padStart(2, '0')}</div>
          <div className="text-[11px] text-slate-300 mt-1">{b.label}</div>
        </div>
      ))}
    </div>
  );
}

function WidgetRenderer({ widget, isEditing, isSelected, onSelect, lang, onFormSubmit, defaultFont, pageTheme, customThemeObj, onDragStartWidget }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [selectedPollIdx, setSelectedPollIdx] = useState(null);
  const [pollVoted, setPollVoted] = useState(false);
  const [openAccordionIdx, setOpenAccordionIdx] = useState(0);
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  const appliedFont = widget.fontFamily || defaultFont || "'Vazirmatn', sans-serif";
  const isDarkTheme = pageTheme === 'wp-dark' || (customThemeObj && customThemeObj.isDark);
  const accent = customThemeObj?.accentColor || '#6d28d9';

  const wrapperStyle = {
    backgroundColor: widget.bgColor || 'transparent',
    padding: `${widget.padding ?? 8}px`,
    borderRadius: `${widget.borderRadius ?? 0}px`,
    width: widget.width || '100%',
    minHeight: widget.height ? `${widget.height}px` : 'auto',
    textAlign: widget.align || (lang === 'fa' ? 'right' : 'left'),
    fontFamily: appliedFont
  };

  const resolveTextColor = (defaultLight) => {
    if (customThemeObj?.textColor && (!widget.color || ['#0f172a', '#334155', '#475569'].includes(widget.color))) {
      return customThemeObj.textColor;
    }
    if (isDarkTheme && (!widget.color || ['#0f172a', '#334155', '#475569'].includes(widget.color))) {
      return '#f4f4f5';
    }
    return widget.color || defaultLight;
  };

  const renderContent = () => {
    switch (widget.type) {
      case 'heading':
        return <h1 style={{ color: resolveTextColor('#0f172a'), fontSize: `${widget.fontSize || 32}px`, fontFamily: appliedFont, fontWeight: 800, lineHeight: 1.3 }}>{widget.content}</h1>;
      case 'subheading':
        return <h2 style={{ color: resolveTextColor('#334155'), fontSize: `${widget.fontSize || 20}px`, fontFamily: appliedFont, fontWeight: 600, lineHeight: 1.4 }}>{widget.content}</h2>;
      case 'text':
        return <div style={{ color: resolveTextColor('#475569'), fontSize: `${widget.fontSize || 16}px`, fontFamily: appliedFont, lineHeight: 1.8, whiteSpace: 'pre-line' }}>{widget.content}</div>;
      case 'image':
        return (
          <figure className="w-full">
            <img src={widget.url || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80'} alt={widget.caption || 'image'} style={{ borderRadius: `${widget.borderRadius ?? 12}px` }} className="w-full h-auto object-cover max-h-[520px]" />
            {widget.caption && <figcaption style={{ color: resolveTextColor('#64748b') }} className="mt-2 text-xs text-center">{widget.caption}</figcaption>}
          </figure>
        );
      case 'video':
        return (
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-sm">
            {widget.url ? (
              widget.url.includes('youtube.com') || widget.url.includes('youtu.be') || widget.url.includes('aparat.com') ? (
                <iframe src={widget.url} className="w-full h-full border-0" allowFullScreen title="video-embed" />
              ) : (
                <video src={widget.url} controls className="w-full h-full object-contain bg-black" />
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-sm p-4 text-center">
                <Film className="w-8 h-8 mb-2 opacity-60" />
                ویدئو را از کتابخانه رسانه انتخاب کنید یا آدرس فایل را وارد نمایید
              </div>
            )}
          </div>
        );
      case 'audio':
        return (
          <div style={{ backgroundColor: widget.bgColor && widget.bgColor !== 'transparent' ? widget.bgColor : isDarkTheme ? '#27272a' : '#f1f5f9', borderRadius: `${widget.borderRadius ?? 16}px` }} className="p-4 border border-slate-200/60 flex flex-col gap-2.5 max-w-xl mx-auto">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="text-start">
                <div style={{ color: resolveTextColor('#0f172a') }} className="text-sm font-bold">{widget.title || 'فایل صوتی / ویس'}</div>
                {widget.caption && <div className="text-xs text-slate-500">{widget.caption}</div>}
              </div>
            </div>
            {widget.url ? (
              <audio controls src={widget.url} className="w-full h-10" />
            ) : (
              <div className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-dashed border-slate-300 text-center">
                کلیک کنید تا فایل صوتی آپلود کنید یا با میکروفون ویس ضبط نمایید
              </div>
            )}
          </div>
        );
      case 'button':
        return (
          <div style={{ textAlign: widget.align || 'center' }}>
            <a
              href={isEditing ? undefined : widget.url || '#'}
              onClick={(e) => isEditing && e.preventDefault()}
              style={{ backgroundColor: widget.bgColor || accent, color: widget.color || '#ffffff', fontSize: `${widget.fontSize || 16}px`, fontFamily: appliedFont, padding: `${widget.padding || 12}px ${(widget.padding || 12) * 2}px`, borderRadius: `${widget.borderRadius ?? 10}px` }}
              className="inline-block font-semibold shadow-sm hover:opacity-90 transition cursor-pointer"
            >
              {widget.label || 'کلیک کنید'}
            </a>
          </div>
        );
      case 'poll': {
        const options = widget.options || [];
        const totalVotes = options.reduce((acc, o) => acc + (Number(o.votes) || 0), 0) + (pollVoted ? 1 : 0);
        return (
          <div style={{ backgroundColor: isDarkTheme ? '#27272a' : (widget.bgColor && widget.bgColor !== 'transparent' ? widget.bgColor : '#f8fafc'), color: resolveTextColor('#0f172a'), padding: `${widget.padding || 24}px`, borderRadius: `${widget.borderRadius ?? 16}px` }} className="max-w-xl mx-auto border border-slate-200/70 shadow-sm text-start">
            <h3 className="text-lg font-extrabold mb-4">{widget.question || 'سوال نظرسنجی'}</h3>
            <div className="space-y-2.5">
              {options.map((opt, idx) => {
                const count = (Number(opt.votes) || 0) + (pollVoted && selectedPollIdx === idx ? 1 : 0);
                const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                const isChosen = selectedPollIdx === idx;
                return (
                  <div
                    key={opt.id || idx}
                    onClick={() => { if (!isEditing && !pollVoted) setSelectedPollIdx(idx); }}
                    className={`relative overflow-hidden rounded-xl border p-3 transition cursor-pointer ${isChosen ? 'border-purple-600 bg-purple-50/60' : 'border-slate-200 bg-white/90 hover:border-purple-300'}`}
                  >
                    {(pollVoted || isEditing) && widget.showResults !== false && (
                      <div style={{ width: `${pct}%`, backgroundColor: accent }} className="absolute inset-y-0 right-0 opacity-15 transition-all duration-500" />
                    )}
                    <div className="relative flex items-center justify-between text-sm text-slate-900 font-medium">
                      <span className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${isChosen ? 'border-purple-600' : 'border-slate-400'}`}>
                          {isChosen && <span className="w-2 h-2 rounded-full bg-purple-600" />}
                        </span>
                        {opt.text}
                      </span>
                      {(pollVoted || isEditing) && widget.showResults !== false && (
                        <span className="text-xs font-bold text-purple-700">{pct}٪ ({count})</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {!pollVoted ? (
              <button
                type="button"
                onClick={() => {
                  if (isEditing || selectedPollIdx === null) return;
                  setPollVoted(true);
                  if (onFormSubmit) onFormSubmit(`نظرسنجی: ${widget.question}`, { 'گزینه انتخابی': options[selectedPollIdx]?.text || '' });
                }}
                style={{ backgroundColor: accent }}
                className="mt-4 w-full py-2.5 text-white font-bold rounded-xl text-sm hover:opacity-95 transition"
              >
                {widget.buttonText || 'ثبت رأی'}
              </button>
            ) : (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                رأی شما با موفقیت ثبت شد! (مجموع آرا: {totalVotes})
              </div>
            )}
          </div>
        );
      }
      case 'accordion':
        return (
          <div className="max-w-2xl mx-auto space-y-2.5 text-start">
            {(widget.items || []).map((item, idx) => {
              const isOpen = openAccordionIdx === idx;
              return (
                <div key={item.id || idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white text-slate-900">
                  <button type="button" onClick={() => setOpenAccordionIdx(isOpen ? -1 : idx)} className="w-full p-4 font-bold text-sm flex items-center justify-between hover:bg-slate-50">
                    <span>{item.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-purple-600' : ''}`} />
                  </button>
                  {isOpen && <div className="p-4 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100">{item.content}</div>}
                </div>
              );
            })}
          </div>
        );
      case 'tabs': {
        const tabs = widget.tabs || [];
        const currentTab = tabs[activeTabIdx] || tabs[0];
        return (
          <div className="max-w-2xl mx-auto border border-slate-200 rounded-2xl overflow-hidden bg-white text-slate-900 text-start">
            <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
              {tabs.map((t, idx) => (
                <button key={t.id || idx} type="button" onClick={() => setActiveTabIdx(idx)} className={`px-5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${activeTabIdx === idx ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-slate-500'}`}>
                  {t.title}
                </button>
              ))}
            </div>
            <div className="p-5 text-sm text-slate-700 leading-relaxed">{currentTab?.content}</div>
          </div>
        );
      }
      case 'pricing':
        return (
          <div style={{ backgroundColor: isDarkTheme ? '#27272a' : (widget.bgColor || '#ffffff'), color: resolveTextColor('#0f172a'), borderRadius: `${widget.borderRadius ?? 20}px` }} className="max-w-sm mx-auto border-2 border-purple-500/40 p-6 shadow-md text-center space-y-4">
            {widget.badge && <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">{widget.badge}</span>}
            <h3 className="text-xl font-extrabold">{widget.title}</h3>
            <div>
              <span className="text-3xl font-black text-purple-600">{widget.price}</span>
              <span className="text-xs opacity-70 mr-1.5">{widget.period}</span>
            </div>
            <ul className="space-y-2 text-sm text-start pt-2 border-t border-slate-200/50">
              {(widget.features || []).map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a href={isEditing ? undefined : widget.url || '#'} onClick={(e) => isEditing && e.preventDefault()} style={{ backgroundColor: accent }} className="block w-full py-2.5 text-white font-bold rounded-xl text-sm">
              {widget.buttonText || 'انتخاب پکیج'}
            </a>
          </div>
        );
      case 'testimonial':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-start">
            {(widget.items || []).map((t, i) => (
              <div key={t.id || i} className="p-5 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm space-y-2">
                <p className="text-sm text-slate-600 leading-relaxed">«{t.quote}»</p>
                <div className="pt-2 border-t border-slate-100">
                  <div className="font-bold text-sm">{t.author}</div>
                  <div className="text-xs text-purple-600">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'counter':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            {(widget.items || []).map((c, i) => (
              <div key={c.id || i} className="p-5 rounded-2xl bg-slate-900 text-white shadow-sm">
                <div className="text-3xl font-black text-purple-400">{c.number}</div>
                <div className="text-xs text-slate-300 mt-1">{c.label}</div>
              </div>
            ))}
          </div>
        );
      case 'progress':
        return (
          <div className="max-w-xl mx-auto space-y-4 text-start">
            {(widget.bars || []).map((b, i) => (
              <div key={b.id || i}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span style={{ color: resolveTextColor('#0f172a') }}>{b.label}</span>
                  <span className="text-purple-600">{b.percent}٪</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div style={{ width: `${Math.min(100, Math.max(0, b.percent))}%`, backgroundColor: accent }} className="h-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        );
      case 'countdown':
        return (
          <div className="text-center space-y-3">
            {widget.title && <h3 style={{ color: resolveTextColor('#0f172a') }} className="font-bold text-base">{widget.title}</h3>}
            <CountdownDisplay targetDate={widget.targetDate} accentColor="#c084fc" />
          </div>
        );
      case 'alert': {
        const styles = {
          info: 'bg-blue-50 border-blue-300 text-blue-900',
          success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
          warning: 'bg-amber-50 border-amber-300 text-amber-900',
          danger: 'bg-rose-50 border-rose-300 text-rose-900'
        };
        return (
          <div className={`p-4 rounded-xl border-r-4 text-start ${styles[widget.variant || 'info']}`}>
            <div className="font-bold text-sm mb-1">{widget.title}</div>
            <div className="text-xs leading-relaxed opacity-90">{widget.content}</div>
          </div>
        );
      }
      case 'social':
        return (
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {(widget.links || []).map((lk, i) => (
              <a key={lk.id || i} href={isEditing ? undefined : lk.url} target="_blank" rel="noreferrer" onClick={(e) => isEditing && e.preventDefault()} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-purple-600 transition">
                {lk.name}
              </a>
            ))}
          </div>
        );
      case 'map':
        return (
          <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200">
            <iframe title="google-map" className="w-full h-full border-0" src={`https://maps.google.com/maps?q=${encodeURIComponent(widget.address || 'Tehran')}&t=&z=14&ie=UTF8&iwloc=&output=embed`} />
          </div>
        );
      case 'card':
        return (
          <div style={{ backgroundColor: isDarkTheme ? '#27272a' : (widget.bgColor || '#f8fafc'), color: resolveTextColor('#0f172a'), fontFamily: appliedFont, padding: `${widget.padding || 24}px`, borderRadius: `${widget.borderRadius ?? 16}px` }} className="border border-slate-200/40 shadow-sm h-full">
            <h3 style={{ fontSize: `${(widget.fontSize || 16) + 2}px` }} className="font-bold mb-2">{widget.title || 'عنوان کارت'}</h3>
            <p style={{ fontSize: `${widget.fontSize || 14}px` }} className="opacity-85 leading-relaxed">{widget.content || 'توضیحات کارت محتوایی'}</p>
          </div>
        );
      case 'gallery':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(widget.images || []).map((img, i) => <img key={i} src={img} alt={`gallery-${i}`} className="w-full h-48 object-cover rounded-xl shadow-sm" />)}
          </div>
        );
      case 'table':
        return (
          <div style={{ color: resolveTextColor('#0f172a') }} className="overflow-x-auto rounded-xl border border-slate-200/60">
            <table className="w-full text-sm">
              <thead className={isDarkTheme ? 'bg-zinc-800' : 'bg-slate-100'}>
                <tr>{(widget.headers || []).map((h, i) => <th key={i} className="p-3 font-bold border-b border-slate-200/40">{h}</th>)}</tr>
              </thead>
              <tbody>
                {(widget.rows || []).map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-slate-100/20 last:border-0">
                    {row.map((cell, cIdx) => <td key={cIdx} className="p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'list':
        return (
          <ul className="space-y-2.5">
            {(widget.items || []).map((item, idx) => (
              <li key={idx} className="flex items-center gap-2.5" style={{ fontSize: `${widget.fontSize || 16}px` }}>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span style={{ color: resolveTextColor('#1e293b') }}>{item}</span>
              </li>
            ))}
          </ul>
        );
      case 'form': {
        const normalizedFields = (widget.fields || []).map((f, i) => (typeof f === 'string' ? { id: `sf-${i}`, label: f, type: 'text', required: true } : f));
        return (
          <div style={{ backgroundColor: isDarkTheme ? '#27272a' : (widget.bgColor && widget.bgColor !== 'transparent' ? widget.bgColor : '#f8fafc'), color: resolveTextColor('#0f172a'), fontFamily: appliedFont, padding: `${widget.padding || 28}px`, borderRadius: `${widget.borderRadius ?? 16}px` }} className="max-w-xl mx-auto border border-slate-200/60 shadow-sm text-start">
            <h3 className="text-xl font-bold mb-4">{widget.title || 'فرم ارتباط با ما'}</h3>
            {formSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                اطلاعات شما با موفقیت ثبت و برای مدیر ارسال شد!
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!isEditing) {
                    if (onFormSubmit) onFormSubmit(widget.title || 'فرم بدون عنوان', formValues);
                    setFormSubmitted(true);
                  }
                }}
                className="space-y-3"
              >
                {normalizedFields.map((f, i) => (
                  <div key={f.id || i}>
                    <label className="block text-xs font-semibold opacity-80 mb-1">
                      {f.label} {f.required && <span className="text-rose-500">*</span>}
                    </label>
                    {f.type === 'textarea' ? (
                      <textarea rows={3} required={!!f.required} value={formValues[f.label] || ''} onChange={(e) => setFormValues((prev) => ({ ...prev, [f.label]: e.target.value }))} placeholder={f.label} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm" />
                    ) : (
                      <input type={f.type || 'text'} required={!!f.required} value={formValues[f.label] || ''} onChange={(e) => setFormValues((prev) => ({ ...prev, [f.label]: e.target.value }))} placeholder={f.label} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm" />
                    )}
                  </div>
                ))}
                <button type="submit" style={{ backgroundColor: accent }} className="w-full py-2.5 px-4 hover:opacity-95 text-white font-semibold rounded-lg text-sm transition">
                  {widget.buttonText || 'ارسال اطلاعات'}
                </button>
              </form>
            )}
          </div>
        );
      }
      case 'divider':
        return <hr style={{ borderColor: widget.color || '#cbd5e1' }} className="my-2 border-t-2" />;
      case 'spacer':
        return <div style={{ height: `${widget.height || 40}px` }} />;
      case 'html':
        return <div dangerouslySetInnerHTML={{ __html: widget.content || '<div class="p-4 bg-slate-100 rounded-lg text-center">کد HTML سفارشی</div>' }} />;
      default:
        return null;
    }
  };

  if (!isEditing) return <div style={wrapperStyle}>{renderContent()}</div>;

  return (
    <div
      id={`widget-node-${widget.id}`}
      draggable={true}
      onDragStart={onDragStartWidget}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={wrapperStyle}
      className={`relative group cursor-grab active:cursor-grabbing transition-all ${isSelected ? 'ring-2 ring-purple-600 ring-offset-2' : 'hover:ring-1 hover:ring-purple-400'}`}
    >
      {renderContent()}
    </div>
  );
}

// --- Public Standalone Page Viewer ---
function PublicPageView({ page, isLoadingCloud, siteSettings, customThemes, onIncrementView, onSaveSubmission, onBackToAdmin }) {
  const [passwordInput, setPasswordInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const countedRef = useRef(false);

  useEffect(() => {
    if (page) document.title = page.metaTitle || page.title;
    if (page && !countedRef.current) {
      countedRef.current = true;
      onIncrementView(page.id);
    }
  }, [page]);

  if (isLoadingCloud) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-700">در حال بارگذاری صفحه از نکسورا...</p>
      </div>
    );
  }

  if (!page || page.status !== 'published' || page.visibility === 'private') {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">این صفحه در دسترس نیست</h1>
        <p className="text-slate-600 max-w-md mb-6">ممکن است لینک اشتباه باشد، صفحه هنوز منتشر نشده باشد یا دسترسی به آن خصوصی شده باشد.</p>
        <button onClick={onBackToAdmin} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800">
          ورود به پنل مدیریت نکسورا
        </button>
      </div>
    );
  }

  if (page.visibility === 'password' && !unlocked) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-200">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">صفحه محافظت‌شده با رمز عبور</h2>
          <p className="text-sm text-slate-500 mb-5">برای مشاهده محتوای «{page.title}» رمز عبور را وارد کنید.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (passwordInput === page.password) {
                setUnlocked(true);
                setError('');
              } else {
                setError('رمز عبور وارد شده اشتباه است.');
              }
            }}
            className="space-y-4"
          >
            <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="رمز عبور صفحه..." className="w-full px-4 py-2.5 rounded-xl border border-slate-300" />
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
            <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl">مشاهده صفحه</button>
          </form>
        </div>
      </div>
    );
  }

  const activeDefaultFont = page.defaultFont || siteSettings?.defaultFont || "'Vazirmatn', sans-serif";
  const footerText = page.footerText !== undefined ? page.footerText : siteSettings?.footerText;
  const themeConfig = resolvePageThemeConfig(page.pageTheme, customThemes, page.customThemeObj);

  return (
    <div dir={page.direction || 'rtl'} style={{ fontFamily: activeDefaultFont, ...themeConfig.outerStyle }} className={`min-h-screen flex flex-col ${themeConfig.outerClass}`}>
      {themeConfig.customCss && <style>{themeConfig.customCss}</style>}
      <div style={themeConfig.innerStyle} className={`flex-1 nexora-page-container ${themeConfig.innerClass}`}>
        {page.sections.map((sec) => (
          <section
            key={sec.id}
            style={{ backgroundColor: themeConfig.sectionOverrideClass ? 'transparent' : (sec.bgColor || '#ffffff'), paddingTop: `${sec.paddingY ?? 48}px`, paddingBottom: `${sec.paddingY ?? 48}px` }}
            className={`w-full px-4 md:px-8 nexora-page-section ${themeConfig.sectionOverrideClass}`}
          >
            <div className={`max-w-6xl mx-auto grid gap-6 ${sec.columns === 3 ? 'grid-cols-1 md:grid-cols-3' : sec.columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {sec.widgets.map((w) => (
                <WidgetRenderer
                  key={w.id}
                  widget={w}
                  isEditing={false}
                  defaultFont={activeDefaultFont}
                  pageTheme={page.pageTheme}
                  customThemeObj={themeConfig.customObj}
                  lang={page.direction === 'ltr' ? 'en' : 'fa'}
                  onFormSubmit={(formTitle, values) =>
                    onSaveSubmission({
                      id: `sub-${generateId()}`,
                      pageId: page.id,
                      pageTitle: page.title,
                      pageSlug: page.slug,
                      formTitle,
                      values,
                      submittedAt: new Date().toLocaleString('fa-IR')
                    })
                  }
                />
              ))}
            </div>
          </section>
        ))}
        {footerText && <footer className="py-5 px-4 text-center text-xs opacity-70 border-t border-slate-200/30">{footerText}</footer>}
      </div>
    </div>
  );
}

// --- Main Application ---
export default function App() {
  const [lang, setLang] = useState('fa');
  const dir = lang === 'fa' ? 'rtl' : 'ltr';

  useEffect(() => {
    const styleId = 'pb-custom-fonts';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Lalezar&family=Vazirmatn:wght@300;400;600;800&display=swap');`;
      document.head.appendChild(style);
    }
  }, []);

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('nexora_users_v1');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nexora_current_user_v1');
    return saved ? JSON.parse(saved) : null;
  });

  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('nexora_site_settings_v1');
    return saved ? JSON.parse(saved) : DEFAULT_SITE_SETTINGS;
  });

  const [customThemes, setCustomThemes] = useState(() => {
    const saved = localStorage.getItem('nexora_custom_themes_v1');
    return saved ? JSON.parse(saved) : [
      {
        id: 'custom-wp-royal',
        name: 'قالب اختصاصی نکسورا رویال (Royal Purple)',
        desc: 'قالب جعبه‌ای با حاشیه بنفش برند نکسورا و پس‌زمینه لطیف',
        isCustom: true,
        layout: 'boxed',
        outerBg: '#ede9fe',
        surfaceBg: '#ffffff',
        textColor: '#1e1b4b',
        accentColor: '#7c3aed',
        topBar: true,
        overrideSectionBg: true,
        isDark: false,
        customCss: ''
      }
    ];
  });

  // Theme Builder State
  const [newThemeName, setNewThemeName] = useState('');
  const [newThemeDesc, setNewThemeDesc] = useState('');
  const [newThemeLayout, setNewThemeLayout] = useState('boxed');
  const [newThemeOuterBg, setNewThemeOuterBg] = useState('#f1f5f9');
  const [newThemeSurfaceBg, setNewThemeSurfaceBg] = useState('#ffffff');
  const [newThemeTextColor, setNewThemeTextColor] = useState('#0f172a');
  const [newThemeAccentColor, setNewThemeAccentColor] = useState('#7c3aed');
  const [newThemeTopBar, setNewThemeTopBar] = useState(true);
  const [newThemeOverrideBg, setNewThemeOverrideBg] = useState(true);
  const [newThemeIsDark, setNewThemeIsDark] = useState(false);
  const [newThemeCustomCss, setNewThemeCustomCss] = useState('');
  const [showQuickThemeModal, setShowQuickThemeModal] = useState(false);

  // Login State (Empty by default)
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // New User State
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserRole, setNewUserRole] = useState('editor');
  const [newUserPerms, setNewUserPerms] = useState({ ...ROLE_PRESETS.editor });
  const [expandedUserPermId, setExpandedUserPermId] = useState(null);

  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem('nexora_pages_v1');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'page-demo-1',
        title: 'معرفی هدفون استودیویی پرو',
        slug: 'studio-headphones',
        cloudKey: '',
        pageTheme: 'custom-wp-royal',
        category: 'فروشگاهی',
        status: 'published',
        visibility: 'public',
        password: '',
        views: 124,
        updatedAt: '۱۴۰۴/۰۱/۲۰',
        metaTitle: 'خرید هدفون استودیویی پرو | Nexora',
        metaDescription: 'بهترین کیفیت صدا با حذف نویز هوشمند',
        direction: 'rtl',
        sections: TEMPLATES[1].sections
      }
    ];
  });

  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('nexora_submissions_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const [media, setMedia] = useState(() => {
    const saved = localStorage.getItem('nexora_media_v1');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA;
  });

  const [mediaFilter, setMediaFilter] = useState('all');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaUrlType, setMediaUrlType] = useState('video');
  const [widgetSearch, setWidgetSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('nexora_users_v1', JSON.stringify(users));
    if (currentUser) {
      const updatedMe = users.find((u) => u.id === currentUser.id);
      if (updatedMe) {
        setCurrentUser(updatedMe);
        localStorage.setItem('nexora_current_user_v1', JSON.stringify(updatedMe));
      }
    }
  }, [users]);

  useEffect(() => {
    localStorage.setItem('nexora_site_settings_v1', JSON.stringify(siteSettings));
    document.title = siteSettings.siteName || 'Nexora | نکسورا';
    const iconHref = siteSettings.faviconUrl || NEXORA_LOGO_DATA_URL;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = iconHref;
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('nexora_custom_themes_v1', JSON.stringify(customThemes));
  }, [customThemes]);

  useEffect(() => {
    localStorage.setItem('nexora_pages_v1', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem('nexora_submissions_v1', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    try {
      const safeMedia = media.filter((m) => !m.url.startsWith('blob:') && m.url.length < 1500000);
      localStorage.setItem('nexora_media_v1', JSON.stringify(safeMedia));
    } catch (e) {}
  }, [media]);

  // Public Routing State (Short ?page=slug&c=shortKey)
  const [publicSlug, setPublicSlug] = useState(() => new URLSearchParams(window.location.search).get('page'));
  const [cloudKeyParam, setCloudKeyParam] = useState(() => new URLSearchParams(window.location.search).get('c'));
  const [cloudFetchedPage, setCloudFetchedPage] = useState(null);
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);

  useEffect(() => {
    if (cloudKeyParam && !pages.some((p) => p.slug === publicSlug)) {
      setIsLoadingCloud(true);
      fetchPageFromShortCloud(cloudKeyParam).then((data) => {
        if (data) setCloudFetchedPage(data);
        setIsLoadingCloud(false);
      });
    }
  }, [cloudKeyParam, publicSlug]);

  const [activeTab, setActiveTab] = useState('pages');
  const [editingPageId, setEditingPageId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState('');

  // Editor State
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedWidgetId, setSelectedWidgetId] = useState(null);
  const [viewport, setViewport] = useState('desktop');
  const [editorRightTab, setEditorRightTab] = useState('style');
  const [slugErrorHighlight, setSlugErrorHighlight] = useState(false);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [mediaPickerCallback, setMediaPickerCallback] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Drag & Drop State
  const [dragOverSecId, setDragOverSecId] = useState(null);
  const [draggedNewWidgetType, setDraggedNewWidgetType] = useState(null);
  const [draggedExistingWidget, setDraggedExistingWidget] = useState(null);

  // Voice Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const allAvailableThemes = [...BUILTIN_WP_THEMES, ...customThemes];

  const handleCreateCustomTheme = (e, applyToEditingPage = false) => {
    e.preventDefault();
    if (!newThemeName.trim()) return;
    const created = {
      id: `custom-wp-${generateId()}`,
      name: newThemeName.trim(),
      desc: newThemeDesc.trim() || 'قالب وردپرس سفارشی',
      isCustom: true,
      layout: newThemeLayout,
      outerBg: newThemeOuterBg,
      surfaceBg: newThemeSurfaceBg,
      textColor: newThemeTextColor,
      accentColor: newThemeAccentColor,
      topBar: newThemeTopBar,
      overrideSectionBg: newThemeOverrideBg,
      isDark: newThemeIsDark,
      customCss: newThemeCustomCss
    };
    setCustomThemes((prev) => [created, ...prev]);
    if (applyToEditingPage && editingPageId) {
      setPages((prev) => prev.map((p) => (p.id === editingPageId ? { ...p, pageTheme: created.id } : p)));
    }
    setNewThemeName('');
    setNewThemeDesc('');
    setNewThemeCustomCss('');
    setShowQuickThemeModal(false);
    showToast(`قالب وردپرس «${created.name}» ساخته شد و آماده استفاده است.`);
  };

  if (publicSlug || cloudKeyParam) {
    const targetPage = pages.find((p) => p.slug === publicSlug) || cloudFetchedPage;
    return (
      <PublicPageView
        page={targetPage}
        isLoadingCloud={isLoadingCloud}
        siteSettings={siteSettings}
        customThemes={customThemes}
        onIncrementView={(id) => setPages((prev) => prev.map((p) => (p.id === id ? { ...p, views: (p.views || 0) + 1 } : p)))}
        onSaveSubmission={(sub) => setSubmissions((prev) => [sub, ...prev])}
        onBackToAdmin={() => {
          window.history.pushState({}, '', window.location.pathname);
          setPublicSlug(null);
          setCloudKeyParam(null);
          setCloudFetchedPage(null);
        }}
      />
    );
  }

  if (!currentUser) {
    return (
      <div dir="rtl" style={{ fontFamily: siteSettings.defaultFont }} className="min-h-screen bg-[#07021c] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-purple-100">
          <div className="flex items-center gap-3.5 mb-6">
            <img src={siteSettings.logoUrl || NEXORA_LOGO_DATA_URL} alt="Nexora Logo" className="w-14 h-14 rounded-2xl shadow-md object-cover shrink-0" />
            <div>
              <h1 className="text-xl font-black text-slate-900">{siteSettings.siteName}</h1>
              <p className="text-xs text-slate-500 mt-0.5">پلتفرم هوشمند صفحه‌ساز و طراحی بصری</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const matched = users.find((u) => u.username.toLowerCase() === loginUser.trim().toLowerCase() && u.password === loginPass);
              if (matched) {
                const userWithPerms = { ...matched, permissions: matched.permissions || ROLE_PRESETS[matched.role] || ROLE_PRESETS.author };
                localStorage.setItem('nexora_current_user_v1', JSON.stringify(userWithPerms));
                setCurrentUser(userWithPerms);
                setLoginError('');
              } else {
                setLoginError('نام کاربری یا رمز عبور اشتباه است.');
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">نام کاربری</label>
              <input type="text" autoComplete="off" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} placeholder="نام کاربری را وارد کنید" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">رمز عبور</label>
              <input type="password" autoComplete="new-password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="رمز عبور را وارد کنید" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600" />
            </div>
            {loginError && <p className="text-xs text-red-600 font-medium">{loginError}</p>}
            <button type="submit" className="w-full py-3 bg-gradient-to-l from-purple-700 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-md">
              <LogIn className="w-4 h-4" />
              ورود به داشبورد نکسورا
            </button>
          </form>
        </div>
      </div>
    );
  }

  const perms = currentUser.permissions || ROLE_PRESETS[currentUser.role] || ROLE_PRESETS.author;

  const createPageFromTemplate = (tpl) => {
    if (!perms.createPages) return showToast('شما مجوز ساخت صفحه جدید ندارید.');
    const newId = `page-${generateId()}`;
    const title = tpl.name[lang];
    const newPage = {
      id: newId,
      title,
      slug: '',
      cloudKey: '',
      pageTheme: 'default',
      category: tpl.category,
      status: 'draft',
      visibility: 'public',
      password: '',
      views: 0,
      updatedAt: new Date().toLocaleDateString('fa-IR'),
      metaTitle: title,
      metaDescription: tpl.description[lang],
      direction: dir,
      sections: JSON.parse(JSON.stringify(tpl.sections))
    };
    setPages((prev) => [newPage, ...prev]);
    openEditor(newPage.id);
    showToast('صفحه جدید ایجاد شد. المان‌ها را به صفحه بکشید و در نهایت یک Slug کوتاه وارد کنید.');
  };

  const openEditor = (pageId, focusSettings = false) => {
    if (!perms.editPages) return showToast('شما مجوز ویرایش صفحات را ندارید.');
    setEditingPageId(pageId);
    setHistory([]);
    setFuture([]);
    setSelectedSectionId(null);
    setSelectedWidgetId(null);
    setSlugErrorHighlight(focusSettings);
    setEditorRightTab(focusSettings ? 'settings' : 'style');
    setActiveTab('editor');
  };

  const duplicatePage = (page) => {
    if (!perms.createPages) return showToast('شما مجوز کپی کردن صفحه را ندارید.');
    const copy = { ...JSON.parse(JSON.stringify(page)), id: `page-${generateId()}`, title: `${page.title} (کپی)`, slug: '', cloudKey: '', status: 'draft', views: 0 };
    setPages((prev) => [copy, ...prev]);
    showToast('صفحه کپی شد (آدرس Slug خالی است و باید قبل از انتشار تنظیم شود).');
  };

  const deletePage = (id) => {
    if (!perms.deletePages) return showToast('شما مجوز حذف صفحه را ندارید.');
    setPages((prev) => prev.filter((p) => p.id !== id));
    showToast('صفحه حذف شد');
  };

  const buildShortShareUrl = (slug, cloudKey) => {
    const base = `${window.location.origin}${window.location.pathname}`;
    return cloudKey ? `${base}?page=${slug}&c=${cloudKey}` : `${base}?page=${slug}`;
  };

  const copyShortShareLink = async (pageObj) => {
    if (!pageObj.slug || !pageObj.slug.trim()) {
      showToast('ابتدا باید آدرس کوتاه (Slug) را در تنظیمات صفحه وارد کنید!');
      openEditor(pageObj.id, true);
      return;
    }
    setIsPublishing(true);
    const key = await publishPageToShortCloud(pageObj, siteSettings, customThemes);
    setIsPublishing(false);
    if (key) {
      setPages((prev) => prev.map((p) => (p.id === pageObj.id ? { ...p, cloudKey: key, status: 'published' } : p)));
    }
    const shortUrl = buildShortShareUrl(pageObj.slug, key || pageObj.cloudKey);
    navigator.clipboard.writeText(shortUrl);
    showToast(`لینک کوتاه صفحه کپی شد: ${shortUrl}`);
  };

  const exportPageJson = (page) => {
    const blob = new Blob([JSON.stringify(page, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${page.slug || 'nexora-page'}.json`;
    a.click();
  };

  const currentPage = pages.find((p) => p.id === editingPageId);

  const updateCurrentPage = (updater, recordHistory = true) => {
    if (!currentPage) return;
    if (recordHistory) {
      setHistory((prev) => [...prev.slice(-20), JSON.parse(JSON.stringify(currentPage))]);
      setFuture([]);
    }
    setPages((prev) => prev.map((p) => (p.id === currentPage.id ? { ...updater(p), updatedAt: new Date().toLocaleDateString('fa-IR') } : p)));
  };

  const handlePublishAndCopy = async () => {
    if (!currentPage) return;
    if (!currentPage.slug || !currentPage.slug.trim()) {
      setEditorRightTab('settings');
      setSlugErrorHighlight(true);
      return showToast('خطا: کادر آدرس اختصاصی (Slug) خالی است! ابتدا یک نام کوتاه وارد کنید.');
    }
    setSlugErrorHighlight(false);
    const publishedObj = { ...currentPage, status: 'published' };
    updateCurrentPage(() => publishedObj, false);
    await copyShortShareLink(publishedObj);
  };

  const handlePreviewPage = () => {
    if (!currentPage) return;
    if (!currentPage.slug || !currentPage.slug.trim()) {
      setEditorRightTab('settings');
      setSlugErrorHighlight(true);
      return showToast('برای مشاهده پیش‌نمایش، ابتدا آدرس کوتاه (Slug) را وارد کنید.');
    }
    setSlugErrorHighlight(false);
    const publishedObj = { ...currentPage, status: 'published' };
    updateCurrentPage(() => publishedObj, false);
    setPublicSlug(publishedObj.slug);
  };

  const handleUndo = () => {
    if (history.length === 0 || !currentPage) return;
    const previous = history[history.length - 1];
    setFuture((prev) => [JSON.parse(JSON.stringify(currentPage)), ...prev]);
    setHistory((prev) => prev.slice(0, -1));
    setPages((prev) => prev.map((p) => (p.id === currentPage.id ? previous : p)));
  };

  const handleRedo = () => {
    if (future.length === 0 || !currentPage) return;
    const next = future[0];
    setHistory((prev) => [...prev, JSON.parse(JSON.stringify(currentPage))]);
    setFuture((prev) => prev.slice(1));
    setPages((prev) => prev.map((p) => (p.id === currentPage.id ? next : p)));
  };

  const scrollToElementId = (domId) => {
    setTimeout(() => {
      const el = document.getElementById(domId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const createDefaultWidgetObject = (type) => {
    const defaults = {
      heading: { content: 'عنوان جدید', fontSize: 32, color: '#0f172a', align: 'right', fontFamily: '' },
      subheading: { content: 'زیرعنوان توضیحی', fontSize: 20, color: '#475569', align: 'right', fontFamily: '' },
      text: { content: 'متن دلخواه خود را اینجا بنویسید و از پنل کناری رنگ و فونت آن را تغییر دهید.', fontSize: 16, color: '#334155', align: 'right', fontFamily: '' },
      image: { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80', caption: 'توضیح تصویر', borderRadius: 12 },
      video: { url: '' },
      audio: { title: 'پیام صوتی / ویس', caption: 'برای پخش روی دکمه Play کلیک کنید', url: '', bgColor: '#f1f5f9', borderRadius: 16 },
      button: { label: 'دکمه اقدام', url: '#', bgColor: '#6d28d9', color: '#ffffff', fontSize: 16, padding: 12, borderRadius: 10, align: 'center', fontFamily: '' },
      poll: {
        question: 'نظر شما درباره این موضوع چیست؟',
        buttonText: 'ثبت رأی',
        showResults: true,
        options: [
          { id: `opt-${generateId()}`, text: 'بسیار عالی و کاربردی است', votes: 15 },
          { id: `opt-${generateId()}`, text: 'نیاز به امکانات بیشتر دارد', votes: 6 },
          { id: `opt-${generateId()}`, text: 'نظری ندارم', votes: 2 }
        ],
        bgColor: '#f8fafc',
        padding: 24,
        borderRadius: 16
      },
      accordion: {
        items: [
          { id: `ac-${generateId()}`, title: 'پرسش متداول اول را اینجا بنویسید', content: 'پاسخ کامل و شفاف به این پرسش در اینجا نمایش داده می‌شود.' },
          { id: `ac-${generateId()}`, title: 'پرسش متداول دوم', content: 'توضیحات تکمیلی برای کاربران در این بخش قرار می‌گیرد.' }
        ]
      },
      tabs: {
        tabs: [
          { id: `tb-${generateId()}`, title: 'تب اول', content: 'محتوای کامل مربوط به تب اول در این قسمت نمایش داده می‌شود.' },
          { id: `tb-${generateId()}`, title: 'تب دوم', content: 'محتوای مربوط به تب دوم را می‌توانید از پنل کناری ویرایش کنید.' }
        ]
      },
      pricing: { badge: 'پیشنهاد ویژه', title: 'پکیج حرفه‌ای', price: '۴۹۰,۰۰۰', period: 'تومان / ماهانه', buttonText: 'سفارش آنلاین', url: '#', features: ['پشتیبانی ۲۴ ساعته', 'دسترسی نامحدود', 'گزارش‌گیری پیشرفته'], bgColor: '#ffffff', borderRadius: 20 },
      testimonial: {
        items: [
          { id: `tm-${generateId()}`, author: 'سارا محمدی', role: 'مدیر بازاریابی', quote: 'تجربه فوق‌العاده‌ای داشتیم و کیفیت خدمات فراتر از انتظار بود.' },
          { id: `tm-${generateId()}`, author: 'امیرحسین کریمی', role: 'بنیان‌گذار استارتاپ', quote: 'سرعت و دقت تیم پشتیبانی واقعاً ستودنی است.' }
        ]
      },
      counter: {
        items: [
          { id: `cn-${generateId()}`, number: '+۵۰۰', label: 'پروژه موفق' },
          { id: `cn-${generateId()}`, number: '۹۸٪', label: 'رضایت مشتریان' },
          { id: `cn-${generateId()}`, number: '۱۰ سال', label: 'تجربه تخصصی' }
        ]
      },
      progress: {
        bars: [
          { id: `pr-${generateId()}`, label: 'رضایت کاربران', percent: 94 },
          { id: `pr-${generateId()}`, label: 'سرعت اجرا', percent: 89 }
        ]
      },
      countdown: { title: 'زمان باقی‌مانده تا پایان جشنواره ویژه', targetDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16) },
      alert: { variant: 'info', title: 'اطلاعیه مهم', content: 'متن پیام اطلاع‌رسانی یا هشدار را در این کادر وارد نمایید.' },
      social: {
        links: [
          { id: `sc-${generateId()}`, name: 'اینستاگرام', url: 'https://instagram.com' },
          { id: `sc-${generateId()}`, name: 'تلگرام', url: 'https://t.me' },
          { id: `sc-${generateId()}`, name: 'واتساپ', url: 'https://wa.me' }
        ]
      },
      map: { address: 'Tehran, Azadi Square' },
      card: { title: 'عنوان کارت', content: 'توضیحات مختصر درباره این کارت محتوایی', bgColor: '#f8fafc', color: '#0f172a', padding: 24, borderRadius: 16, fontFamily: '' },
      gallery: { images: INITIAL_MEDIA.filter((m) => m.type === 'image').map((m) => m.url) },
      table: { headers: ['ویژگی', 'توضیحات'], rows: [['سرعت بارگذاری', 'زیر ۱ ثانیه'], ['پشتیبانی', '۲۴ ساعته']] },
      list: { items: ['مزیت اول محصول یا خدمت', 'مزیت دوم با کیفیت تضمینی', 'مزیت سوم و پشتیبانی ویژه'], color: '#1e293b', fontFamily: '' },
      form: {
        title: 'فرم ثبت درخواست',
        buttonText: 'ارسال فرم',
        fields: [
          { id: `fl-${generateId()}`, label: 'نام و نام خانوادگی', type: 'text', required: true },
          { id: `fl-${generateId()}`, label: 'شماره تماس', type: 'tel', required: true }
        ],
        bgColor: '#f8fafc',
        padding: 24,
        borderRadius: 16,
        fontFamily: ''
      },
      divider: { color: '#cbd5e1' },
      spacer: { height: 48 },
      html: { content: '<div style="padding:20px;background:#f5f3ff;border-radius:12px;text-align:center;font-weight:bold;">کد HTML سفارشی شما</div>' }
    };

    return {
      id: `w-${generateId()}`,
      type,
      bgColor: 'transparent',
      padding: 8,
      borderRadius: 0,
      ...defaults[type]
    };
  };

  const addSection = (columns = 1, initialWidgetType = null) => {
    const newSecId = `sec-${generateId()}`;
    const firstWidget = initialWidgetType
      ? createDefaultWidgetObject(initialWidgetType)
      : { id: `w-${generateId()}`, type: 'heading', content: 'عنوان بخش جدید', align: 'center', color: '#0f172a', fontSize: 28, fontFamily: '', bgColor: 'transparent', padding: 8, borderRadius: 0 };
    const newSec = {
      id: newSecId,
      columns,
      bgColor: '#ffffff',
      paddingY: 48,
      widgets: [firstWidget]
    };
    updateCurrentPage((p) => ({ ...p, sections: [...p.sections, newSec] }));
    setSelectedSectionId(newSecId);
    setSelectedWidgetId(firstWidget.id);
    scrollToElementId(`section-node-${newSecId}`);
  };

  const addWidgetToSection = (sectionId, type, insertIndex = null) => {
    const newWidget = createDefaultWidgetObject(type);
    updateCurrentPage((p) => ({
      ...p,
      sections: p.sections.map((s) => {
        if (s.id !== sectionId) return s;
        const nextWidgets = [...s.widgets];
        if (insertIndex !== null && insertIndex >= 0 && insertIndex <= nextWidgets.length) {
          nextWidgets.splice(insertIndex, 0, newWidget);
        } else {
          nextWidgets.push(newWidget);
        }
        return { ...s, widgets: nextWidgets };
      })
    }));
    setSelectedSectionId(sectionId);
    setSelectedWidgetId(newWidget.id);
    scrollToElementId(`widget-node-${newWidget.id}`);
  };

  // --- Drag & Drop Handlers (Sidebar -> Canvas & Reordering inside Canvas) ---
  const handleDropOnSection = (e, targetSecId, targetWidgetIndex = null) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSecId(null);

    const newType = e.dataTransfer.getData('nexora/new-widget') || draggedNewWidgetType;
    const movePayloadRaw = e.dataTransfer.getData('nexora/move-widget');

    if (newType) {
      addWidgetToSection(targetSecId, newType, targetWidgetIndex);
      setDraggedNewWidgetType(null);
      return;
    }

    if (movePayloadRaw || draggedExistingWidget) {
      const source = movePayloadRaw ? JSON.parse(movePayloadRaw) : draggedExistingWidget;
      setDraggedExistingWidget(null);
      if (!source) return;

      updateCurrentPage((p) => {
        let movedWidget = null;
        const removedSections = p.sections.map((s) => {
          if (s.id !== source.secId) return s;
          const copy = [...s.widgets];
          movedWidget = copy.splice(source.wIdx, 1)[0];
          return { ...s, widgets: copy };
        });

        if (!movedWidget) return p;

        return {
          ...p,
          sections: removedSections.map((s) => {
            if (s.id !== targetSecId) return s;
            const copy = [...s.widgets];
            if (targetWidgetIndex !== null && targetWidgetIndex >= 0 && targetWidgetIndex <= copy.length) {
              copy.splice(targetWidgetIndex, 0, movedWidget);
            } else {
              copy.push(movedWidget);
            }
            return { ...s, widgets: copy };
          })
        };
      });
    }
  };

  const handleDropOnNewSectionZone = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSecId(null);
    const newType = e.dataTransfer.getData('nexora/new-widget') || draggedNewWidgetType;
    if (newType) {
      addSection(1, newType);
      setDraggedNewWidgetType(null);
    }
  };

  const updateSelectedWidget = (patch) => {
    if (!selectedSectionId || !selectedWidgetId) return;
    updateCurrentPage((p) => ({
      ...p,
      sections: p.sections.map((s) =>
        s.id === selectedSectionId
          ? { ...s, widgets: s.widgets.map((w) => (w.id === selectedWidgetId ? { ...w, ...patch } : w)) }
          : s
      )
    }));
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          updateSelectedWidget({ url: reader.result });
          showToast('ویس با موفقیت ضبط و روی المان قرار گرفت!');
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      showToast('دسترسی به میکروفون توسط مرورگر مسدود شده است.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteWidget = (secId, wId) => {
    updateCurrentPage((p) => ({
      ...p,
      sections: p.sections.map((s) => (s.id === secId ? { ...s, widgets: s.widgets.filter((w) => w.id !== wId) } : s))
    }));
    if (selectedWidgetId === wId) setSelectedWidgetId(null);
  };

  const moveWidget = (secId, wIdx, direction) => {
    updateCurrentPage((p) => ({
      ...p,
      sections: p.sections.map((s) => {
        if (s.id !== secId) return s;
        const arr = [...s.widgets];
        const target = wIdx + direction;
        if (target < 0 || target >= arr.length) return s;
        [arr[wIdx], arr[target]] = [arr[target], arr[wIdx]];
        return { ...s, widgets: arr };
      })
    }));
  };

  const selectedSection = currentPage?.sections.find((s) => s.id === selectedSectionId);
  const selectedWidget = selectedSection?.widgets.find((w) => w.id === selectedWidgetId);

  // --- VISUAL EDITOR VIEW ---
  if (activeTab === 'editor' && currentPage) {
    const themeConfig = resolvePageThemeConfig(currentPage.pageTheme, customThemes);
    const filteredWidgets = WIDGET_TYPES.filter((w) =>
      w.label[lang].toLowerCase().includes(widgetSearch.toLowerCase()) ||
      w.type.toLowerCase().includes(widgetSearch.toLowerCase())
    );

    return (
      <div dir={dir} style={{ fontFamily: siteSettings.defaultFont }} className="h-screen flex flex-col bg-slate-100 overflow-hidden">
        {themeConfig.customCss && <style>{themeConfig.customCss}</style>}
        <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab('pages')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 flex items-center gap-1.5 text-sm font-medium">
              <ArrowRight className={`w-4 h-4 ${dir === 'ltr' ? 'rotate-180' : ''}`} />
              داشبورد نکسورا
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <img src={siteSettings.logoUrl || NEXORA_LOGO_DATA_URL} alt="Nexora" className="w-7 h-7 rounded-lg object-cover hidden sm:block" />
            <input type="text" value={currentPage.title} onChange={(e) => updateCurrentPage((p) => ({ ...p, title: e.target.value }), false)} className="font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-600 focus:outline-none px-1 text-sm md:text-base" />
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${currentPage.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {currentPage.status === 'published' ? 'منتشرشده' : 'پیش‌نویس'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setViewport('desktop')} className={`p-1.5 rounded-lg ${viewport === 'desktop' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500'}`}><Monitor className="w-4 h-4" /></button>
            <button onClick={() => setViewport('tablet')} className={`p-1.5 rounded-lg ${viewport === 'tablet' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500'}`}><Tablet className="w-4 h-4" /></button>
            <button onClick={() => setViewport('mobile')} className={`p-1.5 rounded-lg ${viewport === 'mobile' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500'}`}><Smartphone className="w-4 h-4" /></button>
            <div className="h-4 w-px bg-slate-300 mx-1" />
            <button onClick={handleUndo} disabled={history.length === 0} className="p-1.5 rounded-lg text-slate-600 disabled:opacity-30 hover:bg-white"><Undo2 className="w-4 h-4" /></button>
            <button onClick={handleRedo} disabled={future.length === 0} className="p-1.5 rounded-lg text-slate-600 disabled:opacity-30 hover:bg-white"><Redo2 className="w-4 h-4" /></button>
          </div>

          <div className="flex items-center gap-2">
            {perms.publishPages ? (
              <>
                <button onClick={handlePreviewPage} className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  پیش‌نمایش
                </button>
                <button disabled={isPublishing} onClick={handlePublishAndCopy} className="px-4 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-1.5 shadow-sm disabled:opacity-60">
                  <Globe className="w-3.5 h-3.5" />
                  {isPublishing ? 'در حال ساخت لینک کوتاه...' : 'انتشار و کپی لینک کوتاه'}
                </button>
              </>
            ) : (
              <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg font-medium">ذخیره خودکار پیش‌نویس</span>
            )}
          </div>
        </header>

        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Left Panel: Draggable Elementor Widgets */}
          <aside className="w-64 bg-white border-e border-slate-200 flex flex-col shrink-0 overflow-y-auto p-3">
            <div className="mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">افزودن سکشن جدید</h3>
              <div className="grid grid-cols-3 gap-1.5">
                {[1, 2, 3].map((cols) => (
                  <button key={cols} onClick={() => addSection(cols)} className="p-2 border border-slate-200 hover:border-purple-500 hover:bg-purple-50 rounded-xl flex flex-col items-center gap-1 text-xs font-medium text-slate-700 transition">
                    <Columns className="w-4 h-4 text-purple-600" />
                    <span>{cols} ستون</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute top-2.5 right-2.5" />
                <input type="text" value={widgetSearch} onChange={(e) => setWidgetSearch(e.target.value)} placeholder="جستجوی المان المنتور..." className="w-full pr-8 pl-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between px-1 mb-2">
                <h3 className="text-xs font-bold text-slate-400">المان‌ها (بکشید یا کلیک کنید)</h3>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {filteredWidgets.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.type}
                      draggable={true}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('nexora/new-widget', item.type);
                        setDraggedNewWidgetType(item.type);
                      }}
                      onDragEnd={() => {
                        setDraggedNewWidgetType(null);
                        setDragOverSecId(null);
                      }}
                      onClick={() => {
                        const targetSec = selectedSectionId || currentPage.sections[0]?.id;
                        if (targetSec) addWidgetToSection(targetSec, item.type);
                        else addSection(1, item.type);
                      }}
                      className="p-2 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/60 flex flex-col items-center justify-center gap-1 text-center transition group cursor-grab active:cursor-grabbing select-none"
                    >
                      <Icon className="w-4 h-4 text-slate-600 group-hover:text-purple-600" />
                      <span className="text-[11px] font-medium text-slate-700 leading-tight">{item.label[lang]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Center Canvas (Supports Drop Anywhere + Free Vertical Scroll) */}
          <main onClick={() => setSelectedWidgetId(null)} className="flex-1 min-h-0 overflow-y-auto p-6 pb-28 bg-slate-200/70">
            <div style={{ width: viewport === 'mobile' ? '390px' : viewport === 'tablet' ? '768px' : '100%', ...themeConfig.outerStyle }} className={`max-w-5xl mx-auto h-fit min-h-[calc(100vh-8rem)] shadow-xl rounded-xl transition-all duration-300 ${themeConfig.outerClass}`}>
              <div style={themeConfig.innerStyle} className={`nexora-page-container rounded-xl ${themeConfig.innerClass}`}>
                {currentPage.sections.map((sec, sIdx) => {
                  const isDraggingOverThis = dragOverSecId === sec.id;
                  return (
                    <div
                      id={`section-node-${sec.id}`}
                      key={sec.id}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragOverSecId !== sec.id) setDragOverSecId(sec.id);
                      }}
                      onDragLeave={() => setDragOverSecId(null)}
                      onDrop={(e) => handleDropOnSection(e, sec.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSectionId(sec.id);
                        setSelectedWidgetId(null);
                      }}
                      style={{ backgroundColor: themeConfig.sectionOverrideClass ? 'transparent' : (sec.bgColor || '#ffffff'), paddingTop: `${sec.paddingY ?? 48}px`, paddingBottom: `${sec.paddingY ?? 48}px` }}
                      className={`relative px-6 border-b border-dashed transition nexora-page-section ${themeConfig.sectionOverrideClass} ${
                        isDraggingOverThis
                          ? 'ring-2 ring-purple-600 bg-purple-50/40 border-purple-500'
                          : selectedSectionId === sec.id
                          ? 'border-purple-500 ring-1 ring-inset ring-purple-400'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-slate-900/85 text-white px-2 py-1 rounded-lg text-xs z-10">
                        <span>بخش {sIdx + 1}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCurrentPage((p) => ({ ...p, sections: p.sections.filter((s) => s.id !== sec.id) }));
                          }}
                          className="p-1 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className={`grid gap-5 ${sec.columns === 3 ? 'grid-cols-1 md:grid-cols-3' : sec.columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                        {sec.widgets.map((w, wIdx) => (
                          <div
                            key={w.id}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDropOnSection(e, sec.id, wIdx)}
                            className="relative group"
                          >
                            {selectedWidgetId === w.id && (
                              <div className="absolute -top-7 right-0 flex items-center gap-1 bg-purple-600 text-white px-2 py-0.5 rounded-t-lg text-xs z-10">
                                <span className="cursor-grab px-0.5" title="بکشید و جابه‌جا کنید"><GripVertical className="w-3 h-3" /></span>
                                <button onClick={() => moveWidget(sec.id, wIdx, -1)} className="p-0.5 hover:bg-purple-700 rounded"><MoveUp className="w-3 h-3" /></button>
                                <button onClick={() => moveWidget(sec.id, wIdx, 1)} className="p-0.5 hover:bg-purple-700 rounded"><MoveDown className="w-3 h-3" /></button>
                                <button
                                  onClick={() => {
                                    const cloned = { ...JSON.parse(JSON.stringify(w)), id: `w-${generateId()}` };
                                    updateCurrentPage((p) => ({ ...p, sections: p.sections.map((s) => (s.id === sec.id ? { ...s, widgets: [...s.widgets, cloned] } : s)) }));
                                  }}
                                  className="p-0.5 hover:bg-purple-700 rounded"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                                <button onClick={() => deleteWidget(sec.id, w.id)} className="p-0.5 hover:bg-red-600 rounded"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            )}
                            <WidgetRenderer
                              widget={w}
                              isEditing={true}
                              isSelected={selectedWidgetId === w.id}
                              defaultFont={siteSettings.defaultFont}
                              pageTheme={currentPage.pageTheme}
                              customThemeObj={themeConfig.customObj}
                              onDragStartWidget={(e) => {
                                e.stopPropagation();
                                const payload = { secId: sec.id, wIdx };
                                e.dataTransfer.setData('nexora/move-widget', JSON.stringify(payload));
                                setDraggedExistingWidget(payload);
                              }}
                              onSelect={() => {
                                setSelectedSectionId(sec.id);
                                setSelectedWidgetId(w.id);
                                setEditorRightTab('style');
                              }}
                              lang={lang}
                            />
                          </div>
                        ))}
                      </div>

                      {isDraggingOverThis && (
                        <div className="mt-4 py-3 border-2 border-dashed border-purple-500 rounded-xl bg-purple-100/70 text-purple-800 text-xs font-bold text-center">
                          المان را اینجا رها کنید تا به این بخش اضافه شود
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Bottom Dropzone & Add Section Bar */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSecId('new-section-zone');
                  }}
                  onDragLeave={() => setDragOverSecId(null)}
                  onDrop={handleDropOnNewSectionZone}
                  className={`p-8 text-center border-t-2 border-dashed transition rounded-b-xl ${
                    dragOverSecId === 'new-section-zone'
                      ? 'bg-purple-100 border-purple-600 text-purple-800'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <p className="text-xs text-slate-500 mb-3">
                    المان‌ها را از ستون سمت راست بکشید و اینجا رها کنید، یا بخش جدید بسازید:
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addSection(1);
                    }}
                    className="px-4 py-2 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition"
                  >
                    <Plus className="w-4 h-4" />
                    افزودن بخش جدید در پایین صفحه
                  </button>
                </div>
              </div>
            </div>
          </main>

          {/* Right Panel: Inspector & Item-Level Repeater Manager */}
          <aside className="w-80 bg-white border-s border-slate-200 flex flex-col shrink-0 overflow-y-auto">
            <div className="grid grid-cols-2 border-b border-slate-200">
              <button onClick={() => setEditorRightTab('style')} className={`py-3 text-xs font-bold border-b-2 transition ${editorRightTab === 'style' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500'}`}>
                مدیریت المان و آیتم‌ها
              </button>
              <button onClick={() => setEditorRightTab('settings')} className={`py-3 text-xs font-bold border-b-2 transition relative ${editorRightTab === 'settings' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500'}`}>
                تنظیمات و قالب صفحه
                {(!currentPage.slug || !currentPage.slug.trim()) && <span className="w-2 h-2 rounded-full bg-rose-500 inline-block mr-1.5" />}
              </button>
            </div>

            <div className="p-4 space-y-5">
              {editorRightTab === 'settings' ? (
                <>
                  {/* Short Mandatory Slug Input */}
                  <div className={`p-3 rounded-xl border ${slugErrorHighlight || !currentPage.slug ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50 border-slate-200'}`}>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <span>آدرس کوتاه صفحه (Slug) *</span>
                      <span className="text-[10px] text-slate-500">{(currentPage.slug || '').length}/28</span>
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      maxLength={28}
                      value={currentPage.slug || ''}
                      onChange={(e) => {
                        setSlugErrorHighlight(false);
                        updateCurrentPage((p) => ({ ...p, slug: slugifyShort(e.target.value) }), false);
                      }}
                      placeholder="مثلاً: sale-page"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-mono"
                    />
                    {currentPage.slug && (
                      <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200 text-[11px] text-purple-700 font-mono break-all" dir="ltr">
                        {buildShortShareUrl(currentPage.slug, currentPage.cloudKey)}
                      </div>
                    )}
                  </div>

                  <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-200/80 space-y-2">
                    <label className="block text-xs font-bold text-purple-950">قالب کلی صفحه (WordPress Theme)</label>
                    <select value={currentPage.pageTheme || 'default'} onChange={(e) => updateCurrentPage((p) => ({ ...p, pageTheme: e.target.value }), false)} className="w-full px-3 py-2 border border-purple-200 rounded-lg text-xs font-semibold bg-white">
                      <optgroup label="قالب‌های پیش‌فرض نکسورا">
                        {BUILTIN_WP_THEMES.map((theme) => <option key={theme.id} value={theme.id}>{theme.name}</option>)}
                      </optgroup>
                      {customThemes.length > 0 && (
                        <optgroup label="قالب‌های دستی ساخته‌شده شما">
                          {customThemes.map((theme) => <option key={theme.id} value={theme.id}>★ {theme.name}</option>)}
                        </optgroup>
                      )}
                    </select>
                    <button type="button" onClick={() => setShowQuickThemeModal(true)} className="w-full py-1.5 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5">
                      <Paintbrush className="w-3.5 h-3.5" />
                      افزودن دستی قالب وردپرس جدید
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">عنوان صفحه</label>
                    <input type="text" value={currentPage.title} onChange={(e) => updateCurrentPage((p) => ({ ...p, title: e.target.value }), false)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                  </div>

                  {perms.publishPages && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">وضعیت انتشار</label>
                      <select
                        value={currentPage.status}
                        onChange={(e) => {
                          if (e.target.value === 'published' && (!currentPage.slug || !currentPage.slug.trim())) {
                            setSlugErrorHighlight(true);
                            return showToast('ابتدا کادر آدرس کوتاه (Slug) را پر کنید.');
                          }
                          updateCurrentPage((p) => ({ ...p, status: e.target.value }), false);
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      >
                        <option value="draft">پیش‌نویس (Draft)</option>
                        <option value="published">منتشرشده (Published)</option>
                        <option value="archived">آرشیوشده (Archived)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">سطح دسترسی صفحه</label>
                    <select value={currentPage.visibility} onChange={(e) => updateCurrentPage((p) => ({ ...p, visibility: e.target.value }), false)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                      <option value="public">عمومی (قابل مشاهده برای همه)</option>
                      <option value="password">محافظت‌شده با رمز عبور</option>
                      <option value="private">خصوصی (فقط مدیر)</option>
                    </select>
                  </div>

                  {currentPage.visibility === 'password' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">رمز عبور مشاهده صفحه</label>
                      <input type="text" value={currentPage.password || ''} onChange={(e) => updateCurrentPage((p) => ({ ...p, password: e.target.value }), false)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                    </div>
                  )}
                </>
              ) : selectedWidget ? (
                <>
                  <div className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-2 rounded-lg">
                    المان: {WIDGET_TYPES.find((t) => t.type === selectedWidget.type)?.label.fa || selectedWidget.type}
                  </div>

                  {/* POLL ITEM MANAGER */}
                  {selectedWidget.type === 'poll' && (
                    <div className="space-y-3 bg-purple-50/50 p-3 rounded-xl border border-purple-200">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">سوال نظرسنجی</label>
                        <input type="text" value={selectedWidget.question || ''} onChange={(e) => updateSelectedWidget({ question: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={selectedWidget.buttonText || ''} onChange={(e) => updateSelectedWidget({ buttonText: e.target.value })} placeholder="متن دکمه" className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white" />
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input type="checkbox" checked={selectedWidget.showResults !== false} onChange={(e) => updateSelectedWidget({ showResults: e.target.checked })} />
                          نمایش درصد آرا
                        </label>
                      </div>
                      <div className="pt-2 border-t border-purple-200/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-950">گزینه‌ها ({(selectedWidget.options || []).length}):</span>
                          <button
                            type="button"
                            onClick={() => updateSelectedWidget({ options: [...(selectedWidget.options || []), { id: `opt-${generateId()}`, text: `گزینه ${(selectedWidget.options || []).length + 1}`, votes: 0 }] })}
                            className="px-2.5 py-1 bg-purple-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            افزودن گزینه
                          </button>
                        </div>
                        {(selectedWidget.options || []).map((opt, idx) => (
                          <div key={opt.id || idx} className="bg-white p-2 rounded-lg border border-slate-200 space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={opt.text}
                                onChange={(e) => {
                                  const next = [...selectedWidget.options];
                                  next[idx] = { ...opt, text: e.target.value };
                                  updateSelectedWidget({ options: next });
                                }}
                                className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs"
                              />
                              <button type="button" onClick={() => updateSelectedWidget({ options: selectedWidget.options.filter((_, i) => i !== idx) })} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>رأی اولیه:</span>
                              <input
                                type="number"
                                min="0"
                                value={opt.votes || 0}
                                onChange={(e) => {
                                  const next = [...selectedWidget.options];
                                  next[idx] = { ...opt, votes: Number(e.target.value) };
                                  updateSelectedWidget({ options: next });
                                }}
                                className="w-16 px-2 py-0.5 border border-slate-200 rounded text-xs text-center"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FORM BUILDER MANAGER */}
                  {selectedWidget.type === 'form' && (
                    <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <input type="text" value={selectedWidget.title || ''} onChange={(e) => updateSelectedWidget({ title: e.target.value })} placeholder="عنوان فرم" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white" />
                      <input type="text" value={selectedWidget.buttonText || ''} onChange={(e) => updateSelectedWidget({ buttonText: e.target.value })} placeholder="متن دکمه" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white" />
                      <div className="pt-2 border-t border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">فیلدهای فرم:</span>
                          <button
                            type="button"
                            onClick={() => {
                              const current = (selectedWidget.fields || []).map((f, i) => (typeof f === 'string' ? { id: `sf-${i}`, label: f, type: 'text', required: true } : f));
                              updateSelectedWidget({ fields: [...current, { id: `fl-${generateId()}`, label: 'فیلد جدید', type: 'text', required: false }] });
                            }}
                            className="px-2.5 py-1 bg-purple-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            افزودن فیلد
                          </button>
                        </div>
                        {(selectedWidget.fields || []).map((rawF, idx) => {
                          const f = typeof rawF === 'string' ? { id: `sf-${idx}`, label: rawF, type: 'text', required: true } : rawF;
                          return (
                            <div key={f.id || idx} className="bg-white p-2 rounded-lg border border-slate-200 space-y-1.5">
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={f.label}
                                  onChange={(e) => {
                                    const list = (selectedWidget.fields || []).map((item, i) => (typeof item === 'string' ? { id: `sf-${i}`, label: item, type: 'text', required: true } : item));
                                    list[idx] = { ...f, label: e.target.value };
                                    updateSelectedWidget({ fields: list });
                                  }}
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs"
                                />
                                <button type="button" onClick={() => updateSelectedWidget({ fields: selectedWidget.fields.filter((_, i) => i !== idx) })} className="p-1 text-red-500">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <select
                                  value={f.type || 'text'}
                                  onChange={(e) => {
                                    const list = (selectedWidget.fields || []).map((item, i) => (typeof item === 'string' ? { id: `sf-${i}`, label: item, type: 'text', required: true } : item));
                                    list[idx] = { ...f, type: e.target.value };
                                    updateSelectedWidget({ fields: list });
                                  }}
                                  className="px-2 py-1 border border-slate-200 rounded text-[11px] bg-slate-50"
                                >
                                  <option value="text">متن کوتاه</option>
                                  <option value="tel">موبایل</option>
                                  <option value="email">ایمیل</option>
                                  <option value="number">عدد</option>
                                  <option value="textarea">متن بلند</option>
                                </select>
                                <label className="flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!f.required}
                                    onChange={(e) => {
                                      const list = (selectedWidget.fields || []).map((item, i) => (typeof item === 'string' ? { id: `sf-${i}`, label: item, type: 'text', required: true } : item));
                                      list[idx] = { ...f, required: e.target.checked };
                                      updateSelectedWidget({ fields: list });
                                    }}
                                  />
                                  اجباری
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ACCORDION MANAGER */}
                  {selectedWidget.type === 'accordion' && (
                    <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">آیتم‌های آکاردئون:</span>
                        <button type="button" onClick={() => updateSelectedWidget({ items: [...(selectedWidget.items || []), { id: `ac-${generateId()}`, title: 'پرسش جدید', content: 'پاسخ جدید' }] })} className="px-2.5 py-1 bg-purple-600 text-white rounded-lg text-[11px] font-bold">
                          + افزودن سوال
                        </button>
                      </div>
                      {(selectedWidget.items || []).map((item, idx) => (
                        <div key={item.id || idx} className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const next = [...selectedWidget.items];
                                next[idx] = { ...item, title: e.target.value };
                                updateSelectedWidget({ items: next });
                              }}
                              className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs font-bold"
                            />
                            <button type="button" onClick={() => updateSelectedWidget({ items: selectedWidget.items.filter((_, i) => i !== idx) })} className="p-1 text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={item.content}
                            onChange={(e) => {
                              const next = [...selectedWidget.items];
                              next[idx] = { ...item, content: e.target.value };
                              updateSelectedWidget({ items: next });
                            }}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TABS MANAGER */}
                  {selectedWidget.type === 'tabs' && (
                    <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">تب‌های محتوایی:</span>
                        <button type="button" onClick={() => updateSelectedWidget({ tabs: [...(selectedWidget.tabs || []), { id: `tb-${generateId()}`, title: 'تب جدید', content: 'متن محتوای این تب' }] })} className="px-2.5 py-1 bg-purple-600 text-white rounded-lg text-[11px] font-bold">
                          + افزودن تب
                        </button>
                      </div>
                      {(selectedWidget.tabs || []).map((tab, idx) => (
                        <div key={tab.id || idx} className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={tab.title}
                              onChange={(e) => {
                                const next = [...selectedWidget.tabs];
                                next[idx] = { ...tab, title: e.target.value };
                                updateSelectedWidget({ tabs: next });
                              }}
                              className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs font-bold"
                            />
                            <button type="button" onClick={() => updateSelectedWidget({ tabs: selectedWidget.tabs.filter((_, i) => i !== idx) })} className="p-1 text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={tab.content}
                            onChange={(e) => {
                              const next = [...selectedWidget.tabs];
                              next[idx] = { ...tab, content: e.target.value };
                              updateSelectedWidget({ tabs: next });
                            }}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* PRICING MANAGER */}
                  {selectedWidget.type === 'pricing' && (
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <input type="text" value={selectedWidget.badge || ''} onChange={(e) => updateSelectedWidget({ badge: e.target.value })} placeholder="برچسب" className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white" />
                      <input type="text" value={selectedWidget.title || ''} onChange={(e) => updateSelectedWidget({ title: e.target.value })} placeholder="عنوان پکیج" className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={selectedWidget.price || ''} onChange={(e) => updateSelectedWidget({ price: e.target.value })} placeholder="مبلغ" className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white" />
                        <input type="text" value={selectedWidget.period || ''} onChange={(e) => updateSelectedWidget({ period: e.target.value })} placeholder="واحد" className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white" />
                      </div>
                      <div className="pt-2 border-t border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">ویژگی‌ها:</span>
                          <button type="button" onClick={() => updateSelectedWidget({ features: [...(selectedWidget.features || []), 'ویژگی جدید'] })} className="px-2 py-0.5 bg-purple-600 text-white rounded text-[11px] font-bold">
                            + افزودن
                          </button>
                        </div>
                        {(selectedWidget.features || []).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <input
                              type="text"
                              value={feat}
                              onChange={(e) => {
                                const next = [...selectedWidget.features];
                                next[idx] = e.target.value;
                                updateSelectedWidget({ features: next });
                              }}
                              className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs bg-white"
                            />
                            <button type="button" onClick={() => updateSelectedWidget({ features: selectedWidget.features.filter((_, i) => i !== idx) })} className="p-1 text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedWidget.type === 'testimonial' && (
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">نظرات مشتریان:</span>
                        <button type="button" onClick={() => updateSelectedWidget({ items: [...(selectedWidget.items || []), { id: `tm-${generateId()}`, author: 'مشتری جدید', role: 'خریدار', quote: 'متن نظر' }] })} className="px-2 py-0.5 bg-purple-600 text-white rounded text-[11px] font-bold">+ افزودن</button>
                      </div>
                      {(selectedWidget.items || []).map((item, idx) => (
                        <div key={item.id || idx} className="bg-white p-2 rounded border border-slate-200 space-y-1">
                          <div className="flex gap-1">
                            <input type="text" value={item.author} onChange={(e) => { const n = [...selectedWidget.items]; n[idx] = { ...item, author: e.target.value }; updateSelectedWidget({ items: n }); }} className="flex-1 px-2 py-1 border rounded text-xs font-bold" />
                            <button type="button" onClick={() => updateSelectedWidget({ items: selectedWidget.items.filter((_, i) => i !== idx) })} className="p-1 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                          <textarea rows={2} value={item.quote} onChange={(e) => { const n = [...selectedWidget.items]; n[idx] = { ...item, quote: e.target.value }; updateSelectedWidget({ items: n }); }} className="w-full px-2 py-1 border rounded text-xs" />
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedWidget.type === 'counter' && (
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">آمارها:</span>
                        <button type="button" onClick={() => updateSelectedWidget({ items: [...(selectedWidget.items || []), { id: `cn-${generateId()}`, number: '+۱۰۰', label: 'عنوان' }] })} className="px-2 py-0.5 bg-purple-600 text-white rounded text-[11px] font-bold">+ افزودن</button>
                      </div>
                      {(selectedWidget.items || []).map((c, idx) => (
                        <div key={c.id || idx} className="flex gap-1 bg-white p-1.5 rounded border">
                          <input type="text" value={c.number} onChange={(e) => { const n = [...selectedWidget.items]; n[idx] = { ...c, number: e.target.value }; updateSelectedWidget({ items: n }); }} className="w-16 px-1.5 py-1 border rounded text-xs text-center font-bold" />
                          <input type="text" value={c.label} onChange={(e) => { const n = [...selectedWidget.items]; n[idx] = { ...c, label: e.target.value }; updateSelectedWidget({ items: n }); }} className="flex-1 px-1.5 py-1 border rounded text-xs" />
                          <button type="button" onClick={() => updateSelectedWidget({ items: selectedWidget.items.filter((_, i) => i !== idx) })} className="p-1 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedWidget.type === 'progress' && (
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">نوارها:</span>
                        <button type="button" onClick={() => updateSelectedWidget({ bars: [...(selectedWidget.bars || []), { id: `pr-${generateId()}`, label: 'مهارت', percent: 80 }] })} className="px-2 py-0.5 bg-purple-600 text-white rounded text-[11px] font-bold">+ افزودن</button>
                      </div>
                      {(selectedWidget.bars || []).map((b, idx) => (
                        <div key={b.id || idx} className="flex gap-1 bg-white p-1.5 rounded border">
                          <input type="text" value={b.label} onChange={(e) => { const n = [...selectedWidget.bars]; n[idx] = { ...b, label: e.target.value }; updateSelectedWidget({ bars: n }); }} className="flex-1 px-1.5 py-1 border rounded text-xs" />
                          <input type="number" min="0" max="100" value={b.percent} onChange={(e) => { const n = [...selectedWidget.bars]; n[idx] = { ...b, percent: Number(e.target.value) }; updateSelectedWidget({ bars: n }); }} className="w-14 px-1 py-1 border rounded text-xs text-center" />
                          <button type="button" onClick={() => updateSelectedWidget({ bars: selectedWidget.bars.filter((_, i) => i !== idx) })} className="p-1 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedWidget.type === 'countdown' && (
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <input type="text" value={selectedWidget.title || ''} onChange={(e) => updateSelectedWidget({ title: e.target.value })} className="w-full px-3 py-1.5 border rounded text-xs bg-white" />
                      <input type="datetime-local" dir="ltr" value={selectedWidget.targetDate || ''} onChange={(e) => updateSelectedWidget({ targetDate: e.target.value })} className="w-full px-3 py-1.5 border rounded text-xs bg-white" />
                    </div>
                  )}

                  {selectedWidget.type === 'alert' && (
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <select value={selectedWidget.variant || 'info'} onChange={(e) => updateSelectedWidget({ variant: e.target.value })} className="w-full px-2.5 py-1.5 border rounded text-xs bg-white">
                        <option value="info">اطلاع‌رسانی (آبی)</option>
                        <option value="success">موفقیت (سبز)</option>
                        <option value="warning">هشدار (نارنجی)</option>
                        <option value="danger">خطر (قرمز)</option>
                      </select>
                      <input type="text" value={selectedWidget.title || ''} onChange={(e) => updateSelectedWidget({ title: e.target.value })} className="w-full px-2.5 py-1.5 border rounded text-xs bg-white" />
                      <textarea rows={2} value={selectedWidget.content || ''} onChange={(e) => updateSelectedWidget({ content: e.target.value })} className="w-full px-2.5 py-1.5 border rounded text-xs bg-white" />
                    </div>
                  )}

                  {selectedWidget.type === 'social' && (
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">شبکه‌ها:</span>
                        <button type="button" onClick={() => updateSelectedWidget({ links: [...(selectedWidget.links || []), { id: `sc-${generateId()}`, name: 'شبکه جدید', url: 'https://' }] })} className="px-2 py-0.5 bg-purple-600 text-white rounded text-[11px] font-bold">+ افزودن</button>
                      </div>
                      {(selectedWidget.links || []).map((lk, idx) => (
                        <div key={lk.id || idx} className="bg-white p-1.5 rounded border space-y-1">
                          <div className="flex gap-1">
                            <input type="text" value={lk.name} onChange={(e) => { const n = [...selectedWidget.links]; n[idx] = { ...lk, name: e.target.value }; updateSelectedWidget({ links: n }); }} className="flex-1 px-2 py-1 border rounded text-xs font-bold" />
                            <button type="button" onClick={() => updateSelectedWidget({ links: selectedWidget.links.filter((_, i) => i !== idx) })} className="p-1 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                          <input type="text" dir="ltr" value={lk.url} onChange={(e) => { const n = [...selectedWidget.links]; n[idx] = { ...lk, url: e.target.value }; updateSelectedWidget({ links: n }); }} className="w-full px-2 py-1 border rounded text-xs" />
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedWidget.type === 'map' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">آدرس روی نقشه</label>
                      <input type="text" value={selectedWidget.address || ''} onChange={(e) => updateSelectedWidget({ address: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                    </div>
                  )}

                  {selectedWidget.type === 'gallery' && (
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">تصاویر گالری:</span>
                        <button type="button" onClick={() => setMediaPickerCallback({ type: 'image', fn: (url) => updateSelectedWidget({ images: [...(selectedWidget.images || []), url] }) })} className="px-2 py-0.5 bg-purple-600 text-white rounded text-[11px] font-bold">+ افزودن</button>
                      </div>
                      {(selectedWidget.images || []).map((imgUrl, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-white p-1.5 rounded border">
                          <img src={imgUrl} alt="" className="w-8 h-8 rounded object-cover" />
                          <input type="text" dir="ltr" value={imgUrl} onChange={(e) => { const n = [...selectedWidget.images]; n[idx] = e.target.value; updateSelectedWidget({ images: n }); }} className="flex-1 px-1.5 py-1 border rounded text-[11px]" />
                          <button type="button" onClick={() => updateSelectedWidget({ images: selectedWidget.images.filter((_, i) => i !== idx) })} className="p-1 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedWidget.type === 'table' && (
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">ردیف‌های جدول:</span>
                        <button type="button" onClick={() => updateSelectedWidget({ rows: [...(selectedWidget.rows || []), Array((selectedWidget.headers || ['۱', '۲']).length).fill('مقدار جدید')] })} className="px-2 py-0.5 bg-purple-600 text-white rounded text-[11px] font-bold">+ ردیف</button>
                      </div>
                      <input type="text" value={(selectedWidget.headers || []).join('، ')} onChange={(e) => updateSelectedWidget({ headers: e.target.value.split('،').map((s) => s.trim()) })} className="w-full px-2 py-1 border rounded text-xs bg-white" />
                      {(selectedWidget.rows || []).map((row, rIdx) => (
                        <div key={rIdx} className="flex gap-1">
                          <input type="text" value={row.join('، ')} onChange={(e) => { const n = [...selectedWidget.rows]; n[rIdx] = e.target.value.split('،').map((s) => s.trim()); updateSelectedWidget({ rows: n }); }} className="flex-1 px-2 py-1 border rounded text-xs bg-white" />
                          <button type="button" onClick={() => updateSelectedWidget({ rows: selectedWidget.rows.filter((_, i) => i !== rIdx) })} className="p-1 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedWidget.type === 'list' && (
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">آیتم‌های لیست:</span>
                        <button type="button" onClick={() => updateSelectedWidget({ items: [...(selectedWidget.items || []), 'آیتم جدید'] })} className="px-2 py-0.5 bg-purple-600 text-white rounded text-[11px] font-bold">+ آیتم</button>
                      </div>
                      {(selectedWidget.items || []).map((item, idx) => (
                        <div key={idx} className="flex gap-1">
                          <input type="text" value={item} onChange={(e) => { const n = [...selectedWidget.items]; n[idx] = e.target.value; updateSelectedWidget({ items: n }); }} className="flex-1 px-2 py-1 border rounded text-xs bg-white" />
                          <button type="button" onClick={() => updateSelectedWidget({ items: selectedWidget.items.filter((_, i) => i !== idx) })} className="p-1 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedWidget.type === 'audio' && (
                    <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <input type="text" value={selectedWidget.title || ''} onChange={(e) => updateSelectedWidget({ title: e.target.value })} placeholder="عنوان فایل صوتی" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white" />
                      <label className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-purple-600" />
                        انتخاب فایل صوتی
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => {
                              updateSelectedWidget({ url: reader.result, title: file.name });
                              showToast('فایل صوتی بارگذاری شد');
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      {!isRecording ? (
                        <button type="button" onClick={startVoiceRecording} className="w-full py-2 bg-rose-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5">
                          <Mic className="w-3.5 h-3.5" />
                          شروع ضبط ویس با میکروفون
                        </button>
                      ) : (
                        <button type="button" onClick={stopVoiceRecording} className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 animate-pulse">
                          <StopCircle className="w-3.5 h-3.5 text-rose-400" />
                          توقف و ذخیره ویس
                        </button>
                      )}
                    </div>
                  )}

                  {['heading', 'subheading', 'text', 'html'].includes(selectedWidget.type) && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">متن / محتوا</label>
                      <textarea rows={4} value={selectedWidget.content || ''} onChange={(e) => updateSelectedWidget({ content: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                    </div>
                  )}

                  {selectedWidget.type === 'button' && (
                    <>
                      <input type="text" value={selectedWidget.label || ''} onChange={(e) => updateSelectedWidget({ label: e.target.value })} placeholder="متن دکمه" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                      <input type="text" dir="ltr" value={selectedWidget.url || ''} onChange={(e) => updateSelectedWidget({ url: e.target.value })} placeholder="لینک مقصد" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                    </>
                  )}

                  {['image', 'video'].includes(selectedWidget.type) && (
                    <>
                      <input type="text" dir="ltr" value={selectedWidget.url || ''} onChange={(e) => updateSelectedWidget({ url: e.target.value })} placeholder="آدرس فایل (URL)" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                      <button onClick={() => setMediaPickerCallback({ type: selectedWidget.type, fn: (url) => updateSelectedWidget({ url }) })} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5">
                        <FolderOpen className="w-3.5 h-3.5 text-purple-600" />
                        انتخاب از کتابخانه رسانه
                      </button>
                    </>
                  )}

                  {selectedWidget.type === 'card' && (
                    <>
                      <input type="text" value={selectedWidget.title || ''} onChange={(e) => updateSelectedWidget({ title: e.target.value })} placeholder="عنوان کارت" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                      <textarea rows={3} value={selectedWidget.content || ''} onChange={(e) => updateSelectedWidget({ content: e.target.value })} placeholder="متن کارت" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                    </>
                  )}

                  {/* Typography & Color Controls */}
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">نوع فونت متن</label>
                      <select value={selectedWidget.fontFamily || ''} onChange={(e) => updateSelectedWidget({ fontFamily: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium">
                        {FONT_OPTIONS.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">رنگ متن</label>
                        <input type="color" value={selectedWidget.color || '#0f172a'} onChange={(e) => updateSelectedWidget({ color: e.target.value })} className="w-full h-9 rounded cursor-pointer border border-slate-200" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700">پس‌زمینه</label>
                          <button type="button" onClick={() => updateSelectedWidget({ bgColor: 'transparent' })} className="text-[10px] text-purple-600 hover:underline">شفاف</button>
                        </div>
                        <input type="color" value={selectedWidget.bgColor && selectedWidget.bgColor !== 'transparent' ? selectedWidget.bgColor : '#ffffff'} onChange={(e) => updateSelectedWidget({ bgColor: e.target.value })} className="w-full h-9 rounded cursor-pointer border border-slate-200" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">اندازه فونت ({selectedWidget.fontSize || 16}px)</label>
                    <input type="range" min="12" max="64" value={selectedWidget.fontSize || 16} onChange={(e) => updateSelectedWidget({ fontSize: Number(e.target.value) })} className="w-full" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">فاصله داخلی ({selectedWidget.padding ?? 8}px)</label>
                    <input type="range" min="0" max="64" value={selectedWidget.padding ?? 8} onChange={(e) => updateSelectedWidget({ padding: Number(e.target.value) })} className="w-full" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">گردی گوشه‌ها ({selectedWidget.borderRadius ?? 0}px)</label>
                    <input type="range" min="0" max="40" value={selectedWidget.borderRadius ?? 0} onChange={(e) => updateSelectedWidget({ borderRadius: Number(e.target.value) })} className="w-full" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">چیدمان متن</label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                      {['right', 'center', 'left'].map((al) => (
                        <button key={al} onClick={() => updateSelectedWidget({ align: al })} className={`py-1.5 rounded flex justify-center ${selectedWidget.align === al ? 'bg-white shadow-sm text-purple-600' : 'text-slate-600'}`}>
                          {al === 'right' ? <AlignRight className="w-4 h-4" /> : al === 'center' ? <AlignCenter className="w-4 h-4" /> : <AlignLeft className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : selectedSection ? (
                <>
                  <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-2 rounded-lg">تنظیمات سکشن انتخاب‌شده</div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">تعداد ستون‌ها</label>
                    <select value={selectedSection.columns} onChange={(e) => updateCurrentPage((p) => ({ ...p, sections: p.sections.map((s) => (s.id === selectedSection.id ? { ...s, columns: Number(e.target.value) } : s)) }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                      <option value={1}>۱ ستون</option>
                      <option value={2}>۲ ستون</option>
                      <option value={3}>۳ ستون</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">رنگ پس‌زمینه سکشن</label>
                    <input type="color" value={selectedSection.bgColor || '#ffffff'} onChange={(e) => updateCurrentPage((p) => ({ ...p, sections: p.sections.map((s) => (s.id === selectedSection.id ? { ...s, bgColor: e.target.value } : s)) }))} className="w-full h-10 rounded cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">فاصله بالا و پایین ({selectedSection.paddingY ?? 48}px)</label>
                    <input type="range" min="16" max="120" value={selectedSection.paddingY ?? 48} onChange={(e) => updateCurrentPage((p) => ({ ...p, sections: p.sections.map((s) => (s.id === selectedSection.id ? { ...s, paddingY: Number(e.target.value) } : s)) }))} className="w-full" />
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500 text-center py-8">المان‌های دلخواه را از ستون سمت راست بکشید و روی صفحه رها کنید یا روی هر المان کلیک نمایید.</p>
              )}
            </div>
          </aside>
        </div>

        {/* Quick Modal to Create Custom WordPress Theme */}
        {showQuickThemeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Paintbrush className="w-4 h-4 text-purple-600" />
                  ساخت قالب وردپرس سفارشی و اعمال روی صفحه
                </h3>
                <button onClick={() => setShowQuickThemeModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={(e) => handleCreateCustomTheme(e, true)} className="space-y-3">
                <input type="text" required value={newThemeName} onChange={(e) => setNewThemeName(e.target.value)} placeholder="نام قالب (مثلاً: قالب روز مادر)" className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={newThemeLayout} onChange={(e) => setNewThemeLayout(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white">
                    <option value="boxed">جعبه‌ای کلاسیک (Boxed)</option>
                    <option value="full">تمام‌عرض (Full Width)</option>
                  </select>
                  <input type="color" value={newThemeOuterBg} onChange={(e) => setNewThemeOuterBg(e.target.value)} className="w-full h-9 rounded-lg cursor-pointer" title="رنگ بیرونی" />
                  <input type="color" value={newThemeSurfaceBg} onChange={(e) => setNewThemeSurfaceBg(e.target.value)} className="w-full h-9 rounded-lg cursor-pointer" title="رنگ باکس صفحه" />
                  <input type="color" value={newThemeTextColor} onChange={(e) => setNewThemeTextColor(e.target.value)} className="w-full h-9 rounded-lg cursor-pointer" title="رنگ متن" />
                  <input type="color" value={newThemeAccentColor} onChange={(e) => setNewThemeAccentColor(e.target.value)} className="w-full h-9 rounded-lg cursor-pointer" title="رنگ تاکیدی" />
                  <div className="flex flex-col justify-center gap-1 text-xs">
                    <label className="flex items-center gap-1.5"><input type="checkbox" checked={newThemeTopBar} onChange={(e) => setNewThemeTopBar(e.target.checked)} />نوار رنگی بالا</label>
                    <label className="flex items-center gap-1.5"><input type="checkbox" checked={newThemeOverrideBg} onChange={(e) => setNewThemeOverrideBg(e.target.checked)} />یکدست‌سازی بخش‌ها</label>
                  </div>
                </div>
                <textarea rows={2} dir="ltr" value={newThemeCustomCss} onChange={(e) => setNewThemeCustomCss(e.target.value)} placeholder="کد CSS سفارشی (اختیاری)" className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono" />
                <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm">ساخت قالب و اعمال فوری</button>
              </form>
            </div>
          </div>
        )}

        {/* Media Picker Modal */}
        {mediaPickerCallback && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{mediaPickerCallback.type === 'video' ? 'انتخاب ویدئو از کتابخانه رسانه' : 'انتخاب تصویر از کتابخانه رسانه'}</h3>
                <button onClick={() => setMediaPickerCallback(null)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {media.filter((item) => item.type === mediaPickerCallback.type).map((item) => (
                  <div key={item.id} onClick={() => { mediaPickerCallback.fn(item.url); setMediaPickerCallback(null); }} className="cursor-pointer group rounded-xl overflow-hidden border border-slate-200 hover:border-purple-600">
                    {item.type === 'video' ? (
                      <div className="w-full h-32 bg-slate-900 flex items-center justify-center relative">
                        <video src={item.url} className="w-full h-full object-cover opacity-80" />
                        <Film className="w-8 h-8 text-white absolute" />
                      </div>
                    ) : (
                      <img src={item.url} alt={item.name} className="w-full h-32 object-cover group-hover:scale-105 transition" />
                    )}
                    <div className="p-2 text-xs truncate bg-slate-50 font-medium">{item.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {toast && <div className="fixed bottom-5 left-5 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium z-50">{toast}</div>}
      </div>
    );
  }

  // --- ADMIN DASHBOARD VIEW ---
  const filteredPages = pages.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.slug || '').includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredMedia = media.filter((m) => mediaFilter === 'all' || m.type === mediaFilter);

  return (
    <div dir={dir} style={{ fontFamily: siteSettings.defaultFont }} className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-[#0b0426] text-slate-300 flex flex-col shrink-0">
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <img src={siteSettings.logoUrl || NEXORA_LOGO_DATA_URL} alt="Nexora Logo" className="w-11 h-11 rounded-xl shadow-md object-cover shrink-0" />
          <div className="truncate">
            <div className="font-black text-white text-sm truncate">{siteSettings.siteName}</div>
            <div className="text-[11px] text-purple-300/80">{currentUser.name}</div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <button onClick={() => setActiveTab('pages')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'pages' ? 'bg-purple-600 text-white shadow-sm' : 'hover:bg-white/10'}`}>
            <Layers className="w-4 h-4" />
            مدیریت صفحات
          </button>
          {perms.createPages && (
            <button onClick={() => setActiveTab('templates')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'templates' ? 'bg-purple-600 text-white shadow-sm' : 'hover:bg-white/10'}`}>
              <Sparkles className="w-4 h-4" />
              قالب‌های آماده
            </button>
          )}
          {perms.viewSubmissions && (
            <button onClick={() => setActiveTab('submissions')} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'submissions' ? 'bg-purple-600 text-white shadow-sm' : 'hover:bg-white/10'}`}>
              <span className="flex items-center gap-3"><Inbox className="w-4 h-4" />فرم‌ها و نظرسنجی‌ها</span>
              {submissions.length > 0 && <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500 text-white font-bold">{submissions.length}</span>}
            </button>
          )}
          {perms.manageMedia && (
            <button onClick={() => setActiveTab('media')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'media' ? 'bg-purple-600 text-white shadow-sm' : 'hover:bg-white/10'}`}>
              <FolderOpen className="w-4 h-4" />
              کتابخانه رسانه
            </button>
          )}
          {(perms.manageSettings || perms.manageUsers) && (
            <button onClick={() => setActiveTab('admin')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'admin' ? 'bg-purple-600 text-white shadow-sm' : 'hover:bg-white/10'}`}>
              <Shield className="w-4 h-4" />
              مدیریت، قالب‌ها و دسترسی
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')} className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center justify-center gap-2">
            <Globe className="w-4 h-4" />
            {lang === 'fa' ? 'Switch to English (LTR)' : 'تغییر زبان به فارسی (RTL)'}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('nexora_current_user_v1');
              setCurrentUser(null);
            }}
            className="w-full py-2 px-3 rounded-xl text-xs font-medium text-rose-400 hover:bg-white/10 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            خروج از حساب
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'pages' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">مدیریت صفحات در نکسورا</h1>
                <p className="text-sm text-slate-500 mt-1">صفحات خود را با کشیدن و رها کردن المان‌های المنتور بسازید و لینک کوتاه اختصاصی بگیرید.</p>
              </div>
              {perms.createPages && (
                <button onClick={() => createPageFromTemplate(TEMPLATES[0])} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-sm self-start">
                  <Plus className="w-4 h-4" />
                  ساخت صفحه جدید
                </button>
              )}
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute top-3 right-3.5" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="جستجو بر اساس عنوان یا آدرس صفحه..." className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 text-sm" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white">
                <option value="all">همه وضعیت‌ها</option>
                <option value="published">منتشرشده</option>
                <option value="draft">پیش‌نویس</option>
                <option value="archived">آرشیوشده</option>
              </select>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="p-4 text-start font-bold">عنوان صفحه</th>
                      <th className="p-4 text-start font-bold">لینک کوتاه (Slug)</th>
                      <th className="p-4 text-center font-bold">وضعیت</th>
                      <th className="p-4 text-center font-bold">بازدید</th>
                      <th className="p-4 text-end font-bold">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPages.map((page) => {
                      const themeName = allAvailableThemes.find((t) => t.id === (page.pageTheme || 'default'))?.name || 'استاندارد';
                      return (
                        <tr key={page.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{page.title}</div>
                            <div className="text-xs text-purple-600 mt-0.5 font-medium">قالب: {themeName.split('(')[0]}</div>
                          </td>
                          <td className="p-4">
                            {page.slug && page.slug.trim() ? (
                              <div className="flex items-center gap-2">
                                <code dir="ltr" className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">?page={page.slug}</code>
                                <button onClick={() => copyShortShareLink(page)} className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center gap-1">
                                  <Share2 className="w-3.5 h-3.5" />
                                  کپی لینک کوتاه
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => openEditor(page.id, true)} className="text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                تنظیم آدرس Slug (الزامی)
                              </button>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${page.status === 'published' ? 'bg-emerald-100 text-emerald-700' : page.status === 'archived' ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-700'}`}>
                              {page.status === 'published' ? 'منتشرشده' : page.status === 'archived' ? 'آرشیو' : 'پیش‌نویس'}
                            </span>
                          </td>
                          <td className="p-4 text-center font-semibold text-slate-700">{page.views || 0}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-1.5">
                              {perms.editPages && (
                                <button onClick={() => openEditor(page.id)} className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold flex items-center gap-1">
                                  <Edit3 className="w-3.5 h-3.5" />
                                  ویرایش بصری
                                </button>
                              )}
                              {page.slug && page.slug.trim() && (
                                <button onClick={() => setPublicSlug(page.slug)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg" title="مشاهده صفحه">
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              )}
                              {perms.createPages && (
                                <button onClick={() => duplicatePage(page)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg" title="کپی صفحه">
                                  <Copy className="w-4 h-4" />
                                </button>
                              )}
                              <button onClick={() => exportPageJson(page)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg" title="خروجی JSON">
                                <Download className="w-4 h-4" />
                              </button>
                              {perms.deletePages && (
                                <button onClick={() => deletePage(page.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="حذف صفحه">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && perms.createPages && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900">قالب‌های آماده حرفه‌ای نکسورا</h1>
              <p className="text-sm text-slate-500 mt-1">یک قالب را انتخاب کنید تا بلافاصله در ویرایشگر بصری باز شود.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TEMPLATES.map((tpl) => (
                <div key={tpl.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">{tpl.category}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-3">{tpl.name[lang]}</h3>
                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{tpl.description[lang]}</p>
                  </div>
                  <button onClick={() => createPageFromTemplate(tpl)} className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-purple-600 text-white font-semibold rounded-xl text-sm transition">
                    استفاده از این قالب
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'submissions' && perms.viewSubmissions && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">فرم‌ها و نظرسنجی‌های دریافتی از کاربران</h1>
                <p className="text-sm text-slate-500 mt-1">تمام اطلاعات فرم‌ها و آرای ثبت‌شده در نظرسنجی‌های صفحات منتشرشده در این بخش نمایش داده می‌شود.</p>
              </div>
              {submissions.length > 0 && (
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(submissions, null, 2)], { type: 'application/json' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = 'nexora-submissions.json';
                    a.click();
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 self-start"
                >
                  <Download className="w-4 h-4" />
                  خروجی فایل اطلاعات
                </button>
              )}
            </div>

            {submissions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800">هنوز هیچ فرمی یا رأی نظرسنجی ثبت نشده است</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {submissions.map((sub) => (
                  <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                    <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">صفحه: {sub.pageTitle}</span>
                        <h3 className="font-bold text-slate-900 mt-1.5 text-sm">{sub.formTitle}</h3>
                        <span className="text-[11px] text-slate-400">{sub.submittedAt}</span>
                      </div>
                      <button onClick={() => setSubmissions((prev) => prev.filter((item) => item.id !== sub.id))} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(sub.values || {}).map(([fieldLabel, fieldVal], idx) => (
                        <div key={idx} className="bg-slate-50 px-3 py-2 rounded-xl text-xs flex flex-col gap-0.5">
                          <span className="text-slate-400 font-semibold">{fieldLabel}:</span>
                          <span className="text-slate-900 font-bold text-sm">{fieldVal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'media' && perms.manageMedia && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">کتابخانه فایل‌ها، تصاویر و ویدئوها</h1>
                <p className="text-sm text-slate-500 mt-1">تصاویر و فیلم‌های خود را آپلود کنید تا در طراحی صفحات از آن‌ها استفاده نمایید.</p>
              </div>
              <label className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm cursor-pointer inline-flex items-center gap-2 self-start shadow-sm">
                <Plus className="w-4 h-4" />
                آپلود تصویر یا ویدئو
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.type.startsWith('video/')) {
                      setMedia((prev) => [{ id: `m-${generateId()}`, name: file.name, type: 'video', url: URL.createObjectURL(file), date: new Date().toLocaleDateString('fa-IR') }, ...prev]);
                      showToast('ویدئو با موفقیت به کتابخانه اضافه شد');
                    } else {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setMedia((prev) => [{ id: `m-${generateId()}`, name: file.name, type: 'image', url: reader.result, date: new Date().toLocaleDateString('fa-IR') }, ...prev]);
                        showToast('تصویر با موفقیت به کتابخانه اضافه شد');
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {[{ id: 'all', label: 'همه فایل‌ها' }, { id: 'image', label: 'تصاویر' }, { id: 'video', label: 'فیلم و ویدئوها' }].map((tab) => (
                  <button key={tab.id} onClick={() => setMediaFilter(tab.id)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${mediaFilter === tab.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <select value={mediaUrlType} onChange={(e) => setMediaUrlType(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50">
                  <option value="video">لینک ویدئو (MP4)</option>
                  <option value="image">لینک تصویر</option>
                </select>
                <input type="text" dir="ltr" value={mediaUrlInput} onChange={(e) => setMediaUrlInput(e.target.value)} placeholder="https://example.com/video.mp4" className="flex-1 md:w-64 px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                <button
                  type="button"
                  onClick={() => {
                    if (!mediaUrlInput.trim()) return;
                    setMedia((prev) => [{ id: `m-${generateId()}`, name: mediaUrlInput.split('/').pop() || 'media', type: mediaUrlType, url: mediaUrlInput.trim(), date: new Date().toLocaleDateString('fa-IR') }, ...prev]);
                    setMediaUrlInput('');
                    showToast('لینک رسانه اضافه شد');
                  }}
                  className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  افزودن لینک
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {filteredMedia.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  {item.type === 'video' ? (
                    <div className="w-full h-44 bg-slate-950 relative">
                      <video src={item.url} controls className="w-full h-full object-contain" />
                      <span className="absolute top-2 right-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ویدئو</span>
                    </div>
                  ) : (
                    <img src={item.url} alt={item.name} className="w-full h-44 object-cover" />
                  )}
                  <div className="p-3 flex items-center justify-between">
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-800 truncate">{item.name}</div>
                      <div className="text-[11px] text-slate-400">{item.date}</div>
                    </div>
                    <button onClick={() => setMedia((prev) => prev.filter((m) => m.id !== item.id))} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'admin' && (perms.manageSettings || perms.manageUsers) && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900">پنل مدیریت نکسورا، قالب‌های وردپرس و سطوح دسترسی</h1>
              <p className="text-sm text-slate-500 mt-1">قالب‌های وردپرسی دستی بسازید، مدیران جدید با مجوزهای دقیق تعریف کنید و تنظیمات کلی پلتفرم را تغییر دهید.</p>
            </div>

            {perms.manageSettings && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <Paintbrush className="w-5 h-5 text-purple-600" />
                  <h2 className="font-bold text-lg text-slate-900">ساخت و مدیریت دستی قالب‌های وردپرس (Custom Themes)</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <form onSubmit={(e) => handleCreateCustomTheme(e, false)} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <input type="text" required value={newThemeName} onChange={(e) => setNewThemeName(e.target.value)} placeholder="نام قالب (مثلاً: قالب روز مادر)" className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white" />
                      <input type="text" value={newThemeDesc} onChange={(e) => setNewThemeDesc(e.target.value)} placeholder="توضیح کوتاه قالب" className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white" />
                      <select value={newThemeLayout} onChange={(e) => setNewThemeLayout(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
                        <option value="boxed">جعبه‌ای کلاسیک (Boxed)</option>
                        <option value="full">تمام‌عرض (Full Width)</option>
                      </select>
                      <input type="color" value={newThemeOuterBg} onChange={(e) => setNewThemeOuterBg(e.target.value)} className="w-full h-8 rounded cursor-pointer border border-slate-200" title="رنگ پس‌زمینه بیرونی" />
                      <input type="color" value={newThemeSurfaceBg} onChange={(e) => setNewThemeSurfaceBg(e.target.value)} className="w-full h-8 rounded cursor-pointer border border-slate-200" title="رنگ باکس صفحه" />
                      <div className="flex gap-2">
                        <input type="color" value={newThemeTextColor} onChange={(e) => setNewThemeTextColor(e.target.value)} className="w-1/2 h-8 rounded cursor-pointer border border-slate-200" title="رنگ متن" />
                        <input type="color" value={newThemeAccentColor} onChange={(e) => setNewThemeAccentColor(e.target.value)} className="w-1/2 h-8 rounded cursor-pointer border border-slate-200" title="رنگ تاکیدی" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-700 pt-1">
                      <label className="flex items-center gap-1.5"><input type="checkbox" checked={newThemeTopBar} onChange={(e) => setNewThemeTopBar(e.target.checked)} />نوار رنگی بالا</label>
                      <label className="flex items-center gap-1.5"><input type="checkbox" checked={newThemeOverrideBg} onChange={(e) => setNewThemeOverrideBg(e.target.checked)} />اعمال رنگ قالب روی تمام بخش‌ها</label>
                      <label className="flex items-center gap-1.5"><input type="checkbox" checked={newThemeIsDark} onChange={(e) => setNewThemeIsDark(e.target.checked)} />تم تیره</label>
                    </div>
                    <textarea rows={2} dir="ltr" value={newThemeCustomCss} onChange={(e) => setNewThemeCustomCss(e.target.value)} placeholder="کد CSS سفارشی تم (اختیاری)" className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white" />
                    <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs">افزودن قالب به لیست قالب‌های وردپرس</button>
                  </form>

                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-slate-600">قالب‌های دستی ایجادشده ({customThemes.length}):</div>
                    {customThemes.map((th) => (
                      <div key={th.id} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div style={{ backgroundColor: th.outerBg, borderColor: th.accentColor }} className="w-10 h-10 rounded-xl border-2 flex items-center justify-center shrink-0">
                            <div style={{ backgroundColor: th.surfaceBg }} className="w-5 h-5 rounded" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900">{th.name}</div>
                            <div className="text-xs text-slate-500">{th.desc}</div>
                          </div>
                        </div>
                        <button onClick={() => setCustomThemes((prev) => prev.filter((item) => item.id !== th.id))} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {perms.manageSettings && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 self-start">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <Sliders className="w-5 h-5 text-purple-600" />
                    <h2 className="font-bold text-lg text-slate-900">تنظیمات عمومی پلتفرم نکسورا</h2>
                  </div>
                  <input type="text" value={siteSettings.siteName} onChange={(e) => setSiteSettings((s) => ({ ...s, siteName: e.target.value }))} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
                  <select value={siteSettings.defaultFont} onChange={(e) => setSiteSettings((s) => ({ ...s, defaultFont: e.target.value }))} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white">
                    {FONT_OPTIONS.filter((f) => f.value !== '').map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                  <div className="flex items-center gap-3">
                    <img src={siteSettings.faviconUrl || NEXORA_LOGO_DATA_URL} alt="Favicon" className="w-10 h-10 rounded-xl border object-cover" />
                    <button type="button" onClick={() => setSiteSettings((s) => ({ ...s, faviconUrl: NEXORA_LOGO_DATA_URL, logoUrl: NEXORA_LOGO_DATA_URL }))} className="px-3 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold">
                      بازنشانی به لوگوی پیش‌فرض نکسورا
                    </button>
                  </div>
                  <input type="text" value={siteSettings.footerText} onChange={(e) => setSiteSettings((s) => ({ ...s, footerText: e.target.value }))} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
                  <button type="button" onClick={() => showToast('تنظیمات وب‌سایت ذخیره شد')} className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm">ذخیره تنظیمات</button>
                </div>
              )}

              {perms.manageUsers && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <h2 className="font-bold text-lg text-slate-900">مدیریت مدیران و سطوح دسترسی پیشرفته</h2>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newUserName.trim() || !newUserUsername.trim() || !newUserPass.trim()) return;
                      if (users.some((u) => u.username.toLowerCase() === newUserUsername.trim().toLowerCase())) return showToast('این نام کاربری قبلاً ثبت شده است.');
                      setUsers((prev) => [...prev, { id: `u-${generateId()}`, name: newUserName.trim(), username: newUserUsername.trim(), password: newUserPass, role: newUserRole, permissions: { ...newUserPerms }, createdAt: new Date().toLocaleDateString('fa-IR') }]);
                      setNewUserName('');
                      setNewUserUsername('');
                      setNewUserPass('');
                      showToast('کاربر جدید با مجوزهای انتخابی ایجاد شد');
                    }}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-2.5">
                      <input type="text" required value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="نام و نام خانوادگی" className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white" />
                      <input type="text" required dir="ltr" value={newUserUsername} onChange={(e) => setNewUserUsername(e.target.value)} placeholder="نام کاربری" className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white" />
                      <input type="text" required dir="ltr" value={newUserPass} onChange={(e) => setNewUserPass(e.target.value)} placeholder="رمز عبور" className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white" />
                      <select
                        value={newUserRole}
                        onChange={(e) => {
                          setNewUserRole(e.target.value);
                          setNewUserPerms({ ...ROLE_PRESETS[e.target.value] });
                        }}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-medium"
                      >
                        <option value="admin">نقش: مدیر کل</option>
                        <option value="editor">نقش: ویرایشگر</option>
                        <option value="author">نقش: نویسنده</option>
                        <option value="support">نقش: پشتیبان فرم‌ها</option>
                      </select>
                    </div>
                    <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
                      {PERMISSION_LABELS.map((perm) => (
                        <label key={perm.key} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input type="checkbox" checked={!!newUserPerms[perm.key]} onChange={(e) => setNewUserPerms((prev) => ({ ...prev, [perm.key]: e.target.checked }))} />
                          <span>{perm.label}</span>
                        </label>
                      ))}
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-slate-900 hover:bg-purple-600 text-white font-bold rounded-lg text-xs">ثبت کاربر و ذخیره مجوزها</button>
                  </form>

                  <div className="space-y-3">
                    {users.map((u) => {
                      const uPerms = u.permissions || ROLE_PRESETS[u.role] || ROLE_PRESETS.author;
                      const activeCount = Object.values(uPerms).filter(Boolean).length;
                      const isExpanded = expandedUserPermId === u.id;
                      return (
                        <div key={u.id} className="p-3.5 rounded-xl border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                <span>{u.name}</span>
                                <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold">{activeCount} از ۸ مجوز</span>
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">نام کاربری: <code>{u.username}</code> | رمز: <code>{u.password}</code></div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {u.username !== 'admin' && (
                                <button type="button" onClick={() => setExpandedUserPermId(isExpanded ? null : u.id)} className="px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1">
                                  <CheckSquare className="w-3.5 h-3.5 text-purple-600" />
                                  مجوزها
                                </button>
                              )}
                              {u.username !== 'admin' && (
                                <button onClick={() => setUsers((prev) => prev.filter((item) => item.id !== u.id))} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                              )}
                            </div>
                          </div>
                          {isExpanded && u.username !== 'admin' && (
                            <div className="pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg">
                              {PERMISSION_LABELS.map((perm) => (
                                <label key={perm.key} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!uPerms[perm.key]}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      setUsers((prev) => prev.map((item) => (item.id === u.id ? { ...item, permissions: { ...(item.permissions || ROLE_PRESETS[item.role]), [perm.key]: checked } } : item)));
                                    }}
                                  />
                                  <span>{perm.label}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {toast && <div className="fixed bottom-5 left-5 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium z-50">{toast}</div>}
    </div>
  );
}
