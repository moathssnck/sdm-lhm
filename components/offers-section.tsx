"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Flame, ArrowLeft, ArrowRight, ShoppingCart, Plus } from "lucide-react"

const offers = [
  {
    id: 1,
    title: "عرض نهاية الأسبوع",
    description: "خصم 30% على جميع أنواع اللحوم الطازجة",
    discount: "30%",
    originalPrice: 20,
    salePrice: 15,
    image: "  صورة واتساب بتاريخ 1447-01-20 في 06.34.48_io3300fe50.jpg",
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    category: "لحوم طازجة",
    isHot: true,
  },
  {
    id: 2,
    title: "باقة العائلة المميزة",
    description: "تشكيلة متنوعة من اللحوم تكفي لـ 6 أشخاص",
    discount: "25%",
    originalPrice: 20,
    salePrice: 15,
    image: "/صورة واتساب بتاريخ 1447-01-20 في 06.35.35_f3af146c.jpg",
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    category: "باقات العائلة",
    isHot: false,
  },
  {
    id: 3,
    title: "عرض الشواء الخاص",
    description: "أفضل قطع اللحم للشواء مع البهارات مجاناً",
    discount: "40%",
    originalPrice: 20,
    salePrice: 14.9,
    image: "/صورة واتساب بتاريخ 1447-01-20 في 07.51.02_52e67430.jpg",
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    category: "شواء",
    isHot: true,
  },
]


export function OffersSection() {
  const [currentOffer, setCurrentOffer] = useState(0)
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: { [key: number]: string } = {}

      offers.forEach((offer) => {
        const now = new Date().getTime()
        const endTime = offer.endTime.getTime()
        const difference = endTime - now

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)

          newTimeLeft[offer.id] = `${days}د ${hours}س ${minutes}ق ${seconds}ث`
        } else {
          newTimeLeft[offer.id] = "انتهى العرض"
        }
      })

      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const nextOffer = () => {
    setCurrentOffer((prev) => (prev + 1) % offers.length)
  }

  const prevOffer = () => {
    setCurrentOffer((prev) => (prev - 1 + offers.length) % offers.length)
  }

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-32 h-32 bg-red-500 rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-500 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-500 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 space-x-reverse mb-4">
            <Flame className="w-8 h-8 text-red-500 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              عروض حصرية
            </h2>
            <Flame className="w-8 h-8 text-red-500 animate-pulse" />
          </div>
          <p className="text-xl text-gray-600">لا تفوت هذه الفرصة الذهبية للحصول على أجود اللحوم بأسعار مميزة</p>
        </div>

        {/* Main Offer Carousel */}
        <div className="relative mb-12">
          <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-r from-white to-gray-50">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image Section */}
                <div className="relative h-80 lg:h-96">
                  <img
                    src={offers[currentOffer].image || "/placeholder.svg"}
                    alt={offers[currentOffer].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                  {offers[currentOffer].isHot && (
                    <Badge className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-sm font-bold animate-bounce">
                      🔥 عرض ساخن
                    </Badge>
                  )}

                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <Badge variant="secondary" className="text-xs">
                      {offers[currentOffer].category}
                    </Badge>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="mb-6">
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{offers[currentOffer].title}</h3>
                    <p className="text-lg text-gray-600 mb-6">{offers[currentOffer].description}</p>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-center space-x-4 space-x-reverse mb-6">
                    <div className="text-4xl font-bold text-green-600">{offers[currentOffer].salePrice} ر.س</div>
                    <div className="text-2xl text-gray-500 line-through">{offers[currentOffer].originalPrice} ر.س</div>
                    <Badge className="bg-red-500 text-white text-lg px-3 py-1">
                      خصم {offers[currentOffer].discount}
                    </Badge>
                  </div>

                  {/* Countdown Timer */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <Clock className="w-5 h-5 text-red-600" />
                      <span className="text-red-600 font-semibold">ينتهي العرض خلال:</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600 font-mono">
                      {timeLeft[offers[currentOffer].id] || "جاري التحميل..."}
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    اطلب الآن واستفد من العرض
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 right-4 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
            onClick={prevOffer}
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 left-4 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
            onClick={nextOffer}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 space-x-reverse mt-6">
            {offers.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentOffer ? "bg-red-500 w-8" : "bg-gray-300"
                }`}
                onClick={() => setCurrentOffer(index)}
              />
            ))}
          </div>
        </div>

        {/* Quick Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <Card
              key={offer.id}
              className={`group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 ${
                index === currentOffer ? "ring-2 ring-red-500 shadow-lg" : ""
              }`}
              onClick={() => setCurrentOffer(index)}
            >
              <CardContent className="p-0">
                <div className="relative h-48">
                  <img
                    src={offer.image || "/placeholder.svg"}
                    alt={offer.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg"></div>

                  <Badge className="absolute top-3 right-3 bg-red-500 text-white">-{offer.discount}</Badge>

                  <div className="absolute bottom-3 right-3 left-3 text-white">
                    <h4 className="font-bold text-lg mb-1">{offer.title}</h4>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-xl font-bold">{offer.salePrice} ر.س</span>
                      <span className="text-sm line-through opacity-75">{offer.originalPrice} ر.س</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600 font-medium">
                        {timeLeft[offer.id]?.split(" ").slice(0, 2).join(" ") || "جاري التحميل..."}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="group-hover:bg-red-500 group-hover:text-white transition-colors bg-transparent"
                    >
                      اطلب الآن
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link href="/products">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-4 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              تصفح جميع العروض
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
