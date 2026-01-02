// Định nghĩa thêm kiểu cho Note
export interface DuanNote {
  note?: string; // Dấu ? nghĩa là có thể có hoặc không
  explanation?: string;
}

export interface Character {
  id: number;
  wordhead: string;
  pinyin: string | null;
  radical: string | null;
  volume: string | null;
  explanation: string | null;
  // Cập nhật dòng này: Thay vì string[], giờ là DuanNote[]
  duan_notes: DuanNote[] | null;
  hanviet: string | null;
  meaning_vi?: string | null;
}
