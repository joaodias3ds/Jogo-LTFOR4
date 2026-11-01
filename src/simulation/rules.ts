/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConstructionMilestone, ConstructionProject, FinancialTransaction, InventoryItem, MeetingProposal, TimeOfDay } from '../types/game';

export const SECONDS_PER_GAME_HOUR = 3600;
export const SECONDS_PER_GAME_DAY = 86400;
export const BASE_START_SECOND = 7 * SECONDS_PER_GAME_HOUR; // 07:00 AM on Day 1

export const DAYS_OF_WEEK = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo'
];

export const CONSTRUCTION_MILESTONES: ConstructionMilestone[] = [
  'isolation_prep',
  'base_structure',
  'walls_framing',
  'electrical_network',
  'flooring_finishing',
  'furniture_install',
  'inspection_handover'
];

export const MILESTONE_NAMES: Record<ConstructionMilestone, string> = {
  isolation_prep: 'Dia 1: Isolamento, descarga e canteiro',
  base_structure: 'Dia 2: Base, fundação e estrutura',
  walls_framing: 'Dia 3: Paredes e divisórias',
  electrical_network: 'Dia 4: Energia, rede e cabeamento',
  flooring_finishing: 'Dia 5: Piso, pintura e acabamento',
  furniture_install: 'Dia 6: Portas, móveis e equipamentos fixos',
  inspection_handover: 'Dia 7: Testes, vistoria e entrega'
};

/**
 * Converts cumulative game seconds into calendar hour, minute, day, day of week, and time of day.
 */
export function calculateGameTime(totalSeconds: number): {
  day: number;
  dayOfWeek: string;
  hour: number;
  minute: number;
  second: number;
  timeOfDay: TimeOfDay;
} {
  const currentTotal = Math.max(0, BASE_START_SECOND + totalSeconds);
  const day = Math.floor(currentTotal / SECONDS_PER_GAME_DAY) + 1;
  const dayIndex = (day - 1) % 7;
  const dayOfWeek = DAYS_OF_WEEK[dayIndex];

  const secondsInDay = currentTotal % SECONDS_PER_GAME_DAY;
  const hour = Math.floor(secondsInDay / SECONDS_PER_GAME_HOUR);
  const minute = Math.floor((secondsInDay % SECONDS_PER_GAME_HOUR) / 60);
  const second = Math.floor(secondsInDay % 60);

  let timeOfDay: TimeOfDay = 'morning';
  if (hour >= 5 && hour < 7) {
    timeOfDay = 'dawn';
  } else if (hour >= 7 && hour < 12) {
    timeOfDay = 'morning';
  } else if (hour >= 12 && hour < 18) {
    timeOfDay = 'afternoon';
  } else if (hour >= 18 && hour < 21) {
    timeOfDay = 'dusk';
  } else {
    timeOfDay = 'night';
  }

  return { day, dayOfWeek, hour, minute, second, timeOfDay };
}

/**
 * Calculates current construction milestone, progress percentage, and whether it's completed.
 * By master doc, standard construction takes exactly 7 planned calendar days.
 */
export function updateConstructionProgress(
  project: ConstructionProject,
  currentDay: number
): {
  currentDayOfProject: number;
  milestone: ConstructionMilestone;
  progressPercent: number;
  isCompleted: boolean;
} {
  if (project.status === 'completed') {
    return {
      currentDayOfProject: 7,
      milestone: 'inspection_handover',
      progressPercent: 100,
      isCompleted: true
    };
  }

  if (project.status === 'suspended' || project.blockedReason) {
    return {
      currentDayOfProject: project.currentDayOfProject,
      milestone: project.currentMilestone,
      progressPercent: project.progressPercent,
      isCompleted: false
    };
  }

  // Days elapsed since start
  const daysElapsed = Math.max(1, currentDay - project.startDay + 1);
  const boundedDay = Math.min(7, daysElapsed);
  const milestoneIndex = Math.min(6, boundedDay - 1);
  const milestone = CONSTRUCTION_MILESTONES[milestoneIndex];
  const progressPercent = Math.min(100, Math.round((boundedDay / 7) * 100));
  const isCompleted = daysElapsed >= 7 && project.materialsDelivered;

  return {
    currentDayOfProject: boundedDay,
    milestone,
    progressPercent,
    isCompleted
  };
}

