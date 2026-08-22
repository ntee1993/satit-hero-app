'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'satit_hero_stars'

export function useGameProgress() {
  const [stars, setStars] = useState(0)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setStars(parseInt(saved, 10) || 0)
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e)
    }
  }, [])

  const addStar = useCallback(() => {
    setStars((prev) => {
      const next = prev + 1
      try {
        localStorage.setItem(STORAGE_KEY, next.toString())
      } catch (e) {
        console.warn('Could not save to localStorage', e)
      }
      return next
    })
  }, [])

  const level = Math.floor(stars / 5) + 1
  const expProgress = (stars % 5) * 20

  return {
    stars,
    level,
    expProgress,
    addStar
  }
}
