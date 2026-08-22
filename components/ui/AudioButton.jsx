'use client'

import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { soundEffects } from '@/lib/sound'

export default function AudioButton({ onClick, label = 'กดเพื่อฟังโจทย์เสียง' }) {
  const handleClick = () => {
    soundEffects.playClick()
    onClick?.()
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="bg-rose-500 hover:bg-rose-400 border-b-8 border-rose-700 text-white font-black py-4 px-8 rounded-2xl text-xl flex items-center gap-3 shadow-xl mb-8 active:border-b-0 active:translate-y-2 cursor-pointer"
    >
      <Volume2 className="w-8 h-8 text-amber-300 animate-bounce" />
      <span>{label}</span>
    </motion.button>
  )
}
