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
            src="/images/lifestyle-1.png"
            alt="Gaming setup"
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
          <div className="text-xs uppercase tracking-[0.2em] text-accent mb-4">Premium Collection</div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-balance leading-tight mb-6">
            High-Performance Gaming & Tech Gadgets.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4 text-pretty">
            Techzo curates the finest gaming peripherals and tech gadgets from leading manufacturers worldwide. Each product is hand-selected for superior performance, build quality, and competitive advantage.
          </p>
          <p className="text-muted-foreground leading-relaxed text-pretty">
            From esports-grade peripherals to premium lifestyle tech, every item in our collection is tested and trusted by competitive gamers and tech enthusiasts globally.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
