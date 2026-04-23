"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type Tag = "h1" | "h2" | "h3" | "h4"

interface RevealWordsProps {
  children: string
  className?: string
  as?: Tag
  /** Delay between each word in seconds (default 0.07) */
  stagger?: number
  /** Extra delay before the first word (default 0) */
  delay?: number
}

/**
 * Splits text into words and reveals them with a staggered slide-up.
 * Replace static <motion.h2 whileInView> patterns with this for a more
 * expressive entrance without adding extra markup.
 */
export function RevealWords({
  children,
  className,
  as: Tag = "h2",
  stagger = 0.07,
  delay = 0,
}: RevealWordsProps) {
  const words = children.split(" ")

  return (
    <Tag className={cn("", className)}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ marginRight: "0.28em" }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{
              duration: 0.5,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
