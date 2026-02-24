'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Character } from '@/types'
import SearchSidebar from '@/components/SearchSidebar'
import Pagination from '@/components/Pagination'
// Import bộ máy tìm kiếm cục bộ mà chúng ta đã thiết lập ở bước trước
import { localDb } from '@/lib/db' 

const ITEMS_PER_PAGE = 10

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [results, setResults] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)

  // Lấy các tham số từ URL
  const w = searchParams.get('w')
  const p = searchParams.get('p')
  const r = searchParams.get('r')
  const currentPage = Number(searchParams.get('page')) || 1

  // Kiểm tra xem có đang thực hiện tìm kiếm không
  const isSearching = !!(w || p || r)

  useEffect(() => {
    const fetchResults = () => {
      setLoading(true)
      
      try {
        // Gọi hàm search từ local database (chạy trực tiếp trên RAM máy khách)
        const { data, count } = localDb.search({
          w,
          p,
          r,
          page: currentPage,
          limit: ITEMS_PER_PAGE
        })

        // LOGIC: Tự động chuyển hướng nếu tìm thấy đúng 1 kết quả khi đang search
        if (isSearching && count === 1 && data.length > 0) {
          router.push(`/word/${data[0].id}`)
          return
        }

        setResults(data as Character[])
        setTotalRecords(count)
      } catch (err) {
        console.error('Lỗi truy xuất dữ liệu local:', err)
        setResults([])
        setTotalRecords(0)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [w, p, r, currentPage, router, isSearching])

  // Giao diện khi đang tải (với dữ liệu local thường sẽ rất nhanh)
  if (loading && results.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-stone-400"></div>
      </div>
    )
  }

  return (
    <div>
       {/* Tiêu đề linh hoạt */}
       <div className="mb-6 flex items-center justify-between">
         <h2 className="text-xl font-serif text-stone-700 font-bold border-b-2 border-stone-200 pb-2">
           {isSearching ? 'Kết quả tìm kiếm' : 'Danh sách toàn bộ chữ'}
           <span className="text-stone-500 font-normal ml-2 text-base">({totalRecords} chữ)</span>
         </h2>
       </div>

       {/* Danh sách chữ Hán */}
       <div className="space-y-4">
         {results.map((char) => (
           <div key={char.id} className="p-4 rounded border border-stone-200 hover:border-stone-400 hover:shadow-sm bg-[#faf9f6] transition-all duration-200 group">
              <Link href={`/word/${char.id}`} className="grid grid-cols-12 gap-4 items-center">
                {/* ID chữ */}
                <div className="col-span-1 text-stone-400 text-xs font-mono group-hover:text-stone-600">
                  #{char.id}
                </div>
                
                {/* Chữ Hán to (Khải thư) */}
                <div className="col-span-1 text-3xl font-serif text-[#1e40af] font-bold">
                  {char.wordhead}
                </div>
                
                {/* Bộ thủ */}
                <div className="col-span-1 text-stone-500 font-serif">
                    {char.radical}
                </div>
                
                {/* Phiên âm Pinyin */}
                <div className="col-span-2 text-stone-600 font-medium">
                    {char.pinyin}
                </div>

                {/* Âm Hán Việt và Giải thích */}
                <div className="col-span-7">
                    <p className="text-stone-800 font-serif text-sm line-clamp-1 mb-1 font-bold">
                        {char.hanviet || <span className="text-stone-300 italic font-normal">Chưa có âm Hán Việt</span>}
                    </p>
                    <p className="text-stone-500 text-xs truncate font-serif italic">
                        {char.explanation}
                    </p>
                </div>
              </Link>
           </div>
         ))}

         {/* Thông báo khi không có kết quả */}
         {results.length === 0 && !loading && isSearching && (
           <div className="text-center py-12 bg-stone-50 rounded border border-stone-100 border-dashed">
                <p className="text-stone-500 text-lg font-serif">Không tìm thấy chữ nào khớp với tìm kiếm.</p>
                <p className="text-stone-400 text-sm mt-2">Hãy kiểm tra lại từ khóa hoặc bộ thủ.</p>
           </div>
         )}
       </div>

       {/* Thanh phân trang */}
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
        
        {/* Cột trái: Sidebar tìm kiếm */}
        <aside className="w-full md:w-1/4 flex-shrink-0">
            <Suspense fallback={<div className="h-64 bg-stone-100 animate-pulse rounded"></div>}>
                <SearchSidebar />
            </Suspense>
        </aside>

        {/* Cột phải: Hiển thị kết quả */}
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