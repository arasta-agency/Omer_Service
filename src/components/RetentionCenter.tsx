import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { RetentionReminder, ReminderTemplate } from '../types';
import { SHOP_INFO } from '../data/mockData';
import {
  Bell,
  MessageSquare,
  Send,
  CheckCircle2,
  Phone,
  Car,
  Check,
  Sparkles,
} from 'lucide-react';

export const RetentionCenter: React.FC = () => {
  const {
    reminders,
    templates,
    customers,
    vehicles,
    dispatchReminder,
    updateTemplate,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'queue' | 'templates'>('queue');
  const [filterType, setFilterType] = useState<string>('all');
  const [editingTemplateId, setEditingTemplateId] = useState<string>(templates[0]?.id || '');
  const [templateBody, setTemplateBody] = useState<string>(templates[0]?.body || '');
  const [savedAlert, setSavedAlert] = useState(false);
  const [sentAlertId, setSentAlertId] = useState<string | null>(null);

  const selectedTemplate = templates.find((t) => t.id === editingTemplateId) || templates[0];

  const TEMPLATE_TYPE_LABELS: Record<string, string> = {
    upcoming_oil_service: 'کاتی گۆڕینی نزیکبووەتەوە',
    overdue_oil_service: 'وادەی بەسەرچووە (٧-١٤ ڕۆژ)',
    tire_rotation_due: 'میزان و پشکنینی تایە',
    seasonal_maintenance: 'پشکنینی وەرزی',
  };

  const handleSelectTemplate = (t: ReminderTemplate) => {
    setEditingTemplateId(t.id);
    setTemplateBody(t.body);
  };

  const handleSaveTemplate = () => {
    updateTemplate(editingTemplateId, templateBody);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleInsertTag = (tag: string) => {
    setTemplateBody((prev) => prev + ` {{${tag}}}`);
  };

  const handleDispatch = (rem: RetentionReminder) => {
    dispatchReminder(rem.id);
    setSentAlertId(rem.id);
    setTimeout(() => setSentAlertId(null), 3000);

    const cust = customers.find((c) => c.id === rem.customerId);
    const cleanPhone = cust?.phone.replace(/\D/g, '') || '07700000000';
    const encodedMsg = encodeURIComponent(rem.renderedMessage);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMsg}`, '_blank');
  };

  const filteredReminders = reminders.filter((r) => {
    if (filterType === 'all') return true;
    if (filterType === 'overdue') return r.daysDiff < 0;
    if (filterType === 'upcoming') return r.daysDiff >= 0;
    return r.status === filterType;
  });

  const overdueCount = reminders.filter((r) => r.daysDiff < 0).length;
  const upcomingCount = reminders.filter((r) => r.daysDiff >= 0 && r.daysDiff <= 14).length;
  const sentCount = reminders.filter((r) => r.status === 'sent').length;

  // Rendered live preview of the currently edited template
  const previewRendered = templateBody
    .replace(/{{customer_name}}/g, 'سەرکەوت ئەحمەد')
    .replace(/{{car_make}}/g, 'تۆیۆتا')
    .replace(/{{car_model}}/g, 'کامری')
    .replace(/{{license_plate}}/g, '21 A 45892 سلێمانی')
    .replace(/{{last_oil_type}}/g, 'تۆیۆتا SP 0W-20')
    .replace(/{{next_service_km}}/g, '60,000')
    .replace(/{{due_date}}/g, '2026-10-15')
    .replace(/{{shop_name}}/g, SHOP_INFO.name)
    .replace(/{{shop_phone}}/g, SHOP_INFO.phone);

  return (
    <div className="space-y-5 text-right font-kurdish text-slate-800">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-slate-700" />
              بیرخەرەوە و داڕشتەی پەیامە کوردییەکان
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ناردنی پەیامی کوردی ئامادەکراو بە واتسئەپ بۆ ئاگادارکردنەوەی خاوەن ئۆتۆمبێلەکان لە کاتی گۆڕینی ڕۆن.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'queue'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              سەرەی بیرخەرەوەکان ({reminders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              داڕشتەی پەیامەکان
            </button>
          </div>
        </div>

        {/* Counter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center justify-between shadow-2xs">
            <span className="text-rose-800 font-medium">کاتی بەسەرچووە:</span>
            <strong className="text-rose-900 font-mono text-sm font-bold">{overdueCount} ئۆتۆمبێل</strong>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center justify-between shadow-2xs">
            <span className="text-amber-800 font-medium">نزیکبووەتەوە (١٤ ڕۆژ):</span>
            <strong className="text-amber-900 font-mono text-sm font-bold">{upcomingCount} ئۆتۆمبێل</strong>
          </div>

          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center justify-between shadow-2xs">
            <span className="text-emerald-800 font-medium">پەیام نێردراوە:</span>
            <strong className="text-emerald-900 font-mono text-sm font-bold">{sentCount} دانە</strong>
          </div>
        </div>

        {/* TAB 1: REMINDERS QUEUE */}
        {activeTab === 'queue' && (
          <div className="space-y-3">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 text-xs rounded-lg border transition cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                هەمووی ({reminders.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterType('overdue')}
                className={`px-3 py-1 text-xs rounded-lg border transition cursor-pointer ${
                  filterType === 'overdue'
                    ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                بەسەرچووەکان ({overdueCount})
              </button>

              <button
                type="button"
                onClick={() => setFilterType('upcoming')}
                className={`px-3 py-1 text-xs rounded-lg border transition cursor-pointer ${
                  filterType === 'upcoming'
                    ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                نزیکبووەوەکان ({upcomingCount})
              </button>
            </div>

            <div className="space-y-2">
              {filteredReminders.map((rem) => {
                const cust = customers.find((c) => c.id === rem.customerId);
                const veh = vehicles.find((v) => v.id === rem.vehicleId);

                return (
                  <div
                    key={rem.id}
                    className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {veh?.licensePlate}
                        </span>
                        <strong className="text-slate-900">{cust?.fullName}</strong>
                        <span className="text-slate-500 font-mono" dir="ltr">({cust?.phone})</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{rem.renderedMessage}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleDispatch(rem)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        ناردن بە واتسئەپ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: TEMPLATES EDITOR IN KURDISH */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            {savedAlert && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>داڕشتەی پەیامە کوردییەکە بە سەرکەوتوویی پاشەکەوت کرا.</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Kurdish Templates List (5 cols) */}
              <div className="lg:col-span-5 space-y-2">
                <span className="text-xs font-bold text-slate-900 block mb-1">
                  داڕشتە کوردییە ئامادەکراوەکان:
                </span>

                {templates.map((t) => {
                  const isSelected = editingTemplateId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelectTemplate(t)}
                      className={`w-full p-3 rounded-xl border text-right transition text-xs block cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span className={`font-bold block text-xs mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>{t.name}</span>
                      <span className={`text-[11px] block ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        جۆر: {TEMPLATE_TYPE_LABELS[t.type] || t.type}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Template Editor & Live Preview (7 cols) */}
              <div className="lg:col-span-7 bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-900">
                    دەستکاریکردنی دەقی پەیام:
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {TEMPLATE_TYPE_LABELS[selectedTemplate?.type || ''] || ''}
                  </span>
                </div>

                {/* Quick Variable Tag Insertion Buttons */}
                <div>
                  <span className="text-[11px] text-slate-600 block mb-1.5 font-medium">
                    کلیک بکە بۆ دانانی گۆڕاوەکان لەناو دەقەکە:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { tag: 'customer_name', label: '+ ناوی کڕیار' },
                      { tag: 'car_make', label: '+ مارکەی ئۆتۆمبێل' },
                      { tag: 'car_model', label: '+ مۆدێلی ئۆتۆمبێل' },
                      { tag: 'license_plate', label: '+ ژمارەی تابلۆ' },
                      { tag: 'next_service_km', label: '+ کیلۆمەتری داهاتوو' },
                      { tag: 'due_date', label: '+ بەرواری وادە' },
                      { tag: 'last_oil_type', label: '+ جۆری ڕۆن' },
                      { tag: 'shop_name', label: '+ ناوی سێرڤس' },
                      { tag: 'shop_phone', label: '+ تەلەفۆن' },
                    ].map(({ tag, label }) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleInsertTag(tag)}
                        className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-[10px] font-mono transition cursor-pointer shadow-2xs"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <textarea
                  rows={6}
                  value={templateBody}
                  onChange={(e) => setTemplateBody(e.target.value)}
                  className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl p-3 text-xs text-slate-900 leading-relaxed focus:outline-none shadow-2xs"
                />

                {/* Live Preview Box */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-800 block flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    پێشبینینی پەیامەکە کاتێک دەگاتە واتسئەپی کڕیار:
                  </span>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono">
                    {previewRendered}
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  پاشەکەوتکردنی داڕشتەی کوردی
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
