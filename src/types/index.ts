export type UserRole = 'owner' | 'advisor' | 'technician' | 'inventory' | 'customer';

export type ContactChannel = 'whatsapp' | 'sms' | 'email';

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  date: string;
  amount: number;
  method: 'cash' | 'card' | 'digital_wallet' | 'bank_transfer';
  status: 'completed' | 'refunded';
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  preferredChannel: ContactChannel;
  address: string;
  totalSpend: number;
  paymentHistory: PaymentRecord[];
  createdAt: string;
}

export interface MileageLogEntry {
  id: string;
  date: string;
  odometer: number;
  unit: 'km' | 'miles';
  serviceType: string;
  notes?: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  engineCode: string;
  displacement: string;
  color: string;
  currentOdometer: number;
  odometerUnit: 'km' | 'miles';
  mileageHistory: MileageLogEntry[];
  createdAt: string;
}

export type OilViscosity = '0W-20' | '5W-20' | '5W-30' | '5W-40' | '10W-40' | '15W-40';
export type OilCategory = 'Full Synthetic' | 'Semi-Synthetic' | 'Conventional' | 'High Mileage';
export type FluidCondition = 'ok' | 'dirty' | 'low' | 'replaced' | 'na';
export type FilterCondition = 'clean' | 'dusty' | 'clogged' | 'replaced' | 'na';

export interface OilServiceRecord {
  id: string;
  workOrderId?: string;
  vehicleId: string;
  customerId: string;
  serviceDate: string;
  currentOdometer: number;
  odometerUnit: 'km' | 'miles';
  oilBrand: string;
  oilViscosity: OilViscosity;
  oilCategory: OilCategory;
  volumeUsedLiters: number;
  oilFilterPartNumber: string;
  totalCostIQD?: number;
  costNotes?: string;
  auxiliaryFluids: {
    brakeFluid: FluidCondition;
    transmissionFluid: FluidCondition;
    coolant: FluidCondition;
    powerSteering: FluidCondition;
  };
  auxiliaryFilters: {
    airFilter: FilterCondition;
    cabinFilter: FilterCondition;
  };
  serviceIntervalKm: number;
  serviceIntervalMonths: number;
  nextServiceOdometer: number;
  nextServiceDate: string;
  technicianName: string;
  stickerPrinted: boolean;
  notes?: string;
}

export type TirePosition = 'front_left' | 'front_right' | 'rear_left' | 'rear_right' | 'spare';
export type TireWearPattern = 'even' | 'feathering' | 'camber_wear' | 'toe_wear' | 'center_overinflation' | 'shoulder_underinflation';
export type TireRecommendedAction = 'rotation' | 'balancing' | 'wheel_alignment' | 'replacement' | 'puncture_repair';

export interface TireMeasurement {
  position: TirePosition;
  label: string;
  innerMm: number;
  centerMm: number;
  outerMm: number;
  targetPsi: number;
  actualPsiBefore: number;
  actualPsiAfter: number;
  wearPattern: TireWearPattern;
  healthStatus: 'green' | 'yellow' | 'red';
  brandModel?: string;
  dotCode?: string;
}

export interface TireInspectionRecord {
  id: string;
  workOrderId?: string;
  vehicleId: string;
  inspectionDate: string;
  tires: Record<TirePosition, TireMeasurement>;
  recommendedActions: TireRecommendedAction[];
  technicianNotes?: string;
}

export type DVIStatus = 'green' | 'yellow' | 'red';

export interface DVIItem {
  id: string;
  category: 'Fluids & Leaks' | 'Braking System' | 'Tires & Wheels' | 'Suspension & Steering' | 'Under Hood & Battery' | 'Safety & Lighting';
  title: string;
  description: string;
  status: DVIStatus;
  technicianNotes: string;
  photoUrl?: string;
  estimatedCost: number;
  customerApproved: boolean | null; // null = pending decision
}

export type WorkOrderStatus =
  | 'intake'
  | 'inspection'
  | 'pending_approval'
  | 'in_progress'
  | 'waiting_parts'
  | 'ready_pickup'
  | 'completed';

export type WorkOrderPriority = 'routine' | 'urgent' | 'fleet';

export interface JobPartUsage {
  id: string;
  inventoryItemId: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  vehicleId: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  intakeDate: string;
  promisedDate: string;
  assignedTechnician: string;
  requestedServices: string[];
  customerConcerns?: string;
  dviItems: DVIItem[];
  oilRecord?: OilServiceRecord;
  tireRecord?: TireInspectionRecord;
  partsUsed: JobPartUsage[];
  laborHours: number;
  laborRate: number;
  notes?: string;
  estimateApprovedAt?: string;
  completedAt?: string;
  invoiceId?: string;
}

export type InventoryCategory = 'bulk_oil' | 'tire' | 'filter' | 'fluid' | 'brake_part' | 'general';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: InventoryCategory;
  brand: string;
  unit: string;
  stockQuantity: number;
  minThreshold: number;
  costPrice: number;
  retailPrice: number;
  location: string;
  // Bulk oil drum specific
  drumCapacityLiters?: number;
  drumCurrentLiters?: number;
  viscosity?: OilViscosity;
  // Tire specific
  tireSpecs?: {
    width: number;
    aspectRatio: number;
    rimSize: number;
    speedRating: string;
    season: 'summer' | 'all_season' | 'winter';
  };
  // Filter cross reference
  crossReferences?: string[];
}

export interface InvoiceLineItem {
  id: string;
  type: 'parts' | 'labor' | 'oil_service' | 'tire_service' | 'environmental_fee';
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  workOrderId: string;
  customerId: string;
  vehicleId: string;
  date: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRatePercent: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'digital_wallet' | 'bank_transfer';
  paymentStatus: 'paid' | 'pending' | 'partially_paid';
  paidAt?: string;
}

export type ReminderType = 'upcoming_oil_service' | 'overdue_oil_service' | 'tire_rotation_due' | 'seasonal_maintenance';

export interface RetentionReminder {
  id: string;
  customerId: string;
  vehicleId: string;
  type: ReminderType;
  dueDate: string;
  dueMileage?: number;
  daysDiff: number; // positive = days until due, negative = days overdue
  channel: ContactChannel;
  status: 'scheduled' | 'sent' | 'dismissed';
  sentAt?: string;
  renderedMessage: string;
}

export interface ReminderTemplate {
  id: string;
  name: string;
  type: ReminderType;
  channel: ContactChannel;
  body: string;
}
