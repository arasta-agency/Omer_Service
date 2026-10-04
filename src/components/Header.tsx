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
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-14 border-b border-slate-800/80">
          {/* Logo & Brand - Refined, compact & contained so it never spills out of its box */}
          <div className="flex items-center gap-2 bg-slate-950/90 px-2 py-1 rounded-xl border border-slate-800/80 shrink-0 max-w-[200px] sm:max-w-none shadow-sm">
            <div className="flex items-center justify-center shrink-0">
              <OmarOilLogo variant="red" size="xs" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-[11px] sm:text-xs font-bold text-white tracking-tight truncate">
                  عومەر ئۆیڵ
                </span>
                <span className="text-[9px] text-slate-400 font-sans font-medium truncate">
                  (Omar Oil)
                </span>
              </div>
              <p className="text-[8.5px] text-slate-400 truncate">
                ڕانیە • شەقامی سەرەکی سناعە
              </p>
            </div>
          </div>

          {/* Simple Subtle Stats */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-slate-400 font-mono">
            <div>
              ئۆتۆمبێل لە کاردا: <span className="text-white font-semibold">{activeCarsCount}</span>
            </div>
            {overdueRemindersCount > 0 && (
              <div>
                کاتی ڕۆن بەسەرچوو: <span className="text-slate-200 font-semibold">{overdueRemindersCount}</span>
              </div>
            )}
            {lowStockCount > 0 && (
              <div>
                کەمبوونی کۆگا: <span className="text-slate-200 font-semibold">{lowStockCount}</span>
              </div>
            )}
          </div>

          {/* Right: Role Switcher & Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-slate-400 ml-1.5 hidden sm:inline" />
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r.key} value={r.key} className="bg-slate-900 text-white">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {onOpenPresentation && (
              <button
                type="button"
                onClick={onOpenPresentation}
                className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="پرێزێنتەیشنی سیستەم بە کوردی سۆرانی و داگرتنی وەک PDF"
              >
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">پرێزێنتەیشن (PDF)</span>
                <span className="sm:hidden">PDF</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setCurrentTab('fast_oil')}
              className="px-3 py-1.5 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Droplet className="w-3.5 h-3.5 text-slate-950" />
              <span>پشکنینی نوێ</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 space-x-reverse overflow-x-auto py-1.5 scrollbar-none items-center justify-between">
          <div className="flex space-x-1 space-x-reverse">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white font-bold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-[10px] bg-slate-700 text-slate-200 px-1.5 rounded-full font-mono">
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
              className="hidden md:flex items-center gap-1 px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 font-bold transition whitespace-nowrap"
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
