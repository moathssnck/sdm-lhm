import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/hooks/use-cart"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"
import Head from "next/head"

export const metadata: Metadata = {
  title: "ذبيحتي - أجود أنواع اللحوم الطازجة",
  description: "نقدم أجود أنواع اللحوم الطازجة والمضمونة الجودة",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <Head>
      <meta property="og:image" content="https://i.ibb.co/zWgcL17n/image.png" />
      </Head>
      <body>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
