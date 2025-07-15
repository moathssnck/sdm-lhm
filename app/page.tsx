import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { OffersSection } from "@/components/offers-section"
import { ProductCategories } from "@/components/product-categories"
import { FeaturedProducts } from "@/components/featured-products"
import { Testimonials } from "@/components/testimonials"
import { Features } from "@/components/features"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Header />
      <main>
        <HeroSection />
        <OffersSection />
        <ProductCategories />
        <FeaturedProducts />
        <Features />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
