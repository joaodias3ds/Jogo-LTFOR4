/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameClock, GameSpeed, IncidentAlert, LotId } from '../types/game';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  FastForward,
  Clock,
  Coins,
  Building2,
  Bell,
  Layers,
  LayoutGrid,
  Users,
  HardHat,
  MessageSquare,
  Maximize2
} from 'lucide-react';
import { soundEngine } from '../audio/synth';

interface TopHUDProps {
  clock: GameClock;
  cashByLot: Record<string, number>;
  totalCash: number;
  alerts: IncidentAlert[];
  isMuted: boolean;
  agentCount: number;
  onSetSpeed: (speed: GameSpeed) => void;
  onToggleMute: () => void;
  onOpenManagement: (tab: 'overview' | 'construction' | 'meetings' | 'solicitations' | 'finances') => void;
  onOpenRoomCards: () => void;
  onFocusLot: (lotId: LotId) => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  clock,
  cashByLot,
  totalCash,
  alerts,
  isMuted,
  agentCount,
  onSetSpeed,
  onToggleMute,
  onOpenManagement,
  onOpenRoomCards,
  onFocusLot
}) => {
  const unresolvedAlerts = alerts.filter((a) => !a.resolved);

  const formatCurrency = (val: number) => {
    return `R$ ${Math.round(val).toLocaleString('pt-BR')}`;
  };

  const padZero = (n: number) => n.toString().padStart(2, '0');

  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none p-2.5 flex flex-col gap-2 font-sans select-none">
      {/* Upper Status Ribbon - Exactly styled like Habblaud reference */}
      <div className="flex items-center justify-between gap-3 w-full">
        {/* Left: Window branding and room/agent counts */}
        <div className="flex items-center gap-3 bg-slate-900/95 border border-slate-700/80 rounded-xl p-1.5 px-3 pointer-events-auto shadow-xl text-slate-100">
          <div className="flex items-center gap-2 pr-2 border-r border-slate-700/80">
            {/* Logo Emblem */}
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 via-amber-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Building2 className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-tight text-white flex items-center gap-1">
                Quatro Lotes
                <span className="text-[9px] font-mono font-normal text-sky-400 bg-sky-950/80 px-1 rounded border border-sky-800">
                  Simulação
                </span>
              </span>
            </div>
          </div>

          {/* Counts Cluster */}
          <div className="flex items-center gap-3 text-xs">
            <div className="text-center">
              <div className="font-mono font-bold text-slate-200">4</div>
              <div className="text-[9px] text-slate-400 uppercase font-semibold">lotes</div>
            </div>

            <div className="text-center">
              <div className="font-mono font-bold text-slate-200">{agentCount}</div>
              <div className="text-[9px] text-slate-400 uppercase font-semibold">agentes</div>
            </div>

            <div className="text-center">
              <div className="font-mono font-bold text-emerald-400">{Math.max(1, agentCount - 2)}</div>
              <div className="text-[9px] text-slate-400 uppercase font-semibold">trabalhando</div>
            </div>

            <div className="text-center hidden sm:block">
              <div className="font-mono font-bold text-amber-400">{unresolvedAlerts.length}</div>
              <div className="text-[9px] text-slate-400 uppercase font-semibold">precisam de você</div>
            </div>
          </div>
        </div>

        {/* Center: Consolidated Cash & Clock */}
        <div className="flex items-center gap-3 bg-slate-900/95 border border-slate-700/80 rounded-xl p-1.5 px-3 pointer-events-auto shadow-xl text-slate-100">
          <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
            <Coins className="w-4 h-4 text-emerald-400" />
            <div className="font-mono font-bold text-sm text-emerald-400 tracking-tight">
              {formatCurrency(totalCash)}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <div className="font-mono text-slate-200">
              <span className="text-slate-400 text-[11px] mr-1">Dia {clock.day} ·</span>
              <span className="font-bold text-sky-300">
                {padZero(clock.hour)}:{padZero(clock.minute)}
              </span>
            </div>
          </div>

          {/* Speed Controls */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-700">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onSetSpeed(clock.isPaused ? 1 : 0);
              }}
              className={`p-1 rounded cursor-pointer transition-colors ${
                clock.isPaused ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-300'
              }`}
              title={clock.isPaused ? 'Continuar (Espaço)' : 'Pausar (Espaço)'}
            >
              {clock.isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onSetSpeed(1);
              }}
              className={`px-1.5 py-0.5 text-xs font-mono rounded cursor-pointer transition-colors ${
                !clock.isPaused && clock.speed === 1 ? 'bg-sky-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              1x
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onSetSpeed(2);
              }}
              className={`px-1.5 py-0.5 text-xs font-mono rounded cursor-pointer transition-colors ${
                !clock.isPaused && clock.speed === 2 ? 'bg-sky-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              2x
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onSetSpeed(4);
              }}
              className={`p-1 rounded cursor-pointer transition-colors ${
                !clock.isPaused && clock.speed === 4 ? 'bg-sky-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <FastForward className="w-3 h-3 fill-current" />
            </button>
          </div>
        </div>

        {/* Right: Quick Action Hub & Utilities */}
        <div className="flex items-center gap-1.5 bg-slate-900/95 border border-slate-700/80 rounded-xl p-1.5 px-2.5 pointer-events-auto shadow-xl text-slate-100">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onOpenRoomCards();
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
            title="Visão Setorial de Ambientes (6 Salas)"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Ambientes</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onOpenManagement('meetings');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-950/80 hover:bg-purple-900 border border-purple-700/80 text-purple-300 text-xs font-semibold cursor-pointer"
            title="Convocação e Atas de Reunião"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Reuniões</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onOpenManagement('construction');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-700/80 text-amber-300 text-xs font-semibold cursor-pointer"
            title="Acompanhamento da Obra de 7 Dias"
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>Obras (7d)</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
            title={isMuted ? 'Ativar som (M)' : 'Silenciar áudio (M)'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
