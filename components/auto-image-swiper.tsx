"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"

interface AutoImageSwiperProps {
  images: string[]
  autoPlayInterval?: number
  className?: string
}

export const AutoImageSwiper: React.FC<AutoImageSwiperProps> = ({
  images,
  autoPlayInterval = 3000,
  className = "",
}) => {
  const cardStackRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const [cardOrder, setCardOrder] = useState<number[]>(() => Array.from({ length: images.length }, (_, i) => i))
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getDurationFromCSS = useCallback(
    (variableName: string, element?: HTMLElement | null): number => {
      if (!isClient) return 600
      const targetElement = element || document.documentElement
      const value = getComputedStyle(targetElement)?.getPropertyValue(variableName)?.trim()
      if (!value) return 600
      if (value.endsWith("ms")) return Number.parseFloat(value)
      if (value.endsWith("s")) return Number.parseFloat(value) * 1000
      return Number.parseFloat(value) || 600
    },
    [isClient],
  )

  const getCards = useCallback((): HTMLElement[] => {
    if (!cardStackRef.current) return []
    return [...cardStackRef.current.querySelectorAll(".image-card")] as HTMLElement[]
  }, [])

  const getActiveCard = useCallback((): HTMLElement | null => {
    const cards = getCards()
    return cards[0] || null
  }, [getCards])

  const updatePositions = useCallback(() => {
    const cards = getCards()
    cards.forEach((card, i) => {
      card.style.setProperty("--i", (i + 1).toString())
      card.style.setProperty("--swipe-x", "0px")
      card.style.setProperty("--swipe-rotate", "0deg")
      card.style.opacity = "1"
    })
  }, [getCards])

  const autoSwipe = useCallback(() => {
    if (!isClient) return

    const duration = getDurationFromCSS("--card-swap-duration", cardStackRef.current)
    const card = getActiveCard()

    if (card) {
      card.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`
      card.style.setProperty("--swipe-x", "200px")
      card.style.setProperty("--swipe-rotate", "15deg")

      setTimeout(() => {
        if (getActiveCard() === card) {
          card.style.setProperty("--swipe-rotate", "-15deg")
        }
      }, duration * 0.4)

      setTimeout(() => {
        setCardOrder((prev) => {
          if (prev.length === 0) return []
          return [...prev.slice(1), prev[0]]
        })
      }, duration)
    }
  }, [getDurationFromCSS, getActiveCard, isClient])

  // Auto-play functionality
  useEffect(() => {
    if (!isClient || autoPlayInterval <= 0) return

    autoPlayRef.current = setInterval(autoSwipe, autoPlayInterval)

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [autoSwipe, autoPlayInterval, isClient])

  useEffect(() => {
    if (isClient) {
      updatePositions()
    }
  }, [cardOrder, updatePositions, isClient])

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
  }

  const handleMouseLeave = () => {
    if (isClient && autoPlayInterval > 0) {
      autoPlayRef.current = setInterval(autoSwipe, autoPlayInterval)
    }
  }

  if (!isClient) {
    return (
      <div className="w-full aspect-[3/4] max-w-xs md:max-w-sm lg:max-w-md mx-auto">
        <div className="w-full h-full border-2 border-black rounded-2xl shadow-[8px_8px_0_rgba(0,0,0,1)] overflow-hidden bg-gray-100 animate-pulse">
          <div className="w-full h-full bg-gray-200"></div>
        </div>
      </div>
    )
  }

  return (
    <section
      className={`relative w-full aspect-[3/4] max-w-xs md:max-w-sm lg:max-w-md mx-auto select-none ${className}`}
      ref={cardStackRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        {
          touchAction: "none",
          transformStyle: "preserve-3d",
          "--card-perspective": "500px",
          "--card-z-offset": "clamp(8px, 2vw, 12px)",
          "--card-y-offset": "clamp(4px, 1vw, 7px)",
          "--card-max-z-index": images.length.toString(),
          "--card-swap-duration": "0.6s",
        } as React.CSSProperties
      }
    >
      {cardOrder.map((originalIndex, displayIndex) => (
        <article
          key={`${images[originalIndex]}-${originalIndex}`}
          className="image-card absolute inset-0 border-2 border-black rounded-2xl
                     shadow-[4px_4px_0_rgba(0,0,0,1)] md:shadow-[6px_6px_0_rgba(0,0,0,1)] lg:shadow-[8px_8px_0_rgba(0,0,0,1)] 
                     overflow-hidden will-change-transform"
          style={
            {
              "--i": (displayIndex + 1).toString(),
              zIndex: images.length - displayIndex,
              transform: `perspective(var(--card-perspective))
                       translateZ(calc(-1 * var(--card-z-offset) * var(--i)))
                       translateY(calc(var(--card-y-offset) * var(--i)))
                       translateX(var(--swipe-x, 0px))
                       rotateY(var(--swipe-rotate, 0deg))`,
            } as React.CSSProperties
          }
        >
          <img
            src={images[originalIndex] || "/placeholder.svg"}
            alt={`AI generated example ${originalIndex + 1}`}
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
            loading={displayIndex < 2 ? "eager" : "lazy"}
          />
        </article>
      ))}
    </section>
  )
}
