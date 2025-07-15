"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"

// Mock products data
const products = [
  {
    id: "1",
    name: "لحم غنم مقطع",
    price: 45,
    originalPrice: 50,
    image: "/placeholder.svg?height=300&width=300",
    category: "lamb",
    rating: 4.8,
    reviews: 24,
    inStock: true,
    description: "لحم غنم طازج مقطع قطع متوسطة",
  },
  {
    id: "2",
    name: "لحم بقري مفروم",
    price: 35,
    originalPrice: 40,
    image: "/placeholder.svg?height=300&width=300",
    category: "beef",
    rating: 4.6,
    reviews: 18,
    inStock: true,
    description: "لحم بقري مفروم طازج عالي الجودة",
  },
  {
    id: "3",
    name: "دجاج كامل",
    price: 25,
    originalPrice: 30,
    image: "/placeholder.svg?height=300&width=300",
    category: "chicken",
    rating: 4.9,
    reviews: 32,
    inStock: true,
    description: "دجاج كامل طازج منتقى بعناية",
  },
  {
    id: "4",
    name: "سمك هامور",
    price: 60,
    originalPrice: 65,
    image: "/placeholder.svg?height=300&width=300",
    category: "fish",
    rating: 4.7,
    reviews: 15,
    inStock: true,
    description: "سمك هامور طازج من الخليج العربي",
  },
  {
    id: "5",
    name: "مشكل لحوم للشواء",
    price: 80,
    originalPrice: 90,
    image: "/placeholder.svg?height=300&width=300",
    category: "mixed",
    rating: 4.8,
    reviews: 28,
    inStock: true,
    description: "تشكيلة متنوعة من اللحوم للشواء",
  },
  {
    id: "6",
    name: "بهارات مشكلة",
    price: 15,
    originalPrice: 20,
    image: "/placeholder.svg?height=300&width=300",
    category: "spices",
    rating: 4.5,
    reviews: 12,
    inStock: true,
    description: "خلطة بهارات طبيعية للحوم",
  },
]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("name")

  useEffect(() => {
    const category = searchParams.get("category")
    if (category) {
      setSelectedCategory(category)
    }
  }, [searchParams])

  useEffect(() => {
    let filtered = products

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name, "ar")
      }
    })

    setFilteredProducts(filtered)
  }, [selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64">
            <ProductFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">المنتجات</h1>
                <p className="text-gray-600">عرض {filteredProducts.length} منتج</p>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">لا توجد منتجات متاحة</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
