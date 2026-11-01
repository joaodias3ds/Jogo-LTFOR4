/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LotId = 'education' | 'logistics' | 'retail' | 'offices';

export type ControlMode = 'character' | 'inspect' | 'manage' | 'build';

export type GameSpeed = 0 | 1 | 2 | 4;

export type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'dusk' | 'night';

export interface GameClock {
  gameSeconds: number; // 0 is 07:00 on Day 1 (Monday)
  speed: GameSpeed;
  isPaused: boolean;
  day: number; // 1 to ...
  dayOfWeek: string;
  hour: number;
  minute: number;
  timeOfDay: TimeOfDay;
}

export type RoomCategory =
  // Educação
  | 'classroom_small'
  | 'classroom_large'
  | 'computer_lab'
  | 'library'
  | 'secretary'
  | 'teachers_lounge'
  // Logística
  | 'loading_dock'
  | 'inspection_bay'
  | 'pallet_racks'
  | 'packing_station'
  | 'dispatch_zone'
  | 'dispatch_office'
  // Comércio
  | 'shop_floor'
  | 'checkout_area'
  | 'retail_stock'
  | 'customer_service'
  | 'showcase_window'
  // Escritórios
  | 'coworking_open'
  | 'meeting_room'
  | 'it_tech_support'
  | 'private_office'
  | 'hardware_workshop'
  // Comum
  | 'restroom'
  | 'breakroom_cafe'
  | 'reception'
  | 'admin_office';

export interface RoomEntity {
  id: string;
  lotId: LotId;
  name: string;
  category: RoomCategory;
  gridX: number;
  gridY: number;
  width: number;
  height: number;
  capacity: number;
  currentOccupancy: number;
  cleanliness: number; // 0 to 100
  maintenance: number; // 0 to 100
  equipmentStatus: 'optimal' | 'needs_maintenance' | 'broken';
  assignedNpcIds: string[];
}

export type ConstructionMilestone =
  | 'isolation_prep'     // Dia 1: Isolamento, descarga e canteiro
  | 'base_structure'     // Dia 2: Fundação e base
  | 'walls_framing'      // Dia 3: Paredes e divisórias
  | 'electrical_network' // Dia 4: Energia e rede
  | 'flooring_finishing' // Dia 5: Piso e pintura
  | 'furniture_install'  // Dia 6: Móveis e equipamentos fixos
  | 'inspection_handover'; // Dia 7: Vistoria, testes e entrega

export interface ConstructionProject {
  id: string;
  name: string;
  lotId: LotId;
  targetRoomCategory: RoomCategory;
  targetGridX: number;
  targetGridY: number;
  targetWidth: number;
  targetHeight: number;
  costTotal: number;
  paidAmount: number;
  startDay: number;
  plannedDurationDays: number; // exactly 7 days by doc
  currentDayOfProject: number; // 1 to 7
  currentMilestone: ConstructionMilestone;
  progressPercent: number; // 0 to 100
  status: 'planned' | 'in_progress' | 'suspended' | 'inspection' | 'completed';
  blockedReason: string | null;
  assignedWorkers: string[];
  materialsDelivered: boolean;
}

export type NPCRole =
  | 'administrator'
  | 'education_director'
  | 'teacher'
  | 'instructor'
  | 'student'
  | 'secretary'
  | 'logistics_supervisor'
  | 'warehouse_receiver'
  | 'warehouse_picker'
  | 'forklift_driver'
  | 'van_driver'
  | 'retail_manager'
  | 'cashier'
  | 'sales_clerk'
  | 'customer'
  | 'office_manager'
  | 'tech_specialist'
  | 'developer'
  | 'designer'
  | 'construction_foreman'
  | 'construction_worker'
  | 'cleaning_staff';

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  npcId: string;
  npcName: string;
  lotId: LotId;
  projectTag: string;
  actionText: string;
  iconType: 'code' | 'box' | 'cart' | 'clean' | 'wrench' | 'check' | 'alert' | 'book';
}

