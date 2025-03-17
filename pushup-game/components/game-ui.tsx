"use client"

import { useState, useEffect } from "react"

interface GameUIProps {
  time: number
  score: number
  highScore: number
  comboChain: number
  comboMultiplier: number
  rawPushups: number
  targetPushups: number
  onCharacterClick: () => void
  showAirdrop: boolean
}

export default function GameUI({
  time,
  score,
  highScore,
  comboChain,
  comboMultiplier,
  rawPushups,
  targetPushups,
  onCharacterClick,
  showAirdrop,
}: GameUIProps) {
  const [showComboText, setShowComboText] = useState(false)
  const [lastPushups, setLastPushups] = useState(0)

  useEffect(() => {
    if (comboMultiplier > 1.0 && comboChain > lastPushups) {
      setShowComboText(true)
      setTimeout(() => setShowComboText(false), 500)
    }
    setLastPushups(comboChain)
  }, [comboChain, comboMultiplier])

  const getCharacterColor = () => {
    const colors = {
      "1.0": "#6a2c8e",
      "1.2": "#2c6a8e",
      "1.5": "#27ae60",
      "2.0": "#ffd700",
    }
    const key = comboMultiplier.toFixed(1) as keyof typeof colors
    return colors[key] || "#6a2c8e"
  }

  return (
    <>
      <div
        className={`absolute top-[60px] left-1/2 -translate-x-1/2 text-5xl text-white bg-black/85 px-6 py-4 rounded-2xl border-2 border-white z-10 ${time <= 5 ? "animate-pulse text-red-500" : ""}`}
      >
        Time: {time}
      </div>

      <div className="absolute top-[160px] left-1/2 -translate-x-1/2 flex gap-8 bg-black/80 px-6 py-3 rounded-xl shadow-lg text-white border border-[#6a2c8e] z-10">
        <div className="text-3xl font-bold text-[#9d4edd]">XP: {score}</div>
        <div className="text-2xl font-bold text-[#4ecdc4]">Highest: {highScore}</div>
        <div className="text-2xl font-bold text-[#ffd700]">
          Combo: {comboChain} (x{comboMultiplier.toFixed(1)})
        </div>
      </div>

      <div className="absolute top-[250px] left-1/2 -translate-x-1/2 text-2xl text-white z-10">
        Push-ups: {rawPushups} / {targetPushups}
      </div>

      <div className="absolute top-[280px] left-1/2 -translate-x-1/2 w-4/5 h-5 bg-[#333] border border-white rounded-lg overflow-hidden z-10">
        <div
          className="h-full bg-[#27ae60] transition-all duration-300"
          style={{ width: `${Math.min((rawPushups / targetPushups) * 100, 100)}%` }}
        ></div>
      </div>

      <div
        className={`w-[120px] h-[120px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[20px] shadow-lg transition-all duration-200 border-2 border-[#9d4edd] z-10 ${rawPushups >= 10 ? "brightness-90" : ""}`}
        style={{ backgroundColor: getCharacterColor() }}
        onClick={onCharacterClick}
      ></div>

      {showComboText && (
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-[#ff6b6b] font-bold animate-bounce z-20">
          x{comboMultiplier.toFixed(1)}!
        </div>
      )}

      {showAirdrop && (
        <>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute -top-5 text-2xl text-[#ffd700] font-bold z-20"
              style={{
                left: `${Math.random() * 100}%`,
                animation: "fall 2s ease-out forwards",
              }}
            >
              +XP
            </div>
          ))}
        </>
      )}
    </>
  )
}

