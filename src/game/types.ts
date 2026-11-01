/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export type GameMode = 'GRAVITY_SWITCH' | 'FLAPPY_GRAVITY';

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD' | 'TURBO';

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  gravityDirection: 1 | -1; // 1 = down, -1 = up
  rotation: number; // in radians
  targetRotation: number;
  isGrounded: boolean;
  runFrame: number;
  flapTime: number;
  invulnerableTime: number;
  airFlipsCount: number;
  alive: boolean;
}

export interface Pipe {
  id: number;
  x: number;
  width: number;
  topPipeHeight: number; // height from ceiling
  bottomPipeHeight: number; // height from floor
  passed: boolean;
  speed: number;
  moving?: boolean;
  moveRange?: number;
  moveSpeed?: number;
  baseY?: number;
}

export interface GravityOrb {
  id: number;
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  pulseTimer: number;
  targetY?: number;
  type: 'FLIP' | 'BOOST' | 'MEGA_POINTS';
}

export interface EggCollectible {
  id: number;
  x: number;
  y: number;
  collected: boolean;
  type: 'EGG' | 'GOLDEN_CORN';
  wobble: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  rotation?: number;
  type?: 'FEATHER' | 'SPARKLE' | 'SMOKE' | 'DUST' | 'ORB_RING';
}

export interface FoxChaser {
  x: number;
  targetX: number;
  y: number;
  runFrame: number;
  angerLevel: number; // 0 to 100
  pounceTimer: number;
}

export interface Cloud {
  x: number;
  y: number;
  scale: number;
  speed: number;
  opacity: number;
}

export interface GameStats {
  score: number;
  highScore: number;
  eggs: number;
  totalEggs: number;
  gravityFlips: number;
  distance: number;
  orbsHit: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  musicVolume: number;
  difficulty: Difficulty;
  mode: GameMode;
  showTrail: boolean;
  vibration: boolean;
  selectedSkin: string;
  selectedHat: string;
}
