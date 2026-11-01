/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle, AlertTriangle, Clock, Sparkles, Users } from 'lucide-react';
import { soundEngine } from '../audio/synth';

interface RoomCardItem {
  id: string;
  name: string;
  agentCount: number;
  statusText: string;
  badgeType: 'need_you' | 'ci_failed' | 'subagents' | 'waiting_shell' | 'working' | 'merged';
  description: string;
  lotName: string;
}

interface RoomCardsViewProps {
  onClose: () => void;
  onSelectRoom: (roomId: string) => void;
}

export const RoomCardsView: React.FC<RoomCardsViewProps> = ({ onClose, onSelectRoom }) => {
  const roomCards: RoomCardItem[] = [
    {
      id: 'room_api_pay',
      name: 'api-pagamentos',
      agentCount: 3,
      statusText: 'precisa de você',
      badgeType: 'need_you',
      description: 'Entregando: Rodar suíte de testes de integração com gateways bancários.',
      lotName: 'Escritórios'
    },
    {
      id: 'room_data_pipe',
      name: 'data-pipeline',
      agentCount: 2,
      statusText: 'CI falhou',
      badgeType: 'ci_failed',
      description: 'Falha no build do pipeline de dados de faturamento. Revisar query.',
      lotName: 'Logística'
    },
    {
      id: 'room_loja_virt',
      name: 'loja-virtual',
      agentCount: 4,
      statusText: '3 subagentes ativos',
      badgeType: 'subagents',
      description: 'Catálogo de produtos escolares atualizado e integrado ao estoque físico.',
      lotName: 'Comércio'
    },
    {
      id: 'room_chatbot',
      name: 'chatbot-suporte',
      agentCount: 3,
      statusText: 'esperando o shell',
      badgeType: 'waiting_shell',
      description: 'Aguardando liberação de token para indexação de documentos de FAQ.',
      lotName: 'Educação'
    },
    {
      id: 'room_novo_proj',
      name: 'novo-projeto',
      agentCount: 3,
      statusText: 'trabalhando',
      badgeType: 'working',
      description: 'Equipe de design e arquitetura prototipando novas salas de aula.',
      lotName: 'Educação'
    },
    {
      id: 'room_app_mobile',
      name: 'app-mobile',
      agentCount: 2,
      statusText: 'PR #12 mergeado 🎉',
      badgeType: 'merged',
      description: 'Módulo de acompanhamento de entregas aprovado e publicado em produção.',
      lotName: 'Escritórios'
    }
  ];

  const getBadgeStyle = (type: RoomCardItem['badgeType']) => {
    switch (type) {
      case 'need_you':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'ci_failed':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/30';
      case 'merged':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold';
      case 'subagents':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'waiting_shell':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'working':
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-6 font-sans select-none backdrop-blur-none animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 bg-slate-950 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-white">
              Visão Setorial de Ambientes & Tarefas
            </h2>
            <div className="text-xs text-slate-400 font-mono">
              Monitoramento dos fluxos de trabalho e squads empresariais
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6-Card Grid matching reference image_4dbac532.png */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomCards.map((card) => (
            <div
              key={card.id}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              {/* Card Header Pill */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-white">
                  <span>{card.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-slate-400 font-normal">{card.agentCount}</span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  {card.lotName}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed min-h-[3rem]">
                {card.description}
              </p>

              {/* Bottom Status Badge */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span
                  className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold inline-flex items-center gap-1.5 ${getBadgeStyle(
                    card.badgeType
                  )}`}
                >
                  {card.statusText}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    onSelectRoom(card.id);
                  }}
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
                >
                  Ver Sala →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
