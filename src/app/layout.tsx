import type { Metadata } from "next";
import { Jua } from "next/font/google";
import "./globals.css";

const jua = Jua({
  variable: "--font-main",
  weight: "400",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "MBTI 맞춤 추천",
  description: "MBTI 성격에 맞는 강아지와 함께 보는 여행·맛집·쇼핑 추천",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={jua.variable}>{children}</body>
    </html>
  );
}
