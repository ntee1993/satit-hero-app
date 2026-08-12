'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Volume2,
  Home,
  Sparkles,
  RefreshCw,
  Trophy,
  Shield,
  Flame,
  Compass
} from 'lucide-react'

export default function SatitPrepApp() {
  const [stars, setStars] = useState(0)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [simonInput, setSimonInput] = useState([])
  const [feedback, setFeedback] = useState(null) // 'success' | 'wrong' | null

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
          speak('ภารกิจเสร็จสิ้น! คุณได้รับยศนักผจญภัย!')
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
    <div className="min-h-screen bg-[#111625] text-white font-sans p-4 sm:p-8 flex flex-col items-center justify-center select-none relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black">
      {/* 🔮 BACKGROUND PARTICLES EFFECT */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* 🛡️ GAMING HUD HEADER */}
      <header className="w-full max-w-4xl bg-slate-900/80 backdrop-blur-md border-2 border-slate-700/80 rounded-2xl p-4 mb-6 shadow-[0_0_25px_rgba(0,0,0,0.5)] flex flex-wrap justify-between items-center gap-4 relative z-10">
        <div className="flex items-center gap-3">
          {currentCategory ? (
            <button
              onClick={() => {
                window.speechSynthesis.cancel()
                setCurrentCategory(null)
              }}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition shadow-lg active:scale-95"
            >
              <Home className="w-6 h-6 text-sky-400" />
            </button>
          ) : (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <Compass className="w-6 h-6 text-emerald-400 animate-spin-slow" />
            </div>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-sky-300 to-indigo-400 tracking-wider flex items-center gap-2">
              SATIT CRAFT{' '}
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PRO
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              แอปพลิเคชันเตรียมพร้อม ป.1
            </p>
          </div>
        </div>

        {/* EXP BAR & LEVEL HUD */}
        <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" /> LEVEL {level}
            </span>
            <div className="w-28 sm:w-36 h-2.5 bg-slate-800 rounded-full overflow-hidden mt-1 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-500 rounded-full"
                style={{ width: `${expProgress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/40">
            <span className="text-lg">💎</span>
            <span className="text-lg font-black text-emerald-300">{stars}</span>
          </div>
        </div>
      </header>

      {/* 🎮 MAIN DASHBOARD / GAME CANVAS */}
      <main className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-lg border-2 border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative min-h-[520px] flex flex-col items-center justify-center z-10">
        {/* 1. DASHBOARD MENU VIEW */}
        {!currentCategory && (
          <div className="w-full text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm font-semibold mb-3">
              <Sparkles className="w-4 h-4" /> เลือกโหมดการผจญภัย
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-8 tracking-wide">
              ภารกิจเก็บเกี่ยวความรู้ประจำวัน
            </h2>

            {/* HOTBAR SLOT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  id: 'listening',
                  title: 'ฟังจับใจความ',
                  desc: 'ฝึกการฟังและสรุปความ',
                  icon: '🎧',
                  border: 'hover:border-emerald-500/60',
                  bg: 'hover:bg-emerald-950/30'
                },
                {
                  id: 'spatial',
                  title: 'มิติสัมพันธ์',
                  desc: 'การสังเกตและมิติรูปทรง',
                  icon: '🧩',
                  border: 'hover:border-indigo-500/60',
                  bg: 'hover:bg-indigo-950/30'
                },
                {
                  id: 'pattern',
                  title: 'อนุกรมรูปทรง',
                  desc: 'ตรรกะและการคาดการณ์',
                  icon: '🔄',
                  border: 'hover:border-amber-500/60',
                  bg: 'hover:bg-amber-950/30'
                },
                {
                  id: 'simon',
                  title: 'คำสั่งของซิมอน',
                  desc: 'ความจำระยะสั้นและลำดับ',
                  icon: '📢',
                  border: 'hover:border-rose-500/60',
                  bg: 'hover:bg-rose-950/30'
                }
              ].map((menu) => (
                <motion.button
                  key={menu.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => loadCategory(menu.id)}
                  className={`group relative bg-slate-800/60 border-2 border-slate-700/80 ${menu.border} ${menu.bg} rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 text-left shadow-lg overflow-hidden`}
                >
                  <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition duration-300">
                    {menu.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition">
                      {menu.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{menu.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* 2. ACTIVE GAME VIEW */}
        {currentCategory && currentQ && (
          <div className="w-full flex flex-col items-center">
            {/* Audio Command Player */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => speak(currentQ.audioText)}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-3.5 px-8 rounded-2xl text-lg flex items-center gap-3 shadow-[0_0_20px_rgba(56,189,248,0.4)] mb-8 border border-sky-300/30"
            >
              <Volume2 className="w-7 h-7 text-amber-300 animate-pulse" />
              <span>กดเพื่อฟังคำสั่งเสียง</span>
            </motion.button>

            {/* Listening / Spatial Options */}
            {(currentCategory === 'listening' ||
              currentCategory === 'spatial') && (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl">
                {currentQ.options.map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(opt.isCorrect)}
                    className="bg-slate-800/80 hover:bg-slate-700/80 border-2 border-slate-700 hover:border-sky-400/80 rounded-2xl p-6 flex flex-col items-center justify-center text-6xl min-h-[150px] shadow-lg transition group"
                  >
                    <span className="group-hover:scale-110 transition duration-300">
                      {opt.icon}
                    </span>
                    {opt.text && (
                      <span className="text-sm font-semibold text-slate-300 mt-3">
                        {opt.text}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Pattern Matching Display */}
            {currentCategory === 'pattern' && (
              <div className="w-full flex flex-col items-center gap-8">
                <div className="flex items-center gap-3 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner">
                  {currentQ.sequence.map((item, idx) => (
                    <span key={idx} className="text-5xl">
                      {item}
                    </span>
                  ))}
                  <div className="w-16 h-16 border-2 border-dashed border-sky-400 bg-sky-500/10 rounded-xl flex items-center justify-center text-3xl font-black text-sky-400 animate-pulse">
                    ?
                  </div>
                </div>

                <div className="flex justify-center gap-4 w-full">
                  {currentQ.options.map((opt) => (
                    <motion.button
                      key={opt.id}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleAnswer(opt.isCorrect)}
                      className="bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-sky-400 rounded-2xl p-5 text-5xl shadow-md transition"
                    >
                      {opt.icon}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Simon Says Display */}
            {currentCategory === 'simon' && (
              <div className="w-full flex flex-col items-center gap-6">
                <div className="min-h-[70px] flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl px-6 py-2 shadow-inner">
                  {simonInput.length === 0 ? (
                    <span className="text-slate-500 text-sm font-medium">
                      กดเลือกรูปภาพตามลำดับที่ได้ยิน...
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
                      className="bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-rose-400 rounded-2xl p-6 text-5xl shadow-md transition"
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. GAMIFIED OVERLAY NOTIFICATION */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center z-30 p-6 border-2 border-slate-700"
            >
              {feedback === 'success' ? (
                <>
                  <div className="relative">
                    <Trophy className="w-24 h-24 text-amber-400 animate-bounce mb-3 filter drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                    <Sparkles className="w-8 h-8 text-emerald-400 absolute -top-2 -right-2 animate-spin" />
                  </div>
                  <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
                    ภารกิจสำเร็จ!
                  </span>
                  <span className="text-lg text-emerald-400 font-bold mt-2 bg-emerald-500/10 px-4 py-1 rounded-full border border-emerald-500/20">
                    +1 EXP 💎
                  </span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-20 h-20 text-rose-400 animate-spin mb-3" />
                  <span className="text-2xl font-bold text-rose-400">
                    เกือบถูกต้องแล้ว! ลองอีกทีนะ
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
