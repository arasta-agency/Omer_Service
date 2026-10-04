import React, { useState } from 'react';
import { OilServiceRecord, Vehicle, Customer } from '../types';
import { SHOP_INFO } from '../data/mockData';
import { OmarOilLogo } from './OmarOilLogo';
import { Printer, X, QrCode, Tag, ShieldCheck } from 'lucide-react';

interface WindshieldStickerModalProps {
  record: OilServiceRecord;
  vehicle?: Vehicle;
  customer?: Customer;
  onClose: () => void;
}

export const WindshieldStickerModal: React.FC<WindshieldStickerModalProps> = ({
  record,
  vehicle,
  onClose,
}) => {
  const [tagFormat, setTagFormat] = useState<'standard' | 'thermal'>('standard');
  const [includeQr, setIncludeQr] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  const nextOdoFormatted = record.nextServiceOdometer.toLocaleString();
  const currentOdoFormatted = record.currentOdometer.toLocaleString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto text-right font-kurdish">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden no-print">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs">
              <Tag className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                لەزگەی جامی ئۆتۆمبێل (Windshield Sticker)
              </h2>
              <p className="text-xs text-slate-500">
                {vehicle?.licensePlate || 'ئۆتۆمبێل'} • {vehicle?.make} {vehicle?.model}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">جۆری چاپ:</span>
              <button
                type="button"
                onClick={() => setTagFormat('standard')}
                className={`px-3 py-1 rounded-lg border transition cursor-pointer ${
                  tagFormat === 'standard'
                    ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                شەفافی جام (2.5" × 2")
              </button>
              <button
                type="button"
                onClick={() => setTagFormat('thermal')}
                className={`px-3 py-1 rounded-lg border transition cursor-pointer ${
                  tagFormat === 'thermal'
                    ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                تەرمەڵ زیبرا (2" × 1.5")
              </button>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={includeQr}
                onChange={(e) => setIncludeQr(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              کۆدی QR
            </label>
          </div>

          {/* Sticker Preview Container */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200">
            {/* Physical Print Area */}
            <div
              className={`printable-area print-sticker-box bg-white text-slate-900 border-2 border-slate-900 shadow-sm rounded-lg p-3.5 flex flex-col justify-between select-none text-right ${
                tagFormat === 'thermal' ? 'w-72 h-48 text-[11px]' : 'w-80 h-56 text-xs'
              }`}
            >
              {/* Sticker Top Header */}
              <div className="border-b-2 border-slate-900 pb-1.5 flex items-center justify-between gap-1.5 overflow-hidden">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <div className="shrink-0">
                    <OmarOilLogo variant="red" size="xs" />
                  </div>
                  <div className="min-w-0 leading-none">
                    <h3 className="font-extrabold uppercase tracking-tight text-slate-950 text-[10px] sm:text-[11px] font-display truncate">
                      Omar Oil
                    </h3>
                    <p className="text-[7.5px] sm:text-[8px] text-slate-600 font-mono truncate mt-0.5" dir="ltr">
                      {SHOP_INFO.phone}
                    </p>
                  </div>
                </div>
                <div className="font-mono font-bold text-[9.5px] sm:text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-300 shrink-0 whitespace-nowrap">
                  {vehicle?.licensePlate || 'تابلۆ'}
                </div>
              </div>

              {/* Central Target Data */}
              <div className="my-2 space-y-1.5">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-100 border border-slate-300 rounded p-1.5">
                    <span className="block text-[9px] font-bold text-slate-600">
                      بەرواری داهاتوو / NEXT DATE
                    </span>
                    <span className="block font-bold text-sm font-mono text-slate-950">
                      {record.nextServiceDate}
                    </span>
                  </div>

                  <div className="bg-slate-100 border border-slate-300 rounded p-1.5">
                    <span className="block text-[9px] font-bold text-slate-600">
                      کیلۆمەتری داهاتوو / NEXT KM
                    </span>
                    <span className="block font-bold text-sm font-mono text-slate-950">
                      {nextOdoFormatted} KM
                    </span>
                  </div>
                </div>

                {/* Specs */}
                <div className="bg-slate-50 border border-slate-200 rounded p-1 flex items-center justify-between text-[10px]">
                  <div>
                    <span className="text-slate-500">جۆری ڕۆن: </span>
                    <span className="font-bold text-slate-900">{record.oilViscosity} ({record.oilBrand.split(' ')[0]})</span>
                  </div>
                  <div>
                    <span className="text-slate-500">کیلۆمەتری ئێستا: </span>
                    <span className="font-mono font-bold">{currentOdoFormatted} KM</span>
                  </div>
                </div>
              </div>

              {/* Sticker Footer */}
              <div className="pt-1 border-t border-slate-300 flex items-center justify-between text-[9px] text-slate-600">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-slate-700" />
                  <span>فلتەر: {record.oilFilterPartNumber}</span>
                </div>
                {includeQr && (
                  <div className="flex items-center gap-1 font-mono text-[8px] bg-slate-100 px-1 py-0.5 rounded border border-slate-300">
                    <QrCode className="w-3 h-3 text-slate-700" />
                    <span>SERVICE TAG</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              داخستن
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              چاپکردنی لەزگە
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
