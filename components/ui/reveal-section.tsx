"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface RevealSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "left" | "right" | "wipe"
  once?: boolean
}

export function RevealSection({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: "-80px" })

  const variants = {
    up: {
      hidden: { opacity: 0, y: 32 },
      visible: { opacity: 1, y: 0 },
    },
    left: {
      hidden: { opacity: 0, x: -32 },
      visible: { opacity: 1, x: 0 },
    },
    right: {
      hidden: { opacity: 0, x: 32 },
      visible: { opacity: 1, x: 0 },
    },
    wipe: {
      hidden: { opacity: 0, clipPath: "inset(0 0 100% 0 round 8px)" },
      visible: { opacity: 1, clipPath: "inset(0 0 0% 0 round 8px)" },
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={variants[direction]}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
