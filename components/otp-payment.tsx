"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Shield, Smartphone, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

interface OTPVerificationProps {
  transactionId: string
  phoneNumber: string
  onVerify: (otpCode: string) => void
  onResend: () => void
  isVerifying: boolean
  error?: string
}

// Update the component to work better within a dialog
export function OTPVerification({
  transactionId,
  phoneNumber,
  onVerify,
  onResend,
  isVerifying,
  error,
}: OTPVerificationProps) {
  const [otpCode, setOtpCode] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleOTPChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 6)
    setOtpCode(numericValue)

    // Auto-submit when 6 digits are entered
    if (numericValue.length === 6) {
      onVerify(numericValue)
    }
  }

  const handleResend = () => {
    onResend()
    setTimeLeft(300)
    setCanResend(false)
    setOtpCode("")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const maskedPhone = phoneNumber.slice(-4).padStart(phoneNumber.length, "*")

  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-gray-600 text-sm mb-6">تم إرسال رمز التحقق إلى رقم {maskedPhone}</p>

        <p className="text-sm text-gray-600 mb-4">أدخل الرمز المكون من 6 أرقام</p>

        {/* OTP Input */}
        <div className="flex justify-center mb-6">
          <Input
            value={otpCode}
            onChange={(e) => handleOTPChange(e.target.value)}
            placeholder="000000"
            className="text-center text-2xl font-mono tracking-widest w-48 h-14"
            maxLength={6}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center justify-center space-x-2 space-x-reverse text-red-600 mb-4">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Timer */}
        <div className="flex items-center justify-center space-x-2 space-x-reverse mb-6">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600">
            {timeLeft > 0 ? `انتهاء الصلاحية خلال ${formatTime(timeLeft)}` : "انتهت صلاحية الرمز"}
          </span>
        </div>

        {/* Verify Button */}
        <Button
          onClick={() => onVerify(otpCode)}
          disabled={otpCode.length !== 6 || isVerifying}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg mb-4"
        >
          {isVerifying ? (
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>جاري التحقق...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 space-x-reverse">
              <CheckCircle className="w-5 h-5" />
              <span>تحقق من الرمز</span>
            </div>
          )}
        </Button>

        {/* Resend Button */}
        <Button
          onClick={handleResend}
          disabled={!canResend}
          variant="outline"
          className="w-full border-2 border-blue-200 hover:border-blue-400 bg-transparent"
        >
          <RefreshCw className="w-4 h-4 ml-2" />
          {canResend ? "إعادة إرسال الرمز" : `إعادة الإرسال خلال ${formatTime(timeLeft)}`}
        </Button>
      </div>

      {/* Security Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start space-x-3 space-x-reverse">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">معلومات الأمان:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>لا تشارك رمز التحقق مع أي شخص</li>
              <li>الرمز صالح لمدة 5 دقائق فقط</li>
              <li>رقم المعاملة: {transactionId}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
