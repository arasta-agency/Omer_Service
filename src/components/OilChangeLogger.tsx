import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  OilServiceRecord,
  OilViscosity,
  OilCategory,
  FluidCondition,
  FilterCondition,
  Vehicle,
} from '../types';
import {
  Droplet,
  Calendar,
  Gauge,
  CheckCircle2,
  Printer,
  Save,
  Car,
  Filter,
  Check,
} from 'lucide-react';

interface OilChangeLoggerProps {
  initialWorkOrderId?: string;
  onSavedSuccess?: (record: OilServiceRecord) => void;
}

export const OilChangeLogger: React.FC<OilChangeLoggerProps> = ({
  initialWorkOrderId,
  onSavedSuccess,
}) => {
  const {
    workOrders,
    vehicles,
    customers,
    saveOilService,
    setStickerModalRecord,
    deductInventoryForOil,
  } = useShop();

  const targetWO =
    workOrders.find((w) => w.id === initialWorkOrderId) ||
    workOrders.find((w) => w.status !== 'completed') ||
    workOrders[0];

  const currentVehicle: Vehicle | undefined = targetWO
    ? vehicles.find((v) => v.id === targetWO.vehicleId)
    : vehicles[0];

  const [selectedWOId, setSelectedWOId] = useState<string>(targetWO?.id || '');
  const [currentOdo, setCurrentOdo] = useState<number>(
    targetWO?.oilRecord?.currentOdometer || currentVehicle?.currentOdometer || 50000
  );
  const [viscosity, setViscosity] = useState<OilViscosity>(
    targetWO?.oilRecord?.oilViscosity || '5W-30'
  );
  const [category, setCategory] = useState<OilCategory>(
    targetWO?.oilRecord?.oilCategory || 'Full Synthetic'
  );
  const [brand, setBrand] = useState<string>(
    targetWO?.oilRecord?.oilBrand || 'کاسترۆڵ Castrol EDGE 5W-30'
  );
  const [volumeLiters, setVolumeLiters] = useState<number>(
    targetWO?.oilRecord?.volumeUsedLiters || 4.5
  );
  const [filterPartNo, setFilterPartNo] = useState<string>(
    targetWO?.oilRecord?.oilFilterPartNumber || 'فلتەری ئەسڵی OEM'
  );

  const [intervalKm, setIntervalKm] = useState<number>(
    targetWO?.oilRecord?.serviceIntervalKm || 8000
  );
  const [intervalMonths, setIntervalMonths] = useState<number>(
    targetWO?.oilRecord?.serviceIntervalMonths || 6
  );
  const [serviceDate, setServiceDate] = useState<string>(
    targetWO?.oilRecord?.serviceDate || new Date().toISOString().split('T')[0]
  );

  const [auxFluids, setAuxFluids] = useState(
    targetWO?.oilRecord?.auxiliaryFluids || {
      brakeFluid: 'ok' as FluidCondition,
      transmissionFluid: 'ok' as FluidCondition,
      coolant: 'ok' as FluidCondition,
      powerSteering: 'ok' as FluidCondition,
    }
  );

  const [auxFilters, setAuxFilters] = useState(
    targetWO?.oilRecord?.auxiliaryFilters || {
      airFilter: 'clean' as FilterCondition,
      cabinFilter: 'clean' as FilterCondition,
    }
  );

  const [technicianName, setTechnicianName] = useState(
    targetWO?.assignedTechnician || 'وەستا'
  );
  const [notes, setNotes] = useState(targetWO?.oilRecord?.notes || '');
  const [savedNotification, setSavedNotification] = useState(false);

  useEffect(() => {
    const wo = workOrders.find((w) => w.id === selectedWOId);
    if (wo) {
      const v = vehicles.find((veh) => veh.id === wo.vehicleId);
      if (v) {
        setCurrentOdo(wo.oilRecord?.currentOdometer || v.currentOdometer);
      }
      if (wo.oilRecord) {
        setViscosity(wo.oilRecord.oilViscosity);
        setCategory(wo.oilRecord.oilCategory);
        setBrand(wo.oilRecord.oilBrand);
        setVolumeLiters(wo.oilRecord.volumeUsedLiters);
        setFilterPartNo(wo.oilRecord.oilFilterPartNumber);
        setIntervalKm(wo.oilRecord.serviceIntervalKm);
        setIntervalMonths(wo.oilRecord.serviceIntervalMonths);
        setAuxFluids(wo.oilRecord.auxiliaryFluids);
        setAuxFilters(wo.oilRecord.auxiliaryFilters);
        setNotes(wo.oilRecord.notes || '');
      }
    }
  }, [selectedWOId, workOrders, vehicles]);

  const nextServiceOdo = Number(currentOdo) + Number(intervalKm);
  const calculatedNextDate = (() => {
    const base = serviceDate ? new Date(serviceDate) : new Date();
    const d = new Date(base);
    d.setMonth(d.getMonth() + Number(intervalMonths));
    return d.toISOString().split('T')[0];
  })();

  const handleSave = (printImmediately = false) => {
    const wo = workOrders.find((w) => w.id === selectedWOId) || targetWO;
    if (!wo) return;

    const savedRecord = saveOilService(wo.id, {
      vehicleId: wo.vehicleId,
      customerId: wo.customerId,
      serviceDate,
      currentOdometer: currentOdo,
      odometerUnit: 'km',
      oilBrand: brand,
      oilViscosity: viscosity,
      oilCategory: category,
      volumeUsedLiters: volumeLiters,
      oilFilterPartNumber: filterPartNo,
      auxiliaryFluids: auxFluids,
      auxiliaryFilters: auxFilters,
      serviceIntervalKm: intervalKm,
      serviceIntervalMonths: intervalMonths,
      nextServiceOdometer: nextServiceOdo,
      nextServiceDate: calculatedNextDate,
      technicianName,
      stickerPrinted: printImmediately,
      notes,
    });

    deductInventoryForOil(`OIL-BULK-${viscosity}`, volumeLiters);

    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 4000);

    if (onSavedSuccess) onSavedSuccess(savedRecord);
    if (printImmediately) setStickerModalRecord(savedRecord);
  };

  const currentCustomer = currentVehicle
    ? customers.find((c) => c.id === currentVehicle.customerId)
    : undefined;

  return (
    <div className="space-y-5 text-right font-kurdish text-slate-200">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Droplet className="w-5 h-5 text-slate-300" />
              ژووری تایبەتمەندییەکانی ڕۆن و لەزگە (Oil Service Specs)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              هەڵبژاردنی ئۆتۆمبێل، دیاریکردنی وردەکاریی شلە و فلتەرەکان، و هەژمارکردنی خۆکاری وادەی داهاتوو.
            </p>
          </div>

          {/* Vehicle Selector */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Car className="w-4 h-4 text-slate-400" />
            <select
              value={selectedWOId}
              onChange={(e) => setSelectedWOId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {workOrders.map((wo) => {
                const v = vehicles.find((veh) => veh.id === wo.vehicleId);
                const c = customers.find((cust) => cust.id === wo.customerId);
                return (
                  <option key={wo.id} value={wo.id} className="bg-slate-900 text-white">
                    {v?.licensePlate} — {v?.make} {v?.model} ({c?.fullName})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {savedNotification && (
          <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-300" />
            <span>سەرجەم زانیارییەکانی ڕۆنگۆڕین بە سەرکەوتوویی پاشەکەوت کران.</span>
          </div>
        )}

        {/* Main Grid: Form Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Odometer, Oil Brand & Viscosity (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Odometer Section */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                ١. کیلۆمەتری ئێستا (Current Odometer):
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">کیلۆمەتری سەر داشبۆرد</span>
                  <input
                    type="number"
                    value={currentOdo}
                    onChange={(e) => setCurrentOdo(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-slate-600"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">بەرواری سێرڤس</span>
                  <input
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Oil Specs */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                ٢. مارکەی ڕۆن و پلەی خەستی (Oil Specs):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">مارکەی ڕۆن (Brand)</span>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-600"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">جۆری ڕۆن (Category)</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as OilCategory)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-600"
                  >
                    <option value="Full Synthetic">فول سینسەتیک (Full Synthetic)</option>
                    <option value="Semi-Synthetic">سیمی سینسەتیک (Semi-Synthetic)</option>
                    <option value="Conventional">ئاسایی (Conventional)</option>
                  </select>
                </div>
              </div>

              {/* Viscosity Buttons */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5">پلەی خەستی (Viscosity):</span>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {(['5W-30', '0W-20', '5W-20', '5W-40', '10W-40', '20W-50', '0W-16'] as OilViscosity[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setViscosity(v)}
                      className={`py-1.5 text-xs font-mono font-semibold rounded-lg border transition ${
                        viscosity === v
                          ? 'bg-slate-200 text-slate-950 border-white'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume & Filter Part Number */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">بڕی ڕۆن (لیتر)</span>
                  <input
                    type="number"
                    step="0.5"
                    value={volumeLiters}
                    onChange={(e) => setVolumeLiters(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-white text-center"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">کۆدی فلتەری ڕۆن</span>
                  <input
                    type="text"
                    value={filterPartNo}
                    onChange={(e) => setFilterPartNo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Aux Fluids & Filters */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                ٣. پشکنینی شلە و فلتەرە لاوەکییەکان (Fluid &amp; Filter Checks):
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {/* Brake Fluid */}
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">ڕۆنی برێک</span>
                  <select
                    value={auxFluids.brakeFluid}
                    onChange={(e) => setAuxFluids({ ...auxFluids, brakeFluid: e.target.value as FluidCondition })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-white"
                  >
                    <option value="ok">باشە ✓</option>
                    <option value="low">کەمە</option>
                    <option value="dirty">پیسە</option>
                    <option value="replaced">گۆڕدرا</option>
                  </select>
                </div>

                {/* Coolant */}
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">ئاوی ڕادێتەر</span>
                  <select
                    value={auxFluids.coolant}
                    onChange={(e) => setAuxFluids({ ...auxFluids, coolant: e.target.value as FluidCondition })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-white"
                  >
                    <option value="ok">باشە ✓</option>
                    <option value="low">کەمە</option>
                    <option value="dirty">پیسە</option>
                    <option value="replaced">گۆڕدرا</option>
                  </select>
                </div>

                {/* Air Filter */}
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">فلتەری هەوا</span>
                  <select
                    value={auxFilters.airFilter}
                    onChange={(e) => setAuxFilters({ ...auxFilters, airFilter: e.target.value as FilterCondition })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-white"
                  >
                    <option value="clean">پاکە ✓</option>
                    <option value="dirty">پیسە</option>
                    <option value="replaced">گۆڕدرا</option>
                  </select>
                </div>

                {/* Cabin Filter */}
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">فلتەری تەبرید</span>
                  <select
                    value={auxFilters.cabinFilter}
                    onChange={(e) => setAuxFilters({ ...auxFilters, cabinFilter: e.target.value as FilterCondition })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-white"
                  >
                    <option value="clean">پاکە ✓</option>
                    <option value="dirty">پیسە</option>
                    <option value="replaced">گۆڕدرا</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Return Calculation Engine & Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Return Calculation Engine */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <label className="text-xs font-bold text-slate-300 block">
                ٤. هەژمارکردنی خۆکاری وادەی داهاتوو:
              </label>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">ماوەی گۆڕینی داهاتوو (کم)</span>
                  <select
                    value={intervalKm}
                    onChange={(e) => setIntervalKm(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value={5000}>٥,٠٠٠ کم</option>
                    <option value={8000}>٨,٠٠٠ کم</option>
                    <option value={10000}>١٠,٠٠٠ کم</option>
                    <option value={12000}>١٢,٠٠٠ کم</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">ماوە بە مانگ</span>
                  <select
                    value={intervalMonths}
                    onChange={(e) => setIntervalMonths(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value={3}>٣ مانگ</option>
                    <option value={6}>٦ مانگ</option>
                    <option value={12}>١٢ مانگ (١ ساڵ)</option>
                  </select>
                </div>
              </div>

              {/* Calculated Results Box */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">کیلۆمەتری داهاتوو:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {nextServiceOdo.toLocaleString()} KM
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">بەرواری داهاتوو:</span>
                  <span className="font-mono font-semibold text-slate-200">
                    {calculatedNextDate}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">تێبینی وەستا</span>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="هەر تێبینییەکی تایبەت بە بزوێنەر بنووسە..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="w-full py-3 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow"
                >
                  <Printer className="w-4 h-4" />
                  پاشەکەوتکردن و چاپکردنی لەزگە
                </button>

                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  تەنها پاشەکەوتکردن
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
