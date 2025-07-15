"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckoutForm } from "@/components/checkout-form"
import { OrderSummary } from "@/components/order-summary"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/cart")
    }
  }, [mounted, items.length, router])

  if (!mounted) {
    return null
  }

  if (items.length === 0) {
    return null
  }

  const handleOrderSubmit = async (orderData: any) => {
    setIsProcessing(true)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate order ID
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase()

    // Clear cart and redirect to payment
    clearCart()
    router.push(`/payment?orderId=${orderId}&amount=${total}`)
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CheckoutForm onSubmit={handleOrderSubmit} isProcessing={isProcessing} />
          <OrderSummary items={items} total={total} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
