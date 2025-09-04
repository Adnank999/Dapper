"use client"

import { useEffect, useState } from "react"
import { MotionValue, motion, useSpring, useTransform } from "motion/react"

interface AnimatedNumberProps {
  value: number | string // Allow value to be either number or string
  mass?: number
  stiffness?: number
  damping?: number
  precision?: number
  format?: (value: number) => string
  onAnimationStart?: () => void
  onAnimationComplete?: () => void
}

export function AnimatedNumber({
  value,
  mass = 0.8,
  stiffness = 75,
  damping = 15,
  precision = 0,
  format = (num) => num.toLocaleString(), // default format includes commas
  onAnimationStart,
  onAnimationComplete,
}: AnimatedNumberProps) {
  // State to trigger animation only when in view
  const [hasAnimated, setHasAnimated] = useState(false)

  // Normalize the value to a number (if it's a string)
  const normalizedValue = typeof value === "string" ? parseFloat(value.replace(/,/g, '')) : value

  // Create spring for animation
  const spring = useSpring(0, { mass, stiffness, damping })

  // Update the spring value when the value changes
  useEffect(() => {
    if (hasAnimated) {
      spring.set(normalizedValue)
      if (onAnimationStart) onAnimationStart()

      const unsubscribe = spring.on("change", () => {
        if (spring.get() === normalizedValue && onAnimationComplete) {
          onAnimationComplete()
        }
      })

      return () => unsubscribe()
    }
  }, [spring, normalizedValue, hasAnimated, onAnimationStart, onAnimationComplete])

  // Transform spring value to formatted string with precision, without commas
  const display: MotionValue<string> = useTransform(spring, (current) =>
    format(parseFloat(current.toFixed(precision))).replace(/,/g, '') // Remove commas from formatted string
  )

  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{
        opacity: 1,
        transition: { duration: 0.5 },
      }}
      onAnimationComplete={() => setHasAnimated(true)}
      className="text-4xl mr-4 font-pp-edit-ultra-bold leading-5 tracking-wide"
    >
      {display}
    </motion.span>
  )
}
