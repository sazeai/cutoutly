"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'

interface AutoImageSwiperProps {
  images: string[]
  cardWidth?: number
  cardHeight?: number
  autoPlayInterval?: number
  className?: string
}

export const AutoImageSwiper: React.FC<AutoImageSwiperProps> = ({
  images,
  cardWidth = 320,
  cardHeight = 400,
  autoPlayInterval = 3000,
  className = ''
}) => {
  const cardStackRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const [cardOrder, setCardOrder] = useState<number[]>(() =>
    Array.from({ length: images.length }, (_, i) => i)
  )

  const getDurationFromCSS = useCallback((
    variableName: string,
    element?: HTMLElement | null
  ): number => {
    const targetElement = element || document.documentElement
    const value = getComputedStyle(targetElement)
      ?.getPropertyValue(variableName)
      ?.trim()
    if (!value) return 300
    if (value.endsWith("ms")) return parseFloat(value)
    if (value.endsWith("s")) return parseFloat(value) * 1000
    return parseFloat(value) || 300
  }, [])

  const getCards = useCallback((): HTMLElement[] => {
    if (!cardStackRef.current) return []
    return [...cardStackRef.current.querySelectorAll('.image-card')] as HTMLElement[]
  }, [])

  const getActiveCard = useCallback((): HTMLElement | null => {
    const cards = getCards()
    return cards[0] || null
  }, [getCards])

  const updatePositions = useCallback(() => {
    const cards = getCards()
    cards.forEach((card, i) => {
      card.style.setProperty('--i', (i + 1).toString())
      card.style.setProperty('--swipe-x', '0px')
      card.style.setProperty('--swipe-rotate', '0deg')
      card.style.opacity = '1'
    })
  }, [getCards])

  const autoSwipe = useCallback(() => {
    const duration = getDurationFromCSS('--card-swap-duration', cardStackRef.current)
    const card = getActiveCard()

    if (card) {
      card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`
      card.style.setProperty('--swipe-x', '300px')
      card.style.setProperty('--swipe-rotate', '20deg')

      setTimeout(() => {
        if (getActiveCard() === card) {
          card.style.setProperty('--swipe-rotate', '-20deg')
        }
      }, duration * 0.5)

      setTimeout(() => {
        setCardOrder(prev => {
          if (prev.length === 0) return []
          return [...prev.slice(1), prev[0]]
        })
      }, duration)
    }
  }, [getDurationFromCSS, getActiveCard])

  // Auto-play functionality
  useEffect(() => {
    if (autoPlayInterval > 0) {
      autoPlayRef.current = setInterval(autoSwipe, autoPlayInterval)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [autoSwipe, autoPlayInterval])

  useEffect(() => {
    updatePositions()
  }, [cardOrder, updatePositions])

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
  }

  const handleMouseLeave = () => {
    if (autoPlayInterval > 0) {
      autoPlayRef.current = setInterval(autoSwipe, autoPlayInterval)
    }
  }

  return (
    <section
      className={`relative grid place-content-center select-none ${className}`}
      ref={cardStackRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: cardWidth + 32,
        height: cardHeight + 32,
        touchAction: 'none',
        transformStyle: 'preserve-3d',
        '--card-perspective': '700px',
        '--card-z-offset': '12px',
        '--card-y-offset': '7px',
        '--card-max-z-index': images.length.toString(),
        '--card-swap-duration': '0.6s',
      } as React.CSSProperties}
    >
      {cardOrder.map((originalIndex, displayIndex) => (
        <article
          key={`${images[originalIndex]}-${originalIndex}`}
          className="image-card absolute place-self-center border-2 border-black rounded-2xl
                     shadow-[8px_8px_0_rgba(0,0,0,1)] overflow-hidden will-change-transform"
          style={{
            '--i': (displayIndex + 1).toString(),
            zIndex: images.length - displayIndex,
            width: cardWidth,
            height: cardHeight,
            transform: `perspective(var(--card-perspective))
                       translateZ(calc(-1 * var(--card-z-offset) * var(--i)))
                       translateY(calc(var(--card-y-offset) * var(--i)))
                       translateX(var(--swipe-x, 0px))
                       rotateY(var(--swipe-rotate, 0deg))`
          } as React.CSSProperties}
        >
          <img
            src={images[originalIndex] || "/placeholder.svg"}
            alt={`AI generated example ${originalIndex + 1}`}
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
          />
        </article>
      ))}
    </section>
  )
}
