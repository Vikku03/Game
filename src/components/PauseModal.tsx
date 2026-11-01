/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, Settings, HelpCircle } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onOpenSettings,
  onOpenHelp,
}) => {
  return (
    <div className="absolute inset-0 z-30 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[0_12px_0_#0f172a] max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
        <h2 className="font-arcade text-2xl text-slate-900 mb-6 drop-shadow-[0_2px_0_#cbd5e1]">
          GAME PAUSED
        </h2>

        <div className="flex flex-col gap-3">
          {/* Resume */}
          <button
            onClick={onResume}
            className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-white font-arcade text-sm rounded-2xl border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            RESUME (ESC)
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-900 font-arcade text-xs sm:text-sm rounded-2xl border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            RESTART RUN (R)
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 font-arcade text-xs rounded-xl border-2 border-slate-900 shadow-[0_3px_0_#0f172a] flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Settings className="w-4 h-4" />
            SETTINGS & MODES
          </button>

          {/* How to play */}
          <button
            onClick={onOpenHelp}
            className="w-full py-2 px-4 text-slate-500 hover:text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            How To Play
          </button>
        </div>
      </div>
    </div>
  );
};
