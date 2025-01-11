class AudioManager {
  private backgroundMusic: HTMLAudioElement | null = null;
  private jumpSound: HTMLAudioElement | null = null;
  private gameOverSound: HTMLAudioElement | null = null;
  private initialized: boolean = false;

  constructor() {
    // Defer audio initialization until preloadAudio is called
  }

  playBackgroundMusic() {
    if (!this.backgroundMusic || !this.initialized) return;
    this.backgroundMusic.play()
      .catch((error) => console.log("Audio play failed:", error));
  }

  stopBackgroundMusic() {
    if (!this.backgroundMusic || !this.initialized) return;
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  }

  playJumpSound() {
    if (!this.jumpSound || !this.initialized) return;
    this.jumpSound.currentTime = 0; // Reset sound to start
    this.jumpSound
      .play()
      .catch((error) => console.log("Audio play failed:", error));
  }

  playGameOverSound() {
    if (!this.gameOverSound || !this.initialized) return;
    this.gameOverSound
      .play()
      .catch((error) => console.log("Audio play failed:", error));
    this.stopBackgroundMusic();
  }

  setMuted(muted: boolean) {
    if (!this.initialized) return;
    const volume = muted ? 0 : 0.5;
    if (this.backgroundMusic) this.backgroundMusic.volume = volume;
    if (this.jumpSound) this.jumpSound.volume = volume;
    if (this.gameOverSound) this.gameOverSound.volume = volume;
  }

  async preloadAudio() {
    if (this.initialized) return;
    
    try {
      const [backgroundUrl, jumpUrl, gameOverUrl] = await Promise.all([
        loadAudioFromS3('gamemusic.mp3'),
        loadAudioFromS3('jump.mp3'),
        loadAudioFromS3('gamefail.mp3')
      ]);

      this.backgroundMusic = new Audio(backgroundUrl);
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = 0.5;
      this.jumpSound = new Audio(jumpUrl);
      this.gameOverSound = new Audio(gameOverUrl);

      await Promise.all([
        this.backgroundMusic.load(),
        this.jumpSound.load(),
        this.gameOverSound.load(),
      ]);

      this.initialized = true;
      console.log("Audio files preloaded successfully");
    } catch (error) {
      console.error("Error preloading audio:", error);
    }
  }

  isInitialized() {
    return this.initialized;
  }
}

import { loadAudioFromS3 } from './s3AudioLoader';

export const audioManager = new AudioManager();
