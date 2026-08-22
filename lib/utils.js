/**
 * Shuffles an array using the unbiased Fisher-Yates algorithm
 * @template T
 * @param {T[]} array
 * @returns {T[]} A new shuffled array
 */
export function shuffleArray(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
