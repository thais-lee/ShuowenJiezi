import { supabase } from '@/lib/supabase';
import { Character } from '@/types'; // Import interface từ file types bạn vừa sửa
import SearchSidebar from '@/components/SearchSidebar';
import Link from 'next/link';
import Image from 'next/image';

// Hàm lấy dữ liệu từ Supabase
async function getCharacter(id: string) {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as Character;
}

// Next.js 15 yêu cầu params là Promise, ta await nó để an toàn cho cả bản cũ và mới
export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const char = await getCharacter(id);

  // Nếu không tìm thấy chữ, trả về trang 404 hoặc giao diện báo lỗi
  if (!char) {
    return (
      <div className="min-h-screen bg-[#faf9f6] p-10 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-stone-300 mb-4">404</h1>
          <p className="text-stone-600">Không tìm thấy dữ liệu cho ID: {id}</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 block">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white p-6 md:p-10 font-sans text-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Sidebar: Để người dùng tiện tra cứu tiếp */}
        <div className="hidden md:block">
          <SearchSidebar />
        </div>

        {/* --- NỘI DUNG CHÍNH --- */}
        <div className="flex-1">
          {/* 1. Header: Thông tin định danh (Quyển, Bộ, Pinyin, Phiên thiết) */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold mb-6 border-b border-stone-200 pb-4">
            <span className="text-[#1e40af]">Quyển {char.volume}</span>
            <span className="text-stone-300">|</span>

            <span className="text-[#1e40af]">Bộ {char.radical}</span>
            <span className="text-stone-300">|</span>

            <span className="text-stone-600 font-sans text-base">
              {char.pinyin}
            </span>

            {/* Hiển thị Phiên thiết nếu có */}
            {char.fanqie && (
              <>
                <span className="text-stone-300">|</span>
                <span className="text-stone-800 font-mingliu bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  {char.fanqie}
                </span>
              </>
            )}
          </div>

          {/* 2. Phần hiển thị Chữ Hán lớn & Giải thích gốc */}
          <div className="flex-col gap-8 items-start mb-10 border-b border-stone-200 pb-10 md:pb-12">
            {/* 2. Phần hiển thị Chữ Hán & Ảnh đối sánh */}
            <div className="flex gap-10 items-start pb-10">
              {/* --- CỘT 1: KHẢI THƯ (CHỮ HIỆN NAY) --- */}
              <div className="flex flex-col items-center gap-3">
                {/* Ô chứa chữ */}
                <div className="w-40 h-40 flex-shrink-0 flex items-center justify-center border-2 border-stone-300 bg-white text-9xl font-serif text-black shadow-sm rounded-lg">
                  {char.wordhead}
                </div>
                {/* Nhãn to bên dưới */}
                <span className="text-lg font-bold text-stone-600">
                  Khải Thư
                </span>
              </div>
              {/* --- CỘT 2: TIỂU TRIỆN (CRAWL ĐƯỢC) --- */}
              <div className="flex flex-col items-center gap-3">
                {/* Ô chứa ảnh */}
                <div className="w-40 h-40 flex-shrink-0 border-2 border-stone-300 bg-[#faf9f6] shadow-sm rounded-lg relative overflow-hidden group">
                  {char.image_url ? (
                    <Image
                      src={char.image_url}
                      alt={`Tiểu triện của ${char.wordhead}`}
                      fill
                      className="object-contain p-4 opacity-90 group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    /* Fallback khi không có ảnh */
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-7xl font-seal text-stone-300">
                        {char.wordhead}
                      </span>
                    </div>
                  )}
                </div>
                {/* Nhãn to bên dưới */}
                <span className="text-lg font-bold text-stone-600">
                  Tiểu Triện
                </span>
              </div>
            </div>

            {/* Giải thích của Hứa Thận */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3 font-mingliu flex items-baseline gap-3">
                {char.wordhead}
                {char.hanviet && (
                  <span className="text-lg font-normal text-stone-500 font-sans">
                    ({char.hanviet})
                  </span>
                )}
              </h1>
              <div className="font-mingliu text-xl text-stone-900 leading-relaxed pl-4 border-l-4 border-stone-800">
                {char.explanation}
              </div>
            </div>
          </div>

          {/* 3. Phần Dị thể / Cổ văn (Variants) - Nếu có */}
          {char.variants && char.variants.length > 0 && (
            <div className="mb-10 p-5 bg-stone-50 rounded border border-stone-200 dashed">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
                Cổ văn / Dị thể
              </h3>
              <div className="flex flex-wrap gap-4">
                {char.variants.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white px-4 py-2 rounded shadow-sm border border-stone-100"
                  >
                    {/* Hiển thị chữ dị thể */}
                    <span className="text-6xl font-mingliu text-stone-800">
                      {v.wordhead}
                    </span>

                    {/* Giải thích nhỏ */}
                    <div className="flex flex-col border-l pl-3 border-stone-200">
                      <span className="text-xl text-stone-600 font-mingliu">
                        {v.explanation}
                      </span>
                      {/* Nếu có triện thư (ảnh hoặc ký tự đặc biệt) thì hiện ở đây
                      {v.seal_character && (
                        <span className="text-xl text-stone-400">
                          Triện:{' '}
                          <span className="font-seal text-8xl align-middle">
                            {v.seal_character}
                          </span>
                        </span>
                      )} */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Phần Đoàn Ngọc Tài Chú (Quan trọng nhất) */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-stone-800 border-b-2 border-stone-800 inline-block pb-1">
              Thanh đại · Đoàn Ngọc Tài《Thuyết văn giải tự chú》
            </h3>

            <div className="bg-[#faf9f6] p-6 rounded border border-stone-200">
              <div className="text-stone-800 space-y-6 font-mingliu text-lg leading-relaxed">
                {char.duan_notes && char.duan_notes.length > 0 ? (
                  char.duan_notes.map((item, index) => (
                    <div key={index} className="group">
                      {/* Phần Explanation (Giải thích lại nghĩa gốc) - In đậm */}
                      <div className="font-semibold text-2xl text-stone-900 mb-2 font-mingliu">
                        {item.explanation}
                      </div>

                      {/* Phần Note (Lời chú giải chi tiết) - Thụt đầu dòng, màu nhạt hơn */}
                      <div className="text-stone-700 pl-4 border-l-2 border-stone-300 text-justify text-base font-mingliu">
                        {item.note}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="italic text-stone-400 text-sm">
                    Chưa có dữ liệu chú giải chi tiết.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 5. Phần thông tin Tiếng Việt (Footer) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 pt-8 border-t border-stone-200">
            {/* Âm Hán Việt */}
            <div className="bg-stone-50 p-5 rounded border border-stone-200">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
                Âm Hán Việt
              </h3>
              <p className="font-mingliu text-2xl text-[#1e40af] font-bold">
                {char.hanviet || (
                  <span className="text-stone-300 font-normal italic text-base">
                    Đang cập nhật...
                  </span>
                )}
              </p>
            </div>

            {/* Dịch nghĩa */}
            <div className="bg-stone-50 p-5 rounded border border-stone-200">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
                Dịch Nghĩa Tiếng Việt
              </h3>
              <div className="font-mingliu text-stone-800 leading-relaxed">
                {char.meaning_vi ? (
                  <p>{char.meaning_vi}</p>
                ) : (
                  <p className="text-stone-400 italic text-sm">
                    Nội dung đang được biên soạn...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Nút quay lại */}
          <div className="mt-12 mb-20">
            <Link
              href="/"
              className="inline-flex items-center text-stone-500 hover:text-stone-900 transition-colors"
            >
              <span className="mr-2">←</span> Quay lại trang tìm kiếm
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
