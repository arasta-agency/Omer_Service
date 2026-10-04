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
    ],
  },
  {
    id: 'other',
    nameKrd: 'مارکەی تر (دەستی)',
    nameEn: 'Other Make',
    models: ['مۆدێلی تر بە دەست بنووسە'],
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

  // Step 1: Car selection
  const [selectedBrand, setSelectedBrand] = useState<CarBrandOption>(CAR_BRANDS[0]);
  const [selectedModel, setSelectedModel] = useState<string>(CAR_BRANDS[0].models[0]);
  const [isManualBrand, setIsManualBrand] = useState<boolean>(false);
  const [customBrandName, setCustomBrandName] = useState<string>('');
  const [customModelName, setCustomModelName] = useState<string>('');

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

  // Active flags for custom make & model entry
  const isCustomBrandActive = isManualBrand || selectedBrand.id === 'other';
  const isCustomModelActive = isCustomBrandActive || selectedModel === '__CUSTOM_MODEL__';

  const finalMakeString = isCustomBrandActive
    ? (customBrandName.trim() || 'جۆری تر')
    : selectedBrand.nameKrd;

  const finalModelString = isCustomModelActive
    ? (customModelName.trim() || (selectedModel === '__CUSTOM_MODEL__' ? 'مۆدێلی تر' : selectedModel))
    : selectedModel;

  // Next service calculation
  const nextServiceKm = Number(currentKm) + Number(intervalKm);
  const nextServiceDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  })();

  const handleBrandChange = (brand: CarBrandOption) => {
    setSelectedBrand(brand);
    if (brand.id === 'other') {
      setIsManualBrand(true);
      setSelectedModel('__CUSTOM_MODEL__');
    } else {
      setIsManualBrand(false);
      setSelectedModel(brand.models[0]);
    }

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
    setCustomBrandName('');
    setCustomModelName('');
    setIsManualBrand(false);
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

    // If make was detected from camera, auto-select it if possible
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
          if (matchModel) {
            setSelectedModel(matchModel);
          } else {
            setSelectedModel('__CUSTOM_MODEL__');
            setCustomModelName(res.model);
          }
        }
      } else {
        const otherB = CAR_BRANDS.find((b) => b.id === 'other') || CAR_BRANDS[CAR_BRANDS.length - 1];
        setSelectedBrand(otherB);
        setIsManualBrand(true);
        setCustomBrandName(res.make);
        if (res.model) {
          setCustomModelName(res.model);
        }
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
    <div className="max-w-4xl mx-auto space-y-5 text-right font-kurdish text-slate-200">
      {/* Notice Banner */}
      {notice && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium flex items-center justify-between transition ${
            notice.type === 'success'
              ? 'bg-slate-900 border-slate-700 text-white'
              : 'bg-slate-900/80 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-slate-200" />
            ) : (
              <Info className="w-5 h-5 text-slate-400" />
            )}
            <span>{notice.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1"
          >
            داخستن
          </button>
        </div>
      )}

      {/* Main Single Clean Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm">
        {/* Title & Info */}
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Droplet className="w-5 h-5 text-slate-300" />
              گۆڕینی ڕۆن و پشکنینی خێرا
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              ئۆتۆمبێلەکە هات پشکنینی بۆ دەکرێت: ئەگەر ڕۆنەکەی پاک بوو بەڕێ دەکرێت بێ تۆمارکردنی زانیاری، ئەگەر پێویستی پێبوو دەستبەجێ بەتاڵ دەکرێتەوە و ڕۆنی نوێ دەکرێتە ناوی.
            </p>
          </div>
          <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto shadow-sm flex items-center gap-2">
            <OmarOilLogo variant="red" size="sm" />
            <div className="text-right">
              <span className="block text-[11px] font-bold text-white leading-none">عومەر ئۆیڵ</span>
              <span className="block text-[8.5px] text-slate-400 font-sans mt-0.5">ڕانیە - شەقامی سەرەکی سناعە</span>
            </div>
          </div>
        </div>

        {/* STEP 1: CHOOSE CAR BRAND & MODEL */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-300 block">
              ١. مارکە و مۆدێلی ئۆتۆمبێل (Make &amp; Model):
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {/* Type Switcher: Regular vs علوج */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAloj(false);
                    if (plateCity === 'علوج') setPlateCity('سلێمانی');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    !isVehicleAloj
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-600'
                      : 'text-slate-400 hover:text-white'
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    isVehicleAloj
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                      : 'text-slate-400 hover:text-amber-300'
                  }`}
                >
                  <span>⚠️ علوج (بێ تابلۆ)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isCustomBrandActive) {
                    const otherB = CAR_BRANDS.find((b) => b.id === 'other') || CAR_BRANDS[CAR_BRANDS.length - 1];
                    setSelectedBrand(otherB);
                    setIsManualBrand(true);
                    setSelectedModel('__CUSTOM_MODEL__');
                  } else {
                    setIsManualBrand(false);
                    setSelectedBrand(CAR_BRANDS[0]);
                    setSelectedModel(CAR_BRANDS[0].models[0]);
                  }
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-500 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                {isCustomBrandActive ? (
                  <span>↩️ گەڕانەوە بۆ هەڵبژاردن لە لیستەکە</span>
                ) : (
                  <span>✍️ ئەگەر لەم لیستەدا نییە: نووسینی دەستی</span>
                )}
              </button>
            </div>
          </div>

          {/* Clean Brand List (Always available for fast 1-click pick) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CAR_BRANDS.map((brand) => {
              const isSelected = selectedBrand.id === brand.id;
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => handleBrandChange(brand)}
                  className={`px-3 py-2 rounded-xl border text-center text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-slate-500 text-white font-bold shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="block font-medium">{brand.nameKrd.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-500">{brand.nameEn}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Brand & Model Entry Mode */}
          {isCustomBrandActive ? (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800/80 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span>✍️</span> تۆمارکردنی جۆر و مۆدێل بە دەست:
                </span>
                <span className="text-[10px] text-slate-500 font-mono">ئۆتۆمبێلی دەرەوەی لیستەکە</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">
                    جۆر و مارکەی ئۆتۆمبێل (Make / Brand) *
                  </label>
                  <input
                    type="text"
                    placeholder="وەک: لێکسس، مازدا، چێری، ئۆدی، ڤۆڵکسواگن، هۆندا..."
                    value={customBrandName}
                    onChange={(e) => setCustomBrandName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-500"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">
                    مۆدێلی ئۆتۆمبێل (Model) *
                  </label>
                  <input
                    type="text"
                    placeholder="وەک: RX350، CX-9، تیگۆ ٨، A6، سیڤیک، هتد..."
                    value={customModelName}
                    onChange={(e) => setCustomModelName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Standard Model Selection Dropdown (with option to enter custom model) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">
                  مۆدێلی {selectedBrand.nameKrd.split(' ')[0]} (Model)
                </span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-600 cursor-pointer"
                >
                  {selectedBrand.models.map((m, idx) => (
                    <option key={idx} value={m}>
                      {m}
                    </option>
                  ))}
                  <option value="__CUSTOM_MODEL__">
                    ✍️ مۆدێلێکی تر بنووسە بە دەست (لە لیستدا نییە)...
                  </option>
                </select>
              </div>

              {selectedModel === '__CUSTOM_MODEL__' && (
                <div>
                  <span className="text-[11px] text-slate-300 block mb-1">
                    ناوی مۆدێلی تر بنووسە (Model)
                  </span>
                  <input
                    type="text"
                    placeholder="وەک: کراون، یاریس، کڕۆس، هتد..."
                    value={customModelName}
                    onChange={(e) => setCustomModelName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-500"
                    autoFocus
                  />
                </div>
              )}
            </div>
          )}

          {/* Active Car Preview Badge */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/80 font-mono">
            <span>ئۆتۆمبێلی هەڵبژێردراو:</span>
            <span className="text-white font-bold">{finalMakeString}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-200 font-semibold">{finalModelString}</span>
            {isVehicleAloj ? (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                ⚠️ جۆری علوج (بێ تابلۆ {plateNumber ? `- ${plateNumber}` : ''})
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
                تابلۆی فەرمی ({plateCity})
              </span>
            )}
          </div>
        </div>

        {/* STEP 2: OWNER NAME & CAR PLATE */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-300 block">
              ٢. ناوی خاوەن و ژمارەی تابلۆی ئۆتۆمبێل:
            </label>

            {/* Quick Switch for Alooj / Regular */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-400">جۆری تابلۆ:</span>
              <button
                type="button"
                onClick={() => {
                  setIsAloj(false);
                  if (plateCity === 'علوج') setPlateCity('سلێمانی');
                }}
                className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                  !isVehicleAloj
                    ? 'bg-slate-800 text-white border border-slate-600'
                    : 'text-slate-400 hover:text-white'
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
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                <span>⚠️ علوج (تەنها ژمارە)</span>
              </button>
            </div>
          </div>

          {/* Special Alooj guidance banner if active */}
          {isVehicleAloj && (
            <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black rounded text-[10px]">
                  علوج
                </span>
                <span>
                  ئەم ئۆتۆمبێلە علوجە (بێ تابلۆیە) و فۆرماتی 21 H یان 22 A پەیڕەو ناکات؛ تەنها ژمارەی سەر سەیارەکە بنووسە.
                </span>
              </div>
              <span className="text-[10px] text-amber-400/80 font-mono hidden sm:inline">
                {plateNumber ? `تۆمار: علوج ${plateNumber}` : 'تەنها ژمارە'}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">ناوی خاوەن ئۆتۆمبێل</span>
              <input
                type="text"
                placeholder="ناوی خاوەن"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-medium ${isVehicleAloj ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                    {isVehicleAloj ? '⚠️ ژمارەی علوج (Unregistered Number)' : 'ژمارەی تابلۆ (Car Plate)'}
                  </span>
                  {currentProvince && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      currentProvince.isKurdistanRegion
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}>
                      {currentProvince.code} {currentProvince.mark ? `• ${currentProvince.mark}` : ''}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="text-[11px] text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded-lg border border-slate-700 flex items-center gap-1 transition cursor-pointer font-medium"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                  وێنەگرتن بە کامێرا
                </button>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    inputMode={isVehicleAloj ? 'numeric' : 'text'}
                    placeholder={isVehicleAloj ? 'وەک: 84920 (تەنها ژمارە بنووسە)' : '21 H 11111'}
                    value={plateNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (isVehicleAloj) {
                        // Allow typing digits and spaces
                        setPlateNumber(val.replace(/[^0-9\s]/g, ''));
                      } else {
                        setPlateNumber(val);
                        // Auto-detect province if starts with official code like 21, 22, 23, 24, 11, etc.
                        const detectedProv = detectProvinceFromPlateString(val);
                        if (detectedProv) {
                          setPlateCity(detectedProv.nameKrd);
                        }
                      }
                    }}
                    className={`w-full bg-slate-950 rounded-xl px-3 py-2 text-xs font-mono font-bold text-left focus:outline-none pl-9 ${
                      isVehicleAloj
                        ? 'border border-amber-500/40 text-amber-200 focus:border-amber-400 placeholder-amber-500/40'
                        : 'border border-slate-800 text-white focus:border-slate-500 placeholder-slate-600'
                    }`}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="absolute left-1.5 top-1.5 p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
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
                  className={`bg-slate-950 border rounded-xl px-2.5 py-2 text-xs focus:outline-none cursor-pointer max-w-[175px] ${
                    isVehicleAloj
                      ? 'border-amber-500/40 text-amber-300 font-bold'
                      : 'border-slate-800 text-slate-300'
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
              <span className="text-[11px] text-slate-400 block mb-1">ژمارەی مۆبایل (ئارەزوومەندانە)</span>
              <input
                type="text"
                placeholder="0770 000 0000"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-600 text-left font-mono"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* STEP 3: CURRENT ODOMETER */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-slate-400" />
              <span>٣. کیلۆمەتری ئێستای ئۆتۆمبێل (Current Odometer):</span>
            </label>
            <span className="text-[11px] text-slate-400">
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
                className="w-full bg-slate-950 border border-slate-800 focus:border-slate-600 rounded-xl pr-3 pl-12 py-2.5 text-sm font-mono font-bold text-white focus:outline-none transition"
              />
              <span className="absolute left-3 top-2.5 text-[11px] font-mono text-slate-500 font-bold">
                KM
              </span>
            </div>

            {/* Quick Mileage adjustment/presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-400 ml-1">دیاریکردنی خێرا:</span>
              {[25000, 50000, 75000, 100000, 150000].map((kmVal) => (
                <button
                  key={kmVal}
                  type="button"
                  onClick={() => setCurrentKm(kmVal)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-medium transition cursor-pointer ${
                    currentKm === kmVal
                      ? 'bg-slate-700 text-white border-slate-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {kmVal.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 4: OIL SPECIFICATIONS & COST */}
        <div className="space-y-4 pt-4 border-t border-slate-800 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-amber-500" />
              ٤. هەڵبژاردنی جۆری ڕۆن، خەستی و تێچوو:
            </span>
            <span className="text-[11px] text-slate-400">
              بەتاڵکردنەوەی ڕۆنی کۆن و تێکردنی ڕۆنی نوێ
            </span>
          </div>

            {/* Oil Brand Selection */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">مارکەی ڕۆن (Brand):</span>
              <select
                value={selectedOil.brand}
                onChange={(e) => {
                  const found = OIL_MODELS_LIST.find((o) => o.brand === e.target.value);
                  if (found) handleOilChange(found);
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-slate-600"
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
              <span className="text-[11px] text-slate-400 block mb-1">خەستی ڕۆن (Viscosity):</span>
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

            {/* Volume, Filter, and Interval */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">بڕی ڕۆن (لیتر)</span>
                <input
                  type="number"
                  step="0.5"
                  value={oilVolume}
                  onChange={(e) => setOilVolume(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-white text-center"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">فلتەری ڕۆن</span>
                <button
                  type="button"
                  onClick={() => setFilterChanged(!filterChanged)}
                  className={`w-full py-1.5 text-xs font-medium rounded-xl border transition ${
                    filterChanged
                      ? 'bg-slate-800 border-slate-600 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {filterChanged ? 'فلتەری نوێ دانرا ✓' : 'فلتەر نەگۆڕدرا'}
                </button>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">ماوەی گۆڕین (کم)</span>
                <select
                  value={intervalKm}
                  onChange={(e) => setIntervalKm(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                >
                  <option value={5000}>٥,٠٠٠ کم</option>
                  <option value={8000}>٨,٠٠٠ کم</option>
                  <option value={10000}>١٠,٠٠٠ کم</option>
                </select>
              </div>
            </div>

            {/* Calculated Next Service Overview */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between text-xs gap-2">
              <span className="text-slate-400">
                کیلۆمەتری داهاتوو:{' '}
                <strong className="text-white font-mono">{nextServiceKm.toLocaleString()} KM</strong>
              </span>
              <span className="text-slate-400">
                وادەی داهاتوو:{' '}
                <strong className="text-white font-mono">{nextServiceDate}</strong>
              </span>
            </div>

            {/* Total Cost & Price of Oil & Service (تێچووی ڕۆن و سەرجەم خەرجییەکان) */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-500/30 space-y-3 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white block">
                      تێچووی ڕۆنی نوێ و سەرجەم خەرجییەکان (کۆی گشتی بە دینار IQD):
                    </label>
                    <span className="text-[10px] text-slate-400">
                      بڕی پارەی ڕۆن، فلتەر و کرێی دەست بنووسە بۆ تۆمارکردن و ئەرشیف
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-medium self-start sm:self-auto">
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
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl pr-3 pl-12 py-2 text-sm font-mono font-bold text-emerald-400 placeholder-slate-600 focus:outline-none transition"
                  />
                  <span className="absolute left-2.5 top-2 text-[10px] text-slate-500 font-mono font-bold">
                    دینار
                  </span>
                </div>

                {/* Quick Presets for common Iraqi oil change costs */}
                <div className="sm:col-span-7 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 ml-1">دیاریکردنی خێرا:</span>
                  {[25000, 35000, 45000, 55000, 65000, 85000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTotalCostIQD(preset.toString())}
                      className={`px-2 py-1 text-xs font-mono font-bold rounded-lg border transition cursor-pointer ${
                        totalCostIQD === preset.toString()
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                          : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {preset.toLocaleString()}
                    </button>
                  ))}
                  {totalCostIQD && (
                    <button
                      type="button"
                      onClick={() => setTotalCostIQD('')}
                      className="text-[10px] text-slate-500 hover:text-rose-400 px-1 py-0.5 transition"
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
                  className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none transition"
                />
              </div>

              {totalCostIQD && Number(totalCostIQD) > 0 && (
                <div className="flex items-center justify-between text-xs pt-1 px-1 bg-slate-950/60 rounded-lg p-2 border border-slate-800/80">
                  <span className="text-slate-400">کۆی تێچووی تۆمارکراو بۆ ئەم سەردانە:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
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
                className="flex-1 py-3 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                تەواوکردن و چاپکردنی لەزگەی جام
              </button>

              <button
                type="button"
                onClick={() => handlePerformOilChange(false)}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
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
