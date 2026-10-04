import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';
import { OmarOilLogo } from './OmarOilLogo';
import { SHOP_INFO } from '../data/mockData';
import {
  Download,
  Printer,
  ChevronRight,
  ChevronLeft,
  X,
  FileText,
  Droplet,
  Disc,
  ClipboardCheck,
  Boxes,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Layers,
  Sparkles,
  Phone,
  Shield,
  Loader2,
} from 'lucide-react';

interface SystemPresentationModalProps {
  onClose: () => void;
}

interface SlideData {
  id: number;
  titleKrd: string;
  subtitleKrd: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  points: { title: string; desc: string; stat?: string }[];
  highlightBox?: { title: string; content: string; tag: string };
  metrics?: { label: string; value: string; sub?: string }[];
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    titleKrd: 'سیستەمی پێشکەوتووی عومەر ئۆیڵ',
    subtitleKrd: 'Omar Oil Automotive Service & Fast Oil Intake Platform',
    badge: 'ناساندنی گشتی سیستەم',
    icon: Sparkles,
    accentColor: 'from-rose-500 to-red-600',
    points: [
      {
        title: 'پلاتفۆرمی یەکەمی تایبەتمەند لە کوردستان',
        desc: 'سیستەمێکی بەڕێوەبردنی تەواو دیجیتاڵی بۆ سەنتەرەکانی گۆڕینی ڕۆن، پشکنینی گشتی، تایە و میزان بە زمانی شیرینی کوردی سۆرانی.',
        stat: '١٠٠٪ کوردی',
      },
      {
        title: 'خێرایی بێوێنە لە وەرگرتنی ئۆتۆمبێل (Fast Intake)',
        desc: 'تۆمارکردن و بڕیاردانی دەستبەجێ لە کەمتر لە ٦٠ چرکەدا بەبێ دروستبوونی سەرە لەبەردەم سەنتەر.',
        stat: '< ٦٠ چرکە',
      },
      {
        title: 'کۆتاییهێنان بە دەفتەر و کاغەز',
        desc: 'پاراستنی مێژووی تەواوی هەموو ئەو ئۆتۆمبێلانەی سەردانی عومەر ئۆیڵیان کردووە بۆ سەلامەتی بزوێنەر.',
        stat: 'سفر کاغەز',
      },
    ],
    highlightBox: {
      title: 'فەلسەفەی عومەر ئۆیڵ (Omar Oil)',
      content: 'خزمەتگوزارییەکی ئەندازیاری و ڕاستگۆیانە لەگەڵ خاوەن ئۆتۆمبێلەکان: ڕێزگرتن لە کاتی شۆفێر، پاراستنی بزوێنەر بە ڕۆنی ئەسڵی، و دڵنیابوون لە وادەی سەردانی داهاتوو.',
      tag: 'دیدگای سەنتەر',
    },
    metrics: [
      { label: 'سەردانی تۆمارکراو', value: '١٠,٠٠٠+', sub: 'لە مانگێکدا' },
      { label: 'کاتی گۆڕینی ڕۆن', value: '٣-٥ خولەک', sub: 'تێکڕای خێرایی' },
      { label: 'ڕێژەی ڕەزامەندی کڕیار', value: '٩٩.٢٪', sub: 'متمانەی بەرز' },
    ],
  },
  {
    id: 2,
    titleKrd: 'پشکنینی خێرا: «ڕۆن پاکە یان دەگۆڕدرێت»',
    subtitleKrd: 'Fast Kurdish Oil Intake Workflow',
    badge: 'میکانیزمی کارکردن',
    icon: Droplet,
    accentColor: 'from-amber-500 to-rose-600',
    points: [
      {
        title: 'پشکنینی پاکیی ڕۆن پێش تۆمارکردن',
        desc: 'شۆفێر هاتە ژوورەوە سەرەتا شیشی ڕۆنەکە دەردەهێنرێت: ئەگەر ڕۆنەکەی پاک و بەکەڵک بوو، بەڕێ دەکرێت بەبێ کاتگرتن و بەبێ تۆمارکردنی زانیاری زیادە.',
        stat: 'پشکنینی دەستبەجێ',
      },
      {
        title: 'گۆڕینی ڕاستەوخۆ ئەگەر ڕۆنەکە سووتاو بوو',
        desc: 'ئەگەر ڕۆنەکە پێویستی بە گۆڕین بوو، دەستبەجێ بەتاڵ دەکرێتەوە و لەسەر سیستم داتای مارکە و تابلۆ تۆمار دەکرێت.',
        stat: 'بێ کات بەفیڕۆدان',
      },
      {
        title: 'دوو دۆخی دەستبەجێ بۆ خێرایی کار',
        desc: 'دۆخی «ڕۆن پاکە - بەڕێکردن» بۆ پێشوازی خێرا و دۆخی «ڕۆن پیسە - گۆڕین» بۆ چوونە ناو پرۆسەی تۆمار و دەرکردنی لەزگە.',
        stat: 'دوو کلیک',
      },
    ],
    highlightBox: {
      title: 'بۆچی ئەم شێوازە گرنگە بۆ سەنتەری عومەر ئۆیڵ؟',
      content: 'لە زۆربەی وەرشەکاندا شۆفێر ڕادەگیرێت و فۆڕمی بۆ پڕدەکرێتەوە دواتر دەردەکەوێت ڕۆنەکەی پاکە! ئەم سیستمە یەکسەر بە کردار دەپشکنێت و کڕیار دڵخۆش و ڕازی دەکات.',
      tag: 'کاریگەری خێرا',
    },
    metrics: [
      { label: 'پشکنینی پاکی ڕۆن', value: '١٥ چرکە', sub: 'دەستبەجێ' },
      { label: 'سەردانیکەرانی ڕۆن پاک', value: '٣٠٪', sub: 'بەڕێدەکرێن' },
      { label: 'کەمکردنەوەی قەرەباڵغی', value: '٥٠٪', sub: 'سەرەی وەستاکان' },
    ],
  },
  {
    id: 3,
    titleKrd: 'تابلۆکانی عێراق و هەرێمی کوردستان و علوج',
    subtitleKrd: 'All 14 Provinces Codes (11-24) & Unregistered (علوج)',
    badge: 'تایبەتمەندی دەگمەن',
    icon: Camera,
    accentColor: 'from-blue-600 to-indigo-600',
    points: [
      {
        title: 'سەرجەم پارێزگاکانی هەرێمی کوردستان بە نیشانەی [KR]',
        desc: 'کۆدەکانی ٢١ (سلێمانی)، ٢٢ (هەولێر)، ٢٣ (هەڵەبجە)، و ٢٤ (دهۆک) بە نیشانەی فەرمی هەرێم دەناسرێنەوە.',
        stat: '٢١ تا ٢٤',
      },
      {
        title: 'سەرجەم پارێزگاکانی تری عێراق (١١ تا ٢٠)',
        desc: 'بەغدا (11)، نەینەوا (12)، میسان (13)، بەسرە (14)، ئەنبار (15)، قادسیە/دیوانیە (16)، موسەنا (17)، بابل (18)، کەربەلا (19)، و دیالە (20).',
        stat: '١١ تا ٢٠',
      },
      {
        title: 'پشتیوانی ئۆتۆمبێلی بێ تابلۆ (علوج)',
        desc: 'دۆخی تایبەت بۆ ئۆتۆمبێلە علوج و گومرگییەکان کە تەنها ژمارەیان لەسەرە بێ ناوی شار یان پیت، بە باجی جیاوازی زەرد پیشان دەدرێت.',
        stat: 'علوج (بێ تابلۆ)',
      },
    ],
    highlightBox: {
      title: 'خوێندنەوەی ژیرانە بە کامێرای مۆبایل (AI Plate OCR)',
      content: 'وەستای عومەر ئۆیڵ تەنها کامێراکە ڕوو لە تابلۆکە دەکات، سیستەمەکە ڕاستەوخۆ کۆدی پارێزگاکە و پیت و ژمارەکان دەخوێنێتەوە و خانەکان بە ئۆتۆماتیکی پڕدەکاتەوە.',
      tag: 'زیرەکی دەستکرد',
    },
    metrics: [
      { label: 'کۆدی پارێزگاکان', value: '١٤ پارێزگا', sub: 'کوردستان و عێراق' },
      { label: 'دۆخی علوج', value: 'تەنها ژمارە', sub: 'ژمارەی گومرگی' },
      { label: 'دروستی OCR', value: '٩٨.٥٪', sub: 'بە کامێرا' },
    ],
  },
  {
    id: 4,
    titleKrd: 'حیساباتی ئەندازیاری ڕۆن و کیلۆمەتر',
    subtitleKrd: 'Oil Grade, Viscosity, Capacity & Interval Engine',
    badge: 'ئەندازیاری بزوێنەر',
    icon: Droplet,
    accentColor: 'from-amber-600 to-yellow-500',
    points: [
      {
        title: 'دیاریکردنی لزوجەی ستاندارد',
        desc: 'ڕێبەری تەواوی ڕۆنەکانی 0W-20, 5W-30, 10W-40, 20W-50 بۆ ئۆتۆمبێلەکانی تۆیۆتا، نیسان، هیۆندای، کیا، مارسیدس، بی ئێم دەبلیو و فۆرد.',
        stat: 'هەموو جۆرەکان',
      },
      {
        title: 'حیسابی قەبارە (لیتر) بەپێی بزوێنەر',
        desc: 'حیسابکردنی خودکاری قەبارەی تەواو لەگەڵ یان بێ فلتەر (بۆ نموونە: ٤.٢ لیتر یان ٦.٥ لیتر) بۆ پاراستنی مەکینە لە زیادی یان کەمی.',
        stat: 'دیاریکردنی لیتر',
      },
      {
        title: 'حیسابکردنی ئۆتۆماتیکی کیلۆمەتری داهاتوو',
        desc: 'پێدانی کیلۆمەتری ئێستا (Odometer)، سیستمەکە بەپێی جۆری ڕۆنەکە (٥,٠٠٠ یان ١٠,٠٠٠ یان ١٥,٠٠٠ کم) وادە و کیلۆمەتری داهاتوو دیاری دەکات.',
        stat: 'بەروار و کیلۆمەتر',
      },
    ],
    highlightBox: {
      title: 'بۆچی دەبێت ڕۆنی عومەر ئۆیڵ هەڵبژێردرێت؟',
      content: 'ڕێگریکردن لە سووتانی بزوێنەر و بەفیڕۆچوونی پارەی شۆفێر لە ڕێگەی دانانی دروستترین پلەی لزوجەت کە لەگەڵ کەشوهەوای گەرم و ساردی عێراق و کوردستان دەگونجێت.',
      tag: 'پاراستنی مەکینە',
    },
    metrics: [
      { label: 'مەودای ڕۆنگۆڕین', value: '٥,٠٠٠ - ١٥,٠٠٠', sub: 'کیلۆمەتر' },
      { label: 'پێشنیازی لزوجەت', value: 'خودکار', sub: 'بەپێی مۆدێل' },
      { label: 'سەلامەتی بزوێنەر', value: '١٠٠٪', sub: 'ستانداردی جیهانی' },
    ],
  },
  {
    id: 5,
    titleKrd: 'چاپکردنی لەزگەی جامی ئۆتۆمبێل (Sticker)',
    subtitleKrd: 'Windshield Service Reminders: Thermal & Card Formats',
    badge: 'براند و کوالێتی',
    icon: Printer,
    accentColor: 'from-emerald-600 to-teal-600',
    points: [
      {
        title: 'چاپکردنی دەستبەجێ بە یەک کلیک',
        desc: 'پاش تەواوبوونی گۆڕینی ڕۆنەکە، لەزگەی پاک و شەفاف لە پرینتەری حراری دێتەدەرەوە و دەدرێت لە جامی ئۆتۆمبێلەکە.',
        stat: '٣ چرکە',
      },
      {
        title: 'دوو فۆرماتی ستاندارد (Thermal 3x2 & Card)',
        desc: 'پشتیوانی چاپکەری گەرمی بچووک (Thermal Print) و کارتی لێدەر (Card Format) لەگەڵ لۆگۆی فەرمی عومەر ئۆیڵ و ژمارەی مۆبایل.',
        stat: 'دوو شێواز',
      },
      {
        title: 'تۆماری تەواو لەسەر لەزگەکە',
        desc: 'بەرواری داهاتوو، کیلۆمەتری داهاتوو، جۆری ڕۆن، براندی فلتەر، و ژمارەی پەیوەندی بە عومەر ئۆیڵ بە ڕوونی چاپ دەبێت.',
        stat: 'ناوەڕۆکی ورد',
      },
    ],
    highlightBox: {
      title: 'بەهای لەزگەی عومەر ئۆیڵ (Omar Oil)',
      content: 'شۆفێر هەموو بەیانییەک کە دادەنیشێتە ناو سەیارەکەی، چاوی بە لۆگۆی عومەر ئۆیڵ و کیلۆمەتری ماوە دەکەوێت. ئەمە گەورەترین هۆکاری وەفاداری و گەڕانەوەی کڕیارە.',
      tag: 'براندینگی بەهێز',
    },
    metrics: [
      { label: 'کاتی چاپکردن', value: '٣ چرکە', sub: 'دەستبەجێ' },
      { label: 'مەودای بەرگەگرتن', value: 'بەرگەی تیشکی خۆر', sub: 'تێکناچێت' },
      { label: 'ڕێژەی گەڕانەوە', value: '+٤٥٪', sub: 'بۆ ڕۆنی داهاتوو' },
    ],
  },
  {
    id: 6,
    titleKrd: 'پشکنینی دیجیتاڵی تایە و باڵانس و میزان',
    subtitleKrd: 'Tire Tread Depth & Alignment Diagnostic Module',
    badge: 'سەلامەتی ڕێگا',
    icon: Disc,
    accentColor: 'from-cyan-600 to-blue-600',
    points: [
      {
        title: 'پێوانی قووڵایی کڕۆکی تایە (Tread Depth)',
        desc: 'پشکنینی هەر چوار تایەکە (پێشەوە ڕاست/چەپ، دواوە ڕاست/چەپ) بە میلیمیتر و ناسینەوەی سایینەوەی تایەکان.',
        stat: 'بە میلیمیتر',
      },
      {
        title: 'کۆدی ڕەنگی نێودەوڵەتی (سەوز، زەرد، سوور)',
        desc: 'سەوز: تایەکە نوێیە و تەندروستە (> 4mm). زەرد: کەمبووەتەوە (3-4mm). سوور: مەترسیدارە و دەبێت بگۆڕدرێت (< 2.5mm).',
        stat: 'سێ ڕەنگ',
      },
      {
        title: 'هاوسەنگی و میزان (Camber, Caster, Toe)',
        desc: 'تۆمارکردنی ئەنجامی پشکنینی سۆندە و هاوسەنگی سوکان پێش و پاش میزان بۆ ئەوەی سەیارەکە بەلایەکدا ڕانەکێشێت.',
        stat: 'پێش و پاش',
      },
    ],
    highlightBox: {
      title: 'پاراستنی گیانی خێزان لە ڕێگاکانی نێوان شارەکان',
      content: 'بە تایبەت لە وەرزی بارانبارین و سەهۆڵبەنداندا، پشکنینی تایە لە عومەر ئۆیڵ شۆفێر لە تەقینی تایە و خلیسکان ڕزگار دەکات.',
      tag: 'سەلامەتی سەرەکی',
    },
    metrics: [
      { label: 'پشکنینی ٤ تایە', value: '١ خولەک', sub: 'خێرا' },
      { label: 'دیاریکردنی مەترسی', value: 'خودکار', sub: 'بە ڕەنگ' },
      { label: 'ڕاپۆرتی چاپکراو', value: 'بەردەستە', sub: 'بۆ شۆفێر' },
    ],
  },
  {
    id: 7,
    titleKrd: 'پشکنینی فرەخاڵی (DVI) و دەروازەی ڕەزامەندی کڕیار',
    subtitleKrd: 'Digital Vehicle Inspection & WhatsApp Approval Portal',
    badge: 'شەفافیەتی تەواو',
    icon: ClipboardCheck,
    accentColor: 'from-violet-600 to-purple-600',
    points: [
      {
        title: 'پشکنینی وردی بەشە هەستیارەکان',
        desc: 'پشکنینی باتری و دینامۆ، شلەی فڕێن، ڕادێتەر و ئاوی سەوز، فلتەری تەبرید و ژوور، و قایشی دینەمۆ بە شێوازی سەوز/زەرد/سوور.',
        stat: 'فرەخاڵ',
      },
      {
        title: 'وێنەگرتن و بەڵگەی بینراو',
        desc: 'وەستاکە وێنەی پارچە شکاو یان چەوری لێچوو دەگرێت و لە ڕاپۆرتەکەدا دادەنرێت تا شۆفێر بە چاوی خۆی کێشەکە ببینێت.',
        stat: 'بەڵگەی وێنەیی',
      },
      {
        title: 'دەروازەی ڕەزامەندی مۆبایل بە نامەی واتسئەپ',
        desc: 'لینکێک بۆ شۆفێر دەڕوات: لەسەر مۆبایلەکەی خۆی دەتوانێت بە یەک کلیک بڵێت «چاکی بکە» یان «دواتر»، بەبێ پێویستی بە ئەپ.',
        stat: 'ڕەزامەندی لە مۆبایل',
      },
    ],
    highlightBox: {
      title: 'بۆچی کڕیاران متمانەی زیاتر بە عومەر ئۆیڵ دەکەن؟',
      content: 'چونکە هیچ شتێک بە زۆر یان بە نهێنی ناگۆڕدرێت! کڕیار لە مۆبایلەکەیەوە وێنەی فلتەرە پیسەکەی دەبینێت و نرخی پارچەکە دەزانێت و خۆی ڕەزامەندی دەدات.',
      tag: 'متمانەی شۆفێر',
    },
    metrics: [
      { label: 'ڕێژەی ڕەزامەندی کڕیار', value: '٨٢٪', sub: 'پاش بینینی وێنە' },
      { label: 'شەفافیەتی نرخ', value: '١٠٠٪', sub: 'بە دینار' },
      { label: 'ناردنی نامە', value: 'واتسئەپ', sub: 'بە زمانی کوردی' },
    ],
  },
  {
    id: 8,
    titleKrd: 'کۆگا و فرۆشتنی پارچە و پسوولەی فەرمی (POS)',
    subtitleKrd: 'Inventory Management, Barrels Tracking & Commercial Invoices',
    badge: 'حیساباتی دارایی',
    icon: Boxes,
    accentColor: 'from-emerald-700 to-green-600',
    points: [
      {
        title: 'چاودێری بەرمیل و دەبە ڕۆنەکان',
        desc: 'تۆمارکردنی هەموو دەبە ڕۆنەکانی 1L, 4L, 5L و بەرمیلە گەورەکان و دابەزینی خودکاری کۆگا لەگەڵ هەر گۆڕینێکدا.',
        stat: 'بەرمیل و دەبە',
      },
      {
        title: 'ئاگادارکردنەوەی کەمیی کاڵا (Low Stock Alerts)',
        desc: 'کاتێک جۆرە ڕۆنێک یان فلتەرێکی دیاریکراو لە سنووری دیاریکراو کەمتر بووەوە، سیستمەکە هۆشداری دەدات بۆ کڕینی نوێ.',
        stat: 'هۆشداری خودکار',
      },
      {
        title: 'پسوولەی بازرگانی بە لۆگۆی فەرمی عومەر ئۆیڵ',
        desc: 'دەرکردنی پسوولەی فەرمی بە دیناری عێراقی (IQD) بە ناوی کڕیار، جۆری پارچەکان، کرێی دەست و کاتی دەرچوون.',
        stat: 'پسوولەی فەرمی IQD',
      },
    ],
    highlightBox: {
      title: 'کۆنترۆڵی تەواوی ماددی و پارێزگاری لە داهات',
      content: 'خاوەنکار لە هەر چرکەیەکدا دەزانێت چەند لیتر ڕۆن لە کۆگادا ماوە و چەند داهات لە ڕۆژەکەدا هاتووەتە سەنتەرەکە بەبێ جیاوازی و هەڵەی ژمێریاری.',
      tag: 'کۆنترۆڵی دارایی',
    },
    metrics: [
      { label: 'ژمارەی کاڵای کۆگا', value: '٥٠٠+ جۆر', sub: 'ڕۆن و فلتەر' },
      { label: 'دروستی کۆگا', value: '٩٩.٩٪', sub: 'بێ ونبوون' },
      { label: 'دراوی پسوولە', value: 'IQD', sub: 'دیناری عێراقی' },
    ],
  },
  {
    id: 9,
    titleKrd: 'ناوەندی بیرخەرەوە و ڕاکێشانی کڕیاران (Retention)',
    subtitleKrd: 'Automated WhatsApp Retention & Next Service Reminders',
    badge: 'زیادکردنی داهات',
    icon: Bell,
    accentColor: 'from-rose-600 to-orange-500',
    points: [
      {
        title: 'نامەی خودکاری نزیکبوونەوەی وادەی ڕۆن',
        desc: '٧ ڕۆژ پێش تەواوبوونی ڕۆنەکە، کڕیار نامەیەکی کوردی جوان لە واتسئەپەوە پێدەگات: «بەڕێز، ڕۆنی ئۆتۆمبێلەکەت نزیکە لە کاتی گۆڕین».',
        stat: 'پێشوەختە',
      },
      {
        title: 'نامەی بەپەلە ئەگەر کاتی ڕۆن تێپەڕیبوو',
        desc: 'هۆشداری دۆستانە بۆ پاراستنی بزوێنەری شۆفێرەکە کە سەردانی عومەر ئۆیڵ بکات بۆ ئەوەی زیان بە مەکینەی نەکەوێت.',
        stat: 'پاراستنی بزوێنەر',
      },
      {
        title: 'تێکەڵکردنی داتای فەرمی بە نووسینی ئاسان',
        desc: 'نامەکان تابلۆ، مۆدێلی سەیارەکە، جۆری ڕۆنی پێشوو، و تەلەفۆنی سەنتەری عومەر ئۆیڵ لەخۆدەگرن.',
        stat: 'شەخسی و ڕێکوپێک',
      },
    ],
    highlightBox: {
      title: 'گرنگترین هۆکاری زیادبوونی داهاتی سەنتەر',
      content: 'کڕیار بیر لە ڕۆنگۆڕین ناکاتەوە تا مەکینەی دەنگ نەکات! بەڵام کاتێک عومەر ئۆیڵ لە کاتی خۆیدا نامەی بۆ دەنێرێت، ڕاستەوخۆ دەگەڕێتەوە بۆ سەنتەرەکە.',
      tag: '+٤٢٪ داهات',
    },
    metrics: [
      { label: 'گەڕانەوەی کڕیار', value: '+٤٢٪', sub: 'بە نامەی واتسئەپ' },
      { label: 'کاتی ناردنی نامە', value: 'دەستبەجێ', sub: 'بەپێی خشتە' },
      { label: 'تێچووی ناردن', value: 'سفر', sub: 'لە ڕێی وێب' },
    ],
  },
  {
    id: 10,
    titleKrd: 'کورتە و داهاتووی عومەر ئۆیڵ (Omar Oil)',
    subtitleKrd: 'Digital Transformation, Zero Paper & Supreme Quality',
    badge: 'ئەنجام و بەها',
    icon: Shield,
    accentColor: 'from-red-600 to-rose-700',
    points: [
      {
        title: 'سیستەمێکی نیشتمانی بەرز بۆ وڵاتەکەمان',
        desc: 'پێشکەشکردنی باشترین خزمەتگوزاری لە ڕانیە (شەقامی سەرەکی سناعە) و سەرجەم شارەکان بە یەک مۆدێلی ستاندارد.',
        stat: 'ڕانیە - سناعە',
      },
      {
        title: 'بەڕێوەبردنی تەواوی تیم و وەستاکان',
        desc: 'دابەشکردنی دەسەڵات لە نێوان پێشوازی، وەستای ڕۆنگۆڕین، وەستای تایە، بەرپرسی کۆگا و خاوەنکار.',
        stat: '٥ ڕۆڵی سیستەم',
      },
      {
        title: 'ئامادە بۆ گەشەسەندن و لقی نوێ',
        desc: 'داتای هاوبەش لەسەر کلاود لەگەڵ بەکارهێنانی ئۆفلاین لە کاتی بڕانی ئینتەرنێتدا.',
        stat: 'بەردەوام لە کاردا',
      },
    ],
    highlightBox: {
      title: 'سوپاس بۆ متمانەتان بە عومەر ئۆیڵ (Omar Oil)',
      content: 'ئێمە لێرەین تا ئۆتۆمبێلەکان بە بەهێزترین و پارێزراوترین دۆخ بمێننەوە. ناونیشان: ڕانیە شەقامی سەرەکی سناعە - پەیوەندی: +964 750 157 3424.',
      tag: 'سەنتەری عومەر ئۆیڵ',
    },
    metrics: [
      { label: 'سەردەمیانە', value: '١٠٠٪', sub: 'تەواو دیجیتاڵی' },
      { label: 'براندی باوەڕپێکراو', value: 'Omar Oil', sub: 'سەنتەری پلە یەک' },
      { label: 'پەیوەندی ڕاستەوخۆ', value: '+964 750 157 3424', sub: 'خزمەتگوزاری کڕیار' },
    ],
  },
];

