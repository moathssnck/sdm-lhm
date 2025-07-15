import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Star, Truck, Shield, Clock } from "lucide-react"
import React from "react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-green-900 via-green-800 to-green-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 bg-black/20">
        <video
        autoPlay
        muted
        loop
          className="w-full h-full object-cover opacity-50"
        >
          <source  src="8477206-hd_1080_1920_24fps.mp4" />
        </video>
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
                src="/صورة واتساب بتاريخ 1447-01-20 في 07.29.55_9c8096a0.jpg"
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

           <Button className="w-full my-2  bg-gradient-to-r from-yellow-400 to-orange-400 ">
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
  )
}
