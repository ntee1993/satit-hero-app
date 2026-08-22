'use client'

import { useState, useEffect, useCallback } from 'react'

const STARS_KEY = 'satit_hero_stars'
const STATS_KEY = 'satit_hero_analytics'

const INITIAL_STATS = {
  listening: { attempted: 0, correct: 0, wrong: 0 },
  spatial: { attempted: 0, correct: 0, wrong: 0 },
  pattern: { attempted: 0, correct: 0, wrong: 0 },
  simon: { attempted: 0, correct: 0, wrong: 0 },
  streak: 0,
  bestStreak: 0,
  lastUpdated: null
}

export function useGameProgress() {
  const [stars, setStars] = useState(0)
  const [stats, setStats] = useState(INITIAL_STATS)

  // Load progress and analytics from localStorage
  useEffect(() => {
    try {
      const savedStars = localStorage.getItem(STARS_KEY)
      if (savedStars) {
        setStars(parseInt(savedStars, 10) || 0)
      }

      const savedStats = localStorage.getItem(STATS_KEY)
      if (savedStats) {
        setStats(JSON.parse(savedStats))
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e)
    }
  }, [])

  const addStar = useCallback(() => {
    setStars((prev) => {
      const next = prev + 1
      try {
        localStorage.setItem(STARS_KEY, next.toString())
      } catch (e) {
        console.warn('Could not save stars to localStorage', e)
      }
      return next
    })
  }, [])

  const recordAnswer = useCallback((category, isCorrect) => {
    setStats((prev) => {
      const currentCat = prev[category] || { attempted: 0, correct: 0, wrong: 0 }
      const newStreak = isCorrect ? prev.streak + 1 : 0
      const newBestStreak = Math.max(prev.bestStreak || 0, newStreak)

      const updated = {
        ...prev,
        [category]: {
          attempted: currentCat.attempted + 1,
          correct: isCorrect ? currentCat.correct + 1 : currentCat.correct,
          wrong: isCorrect ? currentCat.wrong : currentCat.wrong + 1
        },
        streak: newStreak,
        bestStreak: newBestStreak,
        lastUpdated: new Date().toISOString()
      }

      try {
        localStorage.setItem(STATS_KEY, JSON.stringify(updated))
      } catch (e) {
        console.warn('Could not save analytics to localStorage', e)
      }

      return updated
    })
  }, [])

  const resetStats = useCallback(() => {
    setStats(INITIAL_STATS)
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(INITIAL_STATS))
    } catch (e) {
      console.warn('Could not reset analytics in localStorage', e)
    }
  }, [])

  const level = Math.floor(stars / 5) + 1
  const expProgress = (stars % 5) * 20

  return {
    stars,
    level,
    expProgress,
    stats,
    addStar,
    recordAnswer,
    resetStats
  }
}
