'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Character } from '@/types'
import SearchSidebar from '@/components/SearchSidebar'
import Pagination from '@/components/Pagination' // Import component vừa tạo

const ITEMS_PER_PAGE = 10 // Số bản ghi 1 trang

function SearchResults() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0) // State lưu tổng số bản ghi

  // Lấy các tham số từ URL
  const w = searchParams.get('w')
  const p = searchParams.get('p')
  const r = searchParams.get('r')
  // Lấy trang hiện tại, mặc định là 1 nếu không có
  const currentPage = Number(searchParams.get('page')) || 1

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)

      // 1. Tính toán phạm vi (Pagination Logic)
      const from = (currentPage - 1) * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      // 2. Xây dựng Query
      let query = supabase
        .from('characters')
        .select('id, wordhead, pinyin, radical, explanation, hanviet', { count: 'exact' }) // count: 'exact' để lấy tổng số dòng
        .order('id', { ascending: true }) // SẮP XẾP THEO ID TĂNG DẦN
        .range(from, to) // GIỚI HẠN 10 BẢN GHI

      // Logic lọc dữ liệu (giữ nguyên)
      if (w) query = query.ilike('wordhead', `%${w}%`)
      if (p) query = query.ilike('pinyin', `%${p}%`)
      if (r) query = query.eq('radical', r)

      const { data, error, count } = await query

      if (!error && data) {
        setResults(data as Character[])
        setTotalRecords(count || 0) // Lưu tổng số bản ghi tìm thấy
      }
      setLoading(false)
    }

    fetchResults()
  }, [w, p, r, currentPage]) // Thêm currentPage vào dependency để chạy lại khi đổi trang

  // Tính tổng số trang
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE)

  return (
    <div className="flex-1 flex flex-col min-h-[500px]"> {/* Thêm min-h để không bị giật khi loading */}
       {/* Header bảng */}
       <div className="grid grid-cols-12 gap-4 border-b border-stone-300 pb-2 mb-4 font-bold text-stone-700 text-sm uppercase tracking-wide">
          <div className="col-span-1">ID</div> {/* Hiển thị thêm cột ID nếu muốn */}
          <div className="col-span-1">Hán tự</div>
          <div className="col-span-1">Bộ</div>
          <div className="col-span-2">Pinyin</div>
          <div className="col-span-7">Thuyết Văn Nguyên Văn</div>
       </div>

       {/* Danh sách kết quả */}
       <div className="flex-1">
         {loading ? (
           <div className="text-stone-500 py-10 text-center">Đang tải dữ liệu trang {currentPage}...</div>
         ) : (
           <div className="space-y-2">
             {results.map((char) => (
               <div key={char.id} className="group hover:bg-stone-100 transition-colors rounded p-2 -mx-2 border-b border-stone-100 last:border-0">
                  <Link href={`/word/${char.id}`} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 text-stone-400 text-xs">{char.id}</div>
                    <div className="col-span-1 text-2xl font-serif text-[#1e40af] font-bold">
                      {char.wordhead}
                    </div>
                    <div className="col-span-1 text-stone-500">{char.radical}</div>
                    <div className="col-span-2 text-stone-600 font-medium">{char.pinyin}</div>
                    <div className="col-span-7 text-stone-600 text-sm truncate font-serif">
                      {char.explanation}
                    </div>
                  </Link>
               </div>
             ))}
             {results.length === 0 && !loading && (
               <p className="text-stone-500 italic text-center mt-10">Không tìm thấy kết quả.</p>
             )}
           </div>
         )}
       </div>

       {/* PHÂN TRANG (Chỉ hiện khi có kết quả) */}
       {results.length > 0 && totalPages > 1 && (
         <Pagination totalPages={totalPages} currentPage={currentPage} />
       )}
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-6 md:p-10 font-sans text-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        <SearchSidebar />
        <Suspense fallback={<div>Đang tải bộ lọc...</div>}>
          <SearchResults />
        </Suspense>
      </div>
    </main>
  )
}