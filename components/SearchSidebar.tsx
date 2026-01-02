'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchSidebar() {
  const router = useRouter()
  // Các state lưu giá trị tìm kiếm
  const [word, setWord] = useState('')
  const [pinyin, setPinyin] = useState('')
  const [radical, setRadical] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Chuyển hướng về trang chủ kèm theo tham số tìm kiếm trên URL
    // Ví dụ: /?q=thiên&type=word
    // Ở đây mình làm đơn giản là build query string
    const params = new URLSearchParams()
    if (word) params.set('w', word)
    if (pinyin) params.set('p', pinyin)
    if (radical) params.set('r', radical)
    
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="w-full md:w-64 flex-shrink-0 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-stone-800 mb-4 pb-2 border-b border-stone-300">
          Tra cứu
        </h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-stone-600 mb-1">Hán tự (Phồn thể)</label>
            <input
              type="text"
              className="w-full p-2 border border-stone-300 rounded focus:ring-2 focus:ring-blue-800 outline-none"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Ví dụ: 天"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-600 mb-1">Pinyin</label>
            <input
              type="text"
              className="w-full p-2 border border-stone-300 rounded focus:ring-2 focus:ring-blue-800 outline-none"
              value={pinyin}
              onChange={(e) => setPinyin(e.target.value)}
              placeholder="Ví dụ: tian"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-600 mb-1">Bộ thủ</label>
            <input
              type="text"
              className="w-full p-2 border border-stone-300 rounded focus:ring-2 focus:ring-blue-800 outline-none"
              value={radical}
              onChange={(e) => setRadical(e.target.value)}
              placeholder="Ví dụ: 一"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1e40af] text-white py-2 px-4 rounded hover:bg-blue-800 transition-colors font-bold"
          >
            Tra cứu
          </button>
        </form>
      </div>
      
      {/* Phần giới thiệu nhỏ hoặc link khác */}
      <div className="text-sm text-stone-500 pt-6 border-t border-stone-200">
        <p>Hệ thống tra cứu Thuyết Văn Giải Tự phiên bản Tiếng Việt.</p>
      </div>
    </div>
  )
}