export const SystemPresentationModal: React.FC<SystemPresentationModalProps> = ({ onClose }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('');
  const printDeckRef = useRef<HTMLDivElement>(null);

  const activeSlide = SLIDES[activeSlideIndex];

  const handlePrev = () => {
    setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : SLIDES.length - 1));
  };

  const handleNext = () => {
    setActiveSlideIndex((prev) => (prev < SLIDES.length - 1 ? prev + 1 : 0));
  };

  // Generate multi-page PDF presentation using html2canvas & jsPDF
  const handleDownloadPDF = async () => {
    if (!printDeckRef.current || isExporting) return;

    try {
      setIsExporting(true);
      setExportProgress(5);
      setExportStatusText('ئامادەکردنی لاپەڕەکانی پرێزێنتەیشن...');

      // Create landscape A4 PDF: 297mm x 210mm
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const slideElements = printDeckRef.current.querySelectorAll<HTMLElement>('.pdf-slide-page');
      const total = slideElements.length;

      for (let i = 0; i < total; i++) {
        const slideEl = slideElements[i];
        setExportStatusText(`وێنەگرتن و دروستکردنی لاپەڕەی ${i + 1} لە ${total}...`);
        setExportProgress(Math.round(((i + 1) / (total + 1)) * 90));

        // Use high-fidelity SVG/Canvas rasterization via html-to-image (supports OKLCH, Tailwind v4, Kurdish typography)
        const imgData = await toJpeg(slideEl, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: '#020617',
          width: 1200,
          height: 848,
          cacheBust: true,
        });

        if (i > 0) {
          pdf.addPage('a4', 'landscape');
        }

        // Fit into A4 landscape: 297 x 210 mm
        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
      }

      setExportStatusText('پاشەکەوتکردنی فایلی PDF...');
      setExportProgress(100);

      pdf.save('Omar_Oil_System_Presentation_Kurdish.pdf');

      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        setExportStatusText('');
      }, 800);
    } catch (err) {
      console.error('PDF export failed:', err);
      setIsExporting(false);
      setExportStatusText('هەڵەیەک لە داگرتنی PDF ڕوویدا');
    }
  };

  // Direct print trigger
  const handlePrint = () => {
    window.print();
  };

  const IconComponent = activeSlide.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden text-right">
        {/* Top Header Bar */}
        <div className="no-print px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-900 px-2 py-1 rounded-xl border border-slate-800 shrink-0">
              <OmarOilLogo variant="red" size="xs" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  پرێزێنتەیشنی سیستەمی عومەر ئۆیڵ
                </h2>
                <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full font-sans">
                  Omar Oil PDF Deck
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                پێشکەشکردنی تەواوی بەشەکان بە زمانی کوردی سۆرانی
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900/60 text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>دروستکردنی PDF ({exportProgress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>داگرتنی وەک PDF</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs rounded-xl transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>چاپکردن</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar for PDF Export */}
        {isExporting && (
          <div className="no-print bg-slate-950 px-4 py-2 border-b border-slate-800">
            <div className="flex items-center justify-between text-xs text-rose-300 mb-1">
              <span>{exportStatusText}</span>
              <span className="font-mono">{exportProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full transition-all duration-200"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Interactive Slide Viewer (Main Display) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Top Slide Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${activeSlide.accentColor} text-white shadow-md`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      {activeSlide.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      لاپەڕەی {activeSlide.id} لە {SLIDES.length}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                    {activeSlide.titleKrd}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans tracking-wide">
                    {activeSlide.subtitleKrd}
                  </p>
                </div>
              </div>

              {/* Branding pill inside slide */}
              <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
                <OmarOilLogo variant="red" size="xs" />
                <span className="text-[10px] text-slate-400 font-mono">عومەر ئۆیڵ</span>
              </div>
            </div>

            {/* Slide Body: 3 Main Key Points */}
            <div className="space-y-4 mb-6">
              {activeSlide.points.map((pt, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl flex items-start gap-3 hover:border-slate-700 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-200">{pt.title}</h4>
                      {pt.stat && (
                        <span className="text-[10px] bg-slate-800 text-slate-300 font-medium px-2 py-0.5 rounded border border-slate-700">
                          {pt.stat}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Metrics Grid */}
            {activeSlide.metrics && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                {activeSlide.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center"
                  >
                    <span className="block text-xs font-medium text-slate-400">{m.label}</span>
                    <span className="block text-base sm:text-lg font-bold text-white mt-0.5 font-mono">
                      {m.value}
                    </span>
                    {m.sub && <span className="block text-[10px] text-slate-500">{m.sub}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Highlight Box */}
            {activeSlide.highlightBox && (
              <div className="bg-gradient-to-l from-rose-950/40 via-slate-950 to-slate-950 border border-rose-900/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                    {activeSlide.highlightBox.title}
                  </span>
                  <span className="text-[9px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold">
                    {activeSlide.highlightBox.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeSlide.highlightBox.content}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Bottom Navigation */}
        <div className="no-print px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
            <span>پێشوو</span>
          </button>

          {/* Slide Dots / Thumbnails */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-md px-2 scrollbar-none">
            {SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSlideIndex(idx)}
                title={s.titleKrd}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition shrink-0 ${
                  activeSlideIndex === idx
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {s.id}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <span>دواتر</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* HIDDEN COMPLETE PDF DECK (Used for html2canvas rendering all 10 slides into the PDF file) */}
        <div
          ref={printDeckRef}
          style={{
            position: 'fixed',
            left: '-9999px',
            top: '-9999px',
            width: '1200px',
            opacity: 0,
            pointerEvents: 'none',
          }}
        >
          {SLIDES.map((slide) => {
            const SlideIcon = slide.icon;
            return (
              <div
                key={slide.id}
                className="pdf-slide-page w-[1200px] h-[848px] bg-slate-950 text-slate-100 p-12 flex flex-col justify-between font-kurdish text-right"
                dir="rtl"
                style={{
                  boxSizing: 'border-box',
                  pageBreakAfter: 'always',
                }}
              >
                {/* Slide Header */}
                <div className="border-b-2 border-slate-800 pb-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${slide.accentColor} text-white shadow-lg`}>
                      <SlideIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded border border-rose-500/20">
                          {slide.badge}
                        </span>
                        <span className="text-sm text-slate-400 font-mono">
                          لاپەڕەی {slide.id} لە {SLIDES.length}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black text-white mt-1.5">{slide.titleKrd}</h2>
                      <p className="text-sm text-slate-400 font-sans tracking-wide">
                        {slide.subtitleKrd}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800">
                    <OmarOilLogo variant="red" size="sm" />
                    <div className="text-right">
                      <span className="block text-xs font-bold text-white">عومەر ئۆیڵ</span>
                      <span className="block text-[10px] text-slate-400 font-mono">Omar Oil</span>
                    </div>
                  </div>
                </div>

                {/* Key Points */}
                <div className="space-y-4 my-6">
                  {slide.points.map((pt, pIdx) => (
                    <div
                      key={pIdx}
                      className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4"
                    >
                      <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 font-mono">
                        {pIdx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="font-bold text-base text-white">{pt.title}</h4>
                          {pt.stat && (
                            <span className="text-xs bg-slate-800 text-slate-300 font-medium px-3 py-1 rounded border border-slate-700 font-mono">
                              {pt.stat}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">{pt.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Metrics */}
                {slide.metrics && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {slide.metrics.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center"
                      >
                        <span className="block text-xs font-medium text-slate-400">{m.label}</span>
                        <span className="block text-xl font-bold text-white mt-1 font-mono">
                          {m.value}
                        </span>
                        {m.sub && <span className="block text-xs text-slate-500">{m.sub}</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom Highlight */}
                {slide.highlightBox && (
                  <div className="bg-gradient-to-l from-rose-950/40 via-slate-900 to-slate-900 border border-rose-900/40 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-sm font-bold text-rose-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-rose-400" />
                        {slide.highlightBox.title}
                      </span>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {slide.highlightBox.content}
                      </p>
                    </div>
                    <span className="text-xs bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full font-bold whitespace-nowrap shrink-0">
                      {slide.highlightBox.tag}
                    </span>
                  </div>
                )}

                {/* Footer Bar */}
                <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-400">سەنتەری عومەر ئۆیڵ (Omar Oil)</span>
                    <span>• {SHOP_INFO.address}</span>
                    <span>• پەیوەندی: {SHOP_INFO.phone}</span>
                  </div>
                  <div className="font-mono text-slate-400">
                    سیستەمی بەڕێوەبردنی سێرڤسی ئۆتۆمبێل • {new Date().getFullYear()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