export interface NPCEntity {
  id: string;
  name: string;
  role: NPCRole;
  lotId: LotId | 'common';
  projectTag?: string;
  x: number; // world tile coordinates
  y: number;
  targetX?: number;
  targetY?: number;
  direction: 'north' | 'south' | 'east' | 'west';
  state: 'idle' | 'walking' | 'working' | 'carrying' | 'meeting' | 'break' | 'cleaning' | 'hammering';
  carriedItem?: string;
  speechBubble?: {
    text: string;
    icon: string;
    type?: 'work' | 'alert' | 'success' | 'wait';
  };
  energy: number; // 0 to 100
  satisfaction: number; // 0 to 100
  salary: number; // per game day
  assignedRoomId?: string;
  currentActivityDesc: string;
  avatarColor: string;
  hairColor: string;
  shirtColor: string;
  pantsColor?: string;
  hasWheelchair?: boolean;
  hasGlasses?: boolean;
  hasHardhat?: boolean;
  hasHeadphones?: boolean;
  sheetImage?: string;
}

export type VehicleModel =
  | 'van_delivery'
  | 'truck_medium'
  | 'forklift'
  | 'school_bus'
  | 'motorcycle';

export interface VehicleEntity {
  id: string;
  model: VehicleModel;
  name: string;
  lotId: LotId;
  x: number;
  y: number;
  direction: 'north' | 'south' | 'east' | 'west';
  capacityKg: number;
  currentLoadKg: number;
  driverId?: string;
  status: 'parked' | 'loading' | 'in_route' | 'maintenance';
  destinationDesc: string;
  fuelOrBattery: number; // 0 to 100
}

export interface InventoryItem {
  id: string;
  lotId: LotId;
  sku: string;
  name: string;
  category: 'books_school' | 'electronics' | 'office_supplies' | 'logistics_crates';
  quantityPhysical: number;
  quantityReserved: number;
  unitCost: number;
  sellingPrice: number;
  locationRoomId: string;
}

export interface InterCompanySolicitation {
  id: string;
  fromLot: LotId;
  toLot: LotId;
  title: string;
  description: string;
  value: number;
  status: 'pending' | 'in_progress' | 'delivered' | 'completed';
  createdAtGameSecond: number;
  completionPercent: number;
}

export interface MeetingProposal {
  id: string;
  title: string;
  description: string;
  cost: number;
  expectedBenefit: string;
  actionType: 'hire_staff' | 'expand_room' | 'buy_vehicle' | 'launch_promo' | 'upgrade_tools';
  payload: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected';
}

export interface MeetingSession {
  id: string;
  managerId: string;
  managerName: string;
  managerRole: string;
  lotId: LotId;
  status: 'scheduled' | 'manager_walking' | 'in_session' | 'adjourned';
  meetingRoomId: string;
  agendaTopic: string;
  periodSummary: {
    revenue: number;
    expenses: number;
    satisfaction: number;
    pendingIssues: number;
    notes: string;
  };
  proposals: MeetingProposal[];
}

export interface IncidentAlert {
  id: string;
  lotId: LotId | 'common';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: number;
  resolved: boolean;
  actionLabel?: string;
  onAction?: string;
}

export interface FinancialTransaction {
  id: string;
  timestamp: number;
  lotId: LotId | 'group';
  category: 'tuition' | 'retail_sale' | 'freight' | 'project_contract' | 'payroll' | 'construction' | 'maintenance' | 'inter_company';
  description: string;
  amount: number; // positive = revenue, negative = expense
}

export interface BusinessLotSummary {
  lotId: LotId;
  name: string;
  specialty: string;
  cash: number;
  dailyRevenue: number;
  dailyExpenses: number;
  reputation: number; // 0 to 100
  employeeCount: number;
  activeContracts: number;
}
