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
} from 'lucide-react';

const MainShopApp: React.FC = () => {
  // Default to fast Kurdish oil intake as requested by the user!
  const [currentTab, setCurrentTab] = useState<string>('fast_oil');
  const [activeWOForBay, setActiveWOForBay] = useState<string | undefined>(undefined);
  const [isNewIntakeOpen, setIsNewIntakeOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-kurdish text-right" dir="rtl">
      {/* Header with Navigation & Role Switcher */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNewIntake={() => setIsNewIntakeOpen(true)}
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

      {/* Global Shop Footer */}
      <footer className="no-print bg-slate-950 border-t border-slate-900 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-800">
              <OmarOilLogo variant="red" size="xs" />
            </div>
            <span className="font-bold text-xs text-slate-300 font-display">Omar Oil</span>
            <span>• {SHOP_INFO.address}, {SHOP_INFO.city}</span>
            <span>• پەیوەندی: {SHOP_INFO.phone}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('ئایا دڵنیایت لە گەڕاندنەوەی سەرجەم زانیارییەکان بۆ دۆخی سەرەتایی؟')) {
                  resetAllData();
                }
              }}
              className="hover:text-slate-300 flex items-center gap-1 transition"
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

