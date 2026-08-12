'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Volume2,
  Star,
  Home,
  ArrowLeft,
  Sparkles,
  RefreshCw
} from 'lucide-react'

export default function SatitPrepApp() {
  const [stars, setStars] = useState(0)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [simonInput, setSimonInput] = useState([])
  const [feedback, setFeedback] = useState(null) // 'success' | 'wrong' | null

  // โหลดดาวสะสมจาก LocalStorage
  useEffect(() => {
    const savedStars = localStorage.getItem('satit_hero_stars')
    if (savedStars) setStars(parseInt(savedStars))
  }, [])

  // ดึงข้อสอบจาก Backend API
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

  // Web Speech API เสียงอ่านภาษาไทย
  const speak = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'th-TH'
      utterance.rate = 0.85 // ปรับจังหวะพูดให้ช้าลงเล็กน้อยสำหรับเด็ก
      window.speechSynthesis.speak(utterance)
    }
  }

  // ระบบเพิ่มดาวสะสม
  const addStar = () => {
    const newCount = stars + 1
    setStars(newCount)
    localStorage.setItem('satit_hero_stars', newCount.toString())
  }

  // ตรวจคำตอบทั่วไป
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
          speak('ยินดีด้วยครับ ทำครบทุกข้อแล้ว!')
          setCurrentCategory(null)
        }
      }, 1800)
    } else {
      speak('ลองใหม่อีกทีนะครับ')
      setFeedback('wrong')
      setTimeout(() => setFeedback(null), 1200)
    }
  }

  // ตรวจคำตอบหมวด Simon Says
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

  return (
    <div className="min-h-screen bg-sky-100 font-sans p-4 sm:p-8 flex flex-col items-center select-none">
      {/* Header Bar */}
      <header className="w-full max-w-3xl bg-white rounded-3xl p-4 shadow-md flex justify-between items-center mb-6 border-4 border-sky-200">
        <div className="flex items-center gap-2">
          {currentCategory && (
            <button
              onClick={() => {
                window.speechSynthesis.cancel()
                setCurrentCategory(null)
              }}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition"
            >
              <Home className="w-8 h-8 text-slate-600" />
            </button>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-emerald-600 flex items-center gap-2">
            🎒 Satit Prep Hero
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full border-2 border-amber-300">
          <Star className="w-7 h-7 text-amber-500 fill-amber-400" />
          <span className="text-2xl font-extrabold text-amber-600">
            {stars}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-3xl bg-white rounded-3xl p-6 shadow-xl border-4 border-sky-200 relative overflow-hidden min-h-[480px] flex flex-col items-center justify-center">
        {/* Dashboard Menu View */}
        {!currentCategory && (
          <div className="w-full text-center">
            <h2 className="text-2xl font-bold text-slate-700 mb-6">
              เลือกภารกิจประจำวันเลยครับ!
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  id: 'listening',
                  title: 'ฟังจับใจความ',
                  icon: '🎧',
                  color: 'bg-emerald-100 border-emerald-300 text-emerald-800'
                },
                {
                  id: 'spatial',
                  title: 'มิติสัมพันธ์',
                  icon: '🧩',
                  color: 'bg-indigo-100 border-indigo-300 text-indigo-800'
                },
                {
                  id: 'pattern',
                  title: 'อนุกรมรูปทรง',
                  icon: '🔄',
                  color: 'bg-amber-100 border-amber-300 text-amber-800'
                },
                {
                  id: 'simon',
                  title: 'คำสั่งของซิมอน',
                  icon: '📢',
                  color: 'bg-rose-100 border-rose-300 text-rose-800'
                }
              ].map((menu) => (
                <motion.button
                  key={menu.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => loadCategory(menu.id)}
                  className={`${menu.color} border-4 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition`}
                >
                  <span className="text-5xl">{menu.icon}</span>
                  <span className="text-lg sm:text-xl font-bold">
                    {menu.title}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Active Game View */}
        {currentCategory && currentQ && (
          <div className="w-full flex flex-col items-center">
            {/* Audio Instruction Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => speak(currentQ.audioText)}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-full text-lg sm:text-xl flex items-center gap-3 shadow-lg mb-8 border-b-4 border-sky-700"
            >
              <Volume2 className="w-8 h-8" />
              <span>กดเพื่อฟังคำสั่ง</span>
            </motion.button>

            {/* Listening / Spatial Option Grid */}
            {(currentCategory === 'listening' ||
              currentCategory === 'spatial') && (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full">
                {currentQ.options.map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(opt.isCorrect)}
                    className="bg-slate-50 hover:bg-sky-50 border-4 border-slate-200 hover:border-sky-400 rounded-3xl p-6 flex flex-col items-center justify-center text-6xl min-h-[140px] shadow-sm transition"
                  >
                    <span>{opt.icon}</span>
                    {opt.text && (
                      <span className="text-base text-slate-500 mt-2 font-medium">
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
                <div className="flex items-center gap-3 bg-slate-100 p-4 rounded-2xl border-2 border-slate-300">
                  {currentQ.sequence.map((item, idx) => (
                    <span key={idx} className="text-5xl">
                      {item}
                    </span>
                  ))}
                  <div className="w-16 h-16 border-4 border-dashed border-sky-400 bg-white rounded-xl flex items-center justify-center text-3xl font-bold text-sky-500">
                    ?
                  </div>
                </div>

                <div className="flex justify-center gap-4 w-full">
                  {currentQ.options.map((opt) => (
                    <motion.button
                      key={opt.id}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleAnswer(opt.isCorrect)}
                      className="bg-white hover:bg-sky-50 border-4 border-slate-200 hover:border-sky-400 rounded-2xl p-4 text-5xl shadow-sm"
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
                <div className="min-h-[60px] flex items-center gap-2 bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-2">
                  {simonInput.length === 0 ? (
                    <span className="text-slate-400 text-lg">
                      กดเลือกรูปตามลำดับ...
                    </span>
                  ) : (
                    simonInput.map((item, idx) => (
                      <span key={idx} className="text-4xl">
                        {item}
                      </span>
                    ))
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  {currentQ.options.map((item, idx) => (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleSimonClick(item)}
                      className="bg-white hover:bg-rose-50 border-4 border-slate-200 hover:border-rose-300 rounded-2xl p-6 text-5xl shadow-sm"
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center z-20"
            >
              {feedback === 'success' ? (
                <>
                  <Sparkles className="w-24 h-24 text-amber-400 animate-bounce mb-2" />
                  <span className="text-4xl font-extrabold text-emerald-600">
                    ถูกต้องแล้วครับ!
                  </span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-20 h-20 text-rose-400 animate-spin mb-2" />
                  <span className="text-3xl font-bold text-rose-500">
                    ลองใหม่อีกทีนะครับ
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
