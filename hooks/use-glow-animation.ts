"use client"

import { useState, useEffect } from "react"

/**
 * Hook that provides a continuously changing angle for glow effects
 *
 * @param {number} initialAngle - Starting angle in degrees
 * @param {number} interval - Update interval in milliseconds
 * @returns {number} Current angle in degrees
 */
export function useGlowAnimation(initialAngle = 0, interval = 50): number {
  const [angle, setAngle] = useState(initialAngle)

  useEffect(() => {
    const timer = setInterval(() => {
      setAngle((prev) => (prev + 1) % 360)
    }, interval)

    return () => clearInterval(timer)
  }, [interval])

  return angle
}
