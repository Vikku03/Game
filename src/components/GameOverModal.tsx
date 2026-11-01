/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface GameOverModalProps {
  isNewHighscore: boolean;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isNewHighscore,
  onRestart,
}) => {
  useEffect(() => {
    if (isNewHighscore) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [isNewHighscore]);

  return (
    <div
      onClick={onRestart}
      className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-3 sm:p-4 select-none cursor-pointer animate-in fade-in zoom-in-95 duration-150"
      title="Click or tap anywhere to play again"
    >
      {/* Fitted Image Container - Perfectly preserves natural aspect ratio */}
      <div className="relative group max-h-[86vh] max-w-[92vw] flex flex-col items-center justify-center">
        <img
          src="/assets/aistudio/WhatsApp_Image_2026-11-01_at_7.37.16_PM_30ca669a.jpeg"
          alt="Play Again"
          className="max-h-[82vh] max-w-[90vw] w-auto h-auto object-contain rounded-2xl sm:rounded-3xl border-4 border-slate-900 shadow-[0_12px_35px_rgba(0,0,0,0.7)] group-hover:scale-[1.02] active:scale-95 transition-transform duration-150"
        />

        {/* Floating Tap to Play Again Pill */}
        <div className="absolute bottom-4 bg-slate-950/90 text-amber-300 font-arcade text-xs sm:text-sm px-5 py-2.5 rounded-full border-2 border-amber-400 shadow-[0_4px_15px_rgba(0,0,0,0.6)] flex items-center gap-2 group-hover:scale-105 transition-transform animate-pulse">
          <span>▶</span>
          <span>TAP TO PLAY AGAIN</span>
        </div>
      </div>
    </div>
  );
};
