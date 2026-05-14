import type { Product } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

type Props = {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  products: Product[]
}

export function ProductGrid({ id, eyebrow, title, description, products }: Props) {
  return (
    <section id={id} className="container mx-auto px-4 sm:px-6 py-16 lg:py-24">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
        <div className="max-w-2xl">
          {eyebrow && (
            <div className="text-xs uppercase tracking-[0.2em] text-accent mb-2">{eyebrow}</div>
          )}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-balance">{title}</h2>
          {description && (
            <p className="mt-3 text-muted-foreground leading-relaxed text-pretty">{description}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} />
        ))}
      </div>
    </section>
  )
}
