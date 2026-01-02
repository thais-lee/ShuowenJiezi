// 1. Định nghĩa kiểu cho một ghi chú của Đoàn Ngọc Tài
export interface DuanNote {
  explanation: string; // Phần giải thích (in đậm)
  note: string;        // Phần chú thích chi tiết
}

// 2. Định nghĩa kiểu cho một chữ Dị thể (Cổ văn / Triện thư)
export interface Variant {
  wordhead: string;       // Ví dụ: 弎
  explanation: string;    // Ví dụ: 古文三从弋。
  seal_character?: string; // Ký tự triện thư (nếu có)
}

// 3. Interface chính cho bảng Characters
export interface Character {
  id: number;
  wordhead: string;        // Chữ Hán chính (Ví dụ: 三)
  pinyin: string | null;
  radical: string | null;  // Bộ thủ
  volume: string | null;   // Quyển
  explanation: string | null; // Giải thích gốc (Hứa Thận)
  
  // Các cột thông tin tiếng Việt
  hanviet: string | null;     // Âm Hán Việt
  meaning_vi?: string | null; // Dịch nghĩa tiếng Việt (dấu ? để không bắt buộc)
  
  // Cột Phiên thiết (Mới thêm)
  fanqie: string | null;      

  // Các cột dữ liệu phức tạp (JSONB)
  duan_notes: DuanNote[] | null; // Mảng các ghi chú
  variants: Variant[] | null;    // Mảng các dị thể
}