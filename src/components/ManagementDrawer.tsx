/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BusinessLotSummary,
  ConstructionProject,
  FinancialTransaction,
  InterCompanySolicitation,
  LotId,
  MeetingSession
} from '../types/game';
import {
  X,
  Building,
  HardHat,
  MessageSquare,
  ArrowRightLeft,
  DollarSign,
  CheckCircle,
  Clock,
  Sparkles,
  Check,
  AlertTriangle,
  GraduationCap,
  Truck,
  Store,
  Briefcase
} from 'lucide-react';
import { soundEngine } from '../audio/synth';

interface ManagementDrawerProps {
  initialTab?: 'overview' | 'construction' | 'meetings' | 'solicitations' | 'finances';
  lotsSummary: BusinessLotSummary[];
  construction: ConstructionProject;
  meeting: MeetingSession;
  solicitations: InterCompanySolicitation[];
  transactions: FinancialTransaction[];
  totalCash: number;
  onClose: () => void;
  onApproveProposal: (proposalId: string) => void;
  onContractNewConstruction: (name: string, lotId: LotId, cost: number) => void;
  onCreateSolicitation: (from: LotId, to: LotId, title: string, value: number) => void;
  onConveneMeeting: (lotId: LotId) => void;
}

export const ManagementDrawer: React.FC<ManagementDrawerProps> = ({
  initialTab = 'overview',
  lotsSummary,
  construction,
  meeting,
  solicitations,
  transactions,
  totalCash,
  onClose,
  onApproveProposal,
  onContractNewConstruction,
  onCreateSolicitation,
  onConveneMeeting
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'construction' | 'meetings' | 'solicitations' | 'finances'>(initialTab);
  const [aiDialogueLoading, setAiDialogueLoading] = useState(false);
  const [managerAdvice, setManagerAdvice] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return `R$ ${Math.round(val).toLocaleString('pt-BR')}`;
  };

  const handleSimulateAiConsult = () => {
    setAiDialogueLoading(true);
    soundEngine.playClick();
    setTimeout(() => {
      setAiDialogueLoading(false);
      setManagerAdvice(
        `"Administrador Alex, como gestora de ${meeting.lotId.toUpperCase()}, recomendo aprovar com urgência a proposta 1. Nossa taxa de ocupação atingiu o teto da capacidade física e o retorno sobre o investimento em matrículas cobrirá o custo em menos de duas semanas de calendário."`
      );
      soundEngine.playSuccess();
    }, 800);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-slate-900 border-l border-slate-700 text-slate-100 shadow-2xl flex flex-col font-sans select-none animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3">
          <Building className="w-5 h-5 text-sky-400" />
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-white">Central de Gestão</h2>
            <div className="text-xs text-slate-400 font-mono">Quatro Lotes — Centro Empresarial</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          title="Fechar painel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('overview');
          }}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-sky-400 text-sky-400 bg-sky-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>4 Lotes</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('construction');
          }}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'construction'
              ? 'border-amber-400 text-amber-400 bg-amber-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HardHat className="w-4 h-4" />
          <span>Obras (7 Dias)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('meetings');
          }}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'meetings'
              ? 'border-purple-400 text-purple-400 bg-purple-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Reuniões & Atas</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('solicitations');
          }}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'solicitations'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Serviços Inter-Lotes</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('finances');
          }}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'finances'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Finanças (DRE)</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* 1. OVERVIEW OF 4 LOTS */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="text-sm text-slate-300">
              Desempenho operacional consolidado dos quatro lotes empresariais. Cada lote opera com autonomia delegada e centro de custo individual.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {lotsSummary.map((lot) => (
                <div
                  key={lot.lotId}
                  className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/70 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {lot.lotId === 'education' && <GraduationCap className="w-5 h-5 text-blue-400" />}
                      {lot.lotId === 'logistics' && <Truck className="w-5 h-5 text-amber-400" />}
                      {lot.lotId === 'retail' && <Store className="w-5 h-5 text-emerald-400" />}
                      {lot.lotId === 'offices' && <Briefcase className="w-5 h-5 text-purple-400" />}
                      <span className="font-bold text-sm text-white">{lot.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {formatCurrency(lot.cash)}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400">{lot.specialty}</div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Equipe</div>
                      <div className="font-bold text-slate-200">{lot.employeeCount} pessoas</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Satisfação</div>
                      <div className="font-bold text-emerald-400">{lot.reputation}%</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Contratos</div>
                      <div className="font-bold text-sky-400">{lot.activeContracts}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      onConveneMeeting(lot.lotId);
                      setActiveTab('meetings');
                    }}
                    className="w-full py-1.5 px-3 bg-slate-700/80 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Convocar Reunião com Gestor
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. 7-DAY CONSTRUCTION ROADMAP */}
        {activeTab === 'construction' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-amber-300">{construction.name}</h3>
                  <div className="text-xs text-slate-300">
                    Cronograma de 7 Dias · Dia {construction.currentDayOfProject} de 7 em execução
                  </div>
                </div>
                <div className="text-xl font-bold font-mono text-amber-400">
                  {construction.progressPercent}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all"
                  style={{ width: `${construction.progressPercent}%` }}
                />
              </div>

              {/* 7 Milestones Steps */}
              <div className="grid grid-cols-7 gap-1 pt-2 text-center text-[10px]">
                {[
                  { day: 1, name: 'Isolamento' },
                  { day: 2, name: 'Estrutura' },
                  { day: 3, name: 'Paredes' },
                  { day: 4, name: 'Elétrica' },
                  { day: 5, name: 'Acabamento' },
                  { day: 6, name: 'Mobiliário' },
                  { day: 7, name: 'Vistoria' }
                ].map((s) => {
                  const isDone = construction.currentDayOfProject > s.day;
                  const isCurrent = construction.currentDayOfProject === s.day;
                  return (
                    <div
                      key={s.day}
                      className={`p-1.5 rounded border ${
                        isDone
                          ? 'bg-emerald-950 border-emerald-700 text-emerald-300 font-bold'
                          : isCurrent
                          ? 'bg-amber-900/80 border-amber-500 text-white font-bold animate-pulse'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div>D{s.day}</div>
                      <div className="truncate">{s.name}</div>
                    </div>
                  );
                })}
              </div>

              <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                <span>Trabalhadores no Canteiro: {construction.assignedWorkers.length} especialistas</span>
                <span className="text-emerald-400 font-medium">✓ Insumos e materiais validados</span>
              </div>
            </div>

            {/* Contract New Expansion */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/70 space-y-3">
              <h4 className="font-bold text-sm text-white">Contratar Novo Pacote de Obras (7 Dias)</h4>
              <p className="text-xs text-slate-400">
                Conforme documento mestre, obras têm duração planejada de sete dias. Não há entrega instantânea na campanha.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playHammer();
                    onContractNewConstruction('Expansão Bloco de Ensino Prático', 'education', 32000);
                  }}
                  className="p-3 text-left rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-sky-500 cursor-pointer space-y-1 transition-all"
                >
                  <div className="font-bold text-sky-400">Expansão de Ensino Prático</div>
                  <div className="text-[11px] text-slate-400">Novas salas e bancadas · 7 dias</div>
                  <div className="font-mono font-bold text-slate-200">R$ 32.000</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playHammer();
                    onContractNewConstruction('Nova Doca Rápida de Expedição', 'logistics', 38000);
                  }}
                  className="p-3 text-left rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-amber-500 cursor-pointer space-y-1 transition-all"
                >
                  <div className="font-bold text-amber-400">Nova Doca Rápida</div>
                  <div className="text-[11px] text-slate-400">Plataforma e esteira · 7 dias</div>
                  <div className="font-mono font-bold text-slate-200">R$ 38.000</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. FORMAL MEETINGS & PROPOSALS */}
        {activeTab === 'meetings' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-purple-300">{meeting.managerName}</h3>
                  <div className="text-xs text-slate-400">{meeting.managerRole}</div>
                </div>
                <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-900 text-purple-200 border border-purple-700">
                  {meeting.status === 'in_session' ? 'Em Sessão Presencial' : 'Relatório Entregue'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                <div className="font-bold text-slate-300">Pauta: {meeting.agendaTopic}</div>
                <div className="text-slate-400 leading-relaxed italic">{meeting.periodSummary.notes}</div>
              </div>

              {/* AI Strategic Consultation Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSimulateAiConsult}
                  disabled={aiDialogueLoading}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-900/70 hover:bg-indigo-800 border border-indigo-700 text-indigo-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{aiDialogueLoading ? 'Consultando IA da Gestora...' : 'Consultar Análise da Gestora (IA)'}</span>
                </button>

                {managerAdvice && (
                  <div className="mt-2.5 p-3 rounded-lg bg-indigo-950/60 border border-indigo-800/80 text-xs text-indigo-200 leading-relaxed font-sans">
                    {managerAdvice}
                  </div>
                )}
              </div>
            </div>

            {/* Proposals List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Propostas Prioritárias em Pauta (Até 3)
              </h4>

              {meeting.proposals.map((prop) => (
                <div
                  key={prop.id}
                  className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/70 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-sm text-white">{prop.title}</div>
                      <div className="text-xs text-slate-300 mt-0.5 leading-snug">{prop.description}</div>
                    </div>
                    <div className="text-sm font-bold font-mono text-amber-400 whitespace-nowrap">
                      {formatCurrency(prop.cost)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-700/60">
                    <span className="text-emerald-400 font-medium">Benefício: {prop.expectedBenefit}</span>

                    {prop.status === 'approved' ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <Check className="w-4 h-4" /> Aprovada
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playCashRegister();
                          onApproveProposal(prop.id);
                        }}
                        disabled={prop.cost > totalCash}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-colors ${
                          prop.cost <= totalCash
                            ? 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Aprovar & Reservar</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. INTER-COMPANY SOLICITATIONS */}
        {activeTab === 'solicitations' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-300">
              Cooperação direta entre os lotes: pedidos de transporte da Logística, compras de suprimentos no Comércio e suporte técnico dos Escritórios.
            </div>

            <div className="space-y-3">
              {solicitations.map((sol) => (
                <div
                  key={sol.id}
                  className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{sol.title}</span>
                    <span className="font-mono font-bold text-emerald-400">{formatCurrency(sol.value)}</span>
                  </div>

                  <div className="text-slate-300">{sol.description}</div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
                    <span>
                      {sol.fromLot.toUpperCase()} ➔ {sol.toLot.toUpperCase()}
                    </span>
                    <span className="font-semibold text-sky-400">
                      {sol.status === 'completed' ? '✓ Concluído' : `Em Execução (${sol.completionPercent}%)`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Create Service Order */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/70 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                Emitir Nova Ordem de Cooperação
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playSuccess();
                    onCreateSolicitation('retail', 'logistics', 'Frete Expresso de 50 Pedidos do Comércio', 1200);
                  }}
                  className="p-2.5 rounded bg-slate-900 hover:bg-slate-850 border border-slate-700 text-left cursor-pointer"
                >
                  <div className="font-bold text-amber-400">Comércio ➔ Logística</div>
                  <div className="text-[11px] text-slate-400">Despacho de encomendas · R$ 1.200</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playSuccess();
                    onCreateSolicitation('education', 'offices', 'Suporte Técnico e Rede do Lab', 850);
                  }}
                  className="p-2.5 rounded bg-slate-900 hover:bg-slate-850 border border-slate-700 text-left cursor-pointer"
                >
                  <div className="font-bold text-purple-400">Educação ➔ Escritórios</div>
                  <div className="text-[11px] text-slate-400">Calibração de TI · R$ 850</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. FINANCES (DRE) */}
        {activeTab === 'finances' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <div className="text-xs text-slate-400 uppercase">Caixa Líquido Consolidado</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
                  {formatCurrency(totalCash)}
                </div>
              </div>
              <div className="text-xs text-slate-400 text-right">
                <div>Projeção 30 Dias:</div>
                <div className="text-sm font-bold text-sky-400 font-mono">
                  {formatCurrency(totalCash + 65000)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Últimos Lançamentos Contábeis
              </h4>

              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {transactions.slice(0, 10).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-2.5 rounded bg-slate-850 border border-slate-800 text-xs flex justify-between items-center"
                  >
                    <div>
                      <div className="text-slate-200 font-medium">{tx.description}</div>
                      <div className="text-[10px] text-slate-400 uppercase">{tx.lotId} · {tx.category}</div>
                    </div>
                    <div
                      className={`font-mono font-bold ${
                        tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {tx.amount >= 0 ? '+' : ''}
                      {formatCurrency(tx.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
