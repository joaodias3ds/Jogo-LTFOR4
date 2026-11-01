/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NPCEntity } from '../types/game';
import { X, Battery, Smile, DollarSign, Briefcase, Activity, CheckCircle } from 'lucide-react';
import { soundEngine } from '../audio/synth';

interface CharacterModalProps {
  npc: NPCEntity;
  onClose: () => void;
  onReassign?: (npcId: string, newActivity: string) => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  npc,
  onClose,
  onReassign
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 font-sans select-none backdrop-blur-none animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-3.5 px-5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Ficha Técnica do Colaborador
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Reference Sheet Image Showcase if available */}
          {npc.sheetImage ? (
            <div className="relative rounded-xl overflow-hidden border border-amber-900/40 bg-amber-50/5 p-2 shadow-inner">
              <img
                src={npc.sheetImage}
                alt={npc.name}
                className="w-full h-auto max-h-72 object-contain mx-auto rounded-lg"
              />
            </div>
          ) : (
            /* Parchment Style Banner Fallback */
            <div className="text-center p-4 rounded-xl border-2 border-amber-800/80 bg-[#fbf5e6] text-[#451a03] shadow-md space-y-1">
              <div className="text-2xl font-black uppercase tracking-widest font-serif">{npc.name}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#78350f]">
                {npc.role.replace(/_/g, ' ')}
              </div>
              <div className="text-[11px] font-semibold tracking-widest text-[#92400e] uppercase">
                Lote de {npc.lotId.toUpperCase()}
              </div>
            </div>
          )}

          {/* Operational Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-semibold">
                <Battery className="w-3 h-3 text-amber-400" /> Energia
              </div>
              <div className="text-base font-bold font-mono text-amber-400 mt-0.5">{npc.energy}%</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-semibold">
                <Smile className="w-3 h-3 text-emerald-400" /> Satisfação
              </div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">{npc.satisfaction}%</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-semibold">
                <DollarSign className="w-3 h-3 text-emerald-400" /> Salário
              </div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                R$ {npc.salary > 0 ? `${npc.salary}/dia` : 'Bolsista'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-semibold">
                <Activity className="w-3 h-3 text-sky-400" /> Status
              </div>
              <div className="text-sm font-bold text-sky-400 mt-0.5 capitalize">{npc.state}</div>
            </div>
          </div>

          {/* Activity Description */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-1">
            <div className="text-slate-400 font-semibold uppercase text-[10px]">Atividade em Andamento:</div>
            <div className="text-slate-100 font-medium leading-relaxed">{npc.currentActivityDesc}</div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                soundEngine.playSuccess();
                onReassign?.(npc.id, 'Prioridade Alta: Atendimento e Suporte');
              }}
              className="py-2.5 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold cursor-pointer transition-colors text-center"
            >
              Definir Prioridade Máxima
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 cursor-pointer transition-colors text-center"
            >
              Concluir Inspeção
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
