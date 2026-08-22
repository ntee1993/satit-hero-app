'use client'

import { motion } from 'framer-motion'
import { Sparkles, Trophy, Timer, ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/data/categories'
import { soundEffects } from '@/lib/sound'

export default function CategorySelector({ onSelectCategory }) {
  const handleSelect = (id) => {
    soundEffects.playClick()
    onSelectCategory(id)
  }

  return (
    <div className="w-full text-center space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 font-bold text-sm mb-3">
          <Sparkles className="w-4 h-4 text-amber-500" /> เลือกภารกิจวันนี้
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-800">
          ผจญภัยในดินแดนความรู้
        </h2>
      </div>

      {/* 🏆 PROMINENT MOCK EXAM BANNER */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => handleSelect('mock-exam')}
        className="w-full bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border-4 border-amber-400 border-b-8 rounded-3xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl cursor-pointer active:border-b-4 active:translate-y-1 transition text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-inner shrink-0 animate-pulse">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" /> จำลองสอบจับเวลา
              </span>
              <span className="text-xs text-amber-300 font-bold hidden sm:inline">
                +EXP โบนัส 💎
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
              สนามสอบจำลอง ป.1 (Mock Exam)
            </h3>
            <p className="text-xs text-stone-300 font-medium mt-0.5">
              คละข้อสอบทั้ง 4 ทักษะ พร้อมจับเวลาและสรุปเกรดผลสอบ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-black px-5 py-2.5 rounded-2xl text-sm shrink-0 shadow-md">
          <span>เริ่มสอบทันที</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </motion.button>

      {/* 4 CORE CATEGORIES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {CATEGORIES.map((menu) => (
          <motion.button
            key={menu.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelect(menu.id)}
            className={`${menu.bg} text-white border-b-8 rounded-2xl p-6 flex items-center gap-5 shadow-lg text-left transition active:border-b-0 active:translate-y-2 cursor-pointer`}
          >
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-4xl shadow-inner shrink-0">
              {menu.icon}
            </div>
            <div>
              <h3 className="text-xl font-black drop-shadow">{menu.title}</h3>
              <p className="text-xs text-white/90 font-medium mt-1">
                {menu.desc}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
