/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/db.ts
import charactersData  from '@/data/characters.json';

const { cols, data } = charactersData as { cols: string[]; data: any[] };

// Helper để biến mảng [1, "一", ...] thành Object {id: 1, wordhead: "一", ...}
const mapToBox = (row: any[]) => {
  const obj = Object.fromEntries(cols.map((col, i) => [col, row[i]]));
  
  // Danh sách các cột cần được giải mã từ chuỗi JSON sang Array/Object
  const jsonCols = ['variants', 'duan_notes', 'seal_images'];
  
  jsonCols.forEach(col => {
    if (typeof obj[col] === 'string') {
      try {
        // Chuyển chuỗi "[{...}]" thành mảng thực thụ [{...}]
        obj[col] = JSON.parse(obj[col]);
      } catch (e) {
        // Nếu lỗi hoặc chuỗi rỗng thì gán mảng rỗng
        obj[col] = [];
      }
    } else if (!obj[col]) {
      obj[col] = [];
    }
  });

  return obj;
};

export const localDb = {
  // Tìm theo ID (cho trang chi tiết)
  getById: (id: string) => {
    const idIdx = cols.indexOf('id');
    const row = data.find(r => r[idIdx].toString() === id);
    return row ? mapToBox(row) : null;
  },

  // Tìm kiếm tổng hợp (cho trang chủ)
  search: ({ w, p, r, page = 1, limit = 10 }: any) => {
    const wIdx = cols.indexOf('wordhead');
    const pIdx = cols.indexOf('pinyin');
    const rIdx = cols.indexOf('radical');

    // Lọc dữ liệu
    const filtered = data.filter(row => {
      let match = true;
      if (w) match = match && row[wIdx]?.includes(w);
      if (p) match = match && row[pIdx]?.toLowerCase().includes(p.toLowerCase());
      if (r) match = match && row[rIdx] === r;
      return match;
    });

    // Phân trang
    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginatedData = filtered.slice(start, start + limit).map(mapToBox);

    return {
      data: paginatedData,
      count: total
    };
  }
};