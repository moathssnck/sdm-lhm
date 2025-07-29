
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>ذبيحتي – أفضل أنواع اللحوم الطازجة في سلطنة عمان</title>
  <meta name="description" content="ذبيحتي توفر لك أجود أنواع اللحوم الطازجة من الخراف النعيمي والبلدي، مع خدمة التوصيل السريع حتى باب بيتك في سلطنة عمان." />
  <meta name="keywords" content="ذبيحتي, بيع اللحوم, خروف نعيمي, لحوم طازجة, توصيل اللحوم, عمان" />
  <meta name="author" content="ذبيحتي" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#0b7d33ff" />

  <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/site.webmanifest" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="ذبيحتي – أفضل أنواع اللحوم الطازجة في سلطنة عمان" />
  <meta property="og:description" content="ذبيحتي توفر لك أجود أنواع اللحوم الطازجة من الخراف النعيمي والبلدي، مع خدمة التوصيل السريع حتى باب بيتك في سلطنة عمان." />
      <meta property="og:image" content="https://i.ibb.co/zWgcL17n/image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://example.com/" />
  <meta name="twitter:title" content="ذبيحتي – أفضل أنواع اللحوم الطازجة في سلطنة عمان" />
  <meta name="twitter:description" content="ذبيحتي توفر لك أجود أنواع اللحوم الطازجة من الخراف النعيمي والبلدي، مع خدمة التوصيل السريع حتى باب بيتك في سلطنة عمان." />
  <meta name="twitter:image" content="https://i.ibb.co/zWgcL17n/image.png" />

  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="ذبيحتي" />

  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
  <meta name="referrer" content="strict-origin" />
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
