export type UserRole = 
  | 'Chief Hydrologist'
  | 'Superintendent Engineer'
  | 'Canal Gate Controller'
  | 'CWC/KGBO Liaison'
  | 'System Administrator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  commandArea: string;
  phone: string;
  status: 'Active' | 'Pending' | 'Suspended';
  createdAt: string;
  lastLogin?: string;
  avatarUrl?: string;
}

export interface Reservoir {
  id: string;
  name: string;
  basin: 'Krishna' | 'Godavari' | 'Pennar-Interlink';
  fullReservoirLevelFt: number;
  currentLevelFt: number;
  grossStorageTMC: number;
  currentStorageTMC: number;
  liveCapacityPercentage: number;
  inflowCusecs: number;
  outflowCusecs: number;
  floodGateStatus: 'Normal' | 'Alert' | 'Spillway Open' | 'Critical';
  gatesOpen: number;
  totalGates: number;
  lastUpdated: string;
  district: string;
  trend: 'rising' | 'falling' | 'steady';
}

export interface CanalNetwork {
  id: string;
  name: string;
  basin: 'Krishna' | 'Godavari';
  reservoirSource: string;
  designDischargeCusecs: number;
  currentDischargeCusecs: number;
  tailEndDeliveryPercentage: number; // Tail-end water equity
  lengthKm: number;
  commandAcres: number;
  primaryCrops: string[];
  status: 'Flowing' | 'Restricted' | 'Maintenance' | 'Surplus';
  priorityLevel: 'High' | 'Medium' | 'Critical';
}

export interface InflowForecastPoint {
  date: string;
  timestamp: number;
  predictedInflowCusecs: number;
  lowerConfidenceCusecs: number;
  upperConfidenceCusecs: number;
  classicalBaselineCusecs: number;
  quantumOptimizedReleaseCusecs: number;
  reservoirStorageTMC: number;
}

export interface OptimizationRun {
  id: string;
  runTimestamp: string;
  algorithm: 'Quantum QAOA + QUBO' | 'Quantum-Inspired Simulated Annealing' | 'Classical Heuristic Baseline';
  monsoonScenario: 'Deficit (Drought)' | 'Normal Inflow' | 'Excess (Flood Mitigation)';
  totalAllocatedTMC: number;
  equityGiniIndex: number; // 0 = perfect equity, 1 = maximum inequality
  waterSavingsTMC: number;
  cropStressMitigationPct: number;
  iterations: number;
  quboConvergenceEnergy: number[];
  allocations: {
    canalId: string;
    canalName: string;
    demandedCusecs: number;
    allocatedCusecs: number;
    equityFulfillmentPct: number;
    recommendedGateHours: number;
  }[];
  notes: string;
}

export interface SluiceGateOrder {
  id: string;
  orderNumber: string;
  reservoirId: string;
  reservoirName: string;
  canalId: string;
  targetDischargeCusecs: number;
  scheduledTime: string;
  authorizedBy: string;
  status: 'Pending' | 'Dispatched' | 'Executed' | 'Cancelled';
  executionNotes?: string;
}

export interface TelemetryAlert {
  id: string;
  type: 'Warning' | 'Info' | 'Critical';
  title: string;
  description: string;
  timestamp: string;
  basin: 'Krishna' | 'Godavari' | 'System';
  acknowledged: boolean;
}
