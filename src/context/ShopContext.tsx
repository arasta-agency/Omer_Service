import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Customer,
  Vehicle,
  WorkOrder,
  InventoryItem,
  Invoice,
  RetentionReminder,
  ReminderTemplate,
  UserRole,
  WorkOrderStatus,
  OilServiceRecord,
  TireInspectionRecord,
  DVIItem,
  JobPartUsage,
} from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_VEHICLES,
  INITIAL_WORK_ORDERS,
  INITIAL_INVENTORY,
  INITIAL_INVOICES,
  INITIAL_REMINDERS,
  RETENTION_TEMPLATES,
  SHOP_INFO,
} from '../data/mockData';

interface ShopContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  customers: Customer[];
  vehicles: Vehicle[];
  workOrders: WorkOrder[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  reminders: RetentionReminder[];
  templates: ReminderTemplate[];
  selectedWorkOrderId: string | null;
  setSelectedWorkOrderId: (id: string | null) => void;
  customerPortalWorkOrderId: string | null;
  setCustomerPortalWorkOrderId: (id: string | null) => void;
  stickerModalRecord: OilServiceRecord | null;
  setStickerModalRecord: (rec: OilServiceRecord | null) => void;
  // Helpers & Business logic
  getCustomerById: (id: string) => Customer | undefined;
  getVehicleById: (id: string) => Vehicle | undefined;
  getCustomerVehicles: (customerId: string) => Vehicle[];
  getVehicleCustomer: (vehicleId: string) => Customer | undefined;
  updateWorkOrderStatus: (woId: string, status: WorkOrderStatus) => void;
  saveOilService: (woId: string, record: Partial<OilServiceRecord>) => OilServiceRecord;
  saveTireInspection: (woId: string, record: TireInspectionRecord) => void;
  updateDVIItemStatus: (woId: string, itemId: string, status: DVIItem['status'], notes?: string) => void;
  customerToggleDVIItem: (woId: string, itemId: string, approved: boolean) => void;
  addWorkOrder: (order: Partial<WorkOrder>) => WorkOrder;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalSpend' | 'paymentHistory'>) => Customer;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'mileageHistory'>) => Vehicle;
  generateInvoiceForWorkOrder: (woId: string, paymentMethod?: Invoice['paymentMethod']) => Invoice;
  dispatchReminder: (reminderId: string) => void;
  updateTemplate: (id: string, body: string) => void;
  deductInventoryForOil: (drumSku: string, liters: number) => void;
  restockInventoryItem: (id: string, quantityToAdd: number) => void;
  resetAllData: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CUSTOMERS: 'omer_svc_customers_v1',
  VEHICLES: 'omer_svc_vehicles_v1',
  WORK_ORDERS: 'omer_svc_work_orders_v1',
  INVENTORY: 'omer_svc_inventory_v1',
  INVOICES: 'omer_svc_invoices_v1',
  REMINDERS: 'omer_svc_reminders_krd_v2',
  TEMPLATES: 'omer_svc_templates_krd_v2',
  ROLE: 'omer_svc_role_v1',
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'advisor';
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORK_ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_WORK_ORDERS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [reminders, setReminders] = useState<RetentionReminder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  const [templates, setTemplates] = useState<ReminderTemplate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.some(
            (t) =>
              t.body &&
              (t.body.includes('Dear') ||
                t.body.includes('Hello') ||
                t.body.includes('Notice from') ||
                t.name?.includes('Scheduled') ||
                t.name?.includes('Overdue'))
          )
        ) {
          localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(RETENTION_TEMPLATES));
          return RETENTION_TEMPLATES;
        }
        return parsed;
      } catch {
        return RETENTION_TEMPLATES;
      }
    }
    return RETENTION_TEMPLATES;
  });

  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(null);
  const [customerPortalWorkOrderId, setCustomerPortalWorkOrderId] = useState<string | null>(null);
  const [stickerModalRecord, setStickerModalRecord] = useState<OilServiceRecord | null>(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORK_ORDERS, JSON.stringify(workOrders));
  }, [workOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  }, [templates]);

  // Lookup helpers
  const getCustomerById = (id: string) => customers.find((c) => c.id === id);
  const getVehicleById = (id: string) => vehicles.find((v) => v.id === id);
  const getCustomerVehicles = (customerId: string) => vehicles.filter((v) => v.customerId === customerId);
  const getVehicleCustomer = (vehicleId: string) => {
    const veh = vehicles.find((v) => v.id === vehicleId);
    if (!veh) return undefined;
    return customers.find((c) => c.id === veh.customerId);
  };

  const updateWorkOrderStatus = (woId: string, status: WorkOrderStatus) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id !== woId) return wo;
        const updated = { ...wo, status };
        if (status === 'completed' && !wo.completedAt) {
          updated.completedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
        }
        return updated;
      })
    );
  };

  const deductInventoryForOil = (drumSku: string, liters: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.sku === drumSku && item.drumCurrentLiters !== undefined) {
          const newCurrent = Math.max(0, Number((item.drumCurrentLiters - liters).toFixed(2)));
          return {
            ...item,
            drumCurrentLiters: newCurrent,
            stockQuantity: Math.floor(newCurrent),
          };
        }
        return item;
      })
    );
  };

  const restockInventoryItem = (id: string, quantityToAdd: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.stockQuantity + quantityToAdd;
          const updatedDrum =
            item.drumCapacityLiters !== undefined ? Math.min(item.drumCapacityLiters, (item.drumCurrentLiters || 0) + quantityToAdd) : undefined;
          return {
            ...item,
            stockQuantity: newQty,
            drumCurrentLiters: updatedDrum,
          };
        }
        return item;
      })
    );
  };

  // Specialized Oil Change Calculation Engine
  const saveOilService = (woId: string, data: Partial<OilServiceRecord>): OilServiceRecord => {
    const currentOdo = Number(data.currentOdometer) || 50000;
    const intervalKm = Number(data.serviceIntervalKm) || 8000;
    const intervalMonths = Number(data.serviceIntervalMonths) || 6;

    // Return Calculation Engine formula:
    const nextOdo = currentOdo + intervalKm;
    const baseDate = data.serviceDate ? new Date(data.serviceDate) : new Date();
    const nextDateObj = new Date(baseDate);
    nextDateObj.setMonth(nextDateObj.getMonth() + intervalMonths);
    const nextDateStr = nextDateObj.toISOString().split('T')[0];

    const fullRecord: OilServiceRecord = {
      id: data.id || `oil-rec-${Date.now()}`,
      workOrderId: woId,
      vehicleId: data.vehicleId || '',
      customerId: data.customerId || '',
      serviceDate: data.serviceDate || new Date().toISOString().split('T')[0],
      currentOdometer: currentOdo,
      odometerUnit: data.odometerUnit || 'km',
      oilBrand: data.oilBrand || 'Castrol EDGE Professional LL-04',
      oilViscosity: data.oilViscosity || '5W-30',
      oilCategory: data.oilCategory || 'Full Synthetic',
      volumeUsedLiters: Number(data.volumeUsedLiters) || 5.0,
      oilFilterPartNumber: data.oilFilterPartNumber || 'OX 388D',
      totalCostIQD: Number(data.totalCostIQD) || 0,
      costNotes: data.costNotes || '',
      auxiliaryFluids: data.auxiliaryFluids || {
        brakeFluid: 'ok',
        transmissionFluid: 'ok',
        coolant: 'ok',
        powerSteering: 'ok',
      },
      auxiliaryFilters: data.auxiliaryFilters || {
        airFilter: 'clean',
        cabinFilter: 'clean',
      },
      serviceIntervalKm: intervalKm,
      serviceIntervalMonths: intervalMonths,
      nextServiceOdometer: nextOdo,
      nextServiceDate: nextDateStr,
      technicianName: data.technicianName || 'Jack Carter',
      stickerPrinted: Boolean(data.stickerPrinted),
      notes: data.notes || '',
    };

    // Update Work Order
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === woId) {
          return {
            ...wo,
            oilRecord: fullRecord,
            // If was in intake or inspection, move forward
            status: wo.status === 'intake' || wo.status === 'inspection' ? 'in_progress' : wo.status,
          };
        }
        return wo;
      })
    );

    // Update vehicle odometer and append mileage log
    if (fullRecord.vehicleId) {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id === fullRecord.vehicleId) {
            const newHistory = [
              {
                id: `m-${Date.now()}`,
                date: fullRecord.serviceDate,
                odometer: fullRecord.currentOdometer,
                unit: fullRecord.odometerUnit,
                serviceType: `${fullRecord.oilViscosity} ${fullRecord.oilBrand} Oil Service`,
              },
              ...v.mileageHistory,
            ];
            return {
              ...v,
              currentOdometer: Math.max(v.currentOdometer, fullRecord.currentOdometer),
              mileageHistory: newHistory,
            };
          }
          return v;
        })
      );
    }

    // Update customer spend if cost provided
    if (fullRecord.totalCostIQD && fullRecord.totalCostIQD > 0 && fullRecord.customerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === fullRecord.customerId
            ? { ...c, totalSpend: (c.totalSpend || 0) + Number(fullRecord.totalCostIQD) }
            : c
        )
      );
    }

    // Auto-generate or update retention reminder for this vehicle
    setReminders((prev) => {
      const filtered = prev.filter((r) => r.vehicleId !== fullRecord.vehicleId);
      const daysUntilDue = Math.round((nextDateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const veh = vehicles.find((v) => v.id === fullRecord.vehicleId);
      const cust = customers.find((c) => c.id === fullRecord.customerId);

      const newReminder: RetentionReminder = {
        id: `rem-${Date.now()}`,
        customerId: fullRecord.customerId,
        vehicleId: fullRecord.vehicleId,
        type: 'upcoming_oil_service',
        dueDate: nextDateStr,
        dueMileage: nextOdo,
        daysDiff: daysUntilDue,
        channel: cust?.preferredChannel || 'whatsapp',
        status: 'scheduled',
        renderedMessage: `سڵاو کاک ${cust?.fullName || 'کڕیاری بەڕێز'}، ئۆتۆمبێلەکەت ${veh?.make || ''} ${veh?.model || ''} (${veh?.licensePlate || ''}) کاتی گۆڕینی ڕۆنەکەی لە بەرواری ${nextDateStr} دەبێت لە کیلۆمەتری ${nextOdo.toLocaleString()} کم. سەنتەری ${SHOP_INFO.name} (${SHOP_INFO.phone}).`,
      };
      return [newReminder, ...filtered];
    });

    return fullRecord;
  };

  const saveTireInspection = (woId: string, record: TireInspectionRecord) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === woId) {
          return {
            ...wo,
            tireRecord: record,
          };
        }
        return wo;
      })
    );
  };

  const updateDVIItemStatus = (woId: string, itemId: string, status: DVIItem['status'], notes?: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === woId) {
          const updatedDvi = wo.dviItems.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                status,
                technicianNotes: notes !== undefined ? notes : item.technicianNotes,
              };
            }
            return item;
          });
          return {
            ...wo,
            dviItems: updatedDvi,
          };
        }
        return wo;
      })
    );
  };

  const customerToggleDVIItem = (woId: string, itemId: string, approved: boolean) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === woId) {
          const updatedDvi = wo.dviItems.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                customerApproved: approved,
              };
            }
            return item;
          });

          // Check if all items now have a decision
          const hasPending = updatedDvi.some((i) => i.status !== 'green' && i.customerApproved === null);
          const newStatus = hasPending ? wo.status : 'in_progress';

          return {
            ...wo,
            dviItems: updatedDvi,
            status: wo.status === 'pending_approval' && !hasPending ? newStatus : wo.status,
            estimateApprovedAt: !hasPending ? new Date().toISOString() : wo.estimateApprovedAt,
          };
        }
        return wo;
      })
    );
  };

  const addWorkOrder = (orderData: Partial<WorkOrder>): WorkOrder => {
    const nextNum = `WO-2026-${(workOrders.length + 820).toString().padStart(4, '0')}`;
    const newWo: WorkOrder = {
      id: `wo-${Date.now()}`,
      orderNumber: nextNum,
      customerId: orderData.customerId || '',
      vehicleId: orderData.vehicleId || '',
      status: orderData.status || 'intake',
      priority: orderData.priority || 'routine',
      intakeDate: orderData.intakeDate || new Date().toISOString().replace('T', ' ').substring(0, 16),
      promisedDate: orderData.promisedDate || new Date(Date.now() + 6 * 3600 * 1000).toISOString().replace('T', ' ').substring(0, 16),
      assignedTechnician: orderData.assignedTechnician || 'Jack Carter',
      requestedServices: orderData.requestedServices || ['Full Synthetic Oil Change', 'Digital Vehicle Inspection'],
      customerConcerns: orderData.customerConcerns || '',
      dviItems: orderData.dviItems || [
        {
          id: `dvi-${Date.now()}-1`,
          category: 'Fluids & Leaks',
          title: 'Engine Oil Drain & Filter Seal',
          description: 'Check for sump plug leaks and oil filter gasket seating.',
          status: 'green',
          technicianNotes: 'Inspection clear.',
          estimatedCost: 0,
          customerApproved: true,
        },
        {
          id: `dvi-${Date.now()}-2`,
          category: 'Braking System',
          title: 'Front & Rear Brake Pad Wear',
          description: 'Friction material thickness check.',
          status: 'green',
          technicianNotes: 'Front pads 7mm, rear pads 6mm.',
          estimatedCost: 0,
          customerApproved: true,
        },
        {
          id: `dvi-${Date.now()}-3`,
          category: 'Tires & Wheels',
          title: 'Tread Depth & PSI Balance',
          description: '4-wheel digital tread gauge and tire pressure balancing.',
          status: 'green',
          technicianNotes: 'All tires set to manufacturer spec.',
          estimatedCost: 0,
          customerApproved: true,
        },
      ],
      partsUsed: orderData.partsUsed || [],
      laborHours: orderData.laborHours || 1.2,
      laborRate: orderData.laborRate || SHOP_INFO.laborRatePerHour,
      notes: orderData.notes || '',
    };

    setWorkOrders((prev) => [newWo, ...prev]);
    return newWo;
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'totalSpend' | 'paymentHistory'>): Customer => {
    const newCust: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      totalSpend: 0,
      paymentHistory: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const addVehicle = (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'mileageHistory'>): Vehicle => {
    const newVeh: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}`,
      mileageHistory: [
        {
          id: `m-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          odometer: vehicleData.currentOdometer,
          unit: vehicleData.odometerUnit,
          serviceType: 'Initial System Registration',
        },
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setVehicles((prev) => [newVeh, ...prev]);
    return newVeh;
  };

  const generateInvoiceForWorkOrder = (woId: string, paymentMethod: Invoice['paymentMethod'] = 'card'): Invoice => {
    const wo = workOrders.find((w) => w.id === woId);
    if (!wo) throw new Error('Work order not found');

    const lineItems: Invoice['lineItems'] = [];

    // 1. Labor
    if (wo.laborHours > 0) {
      lineItems.push({
        id: `li-lab-${Date.now()}`,
        type: 'labor',
        description: `Professional Technician Labor (${wo.laborHours} hrs @ $${wo.laborRate}/hr)`,
        quantity: wo.laborHours,
        unitPrice: wo.laborRate,
        total: Number((wo.laborHours * wo.laborRate).toFixed(2)),
      });
    }

    // 2. Oil service if present
    if (wo.oilRecord) {
      lineItems.push({
        id: `li-oil-${Date.now()}`,
        type: 'oil_service',
        description: `${wo.oilRecord.oilBrand} ${wo.oilRecord.oilViscosity} (${wo.oilRecord.volumeUsedLiters}L)`,
        quantity: wo.oilRecord.volumeUsedLiters,
        unitPrice: 12.9,
        total: Number((wo.oilRecord.volumeUsedLiters * 12.9).toFixed(2)),
      });
      lineItems.push({
        id: `li-flt-${Date.now()}`,
        type: 'parts',
        description: `OEM Spec Oil Filter #${wo.oilRecord.oilFilterPartNumber}`,
        quantity: 1,
        unitPrice: 18.5,
        total: 18.5,
      });
      lineItems.push({
        id: `li-env-${Date.now()}`,
        type: 'environmental_fee',
        description: 'Used Motor Oil & Filter EPA Environmental Recycling Disposal',
        quantity: 1,
        unitPrice: 6.5,
        total: 6.5,
      });
    }

    // 3. Approved DVI upsells
    wo.dviItems.forEach((item) => {
      if (item.customerApproved && item.estimatedCost > 0) {
        lineItems.push({
          id: `li-dvi-${item.id}`,
          type: 'parts',
          description: `Approved DVI Repair: ${item.title}`,
          quantity: 1,
          unitPrice: item.estimatedCost,
          total: item.estimatedCost,
        });
      }
    });

    // 4. Parts used
    wo.partsUsed.forEach((part) => {
      // Don't duplicate if already logged under oil
      if (!lineItems.some((li) => li.description.includes(part.name))) {
        lineItems.push({
          id: `li-pu-${part.id}`,
          type: 'parts',
          description: part.name,
          quantity: part.quantity,
          unitPrice: part.unitPrice,
          total: part.totalPrice,
        });
      }
    });

    const subtotal = lineItems.reduce((acc, curr) => acc + curr.total, 0);
    const taxAmount = Number(((subtotal * SHOP_INFO.defaultTaxRatePercent) / 100).toFixed(2));
    const totalAmount = Number((subtotal + taxAmount).toFixed(2));

    const invoiceNumber = `INV-2026-${(invoices.length + 840).toString().padStart(4, '0')}`;
    const newInvoice: Invoice = {
      id: invoiceNumber,
      invoiceNumber,
      workOrderId: wo.id,
      customerId: wo.customerId,
      vehicleId: wo.vehicleId,
      date: new Date().toISOString().split('T')[0],
      lineItems,
      subtotal: Number(subtotal.toFixed(2)),
      taxRatePercent: SHOP_INFO.defaultTaxRatePercent,
      taxAmount,
      discountAmount: 0,
      totalAmount,
      paymentMethod,
      paymentStatus: 'paid',
      paidAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    // Update customer spend & payment history
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === wo.customerId) {
          return {
            ...c,
            totalSpend: Number((c.totalSpend + totalAmount).toFixed(2)),
            paymentHistory: [
              {
                id: `pay-${Date.now()}`,
                invoiceId: invoiceNumber,
                date: newInvoice.date,
                amount: totalAmount,
                method: paymentMethod,
                status: 'completed',
              },
              ...c.paymentHistory,
            ],
          };
        }
        return c;
      })
    );

    // Update work order to completed/invoiced
    setWorkOrders((prev) =>
      prev.map((w) => {
        if (w.id === woId) {
          return {
            ...w,
            status: 'completed',
            completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            invoiceId: invoiceNumber,
          };
        }
        return w;
      })
    );

    return newInvoice;
  };

  const dispatchReminder = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === reminderId) {
          return {
            ...r,
            status: 'sent',
            sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
        }
        return r;
      })
    );
  };

  const updateTemplate = (id: string, body: string) => {
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, body };
        }
        return t;
      })
    );
  };

  const resetAllData = () => {
    localStorage.clear();
    setCustomers(INITIAL_CUSTOMERS);
    setVehicles(INITIAL_VEHICLES);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setInventory(INITIAL_INVENTORY);
    setInvoices(INITIAL_INVOICES);
    setReminders(INITIAL_REMINDERS);
    setTemplates(RETENTION_TEMPLATES);
    setUserRole('advisor');
  };

  return (
    <ShopContext.Provider
      value={{
        userRole,
        setUserRole,
        customers,
        vehicles,
        workOrders,
        inventory,
        invoices,
        reminders,
        templates,
        selectedWorkOrderId,
        setSelectedWorkOrderId,
        customerPortalWorkOrderId,
        setCustomerPortalWorkOrderId,
        stickerModalRecord,
        setStickerModalRecord,
        getCustomerById,
        getVehicleById,
        getCustomerVehicles,
        getVehicleCustomer,
        updateWorkOrderStatus,
        saveOilService,
        saveTireInspection,
        updateDVIItemStatus,
        customerToggleDVIItem,
        addWorkOrder,
        addCustomer,
        addVehicle,
        generateInvoiceForWorkOrder,
        dispatchReminder,
        updateTemplate,
        deductInventoryForOil,
        restockInventoryItem,
        resetAllData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
