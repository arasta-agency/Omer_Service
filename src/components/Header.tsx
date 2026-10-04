import React from 'react';
import { useShop } from '../context/ShopContext';
import { UserRole } from '../types';
import { SHOP_INFO } from '../data/mockData';
import { OmarOilLogo } from './OmarOilLogo';
import {
  Droplet,
  Disc,
  ClipboardCheck,
  Boxes,
  Users,
  Bell,
  History,
  UserCheck,
  Zap,
  FileText,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNewIntake: () => void;
  onOpenPresentation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenPresentation,
}) => {
  const { userRole, setUserRole, workOrders, reminders, inventory } = useShop();

  const activeCarsCount = workOrders.filter((w) => w.status !== 'completed').length;
  const overdueRemindersCount = reminders.filter((r) => r.daysDiff < 0).length;
  const lowStockCount = inventory.filter((i) => i.stockQuantity <= i.minThreshold).length;

  const ROLES: { key: UserRole; label: string }[] = [
    { key: 'advisor', label: 'پێشوازی (Advisor)' },
    { key: 'technician', label: 'وەستا (Technician)' },
    { key: 'owner', label: 'خاوەن کار (Owner)' },
    { key: 'inventory', label: 'کۆگا (Inventory)' },
    { key: 'customer', label: 'کڕیار (Customer)' },
  ];

  const NAV_ITEMS = [
    { id: 'fast_oil', label: 'گۆڕینی ڕۆن و پشکنین', icon: Droplet },
    { id: 'archive', label: 'ئەرشیفی ئۆتۆمبێلەکان', icon: History },
    { id: 'oil', label: 'ژووری ڕۆن و لەزگە', icon: Droplet },
    { id: 'tire', label: 'تایە و میزان', icon: Disc },
    { id: 'dvi', label: 'پشکنینی گشتی', icon: ClipboardCheck },
    { id: 'inventory', label: 'کۆگا و پسوولە (POS)', icon: Boxes },
    { id: 'crm', label: 'کڕیاران', icon: Users },
    { id: 'retention', label: 'بیرخەرەوە', icon: Bell, badge: overdueRemindersCount },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 text-right shadow-xs w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-14 border-b border-slate-100 gap-1.5 sm:gap-3 w-full max-w-full overflow-hidden">
          {/* Logo & Brand + Employee Account Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            {/* Logo */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
              <div className="flex items-center justify-center shrink-0">
                <OmarOilLogo variant="red" size="xs" />
              </div>
              <div className="min-w-0 leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-900 tracking-tight truncate">
                    عومەر ئۆیڵ
                  </span>
                </div>
                <p className="text-[8px] sm:text-[8.5px] text-slate-500 truncate hidden xs:block">
                  ڕانیە • شەقامی سەرەکی
                </p>
              </div>
            </div>

            {/* Employee Role / Account Selector - Positioned next to logo */}
            <div className="flex items-center bg-slate-50 px-2 py-1 rounded-xl border border-slate-200 text-xs shadow-2xs shrink-0">
              <UserCheck className="w-3.5 h-3.5 text-slate-600 ml-1 shrink-0" />
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="bg-transparent text-[11px] sm:text-xs text-slate-800 font-bold focus:outline-none cursor-pointer max-w-[105px] xs:max-w-[140px] sm:max-w-none text-right"
              >
                {ROLES.map((r) => (
                  <option key={r.key} value={r.key} className="bg-white text-slate-900">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Simple Subtle Stats */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-slate-500 font-mono">
            <div>
              ئۆتۆمبێل لە کاردا: <span className="text-slate-900 font-bold">{activeCarsCount}</span>
            </div>
            {overdueRemindersCount > 0 && (
              <div>
                کاتی ڕۆن بەسەرچوو: <span className="text-rose-600 font-bold">{overdueRemindersCount}</span>
              </div>
            )}
            {lowStockCount > 0 && (
              <div>
                کەمبوونی کۆگا: <span className="text-amber-600 font-bold">{lowStockCount}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onOpenPresentation && (
              <button
                type="button"
                onClick={onOpenPresentation}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-lg transition cursor-pointer shadow-2xs shrink-0"
                title="پرێزێنتەیشنی سیستەم بە کوردی سۆرانی و داگرتنی وەک PDF"
              >
                <FileText className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>پرێزێنتەیشن (PDF)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setCurrentTab('fast_oil')}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] sm:text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
            >
              <Droplet className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="whitespace-nowrap">پشکنینی نوێ</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar - Smooth horizontal scroll on mobile */}
        <nav className="flex space-x-1 space-x-reverse overflow-x-auto py-1.5 scrollbar-none items-center justify-between flex-nowrap shrink-0 touch-pan-x w-full max-w-full">
          <div className="flex space-x-1 space-x-reverse flex-nowrap shrink-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs rounded-lg whitespace-nowrap transition cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 rounded-full font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {onOpenPresentation && (
            <button
              type="button"
              onClick={onOpenPresentation}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 text-xs text-rose-700 hover:text-rose-800 font-bold transition whitespace-nowrap shrink-0"
            >
              <FileText className="w-3 h-3" />
              <span>پێشکەشکردنی سیستەم (PDF)</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
