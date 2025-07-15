"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "أحمد محمد",
    location: "الرياض",
    rating: 5,
    comment: "جودة ممتازة وخدمة رائعة، أنصح بالتعامل معهم. اللحوم طازجة والتوصيل سريع جداً",
    avatar: "/placeholder.svg?height=60&width=60",
    date: "منذ أسبوع",
  },
  {
    id: 2,
    name: "فاطمة علي",
    location: "جدة",
    rating: 5,
    comment: "اللحوم طازجة والأسعار مناسبة جداً. خدمة العملاء ممتازة ويردون على الاستفسارات بسرعة",
    avatar: "/placeholder.svg?height=60&width=60",
    date: "منذ 3 أيام",
  },
  {
    id: 3,
    name: "محمد حسن",
    location: "الدمام",
    rating: 5,
    comment: "سرعة في التوصيل وجودة عالية. أطلب منهم باستمرار ولم أواجه أي مشكلة",
    avatar: "/placeholder.svg?height=60&width=60",
    date: "منذ يومين",
  },
  {
    id: 4,
    name: "سارة أحمد",
    location: "مكة",
    rating: 5,
    comment: "أفضل متجر لحوم تعاملت معه. المنتجات طازجة والأسعار تنافسية والخدمة ممتازة",
    avatar: "/placeholder.svg?height=60&width=60",
    date: "منذ 5 أيام",
  },
  {
    id: 5,
    name: "عبدالله سالم",
    location: "المدينة",
    rating: 5,
    comment: "تجربة رائعة من البداية للنهاية. التطبيق سهل الاستخدام والتوصيل في الوقت المحدد",
    avatar: "/placeholder.svg?height=60&width=60",
    date: "منذ أسبوعين",
  },
  {
    id: 6,
    name: "نورا خالد",
    location: "الطائف",
    rating: 5,
    comment: "جودة اللحوم ممتازة وطعمها رائع. العائلة كلها راضية عن المنتجات",
    avatar: "/placeholder.svg?height=60&width=60",
    date: "منذ 4 أيام",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 3))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getVisibleTestimonials = () => {
    const start = currentIndex * 3
    return testimonials.slice(start, start + 3)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">آراء عملائنا</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ماذا يقول عملاؤنا الكرام عن تجربتهم معنا وجودة منتجاتنا وخدماتنا
          </p>

          {/* Overall Rating */}
          <div className="flex items-center justify-center space-x-2 space-x-reverse mt-8">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900">4.9</span>
            <span className="text-gray-600">من أصل 5 (1,250+ تقييم)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {getVisibleTestimonials().map((testimonial) => (
            <Card
              key={testimonial.id}
              className="group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
            >
              <CardContent className="p-8 relative">
                {/* Quote Icon */}
                <Quote className="absolute top-4 right-4 w-8 h-8 text-green-200 transform rotate-180" />

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.comment}"</p>

                {/* Customer Info */}
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback className="bg-green-100 text-green-600 font-semibold">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.location} • {testimonial.date}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 space-x-reverse">
          {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex ? "bg-green-500 w-8" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
