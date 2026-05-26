"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function AboutStrip() {
  return (
    <section id="about" className="container mx-auto px-4 sm:px-6 py-16 lg:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative aspect-[4/5] rounded-sm overflow-hidden bg-card order-2 md:order-1"
        >
          <Image
            src="/images/lifestyle-1.jpg"
            alt="Techzo studio"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="order-1 md:order-2"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-accent mb-4">From the studio</div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-balance leading-tight mb-6">
            A small studio with a slow, considered approach.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4 text-pretty">
            Techzo was founded on a simple belief — that the objects we live with every day deserve
            the same care as the rooms we build around them. We work with a tight roster of independent
            makers in Portugal, Denmark and Japan to produce small batches of quietly extraordinary
            things.
          </p>
          <p className="text-muted-foreground leading-relaxed text-pretty">
            Every piece is shipped in recyclable packaging and accompanied by a hand-signed note of care.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
