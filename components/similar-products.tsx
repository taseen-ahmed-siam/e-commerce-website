"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/products"

type Props = {
  products: Product[]
}

export function SimilarProducts({ products }: Props) {
  return (
    <section className="border-t border-border pt-12 lg:pt-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-accent mb-2">You may also like</div>
          <h2 className="font-serif text-3xl md:text-4xl">Pieces that pair well</h2>
        </div>
      </div>
      <div className="-mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 md:gap-6 min-w-max pb-2">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/product/${p.slug}`}
              className="group block w-[220px] sm:w-[260px] md:w-[280px] flex-shrink-0"
            >
              <div className="relative aspect-square bg-card rounded-sm overflow-hidden mb-3">
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="280px"
                />
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {p.category}
              </div>
              <div className="font-medium leading-tight group-hover:text-accent transition-colors">
                {p.name}
              </div>
              <div className="font-serif text-lg mt-1">${p.price}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
