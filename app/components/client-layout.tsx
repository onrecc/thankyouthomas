"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 50) // Brief loading state to ensure smooth transition

    return () => clearTimeout(timer)
  }, [pathname])

  const pageVariants = {
    initial: {
      opacity: 0,
      x: 100
    },
    in: {
      opacity: 1,
      x: 0
    },
    out: {
      opacity: 0,
      x: -100
    }
  }

  const pageTransition = {
    type: "tween" as const,
    ease: [0.25, 0.1, 0.25, 1] as const,
    duration: 0.4
  }

  return (
    <div style={{ backgroundColor: "#E8D5C4", minHeight: "100vh" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          style={{ 
            backgroundColor: "#E8D5C4",
            minHeight: "100vh"
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
