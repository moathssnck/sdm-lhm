import { Truck, Shield, Clock, Phone, Award, Leaf } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Truck,
    title: "توصيل سريع",
    description: "توصيل في نفس اليوم لجميع أنحاء المدينة",
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Shield,
    title: "جودة مضمونة",
    description: "جميع منتجاتنا مفحوصة ومضمونة الجودة",
    color: "bg-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: Clock,
    title: "خدمة 24/7",
    description: "نحن في خدمتكم على مدار الساعة",
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    icon: Phone,
    title: "دعم فني",
    description: "فريق دعم متخصص لمساعدتكم",
    color: "bg-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    icon: Award,
    title: "جوائز الجودة",
    description: "حاصلون على شهادات الجودة العالمية",
    color: "bg-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    icon: Leaf,
    title: "طبيعي 100%",
    description: "منتجات طبيعية خالية من المواد الحافظة",
    color: "bg-emerald-500",
    bgColor: "bg-emerald-50",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">لماذا تختارنا؟</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نحن نقدم أفضل الخدمات والمنتجات عالية الجودة مع ضمان رضا العملاء
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
            >
              <CardContent className="p-8 text-center">
                <div
                  className={`w-20 h-20 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-10 h-10 ${feature.color.replace("bg-", "text-")}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
