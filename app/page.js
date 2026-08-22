'use client'

import { useState, useEffect, useCallback } from 'react'
import HudBar from '@/components/ui/HudBar'
import FeedbackModal from '@/components/ui/FeedbackModal'
import CategorySelector from '@/components/games/CategorySelector'
import ListeningGame from '@/components/games/ListeningGame'
import SpatialGame from '@/components/games/SpatialGame'
import PatternGame from '@/components/games/PatternGame'
import SimonGame from '@/components/games/SimonGame'
import { useSpeech } from '@/hooks/useSpeech'
import { useGameProgress } from '@/hooks/useGameProgress'
import { soundEffects } from '@/lib/sound'

export default function SatitPrepApp() {
  const { stars, level, expProgress, addStar } = useGameProgress()
  const { speak, cancel: cancelSpeech } = useSpeech()

  const [currentCategory, setCurrentCategory] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [simonInput, setSimonInput] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Reset Simon input whenever question or category changes
  useEffect(() => {
    setSimonInput([])
  }, [currentIndex, currentCategory])

  const loadCategory = async (category) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/questions?category=${category}`)
      const result = await res.json()
      if (result.success && result.data.length > 0) {
        setQuestions(result.data)
        setCurrentCategory(category)
        setCurrentIndex(0)
        setSimonInput([])
        speak(result.data[0].audioText)
      }
    } catch (err) {
      console.error('Failed to load questions', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReturnHome = () => {
    cancelSpeech()
    setCurrentCategory(null)
    setQuestions([])
    setCurrentIndex(0)
    setFeedback(null)
  }

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      soundEffects.playCorrect()
      speak('ถูกต้องแล้วครับ เก่งมาก!')
      setFeedback('success')
      addStar()

      setTimeout(() => {
        setFeedback(null)
        if (currentIndex + 1 < questions.length) {
          const nextIdx = currentIndex + 1
          setCurrentIndex(nextIdx)
          speak(questions[nextIdx].audioText)
        } else {
          soundEffects.playVictory()
          speak('ยินดีด้วยครับ ผ่านด่านขุมทรัพย์แล้ว!')
          setCurrentCategory(null)
        }
      }, 1800)
    } else {
      soundEffects.playWrong()
      speak('ลองใหม่อีกทีนะครับ')
      setFeedback('wrong')
      setTimeout(() => setFeedback(null), 1200)
    }
  }

  const handleSimonClick = (symbol) => {
    const currentQ = questions[currentIndex]
    const newSequence = [...simonInput, symbol]
    setSimonInput(newSequence)

    const stepIndex = newSequence.length - 1
    if (symbol !== currentQ.correctSequence[stepIndex]) {
      soundEffects.playWrong()
      speak('ยังไม่ถูกต้อง ลองใหม่อีกครั้งนะครับ')
      setFeedback('wrong')
      setSimonInput([])
      setTimeout(() => setFeedback(null), 1200)
      return
    }

    if (newSequence.length === currentQ.correctSequence.length) {
      handleAnswer(true)
    }
  }

  const currentQ = questions[currentIndex]

  return (
    <div className="min-h-screen bg-emerald-500 font-sans p-4 sm:p-8 flex flex-col items-center select-none bg-[radial-gradient(#4ad395_2px,transparent_2px)] [background-size:20px_20px]">
      {/* 🎮 TOP HUD BAR */}
      <HudBar
        currentCategory={currentCategory}
        onHomeClick={handleReturnHome}
        level={level}
        expProgress={expProgress}
        stars={stars}
      />

      {/* 🏰 MAIN GAME BOARD */}
      <main className="w-full max-w-4xl bg-stone-100 border-4 border-b-8 border-stone-300 rounded-3xl p-6 sm:p-10 shadow-2xl relative min-h-[500px] flex flex-col items-center justify-center">
        {/* Loading Indicator */}
        {isLoading && (
          <div className="text-xl font-bold text-stone-500 animate-pulse">
            กำลังโหลดภารกิจ...
          </div>
        )}

        {/* 1. DASHBOARD MODE SELECT */}
        {!isLoading && !currentCategory && (
          <CategorySelector onSelectCategory={loadCategory} />
        )}

        {/* 2. GAME PLAY SCREENS */}
        {!isLoading && currentCategory && currentQ && (
          <>
            {currentCategory === 'listening' && (
              <ListeningGame
                question={currentQ}
                onAnswer={handleAnswer}
                onReplayAudio={() => speak(currentQ.audioText)}
              />
            )}

            {currentCategory === 'spatial' && (
              <SpatialGame
                question={currentQ}
                onAnswer={handleAnswer}
                onReplayAudio={() => speak(currentQ.audioText)}
              />
            )}

            {currentCategory === 'pattern' && (
              <PatternGame
                question={currentQ}
                onAnswer={handleAnswer}
                onReplayAudio={() => speak(currentQ.audioText)}
              />
            )}

            {currentCategory === 'simon' && (
              <SimonGame
                question={currentQ}
                simonInput={simonInput}
                onSimonClick={handleSimonClick}
                onReplayAudio={() => speak(currentQ.audioText)}
              />
            )}
          </>
        )}

        {/* 3. RESULT OVERLAY */}
        <FeedbackModal feedback={feedback} />
      </main>
    </div>
  )
}
