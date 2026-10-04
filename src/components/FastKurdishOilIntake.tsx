import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { OilViscosity, OilCategory } from '../types';
import {
  Car,
  Droplet,
  User,
  Printer,
  Check,
  RotateCcw,
  Info,
  Wrench,
  Gauge,
  Tag,
  CheckCircle2,
  Camera,
  Coins,
  Receipt,
} from 'lucide-react';
import { PlateCameraModal, DetectedPlateResult } from './PlateCameraModal';
import { OmarOilLogo } from './OmarOilLogo';
import {
  IRAQ_PLATE_PROVINCES,
  detectProvinceFromPlateString,
  findProvinceByName,
} from '../utils/iraqPlates';

interface CarBrandOption {
  id: string;
  nameKrd: string;
  nameEn: string;
  models: string[];
}

export const CAR_BRANDS: CarBrandOption[] = [
  {
    id: 'toyota',
    nameKrd: 'تۆیۆتا (Toyota)',
    nameEn: 'Toyota',
    models: [
      'کامری (Camry)',
      'کۆرۆلا (Corolla)',
      'لاند کرۆزەر (Land Cruiser)',
      'پرادۆ (Prado)',
      'هایلۆکس (Hilux)',
      'ڕاڤ٤ (RAV4)',
      'فۆڕچونەر (Fortuner)',
      'ئەڤەلۆن (Avalon)',
      'هایلەندەر (Highlander)',
      'جۆری تر (Other)',
    ],
  },
  {
    id: 'nissan',
    nameKrd: 'نیسان (Nissan)',
    nameEn: 'Nissan',
    models: [
      'پاترۆڵ (Patrol V8)',
      'پاترۆڵ (Patrol V6)',
      'ئاڵتیما (Altima)',
      'سەنی (Sunny)',
      'ئێکس ترەیل / ڕۆگ (X-Trail / Rogue)',
      'ناڤارا (Navara)',
      'ماکسیما (Maxima)',
      'کیکس (Kicks)',
      'جۆری تر (Other)',
    ],
  },
  {
    id: 'ford',
    nameKrd: 'فۆرد (Ford)',
    nameEn: 'Ford',
    models: [
      'ئێف-١٥٠ (F-150)',
      'ئێکسپلۆرەر (Explorer)',
      'ئێدج (Edge)',
      'تەوڕەس (Taurus)',
      'مۆستانگ (Mustang)',
      'ئێکسپیدیشن (Expedition)',
      'ڕێنجەر (Ranger)',
      'فیۆژن (Fusion)',
      'جۆری تر (Other)',
    ],
  },
  {
    id: 'hyundai',
    nameKrd: 'هیووندای (Hyundai)',
    nameEn: 'Hyundai',
    models: [
      'توسان (Tucson)',
      'سۆناتا (Sonata)',
      'ئێلانترا (Elantra)',
      'سانتافی (Santa Fe)',
      'ئەکسێنت (Accent)',
      'پالیسەید (Palisade)',
      'کۆنا (Kona)',
      'جۆری تر (Other)',
    ],
  },
  {
    id: 'kia',
    nameKrd: 'کیا (Kia)',
    nameEn: 'Kia',
    models: [
      'سپۆرتاج (Sportage)',
      'سۆرێنتۆ (Sorento)',
      'ئۆپتیما / کەی٥ (Optima / K5)',
      'سێراتۆ / فۆرتێ (Cerato / Forte)',
      'تێلوڕاید (Telluride)',
      'پیکانتۆ (Picanto)',
      'جۆری تر (Other)',
    ],
  },
  {
    id: 'chevrolet',
    nameKrd: 'شۆفرلێت (Chevrolet)',
    nameEn: 'Chevrolet',
    models: [
      'تاهۆ (Tahoe)',
      'سەبێربان (Suburban)',
      'سلڤەرادۆ (Silverado)',
      'مالیبۆ (Malibu)',
      'تراڤێرس (Traverse)',
      'کامارۆ (Camaro)',
      'جۆری تر (Other)',
    ],
  },
  {
    id: 'mercedes',
    nameKrd: 'مێرسیدس (Mercedes)',
    nameEn: 'Mercedes',
    models: [
      'C-Class (C200/C300)',
      'E-Class (E200/E300)',
      'S-Class (S500/S580)',
      'G-Wagon (G63)',
      'GLE / GLC',
      'جۆری تر (Other)',
    ],
  },
  {
    id: 'bmw',
    nameKrd: 'بی ئێم دەبلیو (BMW)',
    nameEn: 'BMW',
    models: [
      '3 Series (320i/330i)',
      '5 Series (520i/530i)',
      '7 Series (740i/750i)',
      'X5 / X6',
      'X7',
      'جۆری تر (Other)',
    ],
  },
  {
    id: 'dodge_jeep',
    nameKrd: 'دۆج و جپ (Dodge / Jeep)',
    nameEn: 'Dodge / Jeep',
    models: [
      'گراند چێرۆکی (Grand Cherokee)',
      'چارجەر (Charger)',
      'چەلەنجەر (Challenger)',
      'دورانگۆ (Durango)',
      'ڕانگلەر (Wrangler)',
      'جۆری تر (Other)',
    ],
  },
  {
    id: 'other',
    nameKrd: 'جۆری تر (Other)',
    nameEn: 'Other',
    models: ['جۆری تر (Other)'],
  },
];

