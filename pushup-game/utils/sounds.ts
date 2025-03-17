class GameSounds {
  private sounds: Record<string, HTMLAudioElement> = {}
  private backgroundMusic: HTMLAudioElement | null = null
  private muted = false

  constructor() {
    // Initialize with default mute setting from localStorage if available
    if (typeof window !== "undefined") {
      const savedMute = localStorage.getItem("gameSoundsMuted")
      this.muted = savedMute === "true"
    }
  }

  init() {
    this.sounds = {
      click: new Audio("/sounds/click.mp3"),
      combo: new Audio("/sounds/combo.mp3"),
      airdrop: new Audio("/sounds/airdrop.mp3"), // Using the airdrop sound file
      gameOver: new Audio("/sounds/game-over.mp3"),
      countdown: new Audio("/sounds/countdown.mp3"),
      start: new Audio("/sounds/start.mp3"),
    }

    // Setup background music if available
    if (typeof window !== "undefined") {
      this.backgroundMusic = new Audio("/sounds/background-music.mp3")
      this.backgroundMusic.loop = true
      this.backgroundMusic.volume = 0.5 // Lower volume for background music
      this.backgroundMusic.load()
    }

    // Preload all sounds
    Object.values(this.sounds).forEach((sound) => {
      sound.load()
    })
  }

  play(soundName: string) {
    if (this.muted || !this.sounds[soundName]) return

    // Stop the sound if it's already playing
    this.sounds[soundName].pause()
    this.sounds[soundName].currentTime = 0

    // Play the sound
    this.sounds[soundName].play().catch((e) => {
      console.log("Audio play error:", e)
    })
  }

  startBackgroundMusic() {
    if (this.muted || !this.backgroundMusic) return

    this.backgroundMusic.play().catch((e) => {
      console.log("Background music play error:", e)
      // Some browsers require user interaction before playing audio
      // We'll handle this gracefully
    })
  }

  stopBackgroundMusic() {
    if (!this.backgroundMusic) return

    this.backgroundMusic.pause()
    this.backgroundMusic.currentTime = 0
  }

  pauseBackgroundMusic() {
    if (!this.backgroundMusic) return

    this.backgroundMusic.pause()
  }

  resumeBackgroundMusic() {
    if (this.muted || !this.backgroundMusic) return

    this.backgroundMusic.play().catch((e) => {
      console.log("Background music resume error:", e)
    })
  }

  toggleMute() {
    this.muted = !this.muted

    // Handle background music
    if (this.backgroundMusic) {
      if (this.muted) {
        this.backgroundMusic.pause()
      } else {
        this.backgroundMusic.play().catch((e) => {
          console.log("Background music play error after unmute:", e)
        })
      }
    }

    // Save mute preference to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("gameSoundsMuted", this.muted.toString())
    }

    return this.muted
  }

  isMuted() {
    return this.muted
  }
}

// Create a singleton instance
const gameSounds = new GameSounds()

export default gameSounds

