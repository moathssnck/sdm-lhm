"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { OTPPayment } from "@/components/otp-payment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderId, setOrderId] = useState("")
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId")
    const amountParam = searchParams.get("amount")

    if (!orderIdParam || !amountParam) {
      router.push("/cart")
      return
    }

    setOrderId(orderIdParam)
    setAmount(Number.parseFloat(amountParam))
  }, [searchParams, router])

  const handlePaymentSuccess = () => {
    router.push(`/order-confirmation?orderId=${orderId}`)
  }

  if (!orderId || !amount) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">تفاصيل الدفع</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-gray-600">
                رقم الطلب: <span className="font-semibold">{orderId}</span>
              </p>
              <p className="text-2xl font-bold text-green-600">{amount.toFixed(2)} ر.س</p>
            </CardContent>
          </Card>

          <OTPPayment orderId={orderId} amount={amount} onSuccess={handlePaymentSuccess} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
