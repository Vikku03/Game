/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameMode, GameStats } from '../game/types';
import { Egg, RotateCcw } from 'lucide-react';

interface HUDProps {
  stats: GameStats;
  mode: GameMode;
  isPaused: boolean;
  foxDistance: number; // 0 to 100
  onTogglePause: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  isPaused,
  foxDistance,
  onTogglePause,
  onRestart,
  onOpenSettings,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none z-10">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full">
        {/* Top-Left: Exact Yellow Pause Button from Screenshot */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onTogglePause}
            title={isPaused ? 'Resume (Esc / P)' : 'Pause (Esc / P)'}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-[#facc15] hover:bg-[#fde047] active:scale-95 transition-all rounded-lg border-[3px] border-[#0f172a] shadow-[0_4px_0_#0f172a] flex items-center justify-center cursor-pointer group"
          >
            {/* The iconic double yellow/black pause bars from screenshot */}
            <div className="flex gap-1.5 items-center">
              <span className="w-2 sm:w-2.5 h-6 sm:h-7 bg-[#b45309] border-[1.5px] border-[#0f172a] rounded-sm group-hover:scale-105 transition-transform" />
              <span className="w-2 sm:w-2.5 h-6 sm:h-7 bg-[#b45309] border-[1.5px] border-[#0f172a] rounded-sm group-hover:scale-105 transition-transform" />
            </div>
          </button>

          <button
            onClick={onRestart}
            title="Restart Run (R)"
            className="w-10 h-10 sm:w-11 sm:h-11 bg-white/90 hover:bg-white text-slate-800 rounded-lg border-2 border-slate-900 shadow-[0_3px_0_#0f172a] flex items-center justify-center cursor-pointer active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Score Display */}
        <div className="flex flex-col items-center pointer-events-auto">
          <div className="bg-slate-900/85 backdrop-blur-md px-5 sm:px-8 py-1.5 sm:py-2 rounded-2xl border-2 border-white/60 shadow-[0_6px_20px_rgba(0,0,0,0.25)] flex items-center gap-3">
            <span className="font-arcade text-2xl sm:text-4xl text-amber-300 drop-shadow-[0_2px_0_#000]">
              {stats.score}
            </span>
            <div className="h-6 w-px bg-white/20" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-slate-300">BEST</span>
              <span className="font-arcade text-xs sm:text-sm text-white font-bold">{stats.highScore}</span>
            </div>
          </div>
        </div>

        {/* Top-Right: Collectibles */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Egg Counter */}
          <div
            className="flex items-center gap-1.5 bg-amber-400/90 text-slate-950 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border-2 border-slate-900 shadow-[0_3px_0_#0f172a]"
          >
            <Egg className="w-5 h-5 fill-amber-100 text-amber-700" />
            <span className="font-arcade text-xs sm:text-sm font-bold">{stats.totalEggs}</span>
          </div>
        </div>
      </div>

      {/* Bottom Danger / Proximity Bar */}
      <div className="w-full flex items-center justify-between pb-1 px-1">
        {/* Fox proximity warning */}
        <div className="pointer-events-auto flex items-center gap-2">
          {foxDistance > 65 && (
            <div className="bg-red-500/90 text-white font-arcade text-[10px] sm:text-xs px-3 py-1.5 rounded-lg border-2 border-slate-900 animate-bounce flex items-center gap-2 shadow-lg">
              <span>🦊</span>
              <span>FOX IS CATCHING UP! FLIP TO CEILING!</span>
            </div>
          )}
        </div>

        {/* Distance & Flips Counter */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-slate-900/70 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl border border-white/20 text-white text-xs">
          <span className="text-slate-300">Distance:</span>
          <span className="font-arcade text-xs text-emerald-300">{stats.distance}m</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">Flips:</span>
          <span className="font-arcade text-xs text-cyan-300">{stats.gravityFlips}</span>
        </div>
      </div>
    </div>
  );
};
