'use client'

import { motion } from 'framer-motion'
import AudioButton from '@/components/ui/AudioButton'
import ShapeRenderer from '@/components/ui/ShapeRenderer'

export default function PatternGame({ question, onAnswer, onReplayAudio }) {
  if (!question) return null

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <AudioButton onClick={onReplayAudio} />

      {/* Pattern Sequence Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 bg-stone-200 p-5 rounded-2xl border-4 border-stone-300 shadow-inner">
        {question.sequence.map((item, idx) => (
          <div key={idx} className="flex items-center justify-center">
            <ShapeRenderer item={item} size={58} className="text-5xl" />
          </div>
        ))}
        <div className="w-16 h-16 border-4 border-dashed border-amber-500 bg-amber-100 rounded-xl flex items-center justify-center text-3xl font-black text-amber-600 animate-pulse">
          ?
        </div>
      </div>

      {/* Answer Options */}
      <div className="flex flex-wrap justify-center gap-4 w-full">
        {question.options.map((opt) => (
          <motion.button
            key={opt.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onAnswer(opt.isCorrect)}
            className="bg-white border-4 border-stone-200 border-b-8 border-b-stone-300 hover:border-amber-400 hover:border-b-amber-500 rounded-2xl p-5 shadow-md transition active:border-b-4 active:translate-y-1 flex items-center justify-center min-w-[90px] min-h-[90px] cursor-pointer"
          >
            <ShapeRenderer item={opt.icon} size={64} className="text-5xl" />
          </motion.button>
        ))}
      </div>
    </div>
  )
}
