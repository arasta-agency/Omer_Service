import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { Vehicle, Customer, WorkOrder, OilServiceRecord } from '../types';
import {
  Search,
  Car,
  User,
  Phone,
  Droplet,
  Calendar,
  Gauge,
  History,
  Printer,
  ChevronDown,
  ChevronUp,
  Tag,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface CarArchiveModuleProps {
  onSelectCarForService?: (vehicle: Vehicle, customer?: Customer) => void;
}

export const CarArchiveModule: React.FC<CarArchiveModuleProps> = ({
  onSelectCarForService,
}) => {
  const {
    vehicles,
    customers,
    workOrders,
    setStickerModalRecord,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'repeat' | 'recent'>('all');
  const [expandedVehicleId, setExpandedVehicleId] = useState<string | null>(null);

  // Group all oil records and visits for each vehicle
  const vehicleArchiveList = useMemo(() => {
    return vehicles.map((v) => {
      const customer = customers.find((c) => c.id === v.customerId);

      // Find all work orders with oil change records for this vehicle
      const vehicleWorkOrders = workOrders.filter(
        (wo) => wo.vehicleId === v.id && wo.oilRecord
      );

      // Collect all oil records from work orders
      const orderOilRecords = vehicleWorkOrders
        .map((wo) => wo.oilRecord!)
        .filter(Boolean);

      // Also account for existing mileage history records
      const mileageLogVisits = v.mileageHistory || [];

      // Total oil change count
      const totalVisitsCount = Math.max(
        orderOilRecords.length,
        mileageLogVisits.length,
        1
      );

      // Latest oil record (if any from work orders)
      const sortedOilRecords = [...orderOilRecords].sort(
        (a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime()
      );
      const latestOilRecord = sortedOilRecords[0];

      return {
        vehicle: v,
        customer,
        workOrders: vehicleWorkOrders,
        oilRecords: sortedOilRecords,
        totalVisits: totalVisitsCount,
        latestOilRecord,
        lastServiceDate: latestOilRecord?.serviceDate || v.mileageHistory?.[0]?.date || v.createdAt.split('T')[0],
        latestViscosity: latestOilRecord?.oilViscosity || '5W-30',
        latestBrand: latestOilRecord?.oilBrand || 'ڕۆنی دیاریکراو',
      };
    });
  }, [vehicles, customers, workOrders]);

  // Filtered cars based on search and selected filter
  const filteredVehicles = useMemo(() => {
    return vehicleArchiveList.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchPlate = item.vehicle.licensePlate.toLowerCase().includes(q);
      const matchOwner = item.customer?.fullName.toLowerCase().includes(q) || false;
      const matchPhone = item.customer?.phone.toLowerCase().includes(q) || false;
      const matchMake = item.vehicle.make.toLowerCase().includes(q);
      const matchModel = item.vehicle.model.toLowerCase().includes(q);

      const matchesSearch =
        q === '' || matchPlate || matchOwner || matchPhone || matchMake || matchModel;

      if (!matchesSearch) return false;

      if (filterType === 'repeat') {
        return item.totalVisits > 1;
      }

      return true;
    });
  }, [vehicleArchiveList, searchQuery, filterType]);

  // Overall Statistics
  const totalVehiclesCount = vehicles.length;
  const totalVisitsCount = vehicleArchiveList.reduce((sum, item) => sum + item.totalVisits, 0);
  const repeatCustomersCount = vehicleArchiveList.filter((item) => item.totalVisits > 1).length;

  return (
    <div className="space-y-5 text-right font-kurdish text-slate-200">
      {/* Top Header & Simple Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-slate-300" />
              ئەرشیفی ئۆتۆمبێلەکان و مێژووی ڕۆنگۆڕین
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              گەڕان بەپێی ژمارەی تابلۆ، ناوی خاوەن، یان مۆبایل بۆ بینینی چەندین جار هاتنی ئۆتۆمبێلەکە و مێژووی گۆڕینی ڕۆن.
            </p>
          </div>

          {/* Simple Counters */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400">ئۆتۆمبێل: </span>
              <strong className="text-white font-bold">{totalVehiclesCount}</strong>
            </div>

            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400">کۆی ڕۆنگۆڕین: </span>
              <strong className="text-white font-bold">{totalVisitsCount} جار</strong>
            </div>

            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 hidden sm:block">
              <span className="text-slate-400">کڕیاری بەردەوام: </span>
              <strong className="text-white font-bold">{repeatCustomersCount}</strong>
            </div>
          </div>
        </div>

        {/* Search Bar & Filter Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="گەڕان بەپێی ژمارەی تابلۆ (21 A 45892)، ناوی خاوەن، مۆبایل، تۆیۆتا، نیسان..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-600"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`flex-1 py-2 text-xs rounded-xl border transition text-center ${
                filterType === 'all'
                  ? 'bg-slate-800 text-white border-slate-600 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              هەمووی ({vehicles.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterType('repeat')}
              className={`flex-1 py-2 text-xs rounded-xl border transition text-center ${
                filterType === 'repeat'
                  ? 'bg-slate-800 text-white border-slate-600 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              زیاتر لە ١ جار ({repeatCustomersCount})
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles Archive List */}
      <div className="space-y-3">
        {filteredVehicles.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-2">
            <Car className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">
              هیچ ئۆتۆمبێلێک نەدۆزرایەوە بەپێی ئەم گەڕانە ({searchQuery}).
            </p>
          </div>
        ) : (
          filteredVehicles.map((item) => {
            const isExpanded = expandedVehicleId === item.vehicle.id;

            return (
              <div
                key={item.vehicle.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 transition hover:border-slate-700"
              >
                {/* Main Card Overview */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Vehicle Identity & Plate */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 shrink-0 mt-0.5">
                      <Car className="w-5 h-5 text-slate-300" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded border ${
                          item.vehicle.licensePlate.includes('علوج')
                            ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                            : 'bg-slate-950 text-white border-slate-800'
                        }`}>
                          {item.vehicle.licensePlate}
                        </span>

                        {item.vehicle.licensePlate.includes('علوج') && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                            علوج
                          </span>
                        )}

                        <h3 className="font-bold text-sm text-white">
                          {item.vehicle.make} {item.vehicle.model}
                        </h3>

                        {/* Visited Count Badge */}
                        <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200">
                          {item.totalVisits} جار هاتووە بۆ ڕۆنگۆڕین
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {item.customer?.fullName || 'خاوەنی نەناسراو'}
                        </span>

                        {item.customer?.phone && (
                          <span className="flex items-center gap-1 font-mono" dir="ltr">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {item.customer.phone}
                          </span>
                        )}

                        <span className="text-slate-500">•</span>

                        <span className="flex items-center gap-1">
                          <Gauge className="w-3.5 h-3.5 text-slate-400" />
                          کیلۆمەتر: <strong className="text-white font-mono">{item.vehicle.currentOdometer.toLocaleString()} KM</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary of Last Oil Service & Actions */}
                  <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
                    <div className="text-left bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                      <span className="text-[10px] text-slate-500 block">دوایین ڕۆنگۆڕین</span>
                      <span className="font-bold text-slate-200 block font-mono">
                        {item.latestViscosity} • {item.lastServiceDate}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedVehicleId(isExpanded ? null : item.vehicle.id)}
                      className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 text-xs font-medium transition flex items-center gap-1.5"
                    >
                      <span>مێژووی سەردانەکان</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {item.latestOilRecord && (
                      <button
                        type="button"
                        onClick={() => setStickerModalRecord(item.latestOilRecord)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition"
                        title="چاپی لەزگە"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expandable Visit Timeline */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-slate-300" />
                        تەواوی جارەکانی گۆڕینی ڕۆن ({item.totalVisits} جار تۆمارکراوە)
                      </span>
                    </div>

                    {/* Timeline Table / Cards */}
                    <div className="space-y-2">
                      {item.oilRecords.length > 0 ? (
                        item.oilRecords.map((rec, index) => (
                          <div
                            key={rec.id}
                            className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-mono font-bold text-[11px] shrink-0">
                                {index + 1}
                              </span>

                              <div>
                                <div className="flex items-center gap-2">
                                  <strong className="text-white font-mono text-xs">
                                    {rec.oilViscosity} — {rec.oilBrand}
                                  </strong>
                                  <span className="text-slate-500 font-mono">({rec.volumeUsedLiters} لیتر)</span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  بەروار: <span className="font-mono text-slate-300">{rec.serviceDate}</span> • کیلۆمەتر: <span className="font-mono text-slate-300">{rec.currentOdometer.toLocaleString()} KM</span> • فلتەر: <span className="text-slate-300">{rec.oilFilterPartNumber}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 self-end sm:self-center">
                              <div className="text-left font-mono text-[11px] bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-slate-300">
                                وادەی داهاتوو: {rec.nextServiceOdometer?.toLocaleString()} KM
                              </div>

                              <button
                                type="button"
                                onClick={() => setStickerModalRecord(rec)}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-medium transition flex items-center gap-1"
                              >
                                <Printer className="w-3 h-3" />
                                چاپکردنی لەزگە
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Fallback to vehicle mileage history records if oilRecords is empty
                        item.vehicle.mileageHistory.map((m, idx) => (
                          <div
                            key={m.id || idx}
                            className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-mono text-[11px]">
                                {idx + 1}
                              </span>
                              <div>
                                <span className="text-white font-semibold">{m.serviceType || 'گۆڕینی ڕۆن'}</span>
                                <span className="text-slate-400 mr-2 font-mono">({m.date})</span>
                              </div>
                            </div>

                            <span className="font-mono text-slate-300 font-bold">
                              {m.odometer.toLocaleString()} {m.unit}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
