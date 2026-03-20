'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
}

/**
 * Intersection Observer + Framer Motion 결합 컴포넌트.
 * 뷰포트에 들어올 때 fade + slide-up 등장.
 * once: true → 한 번 등장하면 다시 사라지지 않음 (성능 최적화).
 */
export default function FadeInSection({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
