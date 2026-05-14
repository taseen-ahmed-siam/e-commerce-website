import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/product-detail"
import { Reviews } from "@/components/reviews"
import { ProductFaqs } from "@/components/product-faqs"
import { SimilarProducts } from "@/components/similar-products"
import { getProduct, getRelatedProducts, products } from "@/lib/products"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return {}
  return {
    title: `${product.name} — Atelier Nori`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const related = getRelatedProducts(slug)

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-6 lg:mb-10" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span>{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <ProductDetail product={product} />

        <div className="mt-16 lg:mt-24 space-y-16 lg:space-y-24">
          <Reviews reviews={product.reviews} />
          <ProductFaqs faqs={product.faqs} />
          <SimilarProducts products={related} />
        </div>
      </main>
      <Footer />
    </>
  )
}
