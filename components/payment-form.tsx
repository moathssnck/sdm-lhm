"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, CreditCard, Calendar, Lock, AlertCircle } from "lucide-react"

interface PaymentFormProps {
  gateway: string
  onSubmit: (paymentData: any) => void
  isProcessing: boolean
}

export function PaymentForm({ gateway, onSubmit, isProcessing }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    saveCard: false,
    billingAddress: {
      street: "",
      city: "",
      country: "OM",
    },
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cardNumber || formData.cardNumber.length < 16) {
      newErrors.cardNumber = "رقم البطاقة غير صحيح"
    }

    if (!formData.cardName.trim()) {
      newErrors.cardName = "اسم حامل البطاقة مطلوب"
    }

    if (!formData.expiryMonth || !formData.expiryYear) {
      newErrors.expiry = "تاريخ انتهاء البطاقة مطلوب"
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = "رمز الأمان غير صحيح"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
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
    setFormData({ ...formData, cardNumber: formatted })
  }

  const getCardType = (number: string) => {
    const num = number.replace(/\s/g, "")
    if (num.startsWith("4")) return "visa"
    if (num.startsWith("5") || num.startsWith("2")) return "mastercard"
    if (num.startsWith("3")) return "amex"
    return "unknown"
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
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="flex items-center text-xl">
          <CreditCard className="w-6 h-6 ml-3 text-green-600" />
          معلومات البطاقة
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
                className={`pr-12 ${errors.cardNumber ? "border-red-500" : ""}`}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                {getCardType(formData.cardNumber) === "visa" && (
                  <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    VISA
                  </div>
                )}
                {getCardType(formData.cardNumber) === "mastercard" && (
                  <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    MC
                  </div>
                )}
                {getCardType(formData.cardNumber) === "amex" && (
                  <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    AMEX
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

          {/* Save Card Option */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="saveCard"
              checked={formData.saveCard}
              onCheckedChange={(checked) => setFormData({ ...formData, saveCard: checked as boolean })}
            />
            <Label htmlFor="saveCard" className="text-sm">
              حفظ بيانات البطاقة للمشتريات المستقبلية (آمن ومشفر)
            </Label>
          </div>

          {/* Security Notice */}
          <div className="flex items-start space-x-3 space-x-reverse p-4 bg-green-50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="text-sm text-green-700">
              <p className="font-medium mb-1">معلوماتك في أمان تام:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>تشفير SSL 256-bit لجميع البيانات</li>
                <li>عدم حفظ بيانات البطاقة على خوادمنا</li>
                <li>معالجة آمنة عبر البنوك العمانية المعتمدة</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري معالجة الدفع...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Shield className="w-5 h-5" />
                <span>دفع آمن</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
