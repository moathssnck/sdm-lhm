"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Gift, Bell, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setIsSubscribed(true)

    toast({
      title: "تم الاشتراك بنجاح!",
      description: "ستصلك أحدث العروض والمنتجات الجديدة",
    })
  }

  if (isSubscribed) {
    return (
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center border-0 shadow-2xl">
            <CardContent className="p-12">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4">مرحباً بك في عائلة ذبيحتي!</h3>
              <p className="text-lg text-gray-600 mb-6">
                تم تأكيد اشتراكك بنجاح. ستصلك أحدث العروض والمنتجات الجديدة على بريدك الإلكتروني
              </p>
              <Badge className="bg-green-100 text-green-800 px-4 py-2">✨ مرحباً بك معنا</Badge>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <Card className="max-w-4xl mx-auto border-0 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Content Side */}
              <div className="p-12 bg-gradient-to-br from-white to-gray-50">
                <div className="mb-8">
                  <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-semibold mb-4">اشترك الآن</Badge>
                  <h3 className="text-4xl font-bold text-gray-900 mb-4">احصل على أحدث العروض</h3>
                  <p className="text-lg text-gray-600 mb-6">
                    اشترك في نشرتنا البريدية واحصل على خصم 15% على طلبك الأول بالإضافة إلى أحدث العروض والمنتجات الجديدة
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Gift className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">خصم 15% على الطلب الأول</span>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Bell className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">إشعارات العروض الحصرية</span>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">أحدث المنتجات والوصفات</span>
                  </div>
                </div>

                {/* Subscription Form */}
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="flex space-x-3 space-x-reverse">
                    <Input
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 h-12 text-lg border-2 border-gray-200 focus:border-green-500"
                      required
                    />
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      {isLoading ? "جاري الاشتراك..." : "اشترك الآن"}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">بالاشتراك، أنت توافق على سياسة الخصوصية وشروط الاستخدام</p>
                </form>
              </div>

              {/* Visual Side */}
              <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-12 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <Mail className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">انضم إلى 10,000+ عميل</h4>
                  <p className="text-lg opacity-90 mb-6">يثقون بنا ويحصلون على أفضل العروض والمنتجات الطازجة</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">10K+</div>
                      <div className="text-sm opacity-75">مشترك</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">50+</div>
                      <div className="text-sm opacity-75">عرض شهرياً</div>
                    </div>
                  </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
