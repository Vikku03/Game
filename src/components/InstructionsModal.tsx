/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ArrowUpDown, ShieldAlert, Sparkles, Trophy } from 'lucide-react';

interface InstructionsModalProps {
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-40 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[0_12px_0_#0f172a] max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="font-arcade text-lg sm:text-xl text-slate-900">HOW TO PLAY</h2>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-slate-700 text-sm">
          {/* Controls */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4">
            <h3 className="font-arcade text-xs text-amber-900 mb-2 flex items-center gap-1.5">
              <ArrowUpDown className="w-4 h-4 text-amber-700" /> CONTROLS
            </h3>
            <p className="font-bold text-slate-800">
              Press <span className="bg-white px-2 py-0.5 rounded border border-slate-300 shadow-sm font-arcade text-xs">SPACEBAR</span>, <span className="bg-white px-2 py-0.5 rounded border border-slate-300 shadow-sm font-arcade text-xs">CLICK</span>, or <span className="bg-white px-2 py-0.5 rounded border border-slate-300 shadow-sm font-arcade text-xs">TAP SCREEN</span>
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Flipping gravity instantly sends the hero flying toward the opposite rail! Run along the floor or ceiling upside-down!
            </p>
          </div>

          {/* Objectives */}
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 text-emerald-700 font-arcade text-sm">
                1
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Dodge Obstacles</h4>
                <p className="text-xs text-slate-500">
                  Obstacles come from both the ceiling and the floor. When a bottom obstacle blocks your path, flip up to the ceiling rail! When a top obstacle descends, flip back down!
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-cyan-100 border border-cyan-300 flex items-center justify-center shrink-0 text-cyan-700 font-arcade text-base">
                ⊙
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Hit Gravity Orbs (⊙)</h4>
                <p className="text-xs text-slate-500">
                  Floating target rings trigger mid-air flips, award bonus points, and knock the chasing fox backward!
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center shrink-0 text-red-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Outrun The Fox & Mole</h4>
                <p className="text-xs text-slate-500">
                  A hungry fox is sprinting along the bottom rail! Running on the floor allows the fox to creep closer. Running on the ceiling keeps you safely out of reach!
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-700">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Collect Eggs & Unlock Skins</h4>
                <p className="text-xs text-slate-500">
                  Gather shimmering golden eggs and corn to unlock stylish hats, ninja gear, crowns, and cybernetic chicken skins!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-arcade text-xs rounded-xl border-2 border-slate-900 shadow-[0_3px_0_#0f172a] cursor-pointer"
          >
            GOT IT, LET'S FLY!
          </button>
        </div>
      </div>
    </div>
  );
};
