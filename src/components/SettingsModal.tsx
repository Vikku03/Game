/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Difficulty, GameMode, GameSettings } from '../game/types';
import { X, Volume2, Music, Zap, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const modes: { id: GameMode; label: string; desc: string }[] = [
    {
      id: 'GRAVITY_SWITCH',
      label: 'Gravity Switcher (G-Switch)',
      desc: 'Tap / Space flips gravity between floor & ceiling. Dodge pipes and collect orbs!'
    },
    {
      id: 'FLAPPY_GRAVITY',
      label: 'Flappy Gravity',
      desc: 'Tap repeatedly to flap against gravity; gravity orbs invert the whole world!'
    }
  ];

  const difficulties: { id: Difficulty; label: string; color: string }[] = [
    { id: 'EASY', label: 'Casual', color: 'bg-emerald-500' },
    { id: 'NORMAL', label: 'Normal', color: 'bg-blue-500' },
    { id: 'HARD', label: 'Hard', color: 'bg-amber-500' },
    { id: 'TURBO', label: 'Turbo', color: 'bg-red-500' }
  ];

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[0_12px_0_#0f172a] max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="font-arcade text-lg sm:text-xl text-slate-900">SETTINGS & MODES</h2>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-6">
          {/* Game Mode */}
          <div>
            <label className="font-arcade text-xs text-slate-700 block mb-2">GAMEPLAY MODE</label>
            <div className="space-y-2">
              {modes.map(m => (
                <div
                  key={m.id}
                  onClick={() => onUpdateSettings({ mode: m.id })}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    settings.mode === m.id
                      ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-400'
                      : 'bg-white border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="font-arcade text-xs sm:text-sm text-slate-900">{m.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="font-arcade text-xs text-slate-700 block mb-2">SPEED & DIFFICULTY</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {difficulties.map(d => (
                <button
                  key={d.id}
                  onClick={() => onUpdateSettings({ difficulty: d.id })}
                  className={`py-2 px-3 rounded-xl font-arcade text-xs border-2 cursor-pointer transition-all ${
                    settings.difficulty === d.id
                      ? `${d.color} text-white border-slate-900 shadow-[0_3px_0_#0f172a] scale-102`
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Controls */}
          <div>
            <label className="font-arcade text-xs text-slate-700 block mb-2">AUDIO & SYNTH</label>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                  <Volume2 className="w-4 h-4 text-emerald-600" /> Sound FX
                </span>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={e => onUpdateSettings({ soundEnabled: e.target.checked })}
                  className="w-5 h-5 accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                  <Music className="w-4 h-4 text-amber-600" /> In-Game Audio (Voice-Over Track)
                </span>
                <input
                  type="checkbox"
                  checked={settings.musicEnabled}
                  onChange={e => onUpdateSettings({ musicEnabled: e.target.checked })}
                  className="w-5 h-5 accent-amber-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Visual Effects */}
          <div>
            <label className="font-arcade text-xs text-slate-700 block mb-2">VISUALS</label>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                <Sparkles className="w-4 h-4 text-purple-600" /> Motion Aura & Trails
              </span>
              <input
                type="checkbox"
                checked={settings.showTrail}
                onChange={e => onUpdateSettings({ showTrail: e.target.checked })}
                className="w-5 h-5 accent-purple-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-arcade text-xs rounded-xl shadow-[0_2px_0_#000] cursor-pointer"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
