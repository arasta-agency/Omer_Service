import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Customer, Vehicle } from '../types';
import {
  Users,
  Car,
  Phone,
  Gauge,
  Plus,
  Search,
  Check,
  X,
} from 'lucide-react';

export const CustomerVehicleCRM: React.FC = () => {
  const { customers, vehicles, getCustomerVehicles, addCustomer, addVehicle } = useShop();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  // New Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('سلێمانی');

  // New Vehicle Form State
  const [newVehPlate, setNewVehPlate] = useState('');
  const [newVehMake, setNewVehMake] = useState('تۆیۆتا');
  const [newVehModel, setNewVehModel] = useState('کامری');
  const [newVehYear, setNewVehYear] = useState<number>(2022);
  const [newVehOdo, setNewVehOdo] = useState<number>(45000);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const customerVehicles = selectedCustomer ? getCustomerVehicles(selectedCustomer.id) : [];

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    const vehs = getCustomerVehicles(c.id);
    const hasMatchingPlate = vehs.some((v) => v.licensePlate.toLowerCase().includes(q));
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      hasMatchingPlate
    );
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;
    const created = addCustomer({
      fullName: newCustName,
      phone: newCustPhone,
      email: `${newCustPhone.replace(/\s+/g, '')}@omerservice.krd`,
      preferredChannel: 'whatsapp',
      address: newCustAddress,
    });
    setSelectedCustomerId(created.id);
    setShowAddCustomerModal(false);
    setNewCustName('');
    setNewCustPhone('');
  };

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehPlate || !selectedCustomer) return;
    addVehicle({
      customerId: selectedCustomer.id,
      licensePlate: newVehPlate,
      make: newVehMake,
      model: newVehModel,
      year: newVehYear,
      vin: `VIN-${Date.now().toString().slice(-8)}`,
      engineCode: 'STANDARD',
      displacement: '2.5L',
      color: 'سپی',
      currentOdometer: Number(newVehOdo),
      odometerUnit: 'km',
    });
    setShowAddVehicleModal(false);
    setNewVehPlate('');
  };

  return (
    <div className="space-y-5 text-right font-kurdish text-slate-800">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-700" />
              بەڕێوەبردنی کڕیاران و ئۆتۆمبێلەکان (CRM)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              تۆمارکردنی کڕیار، پەیوەندیکردن بە واتسئەپ، و بەستنەوەی چەندین ئۆتۆمبێل بە یەک خاوەنەوە.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddCustomerModal(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            تۆمارکردنی کڕیاری نوێ
          </button>
        </div>

        {/* 2-Column CRM Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Customer Directory (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="گەڕان بەپێی ناو، مۆبایل، تابلۆ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-2xs"
              />
            </div>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
              {filteredCustomers.map((cust) => {
                const isSelected = cust.id === selectedCustomer?.id;
                const custVehs = getCustomerVehicles(cust.id);

                return (
                  <button
                    key={cust.id}
                    type="button"
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className={`w-full p-3 rounded-xl border text-right transition text-xs block cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-slate-900'}`}>{cust.fullName}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{custVehs.length} ئۆتۆمبێل</span>
                    </div>
                    <div className={`text-[11px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-500'}`} dir="ltr">
                      {cust.phone}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Customer Profile & Vehicles (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {selectedCustomer ? (
              <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200 space-y-5 shadow-2xs">
                {/* Profile Overview */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedCustomer.fullName}</h3>
                    <p className="text-xs text-slate-500">
                      ناونیشان: {selectedCustomer.address} • پەیوەندی بە: {selectedCustomer.preferredChannel}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                      {selectedCustomer.phone}
                    </span>
                  </div>
                </div>

                {/* Customer Vehicles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      ئۆتۆمبێلە تۆمارکراوەکان ({customerVehicles.length} ئۆتۆمبێل):
                    </span>

                    <button
                      type="button"
                      onClick={() => setShowAddVehicleModal(true)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs transition flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      زیادکردنی ئۆتۆمبێل
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {customerVehicles.map((veh) => (
                      <div
                        key={veh.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                              {veh.licensePlate}
                            </span>
                            <span className="font-bold text-slate-800">
                              {veh.make} {veh.model} ({veh.year})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            کیلۆمەتری ئێستا: <strong className="text-slate-900 font-mono">{veh.currentOdometer.toLocaleString()} KM</strong>
                          </div>
                        </div>

                        {veh.mileageHistory && veh.mileageHistory.length > 0 && (
                          <div className="text-left text-[11px] text-slate-500">
                            دوایین سێرڤس: <span className="font-mono text-slate-700">{veh.mileageHistory[0].date}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50/80 p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-500 shadow-2xs">
                کڕیارێک دیاری بکە لە لیستەکە.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Add Customer */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 w-full max-w-md space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-slate-900">تۆمارکردنی کڕیاری نوێ</span>
              <button onClick={() => setShowAddCustomerModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <span className="text-slate-600 block mb-1">ناوی تەواو</span>
                <input
                  type="text"
                  required
                  placeholder="وەک: سەرکەوت ئەحمەد"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <span className="text-slate-600 block mb-1">ژمارەی مۆبایل</span>
                <input
                  type="text"
                  required
                  placeholder="0770 123 4567"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 text-left font-mono focus:outline-none focus:border-slate-800"
                  dir="ltr"
                />
              </div>

              <div>
                <span className="text-slate-600 block mb-1">شار / ناونیشان</span>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer shadow-xs"
                >
                  پاشەکەوتکردن
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                >
                  پاشگەزبوونەوە
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Vehicle */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 w-full max-w-md space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-slate-900">تۆمارکردنی ئۆتۆمبێلی نوێ</span>
              <button onClick={() => setShowAddVehicleModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-600">ژمارەی تابلۆ</span>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setNewVehPlate('21 A ')}
                      className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                      title="سلێمانی - هەرێمی کوردستان"
                    >
                      21 سلێمانی [KR]
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewVehPlate('22 A ')}
                      className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                      title="هەولێر - هەرێمی کوردستان"
                    >
                      22 هەولێر [KR]
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewVehPlate('23 A ')}
                      className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                      title="هەڵەبجە - هەرێمی کوردستان"
                    >
                      23 هەڵەبجە [KR]
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewVehPlate('24 A ')}
                      className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                      title="دهۆک - هەرێمی کوردستان"
                    >
                      24 دهۆک [KR]
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewVehPlate('علوج ')}
                      className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 hover:bg-amber-200 font-bold border border-amber-300 cursor-pointer"
                    >
                      ⚠️ علوج
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  required
                  placeholder="21 A 45892 سلێمانی یان: علوج 84920"
                  value={newVehPlate}
                  onChange={(e) => setNewVehPlate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 text-left font-mono focus:outline-none focus:border-slate-800"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-600 block mb-1">مارکە (Make)</span>
                  <input
                    type="text"
                    required
                    placeholder="تۆیۆتا"
                    value={newVehMake}
                    onChange={(e) => setNewVehMake(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <span className="text-slate-600 block mb-1">مۆدێل (Model)</span>
                  <input
                    type="text"
                    required
                    placeholder="کامری"
                    value={newVehModel}
                    onChange={(e) => setNewVehModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-600 block mb-1">ساڵی دروستکردن</span>
                  <input
                    type="number"
                    value={newVehYear}
                    onChange={(e) => setNewVehYear(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-mono focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <span className="text-slate-600 block mb-1">کیلۆمەتری ئێستا</span>
                  <input
                    type="number"
                    value={newVehOdo}
                    onChange={(e) => setNewVehOdo(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-mono focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer shadow-xs"
                >
                  زیادکردنی ئۆتۆمبێل
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                >
                  پاشگەزبوونەوە
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
