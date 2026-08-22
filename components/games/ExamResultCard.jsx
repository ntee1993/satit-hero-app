'use client'

import { motion } from 'framer-motion'
import { Trophy, CheckCircle, XCircle, Clock, RotateCcw, Home, Sparkles, Award } from 'lucide-react'
import ShapeRenderer from '@/components/ui/ShapeRenderer'
import { soundEffects } from '@/lib/sound'

const CATEGORY_LABELS = {
  listening: { name: 'ฟังจับใจความ', icon: '🎧', bg: 'bg-emerald-100 text-emerald-800' },
  spatial: { name: 'มิติสัมพันธ์', icon: '🧩', bg: 'bg-sky-100 text-sky-800' },
  pattern: { name: 'อนุกรมรูปทรง', icon: '🔄', bg: 'bg-amber-100 text-amber-800' },
  simon: { name: 'คำสั่งความจำ', icon: '📢', bg: 'bg-rose-100 text-rose-800' }
}

export default function ExamResultCard({
  results,
  totalQuestions,
  score,
  bonusGems,
  onRetry,
  onHome
}) {
  const percentage = Math.round((score / totalQuestions) * 100)

  let grade = { letter: 'A+', text: 'ยอดเยี่ยมมาก! สอบติดแน่นอน 🌟', color: 'text-emerald-500' }
  if (percentage < 50) {
    grade = { letter: 'C', text: 'พยายามใหม่นะครับ สู้ๆ! 🎯', color: 'text-rose-500' }
  } else if (percentage < 70) {
    grade = { letter: 'B', text: 'กำลังพัฒนา ฝึกฝนบ่อยๆ นะครับ 💪', color: 'text-amber-500' }
  } else if (percentage < 85) {
    grade = { letter: 'B+', text: 'ดีมาก พร้อมลุยสนามสอบแล้ว 👍', color: 'text-sky-500' }
  } else if (percentage < 95) {
    grade = { letter: 'A', text: 'เก่งมากๆ ความพร้อมสูงลิ่ว! 🏆', color: 'text-emerald-600' }
  }

  const handleRetry = () => {
    soundEffects.playClick()
    onRetry()
  }

  const handleHome = () => {
    soundEffects.playClick()
    onHome()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl flex flex-col items-center text-center space-y-6"
    >
      {/* Trophy & Badge Header */}
      <div className="flex flex-col items-center">
        <Trophy className="w-24 h-24 text-amber-400 animate-bounce drop-shadow-[0_0_25px_rgba(251,191,36,0.7)] mb-2" />
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-100 rounded-full text-amber-800 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-amber-600" /> สรุปผลการสอบจำลอง ป.1
        </div>
      </div>

      {/* Grand Score Display */}
      <div className="bg-white border-4 border-stone-800 rounded-3xl p-6 w-full shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
          {/* Score & Percentage */}
          <div>
            <span className="text-xs text-stone-500 font-bold uppercase tracking-wider block">
              คะแนนสอบที่ได้
            </span>
            <div className="text-5xl sm:text-6xl font-black text-stone-800">
              {score}
              <span className="text-2xl text-stone-400 font-bold">/{totalQuestions}</span>
            </div>
            <span className="text-sm font-black text-amber-600">
              {percentage}% ความแม่นยำ
            </span>
          </div>

          {/* Grade Badge */}
          <div className="border-t-2 sm:border-t-0 sm:border-l-2 border-stone-200 pt-4 sm:pt-0 sm:pl-8 flex flex-col items-center">
            <span className="text-xs text-stone-500 font-bold uppercase tracking-wider block">
              ระดับผลการประเมิน
            </span>
            <span className={`text-5xl font-black ${grade.color}`}>
              {grade.letter}
            </span>
            <span className="text-xs font-bold text-stone-700 mt-1 max-w-[180px]">
              {grade.text}
            </span>
          </div>
        </div>

        {/* Bonus Reward Banner */}
        <div className="mt-6 bg-emerald-500 text-white font-black py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-inner">
          <Award className="w-6 h-6 text-amber-300" />
          <span>ได้รับโบนัสสอบเสร็จ: +{bonusGems} 💎 เพชรสะสม</span>
        </div>
      </div>

      {/* Answer Review Section */}
      <div className="w-full bg-white border-4 border-stone-300 rounded-3xl p-5 shadow-md text-left space-y-3">
        <h3 className="font-black text-stone-800 text-sm uppercase tracking-wide flex items-center justify-between">
          <span>📋 รายการตรวจคำตอบ ({results.length} ข้อ)</span>
          <span className="text-xs text-stone-500 font-normal">
            ถูก {score} / ผิด {totalQuestions - score}
          </span>
        </h3>

        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {results.map((res, idx) => {
            const catInfo = CATEGORY_LABELS[res.category] || {
              name: res.category,
              icon: '❓',
              bg: 'bg-stone-100 text-stone-700'
            }

            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 text-xs ${
                  res.isCorrect
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-rose-50/70 border-rose-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-stone-500 w-5">#{idx + 1}</span>
                  <span className={`px-2 py-0.5 rounded-lg font-bold ${catInfo.bg} flex items-center gap-1`}>
                    <span>{catInfo.icon}</span> {catInfo.name}
                  </span>
                  <span className="text-stone-700 font-medium truncate max-w-[180px] sm:max-w-xs">
                    {res.question.audioText}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {res.isCorrect ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> ถูกต้อง
                    </span>
                  ) : res.isTimeout ? (
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <Clock className="w-4 h-4" /> หมดเวลา
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> ผิด
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full pt-2">
        <button
          onClick={handleRetry}
          className="flex-1 min-w-[160px] bg-amber-500 hover:bg-amber-400 border-b-8 border-amber-700 text-stone-900 font-black py-4 px-6 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-xl active:border-b-0 active:translate-y-2 transition cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>สอบใหม่อีกครั้ง</span>
        </button>

        <button
          onClick={handleHome}
          className="flex-1 min-w-[160px] bg-stone-800 hover:bg-stone-700 border-b-8 border-stone-950 text-white font-black py-4 px-6 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-xl active:border-b-0 active:translate-y-2 transition cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span>กลับหน้าหลัก</span>
        </button>
      </div>
    </motion.div>
  )
}
