'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { CATEGORIES } from '@/data/categories'
import { soundEffects } from '@/lib/sound'

export default function CategorySelector({ onSelectCategory }) {
  const handleSelect = (id) => {
    soundEffects.playClick()
    onSelectCategory(id)
  }

  return (
    <div className="w-full text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 font-bold text-sm mb-3">
        <Sparkles className="w-4 h-4 text-amber-500" /> เลือกภารกิจวันนี้
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-stone-800 mb-8">
        ผจญภัยในดินแดนความรู้
      </h2>

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
