// src/lib/supabase.ts
// Supabase client mặc định dùng cho client-side và server-side requests
// - Sử dụng NEXT_PUBLIC_SUPABASE_* cho key mà client có thể truy cập (anon key).
// - Nếu cần thực thi tác vụ server-only với quyền rộng hơn (service_role),
//   tạo 1 client riêng trên server và chỉ dùng trong API/route server-side.

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // Bỏ check này nếu muốn khởi chạy trong môi trường test không có env (không khuyến khích)
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables.'
  )
}

/**
 * supabase: dùng chung cho client + server (anon key).
 * - Không đưa secret/service_role vào đây.
 * - Nếu bạn cần gọi các API server-only (ví dụ: bypass RLS), hãy tạo client
 *   mới trong mã server (API route / server action) sử dụng SUPABASE_SERVICE_ROLE_KEY.
 */
export const supabase: SupabaseClient = createClient(url, anonKey, {
  // Tùy chọn khuyên dùng:
  // - persistSession: false nếu bạn không dùng Supabase Auth session trên client mặc định
  // - global.fetch: nếu bạn muốn ép dùng fetch của Next (hiếm khi cần)
  auth: {
    persistSession: false,
  },
})

/**
 * createServerClient (helper)
 * Nếu cần 1 client chỉ chạy trên server (ví dụ: trong API route hoặc server action)
 * với service role key, bạn có thể dùng hàm này — tuy nhiên **TUYỆT ĐỐI** KHÔNG lưu
 * service_role key trong mã frontend hay biến NEXT_PUBLIC_*.
 *
 * Ví dụ sử dụng (trên server-only):
 *   const sb = createServerSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY!)
 *   const { data } = await sb.from('characters').select('*')
 */
export function createServerSupabaseClient(serviceRoleKey: string) {
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }
  // Dùng url giống trên, key là service role - chỉ dùng server-side
  return createClient(url!, serviceRoleKey, {
    auth: { persistSession: false },
  })
}

export default supabase
