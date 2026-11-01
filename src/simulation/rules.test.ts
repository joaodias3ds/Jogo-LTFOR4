/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGameTime,
  updateConstructionProgress,
  getAvailableStock,
  reserveInventory,
  releaseInventoryReservation,
  createInterCompanyTransactions,
  calculateBalancesFromTransactions,
  validateAndApplyMeetingProposal
} from './rules';
import { ConstructionProject, InventoryItem, MeetingProposal } from '../types/game';

test('calculateGameTime converts seconds into calendar and shift hours accurately', () => {
  // Day 1 at 07:00
  const t0 = calculateGameTime(0);
  assert.equal(t0.day, 1);
  assert.equal(t0.dayOfWeek, 'Segunda-feira');
  assert.equal(t0.hour, 7);
  assert.equal(t0.minute, 0);
  assert.equal(t0.timeOfDay, 'morning');

  // After 5 hours (18,000 game seconds) -> 12:00 (afternoon)
  const t1 = calculateGameTime(18000);
  assert.equal(t1.day, 1);
  assert.equal(t1.hour, 12);
  assert.equal(t1.timeOfDay, 'afternoon');

  // Day 2 (after 24h = 86400 game seconds)
  const t2 = calculateGameTime(86400);
  assert.equal(t2.day, 2);
  assert.equal(t2.dayOfWeek, 'Terça-feira');
  assert.equal(t2.hour, 7);
});

test('7-Day Construction Project follows exact daily milestones without instant finishing', () => {
  const project: ConstructionProject = {
    id: 'bld_edu_lab',
    name: 'Expansão Lab Informática',
    lotId: 'education',
    targetRoomCategory: 'computer_lab',
    targetGridX: 10,
    targetGridY: 10,
    targetWidth: 6,
    targetHeight: 5,
    costTotal: 15000,
    paidAmount: 5000,
    startDay: 1,
    plannedDurationDays: 7,
    currentDayOfProject: 1,
    currentMilestone: 'isolation_prep',
    progressPercent: 14,
    status: 'in_progress',
    blockedReason: null,
    assignedWorkers: ['worker_1', 'worker_2'],
    materialsDelivered: true
  };

  // Day 1
  const day1 = updateConstructionProgress(project, 1);
  assert.equal(day1.currentDayOfProject, 1);
  assert.equal(day1.milestone, 'isolation_prep');
  assert.equal(day1.isCompleted, false);

  // Day 4 (electrical network)
  const day4 = updateConstructionProgress(project, 4);
  assert.equal(day4.currentDayOfProject, 4);
  assert.equal(day4.milestone, 'electrical_network');
  assert.equal(day4.isCompleted, false);

  // Day 7 (inspection and delivery)
  const day7 = updateConstructionProgress(project, 7);
  assert.equal(day7.currentDayOfProject, 7);
  assert.equal(day7.milestone, 'inspection_handover');
  assert.equal(day7.progressPercent, 100);
  assert.equal(day7.isCompleted, true);
});

test('Construction suspension stops milestones from advancing prematurely', () => {
  const suspendedProject: ConstructionProject = {
    id: 'bld_blocked',
    name: 'Nova Doca',
    lotId: 'logistics',
    targetRoomCategory: 'loading_dock',
    targetGridX: 20,
    targetGridY: 20,
    targetWidth: 8,
    targetHeight: 6,
    costTotal: 25000,
    paidAmount: 7500,
    startDay: 1,
    plannedDurationDays: 7,
    currentDayOfProject: 2,
    currentMilestone: 'base_structure',
    progressPercent: 28,
    status: 'suspended',
    blockedReason: 'Falta de cimento e ferro',
    assignedWorkers: [],
    materialsDelivered: false
  };

  const progress = updateConstructionProgress(suspendedProject, 5);
  assert.equal(progress.currentDayOfProject, 2);
  assert.equal(progress.milestone, 'base_structure');
  assert.equal(progress.isCompleted, false);
});

test('Inventory reservation prevents overselling and protects physical quantities', () => {
  const item: InventoryItem = {
    id: 'sku_book_01',
    lotId: 'retail',
    sku: 'BK-001',
    name: 'Apostila Didática Ensino Fundamental',
    category: 'books_school',
    quantityPhysical: 50,
    quantityReserved: 10,
    unitCost: 15,
    sellingPrice: 35,
    locationRoomId: 'room_retail_stock'
  };

  assert.equal(getAvailableStock(item.quantityPhysical, item.quantityReserved), 40);

  // Valid reservation of 25
  const res1 = reserveInventory(item, 25);
  assert.equal(res1.success, true);
  assert.equal(res1.updatedItem.quantityReserved, 35);
  assert.equal(getAvailableStock(res1.updatedItem.quantityPhysical, res1.updatedItem.quantityReserved), 15);

  // Reject reservation exceeding available (trying to reserve 20 when only 15 available)
  const res2 = reserveInventory(res1.updatedItem, 20);
  assert.equal(res2.success, false);

  // Release reservation
  const released = releaseInventoryReservation(res1.updatedItem, 10);
  assert.equal(released.quantityReserved, 25);
});

test('Inter-company transactions balance out to zero in group consolidated statement', () => {
  const [expense, revenue] = createInterCompanyTransactions(
    'retail',
    'logistics',
    450,
    'Frete de entrega de mercadorias para clientes',
    1000
  );

  assert.equal(expense.lotId, 'retail');
  assert.equal(expense.amount, -450);

  assert.equal(revenue.lotId, 'logistics');
  assert.equal(revenue.amount, 450);

  const netBalance = calculateBalancesFromTransactions(200000, [expense, revenue]);
  assert.equal(netBalance.consolidatedCash, 200000); // 0 change in total group cash
  assert.equal(netBalance.byLot['retail'], -450);
  assert.equal(netBalance.byLot['logistics'], 450);
});

test('Meeting proposal approval atomically validates cash and registers transaction', () => {
  const proposal: MeetingProposal = {
    id: 'prop_01',
    title: 'Contratar 1 Professor Substituto de Redação',
    description: 'Reduz filas de atendimento e reforça turmas do vespertino.',
    cost: 3200,
    expectedBenefit: '+15% de satisfação dos alunos',
    actionType: 'hire_staff',
    payload: { role: 'teacher' },
    status: 'pending'
  };

  // When player has enough cash
  const outcome1 = validateAndApplyMeetingProposal(proposal, 50000, 1200);
  assert.equal(outcome1.success, true);
  assert.equal(outcome1.newCash, 46800);
  assert.ok(outcome1.transaction);
  assert.equal(outcome1.transaction?.amount, -3200);

  // When player has insufficient funds
  const outcome2 = validateAndApplyMeetingProposal(proposal, 1000, 1200);
  assert.equal(outcome2.success, false);
  assert.match(outcome2.errorMessage || '', /Saldo insuficiente/);
});
