"use client"
import PushupGame from "@/components/pushup-game"
import AudioInitializer from "@/components/audio-initializer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1a082a] overflow-hidden">
      <AudioInitializer />
      <PushupGame />
    </main>
  )
}

