import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Trash2, Copy, Eye, Edit3, Globe, Lock, Search, Layout, Type,
  Image as ImageIcon, Video, Square, Columns, MoveUp, MoveDown, Undo2, Redo2,
  Monitor, Tablet, Smartphone, Settings, FolderOpen, Download, Check,
  ExternalLink, LogOut, LogIn, Sparkles, Layers, Code, List, Table as TableIcon,
  Minus, FileText, Share2, KeyRound, ArrowRight, Save, X, CheckCircle2,
  AlertCircle, Palette, AlignLeft, AlignCenter, AlignRight, GripVertical
} from 'lucide-react';

// --- Initial Templates (9 Professional Templates) ---
const TEMPLATES = [
  {
    id: 'tpl-blank',
    name: { fa: 'صفحه خالی', en: 'Blank Page' },
    category: 'عمومی',
    description: { fa: 'شروع طراحی از صفر بدون المان از پیش تعیین‌شده', en: 'Start designing from scratch' },
    sections: [
      {
        id: 'sec-1',
        columns: 1,
        bgColor: '#ffffff',
        paddingY: 48,
        widgets: [
          {
            id: 'w-1',
            type: 'heading',
            content: 'عنوان صفحه جدید شما',
            align: 'center',
            color: '#0f172a',
            fontSize: 36,
            bgColor: 'transparent',
            padding: 12,
            borderRadius: 0
          },
          {
            id: 'w-2',
            type: 'text',
            content: 'این متن نمونه است. از پنل سمت راست می‌توانید المان‌های جدید اضافه کنید یا روی هر بخش کلیک کرده و آن را ویرایش نمایید.',
            align: 'center',
            color: '#475569',
            fontSize: 16,
            bgColor: 'transparent',
            padding: 8,
            borderRadius: 0
          }
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
          {
            id: 'wp-1',
            type: 'heading',
            content: 'نسل جدید هدفون‌های بی‌سیم استودیویی',
            align: 'right',
            color: '#0f172a',
            fontSize: 38,
            bgColor: 'transparent',
            padding: 12,
            borderRadius: 0
          },
          {
            id: 'wp-2',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
            caption: 'طراحی ارگونومیک با حذف نویز هوشمند',
            borderRadius: 16,
            padding: 8,
            bgColor: 'transparent'
          },
          {
            id: 'wp-3',
            type: 'text',
            content: 'با ۴۰ ساعت شارژدهی مداوم، صدای شفاف Hi-Res و طراحی فوق‌سبک، تجربه‌ای بی‌نظیر از موسیقی و مکالمه داشته باشید.',
            align: 'right',
            color: '#334155',
            fontSize: 17,
            bgColor: 'transparent',
            padding: 12,
            borderRadius: 0
          },
          {
            id: 'wp-4',
            type: 'button',
            label: 'سفارش آنلاین با ارسال رایگان',
            url: '#order',
            align: 'right',
            color: '#ffffff',
            bgColor: '#2563eb',
            fontSize: 16,
            padding: 14,
            borderRadius: 10
          }
        ]
      },
      {
        id: 'sec-p2',
        columns: 3,
        bgColor: '#ffffff',
        paddingY: 48,
        widgets: [
          {
            id: 'wp-5',
            type: 'card',
            title: 'حذف نویز فعال (ANC)',
            content: 'حذف تا ۹۸٪ صداهای مزاحم محیط در مترو، هواپیما و محیط کار.',
            imageUrl: '',
            bgColor: '#f1f5f9',
            color: '#0f172a',
            padding: 24,
            borderRadius: 16
          },
          {
            id: 'wp-6',
            type: 'card',
            title: 'باتری ۴۰ ساعته',
            content: 'تنها با ۱۰ دقیقه شارژ سریع، ۵ ساعت پخش مداوم موسیقی دریافت کنید.',
            imageUrl: '',
            bgColor: '#f1f5f9',
            color: '#0f172a',
            padding: 24,
            borderRadius: 16
          },
          {
            id: 'wp-7',
            type: 'card',
            title: 'گارانتی ۱۸ ماهه تعویض',
            content: 'ضمانت اصالت کالا و پشتیبانی ۲۴ ساعته در سراسر کشور.',
            imageUrl: '',
            bgColor: '#f1f5f9',
            color: '#0f172a',
            padding: 24,
            borderRadius: 16
          }
        ]
      }
    ]
  },
  {
    id: 'tpl-landing',
    name: { fa: 'صفحه فرود (Landing Page)', en: 'Landing Page' },
    category: 'بازاریابی',
    description: { fa: 'صفحه فرود با نرخ تبدیل بالا برای کمپین‌های تبلیغاتی', en: 'High-converting campaign landing page' },
    sections: [
      {
        id: 'sec-l1',
        columns: 1,
        bgColor: '#0f172a',
        paddingY: 72,
        widgets: [
          {
            id: 'wl-1',
            type: 'heading',
            content: 'کسب‌وکار خود را در ۳۰ روز متحول کنید',
            align: 'center',
            color: '#ffffff',
            fontSize: 42,
            bgColor: 'transparent',
            padding: 12,
            borderRadius: 0
          },
          {
            id: 'wl-2',
            type: 'text',
            content: 'راهکار جامع اتوماسیون فروش و مدیریت مشتریان برای تیم‌های مدرن و استارتاپ‌های رو به رشد.',
            align: 'center',
            color: '#cbd5e1',
            fontSize: 18,
            bgColor: 'transparent',
            padding: 12,
            borderRadius: 0
          },
          {
            id: 'wl-3',
            type: 'button',
            label: 'شروع رایگان ۱۴ روزه',
            url: '#signup',
            align: 'center',
            color: '#0f172a',
            bgColor: '#38bdf8',
            fontSize: 17,
            padding: 16,
            borderRadius: 12
          }
        ]
      },
      {
        id: 'sec-l2',
        columns: 1,
        bgColor: '#ffffff',
        paddingY: 56,
        widgets: [
          {
            id: 'wl-4',
            type: 'form',
            title: 'دریافت مشاوره رایگان و دمو',
            buttonText: 'ثبت درخواست مشاوره',
            fields: ['نام و نام خانوادگی', 'شماره تماس', 'ایمیل سازمانی'],
            bgColor: '#f8fafc',
            color: '#0f172a',
            padding: 32,
            borderRadius: 16
          }
        ]
      }
    ]
  },
  {
    id: 'tpl-services',
    name: { fa: 'معرفی خدمات', en: 'Services Page' },
    category: 'شرکتی',
    description: { fa: 'نمایش لیست خدمات تخصصی و تعرفه‌ها', en: 'Display your services and packages' },
    sections: [
      {
        id: 'sec-s1',
        columns: 1,
        bgColor: '#eff6ff',
        paddingY: 56,
        widgets: [
          {
            id: 'ws-1',
            type: 'heading',
            content: 'خدمات تخصصی طراحی و توسعه دیجیتال',
            align: 'center',
            color: '#1e3a8a',
            fontSize: 36,
            bgColor: 'transparent',
            padding: 8,
            borderRadius: 0
          },
          {
            id: 'ws-2',
            type: 'subheading',
            content: 'از ایده تا اجرا در کنار شما هستیم',
            align: 'center',
            color: '#3b82f6',
            fontSize: 20,
            bgColor: 'transparent',
            padding: 8,
            borderRadius: 0
          }
        ]
      },
      {
        id: 'sec-s2',
        columns: 2,
        bgColor: '#ffffff',
        paddingY: 48,
        widgets: [
          {
            id: 'ws-3',
            type: 'card',
            title: 'طراحی وب‌سایت و فروشگاه اینترنتی',
            content: 'طراحی اختصاصی، سرعت بالا و کاملاً واکنش‌گرا برای موبایل و دسکتاپ.',
            imageUrl: '',
            bgColor: '#f8fafc',
            color: '#0f172a',
            padding: 24,
            borderRadius: 14
          },
          {
            id: 'ws-4',
            type: 'card',
            title: 'سئو و بهینه‌سازی موتورهای جستجو',
            content: 'افزایش رتبه در گوگل و جذب مشتریان هدفمند به صورت پایدار.',
            imageUrl: '',
            bgColor: '#f8fafc',
            color: '#0f172a',
            padding: 24,
            borderRadius: 14
          }
        ]
      }
    ]
  },
  {
    id: 'tpl-company',
    name: { fa: 'معرفی شرکت', en: 'Company Profile' },
    category: 'شرکتی',
    description: { fa: 'صفحه درباره ما، ماموریت و آمار شرکت', en: 'About us, mission and company stats' },
    sections: [
      {
        id: 'sec-c1',
        columns: 1,
        bgColor: '#ffffff',
        paddingY: 56,
        widgets: [
          {
            id: 'wc-1',
            type: 'heading',
            content: 'درباره گروه فناوری نوآوران',
            align: 'center',
            color: '#0f172a',
            fontSize: 36,
            bgColor: 'transparent',
            padding: 12,
            borderRadius: 0
          },
          {
            id: 'wc-2',
            type: 'text',
            content: 'ما از سال ۱۳۹۵ با هدف ساده‌سازی فرآیندهای دیجیتال برای کسب‌وکارهای ایرانی فعالیت خود را آغاز کردیم و امروز بیش از ۵۰۰ سازمان از راهکارهای ما استفاده می‌کنند.',
            align: 'center',
            color: '#475569',
            fontSize: 17,
            bgColor: 'transparent',
            padding: 12,
            borderRadius: 0
          },
          {
            id: 'wc-3',
            type: 'table',
            headers: ['شاخص عملکرد', 'آمار ثبت‌شده'],
            rows: [
              ['پروژه‌های موفق', '+۵۲۰ پروژه'],
              ['رضایت مشتریان', '۹۸.۴٪'],
              ['اعضای تیم متخصص', '۴۵ نفر']
            ],
            bgColor: '#f8fafc',
            color: '#0f172a',
            padding: 16,
            borderRadius: 12
          }
        ]
      }
    ]
  },
  {
    id: 'tpl-personal',
    name: { fa: 'صفحه شخصی و رزومه', en: 'Personal Portfolio' },
    category: 'شخصی',
    description: { fa: 'معرفی فردی، مهارت‌ها و راه‌های ارتباطی', en: 'Personal bio, skills and contact' },
    sections: [
      {
        id: 'sec-per1',
        columns: 1,
        bgColor: '#fafafa',
        paddingY: 64,
        widgets: [
          {
            id: 'wper-1',
            type: 'heading',
            content: 'سلام، من سارا محمدی هستم',
            align: 'center',
            color: '#18181b',
            fontSize: 38,
            bgColor: 'transparent',
            padding: 10,
            borderRadius: 0
          },
          {
            id: 'wper-2',
            type: 'subheading',
            content: 'طراح تجربه کاربری (UI/UX) و مشاور برندینگ دیجیتال',
            align: 'center',
            color: '#6366f1',
            fontSize: 20,
            bgColor: 'transparent',
            padding: 8,
            borderRadius: 0
          },
          {
            id: 'wper-3',
            type: 'list',
            items: [
              'بیش از ۷ سال سابقه طراحی محصولات دیجیتال',
              'همکاری با استارتاپ‌های برتر حوزه فین‌تک و آموزش',
              'مدرس دوره‌های تخصصی طراحی سیستم‌های دیزاین'
            ],
            bgColor: '#ffffff',
            color: '#27272a',
            padding: 24,
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
    description: { fa: 'ثبت‌نام وبینار، کارگاه یا دوره آموزشی', en: 'Webinar or workshop registration' },
    sections: [
      {
        id: 'sec-r1',
        columns: 1,
        bgColor: '#f0fdf4',
        paddingY: 56,
        widgets: [
          {
            id: 'wr-1',
            type: 'heading',
            content: 'وبینار رایگان: رشد فروش با هوش مصنوعی',
            align: 'center',
            color: '#14532d',
            fontSize: 34,
            bgColor: 'transparent',
            padding: 10,
            borderRadius: 0
          },
          {
            id: 'wr-2',
            type: 'form',
            title: 'فرم رزرو صندلی رایگان',
            buttonText: 'تکمیل ثبت‌نام',
            fields: ['نام و نام خانوادگی', 'شماره موبایل', 'نام کسب‌وکار'],
            bgColor: '#ffffff',
            color: '#0f172a',
            padding: 28,
            borderRadius: 16
          }
        ]
      }
    ]
  },
  {
    id: 'tpl-announcement',
    name: { fa: 'صفحه اطلاع‌رسانی', en: 'Announcement Page' },
    category: 'عمومی',
    description: { fa: 'اطلاعیه مهم، به‌روزرسانی سیستم یا رویداد ویژه', en: 'Important updates or announcements' },
    sections: [
      {
        id: 'sec-a1',
        columns: 1,
        bgColor: '#fffbeb',
        paddingY: 64,
        widgets: [
          {
            id: 'wa-1',
            type: 'heading',
            content: 'اطلاعیه به‌روزرسانی نسخه جدید پلتفرم',
            align: 'center',
            color: '#78350f',
            fontSize: 34,
            bgColor: 'transparent',
            padding: 12,
            borderRadius: 0
          },
          {
            id: 'wa-2',
            type: 'text',
            content: 'کاربران گرامی، زیرساخت سرورهای ما به نسل جدید ارتقا یافت و سرعت بارگذاری صفحات تا ۳ برابر افزایش پیدا کرد.',
            align: 'center',
            color: '#92400e',
            fontSize: 17,
            bgColor: 'transparent',
            padding: 12,
            borderRadius: 0
          }
        ]
      }
    ]
  },
  {
    id: 'tpl-article',
    name: { fa: 'صفحه مقاله و محتوا', en: 'Blog Article' },
    category: 'محتوایی',
    description: { fa: 'قالب خوانا برای انتشار مقالات و راهنماهای جامع', en: 'Clean layout for articles and guides' },
    sections: [
      {
        id: 'sec-art1',
        columns: 1,
        bgColor: '#ffffff',
        paddingY: 48,
        widgets: [
          {
            id: 'wart-1',
            type: 'heading',
            content: 'راهنمای جامع طراحی صفحات فرود پربازده در سال ۱۴۰۴',
            align: 'right',
            color: '#0f172a',
            fontSize: 34,
            bgColor: 'transparent',
            padding: 12,
            borderRadius: 0
          },
          {
            id: 'wart-2',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
            caption: 'تحلیل رفتار کاربران در صفحات فرود',
            borderRadius: 14,
            padding: 8,
            bgColor: 'transparent'
          },
          {
            id: 'wart-3',
            type: 'text',
            content: 'یک صفحه فرود موفق باید در کمتر از ۳ ثانیه پیام اصلی شما را به بازدیدکننده منتقل کند. استفاده از تیترهای شفاف، دعوت به اقدام (CTA) مشخص و حذف حواس‌پرتی‌ها کلید اصلی افزایش نرخ تبدیل است.',
            align: 'right',
            color: '#334155',
            fontSize: 17,
            bgColor: 'transparent',
            padding: 12,
            borderRadius: 0
          }
        ]
      }
    ]
  },
  {
    id: 'tpl-thanks',
    name: { fa: 'صفحه تشکر', en: 'Thank You Page' },
    category: 'بازاریابی',
    description: { fa: 'نمایش پیام تایید پس از ثبت فرم یا خرید', en: 'Confirmation page after form submission' },
    sections: [
      {
        id: 'sec-th1',
        columns: 1,
        bgColor: '#f8fafc',
        paddingY: 80,
        widgets: [
          {
            id: 'wth-1',
            type: 'heading',
            content: 'سپاسگزاریم! درخواست شما با موفقیت ثبت شد',
            align: 'center',
            color: '#059669',
            fontSize: 36,
            bgColor: 'transparent',
            padding: 12,
            borderRadius: 0
          },
          {
            id: 'wth-2',
            type: 'text',
            content: 'کارشناسان ما اطلاعات شما را بررسی کرده و حداکثر تا ۲ ساعت آینده با شما تماس خواهند گرفت.',
            align: 'center',
            color: '#475569',
            fontSize: 17,
            bgColor: 'transparent',
            padding: 12,
            borderRadius: 0
          },
          {
            id: 'wth-3',
            type: 'button',
            label: 'بازگشت به صفحه اصلی',
            url: '#',
            align: 'center',
            color: '#ffffff',
            bgColor: '#0f172a',
            fontSize: 15,
            padding: 14,
            borderRadius: 10
          }
        ]
      }
    ]
  }
];

const INITIAL_MEDIA = [
  {
    id: 'm-1',
    name: 'product-headphones.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    date: '۱۴۰۴/۰۱/۱۰'
  },
  {
    id: 'm-2',
    name: 'analytics-dashboard.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    date: '۱۴۰۴/۰۱/۱۲'
  },
  {
    id: 'm-3',
    name: 'workspace-modern.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80',
    date: '۱۴۰۴/۰۱/۱۵'
  }
];

const WIDGET_TYPES = [
  { type: 'heading', label: { fa: 'عنوان اصلی', en: 'Heading' }, icon: Type },
  { type: 'subheading', label: { fa: 'زیرعنوان', en: 'Subheading' }, icon: Type },
  { type: 'text', label: { fa: 'متن پیشرفته', en: 'Rich Text' }, icon: FileText },
  { type: 'image', label: { fa: 'تصویر', en: 'Image' }, icon: ImageIcon },
  { type: 'video', label: { fa: 'ویدئو', en: 'Video' }, icon: Video },
  { type: 'button', label: { fa: 'دکمه و لینک', en: 'Button' }, icon: Square },
  { type: 'card', label: { fa: 'کارت محتوایی', en: 'Content Card' }, icon: Layout },
  { type: 'gallery', label: { fa: 'گالری تصاویر', en: 'Image Gallery' }, icon: Columns },
  { type: 'table', label: { fa: 'جدول', en: 'Table' }, icon: TableIcon },
  { type: 'list', label: { fa: 'لیست', en: 'List' }, icon: List },
  { type: 'form', label: { fa: 'فرم تماس', en: 'Form' }, icon: CheckCircle2 },
  { type: 'divider', label: { fa: 'خط جداکننده', en: 'Divider' }, icon: Minus },
  { type: 'spacer', label: { fa: 'فضای خالی', en: 'Spacer' }, icon: MoveDown },
  { type: 'html', label: { fa: 'کد HTML/CSS', en: 'Custom HTML' }, icon: Code }
];

const generateId = () => Math.random().toString(36).substring(2, 10);

const slugify = (text) => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]+/g, '')
    .replace(/--+/g, '-') || `page-${generateId()}`;
};

// --- Standalone Widget Renderer (Used in Canvas, Preview, and Public View) ---
function WidgetRenderer({ widget, isEditing, isSelected, onSelect, lang }) {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const wrapperStyle = {
    backgroundColor: widget.bgColor || 'transparent',
    padding: `${widget.padding ?? 8}px`,
    borderRadius: `${widget.borderRadius ?? 0}px`,
    width: widget.width || '100%',
    minHeight: widget.height ? `${widget.height}px` : 'auto',
    textAlign: widget.align || (lang === 'fa' ? 'right' : 'left')
  };

  const renderContent = () => {
    switch (widget.type) {
      case 'heading':
        return (
          <h1
            style={{
              color: widget.color || '#0f172a',
              fontSize: `${widget.fontSize || 32}px`,
              fontWeight: 800,
              lineHeight: 1.3
            }}
          >
            {widget.content}
          </h1>
        );
      case 'subheading':
        return (
          <h2
            style={{
              color: widget.color || '#334155',
              fontSize: `${widget.fontSize || 20}px`,
              fontWeight: 600,
              lineHeight: 1.4
            }}
          >
            {widget.content}
          </h2>
        );
      case 'text':
        return (
          <div
            style={{
              color: widget.color || '#475569',
              fontSize: `${widget.fontSize || 16}px`,
              lineHeight: 1.8,
              whiteSpace: 'pre-line'
            }}
          >
            {widget.content}
          </div>
        );
      case 'image':
        return (
          <figure className="w-full">
            <img
              src={widget.url || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80'}
              alt={widget.caption || 'image'}
              style={{ borderRadius: `${widget.borderRadius ?? 12}px` }}
              className="w-full h-auto object-cover max-h-[520px]"
            />
            {widget.caption && (
              <figcaption className="mt-2 text-xs text-slate-500 text-center">
                {widget.caption}
              </figcaption>
            )}
          </figure>
        );
      case 'video':
        return (
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-900">
            {widget.url ? (
              widget.url.includes('youtube.com') || widget.url.includes('youtu.be') || widget.url.includes('aparat.com') ? (
                <iframe
                  src={widget.url}
                  className="w-full h-full border-0"
                  allowFullScreen
                  title="video-embed"
                />
              ) : (
                <video src={widget.url} controls className="w-full h-full object-cover" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                {lang === 'fa' ? 'آدرس ویدئو یا کد Embed را در تنظیمات وارد کنید' : 'Enter Video URL in settings'}
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
              style={{
                backgroundColor: widget.bgColor || '#2563eb',
                color: widget.color || '#ffffff',
                fontSize: `${widget.fontSize || 16}px`,
                padding: `${widget.padding || 12}px ${(widget.padding || 12) * 2}px`,
                borderRadius: `${widget.borderRadius ?? 10}px`
              }}
              className="inline-block font-semibold shadow-sm hover:opacity-90 transition cursor-pointer"
            >
              {widget.label || (lang === 'fa' ? 'کلیک کنید' : 'Click Here')}
            </a>
          </div>
        );
      case 'card':
        return (
          <div
            style={{
              backgroundColor: widget.bgColor || '#f8fafc',
              color: widget.color || '#0f172a',
              padding: `${widget.padding || 24}px`,
              borderRadius: `${widget.borderRadius ?? 16}px`
            }}
            className="border border-slate-200/80 shadow-sm h-full"
          >
            {widget.imageUrl && (
              <img
                src={widget.imageUrl}
                alt={widget.title}
                className="w-full h-44 object-cover rounded-xl mb-4"
              />
            )}
            <h3 className="text-lg font-bold mb-2">{widget.title || 'عنوان کارت'}</h3>
            <p className="text-sm opacity-85 leading-relaxed">{widget.content || 'توضیحات کارت محتوایی'}</p>
          </div>
        );
      case 'gallery':
        const images = widget.images || [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80'
        ];
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`gallery-${i}`}
                className="w-full h-48 object-cover rounded-xl shadow-sm"
              />
            ))}
          </div>
        );
      case 'table':
        const headers = widget.headers || ['ستون اول', 'ستون دوم'];
        const rows = widget.rows || [
          ['مقدار ۱', 'مقدار ۲'],
          ['مقدار ۳', 'مقدار ۴']
        ];
        return (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="p-3 font-bold border-b border-slate-200">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-slate-100 last:border-0">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'list':
        const items = widget.items || ['آیتم اول لیست', 'آیتم دوم لیست', 'آیتم سوم لیست'];
        return (
          <ul className="space-y-2.5">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2.5 text-sm md:text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span style={{ color: widget.color || '#1e293b' }}>{item}</span>
              </li>
            ))}
          </ul>
        );
      case 'form':
        const fields = widget.fields || ['نام و نام خانوادگی', 'ایمیل یا شماره تماس', 'پیام شما'];
        return (
          <div
            style={{
              backgroundColor: widget.bgColor || '#f8fafc',
              padding: `${widget.padding || 28}px`,
              borderRadius: `${widget.borderRadius ?? 16}px`
            }}
            className="max-w-xl mx-auto border border-slate-200 shadow-sm"
          >
            <h3 className="text-xl font-bold mb-4 text-slate-900">
              {widget.title || (lang === 'fa' ? 'فرم ارتباط با ما' : 'Contact Form')}
            </h3>
            {formSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                {lang === 'fa' ? 'اطلاعات شما با موفقیت ثبت شد!' : 'Submitted successfully!'}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!isEditing) setFormSubmitted(true);
                }}
                className="space-y-3"
              >
                {fields.map((f, i) => (
                  <div key={i}>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{f}</label>
                    <input
                      type="text"
                      required
                      placeholder={f}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition"
                >
                  {widget.buttonText || (lang === 'fa' ? 'ارسال اطلاعات' : 'Submit')}
                </button>
              </form>
            )}
          </div>
        );
      case 'divider':
        return <hr style={{ borderColor: widget.color || '#cbd5e1' }} className="my-2 border-t-2" />;
      case 'spacer':
        return <div style={{ height: `${widget.height || 40}px` }} />;
      case 'html':
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: widget.content || '<div class="p-4 bg-slate-100 rounded-lg text-center">کد HTML سفارشی</div>'
            }}
          />
        );
      default:
        return null;
    }
  };

  if (!isEditing) {
    return <div style={wrapperStyle}>{renderContent()}</div>;
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={wrapperStyle}
      className={`relative group cursor-pointer transition-all ${
        isSelected
          ? 'ring-2 ring-blue-600 ring-offset-2'
          : 'hover:ring-1 hover:ring-blue-400'
      }`}
    >
      {renderContent()}
    </div>
  );
}

