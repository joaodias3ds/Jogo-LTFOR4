/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Play, Sparkles, Building2, GraduationCap, Truck, Store, Briefcase } from 'lucide-react';
import { soundEngine } from '../audio/synth';

interface TitleScreenProps {
  onStart: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        soundEngine.playSuccess();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  const handleStartClick = () => {
    soundEngine.playSuccess();
    onStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* Background Subtle Isometric Grid Pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.2) 0%, transparent 70%), linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
          backgroundSize: '100% 100%, 32px 32px, 32px 32px'
        }}
      />

      {/* Top Safe Area & Version */}
      <div className="relative pt-8 px-8 flex justify-between items-center text-xs text-slate-400 uppercase tracking-widest">
        <span className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-sky-400" />
          Centro Empresarial Integrado · Simulação 2D Pixel Art
        </span>
        <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-sky-400 font-mono">
          v0.2 · 01/11/2026
        </span>
      </div>

      {/* Central Hero Showcase: Title Lockup & 4 Lots */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto px-6 text-center my-auto">
        {/* Bespoke SVG Emblem */}
        <div className="mb-4">
          <svg className="w-20 h-20 text-sky-400 mx-auto drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="8" width="22" height="22" rx="3" fill="#2563eb" fillOpacity="0.85" stroke="#60a5fa" strokeWidth="2" />
            <rect x="34" y="8" width="22" height="22" rx="3" fill="#d97706" fillOpacity="0.85" stroke="#fbbf24" strokeWidth="2" />
            <rect x="8" y="34" width="22" height="22" rx="3" fill="#059669" fillOpacity="0.85" stroke="#34d399" strokeWidth="2" />
            <rect x="34" y="34" width="22" height="22" rx="3" fill="#7c3aed" fillOpacity="0.85" stroke="#a78bfa" strokeWidth="2" />
            {/* Center Core Nexus */}
            <circle cx="32" cy="32" r="6" fill="#f8fafc" stroke="#0284c7" strokeWidth="2" />
            <circle cx="32" cy="32" r="2.5" fill="#0284c7" />
          </svg>
        </div>

        {/* Title Lockup */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase drop-shadow-md">
          QUATRO LOTES
        </h1>
        <p className="text-sm md:text-base font-semibold tracking-widest text-sky-400 uppercase mt-1 mb-6">
          CENTRO EMPRESARIAL · GESTÃO E OPERAÇÃO EM TEMPO REAL
        </p>

        {/* 4 Lots Grid Preview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mb-8 text-left">
          <div className="p-3.5 rounded-lg bg-blue-950/40 border border-blue-800/50">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase mb-1">
              <GraduationCap className="w-4 h-4" /> Lote 1 · Educação
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Cursos, laboratório de informática, turmas e matrículas de alunos.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-800/50">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase mb-1">
              <Truck className="w-4 h-4" /> Lote 2 · Logística
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Docas, porta-paletes, vans de entrega, conferência e rotas.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-1">
              <Store className="w-4 h-4" /> Lote 3 · Comércio
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Salão de vendas, vitrines, gôndolas, caixas registradoras e estoque.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-purple-950/40 border border-purple-800/50">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase mb-1">
              <Briefcase className="w-4 h-4" /> Lote 4 · Escritórios
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Coworking, sala de reuniões, TI & suporte técnico e projetos.
            </p>
          </div>
        </div>

        {/* Start Button */}
        <button
          type="button"
          data-start="true"
          onClick={handleStartClick}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 active:scale-95 transition-all rounded-lg shadow-[0_0_30px_rgba(56,189,248,0.5)] cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>INICIAR GESTÃO DO COMPLEXO</span>
          <Sparkles className="w-4 h-4 text-slate-950" />
        </button>
      </div>

      {/* Control Hint Line Bottom */}
      <div className="relative pb-6 text-center text-xs text-slate-400 font-mono tracking-wide">
        <span className="text-slate-200">WASD</span> ou <span className="text-slate-200">Clique</span> para Mover ·{' '}
        <span className="text-slate-200">Clique</span> para Inspecionar ·{' '}
        <span className="text-slate-200">Espaço</span> Pausar ·{' '}
        <span className="text-slate-200">M</span> Alternar Áudio
      </div>
    </div>
  );
};
