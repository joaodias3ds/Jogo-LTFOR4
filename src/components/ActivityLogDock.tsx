/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActivityLogEntry } from '../types/game';
import { ChevronUp, ChevronDown, Terminal, CheckCircle2, Clock } from 'lucide-react';
import { soundEngine } from '../audio/synth';

interface ActivityLogDockProps {
  logs: ActivityLogEntry[];
}

export const ActivityLogDock: React.FC<ActivityLogDockProps> = ({ logs }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-2xl pointer-events-auto font-sans select-none">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-none text-slate-100">
        {/* Header Bar */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setIsExpanded(!isExpanded);
          }}
          className="w-full flex items-center justify-between p-2.5 px-4 bg-slate-950/80 hover:bg-slate-950 cursor-pointer text-left border-b border-slate-800/80"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span className="uppercase tracking-wider">Feed de Atividade em Tempo Real</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
              ● Ao Vivo
            </span>
          </div>

          <div className="p-1 rounded hover:bg-slate-800 text-slate-400">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {/* Live Entries Stream */}
        {isExpanded && (
          <div className="p-2.5 max-h-32 overflow-y-auto space-y-1.5 font-mono text-[11px]">
            {logs.slice(0, 6).map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-2.5 p-1 px-2 rounded hover:bg-slate-800/60 transition-colors"
              >
                <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>

                <span className="font-bold text-slate-200 shrink-0">{log.npcName}</span>

                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-sky-400 border border-slate-700 uppercase shrink-0">
                  {log.projectTag}
                </span>

                <span className="text-slate-300 truncate">{log.actionText}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
