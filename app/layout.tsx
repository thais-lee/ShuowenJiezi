import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

// 1. Cấu hình Font cho văn bản chính (bao gồm cả chữ hiếm)
// const hanNom = localFont({
//   src: [],
//   variable: '--font-hanNom', // Tên biến để dùng trong Tailwind
//   display: 'swap',
// });

const mingliu = localFont({
  src: [
    {
      path: './fonts/Ming-Lt-HKSCS-ExtB-03.ttf', // Đường dẫn tính từ file layout.tsx
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/MingLiU-ExtB-01.ttf', // Đường dẫn tính từ file layout.tsx
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/PMingLiU-ExtB-02.ttf', // Đường dẫn tính từ file layout.tsx
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-mingliu', // Tên biến để dùng trong Tailwind
  display: 'swap',
});

// 2. Cấu hình Font cho chữ Triện (Cổ văn)
const sealFont = localFont({
  src: [
    {
      path: './fonts/seal.ttf', // Thay bằng tên file font triện bạn tải
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-seal',
  display: 'swap',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Thuyết Văn Giải Tự',
  description: 'Thuyết Văn Giải Tự',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` ${mingliu.variable} ${sealFont.variable}  ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
