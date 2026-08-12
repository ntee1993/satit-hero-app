import { NextResponse } from 'next/server'

// 📚 คลังโจทย์เตรียมพร้อม ป.1
const questionBank = {
  // 1. ฟังจับใจความ
  listening: [
    {
      id: 'l1',
      audioText: 'เจ้ากระต่ายน้อยกินแครอทสีส้มอยู่ในสวน',
      options: [
        { id: '1', icon: '🐰', text: 'กระต่าย', isCorrect: true },
        { id: '2', icon: '🦊', text: 'สุนัขจิ้งจอก', isCorrect: false },
        { id: '3', icon: '🐱', text: 'แมว', isCorrect: false },
        { id: '4', icon: '🐻', text: 'หมี', isCorrect: false }
      ]
    },
    {
      id: 'l2',
      audioText: 'คุณแม่ซื้อแอปเปิลสีแดงผลใหญ่มาจากตลาด',
      options: [
        { id: '1', icon: '🍌', text: 'กล้วย', isCorrect: false },
        { id: '2', icon: '🍎', text: 'แอปเปิล', isCorrect: true },
        { id: '3', icon: '🍉', text: 'แตงโม', isCorrect: false },
        { id: '4', icon: '🍊', text: 'ส้ม', isCorrect: false }
      ]
    },
    {
      id: 'l3',
      audioText: 'นกตัวสีฟ้ากำลังบินอยู่บนท้องฟ้าแจ่มใส',
      options: [
        { id: '1', icon: '🐟', text: 'ปลา', isCorrect: false },
        { id: '2', icon: '🐦', text: 'นก', isCorrect: true },
        { id: '3', icon: '🐸', text: 'กบ', isCorrect: false },
        { id: '4', icon: '🦋', text: 'ผีเสื้อ', isCorrect: false }
      ]
    },
    {
      id: 'l4',
      audioText: 'น้องม้าลายวิ่งเล่นอยู่ในทุ่งหญ้าสีเขียว',
      options: [
        { id: '1', icon: '🦓', text: 'ม้าลาย', isCorrect: true },
        { id: '2', icon: '🐘', text: 'ช้าง', isCorrect: false },
        { id: '3', icon: '🦒', text: 'ยีราฟ', isCorrect: false },
        { id: '4', icon: '🦁', text: 'สิงโต', isCorrect: false }
      ]
    },
    {
      id: 'l5',
      audioText: 'เด็กๆ ชอบกินไอศกรีมเย็นๆ ในวันฤดูร้อน',
      options: [
        { id: '1', icon: '🍕', text: 'พิซซ่า', isCorrect: false },
        { id: '2', icon: '🍔', text: 'แฮมเบอร์เกอร์', isCorrect: false },
        { id: '3', icon: '🍦', text: 'ไอศกรีม', isCorrect: true },
        { id: '4', icon: '🍩', text: 'โดนัท', isCorrect: false }
      ]
    }
  ],

  // 2. มิติสัมพันธ์ (สังเกต ทิศทาง รูปร่าง)
  spatial: [
    {
      id: 's1',
      audioText: 'ข้อใดคือรูปทรงกลมสีฟ้า',
      options: [
        { id: '1', icon: '🔵', text: '', isCorrect: true },
        { id: '2', icon: '🟦', text: '', isCorrect: false },
        { id: '3', icon: '🔺', text: '', isCorrect: false },
        { id: '4', icon: '⭐', text: '', isCorrect: false }
      ]
    },
    {
      id: 's2',
      audioText: 'เลือกรูปสามเหลี่ยมสีแดง',
      options: [
        { id: '1', icon: '🟩', text: '', isCorrect: false },
        { id: '2', icon: '🔺', text: '', isCorrect: true },
        { id: '3', icon: '🟡', text: '', isCorrect: false },
        { id: '4', icon: '💎', text: '', isCorrect: false }
      ]
    },
    {
      id: 's3',
      audioText: 'รูปใดคือดวงดาวสีเหลืองสว่าง',
      options: [
        { id: '1', icon: '🌙', text: '', isCorrect: false },
        { id: '2', icon: '☀️', text: '', isCorrect: false },
        { id: '3', icon: '⭐', text: '', isCorrect: true },
        { id: '4', icon: '☁️', text: '', isCorrect: false }
      ]
    },
    {
      id: 's4',
      audioText: 'รูปสี่เหลี่ยมสีเขียวคือข้อใด',
      options: [
        { id: '1', icon: '🟩', text: '', isCorrect: true },
        { id: '2', icon: '🔴', text: '', isCorrect: false },
        { id: '3', icon: '🔷', text: '', isCorrect: false },
        { id: '4', icon: '🟧', text: '', isCorrect: false }
      ]
    },
    {
      id: 's5',
      audioText: 'ข้อใดคือหัวใจสีชมพู',
      options: [
        { id: '1', icon: '💖', text: '', isCorrect: true },
        { id: '2', icon: '💜', text: '', isCorrect: false },
        { id: '3', icon: '💙', text: '', isCorrect: false },
        { id: '4', icon: '🖤', text: '', isCorrect: false }
      ]
    }
  ],

  // 3. อนุกรมรูปทรง (Pattern / Sequence)
  pattern: [
    {
      id: 'p1',
      audioText: 'เรียงลำดับ แอปเปิล ส้ม แอปเปิล รูปถัดไปคืออะไร',
      sequence: ['🍎', '🍊', '🍎'],
      options: [
        { id: '1', icon: '🍊', isCorrect: true },
        { id: '2', icon: '🍎', isCorrect: false },
        { id: '3', icon: '🍌', isCorrect: false }
      ]
    },
    {
      id: 'p2',
      audioText: 'เรียงลำดับ ดาว หัวใจ ดาว หัวใจ รูปถัดไปคืออะไร',
      sequence: ['⭐', '❤️', '⭐', '❤️'],
      options: [
        { id: '1', icon: '❤️', isCorrect: false },
        { id: '2', icon: '⭐', isCorrect: true },
        { id: '3', icon: '🌙', isCorrect: false }
      ]
    },
    {
      id: 'p3',
      audioText: 'เรียงลำดับ รถ นก รถ นก รูปถัดไปคืออะไร',
      sequence: ['🚗', '🐦', '🚗', '🐦'],
      options: [
        { id: '1', icon: '🚗', isCorrect: true },
        { id: '2', icon: '🐦', isCorrect: false },
        { id: '3', icon: '🚀', isCorrect: false }
      ]
    },
    {
      id: 'p4',
      audioText: 'เรียงลำดับ ไอศกรีม โดนัท ไอศกรีม โดนัท รูปถัดไปคืออะไร',
      sequence: ['🍦', '🍩', '🍦', '🍩'],
      options: [
        { id: '1', icon: '🍩', isCorrect: false },
        { id: '2', icon: '🍦', isCorrect: true },
        { id: '3', icon: '🍰', isCorrect: false }
      ]
    },
    {
      id: 'p5',
      audioText: 'เรียงลำดับ เพชร มงกุฎ เพชร รูปถัดไปคืออะไร',
      sequence: ['💎', '👑', '💎'],
      options: [
        { id: '1', icon: '👑', isCorrect: true },
        { id: '2', icon: '💎', isCorrect: false },
        { id: '3', icon: '🎁', isCorrect: false }
      ]
    }
  ],

  // 4. คำสั่งของซิมอน (Simon Says / Memory Sequence)
  simon: [
    {
      id: 'sm1',
      audioText: 'ซิมอนบอกว่า ให้เลือก ช้าง แล้วตามด้วย กบ',
      correctSequence: ['🐘', '🐸'],
      options: ['🐘', '🐸', '🐱', '🐶']
    },
    {
      id: 'sm2',
      audioText: 'ซิมอนบอกว่า ให้เลือก ดาว แล้วตามด้วย หัวใจ',
      correctSequence: ['⭐', '❤️'],
      options: ['⭐', '❤️', '🌙', '☀️']
    },
    {
      id: 'sm3',
      audioText: 'ซิมอนบอกว่า ให้เลือก แอปเปิล ส้ม แล้วตามด้วย กล้วย',
      correctSequence: ['🍎', '🍊', '🍌'],
      options: ['🍎', '🍊', '🍌', '🍇']
    },
    {
      id: 'sm4',
      audioText: 'ซิมอนบอกว่า ให้เลือก รถยนต์ แล้วตามด้วย เครื่องบิน',
      correctSequence: ['🚗', '✈️'],
      options: ['🚗', '✈️', '🚢', '🚀']
    },
    {
      id: 'sm5',
      audioText: 'ซิมอนบอกว่า ให้เลือก มงกุฎ เพชร แล้วตามด้วย มงกุฎ',
      correctSequence: ['👑', '💎', '👑'],
      options: ['👑', '💎', '🎁', '⭐']
    }
  ]
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  if (category && questionBank[category]) {
    // ดึงโจทย์ตาม Category และทำการสุ่มลำดับคำถาม (Shuffle)
    const list = [...questionBank[category]]
    const shuffled = list.sort(() => 0.5 - Math.random())

    return NextResponse.json({ success: true, data: shuffled })
  }

  return NextResponse.json({ success: false, data: [] }, { status: 400 })
}
