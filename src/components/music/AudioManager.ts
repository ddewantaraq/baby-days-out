class AudioManager {
  private backgroundMusic: HTMLAudioElement;
  private jumpSound: HTMLAudioElement;
  private gameOverSound: HTMLAudioElement;

  constructor() {
    this.backgroundMusic = new Audio("/sounds/gamemusic.mp3");
    this.jumpSound = new Audio("/sounds/jump.mp3");
    this.gameOverSound = new Audio("/sounds/gamefail.mp3");

    // Configure background music
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.5; // Adjust volume as needed
  }

  playBackgroundMusic() {
    this.backgroundMusic
      .play()
      .catch((error) => console.log("Audio play failed:", error));
  }

  stopBackgroundMusic() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  }

  playJumpSound() {
    this.jumpSound.currentTime = 0; // Reset sound to start
    this.jumpSound
      .play()
      .catch((error) => console.log("Audio play failed:", error));
  }

  playGameOverSound() {
    this.gameOverSound
      .play()
      .catch((error) => console.log("Audio play failed:", error));
    this.stopBackgroundMusic();
  }

  setMuted(muted: boolean) {
    const volume = muted ? 0 : 0.5;
    this.backgroundMusic.volume = volume;
    this.jumpSound.volume = volume;
    this.gameOverSound.volume = volume;
  }

  async preloadAudio() {
    try {
      await Promise.all([
        this.backgroundMusic.load(),
        this.jumpSound.load(),
        this.gameOverSound.load(),
      ]);
      console.log("Audio files preloaded successfully");
    } catch (error) {
      console.error("Error preloading audio:", error);
    }
  }
}

export const audioManager = new AudioManager();
