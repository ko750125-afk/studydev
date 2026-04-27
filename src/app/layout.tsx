import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "StudyDev - AI 대화를 개발 문서로 변환",
  description:
    "AI(GPT, Claude 등)와 나눈 대화에서 개발 지식만 추출하여 구조화된 문서로 정리하고 PDF로 생성합니다.",
  keywords: ["AI", "개발 문서", "GPT", "Claude", "지식 정리", "PDF"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
