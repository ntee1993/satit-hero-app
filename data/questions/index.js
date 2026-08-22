import listeningQuestions from './listening.json'
import spatialQuestions from './spatial.json'
import patternQuestions from './pattern.json'
import simonQuestions from './simon.json'

export const QUESTION_BANK = {
  listening: listeningQuestions,
  spatial: spatialQuestions,
  pattern: patternQuestions,
  simon: simonQuestions
}

export function getQuestionsByCategory(category) {
  return QUESTION_BANK[category] || null
}
