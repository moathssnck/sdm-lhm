import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/hooks/use-cart"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"

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
      <body>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
        <Script
        id="tawk-to-chat-widget"
        src="https://embed.tawk.to/68863bf1f072f7192b20d434/1j165ka79"
        strategy="lazyOnload" // Load the script after the page becomes interactive
     
      />
      </body>
    </html>
  )
}
