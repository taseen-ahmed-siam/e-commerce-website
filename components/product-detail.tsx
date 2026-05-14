"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Truck, RotateCcw, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import type { Product } from "@/lib/products"
import { ProductGallery } from "@/components/product-gallery"
import { VariantSelector } from "@/components/variant-selector"
import { QuantitySelector } from "@/components/quantity-selector"
import { StarRating } from "@/components/star-rating"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-context"

type Props = {
  product: Product
}

export function ProductDetail({ product }: Props) {
  const router = useRouter()
  const { add } = useCart()

  const initialVariants = useMemo(() => {
    const obj: Record<string, string> = {}
    product.variants.forEach((v) => {
      obj[v.name] = v.options[0]
    })
    return obj
  }, [product])

  const [selected, setSelected] = useState<Record<string, string>>(initialVariants)
  const [quantity, setQuantity] = useState(1)

  const avgRating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const handleAddToCart = () => {
    add({
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity,
      variants: selected,
    })
    toast.success(`Added ${quantity} × ${product.name} to your cart`)
  }

  const handleBuyNow = () => {
    const params = new URLSearchParams({
      slug: product.slug,
      qty: String(quantity),
      ...selected,
    })
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      <ProductGallery images={product.images} alt={product.name} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 lg:sticky lg:top-24 lg:self-start"
      >
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-accent mb-2">{product.category}</div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.05] text-balance">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-sm text-muted-foreground">
              {avgRating.toFixed(1)} · {product.reviews.length} reviews
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-serif text-3xl">${product.price}</span>
          {product.compareAtPrice && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                ${product.compareAtPrice}
              </span>
              <Badge className="bg-accent text-accent-foreground">{discount}% off</Badge>
            </>
          )}
        </div>

        <p className="text-muted-foreground leading-relaxed text-pretty">{product.description}</p>

        <div className="border-t border-b border-border py-6 space-y-6">
          <VariantSelector variants={product.variants} selected={selected} onChange={setSelected} />

          <div>
            <div className="text-sm font-medium uppercase tracking-wide mb-2">Quantity</div>
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button size="lg" variant="outline" className="h-12 text-base" onClick={handleAddToCart}>
            Add to Cart
          </Button>
          <Button size="lg" className="h-12 text-base bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleBuyNow}>
            Buy Now
          </Button>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <li className="flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="w-4 h-4 text-accent" /> Free worldwide shipping
          </li>
          <li className="flex items-center gap-2 text-xs text-muted-foreground">
            <RotateCcw className="w-4 h-4 text-accent" /> 30-day returns
          </li>
          <li className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-accent" /> Studio guarantee
          </li>
        </ul>

        <div className="pt-4">
          <h3 className="text-sm font-medium uppercase tracking-wide mb-3">Details</h3>
          <ul className="space-y-2">
            {product.details.map((d) => (
              <li key={d} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-accent">—</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  )
}
