import { NextResponse } from 'next/server'

const questionsDatabase = {
  listening: [
    {
      id: 'l1',
      audioText:
        'กระต่ายน้อยตัวสีขาว กำลังกินแครอทอยู่ในสวน ให้กดเลือกสัตว์ที่อยู่ในเรื่องครับ',
      audioUrl: null, // ใส่ URL ไฟล์ .mp3 ได้ถ้ามี
      options: [
        { id: 'a', icon: '🐰', text: 'กระต่าย', isCorrect: true },
        { id: 'b', icon: '🐶', text: 'สุนัข', isCorrect: false },
        { id: 'c', icon: '🐱', text: 'แมว', isCorrect: false },
        { id: 'd', icon: '🐵', text: 'ลิง', isCorrect: false }
      ]
    }
  ],
  spatial: [
    {
      id: 's1',
      audioText: 'ภาพวัตถุใดที่มีรูปร่างเป็นวงกลมเหมือนกับลูกบอลครับ',
      audioUrl: null,
      options: [
        { id: 'a', icon: '⚽', text: 'ฟุตบอล', isCorrect: true },
        { id: 'b', icon: '📦', text: 'กล่อง', isCorrect: false },
        { id: 'c', icon: '📐', text: 'ไม้บรรทัด', isCorrect: false },
        { id: 'd', icon: '🖼️', text: 'กรอบรูป', isCorrect: false }
      ]
    }
  ],
  pattern: [
    {
      id: 'p1',
      audioText:
        'สังเกตแบบรูป แอปเปิ้ล ส้ม แอปเปิ้ล ส้ม ภาพต่อไปควรเป็นอะไรครับ',
      sequence: ['🍎', '🍊', '🍎', '🍊'],
      options: [
        { id: 'a', icon: '🍎', isCorrect: true },
        { id: 'b', icon: '🍊', isCorrect: false },
        { id: 'c', icon: '🍌', isCorrect: false }
      ]
    }
  ],
  simon: [
    {
      id: 'm1',
      audioText: 'คุณครูสั่งว่า ให้เลือกรูปดาวก่อน แล้วค่อยเลือกรูปหัวใจครับ',
      correctSequence: ['⭐', '❤️'],
      options: ['⭐', '❤️', '🌙', '☁️']
    }
  ]
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  if (category && questionsDatabase[category]) {
    return NextResponse.json({
      success: true,
      data: questionsDatabase[category]
    })
  }

  return NextResponse.json({ success: true, data: questionsDatabase })
}
