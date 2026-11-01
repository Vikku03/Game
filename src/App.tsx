/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GameEngine } from './game/physics';
import { GameMode, GameSettings, GameState } from './game/types';
import { bgm, gameOverDialogue, sounds } from './game/audio';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { SettingsModal } from './components/SettingsModal';
import { InstructionsModal } from './components/InstructionsModal';
import { Play, HelpCircle, ArrowUpDown, Settings as SettingsIcon } from 'lucide-react';

export default function App() {
  const engine = useMemo(() => new GameEngine(), []);
  const [gameState, setGameState] = useState<GameState>('START');
  const [activeModal, setActiveModal] = useState<'NONE' | 'PAUSE' | 'GAMEOVER' | 'SETTINGS' | 'HELP'>('NONE');
  const [isNewHighscore, setIsNewHighscore] = useState(false);

  // Settings from storage
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('gravity_chicken_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Force music on by default and disable jump sound effects per user request
        parsed.musicEnabled = true;
        parsed.soundEnabled = false;
        if (parsed.selectedSkin === 'classic' || !parsed.selectedSkin) {
          parsed.selectedSkin = 'face_hero';
        }
        return parsed;
      }
    } catch {}
    return {
      soundEnabled: false,
      musicEnabled: true,
      soundVolume: 0,
      musicVolume: 0.9,
      difficulty: 'NORMAL',
      mode: 'GRAVITY_SWITCH',
      showTrail: true,
      vibration: true,
      selectedSkin: 'face_hero',
      selectedHat: 'none',
    };
  });

  // Track stats for re-rendering HUD
  const [, setTick] = useState(0);

  const startSong = useCallback(() => {
    bgm.play();
  }, []);

  const pauseSong = useCallback(() => {
    bgm.pause();
  }, []);

  const stopSong = useCallback(() => {
    bgm.stop();
  }, []);

  // Preload audio buffers and game over assets immediately
  useEffect(() => {
    bgm.preload();
    gameOverDialogue.preload();
    const img = new Image();
    img.src = '/assets/aistudio/WhatsApp_Image_2026-11-01_at_7.37.16_PM_30ca669a.jpeg';
  }, []);

  // Periodic HUD state sync
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => (t + 1) % 1000);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleStartGame = useCallback(() => {
    gameOverDialogue.stop();
    engine.reset(settings.mode, settings.difficulty);
    setIsNewHighscore(false);
    setGameState('PLAYING');
    setActiveModal('NONE');
    startSong();
  }, [engine, settings.mode, settings.difficulty, startSong]);

  const handleGoToMenu = useCallback(() => {
    gameOverDialogue.stop();
    stopSong();
    setGameState('START');
    setActiveModal('NONE');
  }, [stopSong]);

  const handleGameOver = useCallback(() => {
    setGameState('GAMEOVER');
    setActiveModal('GAMEOVER');
    stopSong(); // Stops the background song immediately
    gameOverDialogue.play(); // Plays the Telugu Singham dialogue!
    sounds.stopMusic();
    const prevBest = parseInt(localStorage.getItem('gravity_chicken_highscore') || '0', 10);
    if (engine.stats.score > prevBest && engine.stats.score > 0) {
      setIsNewHighscore(true);
    }
  }, [engine.stats.score, stopSong]);

  const handleFlip = useCallback(() => {
    if (gameState === 'START') {
      handleStartGame();
      return;
    }
    // GAMEOVER state intentionally does NOT restart on tap
    if (gameState === 'PLAYING') {
      engine.handleFlipOrJump();
    }
  }, [gameState, handleStartGame, engine]);

  const handleTogglePause = useCallback(() => {
    if (gameState === 'PLAYING') {
      setGameState('PAUSED');
      setActiveModal('PAUSE');
      pauseSong();
      sounds.stopMusic();
    } else if (gameState === 'PAUSED') {
      setGameState('PLAYING');
      setActiveModal('NONE');
      startSong();
    }
  }, [gameState, pauseSong, startSong]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'KeyW' || e.code === 'KeyS') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        handleTogglePause();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleStartGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleTogglePause, handleStartGame]);

  const handleSpendEggs = (amount: number): boolean => {
    if (engine.stats.totalEggs >= amount) {
      engine.stats.totalEggs -= amount;
      localStorage.setItem('gravity_chicken_eggs', engine.stats.totalEggs.toString());
      setTick(t => t + 1);
      return true;
    }
    return false;
  };

  const foxDistance = Math.max(0, Math.min(100, (engine.fox.x / 140) * 100));

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-slate-950 flex flex-col items-center justify-center font-sans-ui select-none">
      {/* Mobile-Only Game Layout: Fills full screen with native portrait proportions */}
      <div className="relative w-full h-full max-w-lg sm:max-w-md sm:h-[96dvh] sm:rounded-3xl sm:border-4 sm:border-slate-800 flex flex-col items-center justify-center overflow-hidden shadow-2xl bg-slate-950">
        {/* Main Fullscreen Canvas + HUD */}
        <div className="relative w-full h-full flex-1 flex items-center justify-center overflow-hidden">
          <GameCanvas
            engine={engine}
            gameState={gameState}
            settings={settings}
            onGameOver={handleGameOver}
            onFlip={handleFlip}
          />

          {/* HUD Overlay (visible when playing or paused) */}
          {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
            <HUD
              stats={engine.stats}
              mode={settings.mode}
              isPaused={gameState === 'PAUSED'}
              foxDistance={foxDistance}
              gravityDirection={engine.player.gravityDirection}
              onTogglePause={handleTogglePause}
              onRestart={handleStartGame}
              onOpenSettings={() => setActiveModal('SETTINGS')}
            />
          )}

          {/* Start Game Splash Screen Tailored for Mobile */}
          {gameState === 'START' && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-between p-5 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
              {/* Top Bar on Start */}
              <div className="w-full flex items-center justify-end pointer-events-auto">
                <button
                  onClick={() => setActiveModal('SETTINGS')}
                  className="w-11 h-11 bg-white/95 hover:bg-white text-slate-800 rounded-xl border-2 border-slate-900 shadow-[0_3px_0_#0f172a] flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                  title="Settings"
                >
                  <SettingsIcon className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              {/* Title & Start Prompt */}
              <div className="flex flex-col items-center text-center my-auto py-2">
                {/* Large Rotating Hero Face Avatar */}
                <div className="relative mb-4 flex items-center justify-center">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-amber-400 shadow-[0_12px_36px_rgba(0,0,0,0.7)] overflow-hidden ring-4 ring-slate-900 relative bg-slate-950/80 flex items-center justify-center">
                    <img
                      src="/assets/aistudio/oval_image_ee00d596.png"
                      alt="Gravity Hero Face"
                      className="w-full h-full object-cover animate-[spin_4s_linear_infinite]"
                    />
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-arcade text-xs px-3.5 py-1.5 rounded-full border-2 border-slate-900 shadow-[0_3px_0_#0f172a] mb-2 uppercase tracking-wider font-bold">
                  <ArrowUpDown className="w-3.5 h-3.5" /> RETRO GRAVITY RUNNER
                </div>

                <h1 className="font-arcade text-3xl sm:text-4xl text-white drop-shadow-[0_3px_0_#0f172a] tracking-tight mb-2">
                  GRAVITY HERO
                </h1>
                <p className="text-white/90 text-xs sm:text-sm max-w-xs font-semibold drop-shadow-md mb-6 px-1">
                  Flip gravity between floor and ceiling, dodge obstacles, collect gravity orbs ⊙, and outrun the fox!
                </p>

                {/* Huge Pulsing Play Button */}
                <button
                  onClick={handleStartGame}
                  className="group w-full max-w-xs py-4 px-6 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-arcade text-lg sm:text-xl rounded-2xl border-4 border-slate-900 shadow-[0_6px_0_#064e3b] flex items-center justify-center gap-2.5 cursor-pointer transition-all animate-bounce"
                >
                  <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
                  <span>TAP TO PLAY</span>
                </button>

                <div className="mt-4 text-amber-300 font-arcade text-[11px] font-bold tracking-wider">
                  ⚡ TAP SCREEN TO FLIP GRAVITY ⚡
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center gap-3 pb-1">
                <button
                  onClick={() => setActiveModal('HELP')}
                  className="px-4 py-2.5 bg-white/95 hover:bg-white text-slate-900 font-arcade text-xs rounded-xl border-2 border-slate-900 shadow-[0_3px_0_#0f172a] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all font-bold"
                >
                  <HelpCircle className="w-4 h-4 text-slate-700" /> HOW TO PLAY
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {activeModal === 'PAUSE' && (
          <PauseModal
            onResume={handleTogglePause}
            onRestart={handleStartGame}
            onOpenSettings={() => setActiveModal('SETTINGS')}
            onOpenHelp={() => setActiveModal('HELP')}
          />
        )}

        {activeModal === 'GAMEOVER' && (
          <GameOverModal
            isNewHighscore={isNewHighscore}
            onRestart={handleStartGame}
            onMenu={handleGoToMenu}
          />
        )}

        {activeModal === 'SETTINGS' && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={newS => setSettings(prev => ({ ...prev, ...newS }))}
            onClose={() => setActiveModal(gameState === 'PAUSED' ? 'PAUSE' : 'NONE')}
          />
        )}

        {activeModal === 'HELP' && (
          <InstructionsModal
            onClose={() => setActiveModal(gameState === 'PAUSED' ? 'PAUSE' : 'NONE')}
          />
        )}
      </div>
    </div>
  );
}
