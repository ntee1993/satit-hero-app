'use client'

import { Home, Compass, Flame, BarChart2 } from 'lucide-react'
import { soundEffects } from '@/lib/sound'

export default function HudBar({
  currentCategory,
  onHomeClick,
  onOpenParentDashboard,
  level,
  expProgress,
  stars
}) {
  const handleHome = () => {
    soundEffects.playClick()
    onHomeClick()
  }

  const handleOpenReport = () => {
    soundEffects.playClick()
    onOpenParentDashboard?.()
  }

  return (
    <header className="w-full max-w-4xl bg-stone-800 border-4 border-b-8 border-stone-900 rounded-3xl p-4 mb-6 shadow-2xl flex flex-wrap justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        {currentCategory ? (
          <button
            onClick={handleHome}
            className="p-3 bg-amber-500 hover:bg-amber-400 border-b-4 border-amber-700 rounded-2xl transition shadow-md active:translate-y-1 active:border-b-0 cursor-pointer"
            aria-label="กลับหน้าหลัก"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
        ) : (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl">
            <Compass className="w-6 h-6 text-emerald-400" />
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wide drop-shadow-[0_2px_0_#000]">
            SATIT CRAFT{' '}
            <span className="text-xs px-2 py-1 rounded-lg bg-emerald-500 text-stone-900 font-black">
              PRO
            </span>
          </h1>
          <p className="text-xs text-stone-300 font-medium">
            แอปเตรียมพร้อม ป.1 สนุกทุกวัน
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: PARENT REPORT + EXP & STAR COUNTER */}
      <div className="flex items-center gap-3">
        {/* Parent Dashboard Button */}
        <button
          onClick={handleOpenReport}
          className="p-2.5 bg-stone-700 hover:bg-stone-600 border-2 border-stone-600 hover:border-amber-400 text-amber-300 hover:text-amber-200 rounded-2xl transition flex items-center gap-1.5 text-xs font-bold shadow-md active:scale-95 cursor-pointer"
          title="รายงานผลสำหรับผู้ปกครอง"
          aria-label="รายงานผลสำหรับผู้ปกครอง"
        >
          <BarChart2 className="w-5 h-5 text-amber-400" />
          <span className="hidden sm:inline">รายงานผล</span>
        </button>

        {/* EXP & STAR COUNTER */}
        <div className="flex items-center gap-3 sm:gap-4 bg-stone-950 px-4 sm:px-5 py-2 rounded-2xl border-2 border-stone-700">
          <div className="flex flex-col items-end">
            <span className="text-xs font-black text-amber-400 flex items-center gap-1">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" /> LVL {level}
            </span>
            <div className="w-24 sm:w-32 h-3 bg-stone-800 rounded-full overflow-hidden mt-1 border border-stone-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-lime-400 transition-all duration-500"
                style={{ width: `${expProgress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-500 px-3 py-1 rounded-xl border-b-4 border-emerald-700">
            <span className="text-lg sm:text-xl">💎</span>
            <span className="text-lg sm:text-xl font-black text-white drop-shadow">
              {stars}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
