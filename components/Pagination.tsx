'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Pagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const searchParams = useSearchParams();

  // Hàm tạo URL giữ nguyên các tham số tìm kiếm cũ (w, p, r) chỉ thay đổi page
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `/?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8 font-sans">
      {/* Nút Previous */}
      <Link
        href={createPageUrl(currentPage - 1)}
        className={`px-3 py-1 border rounded ${
          currentPage <= 1
            ? 'pointer-events-none opacity-50 bg-gray-100'
            : 'hover:bg-gray-100'
        }`}
        aria-disabled={currentPage <= 1}
      >
        &laquo; Trước
      </Link>

      {/* Hiển thị số trang */}
      <span className="px-4 py-1 text-stone-600">
        Trang <strong className="text-black">{currentPage}</strong> /{' '}
        {totalPages}
      </span>

      {/* Nút Next */}
      <Link
        href={createPageUrl(currentPage + 1)}
        className={`px-3 py-1 border rounded ${
          currentPage >= totalPages
            ? 'pointer-events-none opacity-50 bg-gray-100'
            : 'hover:bg-gray-100'
        }`}
        aria-disabled={currentPage >= totalPages}
      >
        Sau &raquo;
      </Link>
    </div>
  );
}
