"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Truck,
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Shield,
  Droplets,
  Gift,
  Percent,
  ShoppingCart,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PaymentSuccess } from "@/components/payment/payment-success"
import { CardPaymentForm } from "@/components/payment/card-payment-form"
import { OTPVerification } from "@/components/payment/otp-verification"
import { PaymentGatewayService, type PaymentRequest } from "@/lib/payment-gateways"
import { useCart } from "@/contexts/cart-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProfessionalCheckout() {
  const { items: cartItems, getTotalPrice, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [deliveryMethod, setDeliveryMethod] = useState("home")
  const [promoCode, setPromoCode] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentResult, setPaymentResult] = useState<any>(null)
  const [orderTime, setOrderTime] = useState(new Date())
  const [otpError, setOtpError] = useState("")

  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    area: "",
    building: "",
    floor: "",
    apartment: "",
    notes: "",
    isCompany: false,
    companyName: "",
    taxNumber: "",
  })

  useEffect(() => {
    const timer = setInterval(() => setOrderTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Redirect to home if cart is empty
  useEffect(() => {
    if (typeof window !== "undefined" && cartItems.length === 0 && currentStep === 1) {
      // Allow some time for cart to load from localStorage
      const timer = setTimeout(() => {
        if (cartItems.length === 0) {
          window.location.href = "/"
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cartItems.length, currentStep])

  const subtotal = getTotalPrice()
  const deliveryFee = deliveryMethod === "home" ? (subtotal >= 5 ? 0 : 1.5) : 0
  const discount = (subtotal * promoDiscount) / 100
  const tax = (subtotal - discount) * 0.05 // 5% VAT
  const total = subtotal + deliveryFee - discount + tax

  const applyPromoCode = () => {
    const validCodes = {
      WELCOME10: 10,
      SUMMER20: 20,
      FAMILY15: 15,
    }

    if (validCodes[promoCode as keyof typeof validCodes]) {
      setPromoDiscount(validCodes[promoCode as keyof typeof validCodes])
    } else {
      alert("كود الخصم غير صحيح")
    }
  }

  const handlePaymentSubmit = async (paymentData: any) => {
    setIsProcessing(true)
    setOtpError("")

    try {
      const paymentRequest: PaymentRequest = {
        amount: total,
        currency: "OMR",
        orderId: `ORD_${Date.now()}`,
        customerInfo: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          email: customerInfo.email,
          phone: customerInfo.phone,
        },
        cardInfo: paymentData.cardInfo,
        gateway: paymentData.gateway,
      }

      const result = await PaymentGatewayService.initiatePayment(paymentRequest)

      if (result.success && result.requiresOTP) {
        setPaymentResult(result)
        // Send OTP
        await PaymentGatewayService.sendOTP({
          transactionId: result.transactionId!,
          phone: customerInfo.phone,
          gateway: paymentData.gateway,
        })
        setCurrentStep(4) // Move to OTP verification step
      } else if (!result.success) {
        alert(`فشل في معالجة الدفع: ${result.error}`)
      }
    } catch (error) {
      alert("حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOTPVerification = async (otpCode: string) => {
    if (!paymentResult?.transactionId) return

    setIsProcessing(true)
    setOtpError("")

    try {
      const result = await PaymentGatewayService.verifyOTP({
        transactionId: paymentResult.transactionId,
        otpCode,
        gateway: "bank_muscat_card",
      })

      if (result.success) {
        setPaymentResult({
          transactionId: result.transactionId,
          amount: total,
          currency: "OMR",
          gateway: "bank_muscat_card",
          customerInfo: {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            email: customerInfo.email,
            phone: customerInfo.phone,
          },
          orderItems: cartItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        })
        // Clear cart after successful payment
        clearCart()
        setCurrentStep(5) // Success step
      } else {
        setOtpError(result.error || "رمز التحقق غير صحيح")
      }
    } catch (error) {
      setOtpError("حدث خطأ أثناء التحقق. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOTPResend = async () => {
    if (!paymentResult?.transactionId) return

    try {
      await PaymentGatewayService.resendOTP(paymentResult.transactionId, customerInfo.phone)
    } catch (error) {
      console.error("Error resending OTP:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "معلومات العميل"
      case 2:
        return "عنوان التوصيل"
      case 3:
        return "بيانات البطاقة"
      case 4:
        return "تحقق OTP"
      case 5:
        return "تأكيد الدفع"
      default:
        return ""
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center text-xl">
                  <User className="w-6 h-6 ml-3 text-blue-600" />
                  المعلومات الشخصية
                </CardTitle>
                <CardDescription>يرجى إدخال معلوماتك الشخصية بدقة لضمان التواصل معك</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center space-x-4 space-x-reverse mb-6">
                  <input
                    type="checkbox"
                    id="isCompany"
                    checked={customerInfo.isCompany}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, isCompany: e.target.checked })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <Label htmlFor="isCompany" className="text-sm font-medium">
                    طلب باسم شركة أو مؤسسة
                  </Label>
                </div>

                {customerInfo.isCompany && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <Label htmlFor="companyName">اسم الشركة *</Label>
                      <Input
                        id="companyName"
                        value={customerInfo.companyName}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, companyName: e.target.value })}
                        placeholder="اسم الشركة أو المؤسسة"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                      <Input
                        id="taxNumber"
                        value={customerInfo.taxNumber}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, taxNumber: e.target.value })}
                        placeholder="الرقم الضريبي (اختياري)"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">الاسم الأول *</Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                      placeholder="أدخل اسمك الأول"
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">اسم العائلة *</Label>
                    <Input
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                      placeholder="أدخل اسم العائلة"
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        placeholder="example@email.com"
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <div className="relative mt-2">
                      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        placeholder="+968 9999 9999"
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center text-xl">
                  <Truck className="w-6 h-6 ml-3 text-green-600" />
                  طريقة التوصيل
                </CardTitle>
                <CardDescription>اختر طريقة التوصيل المناسبة لك</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-4">
                  <div className="flex items-center space-x-3 space-x-reverse p-6 border-2 rounded-xl hover:border-green-300 transition-colors">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Truck className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-lg">توصيل للمنزل</p>
                            <p className="text-sm text-gray-600">توصيل مجاني للطلبات أكثر من 5 ر.ع</p>
                            <p className="text-xs text-gray-500">خلال 24 ساعة</p>
                          </div>
                        </div>
                        <div className="text-left">
                          {subtotal >= 5 ? (
                            <Badge className="bg-green-100 text-green-800">مجاني</Badge>
                          ) : (
                            <span className="font-bold text-lg">1.500 ر.ع</span>
                          )}
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse p-6 border-2 rounded-xl hover:border-blue-300 transition-colors">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-lg">استلام من المتجر</p>
                            <p className="text-sm text-gray-600">فرعنا في الخوير - مسقط</p>
                            <p className="text-xs text-gray-500">جاهز خلال ساعتين</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">مجاني</Badge>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {deliveryMethod === "home" && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-lg mb-6 flex items-center">
                      <MapPin className="w-5 h-5 ml-2 text-gray-600" />
                      عنوان التوصيل
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="city">المحافظة *</Label>
                        <Select
                          value={customerInfo.city}
                          onValueChange={(value) => setCustomerInfo({ ...customerInfo, city: value })}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="اختر المحافظة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="muscat">مسقط</SelectItem>
                            <SelectItem value="dhofar">ظفار</SelectItem>
                            <SelectItem value="dakhliyah">الداخلية</SelectItem>
                            <SelectItem value="sharqiyah-north">الشرقية الشمالية</SelectItem>
                            <SelectItem value="sharqiyah-south">الشرقية الجنوبية</SelectItem>
                            <SelectItem value="batinah-north">الباطنة الشمالية</SelectItem>
                            <SelectItem value="batinah-south">الباطنة الجنوبية</SelectItem>
                            <SelectItem value="dhahirah">الظاهرة</SelectItem>
                            <SelectItem value="buraimi">البريمي</SelectItem>
                            <SelectItem value="wusta">الوسطى</SelectItem>
                            <SelectItem value="musandam">مسندم</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="area">المنطقة/الولاية *</Label>
                        <Input
                          id="area"
                          value={customerInfo.area}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, area: e.target.value })}
                          placeholder="مثال: الخوير، القرم، الموالح"
                          className="mt-2"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      <div>
                        <Label htmlFor="building">رقم المبنى *</Label>
                        <Input
                          id="building"
                          value={customerInfo.building}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, building: e.target.value })}
                          placeholder="رقم المبنى"
                          className="mt-2"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="floor">الطابق</Label>
                        <Input
                          id="floor"
                          value={customerInfo.floor}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, floor: e.target.value })}
                          placeholder="الطابق"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="apartment">رقم الشقة</Label>
                        <Input
                          id="apartment"
                          value={customerInfo.apartment}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, apartment: e.target.value })}
                          placeholder="رقم الشقة"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <Label htmlFor="address">العنوان التفصيلي *</Label>
                      <Textarea
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        placeholder="اسم الشارع، معالم مميزة، تفاصيل إضافية تساعد في الوصول"
                        className="mt-2 min-h-[100px]"
                        required
                      />
                    </div>

                    <div className="mt-6">
                      <Label htmlFor="notes">ملاحظات خاصة للتوصيل</Label>
                      <Textarea
                        id="notes"
                        value={customerInfo.notes}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                        placeholder="أي ملاحظات خاصة للتوصيل (وقت مفضل، تعليمات خاصة، إلخ)"
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <CardPaymentForm onSubmit={handlePaymentSubmit} isProcessing={isProcessing} />
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            {/* OTP Dialog */}
            <Dialog open={paymentResult?.requiresOTP} onOpenChange={() => {}}>
              <DialogContent className="sm:max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl font-bold">تحقق من هويتك</DialogTitle>
                </DialogHeader>

                {paymentResult?.requiresOTP ? (
                  <div className="space-y-6">
                    <OTPVerification
                      transactionId={paymentResult.transactionId}
                      phoneNumber={customerInfo.phone}
                      onVerify={handleOTPVerification}
                      onResend={handleOTPResend}
                      isVerifying={isProcessing}
                      error={otpError}
                    />

                    {/* Error Alert */}
                    {otpError && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-right">{otpError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-4">تم الدفع بنجاح!</h3>
                    <p className="text-green-700">شكراً لك على ثقتك في مياه عمان الفاخرة</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Fallback content when dialog is not shown */}
            {!paymentResult?.requiresOTP && (
              <Card className="shadow-lg border-0">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">جاري معالجة الدفع</h3>
                  <p className="text-gray-600">يرجى الانتظار...</p>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case 5:
        return paymentResult ? <PaymentSuccess {...paymentResult} /> : null

      default:
        return null
    }
  }

  // Show loading if cart is empty and we're still on step 1
  if (cartItems.length === 0 && currentStep === 1) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل السلة...</p>
        </div>
      </div>
    )
  }

  const downloadReceipt = () => {
    if (typeof window === "undefined") return

    // Generate and download receipt
    const receiptData = {
      transactionId: paymentResult.transactionId,
      amount: paymentResult.amount,
      currency: paymentResult.currency,
      gateway: paymentResult.gateway,
      customerInfo: paymentResult.customerInfo,
      orderItems: paymentResult.orderItems,
      date: orderTime,
    }

    const dataStr = JSON.stringify(receiptData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `receipt_${paymentResult.transactionId}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const shareReceipt = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "إيصال الدفع - مياه عمان",
          text: `تم الدفع بنجاح. رقم المعاملة: ${paymentResult?.transactionId}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  if (currentStep === 5 && paymentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50" dir="rtl">
        <header className="bg-white shadow-lg border-b-2 border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 md:h-20">
              <Link
                href="/"
                className="flex items-center space-x-3 space-x-reverse md:space-x-4 hover:opacity-80 transition-opacity"
              >
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                <span className="text-base md:text-lg font-medium text-gray-700">العودة للمتجر</span>
              </Link>

              <div className="flex items-center space-x-3 space-x-reverse md:space-x-4">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                  <Droplets className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    مياه عمان الفاخرة
                  </h1>
                  <p className="text-xs md:text-sm text-gray-600">تأكيد الدفع</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PaymentSuccess {...paymentResult} downloadReceipt={downloadReceipt} shareReceipt={shareReceipt} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <Link
              href="/"
              className="flex items-center space-x-3 space-x-reverse md:space-x-4 hover:opacity-80 transition-opacity"
            >
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              <span className="text-base md:text-lg font-medium text-gray-700">العودة للمتجر</span>
            </Link>

            <div className="flex items-center space-x-3 space-x-reverse md:space-x-4">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                <Droplets className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  مياه عمان الفاخرة
                </h1>
                <p className="text-xs md:text-sm text-gray-600">إتمام الطلب</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Progress Steps */}
            <div className="mb-6 md:mb-8">
              {/* Mobile Progress */}
              <div className="md:hidden mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-600">الخطوة {currentStep} من 5</span>
                  <span className="text-sm text-gray-500">{getStepTitle(currentStep)}</span>
                </div>
                <Progress value={(currentStep / 5) * 100} className="h-2" />
              </div>

              {/* Desktop Progress */}
              <div className="hidden md:flex items-center justify-between mb-4">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        step < currentStep
                          ? "bg-green-500 text-white"
                          : step === currentStep
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step < currentStep ? <CheckCircle className="w-6 h-6" /> : step}
                    </div>
                    <div className="mr-3 text-right">
                      <span
                        className={`text-sm font-medium ${step <= currentStep ? "text-blue-600" : "text-gray-500"}`}
                      >
                        {getStepTitle(step)}
                      </span>
                    </div>
                    {step < 5 && (
                      <div className="w-16 h-1 bg-gray-200 mx-4 rounded">
                        <div
                          className={`h-full rounded transition-all ${
                            step < currentStep ? "bg-green-500 w-full" : "bg-gray-200 w-0"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="hidden md:block">
                <Progress value={(currentStep / 5) * 100} className="h-2" />
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              {currentStep < 4 && (
                <div className="flex flex-col sm:flex-row justify-between mt-6 md:mt-8 gap-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-6 md:px-8 py-3 text-base md:text-lg order-2 sm:order-1"
                    >
                      السابق
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="px-6 md:px-8 py-3 text-base md:text-lg font-semibold order-1 sm:order-2 sm:mr-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    التالي
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <Card className="lg:sticky lg:top-4 shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center text-lg md:text-xl">
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 ml-3 text-blue-600" />
                  ملخص الطلب
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6">
                <div className="space-y-3 md:space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 space-x-reverse">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded-lg shadow-sm flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500">
                          {item.size} • {item.category}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm">الكمية: {item.quantity}</span>
                          <span className="font-bold text-blue-600 text-sm">
                            {(item.price * item.quantity).toFixed(3)} ر.ع
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Promo Code */}
                <div className="space-y-3">
                  <Label htmlFor="promoCode" className="flex items-center text-sm">
                    <Gift className="w-4 h-4 ml-2 text-orange-500" />
                    كود الخصم
                  </Label>
                  <div className="flex space-x-2 space-x-reverse">
                    <Input
                      id="promoCode"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="أدخل كود الخصم"
                      className="flex-1 text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={applyPromoCode}
                      className="px-3 text-sm bg-transparent"
                    >
                      تطبيق
                    </Button>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex items-center space-x-2 space-x-reverse text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>تم تطبيق خصم {promoDiscount}%</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between text-base md:text-lg">
                    <span>المجموع الفرعي:</span>
                    <span>{subtotal.toFixed(3)} ر.ع</span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm">
                      <span className="flex items-center">
                        <Percent className="w-4 h-4 ml-1" />
                        الخصم ({promoDiscount}%):
                      </span>
                      <span>-{discount.toFixed(3)} ر.ع</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Truck className="w-4 h-4 ml-1" />
                      رسوم التوصيل:
                    </span>
                    <span>{deliveryFee === 0 ? "مجاني" : `${deliveryFee.toFixed(3)} ر.ع`}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>ضريبة القيمة المضافة (5%):</span>
                    <span>{tax.toFixed(3)} ر.ع</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-xl md:text-2xl font-bold">
                    <span>المجموع الكلي:</span>
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {total.toFixed(3)} ر.ع
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>دفع آمن ومشفر</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>ضمان استرداد 100%</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Truck className="w-4 h-4 text-blue-500" />
                    <span>توصيل مجاني للطلبات أكثر من 5 ر.ع</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
