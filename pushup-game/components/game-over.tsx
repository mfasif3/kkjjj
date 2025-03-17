"use client"

interface GameOverProps {
  score: number
  highScore: number
  pushups: number
  onPlayAgain: () => void
  onBackToMenu: () => void
}

export default function GameOver({ score, highScore, pushups, onPlayAgain, onBackToMenu }: GameOverProps) {
  return (
    <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-white text-center w-4/5 bg-black/90 p-6 rounded-2xl shadow-lg border border-[#9d4edd] z-20">
      <div className="mb-4 text-[#9d4edd]">⏳ TIME'S UP ⏳</div>
      <div className="text-3xl mb-2 text-[#4ecdc4]">{score} XP</div>
      <div className="text-xl text-[#ff6b6b]">Highest: {highScore}</div>
      <div className="text-xl text-[#ffd700]">Push-ups: {pushups}</div>
      <div className="my-6 text-2xl text-[#ffd700]">Great job! Now do 5 kneeling push-ups for real!</div>
      <div className="flex justify-center gap-4">
        <button className="px-5 py-2.5 bg-[#9d4edd] text-white rounded-lg text-xl" onClick={onPlayAgain}>
          Play Again
        </button>
        <button className="px-5 py-2.5 bg-[#9d4edd] text-white rounded-lg text-xl" onClick={onBackToMenu}>
          Back to Menu
        </button>
      </div>
    </div>
  )
}

