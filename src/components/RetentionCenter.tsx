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
    <div className="space-y-5 text-right font-kurdish text-slate-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-slate-300" />
              بیرخەرەوە و داڕشتەی پەیامە کوردییەکان
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              ناردنی پەیامی کوردی ئامادەکراو بە واتسئەپ بۆ ئاگادارکردنەوەی خاوەن ئۆتۆمبێلەکان لە کاتی گۆڕینی ڕۆن.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'queue'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              سەرەی بیرخەرەوەکان ({reminders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'templates'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              داڕشتەی پەیامەکان
            </button>
          </div>
        </div>

        {/* Counter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">کاتی بەسەرچووە:</span>
            <strong className="text-white font-mono text-sm">{overdueCount} ئۆتۆمبێل</strong>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">نزیکبووەتەوە (١٤ ڕۆژ):</span>
            <strong className="text-white font-mono text-sm">{upcomingCount} ئۆتۆمبێل</strong>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">پەیام نێردراوە:</span>
            <strong className="text-white font-mono text-sm">{sentCount} دانە</strong>
          </div>
        </div>

        {/* TAB 1: REMINDERS QUEUE */}
        {activeTab === 'queue' && (
          <div className="space-y-3">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 text-xs rounded-lg border transition ${
                  filterType === 'all'
                    ? 'bg-slate-800 text-white border-slate-600 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                هەمووی ({reminders.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterType('overdue')}
                className={`px-3 py-1 text-xs rounded-lg border transition ${
                  filterType === 'overdue'
                    ? 'bg-slate-800 text-white border-slate-600 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                بەسەرچووەکان ({overdueCount})
              </button>

              <button
                type="button"
                onClick={() => setFilterType('upcoming')}
                className={`px-3 py-1 text-xs rounded-lg border transition ${
                  filterType === 'upcoming'
                    ? 'bg-slate-800 text-white border-slate-600 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
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
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {veh?.licensePlate}
                        </span>
                        <strong className="text-white">{cust?.fullName}</strong>
                        <span className="text-slate-500 font-mono" dir="ltr">({cust?.phone})</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{rem.renderedMessage}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleDispatch(rem)}
                        className="px-3.5 py-2 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow"
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
              <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-300" />
                <span>داڕشتەی پەیامە کوردییەکە بە سەرکەوتوویی پاشەکەوت کرا.</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Kurdish Templates List (4 cols) */}
              <div className="lg:col-span-5 space-y-2">
                <span className="text-xs font-bold text-slate-300 block mb-1">
                  داڕشتە کوردییە ئامادەکراوەکان:
                </span>

                {templates.map((t) => {
                  const isSelected = editingTemplateId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelectTemplate(t)}
                      className={`w-full p-3 rounded-xl border text-right transition text-xs block ${
                        isSelected
                          ? 'bg-slate-800 border-slate-500 text-white font-bold shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="font-bold text-white block text-xs mb-1">{t.name}</span>
                      <span className="text-[11px] text-slate-400 block">
                        جۆر: {TEMPLATE_TYPE_LABELS[t.type] || t.type}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Template Editor & Live Preview (7 cols) */}
              <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white">
                    دەستکاریکردنی دەقی پەیام:
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {TEMPLATE_TYPE_LABELS[selectedTemplate?.type || ''] || ''}
                  </span>
                </div>

                {/* Quick Variable Tag Insertion Buttons */}
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
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
                        className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-[10px] font-mono transition"
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-slate-600"
                />

                {/* Live Preview Box */}
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-300 block flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    پێشبینینی پەیامەکە کاتێک دەگاتە واتسئەپی کڕیار:
                  </span>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-mono">
                    {previewRendered}
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  className="w-full py-2.5 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs rounded-xl transition shadow"
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