export const OIL_MODELS_LIST = [
  {
    brand: 'تۆیۆتا ئەسڵی (Toyota SP)',
    fullName: 'Toyota Motor Oil SP Fully Synthetic',
    recommendedViscosities: ['0W-20', '5W-30', '0W-16'],
    category: 'Full Synthetic' as OilCategory,
  },
  {
    brand: 'نیسان ئەسڵی (Nissan Save-X)',
    fullName: 'Nissan Motor Oil Strong Save-X',
    recommendedViscosities: ['5W-30', '0W-20'],
    category: 'Full Synthetic' as OilCategory,
  },
  {
    brand: 'مۆتۆرکرافت فۆرد (Motorcraft)',
    fullName: 'Motorcraft Full Synthetic XO Series',
    recommendedViscosities: ['5W-30', '5W-20'],
    category: 'Full Synthetic' as OilCategory,
  },
  {
    brand: 'کاسترۆڵ (Castrol EDGE)',
    fullName: 'Castrol EDGE Professional Titanium FST',
    recommendedViscosities: ['5W-30', '5W-40', '10W-40', '0W-20'],
    category: 'Full Synthetic' as OilCategory,
  },
  {
    brand: 'مۆبیل ١ (Mobil 1)',
    fullName: 'Mobil 1 Advanced Fuel Economy Full Synthetic',
    recommendedViscosities: ['0W-20', '5W-30', '5W-40'],
    category: 'Full Synthetic' as OilCategory,
  },
  {
    brand: 'شێڵ هێلیکس (Shell Helix)',
    fullName: 'Shell Helix Ultra PurePlus Technology',
    recommendedViscosities: ['5W-30', '5W-40', '0W-20'],
    category: 'Full Synthetic' as OilCategory,
  },
  {
    brand: 'تۆتاڵ کوارتز (Total Quartz)',
    fullName: 'Total Quartz 9000 Future Series',
    recommendedViscosities: ['5W-30', '10W-40', '5W-40'],
    category: 'Full Synthetic' as OilCategory,
  },
  {
    brand: 'لیکوی مۆلی (Liqui Moly)',
    fullName: 'Liqui Moly Molygen New Generation',
    recommendedViscosities: ['5W-30', '5W-40', '0W-20'],
    category: 'Full Synthetic' as OilCategory,
  },
  {
    brand: 'مۆتوڵ (Motul 8100)',
    fullName: 'Motul 8100 X-cess 100% Synthetic',
    recommendedViscosities: ['5W-40', '5W-30'],
    category: 'Full Synthetic' as OilCategory,
  },
  {
    brand: 'ڤاڵڤۆلین (Valvoline)',
    fullName: 'Valvoline MaxLife Synthetic Blend',
    recommendedViscosities: ['10W-40', '5W-30', '20W-50'],
    category: 'Semi-Synthetic' as OilCategory,
  },
];