/**
 * Stock inventory rules:
 * Physical items minus active reservations minus quarantined items.
 * Never allows negative stock.
 */
export function getAvailableStock(physical: number, reserved: number, quarantine: number = 0): number {
  return Math.max(0, physical - reserved - quarantine);
}

export function reserveInventory(
  item: InventoryItem,
  amount: number
): { success: boolean; updatedItem: InventoryItem } {
  const available = getAvailableStock(item.quantityPhysical, item.quantityReserved);
  if (amount <= 0 || available < amount) {
    return { success: false, updatedItem: item };
  }
  return {
    success: true,
    updatedItem: {
      ...item,
      quantityReserved: item.quantityReserved + amount
    }
  };
}

export function releaseInventoryReservation(
  item: InventoryItem,
  amount: number
): InventoryItem {
  const newReserved = Math.max(0, item.quantityReserved - amount);
  return {
    ...item,
    quantityReserved: newReserved
  };
}

/**
 * Financial Ledger rules:
 * Double-entry inter-company transactions:
 * When Business A pays Business B, A has an expense and B has equal revenue.
 * Consolidated group balance change is exactly 0.
 */
export function createInterCompanyTransactions(
  fromLot: 'education' | 'logistics' | 'retail' | 'offices',
  toLot: 'education' | 'logistics' | 'retail' | 'offices',
  amount: number,
  description: string,
  timestamp: number
): [FinancialTransaction, FinancialTransaction] {
  const expenseEntry: FinancialTransaction = {
    id: `tx_exp_${timestamp}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp,
    lotId: fromLot,
    category: 'inter_company',
    description: `[Pago a ${toLot}] ${description}`,
    amount: -Math.abs(amount)
  };

  const revenueEntry: FinancialTransaction = {
    id: `tx_rev_${timestamp}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp,
    lotId: toLot,
    category: 'inter_company',
    description: `[Recebido de ${fromLot}] ${description}`,
    amount: Math.abs(amount)
  };

  return [expenseEntry, revenueEntry];
}

/**
 * Computes consolidated cash and per-lot balances from transaction history.
 */
export function calculateBalancesFromTransactions(
  initialCash: number,
  transactions: FinancialTransaction[]
): {
  consolidatedCash: number;
  byLot: Record<string, number>;
  totalRevenue: number;
  totalExpenses: number;
} {
  let consolidatedCash = initialCash;
  let totalRevenue = 0;
  let totalExpenses = 0;

  const byLot: Record<string, number> = {
    education: 0,
    logistics: 0,
    retail: 0,
    offices: 0,
    group: initialCash
  };

  for (const tx of transactions) {
    consolidatedCash += tx.amount;
    byLot[tx.lotId] = (byLot[tx.lotId] || 0) + tx.amount;

    if (tx.amount > 0) {
      totalRevenue += tx.amount;
    } else {
      totalExpenses += Math.abs(tx.amount);
    }
  }

  return { consolidatedCash, byLot, totalRevenue, totalExpenses };
}

/**
 * Validates and approves a meeting proposal atomically.
 */
export function validateAndApplyMeetingProposal(
  proposal: MeetingProposal,
  currentCash: number,
  currentTime: number
): {
  success: boolean;
  newCash: number;
  transaction?: FinancialTransaction;
  errorMessage?: string;
} {
  if (proposal.status !== 'pending') {
    return { success: false, newCash: currentCash, errorMessage: 'Proposta já processada.' };
  }

  if (proposal.cost > currentCash) {
    return {
      success: false,
      newCash: currentCash,
      errorMessage: `Saldo insuficiente (Necessário: R$ ${proposal.cost}, Disponível: R$ ${currentCash})`
    };
  }

  const transaction: FinancialTransaction = {
    id: `tx_prop_${currentTime}_${proposal.id}`,
    timestamp: currentTime,
    lotId: 'group',
    category: 'project_contract',
    description: `Aprovação de Reunião: ${proposal.title}`,
    amount: -proposal.cost
  };

  return {
    success: true,
    newCash: currentCash - proposal.cost,
    transaction
  };
}
