/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { CANVAS_HEIGHT, CANVAS_WIDTH, GameEngine } from '../game/physics';
import { GameRenderer } from '../game/renderer';
import { GameMode, GameSettings, GameState } from '../game/types';

interface GameCanvasProps {
  engine: GameEngine;
  gameState: GameState;
  settings: GameSettings;
  onGameOver: () => void;
  onFlip: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  engine,
  gameState,
  settings,
  onGameOver,
  onFlip,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Setup renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    rendererRef.current = new GameRenderer(ctx);
    rendererRef.current.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
  }, []);

  // Main game loop
  useEffect(() => {
    const loop = (currentTime: number) => {
      const dt = Math.min(0.05, (currentTime - lastTimeRef.current) / 1000);
      lastTimeRef.current = currentTime;

      const renderer = rendererRef.current;
      if (renderer) {
        if (gameState === 'PLAYING') {
          const isAlive = engine.update(dt);
          if (!isAlive && engine.gameOver) {
            onGameOver();
          }
        }

        // Draw Frame
        renderer.clear();
        renderer.drawSky();
        renderer.drawClouds(engine.clouds);
        renderer.drawMountains(engine.mountainOffset);
        renderer.drawPipes(engine.pipes);
        renderer.drawGravityOrbs(engine.orbs, engine.player);
        renderer.drawCollectibles(engine.eggs);
        renderer.drawRails(engine.scrollX);
        renderer.drawFox(engine.fox);
        renderer.drawParticles(engine.particles);
        renderer.drawChicken(
          engine.player,
          settings.selectedSkin,
          settings.selectedHat,
          settings.showTrail
        );
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, engine, settings, onGameOver]);

  // Pointer / Tap interaction
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only trigger if interacting with the canvas directly (not on HUD buttons)
    if (e.target === canvasRef.current) {
      onFlip();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950 select-none cursor-pointer"
      onPointerDown={handlePointerDown}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="max-w-full max-h-full object-contain aspect-video shadow-2xl touch-none"
      />
    </div>
  );
};
