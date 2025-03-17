"use client"

import { useState } from "react"

interface GameMenuProps {
  highScore: number
  onPlay: () => void
}

export default function GameMenu({ highScore, onPlay }: GameMenuProps) {
  const [selectedGame, setSelectedGame] = useState<"pushup" | "squat">("pushup")

  const handleGameSelect = (game: "pushup" | "squat") => {
    if (game === "squat") {
      alert("This feature is coming soon!")
      return
    }
    setSelectedGame(game)
  }

  return (
    <div className="absolute top-[50px] left-1/2 -translate-x-1/2 text-center text-white z-10 bg-black/80 p-5 rounded-lg shadow-lg">
      <h2 className="text-xl mb-4">Select a Game</h2>
      <div className="flex justify-center gap-5 mb-5">
        <div
          className={`px-5 py-2.5 bg-[#4a148c] rounded cursor-pointer ${selectedGame === "pushup" ? "bg-[#9d4edd]" : ""}`}
          onClick={() => handleGameSelect("pushup")}
        >
          Push-up Game
        </div>
        <div
          className="px-5 py-2.5 bg-[#4a148c] rounded opacity-50 cursor-not-allowed"
          onClick={() => handleGameSelect("squat")}
        >
          Squat Game (Coming Soon)
        </div>
      </div>
      <div className="mt-5 text-xl">Highest Score: {highScore}</div>
      <button className="mt-4 px-5 py-2.5 bg-[#9d4edd] rounded text-white" onClick={onPlay}>
        Play
      </button>
    </div>
  )
}

