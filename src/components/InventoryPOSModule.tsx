import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { InventoryItem, Invoice, WorkOrder } from '../types';
import { SHOP_INFO } from '../data/mockData';
import { OmarOilLogo } from './OmarOilLogo';
import {
  Boxes,
  Receipt,
  Droplet,
  Printer,
  CreditCard,
  CheckCircle2,
  Search,
  Check,
} from 'lucide-react';

interface InventoryPOSModuleProps {
  initialWorkOrderId?: string;
}

export const InventoryPOSModule: React.FC<InventoryPOSModuleProps> = ({
  initialWorkOrderId,
}) => {
  const {
    inventory,
    invoices,
    workOrders,
    vehicles,
    customers,
    generateInvoiceForWorkOrder,
    restockInventoryItem,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'inventory' | 'pos' | 'invoices'>('inventory');
  const [invCategory, setInvCategory] = useState<string>('all');
  const [searchInv, setSearchInv] = useState('');
  const [selectedWOForInvoice, setSelectedWOForInvoice] = useState<string>(
    initialWorkOrderId || workOrders[0]?.id || ''
  );
  const [paymentMethod, setPaymentMethod] = useState<Invoice['paymentMethod']>('cash');
  const [generatedInvoice, setGeneratedInvoice] = useState<Invoice | null>(null);

  const bulkDrums = inventory.filter((i) => i.category === 'bulk_oil');

  const filteredInventory = inventory.filter((item) => {
    const matchesCat = invCategory === 'all' || item.category === invCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchInv.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchInv.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchInv.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const CATEGORY_NAMES: Record<string, string> = {
    all: 'هەمووی',
    bulk_oil: 'بەرمیلەکانی ڕۆن',
    filter: 'فلتەرەکان',
    tire: 'تایەکان',
    fluid: 'شلە لاوەکییەکان',
  };

  const handleCheckout = () => {
    if (!selectedWOForInvoice) return;
    const inv = generateInvoiceForWorkOrder(selectedWOForInvoice, paymentMethod);
    setGeneratedInvoice(inv);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-5 text-right font-kurdish text-slate-800">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-slate-700" />
              کۆگا و پسوولەی فرۆشتن (Inventory &amp; POS)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              چاودێری بڕی بەرمیلەکانی ڕۆن، فلتەر، تایە، و دەرکردنی پسوولەی چاپکراو بۆ کڕیار.
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              کۆگای کەلوپەل
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pos')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'pos'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              دەرکردنی پسوولە (POS)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('invoices')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'invoices'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              مێژووی پسوولەکان ({invoices.length})
            </button>
          </div>
        </div>

        {/* TAB 1: INVENTORY & BULK OIL DRUMS */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Bulk Oil Drums Overview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 block">
                بەرمیلەکانی ڕۆنی کۆگا (قەبارەی ٢٠٨ لیتر):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bulkDrums.map((drum) => {
                  const currentLiters = drum.drumCurrentLiters ?? drum.stockQuantity;
                  const pct = Math.round((currentLiters / 208) * 100);
                  return (
                    <div
                      key={drum.id}
                      className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{drum.name}</span>
                        <span className="font-mono text-slate-900 font-bold">{currentLiters} L</span>
                      </div>

                      {/* Clean Progress Bar */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-800 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>خەستی: <strong className="text-slate-800 font-mono">{drum.viscosity}</strong></span>
                        <button
                          type="button"
                          onClick={() => restockInventoryItem(drum.id, 50)}
                          className="text-[10px] text-slate-700 hover:text-slate-950 font-medium underline cursor-pointer"
                        >
                          +٥٠ لیتر زیادبکە
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inventory Table & Search */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="گەڕان لە کۆگا..."
                    value={searchInv}
                    onChange={(e) => setSearchInv(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-2xs"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
                  {Object.keys(CATEGORY_NAMES).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setInvCategory(cat)}
                      className={`px-3 py-1 text-xs rounded-lg border transition cursor-pointer ${
                        invCategory === cat
                          ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {CATEGORY_NAMES[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items List */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 px-3">کۆد (SKU)</th>
                      <th className="py-2 px-3">ناوی کەلوپەل</th>
                      <th className="py-2 px-3">مارکە</th>
                      <th className="py-2 px-3">مەخزەن</th>
                      <th className="py-2 px-3">نرخی فرۆشتن</th>
                      <th className="py-2 px-3">کردار</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono text-slate-500">{item.sku}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{item.name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{item.brand}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {item.stockQuantity} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-800">
                          {item.retailPrice.toLocaleString()} IQD
                        </td>
                        <td className="py-2.5 px-3">
                          <button
                            type="button"
                            onClick={() => restockInventoryItem(item.id, 10)}
                            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 rounded text-[11px] transition cursor-pointer"
                          >
                            + زیادکردن
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: POS CHECKOUT & INVOICE */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Select Work Order & Payment (7 cols) */}
            <div className="lg:col-span-7 space-y-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-2">
                دەرکردنی پسوولەی فرۆشتن بۆ ئۆتۆمبێل:
              </span>

              <div>
                <span className="text-[11px] text-slate-600 font-medium block mb-1">ئۆتۆمبێل هەڵبژێرە:</span>
                <select
                  value={selectedWOForInvoice}
                  onChange={(e) => setSelectedWOForInvoice(e.target.value)}
                  className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 shadow-2xs cursor-pointer"
                >
                  {workOrders.map((wo) => {
                    const v = vehicles.find((veh) => veh.id === wo.vehicleId);
                    const c = customers.find((cust) => cust.id === wo.customerId);
                    return (
                      <option key={wo.id} value={wo.id}>
                        {v?.licensePlate} — {v?.make} {v?.model} ({c?.fullName})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <span className="text-[11px] text-slate-600 font-medium block mb-1.5">شێوازی پارەدان:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-2 rounded-xl border transition cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    نەختینە (کاش / Cash)
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 rounded-xl border transition cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    کارتی بانکی (FIB / FastPay)
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                دروستکردنی پسوولە و بڕین لە مەخزەن
              </button>
            </div>

            {/* Right: Printable Invoice Preview (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-900">پسوولەی دەرچوو</span>
                {generatedInvoice && (
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs rounded-lg transition flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    چاپکردن
                  </button>
                )}
              </div>

              {generatedInvoice ? (
                <div className="bg-white text-slate-950 p-4 rounded-xl border border-slate-300 text-xs space-y-3 font-mono shadow-2xs">
                  <div className="text-center border-b border-slate-200 pb-2 flex flex-col items-center">
                    <OmarOilLogo variant="red" size="sm" />
                    <strong className="block text-sm font-bold font-kurdish mt-1 text-slate-900">{SHOP_INFO.name}</strong>
                    <span className="text-[10px] text-slate-600 font-kurdish">سێرڤسی ئۆتۆمبێل و ڕۆنگۆڕین</span>
                    <span className="block text-[10px] text-slate-500 font-mono">{generatedInvoice.invoiceNumber}</span>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    {generatedInvoice.lineItems.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{it.quantity}x {it.description}</span>
                        <span>{it.total.toLocaleString()} IQD</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                    <span>کۆی گشتی:</span>
                    <span>{generatedInvoice.totalAmount.toLocaleString()} IQD</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  ئۆتۆمبێل هەڵبژێرە و دوگمەی دروستکردنی پسوولە دابگرە.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: INVOICES HISTORY */}
        {activeTab === 'invoices' && (
          <div className="space-y-2">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-2xs"
              >
                <div>
                  <span className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</span>
                  <span className="text-slate-500 mr-2 font-mono">({inv.date})</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {inv.totalAmount.toLocaleString()} IQD
                  </span>
                  <span className="text-[11px] text-slate-600">
                    {inv.paymentMethod === 'cash' ? 'کاش' : 'کارت'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
