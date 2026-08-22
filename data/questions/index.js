import listeningQuestions from './listening.json'
import spatialQuestions from './spatial.json'
import patternQuestions from './pattern.json'
import simonQuestions from './simon.json'
import { shuffleArray } from '@/lib/utils'

export const QUESTION_BANK = {
  listening: listeningQuestions,
  spatial: spatialQuestions,
  pattern: patternQuestions,
  simon: simonQuestions
}

export function getQuestionsByCategory(category) {
  return QUESTION_BANK[category] || null
}

/**
 * Generates a balanced mock exam pulling questions from all 4 categories
 * @param {number} totalCount - Total questions wanted (e.g. 10 or 20)
 * @returns {Array} Shuffled mixed exam questions with category tagged
 */
export function generateMockExam(totalCount = 10) {
  const categories = ['listening', 'spatial', 'pattern', 'simon']
  const perCategory = Math.ceil(totalCount / categories.length)
  let mixed = []

  categories.forEach((cat) => {
    const list = shuffleArray(QUESTION_BANK[cat] || []).slice(0, perCategory)
    list.forEach((q) => {
      mixed.push({ ...q, category: cat })
    })
  })

  // Shuffle the final combined list and slice to exact count
  return shuffleArray(mixed).slice(0, totalCount)
}
