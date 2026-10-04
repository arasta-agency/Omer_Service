import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { SHOP_INFO } from '../data/mockData';
import {
  Smartphone,
  CheckCircle2,
  XCircle,
  Car,
  Check,
  Send,
  X,
} from 'lucide-react';

interface CustomerApprovalPortalModalProps {
  workOrderId: string;
  onClose: () => void;
}

export const CustomerApprovalPortalModal: React.FC<CustomerApprovalPortalModalProps> = ({
  workOrderId,
  onClose,
}) => {
  const { workOrders, getCustomerById, getVehicleById, customerToggleDVIItem, updateWorkOrderStatus } = useShop();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const wo = workOrders.find((w) => w.id === workOrderId);
  const vehicle = wo ? getVehicleById(wo.vehicleId) : undefined;
  const customer = wo ? getCustomerById(wo.customerId) : undefined;

  if (!wo || !vehicle || !customer) return null;

  const handleFinalSubmit = () => {
    setHasSubmitted(true);
    updateWorkOrderStatus(wo.id, 'in_progress');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto text-right font-kurdish">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs">
              <Smartphone className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                پۆرتاڵی پەسەندکردنی کڕیار لەسەر مۆبایل
              </h2>
              <p className="text-[11px] text-slate-500">
                {vehicle.licensePlate} • {customer.fullName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 text-xs">
            <span className="font-bold text-slate-900 block">سڵاو، {customer.fullName}</span>
            <p className="text-slate-600 text-[11px]">
              پشکنینی ئۆتۆمبێلەکەت ({vehicle.make} {vehicle.model} - {vehicle.licensePlate}) ئەنجامدرا. دەتوانیت هەر بڕگەیەک پەسەند بکەیت:
            </p>
          </div>

          {/* DVI Items to toggle */}
          <div className="space-y-2">
            {wo.dviItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:border-slate-300 transition"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900">{item.title}</span>
                  <p className="text-[11px] text-slate-500">{item.description}</p>
                  {item.estimatedCost && item.estimatedCost > 0 && (
                    <span className="text-[10px] text-slate-700 font-mono font-medium">
                      تێچوو: {item.estimatedCost.toLocaleString()} IQD
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => customerToggleDVIItem(wo.id, item.id, true)}
                    className={`px-3 py-1 rounded-lg text-xs transition cursor-pointer ${
                      item.customerApproved
                        ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                        : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    پەسەندە ✓
                  </button>

                  <button
                    type="button"
                    onClick={() => customerToggleDVIItem(wo.id, item.id, false)}
                    className={`px-3 py-1 rounded-lg text-xs transition cursor-pointer ${
                      !item.customerApproved
                        ? 'bg-slate-900 text-white font-bold shadow-2xs'
                        : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    پێویست ناکات ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {hasSubmitted ? (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs text-emerald-800 font-medium">
              ✓ وەڵامەکەت بە سەرکەوتوویی بۆ وەستاکان نێردرا و دەستیان بە کار کرد.
            </div>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
            >
              ناردنی ڕەزامەندی کۆتایی بۆ سێرڤس
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
