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
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNewIntake: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
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
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="bg-slate-950/90 px-1.5 py-0.5 rounded-lg border border-slate-800 flex items-center justify-center shrink-0">
              <OmarOilLogo variant="red" size="xs" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight whitespace-nowrap">
                  ئۆمەر ئۆیڵ <span className="text-[10px] text-slate-400 font-normal font-sans">(Omar Oil)</span>
                </h1>
                <span className="text-[10px] text-slate-500 hidden md:inline border-r border-slate-800 pr-1.5">
                  سێرڤس و ڕۆنگۆڕین
                </span>
              </div>
            </div>
          </div>

          {/* Simple Subtle Stats */}
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-400 font-mono">
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

          {/* Right: Role Switcher & Primary Action */}
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

            <button
              type="button"
              onClick={() => setCurrentTab('fast_oil')}
              className="px-3 py-1.5 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-1.5"
            >
              <Droplet className="w-3.5 h-3.5 text-slate-950" />
              <span>پشکنینی نوێ</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 space-x-reverse overflow-x-auto py-1.5 scrollbar-none">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition ${
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
        </nav>
      </div>
    </header>
  );
};
