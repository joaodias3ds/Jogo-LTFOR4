/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ConstructionProject, NPCEntity, RoomEntity, VehicleEntity } from '../types/game';
import { X, Sparkles, Wrench, UserCheck, HardHat, Truck, MapPin, Battery, Activity } from 'lucide-react';
import { soundEngine } from '../audio/synth';

interface InspectionDrawerProps {
  selectedRoom?: RoomEntity;
  selectedNpc?: NPCEntity;
  selectedVehicle?: VehicleEntity;
  selectedConstruction?: ConstructionProject;
  onClose: () => void;
  onCleanRoom?: (roomId: string) => void;
  onMaintainRoom?: (roomId: string) => void;
  onOrderDelivery?: (vehicleId: string) => void;
}

export const InspectionDrawer: React.FC<InspectionDrawerProps> = ({
  selectedRoom,
  selectedNpc,
  selectedVehicle,
  selectedConstruction,
  onClose,
  onCleanRoom,
  onMaintainRoom,
  onOrderDelivery
}) => {
  if (!selectedRoom && !selectedNpc && !selectedVehicle && !selectedConstruction) {
    return null;
  }

  return (
    <aside aria-label="Painel de Inspeção" className="fixed bottom-4 right-4 z-40 w-80 md:w-96 bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 text-slate-100 shadow-2xl pointer-events-auto font-sans select-none animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          {selectedRoom && <MapPin className="w-4 h-4 text-sky-400" />}
          {selectedNpc && <UserCheck className="w-4 h-4 text-emerald-400" />}
          {selectedVehicle && <Truck className="w-4 h-4 text-amber-400" />}
          {selectedConstruction && <HardHat className="w-4 h-4 text-orange-400" />}
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            {selectedRoom ? 'Inspeção de Sala' : selectedNpc ? 'Ficha de Colaborador' : selectedVehicle ? 'Frota de Veículo' : 'Canteiro de Obras'}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          title="Fechar inspeção"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 1. ROOM INSPECTION */}
      {selectedRoom && (
        <div className="space-y-3">
          <div>
            <div className="text-base font-bold text-white">{selectedRoom.name}</div>
            <div className="text-xs text-sky-400 font-medium">Lote: {selectedRoom.lotId.toUpperCase()}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400">Ocupação:</span>
              <div className="text-sm font-semibold font-mono text-slate-200">
                {selectedRoom.currentOccupancy} / {selectedRoom.capacity} pessoas
              </div>
            </div>

            <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400">Equipamentos:</span>
              <div className="text-sm font-semibold text-emerald-400">
                {selectedRoom.equipmentStatus === 'optimal' ? 'Operacional 100%' : 'Requer Reparo'}
              </div>
            </div>
          </div>

          {/* Cleanliness & Maintenance Bars */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Limpeza & Conservação</span>
              <span className="font-mono">{selectedRoom.cleanliness}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-400 h-full transition-all"
                style={{ width: `${selectedRoom.cleanliness}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Manutenção Predial</span>
              <span className="font-mono">{selectedRoom.maintenance}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all"
                style={{ width: `${selectedRoom.maintenance}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playSuccess();
                onCleanRoom?.(selectedRoom.id);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-sky-950/80 hover:bg-sky-900 border border-sky-700 text-sky-200 rounded text-xs font-semibold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chamar Limpeza</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playHammer();
                onMaintainRoom?.(selectedRoom.id);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-amber-950/80 hover:bg-amber-900 border border-amber-700 text-amber-200 rounded text-xs font-semibold cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Manutenção TI</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. NPC INSPECTION */}
      {selectedNpc && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{ backgroundColor: selectedNpc.avatarColor }}
            >
              {selectedNpc.name.charAt(0)}
            </div>
            <div>
              <div className="text-base font-bold text-white">{selectedNpc.name}</div>
              <div className="text-xs text-emerald-400 font-medium">Cargo: {selectedNpc.role.replace(/_/g, ' ').toUpperCase()}</div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700/60 text-xs">
            <div className="text-slate-400 mb-1 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>Atividade Atual:</span>
            </div>
            <div className="text-slate-200 font-medium">{selectedNpc.currentActivityDesc}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400">Energia:</span>
              <div className="text-sm font-semibold font-mono text-amber-400">{selectedNpc.energy}%</div>
            </div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400">Satisfação:</span>
              <div className="text-sm font-semibold font-mono text-emerald-400">{selectedNpc.satisfaction}%</div>
            </div>
          </div>

          {selectedNpc.salary > 0 && (
            <div className="flex justify-between items-center text-xs text-slate-300 px-1">
              <span>Custo Diário (Salário):</span>
              <span className="font-mono font-bold text-amber-400">R$ {selectedNpc.salary}/dia</span>
            </div>
          )}
        </div>
      )}

      {/* 3. VEHICLE INSPECTION */}
      {selectedVehicle && (
        <div className="space-y-3">
          <div>
            <div className="text-base font-bold text-white">{selectedVehicle.name}</div>
            <div className="text-xs text-amber-400 font-medium">Modelo: {selectedVehicle.model.toUpperCase()}</div>
          </div>

          <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700/60 text-xs">
            <div className="text-slate-400 mb-1">Missão Atual:</div>
            <div className="text-slate-200 font-medium">{selectedVehicle.destinationDesc}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400">Carga Atual:</span>
              <div className="text-sm font-semibold font-mono text-slate-200">
                {selectedVehicle.currentLoadKg} / {selectedVehicle.capacityKg} kg
              </div>
            </div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400 flex items-center gap-1">
                <Battery className="w-3 h-3 text-emerald-400" /> Bateria:
              </span>
              <div className="text-sm font-semibold font-mono text-emerald-400">{selectedVehicle.fuelOrBattery}%</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playSuccess();
              onOrderDelivery?.(selectedVehicle.id);
            }}
            className="w-full py-1.5 px-3 bg-amber-950/80 hover:bg-amber-900 border border-amber-700 text-amber-200 rounded text-xs font-semibold cursor-pointer"
          >
            Despachar Manifesto de Carga
          </button>
        </div>
      )}

      {/* 4. 7-DAY CONSTRUCTION SITE INSPECTION */}
      {selectedConstruction && (
        <div className="space-y-3">
          <div>
            <div className="text-base font-bold text-white">{selectedConstruction.name}</div>
            <div className="text-xs text-orange-400 font-medium">
              Obra de 7 Dias · Dia {selectedConstruction.currentDayOfProject} de 7
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Progresso do Pacote</span>
              <span className="font-mono font-bold text-sky-400">{selectedConstruction.progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-orange-500 h-full transition-all"
                style={{ width: `${selectedConstruction.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700/60 text-xs space-y-1">
            <div className="text-slate-400">Marco de Engenharia:</div>
            <div className="text-amber-300 font-bold">{selectedConstruction.currentMilestone}</div>
            <div className="text-[11px] text-slate-400 pt-1">
              {selectedConstruction.materialsDelivered ? '✓ Todos os materiais descarregados no canteiro' : 'Aguardando materiais'}
            </div>
          </div>

          <div className="flex justify-between text-xs text-slate-300 px-1">
            <span>Custo Total do Pacote:</span>
            <span className="font-mono font-bold text-slate-100">
              R$ {selectedConstruction.costTotal.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};
