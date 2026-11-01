/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cloud, Difficulty, EggCollectible, FoxChaser, GameMode, GameStats, GravityOrb, Particle, Pipe, Player } from './types';
import { sounds } from './audio';

export const CANVAS_WIDTH = 720;
export const CANVAS_HEIGHT = 1280;
export const CEILING_Y = 110;
export const FLOOR_Y = 1170;

export class GameEngine {
  public player: Player;
  public pipes: Pipe[] = [];
  public orbs: GravityOrb[] = [];
  public eggs: EggCollectible[] = [];
  public particles: Particle[] = [];
  public clouds: Cloud[] = [];
  public fox: FoxChaser;
  public stats: GameStats;

  public mode: GameMode = 'GRAVITY_SWITCH';
  public difficulty: Difficulty = 'NORMAL';
  public scrollSpeed = 7;
  public baseSpeed = 7;
  public maxSpeed = 13;
  public scrollX = 0;
  public mountainOffset = 0;
  public pipeSpawnTimer = 0;
  public orbSpawnTimer = 0;
  public nextPipeId = 1;
  public nextOrbId = 1;
  public nextEggId = 1;
  public gameOver = false;
  public isThrusting = false;

  constructor() {
    this.player = this.createPlayer();
    this.fox = {
      x: 70,
      targetX: 80,
      y: FLOOR_Y,
      runFrame: 0,
      angerLevel: 0,
      pounceTimer: 0
    };
    this.stats = {
      score: 0,
      highScore: parseInt(localStorage.getItem('gravity_chicken_highscore') || '0', 10),
      eggs: 0,
      totalEggs: parseInt(localStorage.getItem('gravity_chicken_eggs') || '0', 10),
      gravityFlips: 0,
      distance: 0,
      orbsHit: 0
    };
    this.initClouds();
  }

  private createPlayer(): Player {
    return {
      x: 210, // Positioned nicely on the left for mobile portrait
      y: 580, // Comfortable airborne height
      width: 140, // Large big size to clearly identify the face on mobile
      height: 140,
      vy: -2,
      gravityDirection: 1, // down
      rotation: 0,
      targetRotation: 0,
      isGrounded: false,
      runFrame: 0,
      flapTime: 0,
      invulnerableTime: 0,
      airFlipsCount: 0,
      alive: true
    };
  }

  public reset(mode: GameMode = this.mode, difficulty: Difficulty = this.difficulty) {
    this.mode = mode;
    this.difficulty = difficulty;
    this.player = this.createPlayer();
    this.pipes = [];
    this.orbs = [];
    this.eggs = [];
    this.particles = [];
    this.scrollX = 0;
    this.mountainOffset = 0;
    this.pipeSpawnTimer = 1.0;
    this.orbSpawnTimer = 2.0;
    this.gameOver = false;
    this.isThrusting = false;

    // Difficulty settings calibrated for mobile portrait
    if (this.difficulty === 'EASY') {
      this.baseSpeed = 6;
      this.maxSpeed = 10;
    } else if (this.difficulty === 'NORMAL') {
      this.baseSpeed = 7.2;
      this.maxSpeed = 12.5;
    } else if (this.difficulty === 'HARD') {
      this.baseSpeed = 8.5;
      this.maxSpeed = 15;
    } else { // TURBO
      this.baseSpeed = 10.5;
      this.maxSpeed = 18;
    }

    this.scrollSpeed = this.baseSpeed;
    this.stats.score = 0;
    this.stats.eggs = 0;
    this.stats.gravityFlips = 0;
    this.stats.distance = 0;
    this.stats.orbsHit = 0;

    this.fox.x = 70;
    this.fox.targetX = 80;
  }

  private initClouds() {
    this.clouds = [];
    for (let i = 0; i < 8; i++) {
      this.clouds.push({
        x: Math.random() * CANVAS_WIDTH,
        y: 120 + Math.random() * 320,
        scale: 0.7 + Math.random() * 0.7,
        speed: 0.3 + Math.random() * 0.4,
        opacity: 0.7 + Math.random() * 0.3
      });
    }
  }

