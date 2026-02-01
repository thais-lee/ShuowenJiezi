'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Character } from '@/types'
import SearchSidebar from '@/components/SearchSidebar'
import Pagination from '@/components/Pagination'

const ITEMS_PER_PAGE = 10

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [results, setResults] = useState<Character[]>([])
  const [loading, setLoading] = useState(true) // Mặc định là true để load ngay khi vào
  const [totalRecords, setTotalRecords] = useState(0)

  // Lấy các tham số từ URL
  const w = searchParams.get('w')
  const p = searchParams.get('p')
  const r = searchParams.get('r')
  const currentPage = Number(searchParams.get('page')) || 1

  // Biến kiểm tra xem có đang tìm kiếm không
  const isSearching = !!(w || p || r);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      // Không clear results ngay lập tức để tránh nháy trang trắng khi chuyển page
      // setResults([]) 

      const from = (currentPage - 1) * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      let query = supabase
        .from('characters')
        .select('id, wordhead, pinyin, radical, explanation, hanviet', { count: 'exact' })
        .order('id', { ascending: true })
        .range(from, to)

      // Chỉ áp dụng filter nếu có tham số
      if (w) query = query.ilike('wordhead', `%${w}%`)
      if (p) query = query.ilike('pinyin', `%${p}%`)
      if (r) query = query.eq('radical', r)

      try {
        const { data, error, count } = await query

        if (error) throw error

        // --- LOGIC TỰ ĐỘNG CHUYỂN TRANG (Chỉ áp dụng khi ĐANG TÌM KIẾM) ---
        // Nếu không tìm kiếm (đang xem danh sách) thì dù count = 1 (trường hợp DB có 1 chữ) cũng ko nên redirect
        if (isSearching && count === 1 && data && data.length > 0) {
            const charId = data[0].id;
            router.push(`/word/${charId}`);
            return; 
        }
        // -----------------------------------------------------------------

        setResults(data as Character[])
        setTotalRecords(count || 0)
      } catch (err) {
        console.error('Lỗi tải dữ liệu:', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    // Luôn chạy hàm này mỗi khi URL thay đổi (dù có search hay không)
    fetchResults()

  }, [w, p, r, currentPage, router, isSearching])

  // Giao diện Loading
  if (loading && results.length === 0) {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-stone-400"></div>
        </div>
    )
  }

  return (
    <div>
       {/* Tiêu đề thay đổi linh hoạt */}
       <div className="mb-6 flex items-center justify-between">
         <h2 className="text-xl text-stone-700 font-bold border-b-2 border-stone-200 pb-2">
           {isSearching ? 'Kết quả tìm kiếm' : 'Danh sách toàn bộ chữ'}
           <span className="text-stone-500 font-normal ml-2 text-base">({totalRecords} chữ)</span>
         </h2>
       </div>

       {/* Danh sách kết quả */}
       <div className="space-y-4">
         {results.map((char) => (
           <div key={char.id} className="p-4 rounded border border-stone-200 hover:border-stone-400 hover:shadow-sm bg-[#faf9f6] transition-all duration-200 group">
              <Link href={`/word/${char.id}`} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1 text-stone-400 text-xs font-mono group-hover:text-stone-600">#{char.id}</div>
                
                {/* Chữ Hán to */}
                <div className="col-span-1 text-3xl font-serif text-[#1e40af] font-bold">
                  {char.wordhead}
                </div>
                
                {/* Bộ thủ */}
                <div className="col-span-1 text-stone-500 font-serif">
                    {char.radical}
                </div>
                
                {/* Pinyin */}
                <div className="col-span-2 text-stone-600 font-medium">
                    {char.pinyin}
                </div>

                {/* Giải thích */}
                <div className="col-span-7">
                    <p className="text-stone-800 text-sm line-clamp-1 mb-1 font-bold">
                        {char.hanviet || <span className="text-stone-300 italic">Chưa có âm Hán Việt</span>}
                    </p>
                    <p className="text-stone-500 text-xs truncate font-serif italic">
                        {char.explanation}
                    </p>
                </div>
              </Link>
           </div>
         ))}

         {/* Thông báo không tìm thấy (Chỉ hiện khi ĐANG tìm kiếm mà không có kết quả) */}
         {results.length === 0 && !loading && isSearching && (
           <div className="text-center py-12 bg-stone-50 rounded border border-stone-100 border-dashed">
                <p className="text-stone-500 text-lg ">Không tìm thấy kết quả nào phù hợp.</p>
                <p className="text-stone-400 text-sm mt-2">Hãy thử tìm với từ khóa khác.</p>
           </div>
         )}
         
         {/* Trường hợp Database trống trơn (Rất hiếm) */}
         {results.length === 0 && !loading && !isSearching && (
            <div className="text-center py-20">
                <p className="text-stone-500">Chưa có dữ liệu nào trong từ điển.</p>
            </div>
         )}
       </div>

       {/* Phân trang */}
       {results.length > 0 && Math.ceil(totalRecords / ITEMS_PER_PAGE) > 1 && (
         <div className="mt-8">
            <Pagination 
                totalPages={Math.ceil(totalRecords / ITEMS_PER_PAGE)} 
                currentPage={currentPage} 
            />
         </div>
       )}
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-6 md:p-10 font-sans text-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        
        {/* Sidebar tìm kiếm */}
        <aside className="w-full md:w-1/4 flex-shrink-0">
            <Suspense fallback={<div className="h-64 bg-stone-100 animate-pulse rounded"></div>}>
                <SearchSidebar />
            </Suspense>
        </aside>

        {/* Khu vực nội dung chính */}
        <section className="flex-1">
            <Suspense fallback={
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-400"></div>
                </div>
            }>
                <SearchResults />
            </Suspense>
        </section>
      </div>
    </main>
  )
}