"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Star, Truck, Shield, Clock, CreditCard, Smartphone } from "lucide-react"

type FlowStep = "hero" | "offer" | "checkout" | "payment" | "otp" | "success"

// Add this interface and offers data after the imports
interface Offer {
  id: string
  title: string
  description: string
  items: string[]
  originalPrice: number
  offerPrice: number
  image: string
  badge?: string
  popular?: boolean
}

const offers: Offer[] = [
  {
    id: "premium",
    title: "باقة اللحوم المميزة",
    description: "الأفضل للعائلات الكبيرة",
    items: ["كيلو لحم بقري طازج", "كيلو لحم غنم", "دجاج كامل", "نقانق مشكلة"],
    originalPrice: 45,
    offerPrice: 25,
    image: "/",
    badge: "الأكثر طلباً",
    popular: true,
  },
  {
    id: "bbq",
    title: "باقة الشواء العائلية",
    description: "مثالية لعطلة نهاية الأسبوع",
    items: ["2 كيلو لحم شواء", "دجاج مقطع للشواء", "كباب مشكل", "خضار للشواء"],
    originalPrice: 60,
    offerPrice: 35,
    image: "/",
    badge: "عرض الشواء",
  },
  {
    id: "weekly",
    title: "باقة الأسبوع الاقتصادية",
    description: "توفير لكامل الأسبوع",
    items: ["لحم بقري مقطع", "دجاج كامل", "سمك طازج", "لحم مفروم"],
    originalPrice: 40,
    offerPrice: 22,
    image: "/",
    badge: "وفر أكثر",
  },
  {
    id: "luxury",
    title: "باقة القطع الفاخرة",
    description: "للمناسبات الخاصة",
    items: ["ستيك فيليه", "لحم ضأن مقطع", "جمبري طازج", "سمك هامور"],
    originalPrice: 80,
    image: "/",
    offerPrice: 55,
    badge: "فاخر",
  },
  {
    id: "budget",
    title: "باقة الطالب المقتصدة",
    description: "مناسبة للميزانية المحدودة",
    items: ["نصف كيلو لحم مفروم", "دجاج مقطع", "سجق", "برجر لحم"],
    originalPrice: 25,
    offerPrice: 15,
    image: "/placeholder.svg?height=200&width=300&text=Budget+Student+Package",
    badge: "اقتصادي",
  },
]

export default function MainPage() {
  const [currentStep, setCurrentStep] = useState<FlowStep>("hero")
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card")
  const [otpCode, setOtpCode] = useState("")
  const [cardInfo, setCardInfo] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  // Update the totalPrice calculation
  const totalPrice = selectedOffer ? selectedOffer.offerPrice * quantity : 0

  // Update the handleOfferClick function
  const handleOfferClick = () => {
    setCurrentStep("offer")
  }

  const handleProceedToCheckout = () => {
    setCurrentStep("checkout")
  }

  const handleProceedToPayment = () => {
    if (customerInfo.name && customerInfo.phone && customerInfo.address) {
      setCurrentStep("payment")
    }
  }

  const handlePayment = () => {
    if (paymentMethod === "cash") {
      setCurrentStep("success")
    } else {
      setCurrentStep("otp")
    }
  }

  const handleOtpVerification = () => {
    if (otpCode.length === 4) {
      setCurrentStep("success")
    }
  }

  const closeDialog = () => {
    setCurrentStep("hero")
    // Reset form data
    setQuantity(1)
    setCustomerInfo({ name: "", phone: "", address: "", city: "" })
    setOtpCode("")
    setCardInfo({ number: "", expiry: "", cvv: "", name: "" })
    setSelectedOffer(null)
  }

  // Add new function to handle offer selection
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
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
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
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/placeholder.svg?height=600&width=500"
                  alt="عرض اللحوم المميزة"
                  className="w-full h-auto py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-lg p-4 shadow-xl animate-bounce">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-800">متوفر الآن</span>
                  </div>
                </div>

                <Button
                  onClick={handleOfferClick}
                  className="w-full my-2 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold"
                >
                  احصل على العرض
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
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  offer.popular ? "ring-2 ring-yellow-400 relative" : ""
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

                    <div className="space-y-1 mb-4">
                      {offer.items.map((item, index) => (
                        <div key={index} className="flex items-center text-sm text-right">
                          <span className="text-green-500 ml-2">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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

            <div>
              <Label htmlFor="city">المدينة</Label>
              <Input
                id="city"
                value={customerInfo.city}
                onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                placeholder="مسقط، صلالة، نزوى..."
              />
            </div>

            <Separator />

            {/* Update the order summary section in the Checkout Dialog */}
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
                  <div className="text-xs text-gray-600 mb-2">{selectedOffer.items.join(" • ")}</div>
                </>
              )}
              <div className="flex justify-between">
                <span>رسوم التوصيل</span>
                <span className="text-green-600">مجاناً</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>المجموع</span>
                <span>{totalPrice} ر.ع</span>
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

      {/* Payment Dialog */}
      <Dialog open={currentStep === "payment"} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg mx-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">طريقة الدفع</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer transition-all ${paymentMethod === "card" ? "ring-2 ring-green-500" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                <CardContent className="p-4 text-center">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="font-semibold">بطاقة ائتمان</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${paymentMethod === "cash" ? "ring-2 ring-green-500" : ""}`}
                onClick={() => setPaymentMethod("cash")}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 mx-auto mb-2 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">$</span>
                  </div>
                  <p className="font-semibold">الدفع عند التسليم</p>
                </CardContent>
              </Card>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">رقم البطاقة</Label>
                  <Input
                    id="cardNumber"
                    value={cardInfo.number}
                    onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">تاريخ الانتهاء</Label>
                    <Input
                      id="expiry"
                      value={cardInfo.expiry}
                      onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={cardInfo.cvv}
                      onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                      placeholder="123"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardName">اسم حامل البطاقة</Label>
                  <Input
                    id="cardName"
                    value={cardInfo.name}
                    onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                    placeholder="الاسم كما يظهر على البطاقة"
                  />
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between font-bold text-lg">
                <span>المبلغ المطلوب دفعه</span>
                <span>{totalPrice} ر.ع</span>
              </div>
            </div>

            <Button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700 text-lg py-3">
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
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="0000"
                className="text-center text-2xl tracking-widest"
                maxLength={4}
              />
            </div>

            <Button
              onClick={handleOtpVerification}
              disabled={otpCode.length !== 4}
              className="w-full bg-green-600 hover:bg-green-700"
            >
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
              {/* Update the success dialog content */}
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
