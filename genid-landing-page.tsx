"use client"

import { useState } from "react"
import { Shield, Database, Activity, Gamepad, Lock, Cpu } from "lucide-react"
import { useGlowAnimation } from "@/hooks/use-glow-animation"

import { HeroSection } from "@/components/landing/hero-section"
import FeaturesSection from "@/components/landing/features-section-redesigned"
import { AvatarSection } from "@/components/landing/avatar-section"
import { PremiumCardSection } from "@/components/landing/premium-card-section"
import { Footer } from "@/components/landing/footer"

import type { FeatureData } from "@/types/landing"

import "@/styles/section-transitions.css"

/**
 * Main landing page component for GenID
 * Displays all sections of the landing page
 */
export default function GenIDLanding() {
  const [isFlipped, setIsFlipped] = useState(false)
  const glowAngle = useGlowAnimation(0, 50)

  // Avatar URLs
  const avatarUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-I9hR9vnmnB2hqytE17xmUgH5bo4Isk.png"
  const beforeAvatarUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a_fat_man_with_sport_cloth_kind_of_realistic_avatar_and_his_face_not_very_happy.JPG-5d9IvH5ZJzpe6ZvI0JA90xtBNFVBBa.jpeg"

  const features: FeatureData[] = [
    {
      icon: Shield,
      title: "Secure Storage",
      description: "Your health information is encrypted and securely stored, accessible only with your permission.",
    },
    {
      icon: Database,
      title: "Universal Access",
      description:
        "One card for all your health platforms, games, and services - simplifying your digital health experience.",
    },
    {
      icon: Activity,
      title: "Fitness Tracking",
      description: "Monitor your fitness metrics and access your complete health history anytime, anywhere.",
    },
    {
      icon: Gamepad,
      title: "GrowGen Integration",
      description: "Connect your avatar to the GrowGen world and enhance your virtual fitness experience.",
    },
    {
      icon: Lock,
      title: "Privacy Control",
      description: "You decide who sees your data and when, with privacy controls at your fingertips.",
    },
    {
      icon: Cpu,
      title: "Future Ready",
      description: "Designed for the future of digital fitness with expanding platform integrations.",
    },
  ]

  const benefits = [
    "Secure fitness data storage",
    "Virtual avatar integration",
    "Real-world fitness tracking",
    "Enhanced GrowGen experience",
    "Exclusive member rewards",
    "Cross-platform compatibility",
  ]

  // Handle card flip
  const handleCardFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0118]">
      <HeroSection avatarUrl={avatarUrl} onCardFlip={handleCardFlip} />

      <FeaturesSection features={features} />

      <AvatarSection avatarUrl={beforeAvatarUrl} />

      <PremiumCardSection avatarUrl={avatarUrl} benefits={benefits} />

      <Footer />
    </div>
  )
}
