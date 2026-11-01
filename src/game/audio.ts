/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class VoiceOverMusicPlayer {
  private ctx: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isLoading = false;
  private isDecoded = false;
  private shouldBePlaying = false;

  constructor() {
    this.preload();
  }

  public preload() {
    if (typeof window === 'undefined') return;

    // 1. Create HTMLAudioElement fallback
    if (!this.audioElement) {
      try {
        this.audioElement = new Audio('/assets/aistudio/voice_over_0a7fceec.mp3');
        this.audioElement.loop = true;
        this.audioElement.volume = 1.0;
        this.audioElement.preload = 'auto';
      } catch (e) {
        console.warn('HTMLAudioElement init:', e);
      }
    }

    // 2. Pre-fetch and decode into Web Audio PCM buffer
    if (!this.audioBuffer && !this.isLoading) {
      this.isLoading = true;
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        try {
          this.ctx = new AudioCtxClass();
          this.gainNode = this.ctx.createGain();
          this.gainNode.gain.value = 1.0;
          this.gainNode.connect(this.ctx.destination);

          fetch('/assets/aistudio/voice_over_0a7fceec.mp3')
            .then(res => res.arrayBuffer())
            .then(buf => this.ctx!.decodeAudioData(buf))
            .then(decoded => {
              this.audioBuffer = decoded;
              this.isDecoded = true;
              this.isLoading = false;
              if (this.shouldBePlaying) {
                this.playWebAudio();
              }
            })
            .catch(err => {
              console.warn('Web Audio decode failed:', err);
              this.isLoading = false;
            });
        } catch (e) {
          this.isLoading = false;
        }
      }
    }
  }

  public play() {
    this.shouldBePlaying = true;
    this.stopAudio();

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (this.isDecoded && this.audioBuffer) {
      this.playWebAudio();
    } else if (this.audioElement) {
      this.audioElement.currentTime = 0;
      this.audioElement.volume = 1.0;
      this.audioElement.loop = true;
      this.audioElement.play().catch(e => {
        console.warn('AudioElement play catch:', e);
      });
    }
  }

  private playWebAudio() {
    if (!this.ctx || !this.audioBuffer || !this.gainNode) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      }

      const src = this.ctx.createBufferSource();
      src.buffer = this.audioBuffer;
      src.loop = true;
      src.connect(this.gainNode);
      src.start(0);
      this.sourceNode = src;
    } catch (e) {
      console.warn('playWebAudio error:', e);
    }
  }

  public stop() {
    this.shouldBePlaying = false;
    this.stopAudio();
  }

  private stopAudio() {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop(0);
        this.sourceNode.disconnect();
      } catch (e) {}
      this.sourceNode = null;
    }
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch (e) {}
    }
  }

  public pause() {
    this.stop();
  }

  public resume() {
    this.play();
  }
}

class GameOverDialoguePlayer {
  private ctx: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isDecoded = false;

  constructor() {
    this.preload();
  }

  public preload() {
    if (typeof window === 'undefined') return;

    if (!this.audioElement) {
      try {
        this.audioElement = new Audio('/assets/aistudio/Chee_Navutunava_kadu_Singham_surya_dialogue_-_Telugu_babu__ef3d35ac.mp3');
        this.audioElement.volume = 1.0;
        this.audioElement.preload = 'auto';
      } catch (e) {}
    }

    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass && !this.audioBuffer) {
      try {
        this.ctx = new AudioCtxClass();
        fetch('/assets/aistudio/Chee_Navutunava_kadu_Singham_surya_dialogue_-_Telugu_babu__ef3d35ac.mp3')
          .then(res => res.arrayBuffer())
          .then(buf => this.ctx!.decodeAudioData(buf))
          .then(decoded => {
            this.audioBuffer = decoded;
            this.isDecoded = true;
          })
          .catch(() => {});
      } catch (e) {}
    }
  }

  public play() {
    this.stop();

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (this.isDecoded && this.audioBuffer && this.ctx) {
      try {
        const src = this.ctx.createBufferSource();
        src.buffer = this.audioBuffer;
        src.connect(this.ctx.destination);
        src.start(0);
        this.sourceNode = src;
        return;
      } catch (e) {}
    }

    if (this.audioElement) {
      try {
        this.audioElement.currentTime = 0;
        this.audioElement.volume = 1.0;
        this.audioElement.play().catch(() => {});
      } catch (e) {}
    }
  }

  public stop() {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop(0);
        this.sourceNode.disconnect();
      } catch (e) {}
      this.sourceNode = null;
    }
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch (e) {}
    }
  }
}

class SoundEngine {
  public playFlip() {}
  public playCluck() {}
  public playOrb() {}
  public playEgg() {}
  public playHit() {}
  public playScore() {}
  public startMusic() {}
  public stopMusic() {}
  public setSoundVolume() {}
  public setMusicVolume() {}
  public playVoiceOver() {
    bgm.play();
  }
  public pauseVoiceOver() {
    bgm.pause();
  }
  public stopVoiceOver() {
    bgm.stop();
  }
}

export const bgm = new VoiceOverMusicPlayer();
export const gameOverDialogue = new GameOverDialoguePlayer();
export const sounds = new SoundEngine();
