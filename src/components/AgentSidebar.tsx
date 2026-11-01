/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NPCEntity, LotId } from '../types/game';
import { Search, ChevronDown, ChevronRight, User, Sparkles } from 'lucide-react';
import { soundEngine } from '../audio/synth';

interface AgentSidebarProps {
  npcs: NPCEntity[];
  selectedNpcId?: string;
  onSelectNpc: (npcId: string) => void;
}

export const AgentSidebar: React.FC<AgentSidebarProps> = ({
  npcs,
  selectedNpcId,
  onSelectNpc
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLot, setFilterLot] = useState<LotId | 'all'>('all');
  const [collapsedProjects, setCollapsedProjects] = useState<Record<string, boolean>>({});

  const toggleProject = (project: string) => {
    setCollapsedProjects((prev) => ({ ...prev, [project]: !prev[project] }));
    soundEngine.playClick();
  };

  // Group NPCs by project tag
  const filteredNpcs = npcs.filter((n) => {
    if (n.id === 'npc_player') return false; // don't list player in employee roster
    if (filterLot !== 'all' && n.lotId !== filterLot) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        n.name.toLowerCase().includes(q) ||
        n.currentActivityDesc.toLowerCase().includes(q) ||
        (n.projectTag && n.projectTag.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const projectGroups: Record<string, NPCEntity[]> = {};
  for (const npc of filteredNpcs) {
    const tag = npc.projectTag || 'geral';
    if (!projectGroups[tag]) projectGroups[tag] = [];
    projectGroups[tag].push(npc);
  }

  const getLotBadgeColor = (lotId: string) => {
    if (lotId === 'education') return 'bg-blue-900/60 text-blue-300 border-blue-700/60';
    if (lotId === 'logistics') return 'bg-amber-900/60 text-amber-300 border-amber-700/60';
    if (lotId === 'retail') return 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60';
    if (lotId === 'offices') return 'bg-purple-900/60 text-purple-300 border-purple-700/60';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <aside aria-label="Painel de Agentes e Projetos" className="fixed top-14 left-3 bottom-14 z-30 w-72 md:w-80 bg-slate-900/95 border border-slate-700/80 rounded-2xl text-slate-100 shadow-2xl flex flex-col font-sans select-none pointer-events-auto backdrop-blur-none animate-in fade-in slide-in-from-left duration-150">
      {/* Header */}
      <div className="p-3.5 pb-2 border-b border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">Painel Operacional</h2>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 border border-slate-700">
            {filteredNpcs.length} colaboradores
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Buscar agente, projeto ou conta"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Lot Filter Pills */}
        <div className="flex gap-1 overflow-x-auto pb-1 text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setFilterLot('all')}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              filterLot === 'all' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setFilterLot('education')}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              filterLot === 'education' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Educação
          </button>
          <button
            type="button"
            onClick={() => setFilterLot('logistics')}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              filterLot === 'logistics' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Logística
          </button>
          <button
            type="button"
            onClick={() => setFilterLot('retail')}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              filterLot === 'retail' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Comércio
          </button>
          <button
            type="button"
            onClick={() => setFilterLot('offices')}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              filterLot === 'offices' ? 'bg-purple-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Escritórios
          </button>
        </div>
      </div>

      {/* Projects and Agents List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {Object.entries(projectGroups).map(([project, groupNpcs]) => {
          const isCollapsed = collapsedProjects[project];
          return (
            <div key={project} className="rounded-xl bg-slate-950/70 border border-slate-800/80 overflow-hidden">
              {/* Project Header */}
              <button
                type="button"
                onClick={() => toggleProject(project)}
                className="w-full flex items-center justify-between p-2.5 px-3 bg-slate-900 hover:bg-slate-850 cursor-pointer text-left border-b border-slate-800/60"
              >
                <div className="flex items-center gap-2">
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className="font-mono text-xs font-bold text-white">{project}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({groupNpcs.length})</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>

              {/* Agents in Project */}
              {!isCollapsed && (
                <div className="p-1 space-y-1">
                  {groupNpcs.map((npc) => {
                    const isSelected = selectedNpcId === npc.id;
                    return (
                      <button
                        type="button"
                        key={npc.id}
                        onClick={() => {
                          soundEngine.playClick();
                          onSelectNpc(npc.id);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-sky-950 border border-sky-600/80 shadow-md'
                            : 'hover:bg-slate-850/80 border border-transparent'
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                          style={{ backgroundColor: npc.avatarColor }}
                        >
                          {npc.name.charAt(0)}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-100 truncate">{npc.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono uppercase shrink-0 ${getLotBadgeColor(npc.lotId)}`}>
                              {npc.lotId.slice(0, 3)}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">
                            {npc.currentActivityDesc}
                          </div>
                        </div>

                        {/* Status Green Dot */}
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
