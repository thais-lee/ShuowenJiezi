'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Character } from '@/types'
import SearchSidebar from '@/components/SearchSidebar'

function SearchResults() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)

  // Lấy params từ URL
  const w = searchParams.get('w')
  const p = searchParams.get('p')
  const r = searchParams.get('r')

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      let query = supabase.from('characters').select('id, wordhead, pinyin, radical, explanation, hanviet').limit(20)

      // Logic lọc dữ liệu
      if (w) query = query.ilike('wordhead', `%${w}%`)
      if (p) query = query.ilike('pinyin', `%${p}%`)
      if (r) query = query.eq('radical', r) // Bộ thủ thường tìm chính xác

      // Nếu không có gì thì lấy ngẫu nhiên hoặc mặc định (tùy bạn)
      if (!w && !p && !r) {
         // Mặc định lấy 10 chữ đầu tiên
      }

      const { data, error } = await query
      if (!error && data) setResults(data as Character[])
      setLoading(false)
    }

    fetchResults()
  }, [w, p, r]) // Chạy lại khi URL params thay đổi

  return (
    <div className="flex-1">
       {/* Tiêu đề bảng */}
       <div className="grid grid-cols-12 gap-4 border-b border-stone-300 pb-2 mb-4 font-bold text-stone-700 text-sm uppercase tracking-wide">
          <div className="col-span-1">Hán tự</div>
          <div className="col-span-1">Bộ</div>
          <div className="col-span-2">Pinyin</div>
          <div className="col-span-8">Thuyết Văn Nguyên Văn</div>
       </div>

       {/* Danh sách kết quả */}
       {loading ? (
         <div className="text-stone-500">Đang tải dữ liệu...</div>
       ) : (
         <div className="space-y-2">
           {results.map((char) => (
             <div key={char.id} className="group hover:bg-stone-100 transition-colors rounded p-2 -mx-2">
                <Link href={`/word/${char.id}`} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 text-2xl font-serif text-[#1e40af] font-bold">
                    {char.wordhead}
                  </div>
                  <div className="col-span-1 text-stone-500">{char.radical}</div>
                  <div className="col-span-2 text-stone-600 font-medium">{char.pinyin}</div>
                  <div className="col-span-8 text-stone-600 text-sm truncate font-serif">
                    {char.explanation}
                  </div>
                </Link>
             </div>
           ))}
           {results.length === 0 && !loading && (
             <p className="text-stone-500 italic">Chưa có từ khóa tìm kiếm hoặc không tìm thấy kết quả.</p>
           )}
         </div>
       )}
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-6 md:p-10 font-sans text-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        <SearchSidebar />
        <Suspense fallback={<div>Loading...</div>}>
          <SearchResults />
        </Suspense>
      </div>
    </main>
  )
}