  // Tap or Hold to fly upwards!
  public startFly() {
    if (!this.player.alive || this.gameOver) return;

    this.isThrusting = true;
    // Immediate upward flap impulse so tapping feels snappy and responsive
    this.player.vy = -13.2;
    this.player.flapTime = 0.25;
    this.stats.gravityFlips++;

    // Emit little sparkle lift particles underneath the avatar
    this.spawnThrustSparkles(4);
  }

  // Release tap to drop down naturally!
  public stopFly() {
    this.isThrusting = false;
  }

  public handleFlipOrJump() {
    this.startFly();
  }

  public spawnThrustSparkles(count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.player.x - 20 + Math.random() * 40,
        y: this.player.y + 45 + Math.random() * 15,
        vx: (Math.random() - 0.5) * 5,
        vy: 3 + Math.random() * 5,
        life: 0.3,
        maxLife: 0.3,
        color: Math.random() > 0.4 ? '#facc15' : '#fbbf24',
        size: 6 + Math.random() * 4,
        type: 'SPARKLE'
      });
    }
  }

  public spawnFeathers(x: number, y: number, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 2 + Math.random() * 6;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 0.5 + Math.random() * 0.4,
        maxLife: 0.9,
        color: Math.random() > 0.3 ? '#ffffff' : '#de3838',
        size: 10 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        type: 'FEATHER'
      });
    }
  }

  public spawnOrbBlast(x: number, y: number) {
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      life: 0.5,
      maxLife: 0.5,
      color: '#40e0d0',
      size: 180,
      type: 'ORB_RING'
    });
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * 7,
        vy: Math.sin(angle) * 7,
        life: 0.4,
        maxLife: 0.4,
        color: '#ffffff',
        size: 8,
        type: 'SPARKLE'
      });
    }
  }

  public update(dt: number): boolean {
    if (!this.player.alive) {
      this.updateParticles(dt);
      return false;
    }

    // Dynamic speed ramp
    this.scrollSpeed = Math.min(this.maxSpeed, this.baseSpeed + this.stats.distance / 1500);
    this.scrollX += this.scrollSpeed;
    this.mountainOffset += this.scrollSpeed;
    this.stats.distance += Math.round(this.scrollSpeed * 0.5);

    // Update clouds
    for (const c of this.clouds) {
      c.x -= c.speed * (this.scrollSpeed * 0.2);
      if (c.x < -200) {
        c.x = CANVAS_WIDTH + 150;
        c.y = 120 + Math.random() * 260;
      }
    }

    // Player flight and gravity physics
    if (this.isThrusting) {
      // While tapping or holding, fly upwards!
      this.player.vy = Math.max(-14, this.player.vy - 1.3);
      if (Math.random() < 0.25) {
        this.particles.push({
          x: this.player.x - 15 + Math.random() * 30,
          y: this.player.y + 45,
          vx: (Math.random() - 0.5) * 4,
          vy: 3 + Math.random() * 4,
          life: 0.25,
          maxLife: 0.25,
          color: '#facc15',
          size: 6,
          type: 'SPARKLE'
        });
      }
    } else {
      // When tap stops, gravity pulls down naturally!
      const gravityAccel = 0.82;
      this.player.vy += gravityAccel;
      const maxFallSpeed = 16.5;
      if (this.player.vy > maxFallSpeed) {
        this.player.vy = maxFallSpeed;
      }
    }

    this.player.y += this.player.vy;

    // Continuous rotation while flying through the air
    this.player.rotation += dt * (this.scrollSpeed * 0.65);

    // Collision boundaries:
    const playerRadius = 48;
    const topLimit = CEILING_Y + playerRadius;
    const botLimit = FLOOR_Y - playerRadius;

    // Ceiling boundary: cushion bump so player stays in play area
    if (this.player.y <= topLimit) {
      this.player.y = topLimit;
      if (this.player.vy < 0) {
        this.player.vy = 0;
      }
    }

    // Floor boundary: if player drops all the way down without tapping, crash onto floor rail!
    if (this.player.y >= botLimit) {
      this.player.y = botLimit;
      this.triggerGameOver();
      return false;
    }

    // Animation frames
    this.player.runFrame += dt * (this.scrollSpeed / 6);
    this.player.flapTime += dt;
    if (this.player.invulnerableTime > 0) {
      this.player.invulnerableTime -= dt;
    }

    // Update Fox chaser
    this.fox.runFrame += dt * (this.scrollSpeed / 5);
    // If player is flying high, fox falls back; if player is dropping low, fox closes in
    if (this.player.y > 850) {
      this.fox.targetX = Math.min(125, this.fox.targetX + dt * 25);
    } else {
      this.fox.targetX = Math.max(50, this.fox.targetX - dt * 25);
    }
    this.fox.x += (this.fox.targetX - this.fox.x) * 0.08;

    // Spawning logic
    this.pipeSpawnTimer -= dt;
    if (this.pipeSpawnTimer <= 0) {
      this.spawnPipe();
      // Pipe frequency calibrated for mobile portrait
      const interval = Math.max(1.4, 2.3 - (this.scrollSpeed / this.maxSpeed) * 0.7);
      this.pipeSpawnTimer = interval;
    }

    this.orbSpawnTimer -= dt;
    if (this.orbSpawnTimer <= 0) {
      this.spawnOrbAndEggs();
      this.orbSpawnTimer = 3.2 + Math.random() * 2.2;
    }

    // Update Pipes & Check Collisions
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i];
      pipe.x -= this.scrollSpeed;

      // Moving pipes in Hard/Turbo
      if (pipe.moving && pipe.moveRange && pipe.moveSpeed) {
        const offset = Math.sin(this.scrollX * 0.02 * pipe.moveSpeed) * pipe.moveRange;
        if (pipe.topPipeHeight > 0) pipe.topPipeHeight = Math.max(80, (pipe.baseY || 200) + offset);
        if (pipe.bottomPipeHeight > 0) pipe.bottomPipeHeight = Math.max(80, (pipe.baseY || 200) - offset);
      }

      // Check passing for score
      if (!pipe.passed && pipe.x + pipe.width < this.player.x) {
        pipe.passed = true;
        this.stats.score += 1;
        sounds.playScore();
      }

      // Check collision
      if (this.checkPipeCollision(pipe)) {
        this.triggerGameOver();
        return false;
      }

      // Remove off-screen pipes
      if (pipe.x < -150) {
        this.pipes.splice(i, 1);
      }
    }

    // Update Gravity Orbs
    for (let i = this.orbs.length - 1; i >= 0; i--) {
      const orb = this.orbs[i];
      orb.x -= this.scrollSpeed;
      orb.pulseTimer += dt;

      // Check human face hitting orb
      if (!orb.collected) {
        const dx = this.player.x - orb.x;
        const dy = this.player.y - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < orb.radius + 55) {
          orb.collected = true;
          this.stats.orbsHit++;
          this.stats.score += 5;
          sounds.playOrb();
          this.spawnOrbBlast(orb.x, orb.y);

          // Orb gives a great upward boost and scares fox away!
          this.player.vy = -12;
          this.fox.targetX = Math.max(40, this.fox.targetX - 50); // Knock fox back!
        }
      }

      if (orb.x < -100) {
        this.orbs.splice(i, 1);
      }
    }

    // Update Eggs & Corn
    for (let i = this.eggs.length - 1; i >= 0; i--) {
      const egg = this.eggs[i];
      egg.x -= this.scrollSpeed;
      egg.wobble += dt * 6;

      if (!egg.collected) {
        const dx = this.player.x - egg.x;
        const dy = this.player.y - egg.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 60) {
          egg.collected = true;
          const eggValue = egg.type === 'EGG' ? 1 : 2;
          this.stats.eggs += eggValue;
          this.stats.totalEggs += eggValue;
          this.stats.score += eggValue * 2;
          localStorage.setItem('gravity_chicken_eggs', this.stats.totalEggs.toString());
          sounds.playEgg();
          
          // Sparkles
          for (let s = 0; s < 6; s++) {
            this.particles.push({
              x: egg.x,
              y: egg.y,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              life: 0.35,
              maxLife: 0.35,
              color: '#f6e05e',
              size: 6,
              type: 'SPARKLE'
            });
          }
        }
      }

      if (egg.x < -100) {
        this.eggs.splice(i, 1);
      }
    }

    this.updateParticles(dt);

    // Save high score
    if (this.stats.score > this.stats.highScore) {
      this.stats.highScore = this.stats.score;
      localStorage.setItem('gravity_chicken_highscore', this.stats.highScore.toString());
    }

    return true;
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= dt;
      if (p.rotation !== undefined) {
        p.rotation += 0.05;
      }
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private checkPipeCollision(pipe: Pipe): boolean {
    const px = this.player.x;
    const py = this.player.y;
    // Forgiving collision circle for 140px avatar so near-misses feel rewarding
    const pr = 44;

    // Pipe X bounds with margin
    const pipeLeft = pipe.x - 6;
    const pipeRight = pipe.x + pipe.width + 6;

    // Check if player's X overlaps pipe
    if (px + pr > pipeLeft && px - pr < pipeRight) {
      // 1. Top pipe collision
      if (pipe.topPipeHeight > 0) {
        const topPipeBottom = CEILING_Y + pipe.topPipeHeight;
        if (py - pr < topPipeBottom) {
          return true;
        }
      }

      // 2. Bottom pipe collision
      if (pipe.bottomPipeHeight > 0) {
        const bottomPipeTop = FLOOR_Y - pipe.bottomPipeHeight;
        if (py + pr > bottomPipeTop) {
          return true;
        }
      }
    }

    return false;
  }

  private spawnPipe() {
    const pipeWidth = 110;
    const totalPlayableHeight = FLOOR_Y - CEILING_Y; // 1170 - 110 = 1060px

    // Difficulty creates different obstacle patterns
    // 1: Top-only pipe (must run on floor)
    // 2: Bottom-only pipe (must flip to ceiling)
    // 3: Dual pipes with a clear passage gap in middle
    const patternRoll = Math.random();

    let topHeight = 0;
    let botHeight = 0;

    if (patternRoll < 0.22) {
      // Bottom cigarette obstacle only (tap to fly comfortably over it!)
      botHeight = 240 + Math.random() * 240;
    } else if (patternRoll < 0.42) {
      // Top cigarette obstacle only (stop tap to glide under it!)
      topHeight = 240 + Math.random() * 240;
    } else {
      // Dual cigarette obstacles with a spacious flight passage gap (player avatar is 140, 420px gap is spacious and forgiving)
      const gap = Math.max(400, 470 - (this.scrollSpeed / this.maxSpeed) * 60);
      const minH = 140;
      const maxH = totalPlayableHeight - gap - minH;
      topHeight = minH + Math.random() * (maxH - minH);
      botHeight = totalPlayableHeight - gap - topHeight;
    }

    const isMoving = (this.difficulty === 'HARD' || this.difficulty === 'TURBO') && Math.random() > 0.55;

    this.pipes.push({
      id: this.nextPipeId++,
      x: CANVAS_WIDTH + 60,
      width: pipeWidth,
      topPipeHeight: topHeight,
      bottomPipeHeight: botHeight,
      passed: false,
      speed: this.scrollSpeed,
      moving: isMoving,
      moveRange: 60,
      moveSpeed: 1.2,
      baseY: topHeight > 0 ? topHeight : botHeight
    });
  }

  private spawnOrbAndEggs() {
    // Spawns Gravity Orb `⊙` well within mobile playable height
    const spawnY = 360 + Math.random() * 540;
    this.orbs.push({
      id: this.nextOrbId++,
      x: CANVAS_WIDTH + 140,
      y: spawnY,
      radius: 32,
      collected: false,
      pulseTimer: 0,
      type: 'FLIP'
    });

    // Also spawn collectible golden eggs / corn near the orb
    for (let i = 0; i < 2; i++) {
      this.eggs.push({
        id: this.nextEggId++,
        x: CANVAS_WIDTH + 240 + i * 80,
        y: spawnY + (i % 2 === 0 ? -70 : 70),
        collected: false,
        type: Math.random() > 0.4 ? 'EGG' : 'GOLDEN_CORN',
        wobble: Math.random() * Math.PI
      });
    }
  }

  public triggerGameOver() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.player.alive = false;
    sounds.playHit();
    this.spawnFeathers(this.player.x, this.player.y, 25);
  }
}
