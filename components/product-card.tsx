"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { Product } from "@/lib/products"
import { Badge } from "@/components/ui/badge"

type Props = {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: Props) {
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-square bg-card rounded-sm overflow-hidden mb-3">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {discount > 0 && (
            <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
              {discount}% off
            </Badge>
          )}
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {product.category}
          </div>
          <h3 className="font-medium leading-tight group-hover:text-accent transition-colors mb-2">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg">${product.price}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.compareAtPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
