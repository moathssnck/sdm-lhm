"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Eye } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/hooks/use-toast"

const featuredProducts = [
  {
    id: "featured-1",
    name: "لحم غنم مقطع فاخر",
    price: 45,
    originalPrice: 60,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviews: 156,
    badge: "الأكثر مبيعاً",
    badgeColor: "bg-green-500",
    description: "قطع لحم غنم فاخرة مقطعة بعناية",
  },
  {
    id: "featured-2",
    name: "لحم بقري أنجوس",
    price: 55,
    originalPrice: 70,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 89,
    badge: "مميز",
    badgeColor: "bg-purple-500",
    description: "لحم بقري أنجوس عالي الجودة",
  },
  {
    id: "featured-3",
    name: "دجاج بلدي طازج",
    price: 28,
    originalPrice: 35,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 234,
    badge: "طازج اليوم",
    badgeColor: "bg-blue-500",
    description: "دجاج بلدي طازج من المزرعة",
  },
  {
    id: "featured-4",
    name: "سمك هامور طازج",
    price: 65,
    originalPrice: 80,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviews: 67,
    badge: "من البحر",
    badgeColor: "bg-cyan-500",
    description: "سمك هامور طازج من الخليج",
  },
]

export function FeaturedProducts() {
  const { addItem } = useCart()
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  const handleAddToCart = (product: (typeof featuredProducts)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    toast({
      title: "تم إضافة المنتج",
      description: `تم إضافة ${product.name} إلى السلة`,
    })
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-semibold mb-4">منتجات مختارة</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">المنتجات المميزة</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اكتشف مجموعتنا المختارة بعناية من أجود أنواع اللحوم الطازجة والمنتجات عالية الجودة
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div
                    className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                      hoveredProduct === product.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center space-x-4 space-x-reverse">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white transform hover:scale-110 transition-all duration-200"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white transform hover:scale-110 transition-all duration-200"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Link href={`/products/${product.id}`}>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="bg-white/90 hover:bg-white transform hover:scale-110 transition-all duration-200"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Badge */}
                  <Badge
                    className={`absolute top-3 right-3 ${product.badgeColor} text-white px-3 py-1 text-xs font-bold`}
                  >
                    {product.badge}
                  </Badge>

                  {/* Discount Badge */}
                  {product.originalPrice && (
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>

                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{product.description}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 mr-2">
                      {product.rating} ({product.reviews} تقييم)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-2xl font-bold text-green-600">{product.price} ر.س</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">{product.originalPrice} ر.س</span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    <ShoppingCart className="w-4 h-4 ml-2" />
                    أضف للسلة
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transform hover:scale-105 transition-all duration-200 bg-transparent"
            >
              عرض جميع المنتجات
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
