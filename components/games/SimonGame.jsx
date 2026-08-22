'use client'

import { motion } from 'framer-motion'
import AudioButton from '@/components/ui/AudioButton'
import { soundEffects } from '@/lib/sound'

export default function SimonGame({
  question,
  simonInput,
  onSimonClick,
  onReplayAudio
}) {
  if (!question) return null

  const handleClick = (item, idx) => {
    soundEffects.playSimonBeep(idx)
    onSimonClick(item)
  }

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <AudioButton onClick={onReplayAudio} />

      {/* Input Sequence Display */}
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

      {/* Simon Options Grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {question.options.map((item, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleClick(item, idx)}
            className="bg-white border-4 border-stone-200 border-b-8 border-b-stone-300 hover:border-rose-400 hover:border-b-rose-500 rounded-2xl p-6 text-5xl shadow-md transition active:border-b-4 active:translate-y-1 cursor-pointer"
          >
            {item}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
