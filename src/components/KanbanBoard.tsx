import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority } from '../types';
import {
  Clock,
  Car,
  User,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Printer,
  Sparkles,
  ExternalLink,
  Receipt,
  Wrench,
  Search,
  Filter,
  Plus,
  ShieldAlert,
} from 'lucide-react';

interface KanbanBoardProps {
  onOpenOilModule?: (woId: string) => void;
  onOpenTireModule?: (woId: string) => void;
  onOpenDVIModule?: (woId: string) => void;
  onOpenInvoiceModal?: (woId: string) => void;
  onOpenNewIntake?: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  onOpenOilModule,
  onOpenTireModule,
  onOpenDVIModule,
  onOpenInvoiceModal,
  onOpenNewIntake,
}) => {
  const {
    workOrders,
    vehicles,
    customers,
    updateWorkOrderStatus,
    setStickerModalRecord,
    setCustomerPortalWorkOrderId,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const COLUMNS: { status: WorkOrderStatus; title: string; color: string; badgeBg: string }[] = [
    { status: 'intake', title: 'سەرە و چاوەڕوانی (Queue)', color: 'border-blue-500/40', badgeBg: 'bg-blue-500/10 text-blue-400' },
    { status: 'in_progress', title: 'لەسەر جاک / بەتاڵکردنەوە و تێکردن', color: 'border-cyan-500/40', badgeBg: 'bg-cyan-500/10 text-cyan-400' },
    { status: 'waiting_parts', title: 'چاوەڕوانی فلتەر / پارچە', color: 'border-rose-500/40', badgeBg: 'bg-rose-500/10 text-rose-400' },
    { status: 'ready_pickup', title: 'لەزگە لکێنرا و ئامادەیە', color: 'border-emerald-500/40', badgeBg: 'bg-emerald-500/10 text-emerald-400' },
    { status: 'completed', title: 'تەواوبوو و دەڕوات', color: 'border-slate-700', badgeBg: 'bg-slate-800 text-slate-400' },
  ];

  const getNextStatus = (current: WorkOrderStatus): WorkOrderStatus | null => {
    const sequence: WorkOrderStatus[] = [
      'intake',
      'in_progress',
      'ready_pickup',
      'completed',
    ];
    const idx = sequence.indexOf(current);
    if (idx !== -1 && idx < sequence.length - 1) return sequence[idx + 1];
    return null;
  };

  const getPrevStatus = (current: WorkOrderStatus): WorkOrderStatus | null => {
    const sequence: WorkOrderStatus[] = [
      'intake',
      'in_progress',
      'ready_pickup',
      'completed',
    ];
    const idx = sequence.indexOf(current);
    if (idx > 0) return sequence[idx - 1];
    return null;
  };

  const filteredOrders = workOrders.filter((wo) => {
    const vehicle = vehicles.find((v) => v.id === wo.vehicleId);
    const customer = customers.find((c) => c.id === wo.customerId);

    const matchesSearch =
      wo.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle?.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle?.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.phone.includes(searchQuery);

    const matchesPriority = filterPriority === 'all' || wo.priority === filterPriority;

    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6 text-right">
      {/* Top Controls: Search, Priority filter, Quick Intake Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="گەڕان بەپێی تابلۆ، ژمارەی کارتی سێرڤس، یان ناوی کڕیار..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              پێشینەی کار:
            </span>
            {[
              { key: 'all', label: 'هەموو' },
              { key: 'routine', label: 'ئاسایی' },
              { key: 'urgent', label: 'بەپەلە' },
              { key: 'fleet', label: 'کۆمپانیا' },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilterPriority(key)}
                className={`px-2.5 py-1 text-xs rounded-lg transition border ${
                  filterPriority === key
                    ? 'bg-amber-400 text-slate-950 font-bold border-amber-300'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {onOpenNewIntake && (
          <button
            type="button"
            onClick={onOpenNewIntake}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            وەرگرتنی ئۆتۆمبێلی نوێ
          </button>
        )}
      </div>

      {/* Kanban Board Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800">
        {COLUMNS.map((col) => {
          const colOrders = filteredOrders.filter((wo) => wo.status === col.status);

          return (
            <div
              key={col.status}
              className="w-80 shrink-0 bg-slate-900/60 rounded-3xl border border-slate-800 flex flex-col max-h-[820px]"
            >
              {/* Column Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${col.badgeBg}`}>
                    {col.title}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                    {colOrders.length}
                  </span>
                </div>
              </div>

              {/* Column Cards List */}
              <div className="p-3 space-y-3 overflow-y-auto flex-1">
                {colOrders.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                    لە ئێستادا هیچ ئۆتۆمبێلێک لەم بەشەدا نییە.
                  </div>
                ) : (
                  colOrders.map((wo) => {
                    const vehicle = vehicles.find((v) => v.id === wo.vehicleId);
                    const customer = customers.find((c) => c.id === wo.customerId);
                    const isUrgent = wo.priority === 'urgent';
                    const isFleet = wo.priority === 'fleet';
                    const nextSt = getNextStatus(wo.status);
                    const prevSt = getPrevStatus(wo.status);

                    return (
                      <div
                        key={wo.id}
                        className={`bg-slate-950 rounded-2xl p-4 border transition-all hover:border-slate-600 shadow-md space-y-3 relative group ${
                          isUrgent
                            ? 'border-red-500/50'
                            : isFleet
                            ? 'border-indigo-500/50'
                            : 'border-slate-800'
                        }`}
                      >
                        {/* Top Card Line: Order number & Priority */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-300">
                            {wo.orderNumber}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {isUrgent && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                                <ShieldAlert className="w-3 h-3" /> بەپەلە
                              </span>
                            )}
                            {isFleet && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                کۆمپانیا
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-slate-500">
                              {wo.intakeDate.split(' ')[1] || '09:00'}
                            </span>
                          </div>
                        </div>

                        {/* Vehicle & Plate Highlight */}
                        <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                          <div>
                            <span className="font-mono font-black text-xs text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-700 inline-block mb-1">
                              {vehicle?.licensePlate || 'تابلۆ'}
                            </span>
                            <h4 className="font-bold text-xs text-slate-200">
                              {vehicle?.make} {vehicle?.model}
                            </h4>
                          </div>
                          <Car className="w-5 h-5 text-slate-500" />
                        </div>

                        {/* Customer & Tech */}
                        <div className="text-xs space-y-1 text-slate-400">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-500" />
                              {customer?.fullName}
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-400 uppercase font-mono">
                              {customer?.preferredChannel}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>وەستا: <strong className="text-slate-200">{wo.assignedTechnician}</strong></span>
                            <span>ڕادەستکردن: <strong className="text-slate-300">{wo.promisedDate.split(' ')[1] || '16:00'}</strong></span>
                          </div>
                        </div>

                        {/* Requested Services Tags */}
                        <div className="flex flex-wrap gap-1">
                          {wo.requestedServices.map((svc, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800"
                            >
                              {svc}
                            </span>
                          ))}
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="pt-2 border-t border-slate-900 grid grid-cols-2 gap-1.5">
                          {/* Bay logging */}
                          <button
                            type="button"
                            onClick={() => onOpenOilModule && onOpenOilModule(wo.id)}
                            className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-[11px] font-medium rounded-lg border border-slate-800 flex items-center justify-center gap-1 transition"
                          >
                            <Wrench className="w-3 h-3 text-amber-400" />
                            سێرڤسی ڕۆن
                          </button>

                          {/* DVI Inspection / Customer Link */}
                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenDVIModule) onOpenDVIModule(wo.id);
                              else setCustomerPortalWorkOrderId(wo.id);
                            }}
                            className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-[11px] font-medium rounded-lg border border-slate-800 flex items-center justify-center gap-1 transition"
                          >
                            <ExternalLink className="w-3 h-3 text-emerald-400" />
                            پشکنینی DVI
                          </button>

                          {/* Print Sticker */}
                          {wo.oilRecord && (
                            <button
                              type="button"
                              onClick={() => setStickerModalRecord(wo.oilRecord || null)}
                              className="py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold rounded-lg border border-amber-500/30 flex items-center justify-center gap-1 transition col-span-2"
                            >
                              <Printer className="w-3 h-3" />
                              چاپکردنی لەزگەی جام
                            </button>
                          )}

                          {/* POS / Invoice */}
                          {wo.status === 'ready_pickup' && (
                            <button
                              type="button"
                              onClick={() => onOpenInvoiceModal && onOpenInvoiceModal(wo.id)}
                              className="py-1.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-bold rounded-lg border border-emerald-500/30 flex items-center justify-center gap-1 transition col-span-2"
                            >
                              <Receipt className="w-3 h-3" />
                              حسابات و دەرکردنی وەسڵ
                            </button>
                          )}
                        </div>

                        {/* Status Shift Controls */}
                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                          {prevSt ? (
                            <button
                              type="button"
                              onClick={() => updateWorkOrderStatus(wo.id, prevSt)}
                              className="hover:text-slate-300 flex items-center gap-0.5"
                            >
                              <ChevronRight className="w-3 h-3" /> قۆناغی پێشوو
                            </button>
                          ) : (
                            <div />
                          )}

                          {nextSt ? (
                            <button
                              type="button"
                              onClick={() => updateWorkOrderStatus(wo.id, nextSt)}
                              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-0.5"
                            >
                              قۆناغی دواتر <ChevronLeft className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> تەواوبوو
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

