import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { WorkOrderPriority } from '../types';
import {
  Car,
  X,
  ClipboardList,
} from 'lucide-react';

interface NewIntakeModalProps {
  onClose: () => void;
  onSuccess: (woId: string) => void;
}

export const NewIntakeModal: React.FC<NewIntakeModalProps> = ({ onClose, onSuccess }) => {
  const { customers, vehicles, addWorkOrder } = useShop();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    vehicles.find((v) => v.customerId === customers[0]?.id)?.id || vehicles[0]?.id || ''
  );
  const [priority, setPriority] = useState<WorkOrderPriority>('routine');
  const [technician, setTechnician] = useState('وەستای سێرڤس');
  const [concerns, setConcerns] = useState('');
  const [services, setServices] = useState<string[]>([
    'گۆڕینی ڕۆنی فول سینسەتیک',
    'پشکنینی گشتی ئۆتۆمبێل (DVI)',
    'پشکنینی هەوای تایە و پەستان',
  ]);

  const customerVehicles = vehicles.filter((v) => v.customerId === selectedCustomerId);

  const handleCustomerChange = (custId: string) => {
    setSelectedCustomerId(custId);
    const firstVeh = vehicles.find((v) => v.customerId === custId);
    if (firstVeh) setSelectedVehicleId(firstVeh.id);
  };

  const toggleService = (svc: string) => {
    setServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedVehicleId) return;

    const newWO = addWorkOrder({
      customerId: selectedCustomerId,
      vehicleId: selectedVehicleId,
      priority,
      assignedTechnician: technician,
      requestedServices: services,
      customerConcerns: concerns,
      status: 'ready_pickup',
    });

    onSuccess(newWO.id);
  };

  const serviceOptions = [
    'گۆڕینی ڕۆنی فول سینسەتیک',
    'پشکنینی گشتی ئۆتۆمبێل (DVI)',
    'پشکنینی هەوای تایە و پەستان',
    'میزانی کۆمپیوتەری چوار تایە',
    'گۆڕینی پادی فڕێن و دیسک',
    'گۆڕینی فلتەری هەوا و تەبرید',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto text-right font-kurdish">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <ClipboardList className="w-5 h-5 text-slate-300" />
            <div>
              <h2 className="text-sm font-bold text-white">وەرگرتنی ئۆتۆمبێل و کارتی سێرڤس</h2>
              <p className="text-[11px] text-slate-400">تۆمارکردنی خزمەتگوزاری بۆ ئۆتۆمبێل</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Customer & Vehicle selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1">هەڵبژاردنی کڕیار</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">ئۆتۆمبێلی کڕیار</label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              >
                {customerVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.licensePlate} - {v.make} {v.model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-slate-300 block mb-1">پێشینەی کار (Priority)</label>
            <div className="flex gap-2">
              {[
                { key: 'routine' as const, label: 'ئاسایی' },
                { key: 'urgent' as const, label: 'بەپەلە' },
                { key: 'fleet' as const, label: 'فلیت / کۆمپانیا' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPriority(key)}
                  className={`flex-1 py-1.5 rounded-xl border text-xs transition ${
                    priority === key
                      ? 'bg-slate-800 border-slate-500 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Services Checklist */}
          <div>
            <label className="text-slate-300 block mb-1.5">خزمەتگوزارییە داواکراوەکان:</label>
            <div className="grid grid-cols-2 gap-2">
              {serviceOptions.map((svc) => {
                const isSelected = services.includes(svc);
                return (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => toggleService(svc)}
                    className={`p-2.5 rounded-xl border text-right transition ${
                      isSelected
                        ? 'bg-slate-800 border-slate-500 text-white font-medium'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {svc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Concerns */}
          <div>
            <label className="text-slate-300 block mb-1">تێبینی خاوەن ئۆتۆمبێل</label>
            <textarea
              rows={2}
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              placeholder="تێبینی بنووسە..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs rounded-xl transition shadow"
            >
              تۆمارکردنی کارتی سێرڤس
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition"
            >
              داخستن
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
