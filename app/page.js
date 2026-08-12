'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Volume2,
  Home,
  Sparkles,
  RefreshCw,
  Trophy,
  Flame,
  Compass
} from 'lucide-react'

export default function SatitPrepApp() {
  const [stars, setStars] = useState(0)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [simonInput, setSimonInput] = useState([])
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    const savedStars = localStorage.getItem('satit_hero_stars')
    if (savedStars) setStars(parseInt(savedStars))
  }, [])

  const loadCategory = async (category) => {
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
    }
  }

  const speak = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'th-TH'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  const addStar = () => {
    const newCount = stars + 1
    setStars(newCount)
    localStorage.setItem('satit_hero_stars', newCount.toString())
  }

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
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
          speak('ยินดีด้วยครับ ผ่านด่านขุมทรัพย์แล้ว!')
          setCurrentCategory(null)
        }
      }, 1800)
    } else {
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
  const level = Math.floor(stars / 5) + 1
  const expProgress = (stars % 5) * 20

  return (
    <div className="min-h-screen bg-emerald-500 font-sans p-4 sm:p-8 flex flex-col items-center select-none bg-[radial-gradient(#4ad395_2px,transparent_2px)] [background-size:20px_20px]">
      {/* 🎮 TOP HUD BAR */}
      <header className="w-full max-w-4xl bg-stone-800 border-4 border-b-8 border-stone-900 rounded-3xl p-4 mb-6 shadow-2xl flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          {currentCategory ? (
            <button
              onClick={() => {
                window.speechSynthesis.cancel()
                setCurrentCategory(null)
              }}
              className="p-3 bg-amber-500 hover:bg-amber-400 border-b-4 border-amber-700 rounded-2xl transition shadow-md active:translate-y-1 active:border-b-0"
            >
              <Home className="w-6 h-6 text-white" />
            </button>
          ) : (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl">
              <Compass className="w-6 h-6 text-emerald-400" />
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wide drop-shadow-[0_2px_0_#000]">
              SATIT CRAFT{' '}
              <span className="text-xs px-2 py-1 rounded-lg bg-emerald-500 text-stone-900 font-black">
                PRO
              </span>
            </h1>
            <p className="text-xs text-stone-300 font-medium">
              แอปเตรียมพร้อม ป.1 สนุกทุกวัน
            </p>
          </div>
        </div>

        {/* EXP & STAR COUNTER */}
        <div className="flex items-center gap-4 bg-stone-950 px-5 py-2.5 rounded-2xl border-2 border-stone-700">
          <div className="flex flex-col items-end">
            <span className="text-xs font-black text-amber-400 flex items-center gap-1">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" /> LVL{' '}
              {level}
            </span>
            <div className="w-28 sm:w-32 h-3 bg-stone-800 rounded-full overflow-hidden mt-1 border border-stone-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-lime-400 transition-all duration-500"
                style={{ width: `${expProgress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500 px-3 py-1.5 rounded-xl border-b-4 border-emerald-700">
            <span className="text-xl">💎</span>
            <span className="text-xl font-black text-white drop-shadow">
              {stars}
            </span>
          </div>
        </div>
      </header>

      {/* 🏰 MAIN GAME BOARD */}
      <main className="w-full max-w-4xl bg-stone-100 border-4 border-b-8 border-stone-300 rounded-3xl p-6 sm:p-10 shadow-2xl relative min-h-[500px] flex flex-col items-center justify-center">
        {/* 1. DASHBOARD MODE SELECT */}
        {!currentCategory && (
          <div className="w-full text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 font-bold text-sm mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" /> เลือกภารกิจวันนี้
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-800 mb-8">
              ผจญภัยในดินแดนความรู้
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  id: 'listening',
                  title: 'ฟังจับใจความ',
                  desc: 'ฝึกฟังและจับประเด็นสำคัญ',
                  icon: '🎧',
                  bg: 'bg-emerald-500 hover:bg-emerald-400 border-emerald-700'
                },
                {
                  id: 'spatial',
                  title: 'มิติสัมพันธ์',
                  desc: 'ฝึกการสังเกตและทิศทาง',
                  icon: '🧩',
                  bg: 'bg-sky-500 hover:bg-sky-400 border-sky-700'
                },
                {
                  id: 'pattern',
                  title: 'อนุกรมรูปทรง',
                  desc: 'ค้นหาแบบรูปแบบลำดับ',
                  icon: '🔄',
                  bg: 'bg-amber-500 hover:bg-amber-400 border-amber-700'
                },
                {
                  id: 'simon',
                  title: 'คำสั่งของซิมอน',
                  desc: 'ทดสอบความจำระยะสั้น',
                  icon: '📢',
                  bg: 'bg-rose-500 hover:bg-rose-400 border-rose-700'
                }
              ].map((menu) => (
                <motion.button
                  key={menu.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => loadCategory(menu.id)}
                  className={`${menu.bg} text-white border-b-8 rounded-2xl p-6 flex items-center gap-5 shadow-lg text-left transition active:border-b-0 active:translate-y-2`}
                >
                  <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-4xl shadow-inner shrink-0">
                    {menu.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-black drop-shadow">
                      {menu.title}
                    </h3>
                    <p className="text-xs text-white/90 font-medium mt-1">
                      {menu.desc}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* 2. GAME PLAY SCREEN */}
        {currentCategory && currentQ && (
          <div className="w-full flex flex-col items-center">
            {/* Audio Command Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => speak(currentQ.audioText)}
              className="bg-rose-500 hover:bg-rose-400 border-b-8 border-rose-700 text-white font-black py-4 px-8 rounded-2xl text-xl flex items-center gap-3 shadow-xl mb-8 active:border-b-0 active:translate-y-2"
            >
              <Volume2 className="w-8 h-8 text-amber-300 animate-bounce" />
              <span>กดเพื่อฟังโจทย์เสียง</span>
            </motion.button>

            {/* Listening / Spatial Options */}
            {(currentCategory === 'listening' ||
              currentCategory === 'spatial') && (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl">
                {currentQ.options.map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(opt.isCorrect)}
                    className="bg-white hover:bg-amber-50 border-4 border-stone-200 hover:border-amber-400 border-b-8 border-b-stone-300 hover:border-b-amber-500 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[160px] shadow-md transition active:border-b-4 active:translate-y-1"
                  >
                    <span className="text-6xl">{opt.icon}</span>
                    {opt.text && (
                      <span className="text-lg font-bold text-stone-700 mt-3">
                        {opt.text}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Pattern Sequence */}
            {currentCategory === 'pattern' && (
              <div className="w-full flex flex-col items-center gap-8">
                <div className="flex items-center gap-3 bg-stone-200 p-5 rounded-2xl border-4 border-stone-300 shadow-inner">
                  {currentQ.sequence.map((item, idx) => (
                    <span key={idx} className="text-5xl">
                      {item}
                    </span>
                  ))}
                  <div className="w-16 h-16 border-4 border-dashed border-amber-500 bg-amber-100 rounded-xl flex items-center justify-center text-3xl font-black text-amber-600 animate-pulse">
                    ?
                  </div>
                </div>

                <div className="flex justify-center gap-4 w-full">
                  {currentQ.options.map((opt) => (
                    <motion.button
                      key={opt.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleAnswer(opt.isCorrect)}
                      className="bg-white border-4 border-stone-200 border-b-8 border-b-stone-300 hover:border-amber-400 hover:border-b-amber-500 rounded-2xl p-5 text-5xl shadow-md transition active:border-b-4 active:translate-y-1"
                    >
                      {opt.icon}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Simon Says Sequence */}
            {currentCategory === 'simon' && (
              <div className="w-full flex flex-col items-center gap-6">
                <div className="min-h-[70px] flex items-center gap-3 bg-stone-200 border-4 border-stone-300 rounded-2xl px-6 py-2 shadow-inner">
                  {simonInput.length === 0 ? (
                    <span className="text-stone-500 font-bold">
                      กดเลือกภาพตามลำดับที่ได้ยิน...
                    </span>
                  ) : (
                    simonInput.map((item, idx) => (
                      <span key={idx} className="text-4xl">
                        {item}
                      </span>
                    ))
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                  {currentQ.options.map((item, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleSimonClick(item)}
                      className="bg-white border-4 border-stone-200 border-b-8 border-b-stone-300 hover:border-rose-400 hover:border-b-rose-500 rounded-2xl p-6 text-5xl shadow-md transition active:border-b-4 active:translate-y-1"
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. RESULT OVERLAY */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-stone-900/90 rounded-3xl flex flex-col items-center justify-center z-30 p-6 text-center"
            >
              {feedback === 'success' ? (
                <>
                  <Trophy className="w-28 h-28 text-amber-400 animate-bounce mb-3 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
                  <span className="text-4xl font-black text-emerald-400 drop-shadow-[0_2px_0_#000]">
                    ถูกต้องแล้วครับ!
                  </span>
                  <span className="text-xl text-amber-300 font-extrabold mt-3 bg-amber-500/20 px-6 py-2 rounded-full border border-amber-400/30">
                    +1 EXP 💎
                  </span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-24 h-24 text-rose-400 animate-spin mb-3" />
                  <span className="text-3xl font-black text-rose-400 drop-shadow-[0_2px_0_#000]">
                    พยายามอีกนิดนะ!
                  </span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