// --- Public Standalone Page Viewer ---
function PublicPageView({ page, onIncrementView, onBackToAdmin }) {
  const [passwordInput, setPasswordInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const countedRef = useRef(false);

  useEffect(() => {
    if (page && page.metaTitle) {
      document.title = page.metaTitle;
    } else if (page) {
      document.title = page.title;
    }
    if (page && !countedRef.current) {
      countedRef.current = true;
      onIncrementView(page.id);
    }
  }, [page]);

  if (!page || page.status !== 'published' || page.visibility === 'private') {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">این صفحه در دسترس نیست</h1>
        <p className="text-slate-600 max-w-md mb-6">
          ممکن است لینک اشتباه باشد، صفحه هنوز منتشر نشده باشد یا دسترسی به آن خصوصی شده باشد.
        </p>
        <button
          onClick={onBackToAdmin}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800"
        >
          ورود به پنل مدیریت
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
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="رمز عبور صفحه..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
            >
              مشاهده صفحه
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div dir={page.direction || 'rtl'} className="min-h-screen bg-white">
      {page.sections.map((sec) => (
        <section
          key={sec.id}
          style={{
            backgroundColor: sec.bgColor || '#ffffff',
            paddingTop: `${sec.paddingY ?? 48}px`,
            paddingBottom: `${sec.paddingY ?? 48}px`
          }}
          className="w-full px-4 md:px-8"
        >
          <div
            className={`max-w-6xl mx-auto grid gap-6 ${
              sec.columns === 3
                ? 'grid-cols-1 md:grid-cols-3'
                : sec.columns === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1'
            }`}
          >
            {sec.widgets.map((w) => (
              <WidgetRenderer key={w.id} widget={w} isEditing={false} lang={page.direction === 'ltr' ? 'en' : 'fa'} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// --- Main Application ---
export default function App() {
  const [lang, setLang] = useState('fa');
  const dir = lang === 'fa' ? 'rtl' : 'ltr';

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('pb_auth') === 'true';
  });
  const [loginPass, setLoginPass] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Pages & Media State
  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem('pb_pages_v1');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'page-demo-1',
        title: 'معرفی هدفون استودیویی پرو',
        slug: 'studio-headphones',
        category: 'فروشگاهی',
        status: 'published',
        visibility: 'public',
        password: '',
        views: 124,
        updatedAt: '۱۴۰۴/۰۱/۲۰',
        metaTitle: 'خرید هدفون استودیویی پرو | ارسال رایگان',
        metaDescription: 'بهترین کیفیت صدا با حذف نویز هوشمند',
        direction: 'rtl',
        sections: TEMPLATES[1].sections
      }
    ];
  });

  const [media, setMedia] = useState(() => {
    const saved = localStorage.getItem('pb_media_v1');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA;
  });

  useEffect(() => {
    localStorage.setItem('pb_pages_v1', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem('pb_media_v1', JSON.stringify(media));
  }, [media]);

  // Routing / Active View
  const [publicSlug, setPublicSlug] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('page');
  });

  const [activeTab, setActiveTab] = useState('pages'); // 'pages' | 'templates' | 'media' | 'editor'
  const [editingPageId, setEditingPageId] = useState(null);

  // Dashboard Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState('');

  // Editor State
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedWidgetId, setSelectedWidgetId] = useState(null);
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [editorRightTab, setEditorRightTab] = useState('style'); // 'style' | 'settings'
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [mediaPickerCallback, setMediaPickerCallback] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Public Route Handler
  if (publicSlug) {
    const targetPage = pages.find((p) => p.slug === publicSlug);
    return (
      <PublicPageView
        page={targetPage}
        onIncrementView={(id) => {
          setPages((prev) => prev.map((p) => (p.id === id ? { ...p, views: (p.views || 0) + 1 } : p)));
        }}
        onBackToAdmin={() => {
          window.history.pushState({}, '', window.location.pathname);
          setPublicSlug(null);
        }}
      />
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
              <Layout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">پلتفرم صفحه‌ساز حرفه‌ای</h1>
              <p className="text-xs text-slate-500">ورود به پنل مدیریت و طراحی بصری</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (loginPass === 'admin123') {
                localStorage.setItem('pb_auth', 'true');
                setIsAuthenticated(true);
              } else {
                setLoginError('رمز عبور اشتباه است (رمز پیش‌فرض: admin123)');
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">نام کاربری مدیر</label>
              <input
                type="text"
                defaultValue="admin"
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رمز عبور <span className="text-blue-600 font-normal">(پیش‌فرض: admin123)</span>
              </label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            {loginError && <p className="text-xs text-red-600">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition"
            >
              <LogIn className="w-4 h-4" />
              ورود به داشبورد
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Helper Functions for Pages
  const createPageFromTemplate = (tpl) => {
    const newId = `page-${generateId()}`;
    const title = tpl.name[lang];
    const newPage = {
      id: newId,
      title,
      slug: `${slugify(title)}-${generateId().slice(0, 4)}`,
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
    showToast(lang === 'fa' ? 'صفحه جدید ایجاد شد' : 'New page created');
  };

  const openEditor = (pageId) => {
    setEditingPageId(pageId);
    setHistory([]);
    setFuture([]);
    setSelectedSectionId(null);
    setSelectedWidgetId(null);
    setActiveTab('editor');
  };

  const duplicatePage = (page) => {
    const copy = {
      ...JSON.parse(JSON.stringify(page)),
      id: `page-${generateId()}`,
      title: `${page.title} (کپی)`,
      slug: `${page.slug}-copy-${generateId().slice(0, 3)}`,
      status: 'draft',
      views: 0
    };
    setPages((prev) => [copy, ...prev]);
    showToast(lang === 'fa' ? 'صفحه با موفقیت کپی شد' : 'Page duplicated');
  };

  const deletePage = (id) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    showToast(lang === 'fa' ? 'صفحه حذف شد' : 'Page deleted');
  };

  const getPublicUrl = (slug) => {
    return `${window.location.origin}${window.location.pathname}?page=${slug}`;
  };

  const copyShareLink = (slug) => {
    const url = getPublicUrl(slug);
    navigator.clipboard.writeText(url);
    showToast(lang === 'fa' ? 'لینک اشتراک‌گذاری در حافظه کپی شد!' : 'Shareable link copied!');
  };

  const exportPageJson = (page) => {
    const blob = new Blob([JSON.stringify(page, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${page.slug}.json`;
    a.click();
  };

  // --- Editor Operations with Undo/Redo ---
  const currentPage = pages.find((p) => p.id === editingPageId);

  const updateCurrentPage = (updater, recordHistory = true) => {
    if (!currentPage) return;
    if (recordHistory) {
      setHistory((prev) => [...prev.slice(-20), JSON.parse(JSON.stringify(currentPage))]);
      setFuture([]);
    }
    setPages((prev) =>
      prev.map((p) =>
        p.id === currentPage.id
          ? { ...updater(p), updatedAt: new Date().toLocaleDateString('fa-IR') }
          : p
      )
    );
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

  const addSection = (columns = 1) => {
    const newSec = {
      id: `sec-${generateId()}`,
      columns,
      bgColor: '#ffffff',
      paddingY: 48,
      widgets: [
        {
          id: `w-${generateId()}`,
          type: 'heading',
          content: lang === 'fa' ? 'عنوان بخش جدید' : 'New Section Heading',
          align: 'center',
          color: '#0f172a',
          fontSize: 28,
          bgColor: 'transparent',
          padding: 8,
          borderRadius: 0
        }
      ]
    };
    updateCurrentPage((p) => ({ ...p, sections: [...p.sections, newSec] }));
    setSelectedSectionId(newSec.id);
  };

  const addWidgetToSection = (sectionId, type) => {
    const defaults = {
      heading: { content: 'عنوان جدید', fontSize: 32, color: '#0f172a', align: 'right' },
      subheading: { content: 'زیرعنوان توضیحی', fontSize: 20, color: '#475569', align: 'right' },
      text: { content: 'متن دلخواه خود را اینجا بنویسید و از پنل کناری رنگ و اندازه آن را تغییر دهید.', fontSize: 16, color: '#334155', align: 'right' },
      image: { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80', caption: 'توضیح تصویر', borderRadius: 12 },
      video: { url: '' },
      button: { label: 'دکمه اقدام', url: '#', bgColor: '#2563eb', color: '#ffffff', fontSize: 16, padding: 12, borderRadius: 10, align: 'center' },
      card: { title: 'عنوان کارت', content: 'توضیحات مختصر درباره این کارت محتوایی', bgColor: '#f8fafc', color: '#0f172a', padding: 24, borderRadius: 16 },
      gallery: { images: INITIAL_MEDIA.map((m) => m.url) },
      table: { headers: ['ویژگی', 'توضیحات'], rows: [['سرعت بارگذاری', 'زیر ۱ ثانیه'], ['پشتیبانی', '۲۴ ساعته']] },
      list: { items: ['مزیت اول محصول یا خدمت', 'مزیت دوم با کیفیت تضمینی', 'مزیت سوم و پشتیبانی ویژه'], color: '#1e293b' },
      form: { title: 'فرم ثبت درخواست', buttonText: 'ارسال فرم', fields: ['نام و نام خانوادگی', 'شماره تماس'], bgColor: '#f8fafc', padding: 24, borderRadius: 16 },
      divider: { color: '#cbd5e1' },
      spacer: { height: 48 },
      html: { content: '<div style="padding:20px;background:#eff6ff;border-radius:12px;text-align:center;font-weight:bold;">کد HTML سفارشی شما</div>' }
    };

    const newWidget = {
      id: `w-${generateId()}`,
      type,
      bgColor: 'transparent',
      padding: 8,
      borderRadius: 0,
      ...defaults[type]
    };

    updateCurrentPage((p) => ({
      ...p,
      sections: p.sections.map((s) =>
        s.id === sectionId ? { ...s, widgets: [...s.widgets, newWidget] } : s
      )
    }));
    setSelectedSectionId(sectionId);
    setSelectedWidgetId(newWidget.id);
  };

  const updateSelectedWidget = (patch) => {
    if (!selectedSectionId || !selectedWidgetId) return;
    updateCurrentPage((p) => ({
      ...p,
      sections: p.sections.map((s) =>
        s.id === selectedSectionId
          ? {
              ...s,
              widgets: s.widgets.map((w) => (w.id === selectedWidgetId ? { ...w, ...patch } : w))
            }
          : s
      )
    }));
  };

  const deleteWidget = (secId, wId) => {
    updateCurrentPage((p) => ({
      ...p,
      sections: p.sections.map((s) =>
        s.id === secId ? { ...s, widgets: s.widgets.filter((w) => w.id !== wId) } : s
      )
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
    return (
      <div dir={dir} className="h-screen flex flex-col bg-slate-100 overflow-hidden">
        {/* Top Editor Toolbar */}
        <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('pages')}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 flex items-center gap-1.5 text-sm font-medium"
            >
              <ArrowRight className={`w-4 h-4 ${dir === 'ltr' ? 'rotate-180' : ''}`} />
              {lang === 'fa' ? 'داشبورد' : 'Dashboard'}
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <input
              type="text"
              value={currentPage.title}
              onChange={(e) => updateCurrentPage((p) => ({ ...p, title: e.target.value }), false)}
              className="font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 text-sm md:text-base"
            />
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                currentPage.status === 'published'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {currentPage.status === 'published'
                ? lang === 'fa' ? 'منتشرشده' : 'Published'
                : lang === 'fa' ? 'پیش‌نویس' : 'Draft'}
            </span>
          </div>

          {/* Viewport Switcher & Undo/Redo */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-lg ${viewport === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
              title="Desktop"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded-lg ${viewport === 'tablet' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
              title="Tablet"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-lg ${viewport === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
              title="Mobile"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-slate-300 mx-1" />
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-1.5 rounded-lg text-slate-600 disabled:opacity-30 hover:bg-white"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={future.length === 0}
              className="p-1.5 rounded-lg text-slate-600 disabled:opacity-30 hover:bg-white"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Publish & Share Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPublicSlug(currentPage.slug)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              {lang === 'fa' ? 'پیش‌نمایش' : 'Preview'}
            </button>
            <button
              onClick={() => {
                updateCurrentPage((p) => ({ ...p, status: 'published' }), false);
                showToast(lang === 'fa' ? 'صفحه با موفقیت منتشر شد!' : 'Page published!');
              }}
              className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'fa' ? 'انتشار صفحه' : 'Publish'}
            </button>
            {currentPage.status === 'published' && (
              <button
                onClick={() => copyShareLink(currentPage.slug)}
                className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                title="کپی لینک اشتراک‌گذاری"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Main 3-Column Builder Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Widgets & Sections Library */}
          <aside className="w-64 bg-white border-e border-slate-200 flex flex-col shrink-0 overflow-y-auto p-3">
            <div className="mb-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
                {lang === 'fa' ? 'افزودن سکشن جدید' : 'Add Section'}
              </h3>
              <div className="grid grid-cols-3 gap-1.5">
                {[1, 2, 3].map((cols) => (
                  <button
                    key={cols}
                    onClick={() => addSection(cols)}
                    className="p-2 border border-slate-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl flex flex-col items-center gap-1 text-xs font-medium text-slate-700 transition"
                  >
                    <Columns className="w-4 h-4 text-blue-600" />
                    <span>{cols} {lang === 'fa' ? 'ستون' : 'Col'}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
                {lang === 'fa' ? 'المان‌های محتوایی' : 'Content Elements'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {WIDGET_TYPES.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.type}
                      onClick={() => {
                        const targetSec = selectedSectionId || currentPage.sections[0]?.id;
                        if (targetSec) {
                          addWidgetToSection(targetSec, item.type);
                        } else {
                          addSection(1);
                        }
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/60 flex flex-col items-center justify-center gap-1.5 text-center transition group"
                    >
                      <Icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                      <span className="text-xs font-medium text-slate-700">{item.label[lang]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Center Canvas */}
          <main
            onClick={() => {
              setSelectedWidgetId(null);
            }}
            className="flex-1 overflow-y-auto p-6 flex justify-center bg-slate-200/70"
          >
            <div
              style={{
                width:
                  viewport === 'mobile'
                    ? '390px'
                    : viewport === 'tablet'
                    ? '768px'
                    : '100%'
              }}
              className="max-w-5xl bg-white min-h-full shadow-xl rounded-xl overflow-hidden transition-all duration-300"
            >
              {currentPage.sections.map((sec, sIdx) => (
                <div
                  key={sec.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSectionId(sec.id);
                    setSelectedWidgetId(null);
                  }}
                  style={{
                    backgroundColor: sec.bgColor || '#ffffff',
                    paddingTop: `${sec.paddingY ?? 48}px`,
                    paddingBottom: `${sec.paddingY ?? 48}px`
                  }}
                  className={`relative px-6 border-b border-dashed transition ${
                    selectedSectionId === sec.id ? 'border-blue-500 ring-1 ring-inset ring-blue-400' : 'border-slate-200'
                  }`}
                >
                  {/* Section Floating Controls */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-slate-900/85 text-white px-2 py-1 rounded-lg text-xs z-10">
                    <span>بخش {sIdx + 1}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateCurrentPage((p) => ({
                          ...p,
                          sections: p.sections.filter((s) => s.id !== sec.id)
                        }));
                      }}
                      className="p-1 hover:text-red-400"
                      title="حذف بخش"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div
                    className={`grid gap-5 ${
                      sec.columns === 3
                        ? 'grid-cols-1 md:grid-cols-3'
                        : sec.columns === 2
                        ? 'grid-cols-1 md:grid-cols-2'
                        : 'grid-cols-1'
                    }`}
                  >
                    {sec.widgets.map((w, wIdx) => (
                      <div key={w.id} className="relative group">
                        {/* Widget Quick Actions */}
                        {selectedWidgetId === w.id && (
                          <div className="absolute -top-7 right-0 flex items-center gap-1 bg-blue-600 text-white px-2 py-0.5 rounded-t-lg text-xs z-10">
                            <button onClick={() => moveWidget(sec.id, wIdx, -1)} className="p-0.5 hover:bg-blue-700 rounded">
                              <MoveUp className="w-3 h-3" />
                            </button>
                            <button onClick={() => moveWidget(sec.id, wIdx, 1)} className="p-0.5 hover:bg-blue-700 rounded">
                              <MoveDown className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                const cloned = { ...JSON.parse(JSON.stringify(w)), id: `w-${generateId()}` };
                                updateCurrentPage((p) => ({
                                  ...p,
                                  sections: p.sections.map((s) =>
                                    s.id === sec.id ? { ...s, widgets: [...s.widgets, cloned] } : s
                                  )
                                }));
                              }}
                              className="p-0.5 hover:bg-blue-700 rounded"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button onClick={() => deleteWidget(sec.id, w.id)} className="p-0.5 hover:bg-red-600 rounded">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <WidgetRenderer
                          widget={w}
                          isEditing={true}
                          isSelected={selectedWidgetId === w.id}
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
                </div>
              ))}
            </div>
          </main>

          {/* Right Panel: Inspector & Page Settings */}
          <aside className="w-80 bg-white border-s border-slate-200 flex flex-col shrink-0 overflow-y-auto">
            <div className="grid grid-cols-2 border-b border-slate-200">
              <button
                onClick={() => setEditorRightTab('style')}
                className={`py-3 text-xs font-bold border-b-2 transition ${
                  editorRightTab === 'style'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500'
                }`}
              >
                {lang === 'fa' ? 'تنظیمات المان / بخش' : 'Element Style'}
              </button>
              <button
                onClick={() => setEditorRightTab('settings')}
                className={`py-3 text-xs font-bold border-b-2 transition ${
                  editorRightTab === 'settings'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500'
                }`}
              >
                {lang === 'fa' ? 'تنظیمات و SEO صفحه' : 'Page & SEO'}
              </button>
            </div>

            <div className="p-4 space-y-5">
              {editorRightTab === 'settings' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">عنوان صفحه</label>
                    <input
                      type="text"
                      value={currentPage.title}
                      onChange={(e) => updateCurrentPage((p) => ({ ...p, title: e.target.value }), false)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">آدرس اختصاصی (Slug)</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={currentPage.slug}
                      onChange={(e) => updateCurrentPage((p) => ({ ...p, slug: slugify(e.target.value) }), false)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50"
                    />
                    <p className="text-[11px] text-slate-500 mt-1 break-all" dir="ltr">
                      {getPublicUrl(currentPage.slug)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">وضعیت انتشار</label>
                    <select
                      value={currentPage.status}
                      onChange={(e) => updateCurrentPage((p) => ({ ...p, status: e.target.value }), false)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="draft">پیش‌نویس (Draft)</option>
                      <option value="published">منتشرشده (Published)</option>
                      <option value="archived">آرشیوشده (Archived)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">سطح دسترسی صفحه</label>
                    <select
                      value={currentPage.visibility}
                      onChange={(e) => updateCurrentPage((p) => ({ ...p, visibility: e.target.value }), false)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="public">عمومی (قابل مشاهده برای همه)</option>
                      <option value="password">محافظت‌شده با رمز عبور</option>
                      <option value="private">خصوصی (فقط مدیر)</option>
                    </select>
                  </div>
                  {currentPage.visibility === 'password' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">رمز عبور مشاهده صفحه</label>
                      <input
                        type="text"
                        value={currentPage.password || ''}
                        onChange={(e) => updateCurrentPage((p) => ({ ...p, password: e.target.value }), false)}
                        placeholder="مثلاً: 12345"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                  )}
                  <hr />
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">عنوان سئو (Meta Title)</label>
                    <input
                      type="text"
                      value={currentPage.metaTitle || ''}
                      onChange={(e) => updateCurrentPage((p) => ({ ...p, metaTitle: e.target.value }), false)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">توضیحات سئو (Meta Description)</label>
                    <textarea
                      rows={3}
                      value={currentPage.metaDescription || ''}
                      onChange={(e) => updateCurrentPage((p) => ({ ...p, metaDescription: e.target.value }), false)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                </>
              ) : selectedWidget ? (
                <>
                  <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                    ویرایش المان: {selectedWidget.type}
                  </div>

                  {/* Content Controls based on widget type */}
                  {['heading', 'subheading', 'text', 'html'].includes(selectedWidget.type) && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">متن / محتوا</label>
                      <textarea
                        rows={4}
                        value={selectedWidget.content || ''}
                        onChange={(e) => updateSelectedWidget({ content: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                  )}

                  {selectedWidget.type === 'button' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">متن دکمه</label>
                        <input
                          type="text"
                          value={selectedWidget.label || ''}
                          onChange={(e) => updateSelectedWidget({ label: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">لینک مقصد (URL)</label>
                        <input
                          type="text"
                          dir="ltr"
                          value={selectedWidget.url || ''}
                          onChange={(e) => updateSelectedWidget({ url: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                    </>
                  )}

                  {['image', 'video'].includes(selectedWidget.type) && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">آدرس فایل (URL)</label>
                        <input
                          type="text"
                          dir="ltr"
                          value={selectedWidget.url || ''}
                          onChange={(e) => updateSelectedWidget({ url: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                        {selectedWidget.type === 'image' && (
                          <button
                            onClick={() =>
                              setMediaPickerCallback(() => (url) => updateSelectedWidget({ url }))
                            }
                            className="mt-2 w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                          >
                            انتخاب از کتابخانه رسانه
                          </button>
                        )}
                      </div>
                      {selectedWidget.type === 'image' && (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">توضیح زیر تصویر</label>
                          <input
                            type="text"
                            value={selectedWidget.caption || ''}
                            onChange={(e) => updateSelectedWidget({ caption: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                      )}
                    </>
                  )}

                  {selectedWidget.type === 'card' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">عنوان کارت</label>
                        <input
                          type="text"
                          value={selectedWidget.title || ''}
                          onChange={(e) => updateSelectedWidget({ title: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">متن کارت</label>
                        <textarea
                          rows={3}
                          value={selectedWidget.content || ''}
                          onChange={(e) => updateSelectedWidget({ content: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                    </>
                  )}

                  {selectedWidget.type === 'list' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">آیتم‌های لیست (هر خط یک مورد)</label>
                      <textarea
                        rows={4}
                        value={(selectedWidget.items || []).join('\n')}
                        onChange={(e) => updateSelectedWidget({ items: e.target.value.split('\n') })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                  )}

                  {selectedWidget.type === 'form' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">عنوان فرم</label>
                        <input
                          type="text"
                          value={selectedWidget.title || ''}
                          onChange={(e) => updateSelectedWidget({ title: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">فیلدها (هر خط یک فیلد)</label>
                        <textarea
                          rows={3}
                          value={(selectedWidget.fields || []).join('\n')}
                          onChange={(e) => updateSelectedWidget({ fields: e.target.value.split('\n') })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                    </>
                  )}

                  {/* Common Typography & Spacing Controls */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">رنگ متن</label>
                      <input
                        type="color"
                        value={selectedWidget.color || '#0f172a'}
                        onChange={(e) => updateSelectedWidget({ color: e.target.value })}
                        className="w-full h-9 rounded cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">رنگ پس‌زمینه</label>
                      <input
                        type="color"
                        value={selectedWidget.bgColor && selectedWidget.bgColor !== 'transparent' ? selectedWidget.bgColor : '#ffffff'}
                        onChange={(e) => updateSelectedWidget({ bgColor: e.target.value })}
                        className="w-full h-9 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      اندازه فونت ({selectedWidget.fontSize || 16}px)
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="64"
                      value={selectedWidget.fontSize || 16}
                      onChange={(e) => updateSelectedWidget({ fontSize: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      فاصله داخلی Padding ({selectedWidget.padding ?? 8}px)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="64"
                      value={selectedWidget.padding ?? 8}
                      onChange={(e) => updateSelectedWidget({ padding: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      گردی گوشه‌ها ({selectedWidget.borderRadius ?? 0}px)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={selectedWidget.borderRadius ?? 0}
                      onChange={(e) => updateSelectedWidget({ borderRadius: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">چیدمان متن</label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                      {['right', 'center', 'left'].map((al) => (
                        <button
                          key={al}
                          onClick={() => updateSelectedWidget({ align: al })}
                          className={`py-1.5 rounded flex justify-center ${
                            selectedWidget.align === al ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600'
                          }`}
                        >
                          {al === 'right' ? <AlignRight className="w-4 h-4" /> : al === 'center' ? <AlignCenter className="w-4 h-4" /> : <AlignLeft className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : selectedSection ? (
                <>
                  <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-2 rounded-lg">
                    تنظیمات سکشن انتخاب‌شده
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">تعداد ستون‌ها</label>
                    <select
                      value={selectedSection.columns}
                      onChange={(e) =>
                        updateCurrentPage((p) => ({
                          ...p,
                          sections: p.sections.map((s) =>
                            s.id === selectedSection.id ? { ...s, columns: Number(e.target.value) } : s
                          )
                        }))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value={1}>۱ ستون</option>
                      <option value={2}>۲ ستون</option>
                      <option value={3}>۳ ستون</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">رنگ پس‌زمینه سکشن</label>
                    <input
                      type="color"
                      value={selectedSection.bgColor || '#ffffff'}
                      onChange={(e) =>
                        updateCurrentPage((p) => ({
                          ...p,
                          sections: p.sections.map((s) =>
                            s.id === selectedSection.id ? { ...s, bgColor: e.target.value } : s
                          )
                        }))
                      }
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      فاصله بالا و پایین ({selectedSection.paddingY ?? 48}px)
                    </label>
                    <input
                      type="range"
                      min="16"
                      max="120"
                      value={selectedSection.paddingY ?? 48}
                      onChange={(e) =>
                        updateCurrentPage((p) => ({
                          ...p,
                          sections: p.sections.map((s) =>
                            s.id === selectedSection.id ? { ...s, paddingY: Number(e.target.value) } : s
                          )
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500 text-center py-8">
                  روی هر المان یا سکشن در صفحه کلیک کنید تا تنظیمات ظاهری آن نمایش داده شود.
                </p>
              )}
            </div>
          </aside>
        </div>

        {/* Media Library Modal inside Editor */}
        {mediaPickerCallback && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">انتخاب تصویر از کتابخانه رسانه</h3>
                <button onClick={() => setMediaPickerCallback(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {media.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      mediaPickerCallback(item.url);
                      setMediaPickerCallback(null);
                    }}
                    className="cursor-pointer group rounded-xl overflow-hidden border border-slate-200 hover:border-blue-600"
                  >
                    <img src={item.url} alt={item.name} className="w-full h-32 object-cover group-hover:scale-105 transition" />
                    <div className="p-2 text-xs truncate bg-slate-50">{item.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed bottom-5 left-5 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium z-50">
            {toast}
          </div>
        )}
      </div>
    );
  }

  // --- ADMIN DASHBOARD VIEW ---
  const filteredPages = pages.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.slug.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">صفحه‌ساز حرفه‌ای</div>
            <div className="text-[11px] text-slate-400">نسخه ابری و عملیاتی</div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <button
            onClick={() => setActiveTab('pages')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'pages' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            {lang === 'fa' ? 'مدیریت صفحات' : 'Pages'}
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'templates' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {lang === 'fa' ? 'قالب‌های آماده' : 'Templates'}
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'media' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            {lang === 'fa' ? 'کتابخانه رسانه' : 'Media Library'}
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4" />
            {lang === 'fa' ? 'Switch to English (LTR)' : 'تغییر زبان به فارسی (RTL)'}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('pb_auth');
              setIsAuthenticated(false);
            }}
            className="w-full py-2 px-3 rounded-xl text-xs font-medium text-red-400 hover:bg-slate-800 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {lang === 'fa' ? 'خروج از حساب' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'pages' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">
                  {lang === 'fa' ? 'مدیریت صفحات وب' : 'Manage Web Pages'}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  {lang === 'fa'
                    ? 'صفحات خود را بسازید، طراحی کنید و لینک اختصاصی آن‌ها را منتشر نمایید.'
                    : 'Create, design, and publish standalone web pages.'}
                </p>
              </div>
              <button
                onClick={() => createPageFromTemplate(TEMPLATES[0])}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-sm self-start"
              >
                <Plus className="w-4 h-4" />
                {lang === 'fa' ? 'ساخت صفحه جدید' : 'Create New Page'}
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute top-3 right-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'fa' ? 'جستجو بر اساس عنوان یا آدرس صفحه...' : 'Search pages...'}
                  className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="all">{lang === 'fa' ? 'همه وضعیت‌ها' : 'All Statuses'}</option>
                <option value="published">{lang === 'fa' ? 'منتشرشده' : 'Published'}</option>
                <option value="draft">{lang === 'fa' ? 'پیش‌نویس' : 'Draft'}</option>
                <option value="archived">{lang === 'fa' ? 'آرشیوشده' : 'Archived'}</option>
              </select>
            </div>

            {/* Pages Table / Cards */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="p-4 text-start font-bold">عنوان صفحه</th>
                      <th className="p-4 text-start font-bold">لینک اختصاصی</th>
                      <th className="p-4 text-center font-bold">وضعیت</th>
                      <th className="p-4 text-center font-bold">بازدید</th>
                      <th className="p-4 text-end font-bold">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPages.map((page) => (
                      <tr key={page.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{page.title}</div>
                          <div className="text-xs text-slate-400 mt-0.5">آخرین ویرایش: {page.updatedAt}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <code dir="ltr" className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                              ?page={page.slug}
                            </code>
                            <button
                              onClick={() => copyShareLink(page.slug)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="کپی لینک کامل"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              page.status === 'published'
                                ? 'bg-emerald-100 text-emerald-700'
                                : page.status === 'archived'
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {page.status === 'published' ? 'منتشرشده' : page.status === 'archived' ? 'آرشیو' : 'پیش‌نویس'}
                          </span>
                        </td>
                        <td className="p-4 text-center font-semibold text-slate-700">{page.views || 0}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditor(page.id)}
                              className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              ویرایش بصری
                            </button>
                            <button
                              onClick={() => setPublicSlug(page.slug)}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                              title="مشاهده صفحه"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => duplicatePage(page)}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                              title="کپی صفحه"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => exportPageJson(page)}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                              title="خروجی JSON"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deletePage(page.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                              title="حذف صفحه"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                {lang === 'fa' ? 'قالب‌های آماده حرفه‌ای' : 'Ready-to-Use Templates'}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                یک قالب را انتخاب کنید تا بلافاصله در ویرایشگر بصری باز شود و بتوانید تمام بخش‌های آن را تغییر دهید.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      {tpl.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-3">{tpl.name[lang]}</h3>
                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{tpl.description[lang]}</p>
                  </div>
                  <button
                    onClick={() => createPageFromTemplate(tpl)}
                    className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-semibold rounded-xl text-sm transition"
                  >
                    استفاده از این قالب
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">کتابخانه فایل‌ها و رسانه‌ها</h1>
                <p className="text-sm text-slate-500 mt-1">تصاویر خود را آپلود کنید تا در طراحی صفحات از آن‌ها استفاده نمایید.</p>
              </div>
              <label className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm cursor-pointer inline-flex items-center gap-2 self-start">
                <Plus className="w-4 h-4" />
                آپلود تصویر از سیستم
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      setMedia((prev) => [
                        {
                          id: `m-${generateId()}`,
                          name: file.name,
                          type: 'image',
                          url: reader.result,
                          date: new Date().toLocaleDateString('fa-IR')
                        },
                        ...prev
                      ]);
                      showToast('تصویر با موفقیت به کتابخانه اضافه شد');
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {media.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm group">
                  <img src={item.url} alt={item.name} className="w-full h-44 object-cover" />
                  <div className="p-3 flex items-center justify-between">
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-800 truncate">{item.name}</div>
                      <div className="text-[11px] text-slate-400">{item.date}</div>
                    </div>
                    <button
                      onClick={() => setMedia((prev) => prev.filter((m) => m.id !== item.id))}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {toast && (
        <div className="fixed bottom-5 left-5 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium z-50">
          {toast}
        </div>
      )}
    </div>
  );
}