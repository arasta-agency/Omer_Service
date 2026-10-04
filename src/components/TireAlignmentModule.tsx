import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  TireInspectionRecord,
  TirePosition,
  TireMeasurement,
  TireWearPattern,
  TireRecommendedAction,
} from '../types';
import { INITIAL_TIRE_INSPECTION } from '../data/mockData';
import {
  Disc,
  CheckCircle2,
  Save,
  Gauge,
  Car,
  AlertCircle,
} from 'lucide-react';

interface TireAlignmentModuleProps {
  initialWorkOrderId?: string;
  onSavedSuccess?: (rec: TireInspectionRecord) => void;
}

export const TireAlignmentModule: React.FC<TireAlignmentModuleProps> = ({
  initialWorkOrderId,
  onSavedSuccess,
}) => {
  const { workOrders, vehicles, saveTireInspection } = useShop();

  const targetWO =
    workOrders.find((w) => w.id === initialWorkOrderId) ||
    workOrders.find((w) => w.status !== 'completed') ||
    workOrders[0];

  const currentVehicle = targetWO ? vehicles.find((v) => v.id === targetWO.vehicleId) : undefined;

  const [activeTab, setActiveTab] = useState<TirePosition>('front_left');
  const [tiresData, setTiresData] = useState<Record<TirePosition, TireMeasurement>>(
    targetWO?.tireRecord?.tires || INITIAL_TIRE_INSPECTION.tires
  );
  const [recommendedActions, setRecommendedActions] = useState<TireRecommendedAction[]>(
    targetWO?.tireRecord?.recommendedActions || ['wheel_alignment', 'replacement']
  );
  const [techNotes, setTechNotes] = useState<string>(
    targetWO?.tireRecord?.technicianNotes ||
      'تایەی دواوەی لای ڕاست نزیکە لە کۆتایی هاتنی نەخشەکە. پێویستی بە میزانی تەوەرە هەیە.'
  );
  const [savedAlert, setSavedAlert] = useState(false);

  const activeTire = tiresData[activeTab];

  const evaluateDepthStatus = (inner: number, center: number, outer: number): 'green' | 'yellow' | 'red' => {
    const minVal = Math.min(inner, center, outer);
    if (minVal < 2.5) return 'red';
    if (minVal < 4.0) return 'yellow';
    return 'green';
  };

  const handleTireValueChange = (
    position: TirePosition,
    field: keyof TireMeasurement,
    value: any
  ) => {
    setTiresData((prev) => {
      const updatedTire = { ...prev[position], [field]: value };
      if (field === 'innerMm' || field === 'centerMm' || field === 'outerMm') {
        updatedTire.healthStatus = evaluateDepthStatus(
          Number(updatedTire.innerMm),
          Number(updatedTire.centerMm),
          Number(updatedTire.outerMm)
        );
      }
      return {
        ...prev,
        [position]: updatedTire,
      };
    });
  };

  const toggleAction = (action: TireRecommendedAction) => {
    if (recommendedActions.includes(action)) {
      setRecommendedActions(recommendedActions.filter((a) => a !== action));
    } else {
      setRecommendedActions([...recommendedActions, action]);
    }
  };

  const handleSave = () => {
    if (!targetWO) return;

    const fullRecord: TireInspectionRecord = {
      id: targetWO.tireRecord?.id || `tire-rec-${Date.now()}`,
      workOrderId: targetWO.id,
      vehicleId: targetWO.vehicleId,
      inspectionDate: new Date().toISOString().split('T')[0],
      tires: tiresData,
      recommendedActions,
      technicianNotes: techNotes,
    };

    saveTireInspection(targetWO.id, fullRecord);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 4000);
    if (onSavedSuccess) onSavedSuccess(fullRecord);
  };

  const POSITION_LABELS: Record<TirePosition, { title: string; subtitle: string }> = {
    front_left: { title: 'پێشەوە لای چەپ (FL)', subtitle: 'تایەی شوفێر' },
    front_right: { title: 'پێشەوە لای ڕاست (FR)', subtitle: 'تایەی سەرنشین' },
    rear_left: { title: 'دواوە لای چەپ (RL)', subtitle: 'تایەی دواوە لای چەپ' },
    rear_right: { title: 'دواوە لای ڕاست (RR)', subtitle: 'تایەی دواوە لای ڕاست' },
    spare: { title: 'ئەستەپنی (Spare)', subtitle: 'تایەی یەدەگ' },
  };

  const WEAR_PATTERNS: { id: TireWearPattern; label: string; desc: string }[] = [
    { id: 'even', label: 'ئاسایی و یەکسان', desc: 'نەخشەی تەندروست بەبێ خواردن' },
    { id: 'camber_wear', label: 'خورانی کامبەر (Camber)', desc: 'کێشەی کامبەری تەوەرە' },
    { id: 'toe_wear', label: 'خورانی میزانی پەنجە (Toe)', desc: 'کێشەی تەوەرەی پێشەوە/دواوە' },
    { id: 'center_overinflation', label: 'خورانی ناوەڕاست', desc: 'هەوای زۆر لە پێویست' },
    { id: 'feathering', label: 'خورانی پلیکانی (Feathering)', desc: 'کێشەی میزانی پەنجەکان' },
    { id: 'shoulder_underinflation', label: 'خورانی شانەکان', desc: 'هەوای کەم لە پێویست' },
  ];

  const ACTIONS_LIST: { id: TireRecommendedAction; label: string }[] = [
    { id: 'rotation', label: 'سووڕاندنەوە و گۆڕینەوەی جێگەی تایەکان (Tire Rotation)' },
    { id: 'balancing', label: 'باڵانسی ئەلیکترۆنی (Wheel Balancing)' },
    { id: 'wheel_alignment', label: 'میزانی کۆمپیوتەری سووکان و تایە (Wheel Alignment)' },
    { id: 'replacement', label: 'گۆڕینی تایەی کۆن بە تایەی نوێ' },
    { id: 'puncture_repair', label: 'چاککردنەوەی پەنچەری (Puncture Repair)' },
  ];

  return (
    <div className="space-y-5 text-right font-kurdish text-slate-800">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Disc className="w-5 h-5 text-slate-700" />
              پشکنینی قووڵایی نەخشەی تایە و میزان (Tire &amp; Alignment)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              پشکنینی ٣ خاڵی قووڵایی نەخشە (ناوەوە، ناوەڕاست، دەرەوە)، پەستانی هەوا (PSI)، و دیاریکردنی جۆری خواردن.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <Car className="w-4 h-4 text-slate-500" />
            <span className="font-mono text-slate-900 font-bold">
              {currentVehicle?.licensePlate || 'ئۆتۆمبێلی دیاریکراو'}
            </span>
          </div>
        </div>

        {savedAlert && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>پشکنینی تایە و میزان بە سەرکەوتوویی پاشەکەوت کرا.</span>
          </div>
        )}

        {/* 5 Wheel Position Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(Object.keys(POSITION_LABELS) as TirePosition[]).map((pos) => {
            const tire = tiresData[pos];
            const isSelected = activeTab === pos;
            const minDepth = Math.min(Number(tire.innerMm), Number(tire.centerMm), Number(tire.outerMm));

            return (
              <button
                key={pos}
                type="button"
                onClick={() => setActiveTab(pos)}
                className={`p-3 rounded-xl border text-right transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{POSITION_LABELS[pos].title}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    isSelected
                      ? 'bg-slate-800 border-slate-700 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    {minDepth} mm
                  </span>
                </div>
                <div className={`text-[11px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  هەوا: {tire.actualPsiAfter} PSI
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Tire Inspection Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
          {/* 3-Point Depth & PSI Measurements (7 cols) */}
          <div className="lg:col-span-7 space-y-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-900">
                پشکنینی {POSITION_LABELS[activeTab].title}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                قووڵایی پێوانەکراو بە میلیمەتر (mm)
              </span>
            </div>

            {/* 3 Point Depth Check */}
            <div>
              <span className="text-[11px] text-slate-600 block mb-2 font-medium">
                ١. پێوانەکردنی قووڵایی نەخشەی تایە لە ٣ خاڵدا:
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">لای ناوەوە (Inner)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={activeTire.innerMm}
                    onChange={(e) => handleTireValueChange(activeTab, 'innerMm', e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 text-center focus:outline-none shadow-2xs"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">ناوەڕاست (Center)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={activeTire.centerMm}
                    onChange={(e) => handleTireValueChange(activeTab, 'centerMm', e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 text-center focus:outline-none shadow-2xs"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">لای دەرەوە (Outer)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={activeTire.outerMm}
                    onChange={(e) => handleTireValueChange(activeTab, 'outerMm', e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 text-center focus:outline-none shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Pressure PSI */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-600 block mb-2 font-medium">
                ٢. پەستانی هەوای تایە (Tire Pressure):
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">هەوای سەرەتا (Before PSI)</span>
                  <input
                    type="number"
                    value={activeTire.actualPsiBefore}
                    onChange={(e) => handleTireValueChange(activeTab, 'actualPsiBefore', Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 text-center focus:outline-none shadow-2xs"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">هەوای ڕێکخراو (After PSI)</span>
                  <input
                    type="number"
                    value={activeTire.actualPsiAfter}
                    onChange={(e) => handleTireValueChange(activeTab, 'actualPsiAfter', Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 text-center focus:outline-none shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Wear Pattern Diagnostics */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-600 block mb-2 font-medium">
                ٣. شێوازی خواردنی تایە (Wear Pattern):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {WEAR_PATTERNS.map((pattern) => {
                  const isSelected = activeTire.wearPattern === pattern.id;
                  return (
                    <button
                      key={pattern.id}
                      type="button"
                      onClick={() => handleTireValueChange(activeTab, 'wearPattern', pattern.id)}
                      className={`p-2.5 rounded-xl border text-right text-xs transition cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-2xs'
                      }`}
                    >
                      <span className="block font-medium">{pattern.label}</span>
                      <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{pattern.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recommended Actions & Save (5 cols) */}
          <div className="lg:col-span-5 space-y-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-2">
              ٤. کارە پێشنیارکراوەکان (Recommendations):
            </span>

            <div className="space-y-2">
              {ACTIONS_LIST.map((action) => {
                const isChecked = recommendedActions.includes(action.id);
                return (
                  <label
                    key={action.id}
                    className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 text-xs cursor-pointer hover:border-slate-300 transition shadow-2xs"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleAction(action.id)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <span className={isChecked ? 'text-slate-900 font-bold' : 'text-slate-600'}>
                      {action.label}
                    </span>
                  </label>
                );
              })}
            </div>

            <div>
              <span className="text-[11px] text-slate-600 font-medium block mb-1">تێبینییەکانی وەستا</span>
              <textarea
                rows={3}
                value={techNotes}
                onChange={(e) => setTechNotes(e.target.value)}
                placeholder="تێبینی لەسەر میزان و دۆخی تایەکان..."
                className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-2xs"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              پاشەکەوتکردنی پشکنینی تایە
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
