'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Timer,
  Award,
  Sparkles,
  ArrowRight,
  Flame,
  Volume2,
  X,
  Play,
  RotateCcw
} from 'lucide-react'
import ListeningGame from '@/components/games/ListeningGame'
import SpatialGame from '@/components/games/SpatialGame'
import PatternGame from '@/components/games/PatternGame'
import SimonGame from '@/components/games/SimonGame'
import ExamResultCard from '@/components/games/ExamResultCard'
import { generateMockExam } from '@/data/questions'
import { useSpeech } from '@/hooks/useSpeech'
import { soundEffects } from '@/lib/sound'

const CATEGORY_NAMES = {
  listening: { name: 'ฟังจับใจความ', icon: '🎧', bg: 'bg-emerald-500' },
  spatial: { name: 'มิติสัมพันธ์', icon: '🧩', bg: 'bg-sky-500' },
  pattern: { name: 'อนุกรมรูปทรง', icon: '🔄', bg: 'bg-amber-500' },
  simon: { name: 'คำสั่งความจำ', icon: '📢', bg: 'bg-rose-500' }
}

export default function MockExamGame({
  onExit,
  onRecordAnswer,
  onAddStar
}) {
  const { speak, cancel: cancelSpeech } = useSpeech()

  // Phases: 'setup' | 'exam' | 'result'
  const [phase, setPhase] = useState('setup')
  const [questionCount, setQuestionCount] = useState(10)
  const [timePerQuestion, setTimePerQuestion] = useState(20)

  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [simonInput, setSimonInput] = useState([])
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)
  const [bonusGems, setBonusGems] = useState(0)

  const timerRef = useRef(null)

  // Clear timer helper
  const clearExamTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  // Start exam
  const handleStartExam = () => {
    soundEffects.playClick()
    const examQuestions = generateMockExam(questionCount)
    setQuestions(examQuestions)
    setCurrentIndex(0)
    setResults([])
    setScore(0)
    setSimonInput([])
    setTimeLeft(timePerQuestion)
    setPhase('exam')

    if (examQuestions.length > 0) {
      speak(examQuestions[0].audioText)
    }
  }

  // Complete exam
  const finishExam = (finalResults, finalScore) => {
    clearExamTimer()
    cancelSpeech()

    const bonus = finalScore + 5 // +5 bonus for completion + 1 per correct answer
    setBonusGems(bonus)
    for (let i = 0; i < bonus; i++) {
      onAddStar()
    }

    soundEffects.playVictory()
    speak('ยินดีด้วยครับ ทำข้อสอบจำลองเสร็จแล้ว!')
    setPhase('result')
  }

  // Next question or finish
  const moveToNextQuestion = useCallback(
    (isCorrect, isTimeout = false) => {
      clearExamTimer()

      const currentQ = questions[currentIndex]
      if (!currentQ) return

      // Record to parent analytics
      onRecordAnswer?.(currentQ.category, isCorrect)

      const updatedResults = [
        ...results,
        {
          question: currentQ,
          category: currentQ.category,
          isCorrect,
          isTimeout
        }
      ]
      setResults(updatedResults)

      const updatedScore = isCorrect ? score + 1 : score
      if (isCorrect) setScore(updatedScore)

      if (currentIndex + 1 < questions.length) {
        const nextIdx = currentIndex + 1
        setCurrentIndex(nextIdx)
        setSimonInput([])
        setTimeLeft(timePerQuestion)
        speak(questions[nextIdx].audioText)
      } else {
        finishExam(updatedResults, updatedScore)
      }
    },
    [
      questions,
      currentIndex,
      results,
      score,
      timePerQuestion,
      onRecordAnswer,
      speak
    ]
  )

  // Timer Tick & Countdown
  useEffect(() => {
    if (phase !== 'exam' || timePerQuestion === 0) return

    clearExamTimer()

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearExamTimer()
          soundEffects.playWrong()
          speak('หมดเวลาครับ')
          moveToNextQuestion(false, true)
          return 0
        }

        if (prev === 6) {
          soundEffects.playTimerWarning()
        }

        return prev - 1
      })
    }, 1000)

    return () => clearExamTimer()
  }, [phase, currentIndex, timePerQuestion, moveToNextQuestion, speak])

  // Handle standard answers
  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      soundEffects.playCorrect()
    } else {
      soundEffects.playWrong()
    }
    moveToNextQuestion(isCorrect, false)
  }

  // Handle Simon Says click
  const handleSimonClick = (symbol) => {
    const currentQ = questions[currentIndex]
    const newSequence = [...simonInput, symbol]
    setSimonInput(newSequence)

    const stepIndex = newSequence.length - 1
    if (symbol !== currentQ.correctSequence[stepIndex]) {
      soundEffects.playWrong()
      moveToNextQuestion(false, false)
      return
    }

    if (newSequence.length === currentQ.correctSequence.length) {
      soundEffects.playCorrect()
      moveToNextQuestion(true, false)
    }
  }

  const currentQ = questions[currentIndex]
  const currentCategoryInfo = currentQ ? CATEGORY_NAMES[currentQ.category] : null

  // 1. SETUP SCREEN
  if (phase === 'setup') {
    return (
      <div className="w-full max-w-xl flex flex-col items-center text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 font-bold text-sm">
          <Trophy className="w-4 h-4 text-amber-600" /> โหมดจำลองสอบเข้า ป.1
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-800">
          จำลองสนามสอบจับเวลาจริง
        </h2>
        <p className="text-sm text-stone-500 max-w-md">
          คละข้อสอบทั้ง 4 ทักษะ (ฟัง, มิติสัมพันธ์, อนุกรม, ความจำ)
          พร้อมจับเวลาเพื่อฝึกสมาธิและความเร็ว
        </p>

        {/* Options Box */}
        <div className="w-full bg-white border-4 border-stone-800 rounded-3xl p-6 shadow-xl space-y-6 text-left">
          {/* Question Count Selection */}
          <div className="space-y-2.5">
            <span className="text-xs font-black text-stone-500 uppercase tracking-wide">
              1. เลือกจำนวนข้อสอบ
            </span>
            <div className="grid grid-cols-2 gap-3">
              {[10, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`p-4 rounded-2xl border-4 font-black text-lg transition flex flex-col items-center cursor-pointer ${
                    questionCount === num
                      ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-md scale-102'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span>{num} ข้อ</span>
                  <span className="text-xs font-normal text-stone-500">
                    {num === 10 ? 'ชุดทดสอบด่วน (5 นาที)' : 'ชุดสอบจำลองเต็ม (10 นาที)'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Limit Selection */}
          <div className="space-y-2.5">
            <span className="text-xs font-black text-stone-500 uppercase tracking-wide">
              2. เวลาทำข้อสอบต่อข้อ
            </span>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { time: 15, label: '15 วินาที', desc: 'ท้าทาย ⚡' },
                { time: 20, label: '20 วินาที', desc: 'มาตรฐาน ⏱️' },
                { time: 0, label: 'ไม่จำกัด', desc: 'ฝึกซ้อม 🧘' }
              ].map((opt) => (
                <button
                  key={opt.time}
                  type="button"
                  onClick={() => setTimePerQuestion(opt.time)}
                  className={`p-3 rounded-2xl border-4 font-bold text-sm transition flex flex-col items-center cursor-pointer ${
                    timePerQuestion === opt.time
                      ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-md scale-102'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className="text-xs font-normal text-stone-500 mt-0.5">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex gap-3 w-full">
          <button
            onClick={() => {
              soundEffects.playClick()
              onExit()
            }}
            className="w-1/3 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold py-4 rounded-2xl transition cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleStartExam}
            className="w-2/3 bg-rose-500 hover:bg-rose-400 border-b-8 border-rose-700 text-white font-black py-4 rounded-2xl text-xl flex items-center justify-center gap-2 shadow-xl active:border-b-0 active:translate-y-2 transition cursor-pointer"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>เริ่มทำข้อสอบ</span>
          </button>
        </div>
      </div>
    )
  }

  // 2. EXAM IN PROGRESS
  if (phase === 'exam' && currentQ) {
    const isUrgent = timeLeft <= 5 && timePerQuestion > 0
    const timerProgress = timePerQuestion > 0 ? (timeLeft / timePerQuestion) * 100 : 100

    return (
      <div className="w-full flex flex-col items-center">
        {/* Top Exam Status Bar */}
        <div className="w-full max-w-2xl bg-stone-800 border-4 border-stone-900 rounded-2xl p-3 mb-6 shadow-md flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-stone-700 px-3 py-1.5 rounded-xl text-amber-400">
              ข้อที่ {currentIndex + 1} / {questions.length}
            </span>
            {currentCategoryInfo && (
              <span
                className={`text-xs font-black px-3 py-1.5 rounded-xl ${currentCategoryInfo.bg} text-white flex items-center gap-1 shadow-sm`}
              >
                <span>{currentCategoryInfo.icon}</span>{' '}
                {currentCategoryInfo.name}
              </span>
            )}
          </div>

          {/* Countdown Timer Badge */}
          {timePerQuestion > 0 ? (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-black text-sm transition-colors ${
                isUrgent
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-stone-900 text-amber-400 border border-stone-700'
              }`}
            >
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          ) : (
            <span className="text-xs text-stone-400">โหมดไม่จำกัดเวลา</span>
          )}
        </div>

        {/* Dynamic Game Component */}
        <div className="w-full">
          {currentQ.category === 'listening' && (
            <ListeningGame
              question={currentQ}
              onAnswer={handleAnswer}
              onReplayAudio={() => speak(currentQ.audioText)}
            />
          )}

          {currentQ.category === 'spatial' && (
            <SpatialGame
              question={currentQ}
              onAnswer={handleAnswer}
              onReplayAudio={() => speak(currentQ.audioText)}
            />
          )}

          {currentQ.category === 'pattern' && (
            <PatternGame
              question={currentQ}
              onAnswer={handleAnswer}
              onReplayAudio={() => speak(currentQ.audioText)}
            />
          )}

          {currentQ.category === 'simon' && (
            <SimonGame
              question={currentQ}
              simonInput={simonInput}
              onSimonClick={handleSimonClick}
              onReplayAudio={() => speak(currentQ.audioText)}
            />
          )}
        </div>
      </div>
    )
  }

  // 3. EXAM RESULT SCORECARD
  if (phase === 'result') {
    return (
      <ExamResultCard
        results={results}
        totalQuestions={questions.length}
        score={score}
        bonusGems={bonusGems}
        onRetry={handleStartExam}
        onHome={onExit}
      />
    )
  }

  return null
}
