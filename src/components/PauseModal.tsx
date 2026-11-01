/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, Save, Download, Volume2, VolumeX, LogOut } from 'lucide-react';
import { soundEngine } from '../audio/synth';

interface PauseModalProps {
  day: number;
  totalCash: number;
  employeeCount: number;
  averageSatisfaction: number;
  isMuted: boolean;
  onResume: () => void;
  onSave: () => void;
  onLoad: () => void;
  onToggleMute: () => void;
  onExitToTitle: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  day,
  totalCash,
  employeeCount,
  averageSatisfaction,
  isMuted,
  onResume,
  onSave,
  onLoad,
  onToggleMute,
  onExitToTitle
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 font-sans select-none backdrop-blur-none animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 text-slate-100 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Jogo Pausado</h2>
          <p className="text-xs text-sky-400 font-mono">Quatro Lotes — Centro Empresarial</p>
        </div>

        {/* Live Mastery Metrics */}
        <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Caixa Total</span>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
              R$ {Math.round(totalCash).toLocaleString('pt-BR')}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Calendário</span>
            <div className="text-sm font-bold text-sky-400 font-mono mt-0.5">Dia {day}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Equipe</span>
            <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">{employeeCount} NPCs</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            data-start="true"
            onClick={() => {
              soundEngine.playSuccess();
              onResume();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl cursor-pointer shadow-lg shadow-sky-500/20 active:scale-98 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Retomar Gestão (Esc ou P)</span>
          </button>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onSave();
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-sky-400" />
              <span>Salvar Progresso</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onLoad();
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Carregar Save</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onToggleMute();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg cursor-pointer transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? 'Áudio Mudo (Clique para Ativar)' : 'Áudio Ativado (M)'}</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-center">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onExitToTitle();
            }}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Voltar ao Menu Principal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
