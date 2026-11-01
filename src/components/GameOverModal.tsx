/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home } from 'lucide-react';

interface GameOverModalProps {
  isNewHighscore: boolean;
  onRestart: () => void;
  onMenu?: () => void;
}

const GAME_OVER_IMAGE_URL = '/assets/aistudio/WhatsApp_Image_2026-11-01_at_7.37.16_PM_30ca669a.jpeg';

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isNewHighscore,
  onRestart,
  onMenu,
}) => {
  // Prevent accidental instant-restarting from rapid tapping during gameplay
  const [canInteract, setCanInteract] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(GAME_OVER_IMAGE_URL);

  useEffect(() => {
    // 400ms cooldown so frantic jumps upon collision don't immediately restart
    const timer = setTimeout(() => {
      setCanInteract(true);
    }, 400);

    if (isNewHighscore) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    return () => clearTimeout(timer);
  }, [isNewHighscore]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200"
    >
      {/* Fitted Image Container */}
      <div className="relative flex flex-col items-center justify-center max-h-[75dvh] sm:max-h-[80dvh] max-w-[94vw] my-auto">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-amber-400/80 shadow-[0_15px_40px_rgba(0,0,0,0.85)] bg-slate-900 flex items-center justify-center">
          <img
            src={imgSrc}
            alt="Game Over"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              // Try alternate path if default has any issue
              if (imgSrc === GAME_OVER_IMAGE_URL) {
                setImgSrc('/gameover.jpeg');
              }
            }}
            className={`max-h-[66dvh] sm:max-h-[72dvh] w-auto max-w-[88vw] object-contain transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-90'
            }`}
          />
        </div>
      </div>

      {/* Dedicated Play Again Options below the image (No tap-to-play on the image) */}
      <div className="w-full max-w-sm flex items-center justify-center gap-3 pt-3 pb-2 px-4 shrink-0">
        <button
          disabled={!canInteract}
          onClick={(e) => {
            e.stopPropagation();
            if (canInteract) onRestart();
          }}
          className={`flex-1 py-3.5 sm:py-4 px-5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-arcade text-xs sm:text-sm rounded-xl sm:rounded-2xl border-3 border-slate-900 shadow-[0_4px_0_#064e3b] flex items-center justify-center gap-2 cursor-pointer transition-all font-bold ${
            !canInteract ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          <span>PLAY AGAIN</span>
        </button>

        {onMenu && (
          <button
            disabled={!canInteract}
            onClick={(e) => {
              e.stopPropagation();
              if (canInteract) onMenu();
            }}
            className={`py-3.5 sm:py-4 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-arcade text-xs sm:text-sm rounded-xl sm:rounded-2xl border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex items-center justify-center gap-2 cursor-pointer transition-all font-bold ${
              !canInteract ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            title="Main Menu"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            <span className="hidden sm:inline">MENU</span>
          </button>
        )}
      </div>
    </div>
  );
};
