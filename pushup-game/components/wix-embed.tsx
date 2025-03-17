"use client"

import { useEffect } from "react"
import PushupGame from "./pushup-game"

export default function WixEmbed() {
  useEffect(() => {
    // Prevent scrolling on the parent page when interacting with the game
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="wix-embed-container" style={{ width: "100%", height: "100%", minHeight: "600px" }}>
      <PushupGame />
    </div>
  )
}

