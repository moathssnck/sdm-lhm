import Link from "next/link"
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">م</span>
              </div>
              <span className="text-xl font-bold">مواشي</span>
            </div>
            <p className="text-gray-400 mb-4">نقدم أجود أنواع اللحوم الطازجة والمضمونة الجودة لعملائنا الكرام</p>
            <div className="flex space-x-4 space-x-reverse">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">الأقسام</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=lamb" className="text-gray-400 hover:text-white">
                  لحوم الأغنام
                </Link>
              </li>
              <li>
                <Link href="/products?category=beef" className="text-gray-400 hover:text-white">
                  لحم بقري
                </Link>
              </li>
              <li>
                <Link href="/products?category=chicken" className="text-gray-400 hover:text-white">
                  دجاج
                </Link>
              </li>
              <li>
                <Link href="/products?category=fish" className="text-gray-400 hover:text-white">
                  أسماك
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone className="w-5 h-5 text-green-600" />
                <span className="text-gray-400">+966123456789</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail className="w-5 h-5 text-green-600" />
                <span className="text-gray-400">info@mawashi.com</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <MapPin className="w-5 h-5 text-green-600" />
                <span className="text-gray-400">الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2024 مواشي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
