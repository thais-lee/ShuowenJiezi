import { supabase } from '@/lib/supabase';
import { Character } from '@/types';
import SearchSidebar from '@/components/SearchSidebar';
import Link from 'next/link';

// Hàm lấy dữ liệu từ Server (không cần useEffect)
async function getCharacter(id: string) {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Character;
}

export default async function DetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Await params trước khi sử dụng (Yêu cầu của Next.js bản mới nhất)
  const { id } = await params;
  const char = await getCharacter(id);

  if (!char) {
    return <div className="p-10 text-center">Không tìm thấy chữ này.</div>;
  }

  return (
    <main className="min-h-screen bg-white p-6 md:p-10 font-sans text-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Sidebar vẫn giữ nguyên để tiện tra cứu tiếp */}
        <div className="hidden md:block">
          <SearchSidebar />
        </div>

        {/* Nội dung chính */}
        <div className="flex-1">
          {/* Breadcrumb / Thông tin header */}
          <div className="flex-col items-center gap-2 text-sm text-[#1e40af] font-bold mb-6">
            <div className="mb-2">
              <span>Quyển {char.volume}</span>
              <span>|</span>
              <span>
                Bộ {char.radical} ({char.radical}部)
              </span>
              <span>|</span>
              <span className="text-stone-500">{char.pinyin} (pinyin)</span>
            </div>
            <div>
              <span className="font-bold text-stone-500 text-sm uppercase mr-2">
                Phiên thiết:
              </span>
              <span className="font-serif text-sm text-stone-900">
                ... Nội dung đang được biên soạn
              </span>
            </div>
          </div>

          {/* Phần hiển thị chữ lớn */}
          <div className="flex gap-8 items-start border-b border-stone-200 pb-8 mb-8">
            <div className="w-32 h-32 flex items-center justify-center border border-stone-200 bg-stone-50 text-8xl font-serif text-black shadow-inner">
              {char.wordhead}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4 font-serif">
                {char.wordhead}{' '}
                <span className="text-lg font-normal text-stone-500">
                  ({char.hanviet})
                </span>
              </h1>
              <p className="text-xl font-serif text-stone-800 leading-relaxed ">
                {char.explanation}
              </p>
              <div className="">
                <span className="font-bold text-stone-500 text-sm uppercase mr-2">
                  Phiên Âm Hán Việt:
                </span>
                <span className="font-serif text-sm text-stone-900">
                  ... Nội dung đang được biên soạn
                </span>
              </div>
              <div className="mb-6 pb-4">
                <span className="font-bold text-stone-500 text-sm uppercase mr-2">
                  Dịch nghĩa:
                </span>
                <span className="font-serif text-sm text-stone-900">
                  ... Nội dung đang được biên soạn
                </span>
              </div>
            </div>
          </div>

          {/* Phần chú thích: Mô phỏng lại giao diện "Đoàn Ngọc Tài Chú" */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-stone-700 border-b border-stone-300 pb-2">
              Triều Thanh · Đoàn Ngọc Tài《Thuyết văn giải tự chú giải》
            </h3>

            <div className="bg-[#faf9f6] p-6 rounded border border-stone-200 shadow-sm">
              {/* Hiển thị nghĩa gốc */}
              <div className="mb-6 pb-4 border-b border-stone-200 border-dashed">
                <span className="font-bold text-stone-500 text-sm uppercase mr-2">
                  Nguyên văn:
                </span>
                <span className="font-serif text-xl text-stone-900">
                  {char.explanation}
                </span>
              </div>

              {/* Hiển thị mảng ghi chú (JSON Objects) */}
              <div className="text-stone-800 space-y-4 font-serif text-lg leading-relaxed">
                {char.duan_notes &&
                Array.isArray(char.duan_notes) &&
                char.duan_notes.length > 0 ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  char.duan_notes.map((item: any, index: number) => {
                    // Kiểm tra an toàn: Nếu item là string (data cũ) thì render thẳng
                    if (typeof item === 'string') {
                      return (
                        <p key={index} className="text-justify">
                          {item}
                        </p>
                      );
                    }

                    // Nếu item là Object {note, explanation} (Data mới gây lỗi)
                    return (
                      <div key={index} className="text-justify mb-3">
                        {/* Hiển thị phần note */}
                        {item.note && <span>{item.explanation}</span>}

                        {/* Hiển thị phần explanation (nếu có) - ví dụ in nghiêng hoặc màu khác */}
                        {item.explanation && (
                          <span className="block text-stone-500 text-base italic mt-1 ml-4">
                            ↳ {item.note}
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="italic text-stone-400 text-sm">
                    Chưa có dữ liệu chú giải.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t border-stone-200 pt-8">
            {/* Khối 1: Phiên Âm Hán Việt */}
            <div className="bg-stone-50 p-5 rounded border border-stone-200">
              <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-800 rounded-full"></span>
                Âm Hán Việt
              </h3>
              <p className="font-serif text-2xl text-stone-900 font-bold">
                {char.hanviet || (
                  <span className="text-stone-400 text-lg italic font-normal">
                    Đang cập nhật...
                  </span>
                )}
              </p>
            </div>

            {/* Khối 2: Dịch Nghĩa Tiếng Việt */}
            <div className="bg-stone-50 p-5 rounded border border-stone-200">
              <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                Dịch Nghĩa (Vietnamese)
              </h3>
              <div className="font-serif text-lg text-stone-800 leading-relaxed">
                {/* Nếu có dữ liệu thì hiện, không thì hiện text mờ */}
                {char.meaning_vi ? (
                  <p>{char.meaning_vi}</p>
                ) : (
                  <p className="text-stone-400 italic text-base">
                    Nội dung đang được biên soạn...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Nút điều hướng (Optional) */}
          <div className="mt-10 flex justify-between">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
