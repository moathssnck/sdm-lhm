import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

const categories = [
  {
    id: "lamb",
    name: "لحوم الأغنام",
    description: "لحم غنم طازج ومضمون الجودة",
    image: "/",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    count: "25+ منتج",
  },
  {
    id: "beef",
    name: "لحم بقري",
    description: "لحم بقري طازج عالي الجودة",
    image: "/",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    count: "30+ منتج",
  },
  {
    id: "chicken",
    name: "دجاج",
    description: "دجاج طازج ومنتقى بعناية",
    image: "/",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50",
    count: "20+ منتج",
  },
  {
    id: "fish",
    name: "أسماك البحر",
    description: "أسماك طازجة من البحر مباشرة",
    image: "/",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    count: "15+ منتج",
  },
  {
    id: "mixed",
    name: "مشكل لحوم",
    description: "تشكيلة متنوعة من اللحوم",
    image: "/",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    count: "12+ منتج",
  },
  {
    id: "spices",
    name: "بهارات",
    description: "بهارات طبيعية عالية الجودة",
    image: "/",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    count: "40+ منتج",
  },
]

export function ProductCategories() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-semibold mb-4">تصفح الأقسام</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">أقسام المنتجات</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اختر من تشكيلتنا الواسعة من اللحوم الطازجة والمنتجات عالية الجودة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`}>
              <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 shadow-lg overflow-hidden transform hover:-translate-y-2">
                <CardContent className="p-0 relative">
                  <div className="relative overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Category Badge */}
                    <Badge className="absolute top-4 right-4 bg-white/90 text-gray-800 backdrop-blur-sm">
                      {category.count}
                    </Badge>

                    {/* Hover Arrow */}
                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <ArrowLeft className="w-5 h-5 text-gray-800" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div
                      className={`w-12 h-1 bg-gradient-to-r ${category.color} rounded-full mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                    ></div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{category.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
