"use client"

import Link from "next/link"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  description: string
}

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
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

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="flex">
            <div className="relative w-48 h-48">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover rounded-r-lg"
              />
              {discount > 0 && <Badge className="absolute top-2 right-2 bg-red-500">-{discount}%</Badge>}
            </div>
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-2">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-green-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              <p className="text-gray-600 mb-3">{product.description}</p>

              <div className="flex items-center mb-3">
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
                <span className="text-sm text-gray-500 mr-2">({product.reviews} تقييم)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-2xl font-bold text-green-600">{product.price} ر.س</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">{product.originalPrice} ر.س</span>
                  )}
                </div>

                <Button onClick={handleAddToCart} disabled={!product.inStock}>
                  <ShoppingCart className="w-4 h-4 ml-2" />
                  أضف للسلة
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {discount > 0 && <Badge className="absolute top-2 right-2 bg-red-500">-{discount}%</Badge>}
          <Button variant="ghost" size="icon" className="absolute top-2 left-2 bg-white/80 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-gray-600 text-sm mb-3">{product.description}</p>

          <div className="flex items-center mb-3">
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
            <span className="text-sm text-gray-500 mr-2">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-xl font-bold text-green-600">{product.price} ر.س</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">{product.originalPrice} ر.س</span>
              )}
            </div>
          </div>

          <Button onClick={handleAddToCart} className="w-full" disabled={!product.inStock}>
            <ShoppingCart className="w-4 h-4 ml-2" />
            أضف للسلة
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
