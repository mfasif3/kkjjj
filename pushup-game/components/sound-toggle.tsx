"use client"

import { useState, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"
import gameSounds from "@/utils/sounds"

export default function SoundToggle() {
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    // Set initial mute state
    setMuted(gameSounds.isMuted())
  }, [])

  const toggleMute = () => {
    const newMutedState = gameSounds.toggleMute()
    setMuted(newMutedState)
  }

  return (
    <button
      onClick={toggleMute}
      className="absolute top-4 right-4 z-20 bg-[#4a148c] hover:bg-[#9d4edd] p-3 rounded-full text-white transition-colors duration-300 shadow-lg border border-[#9d4edd]"
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
    >
      {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
    </button>
  )
}