export const FastKurdishOilIntake: React.FC = () => {
  const {
    addCustomer,
    addVehicle,
    addWorkOrder,
    saveOilService,
    updateWorkOrderStatus,
    setStickerModalRecord,
  } = useShop();

  // Step 1: Car selection (If in list pick it, if not choose other - no typing needed)
  const [selectedBrand, setSelectedBrand] = useState<CarBrandOption>(CAR_BRANDS[0]);
  const [selectedModel, setSelectedModel] = useState<string>(CAR_BRANDS[0].models[0]);

  // Step 2: Owner name & Plate number / Registration type
  const [ownerName, setOwnerName] = useState<string>('');
  const [ownerPhone, setOwnerPhone] = useState<string>('');
  const [isAloj, setIsAloj] = useState<boolean>(false);
  const [plateNumber, setPlateNumber] = useState<string>('');
  const [plateCity, setPlateCity] = useState<string>('سلێمانی');
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  // Step 3: Current odometer
  const [currentKm, setCurrentKm] = useState<number>(55000);

  // Step 4: Oil specifications and cost
  const [selectedOil, setSelectedOil] = useState(OIL_MODELS_LIST[0]);
  const [viscosity, setViscosity] = useState<OilViscosity>('0W-20');
  const [oilVolume, setOilVolume] = useState<number>(4.5);
  const [filterChanged, setFilterChanged] = useState<boolean>(true);
  const [intervalKm, setIntervalKm] = useState<number>(8000);
  const [totalCostIQD, setTotalCostIQD] = useState<string>('');
  const [costNotes, setCostNotes] = useState<string>('');

  // Feedback notifications
  const [notice, setNotice] = useState<{ message: string; type: 'info' | 'success' } | null>(null);

  const isVehicleAloj = isAloj || plateCity === 'علوج';
  const currentProvince = isVehicleAloj ? null : findProvinceByName(plateCity);
  const fullPlateString = isVehicleAloj
    ? `علوج ${plateNumber.trim()}`.trim()
    : `${plateNumber.trim()} ${plateCity}`.trim();

  const finalMakeString = selectedBrand.nameKrd;
  const finalModelString = selectedModel;

  // Next service calculation
  const nextServiceKm = Number(currentKm) + Number(intervalKm);
  const nextServiceDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  })();

  const handleBrandChange = (brand: CarBrandOption) => {
    setSelectedBrand(brand);
    setSelectedModel(brand.models[0] || 'جۆری تر (Other)');

    // Intelligent default oil match
    if (brand.id === 'toyota') {
      const match = OIL_MODELS_LIST.find((o) => o.brand.includes('تۆیۆتا'));
      if (match) setSelectedOil(match);
      setViscosity('0W-20');
    } else if (brand.id === 'nissan') {
      const match = OIL_MODELS_LIST.find((o) => o.brand.includes('نیسان'));
      if (match) setSelectedOil(match);
      setViscosity('5W-30');
    } else if (brand.id === 'ford') {
      const match = OIL_MODELS_LIST.find((o) => o.brand.includes('فۆرد'));
      if (match) setSelectedOil(match);
      setViscosity('5W-30');
    }
  };

  const handleOilChange = (oil: typeof OIL_MODELS_LIST[0]) => {
    setSelectedOil(oil);
    if (!oil.recommendedViscosities.includes(viscosity)) {
      setViscosity(oil.recommendedViscosities[0] as OilViscosity);
    }
  };

  const resetForm = () => {
    setOwnerName('');
    setOwnerPhone('');
    setPlateNumber('');
    setIsAloj(false);
    setPlateCity('سلێمانی');
    setSelectedBrand(CAR_BRANDS[0]);
    setSelectedModel(CAR_BRANDS[0].models[0]);
    setTotalCostIQD('');
    setCostNotes('');
  };

  const handlePlateDetected = (res: DetectedPlateResult) => {
    if (res.plateNumber) {
      setPlateNumber(res.plateNumber);
    }
    const isPureDigits = /^\d+$/.test(res.plateNumber.trim());
    if (res.city === 'علوج' || res.plateNumber.includes('علوج') || isPureDigits) {
      setIsAloj(true);
      setPlateCity('علوج');
    } else if (res.city) {
      setPlateCity(res.city);
      setIsAloj(false);
    }

    // If make was detected from camera, auto-select it if possible; if not just pick other
    if (res.make) {
      const matchBrand = CAR_BRANDS.find(
        (b) =>
          b.nameEn.toLowerCase() === res.make?.toLowerCase() ||
          b.nameKrd.toLowerCase().includes(res.make?.toLowerCase() || '')
      );
      if (matchBrand) {
        setSelectedBrand(matchBrand);
        if (res.model) {
          const matchModel = matchBrand.models.find((m) =>
            m.toLowerCase().includes(res.model?.toLowerCase() || '')
          );
          setSelectedModel(matchModel || matchBrand.models[0] || 'جۆری تر (Other)');
        } else {
          setSelectedModel(matchBrand.models[0] || 'جۆری تر (Other)');
        }
      } else {
        const otherB = CAR_BRANDS.find((b) => b.id === 'other') || CAR_BRANDS[CAR_BRANDS.length - 1];
        setSelectedBrand(otherB);
        setSelectedModel(otherB.models[0]);
      }
    }
    const isDetectedAloj = res.city === 'علوج' || isPureDigits || res.plateNumber.includes('علوج');
    setNotice({
      message: isDetectedAloj
        ? `✓ سەیارەی علوج (${res.plateNumber}) بە سەرکەوتوویی خوێندرایەوە و وەک علوج دیاری کرا!`
        : `✓ تابلۆی ئۆتۆمبێل (${res.plateNumber} ${res.city || ''}) بە سەرکەوتوویی بە کامێرا خوێندرایەوە و پڕکرایەوە!`,
      type: 'success',
    });
  };

  // PERFORM OIL CHANGE: DRAIN AND REFILL, SAVE RECORD & PRINT STICKER
  const handlePerformOilChange = (printSticker: boolean) => {
    if (!ownerName.trim() || !plateNumber.trim()) {
      alert('تکایە ناوی خاوەن ئۆتۆمبێل و ژمارەی تابلۆ بنووسە!');
      return;
    }

    // 1. Register customer
    const newCust = addCustomer({
      fullName: ownerName.trim(),
      phone: ownerPhone.trim() || '0770 000 0000',
      email: `${isVehicleAloj ? 'aloj-' : ''}${plateNumber.replace(/\s+/g, '')}@omerservice.krd`,
      preferredChannel: 'whatsapp',
      address: isVehicleAloj ? 'علوج (بێ تابلۆ)' : plateCity,
    });

    // 2. Register vehicle
    const newVeh = addVehicle({
      customerId: newCust.id,
      licensePlate: fullPlateString,
      make: finalMakeString,
      model: finalModelString,
      year: 2022,
      vin: `VIN-${Date.now().toString().slice(-8)}`,
      engineCode: 'STANDARD',
      displacement: '2.5L',
      color: 'سپی',
      currentOdometer: Number(currentKm),
      odometerUnit: 'km',
    });

    // 3. Work Order
    const newWO = addWorkOrder({
      customerId: newCust.id,
      vehicleId: newVeh.id,
      status: 'ready_pickup',
      priority: 'routine',
      assignedTechnician: 'وەستا',
      requestedServices: [
        `بەتاڵکردنەوە و تێکردنی ${selectedOil.brand} ${viscosity}`,
        filterChanged ? 'فلتەری ڕۆنی ئەسڵی' : 'بێ فلتەر',
      ],
      customerConcerns: `خاوەن: ${ownerName.trim()} - ڕۆنی کۆن بەتاڵکرا و نوێ تێکرا.`,
    });

    // 4. Save Oil Record
    const costNumber = Number(totalCostIQD) || 0;
    const costSummaryText = costNumber > 0 ? ` • تێچووی گشتی: ${costNumber.toLocaleString()} IQD` : '';
    const costNotesText = costNotes.trim() ? ` (${costNotes.trim()})` : '';

    const savedRec = saveOilService(newWO.id, {
      vehicleId: newVeh.id,
      customerId: newCust.id,
      serviceDate: new Date().toISOString().split('T')[0],
      currentOdometer: Number(currentKm),
      odometerUnit: 'km',
      oilBrand: selectedOil.fullName,
      oilViscosity: viscosity,
      oilCategory: selectedOil.category,
      volumeUsedLiters: Number(oilVolume),
      oilFilterPartNumber: filterChanged ? 'فلتەری ئەسڵی OEM' : 'نەگۆڕدراوە',
      totalCostIQD: costNumber,
      costNotes: costNotes.trim(),
      serviceIntervalKm: intervalKm,
      serviceIntervalMonths: 6,
      nextServiceOdometer: nextServiceKm,
      nextServiceDate: nextServiceDate,
      technicianName: 'وەستای سێرڤس',
      stickerPrinted: printSticker,
      notes: `ڕۆنی کۆن بەتاڵکرا. ${oilVolume} لیتر ڕۆنی نوێی ${selectedOil.brand} ${viscosity} تێکرا.${costSummaryText}${costNotesText}`,
    });

    updateWorkOrderStatus(newWO.id, 'ready_pickup');

    if (printSticker) {
      setStickerModalRecord(savedRec);
    }

    setNotice({
      message: `ڕۆنی نوێ (${selectedOil.brand} ${viscosity}) تێکرا بۆ ${ownerName} (${finalMakeString} ${finalModelString} - ${fullPlateString}).${costNumber > 0 ? ` تێچوو: ${costNumber.toLocaleString()} دینار.` : ''} وادەی داهاتوو: ${nextServiceKm.toLocaleString()} کم.`,
      type: 'success',
    });

    resetForm();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 text-right font-kurdish text-slate-800">
      {/* Notice Banner */}
      {notice && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium flex items-center justify-between transition ${
            notice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-slate-100 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Info className="w-5 h-5 text-slate-500" />
            )}
            <span>{notice.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 font-medium cursor-pointer"
          >
            داخستن
          </button>
        </div>
      )}

      {/* Main Single Clean Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-7 space-y-5 sm:space-y-6 shadow-xs">
        {/* Title & Info */}
        <div className="border-b border-slate-100 pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-slate-700" />
              گۆڕینی ڕۆن و پشکنینی خێرا
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              هەڵبژاردنی ئۆتۆمبێل، دیاریکردنی کیلۆمەتر و تۆمارکردنی تێچووی ڕۆن بە شێوازێکی سادە و ڕوون.
            </p>
          </div>
          <div className="flex items-center justify-between sm:justify-start gap-2.5">
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 transition cursor-pointer"
              title="فۆرمی نوێ"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>فۆرمی نوێ</span>
            </button>
            <div className="bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 shrink-0 shadow-2xs flex items-center gap-2">
              <OmarOilLogo variant="red" size="sm" />
              <div className="text-right">
                <span className="block text-[11px] font-bold text-slate-900 leading-none">عومەر ئۆیڵ</span>
                <span className="block text-[8.5px] text-slate-500 font-sans mt-0.5">ڕانیە - سناعە</span>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 1: CHOOSE CAR BRAND & MODEL */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-900 block">
              ١. مارکە و مۆدێلی ئۆتۆمبێل (Make &amp; Model):
            </label>
            <div className="flex items-center gap-2">
              {/* Type Switcher: Regular vs علوج */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto justify-stretch">
                <button
                  type="button"
                  onClick={() => {
                    setIsAloj(false);
                    if (plateCity === 'علوج') setPlateCity('سلێمانی');
                  }}
                  className={`flex-1 sm:flex-none px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer text-center ${
                    !isVehicleAloj
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🚗 تابلۆی فەرمی (21 H)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAloj(true);
                    setPlateCity('علوج');
                  }}
                  className={`flex-1 sm:flex-none px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                    isVehicleAloj
                      ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                      : 'text-slate-600 hover:text-amber-800'
                  }`}
                >
                  <span>⚠️ علوج (بێ تابلۆ)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Clean Brand List */}
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2">
            {CAR_BRANDS.map((brand) => {
              const isSelected = selectedBrand.id === brand.id;
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => handleBrandChange(brand)}
                  className={`px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl border text-center text-[11px] sm:text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-medium'
                  }`}
                >
                  <span className="block font-medium truncate">{brand.nameKrd.split(' ')[0]}</span>
                  <span className={`text-[9.5px] sm:text-[10px] block truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                    {brand.nameEn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Model selection: if other, simple message; if brand has models, clean dropdown */}
          {selectedBrand.id !== 'other' ? (
            <div className="pt-1">
              <span className="text-[11px] text-slate-600 font-medium block mb-1">
                مۆدێلی {selectedBrand.nameKrd.split(' ')[0]} (Model):
              </span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none transition cursor-pointer shadow-2xs"
              >
                {selectedBrand.models.map((m, idx) => (
                  <option key={idx} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                <span>ئۆتۆمبێلی دیاریکراو: <strong>جۆری تر (Other)</strong></span>
                <span className="text-[11px] text-slate-400 font-medium">پێویست بە هیچ نووسینێک ناکات</span>
              </div>
            </div>
          )}

          {/* Active Car Preview Badge */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span>ئۆتۆمبێلی دیاریکراو:</span>
            <strong className="text-slate-900">{finalMakeString}</strong>
            <span className="text-slate-300">/</span>
            <strong className="text-slate-800">{finalModelString}</strong>
            {isVehicleAloj ? (
              <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold flex items-center gap-1">
                ⚠️ جۆری علوج (بێ تابلۆ {plateNumber ? `- ${plateNumber}` : ''})
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 text-[10px] font-medium">
                تابلۆی فەرمی ({plateCity})
              </span>
            )}
          </div>
        </div>

        {/* STEP 2: OWNER NAME & CAR PLATE */}
        <div className="space-y-3 pt-3 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-900 block">
              ٢. ناوی خاوەن و ژمارەی تابلۆی ئۆتۆمبێل:
            </label>

            {/* Quick Switch for Alooj / Regular */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-500">جۆری تابلۆ:</span>
              <button
                type="button"
                onClick={() => {
                  setIsAloj(false);
                  if (plateCity === 'علوج') setPlateCity('سلێمانی');
                }}
                className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                  !isVehicleAloj
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                فەرمی (21 H)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAloj(true);
                  setPlateCity('علوج');
                }}
                className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                  isVehicleAloj
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-600 hover:text-amber-800'
                }`}
              >
                <span>⚠️ علوج (تەنها ژمارە)</span>
              </button>
            </div>
          </div>

          {/* Special Alooj guidance banner if active */}
          {isVehicleAloj && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black rounded text-[10px] shrink-0">
                  علوج
                </span>
                <span>
                  ئەم ئۆتۆمبێلە علوجە (بێ تابلۆیە)؛ تەنها ژمارەی سەر سەیارەکە بنووسە.
                </span>
              </div>
              <span className="text-[10px] text-amber-800 font-mono self-start sm:self-auto">
                {plateNumber ? `تۆمار: علوج ${plateNumber}` : 'تەنها ژمارە'}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[11px] text-slate-600 font-medium block mb-1">ناوی خاوەن ئۆتۆمبێل</span>
              <input
                type="text"
                placeholder="ناوی خاوەن"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-2xs transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1 gap-1">
                <div className="flex items-center gap-1 shrink-0 min-w-0">
                  <span className={`text-[11px] font-medium truncate ${isVehicleAloj ? 'text-amber-800 font-bold' : 'text-slate-600'}`}>
                    {isVehicleAloj ? '⚠️ ژمارەی علوج' : 'ژمارەی تابلۆ'}
                  </span>
                  {currentProvince && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 ${
                      currentProvince.isKurdistanRegion
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-blue-50 text-blue-800 border-blue-300'
                    }`}>
                      {currentProvince.code}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="text-[10px] sm:text-[11px] text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg border border-slate-300 flex items-center gap-1 transition cursor-pointer font-medium shrink-0"
                >
                  <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600" />
                  <span>کامێرا</span>
                </button>
              </div>
              <div className="flex flex-col xs:flex-row gap-1.5 sm:gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    inputMode={isVehicleAloj ? 'numeric' : 'text'}
                    placeholder={isVehicleAloj ? 'وەک: 84920' : '21 H 11111'}
                    value={plateNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (isVehicleAloj) {
                        setPlateNumber(val.replace(/[^0-9\s]/g, ''));
                      } else {
                        setPlateNumber(val);
                        const detectedProv = detectProvinceFromPlateString(val);
                        if (detectedProv) {
                          setPlateCity(detectedProv.nameKrd);
                        }
                      }
                    }}
                    className={`w-full bg-white rounded-xl px-3 py-2 text-xs font-mono font-bold text-left focus:outline-none pl-8 shadow-2xs transition ${
                      isVehicleAloj
                        ? 'border border-amber-400 text-amber-900 focus:border-amber-600 placeholder-amber-400'
                        : 'border border-slate-300 text-slate-900 focus:border-slate-800 placeholder-slate-400'
                    }`}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="absolute left-1 top-1.5 p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition"
                    title="کردنەوەی کامێرا بۆ خوێندنەوەی تابلۆ"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <select
                  value={plateCity}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPlateCity(val);
                    if (val === 'علوج') {
                      setIsAloj(true);
                    } else {
                      setIsAloj(false);
                    }
                  }}
                  className={`bg-white border rounded-xl px-2.5 py-2 text-xs focus:outline-none cursor-pointer w-full xs:w-auto xs:max-w-[145px] sm:max-w-[175px] shadow-2xs shrink-0 ${
                    isVehicleAloj
                      ? 'border-amber-400 text-amber-900 font-bold'
                      : 'border-slate-300 text-slate-800'
                  }`}
                >
                  <optgroup label="هەرێمی کوردستان (KR - Kurdistan Region)">
                    {IRAQ_PLATE_PROVINCES.filter((p) => p.isKurdistanRegion).map((p) => (
                      <option key={p.code} value={p.nameKrd}>
                        {p.code} - {p.nameKrd} [KR]
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="پارێزگاکانی عێراق (Federal Iraq)">
                    {IRAQ_PLATE_PROVINCES.filter((p) => !p.isKurdistanRegion).map((p) => (
                      <option key={p.code} value={p.nameKrd}>
                        {p.code} - {p.nameKrd}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="ئۆتۆمبێلی بێ تابلۆ (Unregistered)">
                    <option value="علوج">⚠️ علوج (بێ تابلۆ)</option>
                  </optgroup>
                </select>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-600 font-medium block mb-1">ژمارەی مۆبایل (ئارەزوومەندانە)</span>
              <input
                type="text"
                placeholder="0770 000 0000"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none text-left font-mono shadow-2xs transition"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* STEP 3: CURRENT ODOMETER */}
        <div className="space-y-3 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-slate-600" />
              <span>٣. کیلۆمەتری ئێستای ئۆتۆمبێل (Current Odometer):</span>
            </label>
            <span className="text-[11px] text-slate-500">
              کیلۆمەتری سەر داشبۆرد دیاری بکە
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="number"
                value={currentKm || ''}
                onChange={(e) => setCurrentKm(Number(e.target.value))}
                placeholder="55000"
                className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl pr-3 pl-12 py-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none transition shadow-2xs"
              />
              <span className="absolute left-3 top-2.5 text-[11px] font-mono text-slate-400 font-bold">
                KM
              </span>
            </div>

            {/* Quick Mileage adjustment/presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-500 ml-1 font-medium">دیاریکردنی خێرا:</span>
              {[25000, 50000, 75000, 100000, 150000].map((kmVal) => (
                <button
                  key={kmVal}
                  type="button"
                  onClick={() => setCurrentKm(kmVal)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-medium transition cursor-pointer ${
                    currentKm === kmVal
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {kmVal.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 4: OIL SPECIFICATIONS & COST */}
        <div className="space-y-4 pt-4 border-t border-slate-200 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-amber-500" />
              ٤. هەڵبژاردنی جۆری ڕۆن، خەستی و تێچوو:
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              بەتاڵکردنەوەی ڕۆنی کۆن و تێکردنی ڕۆنی نوێ
            </span>
          </div>

            {/* Oil Brand Selection */}
            <div>
              <span className="text-[11px] text-slate-600 font-medium block mb-1">مارکەی ڕۆن (Brand):</span>
              <select
                value={selectedOil.brand}
                onChange={(e) => {
                  const found = OIL_MODELS_LIST.find((o) => o.brand === e.target.value);
                  if (found) handleOilChange(found);
                }}
                className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none shadow-2xs transition cursor-pointer"
              >
                {OIL_MODELS_LIST.map((oil, idx) => (
                  <option key={idx} value={oil.brand}>
                    {oil.brand} — {oil.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Viscosity Options */}
            <div>
              <span className="text-[11px] text-slate-600 font-medium block mb-1">خەستی ڕۆن (Viscosity):</span>
              <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-7 gap-1.5">
                {(['5W-30', '0W-20', '5W-20', '5W-40', '10W-40', '20W-50', '0W-16'] as OilViscosity[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setViscosity(v)}
                    className={`py-1.5 text-xs font-mono font-semibold rounded-lg border transition cursor-pointer ${
                      viscosity === v
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume, Filter, and Interval */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <span className="text-[11px] text-slate-600 font-medium block mb-1">بڕی ڕۆن (لیتر)</span>
                <input
                  type="number"
                  step="0.5"
                  value={oilVolume}
                  onChange={(e) => setOilVolume(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-900 text-center shadow-2xs"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-600 font-medium block mb-1">فلتەری ڕۆن</span>
                <button
                  type="button"
                  onClick={() => setFilterChanged(!filterChanged)}
                  className={`w-full py-1.5 text-xs font-medium rounded-xl border transition cursor-pointer shadow-2xs ${
                    filterChanged
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  {filterChanged ? 'فلتەری نوێ دانرا ✓' : 'فلتەر نەگۆڕدرا'}
                </button>
              </div>

              <div>
                <span className="text-[11px] text-slate-600 font-medium block mb-1">ماوەی گۆڕین (کم)</span>
                <select
                  value={intervalKm}
                  onChange={(e) => setIntervalKm(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 shadow-2xs cursor-pointer"
                >
                  <option value={5000}>٥,٠٠٠ کم</option>
                  <option value={8000}>٨,٠٠٠ کم</option>
                  <option value={10000}>١٠,٠٠٠ کم</option>
                </select>
              </div>
            </div>

            {/* Calculated Next Service Overview */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between text-xs gap-2">
              <span className="text-slate-600">
                کیلۆمەتری داهاتوو:{' '}
                <strong className="text-slate-900 font-mono">{nextServiceKm.toLocaleString()} KM</strong>
              </span>
              <span className="text-slate-600">
                وادەی داهاتوو:{' '}
                <strong className="text-slate-900 font-mono">{nextServiceDate}</strong>
              </span>
            </div>

            {/* Total Cost & Price of Oil & Service (تێچووی ڕۆن و سەرجەم خەرجییەکان) */}
            <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-900 block">
                      تێچووی ڕۆنی نوێ و سەرجەم خەرجییەکان (کۆی گشتی بە دینار IQD):
                    </label>
                    <span className="text-[10px] text-slate-500">
                      بڕی پارەی ڕۆن، فلتەر و کرێی دەست بنووسە بۆ تۆمارکردن و ئەرشیف
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium self-start sm:self-auto">
                  پاشەکەوت دەکرێت بۆ مێژووی ئۆتۆمبێل
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Numeric Price Input */}
                <div className="sm:col-span-5 relative">
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="بۆ نموونە: 45000"
                    value={totalCostIQD}
                    onChange={(e) => setTotalCostIQD(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl pr-3 pl-12 py-2 text-sm font-mono font-bold text-emerald-800 placeholder-slate-400 focus:outline-none transition shadow-2xs"
                  />
                  <span className="absolute left-2.5 top-2 text-[10px] text-slate-500 font-mono font-bold">
                    دینار
                  </span>
                </div>

                {/* Quick Presets for common Iraqi oil change costs */}
                <div className="sm:col-span-7 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 ml-1 font-medium">دیاریکردنی خێرا:</span>
                  {[25000, 35000, 45000, 55000, 65000, 85000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTotalCostIQD(preset.toString())}
                      className={`px-2 py-1 text-xs font-mono font-bold rounded-lg border transition cursor-pointer ${
                        totalCostIQD === preset.toString()
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {preset.toLocaleString()}
                    </button>
                  ))}
                  {totalCostIQD && (
                    <button
                      type="button"
                      onClick={() => setTotalCostIQD('')}
                      className="text-[10px] text-slate-400 hover:text-rose-600 px-1 py-0.5 transition cursor-pointer"
                      title="سڕینەوەی نرخ"
                    >
                      سڕینەوە ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Optional notes regarding cost */}
              <div>
                <input
                  type="text"
                  placeholder="تێبینی خەرجی (ئارەزوومەندانە، وەک: ٤ لیتر ڕۆنی مۆتۆل + فلتەری ئەسڵی + شوشتنی مەکینە)"
                  value={costNotes}
                  onChange={(e) => setCostNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition shadow-2xs"
                />
              </div>

              {totalCostIQD && Number(totalCostIQD) > 0 && (
                <div className="flex items-center justify-between text-xs pt-1 px-1 bg-emerald-50/70 rounded-lg p-2.5 border border-emerald-200/80">
                  <span className="text-slate-700">کۆی تێچووی تۆمارکراو بۆ ئەم سەردانە:</span>
                  <span className="font-mono font-bold text-emerald-800 text-sm">
                    {Number(totalCostIQD).toLocaleString()} IQD
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => handlePerformOilChange(true)}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                تەواوکردن و چاپکردنی لەزگەی جام
              </button>

              <button
                type="button"
                onClick={() => handlePerformOilChange(false)}
                className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 shadow-2xs transition cursor-pointer"
              >
                تەواوکردن بێ چاپ
              </button>
            </div>
          </div>
      </div>

      {/* Camera Plate Scanner Modal */}
      <PlateCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPlateDetected={handlePlateDetected}
      />
    </div>
  );
};
