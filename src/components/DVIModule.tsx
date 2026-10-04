import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { DVIItem, DVIStatus } from '../types';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Car,
} from 'lucide-react';

interface DVIModuleProps {
  initialWorkOrderId?: string;
  onOpenCustomerPortal?: (woId: string) => void;
}

export const DVIModule: React.FC<DVIModuleProps> = ({
  initialWorkOrderId,
  onOpenCustomerPortal,
}) => {
  const {
    workOrders,
    vehicles,
    updateDVIItemStatus,
    setCustomerPortalWorkOrderId,
  } = useShop();

  const targetWO =
    workOrders.find((w) => w.id === initialWorkOrderId) ||
    workOrders.find((w) => w.status !== 'completed') ||
    workOrders[0];

  const [selectedWOId, setSelectedWOId] = useState<string>(targetWO?.id || '');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const activeWO = workOrders.find((w) => w.id === selectedWOId) || targetWO;
  const activeVehicle = activeWO ? vehicles.find((v) => v.id === activeWO.vehicleId) : undefined;

  if (!activeWO) {
    return (
      <div className="bg-slate-900 p-8 rounded-2xl text-center text-slate-400 font-kurdish text-xs">
        هیچ ئۆتۆمبێلێک لە بەردەستدا نییە بۆ پشکنین.
      </div>
    );
  }

  const CATEGORY_NAMES: Record<string, string> = {
    all: 'هەمووی',
    'Fluids & Leaks': 'شلەکان و دزەکردن',
    'Braking System': 'سیستەمی برێک',
    'Tires & Wheels': 'تایە و ویلەکان',
    'Suspension & Steering': 'دەبڵ و سووکان',
    'Under Hood & Battery': 'پاتری و ناو مەکینە',
  };

  const filteredItems = activeWO.dviItems.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const categories = [
    'all',
    'Fluids & Leaks',
    'Braking System',
    'Tires & Wheels',
    'Suspension & Steering',
    'Under Hood & Battery',
  ];

  const redCount = activeWO.dviItems.filter((i) => i.status === 'red').length;
  const yellowCount = activeWO.dviItems.filter((i) => i.status === 'yellow').length;
  const greenCount = activeWO.dviItems.filter((i) => i.status === 'green').length;

  const handleStatusChange = (itemId: string, newStatus: DVIStatus) => {
    updateDVIItemStatus(activeWO.id, itemId, newStatus);
  };

  return (
    <div className="space-y-5 text-right font-kurdish text-slate-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-slate-300" />
              پشکنینی گشتی ئۆتۆمبێل (Digital Vehicle Inspection)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              پشکنینی بینراوی خێرا بە سیستەمی سێ-دۆخی (سەوز، زەرد، سوور) بۆ تێبینییەکانی سەلامەتی.
            </p>
          </div>

          {/* Select Work Order & Preview for Customer */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={activeWO.id}
              onChange={(e) => setSelectedWOId(e.target.value)}
              className="text-xs bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 font-mono"
            >
              {workOrders.map((w) => (
                <option key={w.id} value={w.id} className="bg-slate-900">
                  {vehicles.find((v) => v.id === w.vehicleId)?.licensePlate || w.orderNumber}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                if (onOpenCustomerPortal) {
                  onOpenCustomerPortal(activeWO.id);
                } else {
                  setCustomerPortalWorkOrderId(activeWO.id);
                }
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              دیمەنی مۆبایلی کڕیار
            </button>
          </div>
        </div>

        {/* Counter Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">ئۆتۆمبێل:</span>
              <strong className="text-white font-mono text-xs">{activeVehicle?.licensePlate}</strong>
            </div>
            <Car className="w-4 h-4 text-slate-500" />
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">سەلامەت و باش:</span>
              <strong className="text-white font-mono text-xs">{greenCount} بەش</strong>
            </div>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">چاودێری بکرێت:</span>
              <strong className="text-white font-mono text-xs">{yellowCount} بەش</strong>
            </div>
            <AlertTriangle className="w-4 h-4 text-slate-400" />
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">پێویستی بە چارەسەرە:</span>
              <strong className="text-white font-mono text-xs">{redCount} بەش</strong>
            </div>
            <XCircle className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-xl border transition ${
                filterCategory === cat
                  ? 'bg-slate-800 text-white border-slate-600 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {CATEGORY_NAMES[cat] || cat}
            </button>
          ))}
        </div>

        {/* Checklist Items */}
        <div className="space-y-2.5 pt-1">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{item.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ({CATEGORY_NAMES[item.category] || item.category})
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{item.description}</p>
                {item.estimatedCost && item.estimatedCost > 0 && (
                  <span className="text-[10px] font-mono text-slate-300">
                    تێچووی خەمڵێنراو: {item.estimatedCost.toLocaleString()} IQD
                  </span>
                )}
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-1.5 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleStatusChange(item.id, 'green')}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition ${
                    item.status === 'green'
                      ? 'bg-slate-800 border-slate-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'
                  }`}
                >
                  باشە ✓
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(item.id, 'yellow')}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition ${
                    item.status === 'yellow'
                      ? 'bg-slate-800 border-slate-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'
                  }`}
                >
                  کەمێک کۆنە !
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(item.id, 'red')}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition ${
                    item.status === 'red'
                      ? 'bg-slate-800 border-slate-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'
                  }`}
                >
                  تێکچووە ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
