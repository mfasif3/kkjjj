"use client"

import { useState, useEffect, useRef } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import GameMenu from "./game-menu"
import GameUI from "./game-ui"
import GameOver from "./game-over"
import gameSounds from "@/utils/sounds"
import SoundToggle from "./sound-toggle"

export default function PushupGame() {
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(30)
  const [highScore, setHighScore] = useLocalStorage("mgenHighScore", 0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [comboChain, setComboChain] = useState(0)
  const [comboMultiplier, setComboMultiplier] = useState(1.0)
  const [rawPushups, setRawPushups] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [showMenu, setShowMenu] = useState(true)
  const [showAirdrop, setShowAirdrop] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const targetPushups = 100
  const normalWindow = 120
  const idealMin = 200
  const idealMax = 240

  // Initialize sounds when component mounts
  useEffect(() => {
    gameSounds.init()

    // Start background music when component mounts
    gameSounds.startBackgroundMusic()

    // Clean up when component unmounts
    return () => {
      gameSounds.stopBackgroundMusic()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && isPlaying && !e.repeat) {
        handleInput()
        e.preventDefault()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isPlaying, isProcessing, lastClickTime, comboChain, rawPushups, score])

  useEffect(() => {
    if (time <= 0 && isPlaying) {
      endGame()
    }
  }, [time, isPlaying])

  // Handle visibility change (pause music when tab is not visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        gameSounds.pauseBackgroundMusic()
      } else {
        if (!gameSounds.isMuted()) {
          gameSounds.resumeBackgroundMusic()
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Check if we've reached the target pushups
  useEffect(() => {
    if (rawPushups >= targetPushups && !showAirdrop) {
      setShowAirdrop(true)
      gameSounds.play("airdrop")

      // Reset the airdrop flag after animation completes
      setTimeout(() => {
        setShowAirdrop(false)
      }, 2000)
    }
  }, [rawPushups, showAirdrop])

  const computeMultiplier = () => {
    if (rawPushups < 10) return 1.0
    if (comboChain === 1) return 1.0
    if (comboChain >= 2 && comboChain < 5) return 1.2
    if (comboChain >= 5 && comboChain < 10) return 1.5
    if (comboChain >= 10) return 2.0
    return 1.0
  }

  const startGame = () => {
    resetGame()
    gameSounds.play("start")
    setIsPlaying(true)
    setShowMenu(false)
    setShowGameOver(false)
    startTimer()
  }

  const resetGame = () => {
    setScore(0)
    setTime(30)
    setComboChain(0)
    setComboMultiplier(1.0)
    setLastClickTime(0)
    setRawPushups(0)
    setShowAirdrop(false)
  }

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setTime((prevTime) => {
        const newTime = prevTime - 1
        if (newTime <= 5 && newTime > 0) {
          gameSounds.play("countdown")
        }
        return newTime
      })
    }, 1000)
  }

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsPlaying(false)
    gameSounds.play("gameOver")

    if (score > highScore) {
      setHighScore(Math.floor(score))
    }

    setShowGameOver(true)
  }

  const backToMenu = () => {
    setShowGameOver(false)
    setShowMenu(true)
  }

  const handleInput = () => {
    if (!isPlaying || isProcessing) return
    setIsProcessing(true)
    gameSounds.play("click")

    const now = Date.now()
    const timeDiff = now - lastClickTime

    setRawPushups((prev) => prev + 1)

    if (rawPushups < 10) {
      if (timeDiff < normalWindow) {
        setComboChain((prev) => prev + 1)
      } else {
        setComboChain(1)
      }
    } else {
      if (timeDiff >= idealMin && timeDiff <= idealMax) {
        setComboChain((prev) => prev + 1)
      } else {
        setComboChain(1)
      }
    }

    const newMultiplier = computeMultiplier()
    setComboMultiplier(newMultiplier)

    if (newMultiplier > 1.0) {
      gameSounds.play("combo")
    }

    const baseXP = rawPushups >= 100 ? 1.5 : 1.0
    setScore((prev) => prev + baseXP * newMultiplier)

    setLastClickTime(now)

    setTimeout(() => {
      setIsProcessing(false)
    }, 50)
  }

  return (
    <div className="relative w-full h-screen">
      <SoundToggle />
      <div className="absolute top-10 w-full text-center text-white font-bold text-2xl z-10">
        Growgen Pushup Minigame
      </div>

      {showMenu && <GameMenu highScore={highScore} onPlay={startGame} />}

      {isPlaying && (
        <GameUI
          time={time}
          score={Math.floor(score)}
          highScore={highScore}
          comboChain={comboChain}
          comboMultiplier={comboMultiplier}
          rawPushups={rawPushups}
          targetPushups={targetPushups}
          onCharacterClick={handleInput}
          showAirdrop={showAirdrop}
        />
      )}

      {showGameOver && (
        <GameOver
          score={Math.floor(score)}
          highScore={highScore}
          pushups={rawPushups}
          onPlayAgain={startGame}
          onBackToMenu={backToMenu}
        />
      )}
    </div>
  )
}

