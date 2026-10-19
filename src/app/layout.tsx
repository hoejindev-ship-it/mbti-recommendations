import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const serif = Noto_Serif_KR({
  variable: "--font-serif",
  weight: ["400", "700", "900"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "MBTI 맞춤 추천",
  description: "MBTI 성격에 맞는 여행·맛집·쇼핑 추천",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={serif.variable}>{children}</body>
    </html>
  );
}
