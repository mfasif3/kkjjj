"use client"

import { useState, useEffect } from "react"
import gameSounds from "@/utils/sounds"

export default function AudioInitializer() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Initialize sounds
    gameSounds.init()

    // Check if we need to show the initializer
    const handleUserInteraction = () => {
      if (!initialized) {
        gameSounds.startBackgroundMusic()
        setInitialized(true)

        // Remove event listeners once initialized
        document.removeEventListener("click", handleUserInteraction)
        document.removeEventListener("keydown", handleUserInteraction)
        document.removeEventListener("touchstart", handleUserInteraction)
      }
    }

    // Add event listeners for user interaction
    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("keydown", handleUserInteraction)
    document.addEventListener("touchstart", handleUserInteraction)

    return () => {
      // Clean up event listeners
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }
  }, [initialized])

  // This component doesn't render anything if already initialized
  if (initialized) return null

  // Show a simple overlay to encourage user interaction
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer"
      onClick={() => setInitialized(true)}
    >
      <div className="text-center p-8 bg-[#4a148c] rounded-xl shadow-lg border-2 border-[#9d4edd]">
        <h2 className="text-2xl font-bold text-white mb-4">Growgen Pushup Minigame</h2>
        <p className="text-white mb-6">Click anywhere to start with sound</p>
        <div className="animate-pulse text-[#ffd700] text-xl">▶ TAP TO PLAY ▶</div>
      </div>
    </div>
  )
}

