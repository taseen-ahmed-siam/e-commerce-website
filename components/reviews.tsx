"use client"

import type { Review } from "@/lib/products"
import { StarRating } from "@/components/star-rating"
import { motion } from "framer-motion"

type Props = {
  reviews: Review[]
}

export function Reviews({ reviews }: Props) {
  const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  return (
    <section className="border-t border-border pt-12 lg:pt-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-accent mb-2">Customer Reviews</div>
          <h2 className="font-serif text-3xl md:text-4xl">What our customers say</h2>
        </div>
        <div className="flex items-center gap-3">
          <StarRating rating={Math.round(avg)} size="md" />
          <span className="text-sm text-muted-foreground">
            {avg.toFixed(1)} average · {reviews.length} reviews
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-card border border-border p-6 rounded-sm"
          >
            <StarRating rating={review.rating} />
            <h3 className="font-medium mt-3 mb-2">{review.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{review.body}</p>
            <div className="text-xs text-muted-foreground border-t border-border pt-3">
              <span className="font-medium text-foreground">{review.author}</span>
              <span> · {review.location} · {review.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
