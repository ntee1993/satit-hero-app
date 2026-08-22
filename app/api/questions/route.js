import { NextResponse } from 'next/server'
import { getQuestionsByCategory } from '@/data/questions'
import { shuffleArray } from '@/lib/utils'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  if (!category) {
    return NextResponse.json({ success: false, data: [] }, { status: 400 })
  }

  const questions = getQuestionsByCategory(category)

  if (questions && questions.length > 0) {
    // Unbiased Fisher-Yates shuffle
    const shuffled = shuffleArray(questions)
    return NextResponse.json({ success: true, data: shuffled })
  }

  return NextResponse.json({ success: false, data: [] }, { status: 404 })
}
