/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, CheckCircle2, TrendingUp } from 'lucide-react';

interface MyDayWidgetProps {
  workingHoursText: string;
  waitingCount: number;
}

export const MyDayWidget: React.FC<MyDayWidgetProps> = ({
  workingHoursText = '2 h 16 min',
  waitingCount = 0
}) => {
  // Mini activity bar chart heights matching the reference widget
  const barHeights = [4, 8, 12, 16, 10, 14, 18, 16, 12, 18, 16, 6, 4];

  return (
    <div className="fixed bottom-3 left-84 z-20 hidden lg:block pointer-events-auto font-sans select-none">
      <div className="w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xl text-slate-800 dark:text-slate-100">
        {/* Title */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2.5">
          <span className="w-2 h-2 rounded-sm bg-sky-500" />
          <span>Meu dia · hoje</span>
        </div>

        {/* Card: Esperando você */}
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-sm bg-amber-500" />
            <span>Esperando você</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
            {waitingCount} s
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            {waitingCount === 0 ? 'nenhuma espera pendente' : `${waitingCount} solicitações urgentes`}
          </div>
        </div>

        {/* Working time & Activity Histogram */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-emerald-500" />
              <span>Trabalhando</span>
            </div>
            <span className="font-mono text-emerald-500">{workingHoursText}</span>
          </div>

          {/* Histogram Bars */}
          <div className="flex items-end gap-1 h-6 pt-1">
            {barHeights.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-all"
                style={{
                  height: `${h}px`,
                  backgroundColor: i === 9 ? '#f59e0b' : '#10b981'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
