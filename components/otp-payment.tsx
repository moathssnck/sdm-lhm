"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Loader2, Shield } from "lucide-react"

interface OTPPaymentProps {
  orderId: string
  amount: number
  onSuccess: () => void
}

export function OTPPayment({ orderId, amount, onSuccess }: OTPPaymentProps) {
  const [step, setStep] = useState<"phone" | "otp" | "processing">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رقم هاتف صحيح",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setStep("otp")
    setCountdown(60)

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    toast({
      title: "تم إرسال الرمز",
      description: `تم إرسال رمز التحقق إلى ${phoneNumber}`,
    })
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رمز التحقق المكون من 6 أرقام",
        variant: "destructive",
      })
      return
    }

    setStep("processing")

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    toast({
      title: "تم الدفع بنجاح",
      description: "تم تأكيد طلبك وسيتم التوصيل قريباً",
    })

    onSuccess()
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setCountdown(60)

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    toast({
      title: "تم إعادة الإرسال",
      description: "تم إرسال رمز تحقق جديد",
    })
  }

  if (step === "processing") {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">جاري معالجة الدفع...</h3>
          <p className="text-gray-600">يرجى الانتظار، لا تغلق هذه الصفحة</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center space-x-2 space-x-reverse">
          <Shield className="w-5 h-5 text-green-600" />
          <span>الدفع الآمن برمز التحقق</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === "phone" && (
          <>
            <div>
              <Label htmlFor="phone">رقم الهاتف *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="05xxxxxxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={10}
              />
              <p className="text-sm text-gray-600 mt-1">سيتم إرسال رمز التحقق إلى هذا الرقم</p>
            </div>

            <Button onClick={handleSendOTP} className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                "إرسال رمز التحقق"
              )}
            </Button>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="text-center">
              <p className="text-gray-600 mb-4">تم إرسال رمز التحقق إلى {phoneNumber}</p>
            </div>

            <div>
              <Label htmlFor="otp">رمز التحقق *</Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
              <p className="text-sm text-gray-600 mt-1">أدخل الرمز المكون من 6 أرقام</p>
            </div>

            <div className="flex space-x-4 space-x-reverse">
              <Button onClick={handleVerifyOTP} className="flex-1" size="lg">
                تأكيد الدفع
              </Button>

              <Button onClick={handleResendOTP} variant="outline" disabled={countdown > 0 || isLoading} size="lg">
                {countdown > 0 ? `إعادة الإرسال (${countdown})` : "إعادة الإرسال"}
              </Button>
            </div>

            <Button onClick={() => setStep("phone")} variant="ghost" className="w-full">
              تغيير رقم الهاتف
            </Button>
          </>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700 text-center">🔒 جميع المعاملات محمية بأعلى معايير الأمان</p>
        </div>
      </CardContent>
    </Card>
  )
}
