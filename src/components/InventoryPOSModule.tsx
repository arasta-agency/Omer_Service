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
    <div className="space-y-5 text-right font-kurdish text-slate-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Boxes className="w-5 h-5 text-slate-300" />
              کۆگا و پسوولەی فرۆشتن (Inventory &amp; POS)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              چاودێری بڕی بەرمیلەکانی ڕۆن، فلتەر، تایە، و دەرکردنی پسوولەی چاپکراو بۆ کڕیار.
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'inventory'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              کۆگای کەلوپەل
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pos')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'pos'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              دەرکردنی پسوولە (POS)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('invoices')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'invoices'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
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
              <span className="text-xs font-bold text-slate-300 block">
                بەرمیلەکانی ڕۆنی کۆگا (قەبارەی ٢٠٨ لیتر):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bulkDrums.map((drum) => {
                  const currentLiters = drum.drumCurrentLiters ?? drum.stockQuantity;
                  const pct = Math.round((currentLiters / 208) * 100);
                  return (
                    <div
                      key={drum.id}
                      className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{drum.name}</span>
                        <span className="font-mono text-slate-300 font-bold">{currentLiters} L</span>
                      </div>

                      {/* Clean Progress Bar */}
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-slate-300 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>خەستی: <strong className="text-slate-200 font-mono">{drum.viscosity}</strong></span>
                        <button
                          type="button"
                          onClick={() => restockInventoryItem(drum.id, 50)}
                          className="text-[10px] text-slate-300 hover:text-white underline"
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
                  <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="گەڕان لە کۆگا..."
                    value={searchInv}
                    onChange={(e) => setSearchInv(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
                  {Object.keys(CATEGORY_NAMES).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setInvCategory(cat)}
                      className={`px-3 py-1 text-xs rounded-lg border transition ${
                        invCategory === cat
                          ? 'bg-slate-800 text-white border-slate-600 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
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
                    <tr className="border-b border-slate-800 text-slate-400">
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
                      <tr key={item.id} className="border-b border-slate-800/60 hover:bg-slate-950/40">
                        <td className="py-2.5 px-3 font-mono text-slate-400">{item.sku}</td>
                        <td className="py-2.5 px-3 font-semibold text-white">{item.name}</td>
                        <td className="py-2.5 px-3 text-slate-400">{item.brand}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-white">
                          {item.stockQuantity} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-200">
                          {item.retailPrice.toLocaleString()} IQD
                        </td>
                        <td className="py-2.5 px-3">
                          <button
                            type="button"
                            onClick={() => restockInventoryItem(item.id, 10)}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition"
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
            <div className="lg:col-span-7 space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-white block border-b border-slate-800 pb-2">
                دەرکردنی پسوولەی فرۆشتن بۆ ئۆتۆمبێل:
              </span>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">ئۆتۆمبێل هەڵبژێرە:</span>
                <select
                  value={selectedWOForInvoice}
                  onChange={(e) => setSelectedWOForInvoice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
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
                <span className="text-[11px] text-slate-400 block mb-1.5">شێوازی پارەدان:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-2 rounded-xl border transition ${
                      paymentMethod === 'cash'
                        ? 'bg-slate-800 text-white border-slate-600 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    نەختینە (کاش / Cash)
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 rounded-xl border transition ${
                      paymentMethod === 'card'
                        ? 'bg-slate-800 text-white border-slate-600 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    کارتی بانکی (FIB / FastPay)
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow"
              >
                <Receipt className="w-4 h-4" />
                دروستکردنی پسوولە و بڕین لە مەخزەن
              </button>
            </div>

            {/* Right: Printable Invoice Preview (5 cols) */}
            <div className="lg:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white">پسوولەی دەرچوو</span>
                {generatedInvoice && (
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg transition flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    چاپکردن
                  </button>
                )}
              </div>

              {generatedInvoice ? (
                <div className="bg-white text-slate-950 p-4 rounded-xl border border-slate-300 text-xs space-y-3 font-mono">
                  <div className="text-center border-b border-slate-300 pb-2 flex flex-col items-center">
                    <OmarOilLogo variant="red" size="sm" />
                    <strong className="block text-sm font-bold font-kurdish mt-1">{SHOP_INFO.name}</strong>
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

                  <div className="border-t border-slate-300 pt-2 flex justify-between font-bold text-sm">
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
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-white">{inv.invoiceNumber}</span>
                  <span className="text-slate-400 mr-2 font-mono">({inv.date})</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-white text-sm">
                    {inv.totalAmount.toLocaleString()} IQD
                  </span>
                  <span className="text-[11px] text-slate-400">
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
