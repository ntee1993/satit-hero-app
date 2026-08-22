// Web Audio API Sound Effects (Zero external asset dependencies, instant response)

let audioCtx = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Play a tone with frequency, duration and envelope
 */
function playTone(freq, type = 'sine', duration = 0.15, startTime = 0, gainLevel = 0.2) {
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime)

  gain.gain.setValueAtTime(gainLevel, ctx.currentTime + startTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(ctx.currentTime + startTime)
  osc.stop(ctx.currentTime + startTime + duration)
}

export const soundEffects = {
  // Correct answer chime (C5 -> E5 -> G5)
  playCorrect: () => {
    playTone(523.25, 'triangle', 0.12, 0, 0.25)     // C5
    playTone(659.25, 'triangle', 0.12, 0.1, 0.25)   // E5
    playTone(783.99, 'triangle', 0.25, 0.2, 0.3)    // G5
  },

  // Wrong answer buzz (F3 -> C#3 gentle buzz)
  playWrong: () => {
    playTone(174.61, 'sawtooth', 0.18, 0, 0.15)    // F3
    playTone(138.59, 'sawtooth', 0.25, 0.15, 0.15)  // C#3
  },

  // Victory fanfare for completing category or exam
  playVictory: () => {
    playTone(523.25, 'triangle', 0.12, 0, 0.25)     // C5
    playTone(659.25, 'triangle', 0.12, 0.1, 0.25)   // E5
    playTone(783.99, 'triangle', 0.12, 0.2, 0.25)   // G5
    playTone(1046.50, 'triangle', 0.4, 0.3, 0.35)   // C6
  },

  // UI button click
  playClick: () => {
    playTone(800, 'sine', 0.04, 0, 0.1)
  },

  // Timer Tick (soft high tick)
  playTimerTick: () => {
    playTone(1200, 'sine', 0.03, 0, 0.05)
  },

  // Timer Urgent warning
  playTimerWarning: () => {
    playTone(880, 'sawtooth', 0.08, 0, 0.1)
  },

  // Simon button feedback
  playSimonBeep: (index = 0) => {
    const notes = [440, 554.37, 659.25, 880] // A4, C#5, E5, A5
    const freq = notes[index % notes.length]
    playTone(freq, 'sine', 0.15, 0, 0.2)
  }
}
