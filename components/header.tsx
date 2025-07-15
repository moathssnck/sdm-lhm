"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Menu, X, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">م</span>
            </div>
            <span className="text-xl font-bold text-green-600">مواشي</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
              الرئيسية
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-green-600 transition-colors">
              المنتجات
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">
              من نحن
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">
              اتصل بنا
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
                الرئيسية
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-green-600 transition-colors">
                المنتجات
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">
                من نحن
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">
                اتصل بنا
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
