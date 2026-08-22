'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, RefreshCw } from 'lucide-react'

export default function FeedbackModal({ feedback }) {
  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-0 bg-stone-900/90 rounded-3xl flex flex-col items-center justify-center z-30 p-6 text-center"
        >
          {feedback === 'success' ? (
            <>
              <Trophy className="w-28 h-28 text-amber-400 animate-bounce mb-3 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
              <span className="text-4xl font-black text-emerald-400 drop-shadow-[0_2px_0_#000]">
                ถูกต้องแล้วครับ!
              </span>
              <span className="text-xl text-amber-300 font-extrabold mt-3 bg-amber-500/20 px-6 py-2 rounded-full border border-amber-400/30">
                +1 EXP 💎
              </span>
            </>
          ) : (
            <>
              <RefreshCw className="w-24 h-24 text-rose-400 animate-spin mb-3" />
              <span className="text-3xl font-black text-rose-400 drop-shadow-[0_2px_0_#000]">
                พยายามอีกนิดนะ!
              </span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
