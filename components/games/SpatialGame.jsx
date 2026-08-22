'use client'

import { motion } from 'framer-motion'
import AudioButton from '@/components/ui/AudioButton'

export default function SpatialGame({ question, onAnswer, onReplayAudio }) {
  if (!question) return null

  return (
    <div className="w-full flex flex-col items-center">
      <AudioButton onClick={onReplayAudio} />

      <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl">
        {question.options.map((opt) => (
          <motion.button
            key={opt.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAnswer(opt.isCorrect)}
            className="bg-white hover:bg-sky-50 border-4 border-stone-200 hover:border-sky-400 border-b-8 border-b-stone-300 hover:border-b-sky-500 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[160px] shadow-md transition active:border-b-4 active:translate-y-1 cursor-pointer"
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
    </div>
  )
}
