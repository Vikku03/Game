/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cloud, EggCollectible, FoxChaser, GravityOrb, Particle, Pipe, Player } from './types';
import { HATS, SKINS } from './skins';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private width = 1920;
  private height = 1080;
  private stripeOffset = 0;
  private faceImg: HTMLImageElement | null = null;
  private faceImgLoaded = false;
  private cigaretteImg: HTMLImageElement | null = null;
  private cigaretteImgLoaded = false;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.initFaceImage();
    this.initCigaretteImage();
  }

  private initFaceImage() {
    this.faceImg = new Image();
    this.faceImg.onload = () => {
      this.faceImgLoaded = true;
    };
    this.faceImg.src = '/assets/aistudio/oval_image_ee00d596.png';
  }

  private initCigaretteImage() {
    this.cigaretteImg = new Image();
    this.cigaretteImg.onload = () => {
      this.cigaretteImgLoaded = true;
    };
    this.cigaretteImg.src = '/assets/aistudio/cigarette_obstacle.png';
  }

  public setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  // Draw bright blue sky with subtle atmospheric gradient
  public drawSky() {
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, '#24b0e8');
    grad.addColorStop(0.4, '#3ac2f0');
    grad.addColorStop(0.85, '#6ee0f9');
    grad.addColorStop(1, '#a1edf8');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // Draw fluffy cartoon clouds matching the screenshot
  public drawClouds(clouds: Cloud[]) {
    this.ctx.save();
    for (const c of clouds) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${c.opacity})`;
      this.ctx.beginPath();
      const cx = c.x;
      const cy = c.y;
      const s = c.scale;

      // Compound cloud shape with multiple soft circles
      this.ctx.arc(cx - 50 * s, cy + 10 * s, 35 * s, 0, Math.PI * 2);
      this.ctx.arc(cx - 20 * s, cy - 15 * s, 45 * s, 0, Math.PI * 2);
      this.ctx.arc(cx + 25 * s, cy - 10 * s, 40 * s, 0, Math.PI * 2);
      this.ctx.arc(cx + 60 * s, cy + 12 * s, 32 * s, 0, Math.PI * 2);
      this.ctx.arc(cx, cy + 15 * s, 40 * s, 0, Math.PI * 2);
      this.ctx.fill();

      // Soft light underside shading
      this.ctx.fillStyle = `rgba(230, 240, 250, ${c.opacity * 0.7})`;
      this.ctx.beginPath();
      this.ctx.arc(cx - 30 * s, cy + 22 * s, 26 * s, 0, Math.PI * 2);
      this.ctx.arc(cx + 30 * s, cy + 22 * s, 26 * s, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  // Draw the iconic snow-capped jagged mountain ridge from the screenshot
  public drawMountains(mountainOffset: number) {
    this.ctx.save();
    const baseY = 1000;
    
    // Distant soft blue mountain silhouettes
    this.ctx.fillStyle = '#8ed0ee';
    this.ctx.beginPath();
    this.ctx.moveTo(0, baseY);
    
    const distStep = 180;
    const distPoints = Math.ceil(this.width / distStep) + 3;
    const startIdx = Math.floor(mountainOffset * 0.25 / distStep);
    
    for (let i = -1; i <= distPoints; i++) {
      const idx = startIdx + i;
      const px = i * distStep - ((mountainOffset * 0.25) % distStep);
      // Pseudo-random mountain height based on index
      const h = 180 + ((Math.sin(idx * 1.7) * 0.5 + 0.5) * 160);
      this.ctx.lineTo(px, baseY - h);
    }
    this.ctx.lineTo(this.width + 50, baseY);
    this.ctx.closePath();
    this.ctx.fill();

    // Foreground snowy jagged ridge with white peaks and icy facets
    const peakStep = 120;
    const peakCount = Math.ceil(this.width / peakStep) + 3;
    const pStart = Math.floor(mountainOffset * 0.5 / peakStep);

    // Draw dark blue base of peaks
    this.ctx.fillStyle = '#b7e4f7';
    this.ctx.beginPath();
    this.ctx.moveTo(0, baseY);
    const peaks: { x: number; y: number; h: number; snowH: number }[] = [];

    for (let i = -1; i <= peakCount; i++) {
      const idx = pStart + i;
      const px = i * peakStep - ((mountainOffset * 0.5) % peakStep);
      const h = 240 + ((Math.sin(idx * 2.3) * 0.4 + Math.cos(idx * 0.9) * 0.4 + 0.5) * 140);
      const py = baseY - h;
      peaks.push({ x: px, y: py, h, snowH: h * 0.45 });
      this.ctx.lineTo(px, py);
    }
    this.ctx.lineTo(this.width + 50, baseY);
    this.ctx.closePath();
    this.ctx.fill();

    // Draw pure white snowcaps with faceted shadows
    for (let i = 0; i < peaks.length - 1; i++) {
      const p1 = peaks[i];
      const p2 = peaks[i + 1];
      const midX = (p1.x + p2.x) / 2;

      // Snow face
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p1.x + 25, p1.y + p1.snowH);
      this.ctx.lineTo(midX, p1.y + p1.snowH * 0.7);
      this.ctx.lineTo(p1.x - 20, p1.y + p1.snowH * 0.8);
      this.ctx.closePath();
      this.ctx.fill();

      // Shadow facet of snow
      this.ctx.fillStyle = '#d5effa';
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p1.x - 20, p1.y + p1.snowH * 0.8);
      this.ctx.lineTo(p1.x - 5, p1.y + p1.snowH * 1.1);
      this.ctx.closePath();
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  // Draw the green diagonally-striped top and bottom rails exactly matching the screenshot
  public drawRails(scrollX: number) {
    this.stripeOffset = (scrollX % 48);
    const railHeight = 76;
    const creamHeight = 8;

    const renderRail = (topY: number) => {
      this.ctx.save();
      // Outer tan/cream frame border
      this.ctx.fillStyle = '#dedf9d';
      this.ctx.fillRect(0, topY, this.width, railHeight);

      // Inner stripe area
      this.ctx.fillStyle = '#c8ca82';
      this.ctx.fillRect(0, topY + creamHeight, this.width, railHeight - creamHeight * 2);

      // Draw repeating angled green candy stripes
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(0, topY + creamHeight, this.width, railHeight - creamHeight * 2);
      this.ctx.clip();

      const stripeW = 24;
      const totalWidth = this.width + stripeW * 4;
      for (let x = -stripeW * 2 - this.stripeOffset; x < totalWidth; x += stripeW * 2) {
        this.ctx.fillStyle = '#83bf36'; // Bright lime stripe
        this.ctx.beginPath();
        this.ctx.moveTo(x, topY + creamHeight);
        this.ctx.lineTo(x + stripeW, topY + creamHeight);
        this.ctx.lineTo(x + stripeW - 20, topY + railHeight - creamHeight);
        this.ctx.lineTo(x - 20, topY + railHeight - creamHeight);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#9fd64a'; // Light lime highlight stripe
        this.ctx.beginPath();
        this.ctx.moveTo(x + stripeW, topY + creamHeight);
        this.ctx.lineTo(x + stripeW * 2, topY + creamHeight);
        this.ctx.lineTo(x + stripeW * 2 - 20, topY + railHeight - creamHeight);
        this.ctx.lineTo(x + stripeW - 20, topY + railHeight - creamHeight);
        this.ctx.closePath();
        this.ctx.fill();
      }
      this.ctx.restore();

      // Top and bottom crisp divider lines
      this.ctx.strokeStyle = '#5a7822';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(0, topY + creamHeight, this.width, railHeight - creamHeight * 2);

      this.ctx.strokeStyle = '#8d904f';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(0, topY + railHeight);
      this.ctx.lineTo(this.width, topY + railHeight);
      this.ctx.moveTo(0, topY);
      this.ctx.lineTo(this.width, topY);
      this.ctx.stroke();

      this.ctx.restore();
    };

    // Ceiling rail
    renderRail(0);
    // Floor rail
    renderRail(this.height - railHeight);
  }

  // Draw cigarette obstacles replacing retro green pipes
  public drawPipes(pipes: Pipe[]) {
    this.ctx.save();

    for (const pipe of pipes) {
      // 1. TOP OBSTACLE (descending from ceiling rail)
      if (pipe.topPipeHeight > 0) {
        const topH = pipe.topPipeHeight;
        const pipeY = 76; // starts just below ceiling rail

        if (this.cigaretteImgLoaded && this.cigaretteImg) {
          // Draw hanging down with filter at the ceiling and burning ash at bottom tip
          this.ctx.save();
          this.ctx.translate(pipe.x + pipe.width / 2, pipeY + topH / 2);
          this.ctx.scale(1, -1); // Invert so ash points downwards into the flying passage
          this.ctx.drawImage(
            this.cigaretteImg,
            -pipe.width / 2,
            -topH / 2,
            pipe.width,
            topH
          );
          this.ctx.restore();

          // Subtle glowing ember pulse at the bottom ash tip
          const emberY = pipeY + topH;
          const pulse = Math.sin(Date.now() * 0.006 + pipe.x * 0.01) * 0.3 + 0.7;
          const emberGrad = this.ctx.createRadialGradient(
            pipe.x + pipe.width / 2,
            emberY - 6,
            2,
            pipe.x + pipe.width / 2,
            emberY - 6,
            pipe.width * 0.45
          );
          emberGrad.addColorStop(0, `rgba(255, 100, 20, ${0.45 * pulse})`);
          emberGrad.addColorStop(1, 'rgba(255, 60, 0, 0)');
          this.ctx.fillStyle = emberGrad;
          this.ctx.beginPath();
          this.ctx.arc(pipe.x + pipe.width / 2, emberY - 6, pipe.width * 0.45, 0, Math.PI * 2);
          this.ctx.fill();
        } else {
          // Clean fallback if image is still loading
          this.drawFallbackPipe(pipe.x, pipeY, pipe.width, topH, true);
        }
      }

      // 2. BOTTOM OBSTACLE (rising from floor rail)
      if (pipe.bottomPipeHeight > 0) {
        const botH = pipe.bottomPipeHeight;
        const floorRailY = this.height - 76;
        const shaftY = floorRailY - botH;

        if (this.cigaretteImgLoaded && this.cigaretteImg) {
          // Draw rising up with filter on floor rail and burning ash at top tip
          this.ctx.drawImage(
            this.cigaretteImg,
            pipe.x,
            shaftY,
            pipe.width,
            botH
          );

          // Subtle glowing ember pulse at the top ash tip
          const pulse = Math.sin(Date.now() * 0.006 + pipe.x * 0.01) * 0.3 + 0.7;
          const emberGrad = this.ctx.createRadialGradient(
            pipe.x + pipe.width / 2,
            shaftY + 6,
            2,
            pipe.x + pipe.width / 2,
            shaftY + 6,
            pipe.width * 0.45
          );
          emberGrad.addColorStop(0, `rgba(255, 100, 20, ${0.45 * pulse})`);
          emberGrad.addColorStop(1, 'rgba(255, 60, 0, 0)');
          this.ctx.fillStyle = emberGrad;
          this.ctx.beginPath();
          this.ctx.arc(pipe.x + pipe.width / 2, shaftY + 6, pipe.width * 0.45, 0, Math.PI * 2);
          this.ctx.fill();
        } else {
          // Clean fallback if image is still loading
          this.drawFallbackPipe(pipe.x, shaftY, pipe.width, botH, false);
        }
      }
    }

    this.ctx.restore();
  }

  private drawFallbackPipe(x: number, y: number, w: number, h: number, isTop: boolean) {
    const grad = this.ctx.createLinearGradient(x, 0, x + w, 0);
    grad.addColorStop(0, '#f0efe9');
    grad.addColorStop(0.5, '#ffffff');
    grad.addColorStop(1, '#d5d4ce');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(x, y, w, h);
    this.ctx.strokeStyle = '#8a8880';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(x, y, w, h);
    // Filter band
    const filterH = Math.min(h * 0.35, 90);
    const filterY = isTop ? y : y + h - filterH;
    this.ctx.fillStyle = '#cf7a27';
    this.ctx.fillRect(x, filterY, w, filterH);
  }

  // Draw the iconic Gravity Orb `⊙` with tether line matching the screenshot
  public drawGravityOrbs(orbs: GravityOrb[], player: Player) {
    this.ctx.save();

    for (const orb of orbs) {
      if (orb.collected) continue;

      const pulse = Math.sin(orb.pulseTimer * 8) * 4;
      const r = orb.radius + pulse;

      // 1. Dotted vertical tether line connecting to chicken like in screenshot!
      const distToPlayer = Math.abs(player.x - orb.x);
      if (distToPlayer < 240) {
        this.ctx.save();
        this.ctx.setLineDash([6, 6]);
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.15, 0.7 - distToPlayer / 300)})`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(orb.x, orb.y);
        this.ctx.lineTo(player.x, player.y);
        this.ctx.stroke();
        this.ctx.restore();
      }

      // 2. Outer glowing aura
      const aura = this.ctx.createRadialGradient(orb.x, orb.y, r * 0.4, orb.x, orb.y, r * 2.2);
      aura.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      aura.addColorStop(0.3, 'rgba(64, 224, 208, 0.6)');
      aura.addColorStop(1, 'rgba(64, 224, 208, 0)');
      this.ctx.fillStyle = aura;
      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, r * 2.2, 0, Math.PI * 2);
      this.ctx.fill();

      // 3. Crisp target ring (white circle with black outline and black bullseye center `⊙`)
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.lineWidth = 4;
      this.ctx.strokeStyle = '#1a202c';
      this.ctx.stroke();

      // Inner ring
      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, r * 0.55, 0, Math.PI * 2);
      this.ctx.strokeStyle = '#2d3748';
      this.ctx.lineWidth = 3;
      this.ctx.stroke();

      // Center pupil / target dot
      this.ctx.fillStyle = '#0f172a';
      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, r * 0.22, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  // Draw collectible golden eggs and corn
  public drawCollectibles(eggs: EggCollectible[]) {
    this.ctx.save();
    for (const egg of eggs) {
      if (egg.collected) continue;
      const wobble = Math.sin(egg.wobble) * 4;

      if (egg.type === 'EGG') {
        // Shimmering golden egg
        this.ctx.save();
        this.ctx.translate(egg.x, egg.y + wobble);
        this.ctx.rotate(Math.sin(egg.wobble * 0.5) * 0.15);

        // Glow
        const eggGlow = this.ctx.createRadialGradient(0, 0, 8, 0, 0, 32);
        eggGlow.addColorStop(0, 'rgba(255, 223, 0, 0.8)');
        eggGlow.addColorStop(1, 'rgba(255, 223, 0, 0)');
        this.ctx.fillStyle = eggGlow;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 30, 0, Math.PI * 2);
        this.ctx.fill();

        // Egg shape
        this.ctx.fillStyle = '#ffdf00';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 16, 22, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#b8860b';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Highlight glint
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.ellipse(-5, -6, 4, 8, -Math.PI / 6, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
      } else {
        // Golden Corn cob
        this.ctx.save();
        this.ctx.translate(egg.x, egg.y + wobble);
        this.ctx.fillStyle = '#f6ad55';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 14, 20, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#c05621';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Corn leaves
        this.ctx.fillStyle = '#68d391';
        this.ctx.beginPath();
        this.ctx.moveTo(-10, 14);
        this.ctx.quadraticCurveTo(-14, 24, -4, 28);
        this.ctx.quadraticCurveTo(-2, 18, 0, 14);
        this.ctx.fill();

        this.ctx.restore();
      }
    }
    this.ctx.restore();
  }

  // Draw the sly chasing Fox (`🦊`) and Mole on the bottom rail matching the screenshot
  public drawFox(fox: FoxChaser) {
    this.ctx.save();
    const floorY = 1004; // sits atop the bottom track
    const x = fox.x;
    const y = floorY - 28;
    const run = Math.sin(fox.runFrame * 12);

    // 1. Chasing orange fox
    this.ctx.save();
    this.ctx.translate(x, y);

    // Fox body (sleek running pose)
    this.ctx.fillStyle = '#e0662d';
    this.ctx.beginPath();
    this.ctx.ellipse(0, -6, 36, 18, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Fox white chest
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.ellipse(18, -4, 14, 12, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Fox head
    this.ctx.fillStyle = '#e0662d';
    this.ctx.beginPath();
    this.ctx.ellipse(28, -14, 18, 14, 0.1, 0, Math.PI * 2);
    this.ctx.fill();

    // Pointy ears
    this.ctx.fillStyle = '#b84414';
    this.ctx.beginPath();
    this.ctx.moveTo(22, -26);
    this.ctx.lineTo(30, -38);
    this.ctx.lineTo(34, -24);
    this.ctx.closePath();
    this.ctx.fill();

    // Snout and black nose
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.moveTo(34, -14);
    this.ctx.lineTo(46, -12);
    this.ctx.lineTo(36, -6);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = '#1a202c';
    this.ctx.beginPath();
    this.ctx.arc(46, -12, 3.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Fox eye
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(32, -16, 4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#1a202c';
    this.ctx.beginPath();
    this.ctx.arc(33, -16, 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Bushy tail waving up and down
    const tailAngle = Math.sin(fox.runFrame * 10) * 0.2 - 0.2;
    this.ctx.save();
    this.ctx.translate(-32, -10);
    this.ctx.rotate(tailAngle);
    this.ctx.fillStyle = '#e0662d';
    this.ctx.beginPath();
    this.ctx.ellipse(-16, -14, 26, 14, -0.6, 0, Math.PI * 2);
    this.ctx.fill();

    // White tail tip
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.ellipse(-32, -22, 10, 8, -0.6, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();

    // Fox animated legs
    this.ctx.fillStyle = '#b84414';
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = '#b84414';
    // Front legs
    this.ctx.beginPath();
    this.ctx.moveTo(14, 4);
    this.ctx.lineTo(24 + run * 10, 24);
    this.ctx.moveTo(22, 4);
    this.ctx.lineTo(12 - run * 10, 24);
    // Back legs
    this.ctx.moveTo(-18, 4);
    this.ctx.lineTo(-8 - run * 12, 24);
    this.ctx.moveTo(-24, 4);
    this.ctx.lineTo(-32 + run * 12, 24);
    this.ctx.stroke();

    this.ctx.restore();

    // 2. Tiny scurrying black mole / mouse just in front of the fox (as in screenshot!)
    const moleX = x - 55;
    const moleY = floorY - 10;
    this.ctx.fillStyle = '#2d3748';
    this.ctx.beginPath();
    this.ctx.ellipse(moleX, moleY, 14, 9, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Mole pink snout and ears
    this.ctx.fillStyle = '#feb2b2';
    this.ctx.beginPath();
    this.ctx.arc(moleX + 13, moleY, 2.5, 0, Math.PI * 2);
    this.ctx.arc(moleX + 4, moleY - 8, 3, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  // Draw the Player Hero (Rotating oval image)
  public drawChicken(
    player: Player,
    _skinId: string,
    _hatId: string,
    showTrail: boolean
  ) {
    this.ctx.save();

    // Motion trail if active
    if (showTrail && Math.abs(player.vy) > 3) {
      this.ctx.save();
      this.ctx.globalAlpha = 0.35;
      this.ctx.fillStyle = player.gravityDirection === 1 ? '#38bdf8' : '#fbbf24';
      this.ctx.beginPath();
      this.ctx.arc(player.x - 22, player.y - player.vy * 1.5, 30, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    this.ctx.translate(player.x, player.y);
    this.ctx.rotate(player.rotation);

    // Invulnerability flashing
    if (player.invulnerableTime > 0 && Math.floor(player.invulnerableTime * 15) % 2 === 0) {
      this.ctx.globalAlpha = 0.5;
    }

    // Outer subtle glowing aura
    const aura = this.ctx.createRadialGradient(0, 0, 24, 0, 0, 42);
    aura.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    aura.addColorStop(1, 'rgba(56, 189, 248, 0)');
    this.ctx.fillStyle = aura;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 42, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw the rotating oval image
    const size = 68;
    if (this.faceImg && this.faceImgLoaded) {
      this.ctx.drawImage(this.faceImg, -size / 2, -size / 2, size, size);
    } else {
      // Fallback
      this.ctx.fillStyle = '#b47348';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  // Draw floating particles (feathers, sparkles, gravity shockwaves)
  public drawParticles(particles: Particle[]) {
    this.ctx.save();

    for (const p of particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      this.ctx.save();
      this.ctx.globalAlpha = alpha;

      if (p.type === 'ORB_RING') {
        // Expanding circular shockwave
        const r = p.size * (1 - alpha * 0.5 + 0.5);
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = 4 * alpha;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        this.ctx.stroke();
      } else if (p.type === 'FEATHER') {
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation || 0);
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'SPARKLE') {
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    this.ctx.restore();
  }
}
