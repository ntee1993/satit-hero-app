'use client'

import { useCallback } from 'react'

export function useSpeech() {
  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = useCallback((text, rate = 0.85) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'th-TH'
    utterance.rate = rate

    window.speechSynthesis.speak(utterance)
  }, [])

  return { speak, cancel }
}
