import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "Parivar.me - Community Management At Your Fingertips",
  description: "Parivar.me is a warm, modern platform built for Samaj, Parivar, and Community Organizations.",
  openGraph: {
    url: "https://parivar.me/",
    title: "Parivar.me - Community Management At Your Fingertips",
    description: "Parivar.me is a warm, modern platform built for Samaj, Parivar, and Community Organizations.",
    images: [
      {
        url: "https://parivar.me/logo.png",
        width: 300,
        height: 300,
        alt: "Parivar.me Logo",
      }
    ],
    type: "website",
    siteName: "Parivar.me",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${notoSans.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased bg-white text-slate-900 font-sans" suppressHydrationWarning>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
