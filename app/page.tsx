import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { ProductGrid } from "@/components/product-grid"
import { AboutStrip } from "@/components/about-strip"
import { products } from "@/lib/products"

export default function HomePage() {
  const bestSellers = products.filter((p) => p.collection === "best-sellers")
  const newArrivals = products.filter((p) => p.collection === "new-arrivals")

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductGrid
          id="best-sellers"
          eyebrow="Best Sellers"
          title="The pieces our customers can't stop talking about."
          description="A short collection of our most loved studio releases — quietly enduring, made in small batches."
          products={bestSellers}
        />
        <AboutStrip />
        <ProductGrid
          id="new-arrivals"
          eyebrow="New Arrivals"
          title="New to the studio."
          description="Recently added to the catalogue. Subject to small batch availability."
          products={newArrivals}
        />
      </main>
      <Footer />
    </>
  )
}
