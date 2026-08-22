'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Trophy,
  Flame,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Award,
  Lock,
  Unlock
} from 'lucide-react'
import { soundEffects } from '@/lib/sound'

const CATEGORY_NAMES = {
  listening: { name: 'ฟังจับใจความ', icon: '🎧', color: 'emerald' },
  spatial: { name: 'มิติสัมพันธ์', icon: '🧩', color: 'sky' },
  pattern: { name: 'อนุกรมรูปทรง', icon: '🔄', color: 'amber' },
  simon: { name: 'คำสั่งความจำ', icon: '📢', color: 'rose' }
}

export default function ParentDashboard({
  isOpen,
  onClose,
  stats,
  stars,
  level,
  onResetStats
}) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [pinAnswer, setPinAnswer] = useState('')
  const [pinError, setPinError] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Quick Math Gate for parent confirmation (e.g. 5 + 3)
  const mathQuestion = { a: 5, b: 3, answer: 8 }

  const handleUnlock = (e) => {
    e.preventDefault()
    if (parseInt(pinAnswer, 10) === mathQuestion.answer) {
      soundEffects.playClick()
      setIsUnlocked(true)
      setPinError(false)
    } else {
      soundEffects.playWrong()
      setPinError(true)
    }
  }

  // Calculate totals
  const totalAttempted =
    (stats.listening?.attempted || 0) +
    (stats.spatial?.attempted || 0) +
    (stats.pattern?.attempted || 0) +
    (stats.simon?.attempted || 0)

  const totalCorrect =
    (stats.listening?.correct || 0) +
    (stats.spatial?.correct || 0) +
    (stats.pattern?.correct || 0) +
    (stats.simon?.correct || 0)

  const overallAccuracy =
    totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0

  // Category evaluation
  const categoryEvaluations = Object.keys(CATEGORY_NAMES).map((catKey) => {
    const catData = stats[catKey] || { attempted: 0, correct: 0, wrong: 0 }
    const accuracy =
      catData.attempted > 0
        ? Math.round((catData.correct / catData.attempted) * 100)
        : 0
    return {
      key: catKey,
      ...CATEGORY_NAMES[catKey],
      attempted: catData.attempted,
      correct: catData.correct,
      accuracy
    }
  })

  // Identify strengths & focus areas
  const playedCategories = categoryEvaluations.filter((c) => c.attempted >= 3)
  const bestCategory = playedCategories.length
    ? [...playedCategories].sort((a, b) => b.accuracy - a.accuracy)[0]
    : null
  const needFocusCategory = playedCategories.length
    ? [...playedCategories].sort((a, b) => a.accuracy - b.accuracy)[0]
    : null

  // Readiness badge
  let readinessBadge = { text: 'เริ่มต้นเรียนรู้', color: 'bg-stone-500' }
  if (totalAttempted >= 10) {
    if (overallAccuracy >= 85) {
      readinessBadge = { text: 'พร้อมมาก (ยอดเยี่ยม 🌟)', color: 'bg-emerald-500' }
    } else if (overallAccuracy >= 65) {
      readinessBadge = { text: 'ความพร้อมระดับดี (เก่งมาก 👍)', color: 'bg-amber-500' }
    } else {
      readinessBadge = { text: 'กำลังฝึกฝน (ฝึกเพิ่มอีกนิด 💪)', color: 'bg-sky-500' }
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white border-4 border-stone-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative my-8"
        >
          {/* Header */}
          <div className="bg-stone-800 p-5 flex items-center justify-between text-white border-b-4 border-stone-900">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-xl text-stone-900 font-bold">
                📊
              </div>
              <div>
                <h2 className="text-xl font-black text-amber-400">
                  รายงานผลวิเคราะห์ทักษะ
                </h2>
                <p className="text-xs text-stone-300">
                  สำหรับผู้ปกครอง & คุณครู (ประเมินความพร้อม ป.1)
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                soundEffects.playClick()
                onClose()
              }}
              className="p-2 hover:bg-stone-700 rounded-xl transition cursor-pointer text-stone-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
            {/* Parent Gate Lock */}
            {!isUnlocked ? (
              <div className="py-8 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-800">
                    พื้นที่สำหรับผู้ปกครอง
                  </h3>
                  <p className="text-sm text-stone-500">
                    กรุณาตอบคำถามสั้นๆ เพื่อยืนยัน: {mathQuestion.a} + {mathQuestion.b} = ?
                  </p>
                </div>
                <form onSubmit={handleUnlock} className="flex gap-2">
                  <input
                    type="number"
                    value={pinAnswer}
                    onChange={(e) => setPinAnswer(e.target.value)}
                    placeholder="ผลลัพธ์"
                    className="w-24 text-center font-bold text-lg border-2 border-stone-300 rounded-xl p-2 focus:border-amber-500 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 font-bold text-stone-900 px-5 py-2 rounded-xl transition cursor-pointer"
                  >
                    ยืนยัน
                  </button>
                </form>
                {pinError && (
                  <span className="text-xs text-rose-500 font-bold">
                    คำตอบยังไม่ถูกต้อง ลองใหม่อีกครั้งครับ
                  </span>
                )}
              </div>
            ) : (
              <>
                {/* 1. Overall Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-stone-100 p-3.5 rounded-2xl border-2 border-stone-200 text-center">
                    <span className="text-xs text-stone-500 font-bold block">
                      ทำข้อสอบไป
                    </span>
                    <span className="text-2xl font-black text-stone-800">
                      {totalAttempted}{' '}
                      <span className="text-xs font-normal">ข้อ</span>
                    </span>
                  </div>

                  <div className="bg-emerald-50 p-3.5 rounded-2xl border-2 border-emerald-200 text-center">
                    <span className="text-xs text-emerald-700 font-bold block">
                      ความแม่นยำรวม
                    </span>
                    <span className="text-2xl font-black text-emerald-600">
                      {overallAccuracy}%
                    </span>
                  </div>

                  <div className="bg-amber-50 p-3.5 rounded-2xl border-2 border-amber-200 text-center">
                    <span className="text-xs text-amber-700 font-bold block">
                      ถูกต่อเนื่องสูงสุด
                    </span>
                    <span className="text-2xl font-black text-amber-600 flex items-center justify-center gap-1">
                      <Flame className="w-5 h-5 fill-amber-500" />{' '}
                      {stats.bestStreak || 0}
                    </span>
                  </div>

                  <div className="bg-purple-50 p-3.5 rounded-2xl border-2 border-purple-200 text-center">
                    <span className="text-xs text-purple-700 font-bold block">
                      เพชรสะสม
                    </span>
                    <span className="text-2xl font-black text-purple-600">
                      💎 {stars}
                    </span>
                  </div>
                </div>

                {/* Readiness Status Banner */}
                <div className="bg-stone-800 rounded-2xl p-4 text-white flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-xs text-stone-400 font-medium">
                        ระดับประเมินความพร้อมสอบเข้า ป.1
                      </span>
                      <h4 className="text-base font-bold text-white">
                        {readinessBadge.text}
                      </h4>
                    </div>
                  </div>
                  <span className="text-xs text-stone-400">
                    LVL {level}
                  </span>
                </div>

                {/* 2. Breakdown of 4 Core Skills */}
                <div className="space-y-3">
                  <h3 className="font-black text-stone-800 text-sm uppercase tracking-wide flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    วิเคราะห์ผลคะแนนแยกตาม 4 ทักษะ
                  </h3>

                  <div className="space-y-3">
                    {categoryEvaluations.map((cat) => (
                      <div
                        key={cat.key}
                        className="bg-stone-50 border-2 border-stone-200 rounded-2xl p-3.5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-stone-800 flex items-center gap-2 text-sm">
                            <span>{cat.icon}</span> {cat.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-500 font-medium">
                              ถูก {cat.correct}/{cat.attempted} ข้อ
                            </span>
                            <span
                              className={`text-xs font-black px-2 py-0.5 rounded-md ${
                                cat.accuracy >= 80
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : cat.accuracy >= 60
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-rose-100 text-rose-700'
                              }`}
                            >
                              {cat.accuracy}%
                            </span>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              cat.accuracy >= 80
                                ? 'bg-emerald-500'
                                : cat.accuracy >= 60
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${cat.accuracy}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Strengths & Insights */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 space-y-3">
                  <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    บทวิเคราะห์และคำแนะนำสำหรับผู้ปกครอง
                  </h3>

                  <div className="space-y-2 text-xs text-amber-900">
                    {bestCategory && (
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>จุดเด่น:</strong> น้องทำได้ดีมากในหมวด{' '}
                          <strong>{bestCategory.name}</strong> (ความแม่นยำ{' '}
                          {bestCategory.accuracy}%)
                        </span>
                      </div>
                    )}

                    {needFocusCategory && needFocusCategory.accuracy < 80 && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>ควรฝึกเพิ่ม:</strong> แนะนำให้ฝึกหมวด{' '}
                          <strong>{needFocusCategory.name}</strong>{' '}
                          เพิ่มเติมเพื่อเพิ่มความมั่นใจในการสอบ
                        </span>
                      </div>
                    )}

                    {!playedCategories.length && (
                      <p className="text-stone-500">
                        เมื่อน้องทำข้อสอบอย่างน้อย 3-5 ข้อในแต่ละหมวด
                        ระบบจะวิเคราะห์จุดเด่นและจุดที่ควรพัฒนาให้อัตโนมัติครับ
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. Reset Stats Option */}
                <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                  {!showResetConfirm ? (
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 font-medium transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> ล้างสถิติเพื่อเริ่มใหม่
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-rose-600 font-bold">
                        ยืนยันล้างข้อมูลสถิติทั้งหมด?
                      </span>
                      <button
                        onClick={() => {
                          onResetStats()
                          setShowResetConfirm(false)
                          soundEffects.playClick()
                        }}
                        className="text-xs bg-rose-500 text-white font-bold px-3 py-1 rounded-lg hover:bg-rose-600 transition cursor-pointer"
                      >
                        ยืนยัน
                      </button>
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="text-xs text-stone-500 hover:text-stone-700 font-medium px-2 py-1 cursor-pointer"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      soundEffects.playClick()
                      onClose()
                    }}
                    className="bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    ปิดหน้ารายงาน
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
