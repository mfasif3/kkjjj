"use client"

import { useEffect } from "react"
import gameSounds from "@/utils/sounds"

// This component doesn't render anything visible
// It just ensures the background music is properly loaded
export default function BackgroundMusicLoader() {
  useEffect(() => {
    // This will be called when the component mounts
    // The actual music loading happens in the gameSounds.init() method

    // You could add additional logic here if needed
    // For example, to handle different music tracks

    return () => {
      // Clean up when component unmounts
      gameSounds.stopBackgroundMusic()
    }
  }, [])

  // This component doesn't render anything visible
  return null
}

