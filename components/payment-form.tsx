"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Shield, CreditCard, Calendar, Lock, AlertCircle, Building2 } from "lucide-react"
import Image from "next/image"
import { omanPaymentGateways } from "@/lib/payment-gateway"

interface CardPaymentFormProps {
  onSubmit: (paymentData: any) => void
  isProcessing: boolean
}

export function CardPaymentForm({ onSubmit, isProcessing }: CardPaymentFormProps) {
  const [selectedGateway, setSelectedGateway] = useState("bank_muscat_card")
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Card number validation
    const cardNumber = formData.cardNumber.replace(/\s/g, "")
    if (!cardNumber || cardNumber.length < 16) {
      newErrors.cardNumber = "رقم البطاقة يجب أن يكون 16 رقم"
    }

    // Card name validation
    if (!formData.cardName.trim()) {
      newErrors.cardName = "اسم حامل البطاقة مطلوب"
    }

    // Expiry validation
    if (!formData.expiryMonth || !formData.expiryYear) {
      newErrors.expiry = "تاريخ انتهاء البطاقة مطلوب"
    } else {
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth() + 1
      const expYear = Number.parseInt(formData.expiryYear)
      const expMonth = Number.parseInt(formData.expiryMonth)

      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        newErrors.expiry = "البطاقة منتهية الصلاحية"
      }
    }

    // CVV validation
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = "رمز الأمان يجب أن يكون 3-4 أرقام"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        gateway: selectedGateway,
        cardInfo: formData,
      })
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.replace(/\s/g, "").length <= 16) {
      setFormData({ ...formData, cardNumber: formatted })
    }
  }

  const getCardType = (number: string) => {
    const num = number.replace(/\s/g, "")
    if (num.startsWith("4")) return "visa"
    if (num.startsWith("5") || num.startsWith("2")) return "mastercard"
    if (num.startsWith("3")) return "amex"
    return "unknown"
  }

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case "visa":
        return "bg-blue-600"
      case "mastercard":
        return "bg-red-600"
      case "amex":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i)
  const months = [
    { value: "01", label: "01 - يناير" },
    { value: "02", label: "02 - فبراير" },
    { value: "03", label: "03 - مارس" },
    { value: "04", label: "04 - أبريل" },
    { value: "05", label: "05 - مايو" },
    { value: "06", label: "06 - يونيو" },
    { value: "07", label: "07 - يوليو" },
    { value: "08", label: "08 - أغسطس" },
    { value: "09", label: "09 - سبتمبر" },
    { value: "10", label: "10 - أكتوبر" },
    { value: "11", label: "11 - نوفمبر" },
    { value: "12", label: "12 - ديسمبر" },
  ]

  return (
    <div className="space-y-6">
      {/* Gateway Selection */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="flex items-center text-xl">
            <Building2 className="w-6 h-6 ml-3 text-blue-600" />
            اختر البنك
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <RadioGroup value={selectedGateway} onValueChange={setSelectedGateway} className="space-y-4">
            {omanPaymentGateways.map((gateway: { id: string | number | bigint | ((prevState: string) => string) | null | undefined; logo: any; name: string; nameAr: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; supportedCards: any[]; fees: { percentage: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; fixed: number } }) => (
              <div
                key={gateway.id}
                className={`flex items-center space-x-3 space-x-reverse p-4 border-2 rounded-xl transition-all cursor-pointer hover:border-blue-300 ${
                  selectedGateway === gateway.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
                onClick={() => setSelectedGateway(gateway.id)}
              >
                <RadioGroupItem value={gateway.id} id={gateway.id} />
                <Label htmlFor={gateway.id} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <Image
                        src={gateway.logo || "/placeholder.svg"}
                        alt={gateway.name}
                        width={80}
                        height={30}
                        className="object-contain"
                      />
                      <div>
                        <p className="font-semibold text-lg">{gateway.nameAr}</p>
                        <div className="flex items-center space-x-2 space-x-reverse mt-1">
                          {gateway.supportedCards.map((card) => (
                            <div
                              key={card}
                              className={`w-8 h-5 ${getCardTypeColor(card)} rounded text-white text-xs flex items-center justify-center font-bold`}
                            >
                              {card.slice(0, 4).toUpperCase()}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">رسوم: {gateway.fees.percentage}%</p>
                      <p className="text-xs text-gray-500">+ {gateway.fees.fixed.toFixed(3)} ر.ع</p>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Card Details Form */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center text-xl">
            <CreditCard className="w-6 h-6 ml-3 text-green-600" />
            بيانات البطاقة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Number */}
            <div>
              <Label htmlFor="cardNumber" className="flex items-center">
                <CreditCard className="w-4 h-4 ml-2" />
                رقم البطاقة *
              </Label>
              <div className="relative mt-2">
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={`pr-12 text-lg font-mono ${errors.cardNumber ? "border-red-500" : ""}`}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {getCardType(formData.cardNumber) !== "unknown" && (
                    <div
                      className={`w-10 h-6 ${getCardTypeColor(getCardType(formData.cardNumber))} rounded text-white text-xs flex items-center justify-center font-bold`}
                    >
                      {getCardType(formData.cardNumber).slice(0, 4).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 ml-1" />
                  {errors.cardNumber}
                </p>
              )}
            </div>

            {/* Card Name */}
            <div>
              <Label htmlFor="cardName">اسم حامل البطاقة *</Label>
              <Input
                id="cardName"
                value={formData.cardName}
                onChange={(e) => setFormData({ ...formData, cardName: e.target.value.toUpperCase() })}
                placeholder="كما هو مكتوب على البطاقة"
                className={`mt-2 ${errors.cardName ? "border-red-500" : ""}`}
              />
              {errors.cardName && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 ml-1" />
                  {errors.cardName}
                </p>
              )}
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="flex items-center">
                  <Calendar className="w-4 h-4 ml-2" />
                  الشهر *
                </Label>
                <Select
                  value={formData.expiryMonth}
                  onValueChange={(value) => setFormData({ ...formData, expiryMonth: value })}
                >
                  <SelectTrigger className={`mt-2 ${errors.expiry ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="الشهر" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>السنة *</Label>
                <Select
                  value={formData.expiryYear}
                  onValueChange={(value) => setFormData({ ...formData, expiryYear: value })}
                >
                  <SelectTrigger className={`mt-2 ${errors.expiry ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="السنة" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cvv" className="flex items-center">
                  <Lock className="w-4 h-4 ml-2" />
                  CVV *
                </Label>
                <Input
                  id="cvv"
                  type="password"
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, "") })}
                  placeholder="123"
                  maxLength={4}
                  className={`mt-2 ${errors.cvv ? "border-red-500" : ""}`}
                />
              </div>
            </div>

            {errors.expiry && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 ml-1" />
                {errors.expiry}
              </p>
            )}

            {errors.cvv && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 ml-1" />
                {errors.cvv}
              </p>
            )}

            {/* Security Notice */}
            <div className="flex items-start space-x-3 space-x-reverse p-4 bg-green-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-700">
                <p className="font-medium mb-1">معلوماتك في أمان تام:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>تشفير SSL 256-bit لجميع البيانات</li>
                  <li>سيتم إرسال رمز تحقق OTP لهاتفك</li>
                  <li>عدم حفظ بيانات البطاقة على خوادمنا</li>
                  <li>معالجة آمنة عبر البنوك العمانية المعتمدة</li>
                </ul>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 rounded-xl shadow-lg text-lg"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري التحقق من البطاقة...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Shield className="w-5 h-5" />
                  <span>متابعة الدفع الآمن</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
