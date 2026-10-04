import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { FastKurdishOilIntake } from './components/FastKurdishOilIntake';
import { CarArchiveModule } from './components/CarArchiveModule';
import { OilChangeLogger } from './components/OilChangeLogger';
import { TireAlignmentModule } from './components/TireAlignmentModule';
import { DVIModule } from './components/DVIModule';
import { InventoryPOSModule } from './components/InventoryPOSModule';
import { CustomerVehicleCRM } from './components/CustomerVehicleCRM';
import { RetentionCenter } from './components/RetentionCenter';
import { WindshieldStickerModal } from './components/WindshieldStickerModal';
import { CustomerApprovalPortalModal } from './components/CustomerApprovalPortalModal';
import { NewIntakeModal } from './components/NewIntakeModal';
import { SystemPresentationModal } from './components/SystemPresentationModal';
import { SHOP_INFO } from './data/mockData';
import { OmarOilLogo } from './components/OmarOilLogo';
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Phone,
  Layers,
  Zap,
  FileText,
} from 'lucide-react';

const MainShopApp: React.FC = () => {
  // Default to fast Kurdish oil intake as requested by the user!
  const [currentTab, setCurrentTab] = useState<string>('fast_oil');
  const [activeWOForBay, setActiveWOForBay] = useState<string | undefined>(undefined);
  const [isNewIntakeOpen, setIsNewIntakeOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  const {
    stickerModalRecord,
    setStickerModalRecord,
    customerPortalWorkOrderId,
    setCustomerPortalWorkOrderId,
    vehicles,
    customers,
    resetAllData,
  } = useShop();

  const activeStickerVehicle = stickerModalRecord
    ? vehicles.find((v) => v.id === stickerModalRecord.vehicleId)
    : undefined;

  const activeStickerCustomer = stickerModalRecord
    ? customers.find((c) => c.id === stickerModalRecord.customerId)
    : undefined;

  const handleOpenBay = (woId: string, tab: string) => {
    setActiveWOForBay(woId);
    setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-kurdish text-right" dir="rtl">
      {/* Header with Navigation & Role Switcher */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNewIntake={() => setIsNewIntakeOpen(true)}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 0: FAST KURDISH OIL INTAKE (PRIMARY WORKFLOW) */}
        {currentTab === 'fast_oil' && <FastKurdishOilIntake />}

        {/* TAB 1: VEHICLE ARCHIVE & OIL CHANGE HISTORY */}
        {(currentTab === 'archive' || currentTab === 'kanban') && (
          <CarArchiveModule />
        )}

        {/* TAB 2: SPECIALIZED OIL CHANGE & RETURN CALC */}
        {currentTab === 'oil' && (
          <OilChangeLogger
            initialWorkOrderId={activeWOForBay}
            onSavedSuccess={() => {}}
          />
        )}

        {/* TAB 3: SPECIALIZED TIRE & ALIGNMENT */}
        {currentTab === 'tire' && (
          <TireAlignmentModule
            initialWorkOrderId={activeWOForBay}
            onSavedSuccess={() => {}}
          />
        )}

        {/* TAB 4: DIGITAL VEHICLE INSPECTION (DVI) */}
        {currentTab === 'dvi' && (
          <DVIModule
            initialWorkOrderId={activeWOForBay}
            onOpenCustomerPortal={(woId) => setCustomerPortalWorkOrderId(woId)}
          />
        )}

        {/* TAB 5: INVENTORY & POS */}
        {currentTab === 'inventory' && (
          <InventoryPOSModule initialWorkOrderId={activeWOForBay} />
        )}

        {/* TAB 6: CUSTOMER & VEHICLE CRM */}
        {currentTab === 'crm' && <CustomerVehicleCRM />}

        {/* TAB 7: RETENTION & WHATSAPP ALERTS */}
        {currentTab === 'retention' && <RetentionCenter />}
      </main>

      {/* Windshield Sticker Modal */}
      {stickerModalRecord && (
        <WindshieldStickerModal
          record={stickerModalRecord}
          vehicle={activeStickerVehicle}
          customer={activeStickerCustomer}
          onClose={() => setStickerModalRecord(null)}
        />
      )}

      {/* Customer Estimate Approval Portal Simulator Modal */}
      {customerPortalWorkOrderId && (
        <CustomerApprovalPortalModal
          workOrderId={customerPortalWorkOrderId}
          onClose={() => setCustomerPortalWorkOrderId(null)}
        />
      )}

      {/* New Intake Quick Check-in Modal */}
      {isNewIntakeOpen && (
        <NewIntakeModal
          onClose={() => setIsNewIntakeOpen(false)}
          onSuccess={(woId) => {
            setIsNewIntakeOpen(false);
            setCurrentTab('kanban');
          }}
        />
      )}

      {/* System Kurdish Sorani Presentation PDF Modal */}
      {isPresentationOpen && (
        <SystemPresentationModal onClose={() => setIsPresentationOpen(false)} />
      )}

      {/* Global Shop Footer */}
      <footer className="no-print bg-slate-50 border-t border-slate-200 py-6 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-white px-1.5 py-0.5 rounded-lg border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
              <OmarOilLogo variant="red" size="xs" />
            </div>
            <span className="font-bold text-xs text-slate-800 font-display">عومەر ئۆیڵ (Omar Oil)</span>
            <span>• {SHOP_INFO.city}، {SHOP_INFO.address}</span>
            <span>• پەیوەندی: {SHOP_INFO.phoneFormatted || SHOP_INFO.phone}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsPresentationOpen(true)}
              className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>پرێزێنتەیشنی سیستەم (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('ئایا دڵنیایت لە گەڕاندنەوەی سەرجەم زانیارییەکان بۆ دۆخی سەرەتایی؟')) {
                  resetAllData();
                }
              }}
              className="hover:text-slate-300 flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              رێکخستنەوەی داتا (Reset)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainShopApp />
    </ShopProvider>
  );
}

