import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** ルート遷移時に各ページへ共通のフェード+わずかな上下動を与えるラッパー */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
